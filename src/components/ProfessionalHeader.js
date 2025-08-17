import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import DarkModeToggle from './DarkModeToggle';

const ProfessionalHeader = () => {
    const { currentUser, logout } = useAuth();
    const { darkMode } = useDarkMode();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const isActivePage = (path) => {
        return location.pathname === path;
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { path: '/home', label: 'Home', icon: '🏠' },
        { path: '/flashcards', label: 'Flashcards', icon: '🧠' },
        { path: '/quiz', label: 'Quiz', icon: '❓' },
        { path: '/history', label: 'History', icon: '📚' },
        { path: '/progress', label: 'Progress', icon: '📊' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    return (
        <>
            <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${darkMode
                ? 'bg-gray-900/95 border-gray-700 backdrop-blur-md'
                : 'bg-white/95 border-gray-200 backdrop-blur-md'
                }`}>
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
                        {/* Logo and Brand */}
                        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0 min-w-0 max-w-[200px] sm:max-w-none">
                            <Link to={currentUser ? "/home" : "/"} className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 group min-w-0 flex-shrink-0">
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center font-bold text-white text-xs sm:text-sm lg:text-lg transition-all duration-300 group-hover:scale-105 flex-shrink-0 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-600 to-purple-700'
                                    }`}>
                                    AI
                                </div>
                                <span className={`text-xs sm:text-sm lg:text-lg xl:text-xl font-bold transition-colors duration-300 truncate ${darkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'
                                    }`}>
                                    AiStudyHelper
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links - Only show if user is authenticated */}
                        {currentUser && (
                            <nav className="hidden md:flex items-center space-x-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${isActivePage(link.path)
                                            ? darkMode
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-blue-600 text-white shadow-lg'
                                            : darkMode
                                                ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-lg">{link.icon}</span>
                                        <span>{link.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        )}

                        {/* Right side - User info and controls */}
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            {/* Dark Mode Toggle */}
                            <DarkModeToggle />

                            {currentUser ? (
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    {/* Mobile Menu Button */}
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        title=""
                                        className={`md:hidden p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${darkMode
                                            ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                    {/* Desktop Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className={`hidden md:flex px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 items-center space-x-2 ${darkMode
                                            ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="hidden lg:inline">Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <Link
                                        to="/login"
                                        className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${darkMode
                                            ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {currentUser && isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={closeMobileMenu}
                    ></div>

                    {/* Sidebar */}
                    <div className={`fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out ${darkMode ? 'bg-gray-900' : 'bg-white'
                        } shadow-xl`}>
                        {/* Sidebar Header */}
                        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-600 to-purple-700'
                                    }`}>
                                    AI
                                </div>
                                <span className={`text-lg font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    AiStudyHelper
                                </span>
                            </div>
                            <button
                                onClick={closeMobileMenu}
                                className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${darkMode
                                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Sidebar Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={closeMobileMenu}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActivePage(link.path)
                                        ? darkMode
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-blue-600 text-white shadow-lg'
                                        : darkMode
                                            ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-xl">{link.icon}</span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Sidebar Footer */}
                        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    closeMobileMenu();
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${darkMode
                                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfessionalHeader;
