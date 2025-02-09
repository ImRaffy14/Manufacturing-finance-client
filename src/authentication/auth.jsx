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
    const response = await axios.post(`${API_URL}/login`, userData, {
        withCredentials:true
    });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// Refresh token
const refreshAccessToken = async () => {
    try {
        const response = await axios.post(`${API_URL}/refresh-token`, null, {
            withCredentials: true,
        });

        if (response.status === 200) {
            const data = response.data;
            localStorage.setItem('token', data.accessToken);
        }
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        logout()
    }
};

// Logout
export const logout = async (userTrail, socket) => {
    try {
        socket.emit("addAuditTrails", userTrail)
        socket.emit('staff_disconnect', userTrail.userId);
        localStorage.removeItem('token')
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });

    } catch (error) {
        console.error("Logout failed:", error);
    }
};

// Get current user profile (Protected Route)
export const getProfile = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${API_URL}/protected`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {

            await refreshAccessToken();

            const newToken = localStorage.getItem('token');
            const retryResponse = await axios.get(`${API_URL}/protected`, {
                headers: {
                    Authorization: `Bearer ${newToken}`
                }
            });

            return retryResponse.data;
        } else {                
            console.error('Error fetching profile:', error);
            throw error; 
        }
    }
};

