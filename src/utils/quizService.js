import { auth } from '../firebaseConfig';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://aistudyhelper-backend.onrender.com/api';

// Get Firebase auth token
const getAuthToken = async () => {
    try {
        if (!auth.currentUser) {
            console.log('No authenticated user found');
            return null;
        }

        const token = await auth.currentUser.getIdToken();
        console.log('Token obtained:', !!token);
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

// Create authenticated request config
const createAuthenticatedRequest = async () => {
    const token = await getAuthToken();
    return {
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    };
};

// Generate quiz from content
export const generateQuiz = async (quizData) => {
    try {
        console.log('Attempting to generate quiz:', quizData);
        const config = await createAuthenticatedRequest();

        const response = await fetch(`${API_BASE_URL}/quizzes/generate`, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(quizData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Quiz generated successfully:', result);
        return result;
    } catch (error) {
        console.error('Error generating quiz:', error);
        throw error;
    }
};

// Get all user quizzes
export const getUserQuizzes = async () => {
    try {
        const config = await createAuthenticatedRequest();

        const response = await fetch(`${API_BASE_URL}/quizzes`, {
            method: 'GET',
            headers: config.headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const quizzes = await response.json();
        return quizzes;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
    }
};

// Get specific quiz by ID
export const getQuizById = async (quizId) => {
    try {
        const config = await createAuthenticatedRequest();

        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
            method: 'GET',
            headers: config.headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const quiz = await response.json();
        return quiz;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
};

// Update quiz
export const updateQuiz = async (quizId, updateData) => {
    try {
        const config = await createAuthenticatedRequest();

        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
            method: 'PUT',
            headers: config.headers,
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const quiz = await response.json();
        return quiz;
    } catch (error) {
        console.error('Error updating quiz:', error);
        throw error;
    }
};

// Delete quiz
export const deleteQuiz = async (quizId) => {
    try {
        const config = await createAuthenticatedRequest();

        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: config.headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting quiz:', error);
        throw error;
    }
};
