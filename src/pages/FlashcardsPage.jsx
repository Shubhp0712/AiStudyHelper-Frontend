import React from "react";
import Layout from "../components/Layout";
import FlashcardGenerator from "../components/Flashcards/FlashcardGenerator";
import { useDarkMode } from "../context/DarkModeContext";

const FlashcardsPage = () => {
    const { darkMode } = useDarkMode();

    return (
        <Layout>
            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                {/* Header Section */}
                <div className={`${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'
                    } py-8`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center mb-4">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className={`text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Smart Flashcards
                                </h1>
                                <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    Generate AI-powered flashcards from your study materials to enhance memorization
                                </p>
                            </div>
                        </div>

                        {/* Feature highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'
                                } backdrop-blur-sm`}>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        AI-Powered Generation
                                    </span>
                                </div>
                            </div>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'
                                } backdrop-blur-sm`}>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Interactive Learning
                                    </span>
                                </div>
                            </div>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'
                                } backdrop-blur-sm`}>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Progress Tracking
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flashcard Generator Component */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <FlashcardGenerator />
                </div>
            </div>
        </Layout>
    );
};

export default FlashcardsPage;
