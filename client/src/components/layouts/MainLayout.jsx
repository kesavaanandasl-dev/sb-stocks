import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LiveTickerBar from './LiveTickerBar.jsx';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';

export default function MainLayout({ isDark, setIsDark }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 selection:bg-emerald-500/30">
      {/* Live simulated ticker banner at the top */}
      <LiveTickerBar />

      {/* Main Navbar */}
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Container with Sidebar & Outlet */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
