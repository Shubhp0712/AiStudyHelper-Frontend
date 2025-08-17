// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AuthenticatedHome from "./pages/AuthenticatedHome";
import PrivateRoute from "./components/PrivateRoute";
import FlashcardsPage from "./pages/FlashcardsPage";
import FlashcardHistory from "./pages/FlashcardHistory";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/ProgressPage";
import Profile from "./pages/Profile";

// Component to handle redirecting logged-in users
const HomeRedirect = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return <Home />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <AuthenticatedHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/flashcards"
          element={
            <PrivateRoute>
              <FlashcardsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/flashcard-history"
          element={
            <PrivateRoute>
              <FlashcardHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <QuizPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <PrivateRoute>
              <ProgressPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
