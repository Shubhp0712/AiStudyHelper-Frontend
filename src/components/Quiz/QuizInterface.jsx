import React, { useState, useEffect } from 'react';
import progressService from '../../utils/progressService';

const QuizInterface = ({ quiz, onComplete, onRetry }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState({});

    const currentQuestion = quiz?.questions[currentQuestionIndex];

    useEffect(() => {
        if (quiz) {
            setAnswers({});
            setCurrentQuestionIndex(0);
            setShowResults(false);
            setScore(0);
            setFeedback({});
        }
    }, [quiz]);

    const handleAnswer = (answer) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: answer
        }));
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            calculateResults();
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const calculateResults = () => {
        let correctCount = 0;
        const feedbackData = {};

        quiz.questions.forEach((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            if (isCorrect) {
                correctCount++;
            }

            feedbackData[index] = {
                isCorrect,
                userAnswer,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            };
        });

        setScore(correctCount);
        setFeedback(feedbackData);
        setShowResults(true);

        // Log quiz completion to progress tracking
        const quizResults = {
            score: correctCount,
            total: quiz.questions.length,
            percentage: Math.round((correctCount / quiz.questions.length) * 100),
            answers: feedbackData
        };

        // Log to progress service
        progressService.logQuizSession({
            id: quiz._id,
            topic: quiz.topic,
            score: correctCount,
            totalQuestions: quiz.questions.length,
            difficulty: quiz.difficulty || 'medium'
        }, 0).catch(error => {
            console.error('Failed to log quiz session:', error);
        });

        if (onComplete) {
            onComplete(quizResults);
        }
    };

    const retryWrongAnswers = () => {
        const wrongQuestions = quiz.questions.filter((_, index) =>
            !feedback[index]?.isCorrect
        );

        if (wrongQuestions.length > 0 && onRetry) {
            onRetry(wrongQuestions);
        }
    };

    if (!quiz || !quiz.questions?.length) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-center">No quiz available</p>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quiz Results</h2>

                {/* Score Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                            {score}/{quiz.questions.length}
                        </div>
                        <div className="text-xl text-gray-600 mb-2">
                            {Math.round((score / quiz.questions.length) * 100)}% Correct
                        </div>
                        <div className="text-sm text-gray-500">
                            {score === quiz.questions.length ? 'Perfect Score! 🎉' :
                                score >= quiz.questions.length * 0.8 ? 'Great Job! 👏' :
                                    score >= quiz.questions.length * 0.6 ? 'Good Effort! 👍' :
                                        'Keep Studying! 📚'}
                        </div>
                    </div>
                </div>

                {/* Detailed Results */}
                <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Review Your Answers</h3>

                    {quiz.questions.map((question, index) => {
                        const questionFeedback = feedback[index];
                        const isCorrect = questionFeedback?.isCorrect;

                        return (
                            <div key={index} className={`border rounded-lg p-4 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-gray-800">
                                        Question {index + 1}
                                    </h4>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-3">{question.question}</p>

                                {question.type === 'multiple-choice' && (
                                    <div className="space-y-1 mb-3">
                                        {question.options.map((option, optIndex) => {
                                            const isUserAnswer = option === questionFeedback?.userAnswer;
                                            const isCorrectAnswer = option === question.correctAnswer;

                                            return (
                                                <div key={optIndex} className={`p-2 rounded text-sm ${isCorrectAnswer ? 'bg-green-100 text-green-800 font-medium' :
                                                    isUserAnswer && !isCorrect ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {option}
                                                    {isCorrectAnswer && ' ✓'}
                                                    {isUserAnswer && !isCorrect && ' ✗'}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {question.type === 'short-answer' && (
                                    <div className="space-y-2 mb-3">
                                        <div className="text-sm">
                                            <span className="font-medium">Your answer:</span> {questionFeedback?.userAnswer || 'No answer'}
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium">Correct answer:</span> {question.correctAnswer}
                                        </div>
                                    </div>
                                )}

                                {question.explanation && (
                                    <div className="text-sm text-gray-600 italic">
                                        <span className="font-medium">Explanation:</span> {question.explanation}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Take New Quiz
                    </button>

                    {score < quiz.questions.length && (
                        <button
                            onClick={retryWrongAnswers}
                            className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
                        >
                            Retry Wrong Answers
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </span>
                    <span className="text-sm text-gray-500">
                        {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {currentQuestion.question}
                </h2>

                {/* Multiple Choice Options */}
                {currentQuestion.type === 'multiple-choice' && (
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                className={`w-full text-left p-3 rounded-lg border transition-colors ${answers[currentQuestionIndex] === option
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="font-medium mr-3">
                                    {String.fromCharCode(65 + index)}.
                                </span>
                                {option}
                            </button>
                        ))}
                    </div>
                )}

                {/* Short Answer Input */}
                {currentQuestion.type === 'short-answer' && (
                    <textarea
                        value={answers[currentQuestionIndex] || ''}
                        onChange={(e) => handleAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <button
                    onClick={nextQuestion}
                    disabled={!answers[currentQuestionIndex]}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default QuizInterface;
