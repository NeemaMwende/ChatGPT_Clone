import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the user's message to the Flask backend
      const res = await axios.post('http://localhost:5000/chat', {
        message: message
      });

      // Set the response from the assistant
      setResponse(res.data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Your Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button type="submit">Send</button>
      </form>

      {response && (
        <div>
          <h3>ChatGPT Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Form;
