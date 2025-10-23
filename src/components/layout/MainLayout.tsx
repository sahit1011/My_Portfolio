'use client';

import React from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div
      className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300"
      style={{
        background: "radial-gradient(circle at top left, rgba(30, 58, 138, 0.4) 0%, transparent 30%), radial-gradient(circle at top right, rgba(30, 58, 138, 0.4) 0%, transparent 30%), radial-gradient(circle at top center, rgba(30, 58, 138, 0.4) 0%, transparent 20%), linear-gradient(to bottom, black 0%, black 70%, #1e3a8a 100%)",
        backgroundSize: "200% 200%, 200% 200%, 200% 200%, 200% 200%",
        animation: "roamingGradient 10s ease-in-out infinite"
      }}
    >
      <Navbar />
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
