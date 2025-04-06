import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for active styling

// Reusable NavItem component - Adjusted styles
const NavItem = ({ to, icon, text, isVisible }) => (
  <li>
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center rounded text-sm font-bold transition-colors duration-200 ease-in-out 
         ${isVisible ? 'py-2.5 px-0' : 'py-2.5 px-3 justify-center'} 
         ${isActive ? 'text-white' : 'text-lightText hover:text-white'}`
      }
    >
      <i className={`fas ${icon} ${isVisible ? 'mr-4' : 'mr-0'} w-5 text-center text-lg flex-shrink-0`}></i>
      {isVisible && <span className="nav-text whitespace-nowrap">{text}</span>}
    </NavLink>
  </li>
);

const Sidebar = ({ isVisible, onToggle }) => {
  return (
    <aside 
      className={`sidebar fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-black/40 border-r border-white/10 ${isVisible ? 'w-60 p-6' : 'w-20 py-6 px-2.5'}`}
      style={{ paddingBottom: '90px' }}
    >
      <div className={`brand flex items-center mb-7 flex-shrink-0 ${!isVisible ? 'justify-center' : ''}`}>
        <div className={`leaf-icon text-emerald-400 text-3xl ${isVisible ? 'mr-2.5' : 'mr-0'} flex-shrink-0`}>
          <i className="fas fa-leaf"></i>
        </div>
        {isVisible && (
          <h1 className="brand-title text-2xl font-brand font-bold whitespace-nowrap">
            TerraTune
          </h1>
        )}
        <button 
          onClick={onToggle} 
          className={`ml-auto text-gray-400 hover:text-white focus:outline-none ${!isVisible ? 'absolute left-full ml-2 top-6 transform -translate-y-1/2 bg-black/60 p-2 rounded-full backdrop-blur-sm shadow-lg' : ''}`}
          title={isVisible ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          <i className={`fas ${isVisible ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>
      </div>

      <nav className="mb-5 flex-shrink-0">
        <ul>
          <NavItem to="/" icon="fa-home" text="Home" isVisible={isVisible} />
          <NavItem to="/search" icon="fa-search" text="Search" isVisible={isVisible} />
          <NavItem to="/library" icon="fa-layer-group" text="Your Library" isVisible={isVisible} />
          <NavItem to="/profile" icon="fa-user" text="Profile" isVisible={isVisible} />
        </ul>
      </nav>

      <div className={`playlists flex-grow overflow-y-auto overflow-x-hidden border-t border-white/10 pt-5 ${!isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200 ease-in-out`}>
        {isVisible && (
          <>
            <button className="flex items-center text-sm font-semibold text-lightText hover:text-white mb-4 w-full py-1">
              <i className="fas fa-plus-square text-2xl mr-3 w-5 text-center"></i>
              <span className="nav-text whitespace-nowrap">Create Playlist</span>
            </button>
            <NavLink to="/collection/tracks" className={({isActive}) => `flex items-center text-sm font-semibold mb-4 w-full py-1 ${isActive ? 'text-white' : 'text-lightText hover:text-white'}`}>
              <i className="fas fa-heart text-2xl mr-3 w-5 text-center text-emerald-400"></i>
              <span className="nav-text whitespace-nowrap">Liked Songs</span>
            </NavLink>
            <h3 className="text-xs uppercase tracking-wider text-mutedText mb-2.5 whitespace-nowrap px-0">Playlists</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-sm text-lightText hover:text-white block truncate py-1.5">Forest Chill</a></li>
              <li><a href="#" className="text-sm text-lightText hover:text-white block truncate py-1.5">Mountain Highs</a></li>
              <li><a href="#" className="text-sm text-lightText hover:text-white block truncate py-1.5">Ocean Calm Radio</a></li>
              <li><a href="#" className="text-sm text-lightText hover:text-white block truncate py-1.5">Rainy Day Focus</a></li>
              <li><a href="#" className="text-sm text-lightText hover:text-white block truncate py-1.5">Desert Winds</a></li>
              <li><a href="#" className="text-sm text-lightText hover:text-white block truncate py-1.5">Jungle Beats</a></li>
            </ul>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 