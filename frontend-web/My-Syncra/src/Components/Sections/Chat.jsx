import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import authService from '../../Service/authService';
import '../Chat.css';
import { NavBar } from '../NavBar';

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
  const pollingIntervalRef = useRef(null);

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
                
                // Always update messages if from current conversation
                if (msg.senderEmail === currentRecipient || msg.receiverEmail === currentRecipient) {
                  setMessages(prev => [...prev, {
                    from: msg.senderEmail === user.email ? 'me' : 'them',
                    text: msg.content
                  }]);
                } else {
                  // Update unread count for messages from other users
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
        // Clear polling interval on unmount
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, []); // Remove dependency to avoid recreating connection

  // Setup polling for messages
  useEffect(() => {
    // Clear previous interval if exists
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Only start polling if we have a current user and recipient
    if (currentUser?.email && currentRecipient) {
      console.log('Setting up polling for new messages');
      
      // Function to fetch latest messages
      const fetchLatestMessages = async () => {
        try {
          const url = `https://it342-syncra.onrender.com/api/chat/history/${currentUser.email}/${currentRecipient}`;
          const response = await axios.get(url);
          
          // Compare with current messages to avoid unnecessary updates
          const formattedMessages = response.data.map(msg => ({
            id: msg.id, // Assuming messages have unique IDs
            from: msg.senderEmail === currentUser.email ? 'me' : 'them',
            text: msg.content
          }));
          
          // Only update if there are new messages
          if (formattedMessages.length > messages.length) {
            console.log('New messages detected, updating...');
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error('Error polling messages:', error);
        }
      };
      
      // Initial fetch
      fetchLatestMessages();
      
      // Set up interval (every 2 seconds)
      pollingIntervalRef.current = setInterval(fetchLatestMessages, 2000);
    }
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [currentUser, currentRecipient]);

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
      
      // Set up polling for users list as well (less frequent)
      const userPollingInterval = setInterval(loadUsers, 10000); // Every 10 seconds
      
      return () => clearInterval(userPollingInterval);
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
    } else if (message.trim() && currentRecipient) {
      // Fallback to HTTP if WebSocket is not connected
      console.log('WebSocket not connected, sending via HTTP fallback');
      
      // Add to UI immediately
      setMessages(prev => [...prev, { from: 'me', text: message }]);
      
      const payload = {
        senderEmail: currentUser.email,
        receiverEmail: currentRecipient,
        content: message
      };

      // Send message via HTTP endpoint
      axios.post('https://it342-syncra.onrender.com/api/chat/send', payload)
        .then(response => {
          console.log('Message sent via HTTP:', response.data);
        })
        .catch(error => {
          console.error('Error sending message via HTTP:', error);
        });
      
      setMessage('');
    } else {
      console.warn('Cannot send message:', {
        messageEmpty: !message.trim(),
        noRecipient: !currentRecipient
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
    <>
      <div className="chat-bg"></div> {/* Move this to the very top, before NavBar */}
      <NavBar />
      <div className="chat-container">
        <div className="chat-layout">
          <aside className="sidebar">
            <div className="sidebar-header">
              <span className="header-title">Messages</span>
              <div className="connection-status" title={connectionStatus}>
                {connectionStatus === 'Connected' ? '🟢' : connectionStatus === 'Reconnecting...' ? '🟠' : '🔴'}
                <button 
                  onClick={reconnectWebSocket}
                  className="reconnect-button"
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
                <button onClick={handleSend}>
                  {stompClient.current?.connected ? 'Send' : 'Send (HTTP)'}
                </button>
              </footer>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default Chat;