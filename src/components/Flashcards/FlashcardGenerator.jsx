import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createFlashcards, getFlashcards, updateFlashcard, deleteFlashcard } from "../../utils/flashcardService";
import progressService from "../../utils/progressService";
import FlashcardPDFExport from "../FlashcardPDFExport";
import { useDarkMode } from "../../context/DarkModeContext";

const FlashcardGenerator = () => {
  const { darkMode } = useDarkMode();
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentFlashcardSetId, setCurrentFlashcardSetId] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('flashcard-search-history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage
  const saveToHistory = (searchTopic) => {
    const newHistory = [searchTopic, ...searchHistory.filter(item => item.topic !== searchTopic)]
      .slice(0, 10); // Keep only last 10 searches

    setSearchHistory(newHistory);
    localStorage.setItem('flashcard-search-history', JSON.stringify(newHistory));
  };

  // Load flashcards from history
  const loadFromHistory = async (historyItem) => {
    try {
      setLoading(true);
      setTopic(historyItem.topic);

      // Try to find existing flashcards for this topic
      const data = await getFlashcards();
      const topicFlashcards = data.flashcards?.find(card =>
        card.topic?.toLowerCase() === historyItem.topic.toLowerCase() &&
        card.flashcards &&
        Array.isArray(card.flashcards) &&
        card.flashcards.length > 0
      );

      if (topicFlashcards) {
        setFlashcards(topicFlashcards.flashcards);
        setStudyMode(false);
        setCurrentCardIndex(0);
        setFlippedCards(new Set());
      } else {
        // If no existing flashcards, generate new ones
        await handleGenerate();
      }
      setShowHistory(false);
    } catch (err) {
      console.error("Error loading from history:", err);
      alert("Error loading flashcards. Please try again.");
    }
    setLoading(false);
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('flashcard-search-history');
    setShowHistory(false);
  };

  // Edit flashcard functions
  const startEditCard = (index) => {
    const card = flashcards[index];
    setEditingCard(index);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
    setShowEditModal(true);
  };

  const saveEditCard = async () => {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      alert("Both question and answer are required!");
      return;
    }

    try {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[editingCard] = {
        question: editQuestion.trim(),
        answer: editAnswer.trim()
      };

      // Update in database if we have a current set ID
      if (currentFlashcardSetId) {
        await updateFlashcard(currentFlashcardSetId, topic, updatedFlashcards);
      }

      setFlashcards(updatedFlashcards);
      setShowEditModal(false);
      setEditingCard(null);
      setEditQuestion("");
      setEditAnswer("");
    } catch (err) {
      console.error("Error updating flashcard:", err);
      alert("Error updating flashcard. Please try again.");
    }
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingCard(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  // Delete individual flashcard
  const deleteCard = async (index) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) {
      return;
    }

    try {
      const updatedFlashcards = flashcards.filter((_, i) => i !== index);

      if (updatedFlashcards.length === 0) {
        // If no cards left, delete the entire set
        if (currentFlashcardSetId) {
          await deleteFlashcard(currentFlashcardSetId);
        }
        setFlashcards([]);
        setCurrentFlashcardSetId(null);
        setTopic("");
      } else {
        // Update the set with remaining cards
        if (currentFlashcardSetId) {
          await updateFlashcard(currentFlashcardSetId, topic, updatedFlashcards);
        }
        setFlashcards(updatedFlashcards);

        // Adjust current card index if needed
        if (currentCardIndex >= updatedFlashcards.length) {
          setCurrentCardIndex(updatedFlashcards.length - 1);
        }
      }

      // Reset flipped cards
      setFlippedCards(new Set());
    } catch (err) {
      console.error("Error deleting flashcard:", err);
      alert("Error deleting flashcard. Please try again.");
    }
  };

  // Delete entire flashcard set
  const deleteEntireSet = async () => {
    if (!window.confirm("Are you sure you want to delete this entire flashcard set? This action cannot be undone.")) {
      return;
    }

    try {
      if (currentFlashcardSetId) {
        await deleteFlashcard(currentFlashcardSetId);
      }

      setFlashcards([]);
      setCurrentFlashcardSetId(null);
      setTopic("");
      setFlippedCards(new Set());
      setStudyMode(false);
      setCurrentCardIndex(0);
    } catch (err) {
      console.error("Error deleting flashcard set:", err);
      alert("Error deleting flashcard set. Please try again.");
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic first!");
      return;
    }

    setLoading(true);
    setFlippedCards(new Set());
    try {
      const data = await createFlashcards(topic);
      console.log("Received data:", data); // Debug log

      // Handle different response formats
      let flashcardsToSet = [];

      if (data.flashcards && Array.isArray(data.flashcards)) {
        // Direct array of flashcards
        flashcardsToSet = data.flashcards;
      } else if (Array.isArray(data)) {
        // Response is directly an array
        flashcardsToSet = data;
      } else {
        console.error("Unexpected response format:", data);
        alert("Received unexpected response format from server.");
        return;
      }

      // Validate flashcards have proper structure
      const validFlashcards = flashcardsToSet.filter(card =>
        card && card.question && card.answer
      );

      if (validFlashcards.length === 0) {
        alert("No valid flashcards were generated. Please try again.");
        return;
      }

      setFlashcards(validFlashcards);
      setStudyMode(false);
      setCurrentCardIndex(0);

      // Store the flashcard set ID for future updates/deletes
      if (data._id) {
        setCurrentFlashcardSetId(data._id);
      }

      // Save to search history
      saveToHistory({
        topic: topic.trim(),
        timestamp: new Date().toISOString(),
        cardCount: validFlashcards.length
      });
    } catch (err) {
      console.error("Error generating flashcards", err);
      alert("Error generating flashcards. Please try again.");
    }
    setLoading(false);
  };

  const fetchExisting = async () => {
    try {
      const data = await getFlashcards();
      // Only set flashcards if they have valid content
      const validFlashcards = data.flashcards?.filter(card =>
        card.flashcards &&
        Array.isArray(card.flashcards) &&
        card.flashcards.length > 0 &&
        card.flashcards.every(fc => fc.question && fc.answer)
      ) || [];

      if (validFlashcards.length > 0) {
        // Get the most recent valid flashcard set
        setFlashcards(validFlashcards[0].flashcards);
      }
    } catch (err) {
      console.error("Error fetching flashcards", err);
    }
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

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Mark flashcard as learned and log progress
  const markAsLearned = async (cardIndex) => {
    try {
      // Log flashcard study session to progress tracking
      await progressService.logFlashcardSession({
        id: `${currentFlashcardSetId}_${cardIndex}`,
        topic: topic,
        isLearned: true,
        difficulty: 'medium'
      }, 1); // 1 minute estimated time per flashcard

      console.log('Flashcard marked as learned and logged to progress');

      // Optional: Move to next card after marking as learned
      if (studyMode && currentCardIndex < flashcards.length - 1) {
        nextCard();
      }
    } catch (error) {
      console.error('Error logging flashcard progress:', error);
    }
  };

  useEffect(() => {
    // Don't automatically fetch flashcards on load
    // Only show flashcards after user generates them
  }, []);

  return (
    <div className={`max-w-6xl mx-auto p-6 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Flashcard Generator</h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Enter any topic and let AI create comprehensive flashcards for your study session
        </p>

        {/* View History Button */}
        <div className="mb-6">
          <Link
            to="/flashcard-history"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            View All Flashcard History
          </Link>
        </div>
      </div>

      {/* Input Section */}
      <div className={`rounded-lg shadow-md p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Study Topic
            </label>
            <input
              type="text"
              value={topic}
              placeholder="e.g., JavaScript Functions, World War II, Biology Cell Structure..."
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              disabled={loading}
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Cards
                </>
              )}
            </button>

            <button
              onClick={fetchExisting}
              disabled={loading}
              className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Load Previous
            </button>

            {searchHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showHistory ? 'Hide History' : 'Search History'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search History Section */}
      {showHistory && searchHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Search History</h3>
            <button
              onClick={clearHistory}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear History
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => loadFromHistory(item)}
                disabled={loading}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 group-hover:text-purple-700 mb-1">
                      {item.topic}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {item.cardCount} cards
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Study Mode Toggle */}
      {flashcards.length > 0 && (
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setStudyMode(false)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${!studyMode
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setStudyMode(true)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${studyMode
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Study Mode
            </button>
          </div>
        </div>
      )}

      {/* Flashcard Set Actions */}
      {flashcards.length > 0 && (
        <div className="flex justify-center mb-6">
          <div className="flex gap-3">
            <FlashcardPDFExport flashcards={flashcards} topic={topic} />
            <button
              onClick={deleteEntireSet}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete All Cards
            </button>
          </div>
        </div>
      )}

      {/* Flashcards Display */}
      {flashcards.length > 0 ? (
        <>
          {!studyMode ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcards.map((card, index) => (
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
          ) : (
            /* Study Mode - Single Card View */
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-4">
                <span className="text-sm text-gray-600">
                  Card {currentCardIndex + 1} of {flashcards.length}
                </span>
              </div>

              <div className="group perspective-1000 h-80 mb-6">
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${flippedCards.has(currentCardIndex) ? 'rotate-y-180' : ''
                    }`}
                  onClick={() => toggleCardFlip(currentCardIndex)}
                >
                  {/* Front of card (Question) */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-8 flex flex-col justify-center">
                    <div className="text-sm font-medium text-blue-100 mb-4">Question</div>
                    <div className="text-xl font-semibold text-center leading-relaxed">
                      {flashcards[currentCardIndex]?.question}
                    </div>
                    <div className="mt-6 text-center text-blue-200">
                      Click to reveal answer
                    </div>
                  </div>

                  {/* Back of card (Answer) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-8 flex flex-col justify-center">
                    <div className="text-sm font-medium text-green-100 mb-4">Answer</div>
                    <div className="text-lg text-center leading-relaxed">
                      {flashcards[currentCardIndex]?.answer}
                    </div>
                    <div className="mt-6 text-center text-green-200">
                      Click to see question
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={prevCard}
                  disabled={currentCardIndex === 0}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={nextCard}
                  disabled={currentCardIndex === flashcards.length - 1}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Card Action Controls */}
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => markAsLearned(currentCardIndex)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Learned
                </button>
                <button
                  onClick={() => startEditCard(currentCardIndex)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Card
                </button>
                <button
                  onClick={() => deleteCard(currentCardIndex)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Card
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              <span className="font-semibold text-blue-600">{flashcards.length}</span> flashcards generated
              {flippedCards.size > 0 && (
                <span className="ml-4">
                  <span className="font-semibold text-green-600">{flippedCards.size}</span> cards reviewed
                </span>
              )}
            </p>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No flashcards yet</h3>
          <p className="text-gray-500 mb-4">Enter a topic above to generate your first set of AI-powered flashcards</p>
        </div>
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
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
  );
};

export default FlashcardGenerator;
