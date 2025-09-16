import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useDarkMode } from "../context/DarkModeContext";
import { getFlashcards } from "../utils/flashcardService";
import { getUserQuizzes } from "../utils/quizService";
import progressService from "../utils/progressService";

const StudyHistory = () => {
    const { darkMode } = useDarkMode();
    const [historyData, setHistoryData] = useState({
        flashcards: [],
        quizzes: [],
        sessions: [],
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalFlashcards: 0,
        totalQuizzes: 0,
        totalSessions: 0,
        studyTime: 0,
        streak: 0
    });

    useEffect(() => {
        fetchAllHistoryData();
    }, []);

    const fetchAllHistoryData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [flashcardsData, quizzesArray, progressData, analyticsData] = await Promise.all([
                getFlashcards().catch(err => {
                    console.error('Error fetching flashcards:', err);
                    return { flashcards: [] };
                }),
                getUserQuizzes().catch(err => {
                    console.error('Error fetching quizzes:', err);
                    return [];
                }),
                progressService.getUserProgress().catch(err => {
                    console.error('Error fetching progress:', err);
                    return null;
                }),
                progressService.getAnalytics().catch(err => {
                    console.error('Error fetching analytics:', err);
                    return null;
                })
            ]);

            // Process flashcards data
            const validFlashcards = flashcardsData.flashcards?.filter(card =>
                card.topic &&
                card.flashcards &&
                Array.isArray(card.flashcards) &&
                card.flashcards.length > 0
            ) || [];

            // Process quiz data - be more lenient with filtering
            const validQuizzes = Array.isArray(quizzesArray) ? quizzesArray.filter(quiz => {
                console.log('Processing quiz:', quiz);
                // More lenient filtering - just require that it's a quiz object
                return quiz && (quiz.topic || quiz.questions || quiz.quizData);
            }) : [];

            console.log('Valid quizzes after filtering:', validQuizzes);

            // Process progress data
            const progressStats = progressData?.stats || {};
            const analytics = analyticsData || {};

            console.log('Raw flashcards data:', flashcardsData);
            console.log('Raw quizzes array:', quizzesArray);
            console.log('Progress data:', progressData);
            console.log('Analytics data:', analyticsData);
            console.log('Progress stats:', progressStats);

            // Create recent activity timeline
            const recentActivity = [];

            // Add activities from progress sessions first (most accurate)
            if (progressData?.recentSessions) {
                progressData.recentSessions.forEach(session => {
                    const activityData = session.activityData || {};
                    recentActivity.push({
                        type: session.activityType,
                        title: session.activityType === 'flashcard'
                            ? `Studied flashcards: ${activityData.topic || 'Unknown topic'}`
                            : session.activityType === 'quiz'
                                ? `Completed quiz: ${activityData.topic || 'Unknown topic'}`
                                : `Study session: ${activityData.topic || 'General'}`,
                        subtitle: session.activityType === 'flashcard'
                            ? activityData.isLearned ? 'Card learned' : 'Card reviewed'
                            : session.activityType === 'quiz'
                                ? `Score: ${activityData.percentage || activityData.score || 0}%`
                                : `${session.timeSpent || 0} minutes`,
                        date: session.date,
                        icon: session.activityType === 'flashcard' ? '🧠' :
                            session.activityType === 'quiz' ? '❓' : '💬',
                        topic: activityData.topic || 'Unknown',
                        data: session
                    });
                });
            }

            // Add flashcard activities (for historical data not in sessions)
            validFlashcards.forEach(card => {
                // Only add if not already in recent sessions
                const existingSession = recentActivity.find(activity =>
                    activity.type === 'flashcard' && activity.topic === card.topic
                );
                if (!existingSession) {
                    recentActivity.push({
                        type: 'flashcard',
                        title: `Created flashcards for ${card.topic}`,
                        subtitle: `${card.flashcards.length} cards`,
                        date: card.createdAt || card.updatedAt,
                        icon: '🧠',
                        topic: card.topic,
                        data: card
                    });
                }
            });

            // Add quiz activities (for historical data not in sessions)
            validQuizzes.forEach(quiz => {
                // Only add if not already in recent sessions
                const quizTopic = quiz.topic || quiz.title || quiz.quizData?.topic || 'Untitled Quiz';
                const existingSession = recentActivity.find(activity =>
                    activity.type === 'quiz' && activity.topic === quizTopic
                );
                if (!existingSession) {
                    recentActivity.push({
                        type: 'quiz',
                        title: `Completed quiz: ${quizTopic}`,
                        subtitle: (quiz.score || quiz.percentage || quiz.quizData?.score) ?
                            `Score: ${quiz.score || quiz.percentage || quiz.quizData?.score}%` : 'Quiz completed',
                        date: quiz.createdAt || quiz.updatedAt || quiz.completedAt,
                        icon: '❓',
                        topic: quizTopic,
                        data: quiz
                    });
                }
            });

            // Sort by date (most recent first)
            recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Calculate statistics with better fallbacks
            const totalFlashcardCount = validFlashcards.reduce((total, card) =>
                total + (card.flashcards?.length || 0), 0
            );

            // Use actual progress stats if available, otherwise calculate from data
            const calculatedStats = {
                totalFlashcards: progressStats.totalFlashcardsLearned ||
                    (progressData?.recentSessions?.filter(s => s.activityType === 'flashcard').length) ||
                    totalFlashcardCount,
                totalQuizzes: progressStats.totalQuizzesTaken ||
                    (progressData?.recentSessions?.filter(s => s.activityType === 'quiz').length) ||
                    validQuizzes.length,
                totalSessions: progressData?.recentSessions?.length || recentActivity.length,
                studyTime: progressStats.totalStudyTime ||
                    (progressData?.recentSessions?.reduce((total, session) => total + (session.timeSpent || 0), 0)) ||
                    0,
                streak: progressStats.currentStreak || 0,
                averageScore: progressStats.averageQuizScore || 0,
                topicsStudied: progressData?.topicsStudied?.length || 0
            }; setHistoryData({
                flashcards: validFlashcards,
                quizzes: validQuizzes,
                sessions: progressData?.recentSessions || [],
                recentActivity: recentActivity.slice(0, 20) // Show last 20 activities
            });

            setStats(calculatedStats);

        } catch (error) {
            console.error("Error fetching study history:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatStudyTime = (minutes) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => (
        <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${darkMode
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {title}
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`text-3xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    const ActivityItem = ({ activity }) => (
        <div className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${darkMode
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
            <div className="flex items-start space-x-3">
                <div className="text-2xl flex-shrink-0 mt-1">
                    {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activity.title}
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.subtitle}
                    </p>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {formatDate(activity.date)}
                    </p>
                </div>
                <div className="flex-shrink-0">
                    {activity.type === 'flashcard' ? (
                        <Link
                            to="/flashcard-history"
                            className={`text-xs px-2 py-1 rounded-md transition-colors ${darkMode
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                        >
                            View Cards
                        </Link>
                    ) : (
                        <Link
                            to="/quiz"
                            className={`text-xs px-2 py-1 rounded-md transition-colors ${darkMode
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                        >
                            View Quiz
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    const TabButton = ({ id, label, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
        >
            {label}
        </button>
    );

    if (loading) {
        return (
            <Layout>
                <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Study History
                        </h1>
                        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Access your complete learning history and revisit previous topics to reinforce your knowledge.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex space-x-2 mb-8">
                        <TabButton
                            id="overview"
                            label="Overview"
                            isActive={activeTab === 'overview'}
                            onClick={setActiveTab}
                        />
                        <TabButton
                            id="flashcards"
                            label="Flashcards"
                            isActive={activeTab === 'flashcards'}
                            onClick={setActiveTab}
                        />
                        <TabButton
                            id="quizzes"
                            label="Quizzes"
                            isActive={activeTab === 'quizzes'}
                            onClick={setActiveTab}
                        />
                        <TabButton
                            id="activity"
                            label="Recent Activity"
                            isActive={activeTab === 'activity'}
                            onClick={setActiveTab}
                        />
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Statistics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    title="Total Flashcards"
                                    value={stats.totalFlashcards}
                                    subtitle="Cards created"
                                    icon="🧠"
                                />
                                <StatCard
                                    title="Total Quizzes"
                                    value={stats.totalQuizzes}
                                    subtitle="Quizzes completed"
                                    icon="❓"
                                />
                                <StatCard
                                    title="Study Time"
                                    value={formatStudyTime(stats.studyTime)}
                                    subtitle="Total time spent"
                                    icon="⏱️"
                                />
                                <StatCard
                                    title="Current Streak"
                                    value={`${stats.streak} days`}
                                    subtitle="Keep it up!"
                                    icon="🔥"
                                />
                            </div>

                            {/* Recent Activity Preview with Summary*/}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Recent Activity Summary
                                    </h2>
                                    <button
                                        onClick={() => setActiveTab('activity')}
                                        className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                                            }`}
                                    >
                                        View Detailed Timeline
                                    </button>
                                </div>

                                {/* Activity Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>This Week</h3>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            {historyData.recentActivity.filter(activity => {
                                                const activityDate = new Date(activity.date);
                                                const weekAgo = new Date();
                                                weekAgo.setDate(weekAgo.getDate() - 7);
                                                return activityDate >= weekAgo;
                                            }).length}
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Activities</p>
                                    </div>

                                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Most Active Topic</h3>
                                        <p className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'} truncate`}>
                                            {(() => {
                                                const topicCounts = {};
                                                historyData.recentActivity.forEach(activity => {
                                                    const topic = activity.topic || 'Unknown';
                                                    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
                                                });
                                                const topTopic = Object.entries(topicCounts).sort(([, a], [, b]) => b - a)[0];
                                                return topTopic ? topTopic[0] : 'None';
                                            })()}
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Focus area</p>
                                    </div>

                                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Last Activity</h3>
                                        <p className={`text-lg font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                            {historyData.recentActivity.length > 0 ?
                                                new Date(historyData.recentActivity[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                : 'None'
                                            }
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date</p>
                                    </div>
                                </div>

                                {/* Quick Recent Activities */}
                                <div className="space-y-3">
                                    {historyData.recentActivity.slice(0, 3).map((activity, index) => (
                                        <ActivityItem key={index} activity={activity} />
                                    ))}
                                    {historyData.recentActivity.length === 0 && (
                                        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <p>No recent activity to display</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'flashcards' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Flashcard Collections
                                </h2>
                                <Link
                                    to="/flashcard-history"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    Manage Flashcards
                                </Link>
                            </div>

                            {historyData.flashcards.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {historyData.flashcards.map((collection, index) => (
                                        <div key={index} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${darkMode
                                            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                            }`}>
                                            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {collection.topic}
                                            </h3>
                                            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {collection.flashcards.length} cards
                                            </p>
                                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                Created: {formatDate(collection.createdAt)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <div className="text-6xl mb-4">🧠</div>
                                    <p className="text-lg">No flashcards created yet</p>
                                    <Link
                                        to="/flashcards"
                                        className={`inline-block mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${darkMode
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        Create Your First Flashcards
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'quizzes' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Quiz History
                                </h2>
                                <Link
                                    to="/quiz"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                >
                                    Take New Quiz
                                </Link>
                            </div>

                            {historyData.quizzes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {historyData.quizzes.map((quiz, index) => (
                                        <div key={index} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${darkMode
                                            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                            }`}>
                                            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {quiz.topic || quiz.title || quiz.quizData?.topic || 'Untitled Quiz'}
                                            </h3>
                                            <div className="flex items-center justify-between mb-4">
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {quiz.questions?.length || quiz.quizData?.questions?.length || 0} questions
                                                </p>
                                                {(quiz.score || quiz.percentage || quiz.quizData?.score) && (
                                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${(quiz.score || quiz.percentage || quiz.quizData?.score) >= 80
                                                            ? 'bg-green-100 text-green-800'
                                                            : (quiz.score || quiz.percentage || quiz.quizData?.score) >= 60
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {quiz.score || quiz.percentage || quiz.quizData?.score}%
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                Completed: {formatDate(quiz.createdAt || quiz.updatedAt || quiz.completedAt)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <div className="text-6xl mb-4">❓</div>
                                    <p className="text-lg">No quizzes completed yet</p>
                                    <Link
                                        to="/quiz"
                                        className={`inline-block mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${darkMode
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                    >
                                        Take Your First Quiz
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Detailed Activity Timeline
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Total: {historyData.recentActivity.length} activities
                                    </span>
                                </div>
                            </div>

                            {/* Activity Filters */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <button className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    All Activities
                                </button>
                                <button className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}>
                                    Flashcards ({historyData.recentActivity.filter(a => a.type === 'flashcard').length})
                                </button>
                                <button className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}>
                                    Quizzes ({historyData.recentActivity.filter(a => a.type === 'quiz').length})
                                </button>
                                <button className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}>
                                    This Week
                                </button>
                            </div>

                            {historyData.recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Group activities by date */}
                                    {(() => {
                                        const groupedActivities = historyData.recentActivity.reduce((groups, activity) => {
                                            const date = new Date(activity.date).toDateString();
                                            if (!groups[date]) {
                                                groups[date] = [];
                                            }
                                            groups[date].push(activity);
                                            return groups;
                                        }, {});

                                        return Object.entries(groupedActivities)
                                            .sort(([a], [b]) => new Date(b) - new Date(a))
                                            .map(([date, activities]) => (
                                                <div key={date} className="space-y-3">
                                                    <h3 className={`text-sm font-semibold sticky top-0 py-2 ${darkMode ? 'text-gray-300 bg-gray-900' : 'text-gray-700 bg-gray-50'
                                                        }`}>
                                                        {new Date(date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                        <span className={`ml-2 text-xs font-normal ${darkMode ? 'text-gray-500' : 'text-gray-500'
                                                            }`}>
                                                            ({activities.length} activities)
                                                        </span>
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {activities.map((activity, index) => (
                                                            <div key={index}>
                                                                <ActivityItem activity={activity} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ));
                                    })()}
                                </div>
                            ) : (
                                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <div className="text-6xl mb-4">📚</div>
                                    <p className="text-lg">No activity yet</p>
                                    <p className="text-sm mt-2">Start creating flashcards or taking quizzes to see your activity here</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default StudyHistory;