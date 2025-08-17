import { auth } from '../firebaseConfig';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ProgressService {
    // Get current user's ID token
    async getAuthToken() {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }
        return await user.getIdToken();
    }

    // Get user's progress data
    async getUserProgress() {
        try {
            const token = await this.getAuthToken();

            const response = await fetch(`${BASE_URL}/progress`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch progress: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user progress:', error);
            throw error;
        }
    }

    // Log a study session
    async logStudySession(activityType, activityData, timeSpent = 0) {
        try {
            const token = await this.getAuthToken();

            const response = await fetch(`${BASE_URL}/progress/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    activityType,
                    activityData,
                    timeSpent
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to log study session: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error logging study session:', error);
            throw error;
        }
    }

    // Get analytics data
    async getAnalytics(period = 'week') {
        try {
            const token = await this.getAuthToken();

            const response = await fetch(`${BASE_URL}/progress/analytics?period=${period}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch analytics: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    }

    // Helper methods for specific activities

    // Log flashcard study session
    async logFlashcardSession(flashcardData, timeSpent = 0) {
        return this.logStudySession('flashcard', {
            flashcardId: flashcardData.id,
            topic: flashcardData.topic,
            isLearned: flashcardData.isLearned || true,
            difficulty: flashcardData.difficulty
        }, timeSpent);
    }

    // Log quiz completion
    async logQuizSession(quizData, timeSpent = 0) {
        return this.logStudySession('quiz', {
            quizId: quizData.id,
            topic: quizData.topic,
            score: quizData.score,
            totalQuestions: quizData.totalQuestions,
            percentage: Math.round((quizData.score / quizData.totalQuestions) * 100),
            difficulty: quizData.difficulty
        }, timeSpent);
    }

    // Log chat/study session
    async logChatSession(chatData, timeSpent = 0) {
        return this.logStudySession('chat', {
            topic: chatData.topic || 'General Study',
            messagesCount: chatData.messagesCount || 1
        }, timeSpent);
    }

    // Get study streak information
    async getStudyStreak() {
        try {
            const progress = await this.getUserProgress();
            return {
                currentStreak: progress.stats?.currentStreak || 0,
                longestStreak: progress.stats?.longestStreak || 0,
                lastStudyDate: progress.stats?.lastStudyDate
            };
        } catch (error) {
            console.error('Error fetching study streak:', error);
            return { currentStreak: 0, longestStreak: 0, lastStudyDate: null };
        }
    }

    // Get weekly progress summary
    async getWeeklyProgress() {
        try {
            const analytics = await this.getAnalytics('week');
            return analytics.weeklyProgress || [];
        } catch (error) {
            console.error('Error fetching weekly progress:', error);
            return [];
        }
    }

    // Get top studied topics
    async getTopTopics(limit = 5) {
        try {
            const analytics = await this.getAnalytics();
            return analytics.topTopics?.slice(0, limit) || [];
        } catch (error) {
            console.error('Error fetching top topics:', error);
            return [];
        }
    }

    // Format time in minutes to readable format
    formatStudyTime(timeInMinutes) {
        if (timeInMinutes < 60) {
            return `${Math.round(timeInMinutes)}m`;
        } else if (timeInMinutes < 1440) { // less than 24 hours
            const hours = Math.floor(timeInMinutes / 60);
            const minutes = Math.round(timeInMinutes % 60);
            return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
        } else {
            const days = Math.floor(timeInMinutes / 1440);
            const hours = Math.floor((timeInMinutes % 1440) / 60);
            return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
        }
    }

    // Calculate progress percentage for a topic
    calculateTopicProgress(topic, targetGoal = 10) {
        const totalActivities = (topic.flashcardsCount || 0) + (topic.quizzesCount || 0);
        return Math.min(Math.round((totalActivities / targetGoal) * 100), 100);
    }

    // Get recent activity summary
    async getRecentActivitySummary(days = 7) {
        try {
            const analytics = await this.getAnalytics('week');
            const recentActivity = analytics.recentActivity || [];

            // Group by date
            const activityByDate = {};
            recentActivity.forEach(session => {
                const date = new Date(session.date).toDateString();
                if (!activityByDate[date]) {
                    activityByDate[date] = {
                        date,
                        flashcards: 0,
                        quizzes: 0,
                        studyTime: 0
                    };
                }

                activityByDate[date].studyTime += session.timeSpent || 0;

                if (session.activityType === 'flashcard' && session.activityData.isLearned) {
                    activityByDate[date].flashcards++;
                } else if (session.activityType === 'quiz') {
                    activityByDate[date].quizzes++;
                }
            });

            return Object.values(activityByDate).slice(0, days);
        } catch (error) {
            console.error('Error fetching recent activity summary:', error);
            return [];
        }
    }
}

export default new ProgressService();
