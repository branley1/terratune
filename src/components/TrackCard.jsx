import React from 'react';
import { useAudio } from '../contexts/AudioContext';

const TrackCard = ({ track, playlist = [] }) => {
  const { setCurrentTrack, currentTrack, isPlaying, togglePlay } = useAudio();

  const handlePlay = () => {
    if (playlist.length > 0) {
      const trackIndex = playlist.findIndex(t => t.id === track.id);
      if (trackIndex !== -1) {
        setCurrentTrack(playlist[trackIndex]);
        togglePlay();
      }
    } else {
      setCurrentTrack(track);
      togglePlay();
    }
  };

  const isCurrentTrack = currentTrack?.id === track.id;

  // Determine which placeholder image to use based on track ID
  const placeholderImage = track.id % 2 === 1 ? '/placeholder-1.jpg' : '/placeholder-2.jpg';

  return (
    <div className="song-card rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg group">
      <div className="relative">
        <img
          src={placeholderImage}
          alt={track.title}
          className="w-full aspect-square rounded-lg object-cover shadow-md"
          onError={(e) => { e.target.onerror = null; e.target.src='/default-playlist.svg'}}
        />
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
        >
          {isCurrentTrack && isPlaying ? (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          )}
        </button>
      </div>
      <div className="mt-4">
        <h3 className="font-medium truncate text-white">{track.title}</h3>
        <p className="text-sm text-white/70 truncate">{track.artist?.name}</p>
      </div>
    </div>
  );
};

export default TrackCard; 