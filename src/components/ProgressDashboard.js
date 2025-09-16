import React, { useState, useEffect } from 'react';
import progressService from '../utils/progressService';
import ProgressPDFExport from './ProgressPDFExport';
import './ProgressDashboard.css';

const ProgressDashboard = () => {
    const [progress, setProgress] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProgressData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPeriod]);

    const loadProgressData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [progressData, analyticsData] = await Promise.all([
                progressService.getUserProgress(),
                progressService.getAnalytics(selectedPeriod)
            ]);

            setProgress(progressData);
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Error loading progress data:', error);
            setError('Failed to load progress data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (minutes) => {
        return progressService.formatStudyTime(minutes);
    };

    const getStreakEmoji = (streak) => {
        if (streak >= 30) return '🔥';
        if (streak >= 14) return '⚡';
        if (streak >= 7) return '✨';
        if (streak >= 3) return '💪';
        return '🌱';
    };

    if (loading) {
        return (
            <div className="progress-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your progress...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="progress-dashboard">
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={loadProgressData} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="progress-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1>📊 Study Progress</h1>
                <div className="header-actions">
                    <ProgressPDFExport progress={progress} analytics={analytics} />
                    <div className="period-selector">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="period-select"
                        >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <h3>{progress?.stats?.totalFlashcardsCreated || 0}</h3>
                        <p>Flashcards Created</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <h3>{progress?.stats?.totalQuizzesTaken || 0}</h3>
                        <p>Quizzes Completed</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <h3>{Math.round(progress?.stats?.averageQuizScore || 0)}%</h3>
                        <p>Average Score</p>
                    </div>
                </div>

                <div className="stat-card streak-card">
                    <div className="stat-icon">{getStreakEmoji(progress?.stats?.currentStreak || 0)}</div>
                    <div className="stat-content">
                        <h3>{progress?.stats?.currentStreak || 0}</h3>
                        <p>Day Streak</p>
                    </div>
                </div>
            </div>

            {/* Weekly Progress Chart */}
            {analytics?.weeklyProgress && analytics.weeklyProgress.length > 0 && (
                <div className="chart-section">
                    <h2>📅 Weekly Progress</h2>
                    <div className="weekly-chart">
                        {analytics.weeklyProgress.slice(0, 8).map((week, index) => (
                            <div key={week.week} className="week-bar-container">
                                <div
                                    className="week-bar"
                                    style={{
                                        height: `${Math.max((week.studyDays / 7) * 100, 5)}%`
                                    }}
                                    title={`Week ${week.week}: ${week.studyDays} study days`}
                                >
                                    <span className="week-label">
                                        {week.studyDays}
                                    </span>
                                </div>
                                <span className="week-number">W{week.week}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Top Topics */}
            {analytics?.topTopics && analytics.topTopics.length > 0 && (
                <div className="topics-section">
                    <h2>🎯 Top Study Topics</h2>
                    <div className="topics-list">
                        {analytics.topTopics.map((topic, index) => (
                            <div key={topic.topic} className="topic-item">
                                <div className="topic-info">
                                    <span className="topic-name">{topic.topic}</span>
                                    <span className="topic-stats">
                                        {topic.flashcardsCount} flashcards • {topic.quizzesCount} quizzes
                                        {topic.averageScore > 0 && (
                                            <span className="topic-score"> • {Math.round(topic.averageScore)}% avg</span>
                                        )}
                                    </span>
                                </div>
                                <div className="topic-progress">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${progressService.calculateTopicProgress(topic)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            {analytics?.recentActivity && analytics.recentActivity.length > 0 && (
                <div className="activity-section">
                    <h2>📋 Recent Activity</h2>
                    <div className="activity-list">
                        {analytics.recentActivity.slice(0, 10).map((session, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-icon">
                                    {session.activityType === 'flashcard' ? '🧠' :
                                        session.activityType === 'quiz' ? '📝' : '💬'}
                                </div>
                                <div className="activity-content">
                                    <span className="activity-type">
                                        {session.activityType === 'flashcard' ? 'Flashcard Study' :
                                            session.activityType === 'quiz' ? 'Quiz Completed' : 'Study Session'}
                                    </span>
                                    <span className="activity-details">
                                        {session.activityData.topic || 'General Study'}
                                        {session.activityType === 'quiz' && session.activityData.percentage && (
                                            <span className="score"> • {session.activityData.percentage}%</span>
                                        )}
                                    </span>
                                </div>
                                <div className="activity-time">
                                    {new Date(session.date).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {(!analytics?.recentActivity || analytics.recentActivity.length === 0) && (
                <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h3>Start Your Study Journey!</h3>
                    <p>Complete flashcards and quizzes to see your progress here.</p>
                </div>
            )}
        </div>
    );
};

export default ProgressDashboard;
