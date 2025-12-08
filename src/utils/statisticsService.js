// statisticsService.js - Service to fetch dynamic dashboard statistics
import { getFlashcards } from './flashcardService';
import { getUserQuizzes } from './quizService';
import progressService from './progressService';

// const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://aistudyhelper-backend.onrender.com';

/**
 * Get user statistics for dashboard
 * @returns {Promise<Object>} Statistics object with study sessions, cards created, quiz score, and study streak
 */
export const getUserStatistics = async () => {
    try {
        // Try to fetch from backend first
        const backendStats = await fetchBackendStatistics().catch(() => null);

        // Fetch data from different sources for fallback
        const [flashcards, quizzes, progress] = await Promise.all([
            getFlashcards().catch(() => ({ flashcards: [] })),
            getUserQuizzes().catch(() => []),
            progressService.getUserProgress().catch(() => ({ totalStudyTime: 0, streak: 0, sessions: [] }))
        ]);

        // Calculate statistics (use backend data as priority, fallback to calculated)
        const stats = {
            studySessions: backendStats?.studySessions ?? calculateStudySessions(progress),
            cardsCreated: calculateCardsCreated(flashcards), // Always calculate from flashcards service
            quizScore: backendStats?.quizScore ?? calculateAverageQuizScore(quizzes),
            studyStreak: backendStats?.studyStreak ?? calculateStudyStreak(progress)
        };

        return stats;
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        // Return default values on error
        return {
            studySessions: 0,
            cardsCreated: 0,
            quizScore: 0,
            studyStreak: 0
        };
    }
};

/**
 * Fetch statistics from backend API
 */
const fetchBackendStatistics = async () => {
    try {
        // Get auth token
        const { auth } = await import('../firebaseConfig');
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const token = await user.getIdToken();

        const response = await fetch(`${API_BASE_URL}/api/progress/statistics`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching backend statistics:', error);
        throw error;
    }
};

/**
 * Calculate total study sessions from progress data
 */
const calculateStudySessions = (progress) => {
    try {
        if (progress && progress.sessions) {
            return progress.sessions.length;
        }
        if (progress && progress.totalStudyTime) {
            // Estimate sessions based on study time (assuming 30 min average per session)
            return Math.ceil(progress.totalStudyTime / 30);
        }
        return 0;
    } catch (error) {
        console.error('Error calculating study sessions:', error);
        return 0;
    }
};

/**
 * Calculate total cards created from flashcards data
 */
const calculateCardsCreated = (flashcardsData) => {
    try {
        if (flashcardsData && flashcardsData.flashcards) {
            return flashcardsData.flashcards.length;
        }
        if (Array.isArray(flashcardsData)) {
            return flashcardsData.length;
        }
        return 0;
    } catch (error) {
        console.error('Error calculating cards created:', error);
        return 0;
    }
};

/**
 * Calculate average quiz score from quiz data
 */
const calculateAverageQuizScore = (quizzes) => {
    try {
        if (!Array.isArray(quizzes) || quizzes.length === 0) {
            return 0;
        }

        const totalScore = quizzes.reduce((sum, quiz) => {
            const score = quiz.score || 0;
            return sum + score;
        }, 0);

        const averageScore = totalScore / quizzes.length;
        return Math.round(averageScore);
    } catch (error) {
        console.error('Error calculating quiz score:', error);
        return 0;
    }
};

/**
 * Calculate study streak from progress data
 */
const calculateStudyStreak = (progress) => {
    try {
        if (progress && typeof progress.streak === 'number') {
            return progress.streak;
        }

        // If no streak data, calculate from sessions
        if (progress && progress.sessions) {
            return calculateStreakFromSessions(progress.sessions);
        }

        return 0;
    } catch (error) {
        console.error('Error calculating study streak:', error);
        return 0;
    }
};

/**
 * Calculate streak from session dates
 */
const calculateStreakFromSessions = (sessions) => {
    try {
        if (!Array.isArray(sessions) || sessions.length === 0) {
            return 0;
        }

        // Sort sessions by date (most recent first)
        const sortedSessions = sessions
            .map(session => new Date(session.date || session.createdAt || session.timestamp))
            .filter(date => !isNaN(date))
            .sort((a, b) => b - a);

        if (sortedSessions.length === 0) {
            return 0;
        }

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedSessions.length; i++) {
            const sessionDate = new Date(sortedSessions[i]);
            sessionDate.setHours(0, 0, 0, 0);

            const dayDifference = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));

            if (dayDifference === streak) {
                streak++;
            } else if (dayDifference === streak + 1) {
                // Allow for one day gap
                streak++;
            } else {
                break;
            }
        }

        return streak;
    } catch (error) {
        console.error('Error calculating streak from sessions:', error);
        return 0;
    }
};

/**
 * Format statistics for display
 */
export const formatStatistics = (stats) => {
    return {
        studySessions: stats.studySessions.toString(),
        cardsCreated: stats.cardsCreated.toString(),
        quizScore: stats.quizScore > 0 ? `${stats.quizScore}%` : '0%',
        studyStreak: stats.studyStreak > 0 ? `${stats.studyStreak} day${stats.studyStreak !== 1 ? 's' : ''}` : '0 days'
    };
};

export default {
    getUserStatistics,
    formatStatistics
};