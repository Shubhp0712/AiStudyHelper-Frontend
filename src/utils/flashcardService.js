import axios from "axios";
import { getAuth } from "firebase/auth";

const API_URL = "http://localhost:5000/api/flashcards";

const getAuthToken = async () => {
  const auth = getAuth();
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken(/* forceRefresh */ true);
};

export const createFlashcards = async (topic) => {
  const token = await getAuthToken();
  const res = await axios.post(
    API_URL,
    { topic },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getFlashcards = async () => {
  const token = await getAuthToken();
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { flashcards: res.data }; // Wrap in flashcards array for compatibility
};

export const updateFlashcard = async (id, data) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    console.log('Updating flashcard with ID:', id, 'Data:', data);

    const res = await axios.put(
      `${API_URL}/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error('Update flashcard error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteFlashcard = async (id) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    console.log('Deleting flashcard with ID:', id);

    const res = await axios.delete(
      `${API_URL}/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error('Delete flashcard error:', error.response?.data || error.message);
    throw error;
  }
};
