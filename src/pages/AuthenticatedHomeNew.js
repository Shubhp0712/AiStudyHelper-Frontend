import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { getUserStatistics, formatStatistics } from '../utils/statisticsService';

const AuthenticatedHome = () => {
    const { currentUser } = useAuth();
    const { darkMode } = useDarkMode();
    const [statistics, setStatistics] = useState({
        studySessions: '0',
        cardsCreated: '0',
        quizScore: '0%',
        studyStreak: '0 days'
    });
    const [loading, setLoading] = useState(true);

    const features = [
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'Smart Flashcards',
            description: 'Generate AI-powered flashcards from your study materials to enhance memorization and recall.',
            link: '/flashcards',
            color: 'blue',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Interactive Quizzes',
            description: 'Test your knowledge with adaptive quizzes that adjust to your learning progress and identify weak areas.',
            link: '/quiz',
            color: 'green',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Progress Tracking',
            description: 'Monitor your learning journey with detailed analytics and insights to optimize your study sessions.',
            link: '/progress',
            color: 'purple',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            title: 'Study History',
            description: 'Access your complete learning history and revisit previous topics to reinforce your knowledge.',
            link: '/history',
            color: 'orange',
            gradient: 'from-orange-500 to-red-500'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            title: 'AI Study Assistant',
            description: 'Get instant help and explanations on any topic with our intelligent AI-powered chat assistant.',
            link: '/dashboard',
            color: 'indigo',
            gradient: 'from-indigo-500 to-blue-500'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Export & Share',
            description: 'Export your flashcards and progress reports as PDF documents to share or study offline.',
            link: '/flashcards',
            color: 'teal',
            gradient: 'from-teal-500 to-cyan-500'
        }
    ];

    // Fetch user statistics on component mount
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const stats = await getUserStatistics();
                const formattedStats = formatStatistics(stats);
                setStatistics(formattedStats);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                // Keep default values on error
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchStatistics();
        }
    }, [currentUser]);

    const quickStats = [
        { label: 'Study Sessions', value: loading ? '...' : statistics.studySessions, icon: '📚' },
        { label: 'Cards Created', value: loading ? '...' : statistics.cardsCreated, icon: '🧠' },
        { label: 'Quiz Score', value: loading ? '...' : statistics.quizScore, icon: '🎯' },
        { label: 'Study Streak', value: loading ? '...' : statistics.studyStreak, icon: '🔥' }
    ];

    return (
        <Layout>
            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                {/* Hero Section */}
                <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
                    } py-16`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                Welcome back,{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {currentUser?.email?.split('@')[0] || 'Student'}
                                </span>!
                            </h1>
                            <p className={`text-xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                Your intelligent study companion is ready to help you learn better.
                                Continue your learning journey with AI-powered tools designed for success.
                            </p>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                                {quickStats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${darkMode
                                            ? 'bg-gray-800/50 backdrop-blur-sm'
                                            : 'bg-white/80 backdrop-blur-sm'
                                            } shadow-lg`}
                                    >
                                        <div className="text-3xl mb-2">{stat.icon}</div>
                                        <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {stat.value}
                                        </div>
                                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Your Learning Tools
                        </h2>
                        <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Explore powerful features designed to enhance your learning experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Link
                                key={index}
                                to={feature.link}
                                className={`group p-8 rounded-2xl transition-all duration-300 hover:scale-105 transform ${darkMode
                                    ? 'bg-gray-800 hover:bg-gray-700 shadow-lg hover:shadow-2xl'
                                    : 'bg-white hover:bg-gray-50 shadow-lg hover:shadow-2xl'
                                    }`}
                            >
                                <div className={`text-${feature.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {feature.title}
                                </h3>
                                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {feature.description}
                                </p>
                                <div className={`inline-flex items-center font-medium text-${feature.color}-600 group-hover:text-${feature.color}-700 transition-colors duration-200`}>
                                    Get Started
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Quick Actions
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/flashcards"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Create Flashcards
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </Link>
                            <Link
                                to="/quiz"
                                className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${darkMode
                                    ? 'text-gray-300 border-2 border-gray-600 hover:border-gray-500 hover:text-white'
                                    : 'text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:text-gray-900'
                                    }`}
                            >
                                Take a Quiz
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AuthenticatedHome;
