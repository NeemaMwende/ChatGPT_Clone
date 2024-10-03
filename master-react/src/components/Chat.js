import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Chat.css'; // Import Chat-specific styles

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Function to handle submitting a message
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Append the user's message to the chat
    const userMessage = { sender: 'user', content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const res = await axios.post('http://localhost:5000/chat', { message });
      const assistantMessage = { sender: 'assistant', content: res.data.response };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      const errorMessage = { sender: 'assistant', content: 'Error fetching response' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setMessage(''); // Clear the input
  };

  // Function to handle selecting a conversation from the sidebar
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation); // Restore the selected conversation
  };

  return (
    <div className="chat-app">
      <Sidebar conversations={messages} onSelectConversation={handleSelectConversation} />

      <div className="chat-container">
        <div className="chat-display">
          {(selectedConversation || messages).map((msg, index) => (
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
    </div>
  );
};

export default Chat;