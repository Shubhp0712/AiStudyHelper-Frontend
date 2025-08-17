import axios from 'axios';
import { auth } from '../firebaseConfig';

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from Firebase
const getAuthToken = async () => {
    try {
        const user = auth.currentUser;
        console.log('Current Firebase user:', user?.email);

        if (user) {
            const token = await user.getIdToken();
            console.log('Token obtained:', token.substring(0, 20) + '...');
            return token;
        }

        console.log('No authenticated user found');
        return null;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

// Create axios instance with auth
const createAuthenticatedRequest = async () => {
    const token = await getAuthToken();
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });
};

// Save chat to MongoDB
export const saveChat = async (chatData) => {
    try {
        console.log('Attempting to save chat:', chatData);
        const api = await createAuthenticatedRequest();
        const response = await api.post('/chats', chatData);
        console.log('Chat saved successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error saving chat:', error.response?.data || error.message);
        throw error;
    }
};

// Get all chats for user
export const getUserChats = async () => {
    try {
        const api = await createAuthenticatedRequest();
        const response = await api.get('/chats');
        return response.data;
    } catch (error) {
        console.error('Error fetching chats:', error);
        throw error;
    }
};

// Update existing chat
export const updateChat = async (chatId, chatData) => {
    try {
        const api = await createAuthenticatedRequest();
        const response = await api.put(`/chats/${chatId}`, chatData);
        return response.data;
    } catch (error) {
        console.error('Error updating chat:', error);
        throw error;
    }
};

// Delete chat
export const deleteChat = async (chatId) => {
    try {
        const api = await createAuthenticatedRequest();
        const response = await api.delete(`/chats/${chatId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting chat:', error);
        throw error;
    }
};

// Get specific chat by ID
export const getChatById = async (chatId) => {
    try {
        const api = await createAuthenticatedRequest();
        const response = await api.get(`/chats/${chatId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat:', error);
        throw error;
    }
};
