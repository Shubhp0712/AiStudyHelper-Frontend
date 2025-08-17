import React from 'react';
import Layout from '../components/Layout';
import ProgressDashboard from '../components/ProgressDashboard';
import { useDarkMode } from '../context/DarkModeContext';

const ProgressPage = () => {
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
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className={`text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Learning Progress
                                </h1>
                                <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    Track your learning journey with detailed analytics and insights
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Dashboard Component */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProgressDashboard />
                </div>
            </div>
        </Layout>
    );
};

export default ProgressPage;
