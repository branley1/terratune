import React, { useRef, useEffect, useState } from 'react';
import { useAudio } from '../contexts/AudioContext';
import Visualizer from './Visualizer';

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    togglePlay,
    seek,
    setVolume,
    nextTrack,
    prevTrack
  } = useAudio();

  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const progressBarRef = useRef(null);

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
    setVolume(parseFloat(event.target.value));
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  if (!currentTrack) return null;

  const duration = currentTrack.duration || 0;
  const currentTime = (progress / 100) * duration;

  return (
    <footer className="player-bar h-24 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4 text-white">
      <div className="song-info flex items-center gap-3 w-1/4">
        <img
          src={currentTrack.album?.cover_url || '/placeholder-album.png'}
          alt={currentTrack.title}
          className="w-14 h-14 object-cover rounded"
        />
        <div className="text">
          <h4 className="font-medium text-sm truncate cursor-pointer hover:underline">{currentTrack.title}</h4>
          <p className="text-xs text-gray-400 truncate cursor-pointer hover:underline">{currentTrack.artist_name || 'Unknown Artist'}</p>
        </div>
        <button className="ml-2 text-gray-400 hover:text-white"><i className="far fa-heart"></i></button>
      </div>

      <div className="player-controls flex flex-col items-center w-1/2">
        <div className="buttons flex items-center gap-4 mb-2">
          <button title="Shuffle" className="text-gray-400 hover:text-white"><i className="fas fa-random"></i></button>
          <button title="Previous" className="text-gray-400 hover:text-white"><i className="fas fa-step-backward"></i></button>
          <button
            className="play-pause-main w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
          </button>
          <button title="Next" className="text-gray-400 hover:text-white"><i className="fas fa-step-forward"></i></button>
          <button title="Repeat" className="text-gray-400 hover:text-white"><i className="fas fa-redo"></i></button>
        </div>
        <div className="progress-container w-full flex items-center gap-2">
          <span className="current-time text-xs text-gray-400">{formatTime(currentTime)}</span>
          <div
            className="progress-bar flex-1 h-1 bg-gray-600 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div className="progress-fill h-full bg-white rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="total-time text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="other-controls flex items-center justify-end gap-3 w-1/4">
        <button title="Queue" className="text-gray-400 hover:text-white"><i className="fas fa-stream"></i></button>
        <button title="Devices" className="text-gray-400 hover:text-white"><i className="fas fa-desktop"></i></button>
        <div className="volume-container flex items-center gap-2">
          <button
            title="Mute/Unmute"
            className="volume-icon-button text-gray-400 hover:text-white"
            onClick={toggleMute}
          >
            <i className={`fas ${volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'}`}></i>
          </button>
          <input
            type="range"
            className="volume-slider w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
            value={volume}
            onChange={handleVolumeChange}
            min="0"
            max="1"
            step="0.01"
            title="Volume"
          />
        </div>
        <button title="Full Screen" className="text-gray-400 hover:text-white"><i className="fas fa-expand"></i></button>
      </div>
    </footer>
  );
};

export default Player; 