import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDarkMode } from '../context/DarkModeContext';

const Contact = () => {
    const { darkMode } = useDarkMode();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission (you can replace this with actual API call)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Message sent successfully! We\'ll get back to you soon.', {
                icon: '📧',
                className: 'toast-auth-success',
                autoClose: 4000,
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message. Please try again.', {
                className: 'toast-auth-error',
                autoClose: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            {/* Header */}
            <div className={`border-b transition-colors duration-300 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                AI Study Assistant
                            </span>
                        </Link>
                        <nav className="flex items-center space-x-6">
                            <Link
                                to="/"
                                className={`hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className={`hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                className="text-blue-600 font-medium"
                            >
                                Contact
                            </Link>
                            <Link
                                to="/login"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                            >
                                Sign In
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        Get in Touch
                    </h1>
                    <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        Have questions, feedback, or need support? We're here to help! Reach out to us through any of the methods below.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div>
                        <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Contact Information
                        </h2>

                        {/* Contact Cards */}
                        <div className="space-y-6">
                            {/* Email */}
                            {/* <div className={`rounded-xl p-6 ${darkMode
                                    ? 'bg-gray-800 border border-gray-700'
                                    : 'bg-white border border-gray-200 shadow-md'
                                }`}>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            Email Support
                                        </h3>
                                        <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Get help with technical issues or general inquiries
                                        </p>
                                        <a
                                            href="mailto:support@aistudyassistant.com"
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            support@aistudyassistant.com
                                        </a>
                                    </div>
                                </div>
                            </div> */}

                            {/* Phone */}
                            {/* <div className={`rounded-xl p-6 ${darkMode
                                    ? 'bg-gray-800 border border-gray-700'
                                    : 'bg-white border border-gray-200 shadow-md'
                                }`}>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            Phone Support
                                        </h3>
                                        <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Available Monday to Friday, 9 AM - 6 PM EST
                                        </p>
                                        <a
                                            href="tel:+1-555-0123"
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            +1 (555) 012-3456
                                        </a>
                                    </div>
                                </div>
                            </div> */}

                            {/* Address */}
                            {/* <div className={`rounded-xl p-6 ${darkMode
                                    ? 'bg-gray-800 border border-gray-700'
                                    : 'bg-white border border-gray-200 shadow-md'
                                }`}>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            Office Address
                                        </h3>
                                        <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Visit our headquarters for in-person meetings
                                        </p>
                                        <address className={`not-italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            123 Innovation Drive<br />
                                            Tech Valley, CA 94025<br />
                                            United States
                                        </address>
                                    </div>
                                </div>
                            </div> */}

                            {/* Social Media */}
                            <div className={`rounded-xl p-6 ${darkMode
                                    ? 'bg-gray-800 border border-gray-700'
                                    : 'bg-white border border-gray-200 shadow-md'
                                }`}>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0v1a1 1 0 01-1 1H8a1 1 0 01-1-1V4m0 0H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2m-5 4v6m-3-3h6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            Follow Us
                                        </h3>
                                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Stay updated with the latest features and tips
                                        </p>
                                        <div className="flex space-x-3">
                                            <a
                                                href="#"
                                                className="text-blue-600 hover:text-blue-700 transition-colors"
                                                title="Twitter"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                                </svg>
                                            </a>
                                            <a
                                                href="#"
                                                className="text-blue-600 hover:text-blue-700 transition-colors"
                                                title="LinkedIn"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                            <a
                                                href="#"
                                                className="text-blue-600 hover:text-blue-700 transition-colors"
                                                title="GitHub"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Send us a Message
                        </h2>

                        <div className={`rounded-xl p-8 ${darkMode
                                ? 'bg-gray-800 border border-gray-700'
                                : 'bg-white border border-gray-200 shadow-lg'
                            }`}>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </div>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className={`rounded-xl p-6 ${darkMode
                                ? 'bg-gray-800 border border-gray-700'
                                : 'bg-white border border-gray-200 shadow-md'
                            }`}>
                            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                How do I get started?
                            </h3>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Simply sign up for a free account and start creating your first flashcard set or take a quiz. Our AI will begin learning your preferences immediately.
                            </p>
                        </div>

                        <div className={`rounded-xl p-6 ${darkMode
                                ? 'bg-gray-800 border border-gray-700'
                                : 'bg-white border border-gray-200 shadow-md'
                            }`}>
                            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                Is there a mobile app?
                            </h3>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Our web application is fully responsive and works great on mobile devices. A dedicated mobile app is coming soon!
                            </p>
                        </div>

                        <div className={`rounded-xl p-6 ${darkMode
                                ? 'bg-gray-800 border border-gray-700'
                                : 'bg-white border border-gray-200 shadow-md'
                            }`}>
                            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                Can I export my study materials?
                            </h3>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Yes! You can export your flashcards and progress reports as PDF files for offline studying or sharing with others.
                            </p>
                        </div>

                        <div className={`rounded-xl p-6 ${darkMode
                                ? 'bg-gray-800 border border-gray-700'
                                : 'bg-white border border-gray-200 shadow-md'
                            }`}>
                            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                What payment methods do you accept?
                            </h3>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                We accept all major credit cards, PayPal, and bank transfers. All transactions are secured with enterprise-grade encryption.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`border-t mt-16 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                AI Study Assistant
                            </span>
                        </div>
                        <div className="flex space-x-6">
                            <Link
                                to="/terms"
                                className={`text-sm hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                            >
                                Terms of Service
                            </Link>
                            <Link
                                to="/privacy"
                                className={`text-sm hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Contact;