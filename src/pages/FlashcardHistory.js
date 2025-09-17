import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Layout from "../components/Layout";
import { useDarkMode } from "../context/DarkModeContext";
import { getFlashcards, updateFlashcard, deleteFlashcard } from "../utils/flashcardService";
import '../components/CustomToast.css';

const FlashcardHistory = () => {
    const { darkMode } = useDarkMode();
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedFlashcards, setSelectedFlashcards] = useState([]);
    const [flippedCards, setFlippedCards] = useState(new Set());

    // Edit functionality state
    const [editingCard, setEditingCard] = useState(null);
    const [editQuestion, setEditQuestion] = useState("");
    const [editAnswer, setEditAnswer] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);

    // Confirmation state for deletions
    const [pendingDelete, setPendingDelete] = useState(null);
    const [pendingSetDelete, setPendingSetDelete] = useState(null);

    useEffect(() => {
        fetchHistoryData();
    }, []);

    const fetchHistoryData = async () => {
        try {
            setLoading(true);
            const data = await getFlashcards();

            // Filter and organize flashcard history
            const validHistory = data.flashcards?.filter(card =>
                card.topic &&
                card.flashcards &&
                Array.isArray(card.flashcards) &&
                card.flashcards.length > 0 &&
                card.flashcards.every(fc => fc.question && fc.answer)
            ) || [];

            // Sort by creation date (most recent first)
            const sortedHistory = validHistory.sort((a, b) =>
                new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt)
            );

            setHistoryData(sortedHistory);
        } catch (err) {
            console.error("Error fetching flashcard history:", err);
        }
        setLoading(false);
    };

    const viewFlashcards = (topicData) => {
        setSelectedTopic(topicData);
        setSelectedFlashcards(topicData.flashcards);
        setFlippedCards(new Set());
    };

    const toggleCardFlip = (index) => {
        const newFlippedCards = new Set(flippedCards);
        if (newFlippedCards.has(index)) {
            newFlippedCards.delete(index);
        } else {
            newFlippedCards.add(index);
        }
        setFlippedCards(newFlippedCards);
    };

    const backToHistory = () => {
        setSelectedTopic(null);
        setSelectedFlashcards([]);
        setFlippedCards(new Set());
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Edit/Delete functionality
    const startEditCard = (index) => {
        const card = selectedFlashcards[index];
        setEditingCard(index);
        setEditQuestion(card.question);
        setEditAnswer(card.answer);
        setShowEditModal(true);
    };

    const saveEditCard = async () => {
        try {
            const updatedFlashcards = [...selectedFlashcards];
            updatedFlashcards[editingCard] = {
                ...updatedFlashcards[editingCard],
                question: editQuestion.trim(),
                answer: editAnswer.trim()
            };

            await updateFlashcard(selectedTopic._id, {
                topic: selectedTopic.topic,
                flashcards: updatedFlashcards
            });

            setSelectedFlashcards(updatedFlashcards);

            // Update the history data as well
            const updatedHistoryData = historyData.map(item =>
                item._id === selectedTopic._id
                    ? { ...item, flashcards: updatedFlashcards }
                    : item
            );
            setHistoryData(updatedHistoryData);

            cancelEdit();
            toast.success("Flashcard updated successfully!", {
                icon: '✏️',
                className: 'toast-flashcard-success',
                autoClose: 3000,
            });
        } catch (err) {
            console.error("Error updating flashcard:", err);
            toast.error("Error updating flashcard. Please try again.", {
                autoClose: 4000,
            });
        }
    };

    const cancelEdit = () => {
        setEditingCard(null);
        setEditQuestion("");
        setEditAnswer("");
        setShowEditModal(false);
    };

    const deleteCard = async (index) => {
        // Show confirmation toast
        setPendingDelete(index);
        toast.warn(
            <div>
                <div className="font-medium mb-2">Delete this flashcard?</div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => confirmDeleteCard(index)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => cancelDelete()}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeButton: false,
                className: 'toast-confirmation',
            }
        );
    };

    const confirmDeleteCard = async (index) => {
        try {
            toast.dismiss(); // Close the confirmation toast
            setPendingDelete(null);

            const updatedFlashcards = selectedFlashcards.filter((_, i) => i !== index);

            if (updatedFlashcards.length === 0) {
                // If no cards left, delete the entire set
                await deleteFlashcard(selectedTopic._id);
                const updatedHistoryData = historyData.filter(item => item._id !== selectedTopic._id);
                setHistoryData(updatedHistoryData);
                backToHistory();
                toast.success("Flashcard set deleted successfully!", {
                    icon: '🗂️',
                    className: 'toast-flashcard-success',
                    autoClose: 3000,
                });
            } else {
                // Update the flashcard set
                await updateFlashcard(selectedTopic._id, {
                    topic: selectedTopic.topic,
                    flashcards: updatedFlashcards
                });

                setSelectedFlashcards(updatedFlashcards);

                // Update the history data as well
                const updatedHistoryData = historyData.map(item =>
                    item._id === selectedTopic._id
                        ? { ...item, flashcards: updatedFlashcards }
                        : item
                );
                setHistoryData(updatedHistoryData);

                // Reset flipped cards to avoid index issues
                setFlippedCards(new Set());

                toast.success("Flashcard deleted successfully!", {
                    icon: '🗑️',
                    className: 'toast-flashcard-success',
                    autoClose: 3000,
                });
            }
        } catch (err) {
            console.error("Error deleting flashcard:", err);
            toast.error("Error deleting flashcard. Please try again.", {
                autoClose: 4000,
            });
        }
    };

    const cancelDelete = () => {
        toast.dismiss(); // Close the confirmation toast
        setPendingDelete(null);
    };

    const deleteEntireSet = async (setId) => {
        // Show confirmation toast
        setPendingSetDelete(setId);
        toast.warn(
            <div>
                <div className="font-medium mb-2">Delete this entire flashcard set?</div>
                <div className="text-sm text-gray-600 mb-3">This action cannot be undone.</div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => confirmDeleteSet(setId)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                        Delete Set
                    </button>
                    <button
                        onClick={() => cancelSetDelete()}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeButton: false,
                className: 'toast-confirmation',
            }
        );
    };

    const confirmDeleteSet = async (setId) => {
        try {
            toast.dismiss(); // Close the confirmation toast
            setPendingSetDelete(null);

            await deleteFlashcard(setId);
            const updatedHistoryData = historyData.filter(item => item._id !== setId);
            setHistoryData(updatedHistoryData);

            // If we're currently viewing this set, go back to history
            if (selectedTopic && selectedTopic._id === setId) {
                backToHistory();
            }

            toast.success("Flashcard set deleted successfully!", {
                icon: '🗂️',
                className: 'toast-flashcard-success',
                autoClose: 3000,
            });
        } catch (err) {
            console.error("Error deleting flashcard set:", err);
            toast.error("Error deleting flashcard set. Please try again.", {
                autoClose: 4000,
            });
        }
    };

    const cancelSetDelete = () => {
        toast.dismiss(); // Close the confirmation toast
        setPendingSetDelete(null);
    };

    return (
        <Layout>
            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                {/* Header Section */}
                {!selectedTopic && (
                    <div className={`${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'
                        } py-8`}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className={`text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Flashcard History
                                    </h1>
                                    <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        View and revisit all your previously generated flashcard topics
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/flashcards"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create New Flashcards
                            </Link>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {!selectedTopic ? (
                        // History List View
                        <>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading history...
                                    </div>
                                </div>
                            ) : historyData.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {historyData.map((item, index) => (
                                        <div
                                            key={item._id || index}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                                        {item.topic}
                                                    </h3>
                                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex-shrink-0">
                                                        {item.flashcards.length} cards
                                                    </span>
                                                </div>

                                                <div className="text-sm text-gray-500 mb-4">
                                                    <div className="flex items-center mb-1">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {formatDate(item.createdAt || item.updatedAt)}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <button
                                                        onClick={() => viewFlashcards(item)}
                                                        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View Flashcards
                                                    </button>

                                                    <div className="flex gap-2">
                                                        <Link
                                                            to="/flashcards"
                                                            state={{ preloadTopic: item.topic }}
                                                            className="flex-1 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                            Study Again
                                                        </Link>

                                                        <button
                                                            onClick={() => deleteEntireSet(item._id)}
                                                            className="px-3 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                                            title="Delete this flashcard set"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No flashcard history</h3>
                                    <p className="text-gray-500 mb-4">You haven't created any flashcards yet</p>
                                    <Link
                                        to="/flashcards"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Create Your First Flashcards
                                    </Link>
                                </div>
                            )}
                        </>
                    ) : (
                        // Flashcard View
                        <>
                            <div className="text-center mb-8">
                                <button
                                    onClick={backToHistory}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors mb-4"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to History
                                </button>

                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedTopic.topic}</h1>
                                <p className="text-gray-600">
                                    {selectedFlashcards.length} flashcards • Created {formatDate(selectedTopic.createdAt || selectedTopic.updatedAt)}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedFlashcards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="group perspective-1000 h-64 relative"
                                        onClick={() => toggleCardFlip(index)}
                                    >
                                        <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${flippedCards.has(index) ? 'rotate-y-180' : ''
                                            }`}>
                                            {/* Front of card (Question) */}
                                            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 flex flex-col justify-center">
                                                <div className="text-sm font-medium text-blue-100 mb-2">Question</div>
                                                <div className="text-lg font-semibold text-center leading-relaxed">
                                                    {card.question}
                                                </div>
                                                <div className="mt-4 text-center text-blue-200 text-sm">
                                                    Click to reveal answer
                                                </div>
                                            </div>

                                            {/* Back of card (Answer) */}
                                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 flex flex-col justify-center">
                                                <div className="text-sm font-medium text-green-100 mb-2">Answer</div>
                                                <div className="text-base text-center leading-relaxed">
                                                    {card.answer}
                                                </div>
                                                <div className="mt-4 text-center text-green-200 text-sm">
                                                    Click to see question
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Action Buttons */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEditCard(index);
                                                }}
                                                className="p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-white transition-colors"
                                                title="Edit card"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteCard(index);
                                                }}
                                                className="p-1.5 bg-white bg-opacity-20 hover:bg-red-500 hover:bg-opacity-80 rounded text-white transition-colors"
                                                title="Delete card"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                                <h3 className="text-lg font-semibold mb-4">Edit Flashcard</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Question
                                        </label>
                                        <textarea
                                            value={editQuestion}
                                            onChange={(e) => setEditQuestion(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            rows="3"
                                            placeholder="Enter the question..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Answer
                                        </label>
                                        <textarea
                                            value={editAnswer}
                                            onChange={(e) => setEditAnswer(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            rows="3"
                                            placeholder="Enter the answer..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={cancelEdit}
                                        className={`px-4 py-2 border rounded-lg transition-colors ${darkMode
                                            ? 'text-gray-300 border-gray-600 hover:bg-gray-700'
                                            : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveEditCard}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default FlashcardHistory;
