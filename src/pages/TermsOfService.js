import React from 'react';
import Layout from '../components/Layout';
import { useDarkMode } from '../context/DarkModeContext';

const TermsOfService = () => {
    const { darkMode } = useDarkMode();

    return (
        <Layout>
            <div className={`min-h-screen py-12 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Terms of Service
                        </h1>
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    {/* Content */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 space-y-8`}>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                1. Acceptance of Terms
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                By accessing and using AI Study Assistant, you accept and agree to be bound by the terms and provision of this agreement.
                                If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                2. Use License
                            </h2>
                            <p className={`text-base leading-7 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Permission is granted to temporarily download one copy of AI Study Assistant per device for personal,
                                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <li>modify or copy the materials</li>
                                <li>use the materials for any commercial purpose or for any public display</li>
                                <li>attempt to reverse engineer any software contained in the service</li>
                                <li>remove any copyright or other proprietary notations from the materials</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                3. User Accounts
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                                You are responsible for safeguarding the password and for all activities that occur under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                4. Content Guidelines
                            </h2>
                            <p className={`text-base leading-7 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Users are responsible for the content they create using our AI Study Assistant. You agree not to use the service to:
                            </p>
                            <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <li>Create or share content that is illegal, harmful, or violates others' rights</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with or disrupt the service</li>
                                <li>Use the service for any unlawful purposes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                5. Privacy Policy
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information
                                when you use our service. By using our service, you agree to the collection and use of information in accordance
                                with our Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                6. Service Availability
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                We strive to provide a reliable service, but we cannot guarantee that the service will be available at all times.
                                We may suspend or discontinue the service for maintenance, updates, or other reasons with or without notice.
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                7. Limitation of Liability
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                In no event shall AI Study Assistant or its suppliers be liable for any damages (including, without limitation,
                                damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use
                                the service, even if AI Study Assistant or an authorized representative has been notified of the possibility of such damage.
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                8. Changes to Terms
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                We reserve the right to modify these terms at any time. We will notify users of any significant changes.
                                Your continued use of the service after such modifications will constitute acknowledgment and agreement of the modified terms.
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                9. Contact Information
                            </h2>
                            <p className={`text-base leading-7 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfService;
