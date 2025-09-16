import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

export const SidebarProvider = ({ children }) => {
    const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);

    const value = {
        isMainSidebarOpen,
        setIsMainSidebarOpen,
        openMainSidebar: () => setIsMainSidebarOpen(true),
        closeMainSidebar: () => setIsMainSidebarOpen(false),
        toggleMainSidebar: () => setIsMainSidebarOpen(prev => !prev)
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};
