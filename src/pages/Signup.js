// src/pages/Signup.js
import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import OTPVerification from "../components/OTPVerification";
import { otpService } from "../utils/otpService";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("signup"); // "signup" or "otp"
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, send OTP for email verification
      await otpService.sendOTP(email);
      setStep("otp");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp) => {
    setOtpLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      // Verify OTP first
      await otpService.verifyOTP(email, otp);
      setOtpSuccess("Email verified successfully!");

      // If OTP is verified, proceed with Firebase account creation
      setTimeout(async () => {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          navigate("/home");
        } catch (firebaseError) {
          setOtpError("Account creation failed: " + firebaseError.message);
          setOtpSuccess("");
        }
      }, 1000);

    } catch (error) {
      setOtpError(error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOTPResend = async () => {
    try {
      await otpService.resendOTP(email);
      setOtpSuccess("New verification code sent!");
      setOtpError("");
    } catch (error) {
      setOtpError(error.message);
    }
  };

  const handleBackToSignup = () => {
    setStep("signup");
    setOtpError("");
    setOtpSuccess("");
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {step === "signup" ? (
          <>
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Create your account
              </h2>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Join AI Study Assistant and start learning smarter
              </p>
            </div>

            {/* Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={`relative block w-full px-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
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
                    autoComplete="new-password"
                    required
                    className={`relative block w-full px-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`relative block w-full px-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${darkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
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
                      Creating account...
                    </div>
                  ) : (
                    'Create account'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Terms and Privacy */}
              <div className="text-center">
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </form>
          </>
        ) : (
          <OTPVerification
            email={email}
            onVerify={handleOTPVerify}
            onBack={handleBackToSignup}
            onResend={handleOTPResend}
            loading={otpLoading}
            error={otpError}
            success={otpSuccess}
          />
        )}
      </div>
    </div>
  );
}
