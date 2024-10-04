import React, { useState, useEffect } from 'react';
import './Sidebar.css'; // Import Sidebar-specific styles

const Sidebar = ({ conversations = [], onSelectConversation }) => {
  const [savedConversations, setSavedConversations] = useState([]);

  // Load saved conversations from local storage on component mount
  useEffect(() => {
    const storedConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    setSavedConversations(storedConversations);
  }, []);

  // Update local storage whenever conversations change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
      setSavedConversations(conversations);
    }
  }, [conversations]);

  return (
    <div className="sidebar">
      <h2>History</h2>
      <ul className="history-list">
        {savedConversations.length > 0 ? (
          savedConversations.map((conv, index) => (
            <li key={index} onClick={() => onSelectConversation(conv)}>
              Conversation {index + 1}
            </li>
          ))
        ) : (
          <button>Start Chat</button>
        )}
      </ul>

        <div className='bottom'>
          <div className='one'>
            <h2>Settings</h2>
          </div>
          <div className='two'> 
          <div className="settings-list">
              <button>Theme</button>
              <button>Account</button>
          </div>
          </div>             
        </div>
     
    </div>
  );
};

export default Sidebar;
