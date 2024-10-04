import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // URL of your Flask backend

export const register = async (username, password) => {
    return await axios.post(`${API_URL}/register`, { username, password });
};

export const login = async (username, password) => {
    return await axios.post(`${API_URL}/login`, { username, password });
};
