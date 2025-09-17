// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import { auth } from "../firebaseConfig";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    toast.success("You have been logged out successfully", {
      icon: '👋',
      className: 'toast-auth-success',
      autoClose: 2000,
    });
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
