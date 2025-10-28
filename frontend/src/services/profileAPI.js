import axios from 'axios';

// Allow overriding the backend URL via Vite env var (VITE_API_URL), fallback to localhost
const BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:3001';
const API_URL = `${BASE}/api/profile`;

// Get authentication token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Get user profile
export const getUserProfile = async () => {
    try {
        const token = getAuthToken();
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        const payload = {
            status: error.response?.status,
            error: error.response?.data?.error || error.message || 'Error al obtener el perfil'
        };
        throw payload;
    }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    try {
        const token = getAuthToken();
        const response = await axios.put(API_URL, profileData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        const payload = {
            status: error.response?.status,
            error: error.response?.data?.error || error.message || 'Error al actualizar el perfil'
        };
        throw payload;
    }
};

// Update user password
export const updateUserPassword = async (passwordData) => {
    try {
        const token = getAuthToken();
        const response = await axios.put(`${API_URL}/password`, passwordData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating password:', error);
        const payload = {
            status: error.response?.status,
            error: error.response?.data?.error || error.message || 'Error al actualizar la contraseña'
        };
        throw payload;
    }
};
