import React from 'react';
import './Header.css'; // Import Header-specific styles

const Header = () => {
  return (
    <div className="header">
      <h1>ChatGPT Clone</h1>
      <button className="profile-button">Profile</button>
    </div>
  );
};

export default Header;