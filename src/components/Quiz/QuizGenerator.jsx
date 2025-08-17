import React, { useState } from 'react';
import { generateQuiz } from '../../utils/quizService';
import { useAuth } from '../../context/AuthContext';

const QuizGenerator = ({ onQuizGenerated }) => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        content: '',
        title: '',
        questionCount: 5,
        questionType: 'multiple-choice',
        difficulty: 'medium',
        sourceType: 'notes'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.content.trim()) {
            setError('Please provide content to generate quiz from');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await generateQuiz(formData);
            console.log('Quiz generated:', result);

            if (onQuizGenerated) {
                onQuizGenerated(result.quiz);
            }

            // Reset form
            setFormData({
                content: '',
                title: '',
                questionCount: 5,
                questionType: 'multiple-choice',
                difficulty: 'medium',
                sourceType: 'notes'
            });

        } catch (error) {
            console.error('Error generating quiz:', error);
            setError('Failed to generate quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Quiz</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quiz Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Quiz Title (Optional)
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter quiz title..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Content Input */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Paste your notes, study material, or flashcard content here..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Quiz Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Question Count */}
                    <div>
                        <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700 mb-1">
                            Questions
                        </label>
                        <select
                            id="questionCount"
                            name="questionCount"
                            value={formData.questionCount}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={3}>3 Questions</option>
                            <option value={5}>5 Questions</option>
                            <option value={10}>10 Questions</option>
                            <option value={15}>15 Questions</option>
                            <option value={20}>20 Questions</option>
                        </select>
                    </div>

                    {/* Question Type */}
                    <div>
                        <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            id="questionType"
                            name="questionType"
                            value={formData.questionType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="short-answer">Short Answer</option>
                        </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty
                        </label>
                        <select
                            id="difficulty"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    {/* Source Type */}
                    <div>
                        <label htmlFor="sourceType" className="block text-sm font-medium text-gray-700 mb-1">
                            Source
                        </label>
                        <select
                            id="sourceType"
                            name="sourceType"
                            value={formData.sourceType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="notes">Notes</option>
                            <option value="flashcards">Flashcards</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !formData.content.trim()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating Quiz...
                        </div>
                    ) : (
                        'Generate Quiz'
                    )}
                </button>
            </form>
        </div>
    );
};

export default QuizGenerator;
