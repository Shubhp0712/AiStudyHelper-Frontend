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

export const updateFlashcard = async (id, topic, flashcards) => {
  const token = await getAuthToken();
  const res = await axios.put(
    `${API_URL}/${id}`,
    { topic, flashcards },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteFlashcard = async (id) => {
  const token = await getAuthToken();
  const res = await axios.delete(
    `${API_URL}/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
