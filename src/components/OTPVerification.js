import React, { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '../context/DarkModeContext';

const OTPVerification = ({
    email,
    onVerify,
    onBack,
    onResend,
    loading,
    error,
    success
}) => {
    const { darkMode } = useDarkMode();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [canResend, setCanResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleChange = (index, value) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setOtp(newOtp);

        // Focus last filled input or first empty
        const lastFilledIndex = Math.min(pastedData.length - 1, 5);
        inputRefs.current[lastFilledIndex]?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length === 6) {
            onVerify(otpString);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        try {
            await onResend();
            setTimeLeft(600);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            console.error('Resend failed:', error);
        } finally {
            setResendLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    Check your email
                </h2>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    We've sent a 6-digit verification code to
                </p>
                <p className="font-medium text-blue-600 break-all">
                    {email}
                </p>
            </div>

            {/* OTP Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className={`block text-sm font-medium mb-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        Enter verification code
                    </label>
                    <div className="flex justify-center space-x-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className={`w-12 h-12 text-center text-lg font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${darkMode
                                        ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                    } ${digit ? 'border-blue-500' : ''}`}
                                maxLength={1}
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                        ))}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={`p-3 rounded-lg text-sm text-center ${darkMode
                            ? 'bg-red-900/50 border border-red-800 text-red-300'
                            : 'bg-red-50 border border-red-200 text-red-600'
                        }`}>
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className={`p-3 rounded-lg text-sm text-center ${darkMode
                            ? 'bg-green-900/50 border border-green-800 text-green-300'
                            : 'bg-green-50 border border-green-200 text-green-600'
                        }`}>
                        {success}
                    </div>
                )}

                {/* Timer */}
                <div className="text-center">
                    {timeLeft > 0 ? (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Code expires in{' '}
                            <span className="font-medium text-blue-600">
                                {formatTime(timeLeft)}
                            </span>
                        </p>
                    ) : (
                        <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'
                            }`}>
                            Code has expired. Please request a new one.
                        </p>
                    )}
                </div>

                {/* Verify Button */}
                <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {loading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </div>
                    ) : (
                        'Verify Code'
                    )}
                </button>

                {/* Resend and Back buttons */}
                <div className="flex flex-col space-y-3">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={!canResend || resendLoading}
                        className={`text-sm font-medium transition-colors duration-200 ${canResend
                                ? 'text-blue-600 hover:text-blue-500 cursor-pointer'
                                : darkMode
                                    ? 'text-gray-500 cursor-not-allowed'
                                    : 'text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {resendLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending new code...
                            </div>
                        ) : (
                            canResend ? "Didn't receive the code? Resend" : "Resend code"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className={`text-sm font-medium transition-colors duration-200 ${darkMode
                                ? 'text-gray-400 hover:text-gray-300'
                                : 'text-gray-600 hover:text-gray-500'
                            }`}
                    >
                        ← Back to login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OTPVerification;
