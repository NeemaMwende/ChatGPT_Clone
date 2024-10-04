import React, { useState } from 'react';
import './Header.css'; // Import Header-specific styles
import image from "../components/image.png";

const Header = ({ user = {} }) => { // Default to an empty object
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    // Handle logout logic here (redirect to login page)
    window.location.href = '/login'; // Example redirect
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="header">
      <h1>ChatGPT Clone</h1>
      <div className="profile-container" onClick={toggleDropdown}>
        <img
          src={user.profilePicture || {image}} // Fallback to a default image
          alt="Profile"
          className="profile-picture"
        />
        {dropdownVisible && (
          <div className="dropdown">
            <ul>
              <li>Settings</li>
              <li>Models</li>
              <li>Themes</li>
              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
