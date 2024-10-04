import React, { useState } from 'react';
import './Chat.css'; // Import Chat-specific styles
import axios from 'axios';

const Chat = ({ setConversations }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Append the user message to the message list
    const userMessage = { sender: 'user', content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Send the user's message to the Flask backend
      const res = await axios.post('http://localhost:5000/chat', {
        message: message
      });

      // Append the assistant's response to the messages
      const assistantMessage = { sender: 'assistant', content: res.data.response };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      // Update the conversations history
      setConversations((prevConversations) => [
        ...prevConversations,
        [...messages, userMessage, assistantMessage] // Full conversation
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

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
