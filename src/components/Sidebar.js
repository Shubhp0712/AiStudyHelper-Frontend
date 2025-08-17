// src/components/Sidebar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="w-64 bg-blue-700 text-white p-6 space-y-4">
      <h1 className="text-2xl font-bold">AIStudyHelper</h1>
      <nav className="flex flex-col space-y-2">
        <Link to="/home" className="hover:bg-blue-600 p-2 rounded">Home</Link>
        <Link to="/dashboard" className="hover:bg-blue-600 p-2 rounded">Chat Assistant</Link>
        <Link to="/flashcards" className="hover:bg-blue-600 p-2 rounded">Flashcards</Link>
        <Link to="/flashcard-history" className="hover:bg-blue-600 p-2 rounded">Flashcard History</Link>
        <Link to="/quiz" className="hover:bg-blue-600 p-2 rounded">Quiz Generator</Link>
        <Link to="/progress" className="hover:bg-blue-600 p-2 rounded">📊 Progress</Link>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-600 p-2 rounded text-left"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
