// src/pages/Dashboard.js
import React from "react";
import Layout from "../components/Layout";
import ChatInterface from "../components/ChatInterface";
import { useDarkMode } from "../context/DarkModeContext";

export default function Dashboard() {
  const { darkMode } = useDarkMode();

  return (
    <Layout>
      <div className={`h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
        {/* Chat Interface - Full height minus header */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </Layout>
  );
}
