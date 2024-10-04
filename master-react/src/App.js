import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const user = { profilePicture: '../src/components/logo.png' }; // Example user object

  const handleLogin = () => {
    setIsAuthenticated(true); // Update the state to indicate user is authenticated
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Update the state to indicate user is logged out
  };

  return (
    <div className="app-container">
      <Header user={user} onLogout={handleLogout} /> {/* Pass the user object and logout handler */}

      <div className="main-content">
        {isAuthenticated ? (
          <>
            <Sidebar />
            <Chat />
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} /> {/* Pass the login handler */}
            <Register />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
