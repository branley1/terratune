import React from 'react';
import { useUI } from '../contexts/UIContext';
import { useAudio } from '../contexts/AudioContext';

const NowPlayingOverlay = () => {
  const { isNowPlayingVisible, hideNowPlaying } = useUI();
  const { currentTrack } = useAudio();

  if (!isNowPlayingVisible || !currentTrack) {
    return null; // Don't render if not visible or no track
  }

  // Get track details
  const title = currentTrack.title || 'Unknown Title';
  const artist = currentTrack.artist_name || 'Unknown Artist';
  const coverUrl = currentTrack.album?.cover_url || '/placeholder-album.png';

  return (
    <div 
      id="now-playing-page" 
      className={`fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-8 transition-opacity duration-300 ease-in-out ${isNowPlayingVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      {/* Close Button */}
      <button 
        onClick={hideNowPlaying}
        className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl z-10"
        aria-label="Close now playing"
      >
        <i className="fas fa-times"></i>
      </button>

      {/* Content Placeholder */}
      <div className="text-center">
        <img 
          src={coverUrl}
          alt={title}
          className="w-64 h-64 object-cover rounded-lg shadow-2xl mb-8 mx-auto"
        />
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-white/70 text-lg mb-8">{artist}</p>

        {/* Placeholder for controls */}
        <div className="w-full max-w-md">
          <p className="text-white/50">(Progress Bar & Controls Placeholder)</p>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingOverlay; 