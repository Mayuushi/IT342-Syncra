import React, { useState } from 'react';
import '../Chat.css';
import { NavBar } from '../NavBar';

function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { from: 'them', text: 'Sample received message.' },
        { from: 'me', text: 'Sample sent message.' }
    ]);
    const [conversations] = useState([
        {
            id: 1,
            name: 'Boss Lebron',
            preview: 'You: "Sample message..."',
            date: 'Mar. 28.2025',
            active: true
        },
        {
            id: 2,
            name: 'Walter Shenencia',
            preview: 'Kira: "Thank you"',
            date: 'Mar. 28.2025',
            active: false
        },
        {
            id: 3,
            name: 'Boss Pogoy',
            preview: 'Kevin: "Thank you"',
            date: 'Mar. 28.2025',
            active: false
        }
    ]);

    const handleSend = () => {
        if (message.trim()) {
            setMessages([...messages, { from: 'me', text: message }]);
            setMessage('');
        }
    };

    return (
        <>
            <NavBar />
            <div className="chat-layout">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <span>Messages</span>
                    </div>
                    <input className="search-input" placeholder="Search messages" />
                    <div className="conversation-list">
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                className={`conversation${conv.active ? ' selected' : ''}`}
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
                            <div className="name">Boss Lebron</div>
                            <div className="status">Online</div>
                        </div>
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
                    </section>
                    <footer className="chat-input-area">
                        <input
                            type="text"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Type a message"
                            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                        />
                        <button onClick={handleSend}>
                            <span>&#9654;</span>
                        </button>
                    </footer>
                </main>
            </div>
        </>
    );
}

export default Chat;