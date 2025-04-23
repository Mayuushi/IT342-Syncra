import React, { useState, useEffect, useRef } from 'react';
import '../Chat.css';
import { NavBar } from '../NavBar';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentRecipient, setCurrentRecipient] = useState(null);
  const [username, setUsername] = useState(''); // You should load this from auth context or localStorage
  const [conversations, setConversations] = useState([]);
  const stompClient = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setUsername(user.username);
    }

    const socket = new SockJS('https://your-render-backend.onrender.com/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.current.subscribe(`/user/${user.username}/queue/messages`, message => {
          const msg = JSON.parse(message.body);
          setMessages(prev => [...prev, { from: 'them', text: msg.content }]);

          setConversations(prev => {
            const exists = prev.find(c => c.user === msg.sender);
            if (exists) return prev;
            return [...prev, { id: Date.now(), name: msg.sender, user: msg.sender, preview: '', date: new Date().toLocaleDateString() }];
          });
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
    });

    stompClient.current.activate();
    return () => stompClient.current.deactivate();
  }, []);

  const handleSend = () => {
    if (message.trim() && currentRecipient && stompClient.current.connected) {
      const payload = {
        sender: username,
        recipient: currentRecipient,
        content: message
      };
      stompClient.current.publish({ destination: '/app/chat', body: JSON.stringify(payload) });
      setMessages(prev => [...prev, { from: 'me', text: message }]);
      setMessage('');
    }
  };

  const handleConversationClick = (recipient) => {
    setCurrentRecipient(recipient);
    setMessages([]);
  };

  return (
    <>
      <NavBar />
      <div className="chat-layout">
        <aside className="sidebar">
          <div className="sidebar-header"><span>Messages</span></div>
          <input className="search-input" placeholder="Search messages" />
          <div className="conversation-list">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation${conv.user === currentRecipient ? ' selected' : ''}`}
                onClick={() => handleConversationClick(conv.user)}
              >
                <div className="avatar"></div>
                <div>
                  <div className="name">{conv.name}</div>
                  <div className="preview">{conv.preview}</div>
                </div>
                <div className="date">{conv.date}</div>
              </div>
            ))}
          </div>
        </aside>
        <main className="chat-main">
          <header className="chat-header">
            <div className="avatar"></div>
            <div>
              <div className="name">{currentRecipient || 'Select a conversation'}</div>
              <div className="status">Online</div>
            </div>
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
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message"
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              />
              <button onClick={handleSend}><span>&#9654;</span></button>
            </footer>
          )}
        </main>
      </div>
    </>
  );
}

export default Chat;
