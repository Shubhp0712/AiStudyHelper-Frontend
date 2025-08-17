// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDj557G13WHDLLCi1Y-XdojIaDgIiDhUyQ",
  authDomain: "ai-study-assistant-7e585.firebaseapp.com",
  projectId: "ai-study-assistant-7e585",
  storageBucket: "ai-study-assistant-7e585.appspot.com",
  messagingSenderId: "92256421558",
  appId: "1:92256421558:web:a834c809e78a0e8d468817"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDj557G13WHDLLCi1Y-XdojIaDgIiDhUyQ",
//   authDomain: "ai-study-assistant-7e585.firebaseapp.com",
//   projectId: "ai-study-assistant-7e585",
//   storageBucket: "ai-study-assistant-7e585.firebasestorage.app",
//   messagingSenderId: "92256421558",
//   appId: "1:92256421558:web:a834c809e78a0e8d468817"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);