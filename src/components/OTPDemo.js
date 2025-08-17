import React, { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { otpService } from '../utils/otpService';

const OTPDemo = () => {
    const { darkMode } = useDarkMode();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('email'); // 'email', 'otp'
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await otpService.sendOTP(email);
            setMessage('OTP sent successfully! Check your email.');
            setStep('otp');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await otpService.verifyOTP(email, otp);
            setMessage('OTP verified successfully! ✅');
            setTimeout(() => {
                setStep('email');
                setEmail('');
                setOtp('');
                setMessage('');
            }, 2000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await otpService.resendOTP(email);
            setMessage('New OTP sent! Check your email.');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen py-12 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            <div className="max-w-md mx-auto">
                <div className={`p-8 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                    <div className="text-center mb-6">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            OTP Verification Demo
                        </h2>
                        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Test the email OTP verification system
                        </p>
                    </div>

                    {step === 'email' ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    OTP Code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="123456"
                                    maxLength={6}
                                    required
                                />
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    Enter the 6-digit code sent to {email}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={loading}
                                    className={`px-4 py-3 border rounded-xl font-medium transition-all duration-200 ${darkMode
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Resend
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className={`w-full py-2 text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500'
                                    }`}
                            >
                                ← Back to Email
                            </button>
                        </form>
                    )}

                    {message && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode
                                ? 'bg-green-900/50 border border-green-800 text-green-300'
                                : 'bg-green-50 border border-green-200 text-green-600'
                            }`}>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode
                                ? 'bg-red-900/50 border border-red-800 text-red-300'
                                : 'bg-red-50 border border-red-200 text-red-600'
                            }`}>
                            {error}
                        </div>
                    )}

                    <div className={`mt-6 p-4 rounded-lg text-xs ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                        <p className="font-semibold mb-2">Setup Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Configure EMAIL_USER and EMAIL_PASS in server/.env</li>
                            <li>Use Gmail App Password for EMAIL_PASS</li>
                            <li>Check console logs for OTP during development</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPDemo;
