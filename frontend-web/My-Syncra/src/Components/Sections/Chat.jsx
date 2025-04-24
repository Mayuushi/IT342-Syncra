import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import authService from '../../Service/authService';
import '../Chat.css';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentRecipient, setCurrentRecipient] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const stompClient = useRef(null);
  const currentRecipientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const stompSubscription = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup WebSocket connection - this is a critical function
  const setupWebSocketConnection = (user) => {
    if (!user?.email) return;
    
    // Disconnect any existing connection
    if (stompClient.current?.connected) {
      console.log('Disconnecting existing WebSocket connection');
      stompClient.current.deactivate();
    }
    
    console.log('Setting up new WebSocket connection for user:', user.email);
    
    // Create new socket with forced reconnect parameter to avoid caching
    const socket = new SockJS(
      `https://it342-syncra.onrender.com/ws?email=${encodeURIComponent(user.email)}&t=${new Date().getTime()}`
    );
    
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function(str) {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });
    
    // Set up event handlers
    client.onConnect = function() {
      console.log('✅ WebSocket connected successfully for', user.email);
      setConnectionStatus('Connected');
      
      // Unsubscribe from any existing subscription
      if (stompSubscription.current) {
        try {
          console.log('Unsubscribing from previous subscription');
          stompSubscription.current.unsubscribe();
        } catch (e) {
          console.error('Error unsubscribing:', e);
        }
      }
      
      // Subscribe to personal queue
      console.log('Subscribing to:', `/user/${user.email}/queue/messages`);
      
      stompSubscription.current = client.subscribe(
        `/user/${user.email}/queue/messages`,
        function(messageOutput) {
          console.log('📩 Received message:', messageOutput.body);
          
          try {
            const receivedMsg = JSON.parse(messageOutput.body);
            console.log('Parsed message data:', receivedMsg);
            
            // Force re-render by creating a new message object
            const newMsg = {
              from: 'them',
              text: receivedMsg.content,
              timestamp: receivedMsg.timestamp || new Date().toISOString()
            };
            
            // Update messages based on current recipient
            console.log('Current recipient:', currentRecipientRef.current);
            console.log('Message sender:', receivedMsg.senderEmail);
            
            if (receivedMsg.senderEmail === currentRecipientRef.current) {
              console.log('Adding message to current conversation');
              setMessages(prevMessages => [...prevMessages, newMsg]);
            } else {
              console.log('Updating unread count for:', receivedMsg.senderEmail);
              setUnreadMessages(prev => ({
                ...prev,
                [receivedMsg.senderEmail]: (prev[receivedMsg.senderEmail] || 0) + 1
              }));
            }
          } catch (error) {
            console.error('Error handling received message:', error);
          }
        }
      );
      
      console.log('✅ Subscription established');
    };
    
    client.onStompError = function(frame) {
      console.error('STOMP error:', frame.headers.message);
      setConnectionStatus('Error: ' + frame.headers.message);
    };
    
    client.onWebSocketClose = function(event) {
      console.log('WebSocket connection closed', event);
      setConnectionStatus('Disconnected');
    };
    
    // Store client reference and activate connection
    stompClient.current = client;
    client.activate();
    
    return () => {
      console.log('Cleaning up WebSocket connection');
      if (client.connected) {
        if (stompSubscription.current) {
          try {
            stompSubscription.current.unsubscribe();
          } catch (e) {
            console.error('Error unsubscribing on cleanup:', e);
          }
        }
        client.deactivate();
      }
    };
  };

  // Connect WebSocket when user is available
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.email) {
      console.log('User authenticated:', user.email);
      setCurrentUser(user);
      
      // Setup WebSocket connection
      const cleanup = setupWebSocketConnection(user);
      
      return cleanup;
    }
  }, []);

  // Keep the ref updated with the latest value
  useEffect(() => {
    console.log('Current recipient changed to:', currentRecipient);
    currentRecipientRef.current = currentRecipient;
  }, [currentRecipient]);

  const loadUsers = async () => {
    try {
      console.log('Loading users...');
      const users = await authService.getUsers();
      const filtered = users.filter(u => u.email.trim() !== currentUser?.email.trim());
      console.log('Loaded users:', filtered);
      setUsers(filtered);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      loadUsers();
    }
  }, [currentUser]);

  const handleSend = () => {
    if (!message.trim() || !currentRecipient) return;
    
    if (!stompClient.current?.connected) {
      console.error('WebSocket not connected!');
      alert('Connection issue. Please try reconnecting.');
      return;
    }
    
    console.log('Sending message to:', currentRecipient);
    
    const newMessage = {
      senderEmail: currentUser.email,
      receiverEmail: currentRecipient,
      content: message,
      timestamp: new Date().toISOString()
    };
    
    console.log('📤 Sending message:', newMessage);
    
    // Add to our display immediately for better UX
    setMessages(prevMessages => [
      ...prevMessages, 
      { from: 'me', text: message, timestamp: newMessage.timestamp }
    ]);
    
    // Clear input field
    setMessage('');
    
    // Send via WebSocket
    try {
      stompClient.current.publish({
        destination: '/app/chat',
        body: JSON.stringify(newMessage),
        headers: { 'sender-email': currentUser.email }
      });
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('❌ Error publishing message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleUserClick = async (user) => {
    console.log('User clicked:', user.name, user.email);
    setCurrentRecipient(user.email);
    
    // Clear unread count for this user
    if (unreadMessages[user.email]) {
      console.log('Clearing unread count for:', user.email);
      setUnreadMessages(prev => ({
        ...prev,
        [user.email]: 0
      }));
    }

    try {
      console.log('Loading chat history...');
      const url = `https://it342-syncra.onrender.com/api/chat/history/${currentUser.email}/${user.email}`;
      console.log('History URL:', url);
      
      const response = await axios.get(url);
      console.log('Chat history response:', response.data);

      // Sort messages by timestamp to ensure correct order
      const sortedMessages = [...response.data].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );

      const formattedMessages = sortedMessages.map(msg => ({
        from: msg.senderEmail === currentUser.email ? 'me' : 'them',
        text: msg.content,
        timestamp: msg.timestamp
      }));
      
      console.log('Formatted messages:', formattedMessages);
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading history:', error);
      alert('Failed to load chat history. Please try again.');
    }
  };

  const reconnectWebSocket = () => {
    console.log('Manually reconnecting WebSocket...');
    setConnectionStatus('Reconnecting...');
    
    // Force a full reconnection with new socket
    setupWebSocketConnection(currentUser);
  };

  return (
    <div className="chat-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          Messages
          <div className="connection-status" title={connectionStatus}>
            {connectionStatus === 'Connected' ? '🟢' : connectionStatus === 'Reconnecting...' ? '🟠' : '🔴'}
            <button 
              onClick={reconnectWebSocket}
              style={{ marginLeft: '5px', fontSize: '12px' }}
              title="Reconnect WebSocket"
            >
              ⟳
            </button>
          </div>
        </div>
        <div className="conversation-list">
          {users.length > 0 ? (
            users.map(user => (
              <div
                key={user.id}
                className={`conversation${user.email === currentRecipient ? ' selected' : ''}`}
                onClick={() => handleUserClick(user)}
              >
                <div className="name">
                  {user.name}
                  {unreadMessages[user.email] > 0 && 
                    <span className="unread-count">{unreadMessages[user.email]}</span>
                  }
                </div>
                <div className="email">{user.email}</div>
              </div>
            ))
          ) : (
            <div className="no-users">No users available</div>
          )}
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          {currentRecipient ? 
            users.find(u => u.email === currentRecipient)?.name || currentRecipient 
            : 'Select a conversation'
          }
          <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#666' }}>
            {connectionStatus === 'Connected' ? '(Online)' : '(Connection issues)'}
          </span>
        </header>

        <section className="chat-messages">
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${msg.from === 'me' ? 'sent' : 'received'}`}
              >
                {msg.text}
              </div>
            ))
          ) : (
            currentRecipient && <div className="no-messages">No messages yet. Start a conversation!</div>
          )}
          <div ref={messagesEndRef} />
        </section>

        {currentRecipient && (
          <footer className="chat-input-area">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={!stompClient.current?.connected}
            />
            <button 
              onClick={handleSend} 
              disabled={!stompClient.current?.connected || !message.trim()}
            >
              {stompClient.current?.connected ? 'Send' : 'Connecting...'}
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}

export default Chat;