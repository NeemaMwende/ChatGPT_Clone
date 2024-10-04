import React, { useState } from 'react';
import { login } from './authService'; // Import the auth service
import './Login.css'
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Import Google login

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            onLogin(); // Call the onLogin function to update the authenticated state
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </form>

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
        </div>
    );
};

export default Login;
