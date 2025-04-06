import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAudio } from '../contexts/AudioContext';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import Visualizer from './Visualizer';

// Define PropTypes for track object
const TrackPropTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  artist_name: PropTypes.string,
  duration: PropTypes.number.isRequired,
  file_url: PropTypes.string.isRequired,
  album: PropTypes.shape({
    cover_url: PropTypes.string,
    title: PropTypes.string
  })
};

const Player = () => {
  const { isAuthenticated } = useAuth();
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    togglePlay,
    seek,
    setVolume,
    nextTrack,
    prevTrack,
    error
  } = useAudio();
  const { showNowPlaying } = useUI();

  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [showError, setShowError] = useState(false);
  const progressBarRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (event) => {
    const progressBar = event.currentTarget;
    const clickPosition = event.nativeEvent.offsetX;
    const barWidth = progressBar.clientWidth;
    const seekTimePercentage = (clickPosition / barWidth) * 100;
    seek(seekTimePercentage);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume || 0.7); // Default to 70% if no previous volume
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      // Hide error after 5 seconds
      errorTimeoutRef.current = setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error]);

  if (!isAuthenticated || (!currentTrack && !error)) return null;

  const duration = currentTrack?.duration || 0;
  const currentTime = (progress / 100) * duration;

  return (
    <footer className="player-bar fixed bottom-0 left-0 right-0 flex flex-col px-4 z-50">
      {showError && error && (
        <div className="bg-red-500/20 text-red-400 py-2 px-4 text-sm text-center">
          {error}
        </div>
      )}
      <div className="h-24 flex items-center justify-between">
      {/* Song Info Section */}
      <div 
        className="song-info flex items-center gap-3 min-w-[180px] max-w-[30%] cursor-pointer"
        onClick={showNowPlaying}
      >
        <img
          src={currentTrack?.album?.cover_url || '/placeholder-album.png'}
          alt={currentTrack?.title || 'Unknown Track'}
          className="w-14 h-14 object-cover rounded"
        />
        <div className="text overflow-hidden">
          <h4 className="font-medium text-sm text-white whitespace-nowrap overflow-hidden text-ellipsis">{currentTrack?.title || 'Unknown Title'}</h4>
          <p className="text-xs text-white/70 whitespace-nowrap overflow-hidden text-ellipsis">{currentTrack?.artist_name || 'Unknown Artist'}</p>
        </div>
        <button className="ml-2 text-white/70 hover:text-white"><i className="far fa-heart"></i></button>
      </div>

      {/* Player Controls Section */}
      <div className="player-controls flex flex-col items-center flex-2 max-w-[40%]">
        <div className="buttons flex items-center gap-4 mb-2">
          <button title="Shuffle" className="text-white/70 hover:text-white"><i className="fas fa-random"></i></button>
          <button 
            title="Previous" 
            onClick={prevTrack}
            className="text-white/70 hover:text-white"
          >
            <i className="fas fa-step-backward"></i>
          </button>
          <button
            className="play-pause-main bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform w-9 h-9"
            title={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
          </button>
          <button 
            title="Next" 
            onClick={nextTrack}
            className="text-white/70 hover:text-white"
          >
            <i className="fas fa-step-forward"></i>
          </button>
          <button title="Repeat" className="text-white/70 hover:text-white"><i className="fas fa-redo"></i></button>
        </div>
        <div className="progress-container flex items-center w-full max-w-[500px] gap-2">
          <span className="text-xs text-white/70 min-w-[30px] text-center">{formatTime(currentTime)}</span>
          <div
            className="progress-bar flex-grow h-1 bg-white/30 rounded-full cursor-pointer relative"
            onClick={handleSeek}
            ref={progressBarRef}
          >
            <div 
              className="progress-fill h-full bg-accent rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-white/70 min-w-[30px] text-center">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Other Controls Section */}
      <div className="other-controls flex items-center justify-end gap-3 min-w-[180px] max-w-[30%]">
        <button title="Queue" className="text-white/70 hover:text-white"><i className="fas fa-stream"></i></button>
        <button title="Devices" className="text-white/70 hover:text-white"><i className="fas fa-desktop"></i></button>
        <div className="volume-container flex items-center gap-2">
          <button
            title="Mute/Unmute"
            className="text-white/70 hover:text-white"
            onClick={toggleMute}
          >
            <i className={`fas ${volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'}`}></i>
          </button>
          <input
            type="range"
            className="volume-slider w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
            value={volume}
            onChange={handleVolumeChange}
            min="0"
            max="1"
            step="0.01"
            title="Volume"
          />
        </div>
        <button title="Full Screen" className="text-white/70 hover:text-white"><i className="fas fa-expand"></i></button>
      </div>
      </div>
    </footer>
  );
};

// PropTypes are not needed since we're using context values directly

export default Player; 