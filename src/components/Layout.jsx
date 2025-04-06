import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom'; // Used to render child routes
import Sidebar from './Sidebar'; // We'll create this next
import Player from './Player'; // Use the existing Player component

const Layout = ({ children }) => {
  // State to manage sidebar visibility - initialize as false
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);

  // Toggle sidebar visibility and update body class
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarVisible && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarVisible(false);
      }
    };

    // Add event listener when sidebar is visible
    if (isSidebarVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarVisible]);

  // Apply or remove sidebar-visible class on body element
  useEffect(() => {
    if (isSidebarVisible) {
      document.body.classList.add('sidebar-visible');
    } else {
      document.body.classList.remove('sidebar-visible');
    }
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('sidebar-visible');
    };
  }, [isSidebarVisible]);

  return (
    <div className="app-container h-screen overflow-hidden">
      
      {/* Sidebar component with visibility control */}
      <div ref={sidebarRef}>
        <Sidebar isVisible={isSidebarVisible} onToggle={toggleSidebar} />
      </div>

      {/* Main Area - Content */}
      <div className="main-area flex-1 flex flex-col overflow-hidden">
        {/* Main Content - Child routes will render here */}
        <main className="main-content flex-1 overflow-y-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
      
      {/* Player remains at the bottom of the page via fixed positioning in its own component */}
    </div>
  );
};

export default Layout; 