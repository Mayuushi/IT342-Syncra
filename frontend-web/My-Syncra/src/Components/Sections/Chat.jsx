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
  const stompClient = useRef(null);
  const currentRecipientRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.email) {
      setCurrentUser(user);

      const socket = new SockJS('https://it342-syncra.onrender.com/ws');
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log('WebSocket connected');
          stompClient.current.subscribe(
            `/user/${user.email}/queue/messages`,
            (message) => {
              const msg = JSON.parse(message.body);
              if (msg.senderEmail === currentRecipientRef.current) {
                setMessages(prev => [...prev, {
                  from: 'them',
                  text: msg.content
                }]);
              }
            }
          );
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
        },
      });

      stompClient.current.activate();
    }

    return () => {
      stompClient.current?.deactivate();
    };
  }, []);

  useEffect(() => {
    currentRecipientRef.current = currentRecipient;
  }, [currentRecipient]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await authService.getUsers();
        const filtered = users.filter(u => u.email.trim() !== currentUser?.email.trim());
        setUsers(filtered);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    if (currentUser?.email) {
      loadUsers();
    }
  }, [currentUser]);

  const handleSend = () => {
    if (message.trim() && currentRecipient && stompClient.current?.connected) {
      const payload = {
        senderEmail: currentUser.email,
        receiverEmail: currentRecipient,
        content: message
      };

      stompClient.current.publish({
        destination: '/app/chat',
        body: JSON.stringify(payload)
      });

      setMessages(prev => [...prev, {
        from: 'me',
        text: message
      }]);
      setMessage('');
    }
  };

  const handleUserClick = async (user) => {
    setCurrentRecipient(user.email);
    currentRecipientRef.current = user.email;

    try {
      const history = await axios.get(
        `https://it342-syncra.onrender.com/api/chat/history/${currentUser.email}/${user.email}`
      );

      setMessages(history.data.map(msg => ({
        from: msg.sender === currentUser.email ? 'me' : 'them',
        text: msg.content
      })));
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  return (
    <div className="chat-layout">
      <aside className="sidebar">
        <div className="sidebar-header">Messages</div>
        <div className="conversation-list">
          {users.map(user => (
            <div
              key={user.id}
              className={`conversation${user.email === currentRecipient ? ' selected' : ''}`}
              onClick={() => handleUserClick(user)}
            >
              <div className="name">{user.name}</div>
              <div className="email">{user.email}</div>
            </div>
          ))}
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          {currentRecipient || 'Select a conversation'}
        </header>

        <section className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.from === 'me' ? 'sent' : 'received'}`}
            >
              {msg.text}
            </div>
          ))}
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
            <button onClick={handleSend}>Send</button>
          </footer>
        )}
      </main>
    </div>
  );
}

export default Chat;
