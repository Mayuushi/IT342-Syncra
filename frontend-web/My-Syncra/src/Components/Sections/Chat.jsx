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
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // WebSocket connection setup
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.email) {
      console.log('Setting up WebSocket for user:', user.email);
      setCurrentUser(user);

      const socket = new SockJS(`https://it342-syncra.onrender.com/ws?email=${encodeURIComponent(user.email)}`);
      
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        debug: function(str) {
          console.log('STOMP:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('WebSocket connected successfully');
          setConnectionStatus('Connected');
          
          // Subscribe to personal queue
          const subscription = stompClient.current.subscribe(
            `/user/${user.email}/queue/messages`,
            (messageOutput) => {
              console.log('Received message via WebSocket:', messageOutput.body);
              try {
                const msg = JSON.parse(messageOutput.body);
                console.log('Parsed message:', msg);
                
                // Add message to state if it's from current conversation or update unread count
                if (msg.senderEmail === currentRecipient || msg.senderEmail === user.email) {
                  setMessages(prev => [...prev, {
                    from: msg.senderEmail === user.email ? 'me' : 'them',
                    text: msg.content
                  }]);
                }

                // Update unread count if message is from someone else
                if (msg.senderEmail !== currentRecipient && msg.senderEmail !== user.email) {
                  setUnreadMessages(prev => ({
                    ...prev,
                    [msg.senderEmail]: (prev[msg.senderEmail] || 0) + 1
                  }));
                }
              } catch (error) {
                console.error('Error parsing message:', error);
              }
            }
          );
          
          console.log('Subscription active:', subscription.id);
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
          setConnectionStatus('Error: ' + frame.headers.message);
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          setConnectionStatus('Disconnected');
        }
      });

      console.log('Activating STOMP client');
      stompClient.current.activate();

      return () => {
        console.log('Cleaning up WebSocket connection');
        if (stompClient.current?.connected) {
          stompClient.current.deactivate();
        }
      };
    }
  }, []); // Remove currentRecipient from dependency array

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
    if (message.trim() && currentRecipient && stompClient.current?.connected) {
      console.log('Sending message to:', currentRecipient);
      
      // Add to UI immediately
      setMessages(prev => [...prev, { from: 'me', text: message }]);
      
      const payload = {
        senderEmail: currentUser.email,
        receiverEmail: currentRecipient,
        content: message
      };

      console.log('Message payload:', payload);

      stompClient.current.publish({
        destination: '/app/chat',
        body: JSON.stringify(payload)
      });

      console.log('Message published to STOMP');
      setMessage('');
    } else {
      console.warn('Cannot send message:', {
        messageEmpty: !message.trim(),
        noRecipient: !currentRecipient,
        notConnected: !stompClient.current?.connected
      });
    }
  };

  // Handle user click and load chat history
  const handleUserClick = async (user) => {
    console.log('User clicked:', user.name, user.email);
    setCurrentRecipient(user.email);
    
    // Clear unread count for this user
    setUnreadMessages(prev => ({
      ...prev,
      [user.email]: 0
    }));

    try {
      console.log('Loading chat history...');
      const url = `https://it342-syncra.onrender.com/api/chat/history/${currentUser.email}/${user.email}`;
      const response = await axios.get(url);
      
      const formattedMessages = response.data.map(msg => ({
        from: msg.senderEmail === currentUser.email ? 'me' : 'them',
        text: msg.content
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const reconnectWebSocket = () => {
    console.log('Attempting to reconnect WebSocket...');
    setConnectionStatus('Reconnecting...');
    
    if (stompClient.current) {
      stompClient.current.deactivate();
      
      setTimeout(() => {
        // Create a new socket connection
        const socket = new SockJS(`https://it342-syncra.onrender.com/ws?email=${encodeURIComponent(currentUser.email)}&t=${new Date().getTime()}`);
        stompClient.current.webSocketFactory = () => socket;
        stompClient.current.activate();
      }, 1000);
    }
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
            : 'Select a conversation'}
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
            />
            <button onClick={handleSend} disabled={!stompClient.current?.connected}>
              {stompClient.current?.connected ? 'Send' : 'Connecting...'}
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}

export default Chat;