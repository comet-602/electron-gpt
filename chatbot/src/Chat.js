import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // 用於滾動到最新消息

  useEffect(() => {
    // 自動滾動到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      // 添加用戶消息
      setMessages(prevMessages => [
        ...prevMessages,
        { text: input, type: 'user' }
      ]);
   
      try {
        const response = await fetch('/api/chat', { // 替換為你的 Node.js API 路徑
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });

        if (response.ok) {
          const result = await response.json();
          setMessages(prevMessages => [
            ...prevMessages,
            { text: result.reply, type: 'gpt' }
          ]);
        } else {
          const result = await response.json();
          setMessages(prevMessages => [
            ...prevMessages,
            { text: result.error, type: 'gpt' }
          ]);
        }
      } catch (error) {
        // 連接後端失敗
        setMessages(prevMessages => [
          ...prevMessages,
          { text: '連接後端失敗', type: 'gpt' }
        ]);
      }
      setInput('');
    }
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
        {/* 用於滾動到最新消息的空白元素 */}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;