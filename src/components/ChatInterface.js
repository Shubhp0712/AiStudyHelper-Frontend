// src/components/ChatInterface.js
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import { useSidebar } from "../context/SidebarContext";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { createFlashcards } from "../utils/flashcardService";
import { saveChat, getUserChats, updateChat, deleteChat as deleteChatAPI } from "../utils/chatService";
import DarkModeToggle from './DarkModeToggle';

export default function ChatInterface() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [currentChatTitle, setCurrentChatTitle] = useState("New Chat");
    const [flashcardLoading, setFlashcardLoading] = useState(null); // Track which message is generating flashcards
    const { currentUser, logout } = useAuth();
    const { darkMode } = useDarkMode();
    const { isMainSidebarOpen } = useSidebar();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // Hide ChatInterface sidebar when main sidebar is open
    const shouldShowSidebar = sidebarOpen && !isMainSidebarOpen;

    // Load chat history from MongoDB on component mount
    useEffect(() => {
        loadChatHistory();
    }, []);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load chat history from MongoDB
    const loadChatHistory = async () => {
        try {
            console.log('Loading chat history from MongoDB...');
            const data = await getUserChats();
            console.log('Chat history loaded:', data);
            setChatHistory(data.chats || []);
        } catch (error) {
            console.error('Error loading chat history:', error);
            // Fallback to localStorage if MongoDB fails
            console.log('Falling back to localStorage for chat history');
            const savedHistory = localStorage.getItem('chatHistory');
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                setChatHistory(parsedHistory);
            }
        }
    };

    // Generate a title for the chat based on the first message
    const generateChatTitle = (firstMessage) => {
        const words = firstMessage.split(' ').slice(0, 6);
        return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
    };

    // Create a new chat
    const startNewChat = () => {
        setMessages([]);
        setCurrentChatId(null);
        setCurrentChatTitle("New Chat");
        setInput("");
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    // Save current chat to MongoDB
    const saveCurrentChat = async (newMessages, title) => {
        if (newMessages.length === 0) return;

        console.log('saveCurrentChat called with:', { messagesCount: newMessages.length, title, currentChatId });

        try {
            const chatData = {
                title: title || currentChatTitle,
                messages: newMessages.map(msg => ({
                    sender: msg.sender,
                    text: msg.text,
                    timestamp: new Date()
                }))
            };

            console.log('Chat data prepared:', chatData);

            let savedChat;
            if (currentChatId) {
                console.log('Updating existing chat:', currentChatId);
                // Update existing chat
                savedChat = await updateChat(currentChatId, chatData);
            } else {
                console.log('Saving new chat');
                // Save new chat
                savedChat = await saveChat(chatData);
                setCurrentChatId(savedChat._id);
            }

            console.log('Chat operation successful:', savedChat);
            setCurrentChatTitle(title || currentChatTitle);

            // Refresh chat history
            await loadChatHistory();
        } catch (error) {
            console.error('Error saving chat to MongoDB:', error);
            // Fallback to localStorage
            console.log('Falling back to localStorage');
            const chatToSave = {
                id: currentChatId || Date.now().toString(),
                title: title || currentChatTitle,
                messages: newMessages,
                timestamp: new Date().toISOString(),
                lastMessage: newMessages[newMessages.length - 1]?.text?.substring(0, 100) + '...'
            };

            const updatedHistory = chatHistory.filter(chat => chat.id !== chatToSave.id);
            updatedHistory.unshift(chatToSave);

            const limitedHistory = updatedHistory.slice(0, 50);
            localStorage.setItem('chatHistory', JSON.stringify(limitedHistory));
            setChatHistory(limitedHistory);

            setCurrentChatId(chatToSave.id);
            setCurrentChatTitle(title || currentChatTitle);
        }
    };    // Load a chat from history
    const loadChat = (chat) => {
        setMessages(chat.messages);
        setCurrentChatId(chat._id || chat.id);
        setCurrentChatTitle(chat.title);
    };

    // Delete a chat from history
    const deleteChatFromHistory = async (chatId, e) => {
        e.stopPropagation();

        try {
            await deleteChatAPI(chatId);
            await loadChatHistory();

            // If we're deleting the current chat, start a new one
            if (chatId === currentChatId) {
                startNewChat();
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            // Fallback to localStorage
            const updatedHistory = chatHistory.filter(chat => chat._id !== chatId && chat.id !== chatId);
            localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
            setChatHistory(updatedHistory);

            if (chatId === currentChatId) {
                startNewChat();
            }
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        // Generate title for first message in a new chat
        let chatTitle = currentChatTitle;
        if (!currentChatId && newMessages.length === 1) {
            chatTitle = generateChatTitle(input.trim());
            setCurrentChatTitle(chatTitle);
        }

        setInput("");
        setLoading(true);

        try {
            // const res = await fetch("http://localhost:5000/api/ask", {
                const res = await fetch("https://aistudyhelper-backend.onrender.com/api/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question: input.trim() }),
            });

            const data = await res.json();
            console.log('API Response:', data);

            if (!res.ok) {
                throw new Error(data.error || `Server error: ${res.status}`);
            }

            const aiMessage = { sender: "ai", text: data.answer || "Sorry, I couldn't generate an answer." };
            const finalMessages = [...newMessages, aiMessage];

            setMessages(finalMessages);

            // Save the chat to history
            saveCurrentChat(finalMessages, chatTitle);
        } catch (error) {
            console.error("Error fetching from backend:", error);
            const errorMessage = { sender: "ai", text: "Oops! Something went wrong while getting the answer." };
            const finalMessages = [...newMessages, errorMessage];

            setMessages(finalMessages);
            saveCurrentChat(finalMessages, chatTitle);
        }

        setLoading(false);
    };

    // Generate flashcards from AI response
    const generateFlashcardsFromResponse = async (responseText, messageIndex) => {
        setFlashcardLoading(messageIndex);

        try {
            // Extract topic or use a portion of the response as topic
            const lines = responseText.split('\n').filter(line => line.trim());
            const topic = lines[0]?.replace(/[#*]/g, '').trim() || 'Study Topic';

            const flashcardData = await createFlashcards(topic);

            if (flashcardData && flashcardData.flashcards) {
                // Show success message
                const successMessage = `✅ Generated ${flashcardData.flashcards.length} flashcards for "${topic}"! You can view them in the Flashcards section.`;

                // Add success message to current chat
                const successMsg = { sender: "ai", text: successMessage };
                const updatedMessages = [...messages, successMsg];
                setMessages(updatedMessages);

                // Save updated chat
                await saveCurrentChat(updatedMessages, currentChatTitle);

                // Show option to navigate to flashcards
                setTimeout(() => {
                    if (window.confirm('Flashcards created successfully! Would you like to view them now?')) {
                        navigate('/flashcards');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error generating flashcards:', error);

            // Add error message
            const errorMsg = { sender: "ai", text: "Sorry, I couldn't generate flashcards from this content. Please try again with a more specific topic." };
            const updatedMessages = [...messages, errorMsg];
            setMessages(updatedMessages);

            await saveCurrentChat(updatedMessages, currentChatTitle);
        }

        setFlashcardLoading(null);
    };

    // Format timestamp for display
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 168) { // 7 days
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className="flex h-full max-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
            {/* Mobile Overlay Backdrop */}
            {shouldShowSidebar && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Toggle - Position below header to avoid overlap */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`fixed top-20 left-3 md:top-4 md:left-4 z-50 p-2 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600' : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-300'} rounded-lg transition-colors border shadow-lg ${isMainSidebarOpen ? 'hidden' : ''}`}
                title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Chat History Sidebar */}
            <div className={`${shouldShowSidebar ? 'w-80 translate-x-0' : 'w-80 -translate-x-full'} ${shouldShowSidebar ? 'md:w-80' : 'md:w-0'} md:translate-x-0 fixed md:relative h-full transition-all duration-300 overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-gray-900'} text-white flex flex-col z-50 md:z-30`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-700 flex-shrink-0 pt-4 md:pt-16">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Chat History</h2>
                        {/* Close button for mobile */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-medium">New Chat</span>
                    </button>
                </div>

                {/* Chat History List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {chatHistory.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-sm">No conversations yet</p>
                            <p className="text-xs mt-1">Start a new chat to begin</p>
                        </div>
                    ) : (
                        chatHistory.map((chat) => (
                            <div
                                key={chat._id || chat.id}
                                onClick={() => loadChat(chat)}
                                className={`group p-3 rounded-lg cursor-pointer transition-colors relative ${currentChatId === (chat._id || chat.id)
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm truncate mb-1">
                                            {chat.title}
                                        </h3>
                                        <p className="text-xs text-gray-300 truncate">
                                            {chat.lastMessage}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatTimestamp(chat.updatedAt || chat.timestamp)}
                                        </p>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => deleteChatFromHistory(chat._id || chat.id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all ml-2 flex-shrink-0"
                                        title="Delete chat"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-0 h-full max-h-screen overflow-hidden">
                {/* Chat Messages Area */}
                <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <div className="min-h-full pb-32">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                                <div className={`w-16 h-16 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-full flex items-center justify-center mb-4`}>
                                    <svg className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Welcome to AI Study Assistant</h3>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 max-w-md`}>
                                    Ask me anything about your studies. I can help with explanations, summaries, problem solving, and more.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full px-4">
                                    <button
                                        onClick={() => setInput("Explain quantum physics in simple terms")}
                                        className={`p-3 text-left ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} rounded-lg border transition-colors`}
                                    >
                                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Explain concepts</div>
                                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get clear explanations</div>
                                    </button>
                                    <button
                                        onClick={() => setInput("Help me solve this math problem")}
                                        className={`p-3 text-left ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} rounded-lg border transition-colors`}
                                    >
                                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Problem solving</div>
                                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Step-by-step solutions</div>
                                    </button>
                                    <button
                                        onClick={() => setInput("Summarize this topic for me")}
                                        className={`p-3 text-left ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} rounded-lg border transition-colors`}
                                    >
                                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Summarize content</div>
                                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Key points and summaries</div>
                                    </button>
                                    <button
                                        onClick={() => setInput("Create a study plan for my exam")}
                                        className={`p-3 text-left ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} rounded-lg border transition-colors`}
                                    >
                                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Study planning</div>
                                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Organize your studies</div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`flex gap-3 max-w-[85%] sm:max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                                            {/* Avatar */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === "user"
                                                ? "bg-blue-600 text-white"
                                                : darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                                                }`}>
                                                {msg.sender === "user" ? (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Message Content */}
                                            <div className={`p-4 rounded-2xl ${msg.sender === "user"
                                                ? "bg-blue-600 text-white"
                                                : darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"
                                                }`}>
                                                {msg.sender === "user" ? (
                                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                                ) : (
                                                    <div>
                                                        <div className="prose prose-sm max-w-none">
                                                            <ReactMarkdown
                                                                components={{
                                                                    h1: ({ children }) => <h1 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-3`}>{children}</h1>,
                                                                    h2: ({ children }) => <h2 className={`text-md font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>{children}</h2>,
                                                                    h3: ({ children }) => <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>{children}</h3>,
                                                                    p: ({ children }) => <p className={`mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'} leading-relaxed`}>{children}</p>,
                                                                    ul: ({ children }) => <ul className="mb-3 ml-4 space-y-1 list-disc">{children}</ul>,
                                                                    ol: ({ children }) => <ol className="mb-3 ml-4 space-y-1 list-decimal">{children}</ol>,
                                                                    li: ({ children }) => <li className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{children}</li>,
                                                                    strong: ({ children }) => <strong className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{children}</strong>,
                                                                    em: ({ children }) => <em className={`italic ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{children}</em>,
                                                                    code: ({ children }) => <code className={`${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} px-1 py-0.5 rounded text-sm font-mono`}>{children}</code>,
                                                                    pre: ({ children }) => <pre className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} p-3 rounded-lg overflow-x-auto mb-3`}>{children}</pre>
                                                                }}
                                                            >
                                                                {msg.text}
                                                            </ReactMarkdown>
                                                        </div>

                                                        {/* Flashcard Generation Button */}
                                                        {!msg.text.includes('✅ Generated') && !msg.text.includes('Sorry, I couldn\'t generate') && msg.text.length > 50 && (
                                                            <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                                                <button
                                                                    onClick={() => generateFlashcardsFromResponse(msg.text, i)}
                                                                    disabled={flashcardLoading === i}
                                                                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    {flashcardLoading === i ? (
                                                                        <>
                                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                            <span>Generating...</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                                            </svg>
                                                                            <span>Create Flashcards</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-3 max-w-[85%] sm:max-w-[80%]">
                                            <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} flex items-center justify-center flex-shrink-0`}>
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                </svg>
                                            </div>
                                            <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'} p-4 rounded-2xl`}>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex space-x-1">
                                                        <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                                                        <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                                                        <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                                                    </div>
                                                    <span className="text-sm">Thinking...</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Input Area */}
                <div className={`sticky bottom-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-3 sm:p-4`}>
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={sendMessage}>
                            <div className="flex gap-2 sm:gap-3 items-end">
                                <div className="flex-1 relative min-w-0">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage(e);
                                            }
                                        }}
                                        placeholder="Ask me anything about your studies..."
                                        disabled={loading}
                                        rows="1"
                                        className={`w-full p-3 sm:p-4 pr-10 sm:pr-12 border ${darkMode ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none max-h-32 overflow-y-auto text-sm sm:text-base`}
                                        style={{ minHeight: '48px' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center`}>
                                Press Enter to send, Shift + Enter for new line
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
