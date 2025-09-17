// src/pages/Login.js
import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Direct Firebase authentication - no OTP required for login
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
      toast.success("Welcome back! Login successful", {
        icon: '🎉',
        className: 'toast-auth-success',
        autoClose: 2000,
      });
      navigate("/home");
    } catch (error) {
      setError(error.message);
      toast.error("Login failed. Please check your credentials.", {
        className: 'toast-auth-error',
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome back
          </h2>
          <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to your AI Study Assistant account
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`relative block w-full px-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`relative block w-full px-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {error && (
            <div className={`p-3 rounded-lg text-sm ${darkMode
              ? 'bg-red-900/50 border border-red-800 text-red-300'
              : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
