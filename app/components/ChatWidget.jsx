'use client';
import React from 'react';
import { useState, useRef, useEffect } from 'react';

const styles = `
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(26, 26, 46, 0.45); }
    70%  { box-shadow: 0 0 0 12px rgba(26, 26, 46, 0); }
    100% { box-shadow: 0 0 0 0 rgba(26, 26, 46, 0); }
  }
  .chat-pulse {
    animation: pulse-ring 2s ease-out 3;
  }
`;

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! How can I help you today?' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: 'user', text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: 'bot', text: 'Something went wrong. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>

            <div
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '10px',
                }}
            >
                {/* Chat Panel */}
                {isOpen && (
                    <div
                        style={{
                            width: '320px',
                            background: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid #e8e8e8',
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                background: '#1a1a2e',
                                color: '#fff',
                                padding: '12px 16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <span style={{ fontWeight: 600, fontSize: '14px' }}>Chat Assistant</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.7)',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    lineHeight: 1,
                                    padding: 0,
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            style={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                padding: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                            }}
                        >
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        background: msg.role === 'user' ? '#1a1a2e' : '#f0f0f0',
                                        color: msg.role === 'user' ? '#fff' : '#333',
                                        padding: '8px 12px',
                                        borderRadius: '12px',
                                        maxWidth: '80%',
                                        fontSize: '13px',
                                        lineHeight: '1.5',
                                    }}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {loading && (
                                <div
                                    style={{
                                        alignSelf: 'flex-start',
                                        background: '#f0f0f0',
                                        color: '#888',
                                        padding: '8px 12px',
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                    }}
                                >
                                    Typing...
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div
                            style={{
                                display: 'flex',
                                borderTop: '1px solid #eee',
                                padding: '8px',
                                gap: '6px',
                            }}
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type a message..."
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    padding: '8px 10px',
                                    fontSize: '13px',
                                    outline: 'none',
                                    background: '#fafafa',
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                style={{
                                    background: loading ? '#999' : '#1a1a2e',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 14px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '13px',
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}

                {/* Toggle Button — pulses 3x on load, then stays still */}
                <button
                    className="chat-pulse"
                    onClick={() => setIsOpen((o) => !o)}
                    style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: '#1a1a2e',
                        color: '#fff',
                        border: 'none',
                        fontSize: '22px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {isOpen ? '✕' : '💬'}
                </button>
            </div>
        </>
    );
}