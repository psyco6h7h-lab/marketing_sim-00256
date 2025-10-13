
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Header from './Header';
import { useResponsive } from '../hooks/useResponsive';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isMobile, isTablet } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Desktop Sidebar - Always visible on desktop */}
      {!isMobile && (
        <Sidebar />
      )}

      {/* Mobile/Tablet Sidebar - Overlay */}
      {(isMobile || isTablet) && (
        <MobileSidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose} 
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={handleMenuClick}
          showHamburger={isMobile || isTablet}
        />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${
          isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-6 md:p-8'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
