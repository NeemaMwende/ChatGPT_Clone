import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import for routing

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const user = { profilePicture: '../src/components/logo.png' }; // Example user object

  const handleLogin = () => {
    alert('Login successful'); // Show alert
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
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/chat" /> : <Login onLogin={handleLogin} />}
            />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/chat" 
              element={isAuthenticated ? (
                <>
                  <Sidebar />
                  <Chat />
                </>
              ) : (
                <Navigate to="/login" /> // Redirect to login if not authenticated
              )}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
