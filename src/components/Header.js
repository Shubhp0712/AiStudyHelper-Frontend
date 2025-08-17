import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setIsMenuOpen(false);
            navigate("/");
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Website Name */}
                    <div className="flex items-center">
                        <Link to="/home" className="text-xl font-bold hover:text-blue-200 transition-colors">
                            AIStudyHelper
                        </Link>
                    </div>

                    {/* Hamburger Menu Button */}
                    {currentUser && (
                        <div className="relative">
                            <button
                                onClick={toggleMenu}
                                className="p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                                aria-label="Open menu"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <Link
                                        to="/home"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Chat Assistant
                                    </Link>
                                    <Link
                                        to="/flashcards"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Flashcards
                                    </Link>
                                    <Link
                                        to="/flashcard-history"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Flashcard History
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <hr className="my-1" />
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop for mobile menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-40"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
        </header>
    );
};

export default Header;
