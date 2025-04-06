import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom'; // Used to render child routes
import Sidebar from './Sidebar'; // We'll create this next

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
    // Use flex layout for sidebar + main content
    <div className="flex flex-1 min-h-0"> {/* flex-1 and min-h-0 are important for flex children scrolling */}
      
      {/* Sidebar component */}
      <div ref={sidebarRef}>
        <Sidebar isVisible={isSidebarVisible} onToggle={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      {/* flex-1 allows this area to grow, overflow-y-auto enables scrolling */}
      <main className="main-content flex-1 overflow-y-auto p-6 pb-24">
        {children || <Outlet />}
      </main>
      
      {/* Player is now handled in App.jsx */}
    </div>
  );
};

export default Layout; 