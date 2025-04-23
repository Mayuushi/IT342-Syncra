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
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const stompClient = useRef(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.username) {
      setUsername(user.username);

      const socket = new SockJS('https://it342-syncra.onrender.com/ws');
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log('WebSocket connected');
          stompClient.current.subscribe(`/user/${user.username}/queue/messages`, (message) => {
            const msg = JSON.parse(message.body);
            if (msg.sender === currentRecipient) {
              setMessages((prev) => [...prev, { from: 'them', text: msg.content }]);
            }
          });
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
        },
      });

      stompClient.current.activate();
    } else {
      console.error('User is not logged in or username is missing.');
    }

    return () => {
      if (stompClient.current && stompClient.current.active) {
        stompClient.current.deactivate();
      }
    };
  }, [currentRecipient]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://it342-syncra.onrender.com/api/users');
        const loggedInUser = authService.getCurrentUser();
        if (Array.isArray(response.data)) {
          const filteredUsers = response.data.filter((u) => u.username !== loggedInUser.username);
          setUsers(filteredUsers);
        } else {
          console.error('Unexpected API response format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSend = () => {
    if (message.trim() && currentRecipient && stompClient.current.connected) {
      const payload = {
        sender: username,
        recipient: currentRecipient,
        content: message,
      };
      stompClient.current.publish({ destination: '/app/chat', body: JSON.stringify(payload) });
      setMessages((prev) => [...prev, { from: 'me', text: message }]);
      setMessage('');
    }
  };

  const handleUserClick = async (user) => {
    setCurrentRecipient(user.username);
    try {
      const response = await axios.get(
        `https://it342-syncra.onrender.com/api/chat/history/${username}/${user.username}`
      );
      setMessages(response.data.map((msg) => ({
        from: msg.sender === username ? 'me' : 'them',
        text: msg.content,
      })));
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  return (
    <div className="chat-layout">
      <aside className="sidebar">
        <div className="sidebar-header">Messages</div>
        <div className="conversation-list">
          {users.map((user) => (
            <div
              key={user.id}
              className={`conversation${user.username === currentRecipient ? ' selected' : ''}`}
              onClick={() => handleUserClick(user)}
            >
              <div className="name">{user.name}</div>
            </div>
          ))}
        </div>
      </aside>
      <main className="chat-main">
        <header className="chat-header">
          <div>{currentRecipient || 'Select a conversation'}</div>
        </header>
        <section className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.from === 'me' ? 'sent' : 'received'}`}>
              {msg.text}
            </div>
          ))}
        </section>
        {currentRecipient && (
          <footer className="chat-input-area">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button onClick={handleSend}>Send</button>
          </footer>
        )}
      </main>
    </div>
  );
}

export default Chat;