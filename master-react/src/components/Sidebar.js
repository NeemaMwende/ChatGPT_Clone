import React from 'react';
import './Sidebar.css'; // Import Sidebar-specific styles

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>History</h2>
      <ul className="history-list">
        <li>Conversation 1</li>
        <li>Conversation 2</li>
        <li>Conversation 3</li>
      </ul>
      <h2>Settings</h2>
      <ul className="settings-list">
        <li>Theme</li>
        <li>Account</li>
      </ul>
    </div>
  );
};

export default Sidebar;
