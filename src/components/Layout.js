import React from 'react';
import ProfessionalHeader from './ProfessionalHeader';
import ProfessionalFooter from './ProfessionalFooter';
import { useDarkMode } from '../context/DarkModeContext';

const Layout = ({ children, showFooter = false }) => {
    const { darkMode } = useDarkMode();

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            <ProfessionalHeader />
            <main className="flex-grow">
                {children}
            </main>
            {showFooter && <ProfessionalFooter />}
        </div>
    );
};

export default Layout;
