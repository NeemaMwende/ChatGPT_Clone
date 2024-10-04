import React, { useState, useEffect, useRef } from 'react';
import './Chat.css'; // Import Chat-specific styles
import axios from 'axios';

const Chat = ({ setConversations }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const chatDisplayRef = useRef(null); // Reference to chat display for auto-scrolling

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Append the user message to the message list
    const userMessage = { sender: 'user', content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setMessage(''); // Clear input

    // Set loading to true while waiting for the response
    setLoading(true);

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

    // Stop loading after response is received
    setLoading(false);
  };

  // Scroll to the bottom of the chat display whenever a new message is added
  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-display" ref={chatDisplayRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="loading-message">Assistant is typing...</div>}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows="3"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
