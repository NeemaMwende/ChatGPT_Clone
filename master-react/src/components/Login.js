import React, { useState } from 'react';
import { login } from './authService'; // Import the auth service
import './Login.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Create navigate hook for redirection

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password); // Assuming login is an async function
            onLogin(); // Show the "Login successful" alert
            navigate('/chat'); // Redirect to chat area
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                <br></br>
                 {/* Google login button */}
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            console.log(credentialResponse);
                            onLogin(); 
                        }}
                        onError={() => {
                            console.log('Google Login Failed');
                        }}
                    />
                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>

            </form>
        </div>
    );
};

export default Login;
