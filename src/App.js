// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { SidebarProvider } from "./context/SidebarContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './components/CustomToast.css';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AuthenticatedHome from "./pages/AuthenticatedHome";
import PrivateRoute from "./components/PrivateRoute";
import FlashcardsPage from "./pages/FlashcardsPage";
import FlashcardHistory from "./pages/FlashcardHistory";
import StudyHistory from "./pages/StudyHistory";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/ProgressPage";
import Profile from "./pages/Profile";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
          path="/history"
          element={
            <PrivateRoute>
              <StudyHistory />
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
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <SidebarProvider>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            style={{ zIndex: 9999 }}
          />
        </SidebarProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
