import React, { useState } from 'react';
import './Chat.css'; // Import Chat-specific styles

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Append the user message to the message list
    setMessages([...messages, { sender: 'user', content: message }]);

    // Mock assistant response (in practice, you'd use API call)
    setMessages(prevMessages => [
      ...prevMessages, 
      { sender: 'assistant', content: 'This is a response from the assistant.' }
    ]);

    setMessage('');  // Clear input
  };

  return (
    <div className="chat-container">
      <div className="chat-display">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows="3"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
