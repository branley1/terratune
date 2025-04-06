import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Used to render child routes
import Sidebar from './Sidebar'; // We'll create this next
import Player from './Player'; // Use the existing Player component

const Layout = () => {
  // State to manage sidebar visibility (like in original script.js)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    // Add class based on sidebar state, similar to original body class toggling
    <div className={`app-container flex h-screen overflow-hidden ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-collapsed'}`}>
      
      <Sidebar isVisible={isSidebarVisible} onToggle={toggleSidebar} />

      {/* Main Area (Content + Player) */}
      {/* Use padding-left to account for sidebar width */}
      <div 
        className={`main-area flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarVisible ? 'pl-60' : 'pl-20'}`}
        // Apply dynamic padding left based on sidebar state
      >
        {/* Main Content Area - Child routes will render here */}
        {/* Add padding-bottom to account for player bar height */}
        <main className="main-content flex-1 overflow-y-auto pb-24"> 
           {/* Removed fixed padding, added pb-24 for player */} 
          <Outlet /> 
        </main>

        {/* Player Bar - Positioned at the bottom */}
        <div className="player-wrapper fixed bottom-0 left-0 right-0 z-40">
            {/* Apply padding-left to player wrapper as well */}
            <div className={`transition-all duration-300 ease-in-out ${isSidebarVisible ? 'pl-60' : 'pl-20'}`}>
                <Player />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 