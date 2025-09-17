import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

const About = () => {
    const { darkMode } = useDarkMode();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            {/* Header */}
            <div className={`border-b transition-colors duration-300 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                AI Study Assistant
                            </span>
                        </Link>
                        <nav className="flex items-center space-x-6">
                            <Link
                                to="/"
                                className={`hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className="text-blue-600 font-medium"
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                className={`hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                Contact
                            </Link>
                            <Link
                                to="/login"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                            >
                                Sign In
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        About AI Study Assistant
                    </h1>
                    <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        Revolutionizing education through AI-powered learning tools that adapt to your unique learning style and pace.
                    </p>
                </div>

                {/* Mission Section */}
                <div className={`rounded-2xl p-8 mb-12 ${darkMode
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white border border-gray-200 shadow-lg'
                    }`}>
                    <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        Our Mission
                    </h2>
                    <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        To democratize quality education by providing intelligent, personalized learning experiences that help students achieve their full potential. We believe that everyone deserves access to world-class educational tools that adapt to their individual needs and learning preferences.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className={`rounded-xl p-6 ${darkMode
                            ? 'bg-gray-800 border border-gray-700'
                            : 'bg-white border border-gray-200 shadow-md'
                        }`}>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            AI-Powered Learning
                        </h3>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Our advanced AI algorithms analyze your learning patterns and create personalized study plans that maximize retention and understanding.
                        </p>
                    </div>

                    <div className={`rounded-xl p-6 ${darkMode
                            ? 'bg-gray-800 border border-gray-700'
                            : 'bg-white border border-gray-200 shadow-md'
                        }`}>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Progress Tracking
                        </h3>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Detailed analytics and progress reports help you understand your strengths and identify areas for improvement.
                        </p>
                    </div>

                    <div className={`rounded-xl p-6 ${darkMode
                            ? 'bg-gray-800 border border-gray-700'
                            : 'bg-white border border-gray-200 shadow-md'
                        }`}>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Smart Flashcards
                        </h3>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Create, organize, and study with intelligent flashcards that adapt to your learning pace and memory retention.
                        </p>
                    </div>

                    <div className={`rounded-xl p-6 ${darkMode
                            ? 'bg-gray-800 border border-gray-700'
                            : 'bg-white border border-gray-200 shadow-md'
                        }`}>
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Interactive Quizzes
                        </h3>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Test your knowledge with dynamic quizzes that provide instant feedback and detailed explanations.
                        </p>
                    </div>
                </div>

                {/* Vision Section */}
                <div className={`rounded-2xl p-8 mb-12 ${darkMode
                        ? 'bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700'
                        : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                    }`}>
                    <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        Our Vision
                    </h2>
                    <p className={`text-lg leading-relaxed ${darkMode ? 'text-blue-100' : 'text-gray-700'
                        }`}>
                        We envision a future where artificial intelligence seamlessly integrates with human learning, creating personalized educational experiences that are engaging, effective, and accessible to learners worldwide. Our goal is to empower students to achieve academic excellence while developing critical thinking skills that will serve them throughout their lives.
                    </p>
                </div>

                {/* Team Section */}
                <div className="text-center">
                    <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        Built with ❤️ for Students
                    </h2>
                    <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        Our team of educators, developers, and AI specialists work tirelessly to create the best learning experience possible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                        >
                            Get in Touch
                        </Link>
                        <Link
                            to="/signup"
                            className={`px-8 py-3 rounded-lg font-medium border-2 transition-all duration-200 ${darkMode
                                    ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                                }`}
                        >
                            Start Learning Today
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`border-t mt-16 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                AI Study Assistant
                            </span>
                        </div>
                        <div className="flex space-x-6">
                            <Link
                                to="/terms"
                                className={`text-sm hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                            >
                                Terms of Service
                            </Link>
                            <Link
                                to="/privacy"
                                className={`text-sm hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;