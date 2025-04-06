import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [isNowPlayingVisible, setIsNowPlayingVisible] = useState(false);

  const showNowPlaying = () => setIsNowPlayingVisible(true);
  const hideNowPlaying = () => setIsNowPlayingVisible(false);

  const value = {
    isNowPlayingVisible,
    showNowPlaying,
    hideNowPlaying,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}; 