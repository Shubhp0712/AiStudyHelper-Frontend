import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import Layout from '../components/Layout';
import QuizGenerator from '../components/Quiz/QuizGenerator';
import QuizInterface from '../components/Quiz/QuizInterface';
import { getUserQuizzes, deleteQuiz } from '../utils/quizService';

const QuizPage = () => {
    const { currentUser } = useAuth();
    const { darkMode } = useDarkMode();
    const [currentView, setCurrentView] = useState('generator'); // 'generator', 'quiz', 'history'
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizHistory, setQuizHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentView === 'history') {
            loadQuizHistory();
        }
    }, [currentView]);

    const loadQuizHistory = async () => {
        setLoading(true);
        try {
            const quizzes = await getUserQuizzes();
            setQuizHistory(quizzes);
        } catch (error) {
            console.error('Error loading quiz history:', error);
            setError('Failed to load quiz history');
        } finally {
            setLoading(false);
        }
    };

    const handleQuizGenerated = (quiz) => {
        setCurrentQuiz(quiz);
        setCurrentView('quiz');
    };

    const handleQuizComplete = (results) => {
        console.log('Quiz completed with results:', results);
        // Here you could save quiz results to a separate collection
        // For now, we'll just show the results in the QuizInterface component
    };

    const handleRetryWrongAnswers = (wrongQuestions) => {
        // Create a new quiz with only wrong questions
        const retryQuiz = {
            ...currentQuiz,
            title: `${currentQuiz.title} - Retry`,
            questions: wrongQuestions
        };
        setCurrentQuiz(retryQuiz);
    };

    const handleDeleteQuiz = async (quizId) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await deleteQuiz(quizId);
                loadQuizHistory(); // Refresh the list
            } catch (error) {
                console.error('Error deleting quiz:', error);
                setError('Failed to delete quiz');
            }
        }
    };

    const handleViewQuiz = (quiz) => {
        setCurrentQuiz(quiz);
        setCurrentView('quiz');
    };

    const renderHeader = () => (
        <div className={`${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'
            } py-6 sm:py-8`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                Interactive Quizzes
                            </h1>
                            <p className={`mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                Test your knowledge with adaptive quizzes that help you learn better
                            </p>
                        </div>
                    </div>
                    <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                            onClick={() => setCurrentView('generator')}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${currentView === 'generator'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : darkMode
                                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                }`}
                        >
                            Generate Quiz
                        </button>
                        <button
                            onClick={() => setCurrentView('history')}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${currentView === 'history'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : darkMode
                                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                }`}
                        >
                            Quiz History
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );

    const renderGeneratorView = () => (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <QuizGenerator onQuizGenerated={handleQuizGenerated} />
        </div>
    );

    const renderQuizView = () => (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="mb-4 sm:mb-6">
                <button
                    onClick={() => setCurrentView('generator')}
                    className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium text-sm sm:text-base`}
                >
                    ← Back to Generator
                </button>
            </div>

            {currentQuiz && (
                <div className="mb-4 sm:mb-6">
                    <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currentQuiz.title}</h2>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        {currentQuiz.questions?.length} questions • {currentQuiz.difficulty} difficulty
                    </p>
                </div>
            )}

            <QuizInterface
                quiz={currentQuiz}
                onComplete={handleQuizComplete}
                onRetry={handleRetryWrongAnswers}
            />
        </div>
    );

    const renderHistoryView = () => (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="mb-4 sm:mb-6">
                <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Quiz History</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>View and manage your previously generated quizzes</p>
            </div>

            {loading ? (
                <div className="text-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 text-sm sm:text-base`}>Loading quizzes...</p>
                </div>
            ) : quizHistory.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                    <div className={`${darkMode ? 'text-gray-600' : 'text-gray-400'} text-4xl sm:text-6xl mb-4`}>📝</div>
                    <h3 className={`text-base sm:text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No quizzes yet</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 text-sm sm:text-base px-4`}>Generate your first quiz to get started!</p>
                    <button
                        onClick={() => setCurrentView('generator')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
                    >
                        Generate Quiz
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {quizHistory.map((quiz) => (
                        <div key={quiz._id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 hover:shadow-md transition-shadow`}>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} truncate text-sm sm:text-base`}>
                                    {quiz.title}
                                </h3>
                                <button
                                    onClick={() => handleDeleteQuiz(quiz._id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1 mb-4">
                                <p>{quiz.questions?.length} questions</p>
                                <p>Difficulty: <span className="capitalize">{quiz.difficulty}</span></p>
                                <p>Type: <span className="capitalize">{quiz.questions?.[0]?.type?.replace('-', ' ')}</span></p>
                                <p>Created: {new Date(quiz.createdAt).toLocaleDateString()}</p>
                            </div>

                            <button
                                onClick={() => handleViewQuiz(quiz)}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                                Take Quiz
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <Layout>
            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                {renderHeader()}

                {error && (
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className={`border rounded-md p-3 ${darkMode
                            ? 'bg-red-900/50 border-red-800 text-red-300'
                            : 'bg-red-50 border-red-200 text-red-600'
                            }`}>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {currentView === 'generator' && renderGeneratorView()}
                {currentView === 'quiz' && renderQuizView()}
                {currentView === 'history' && renderHistoryView()}
            </div>
        </Layout>
    );
};

export default QuizPage;
