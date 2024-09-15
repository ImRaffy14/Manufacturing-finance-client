import axios from 'axios';

const API_URL = 'http://localhost:4000/API/Auth'; // Your backend API

// Register
export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/CreateAccount`, userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// Login
export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
};

// Get current user profile (Protected Route)
export const getProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/protected`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
