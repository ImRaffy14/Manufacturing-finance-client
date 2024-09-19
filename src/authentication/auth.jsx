import axios from 'axios';

const API_URL = import.meta.env.VITE_API_AUTH_URL;

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
export const logout = (userTrail, socket) => {
    socket.emit("addAuditTrails", userTrail)
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
