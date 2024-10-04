import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
    <Router>
      <div className="app-container">
        <Header user={user} onLogout={handleLogout} /> {/* Pass the user object and logout handler */}
        
        <div className="main-content">
          <Routes>
            {/* Redirect to login if not authenticated */}
            {isAuthenticated ? (
              <>
                <Route path="/chat" element={<><Sidebar /><Chat /></>} />
                <Route path="/" element={<Navigate to="/chat" />} /> {/* Redirect to chat */}
              </>
            ) : (
              <>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;