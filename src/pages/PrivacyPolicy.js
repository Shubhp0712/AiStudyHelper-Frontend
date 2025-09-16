import React from 'react';
import Layout from '../components/Layout';
import { useDarkMode } from '../context/DarkModeContext';

const PrivacyPolicy = () => {
    const { darkMode } = useDarkMode();

    return (
        <Layout>
            <div className={`min-h-screen py-12 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Privacy Policy
                        </h1>
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    {/* Content */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 space-y-8`}>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                1. Information We Collect
                            </h2>
                            <div className={`text-base leading-7 space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p>
                                    We collect information you provide directly to us, such as when you create an account, use our services, or contact us.
                                </p>
                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information:</h3>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Name and email address</li>
                                    <li>Account credentials</li>
                                    <li>Study materials and flashcards you create</li>
                                    <li>Progress and usage data</li>
                                    <li>Communication with our support team</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                2. How We Use Your Information
                            </h2>
                            <div className={`text-base leading-7 space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p>We use the information we collect to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Personalize your learning experience</li>
                                    <li>Generate AI-powered study materials</li>
                                    <li>Track your progress and provide analytics</li>
                                    <li>Send you technical notices and support messages</li>
                                    <li>Respond to your comments and questions</li>
                                    <li>Detect and prevent fraud or abuse</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                3. Information Sharing
                            </h2>
                            <div className={`text-base leading-7 space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p>
                                    We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>With your consent</li>
                                    <li>To comply with legal obligations</li>
                                    <li>To protect our rights and safety</li>
                                    <li>With service providers who assist us in operating our service</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                4. Data Storage and Security
                            </h2>
                            <div className={`text-base leading-7 space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p>
                                    We implement appropriate security measures to protect your personal information against unauthorized access,
                                    alteration, disclosure, or destruction. This includes:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Encryption of data in transit and at rest</li>
                                    <li>Regular security assessments</li>
                                    <li>Limited access to personal information</li>
                                    <li>Secure authentication systems</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                5. Your Rights and Choices
                            </h2>
                            <div className={`text-base leading-7 space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p>You have the following rights regarding your personal information:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Access:</strong> Request access to your personal information</li>
                                    <li><strong>Update:</strong> Correct or update your information</li>
                                    <li><strong>Delete:</strong> Request deletion of your account and data</li>
                                    <li><strong>Export:</strong> Request a copy of your data</li>
                                    <li><strong>Opt-out:</strong> Unsubscribe from communications</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                6. Cookies and Tracking
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                We use cookies and similar tracking technologies to improve your experience on our service.
                                Cookies help us remember your preferences, analyze usage patterns, and provide personalized content.
                                You can control cookie settings through your browser preferences.
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                7. Third-Party Services
                            </h2>
                            <div className={`text-base leading-7 space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <p>Our service may integrate with third-party services such as:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Firebase for authentication and data storage</li>
                                    <li>AI providers for content generation</li>
                                    <li>Analytics services for usage tracking</li>
                                </ul>
                                <p>These third parties have their own privacy policies, and we encourage you to review them.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                8. Children's Privacy
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Our service is not intended for children under 13 years of age. We do not knowingly collect personal
                                information from children under 13. If you are a parent or guardian and believe your child has provided
                                us with personal information, please contact us so we can delete such information.
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                9. Changes to This Policy
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                                the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review
                                this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                10. Contact Us
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                If you have any questions about this Privacy Policy or our data practices, please contact us at:
                                <br />
                                <strong>Email:</strong> shubhgugada2005@gmail.com
                                <br />
                                <strong>GitHub:</strong> https://github.com/Shubhp0712
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPolicy;
