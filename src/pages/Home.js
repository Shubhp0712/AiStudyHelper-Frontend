import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useDarkMode } from '../context/DarkModeContext';

const Home = () => {
    const { darkMode } = useDarkMode();

    const features = [
        {
            icon: '🧠',
            title: 'AI-Powered Flashcards',
            description: 'Generate intelligent flashcards on any topic with advanced AI technology that adapts to your learning style.'
        },
        {
            icon: '📊',
            title: 'Smart Progress Tracking',
            description: 'Monitor your learning journey with detailed analytics and insights to optimize your study sessions.'
        },
        {
            icon: '❓',
            title: 'Interactive Quizzes',
            description: 'Test your knowledge with adaptive quizzes that adjust difficulty based on your performance.'
        },
        {
            icon: '📱',
            title: 'Cross-Platform Access',
            description: 'Study anywhere, anytime with seamless synchronization across all your devices.'
        },
        {
            icon: '🎯',
            title: 'Personalized Learning',
            description: 'AI algorithms create customized study plans tailored to your specific learning goals and pace.'
        },
        {
            icon: '📈',
            title: 'Performance Analytics',
            description: 'Get detailed insights into your strengths and areas for improvement with comprehensive reports.'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'Medical Student',
            content: 'AI StudyHelper transformed my study routine. The AI-generated flashcards are incredibly accurate and helped me ace my exams!',
            avatar: '👩‍⚕️'
        },
        {
            name: 'Marcus Johnson',
            role: 'Software Engineer',
            content: 'The progress tracking feature keeps me motivated. I can see my improvement over time and stay consistent with my learning goals.',
            avatar: '👨‍💻'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Law Student',
            content: 'The adaptive quizzes are game-changing. They focus on areas where I need improvement, making my study time more efficient.',
            avatar: '👩‍🎓'
        }
    ];

    return (
        <Layout showFooter={true}>
            {/* Hero Section */}
            <section className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className={`text-4xl lg:text-6xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Master Any Subject with{' '}
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        AI-Powered
                                    </span>{' '}
                                    Learning
                                </h1>
                                <p className={`text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    Transform your study experience with intelligent flashcards, adaptive quizzes,
                                    and comprehensive progress tracking. Learn smarter, not harder.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Get Started Free
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <Link
                                    to="/login"
                                    className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${darkMode
                                            ? 'text-gray-300 border-2 border-gray-600 hover:border-gray-500 hover:text-white'
                                            : 'text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:text-gray-900'
                                        }`}
                                >
                                    Sign In
                                </Link>
                            </div>

                            <div className="flex items-center space-x-6 pt-4">
                                <div className="flex items-center space-x-1">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">S</div>
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">M</div>
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">E</div>
                                    </div>
                                    <span className={`text-sm font-medium ml-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        Trusted by 10,000+ students
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className={`relative z-10 rounded-2xl p-8 ${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                                } shadow-2xl`}>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className={`h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                        <div className={`h-4 rounded w-4/5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                        <div className={`h-16 rounded ${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-100 to-purple-100'}`}>
                                            <div className="p-4">
                                                <div className="text-2xl mb-2">🧠</div>
                                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                    AI-Generated Flashcard
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`h-4 rounded w-3/5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3 opacity-20"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Powerful Features for Modern Learning
                        </h2>
                        <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Discover how AI StudyHelper revolutionizes the way you learn with cutting-edge technology
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${darkMode
                                        ? 'bg-gray-900 hover:bg-gray-700 shadow-lg'
                                        : 'bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {feature.title}
                                </h3>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            What Students Say About Us
                        </h2>
                        <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Join thousands of successful learners who have transformed their study experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`p-8 rounded-2xl ${darkMode
                                        ? 'bg-gray-800 shadow-lg'
                                        : 'bg-gray-50 shadow-lg'
                                    }`}
                            >
                                <div className="flex items-center mb-4">
                                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                                    <div>
                                        <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {testimonial.name}
                                        </h4>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                                <p className={`italic ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    "{testimonial.content}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`py-20 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Ready to Transform Your Learning?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of students who are already studying smarter with AI StudyHelper.
                        Start your journey today and experience the future of learning.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Start Learning Now
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Home;
