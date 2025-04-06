import { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useAuth } from '../contexts/AuthContext';

const Queue = () => {
  const { queue, currentTrack, setCurrentTrack, isPlaying, setIsPlaying } = useAudio();
  const { token } = useAuth();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const trackPromises = queue.map(async (trackId) => {
          const response = await fetch(`http://localhost:3000/api/tracks/${trackId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch track');
          return response.json();
        });

        const trackData = await Promise.all(trackPromises);
        setTracks(trackData);
      } catch (err) {
        console.error('Error fetching tracks:', err);
      }
    };

    if (queue.length > 0) {
      fetchTracks();
    }
  }, [queue, token]);

  const handleTrackClick = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  if (queue.length === 0) {
    return (
      <div className="queue-section rounded-xl p-5 flex flex-col items-center justify-center min-h-[200px]">
        <i className="fas fa-music text-accent/60 text-4xl mb-3"></i>
        <p className="text-white/70 text-center">Your queue is empty</p>
        <p className="text-white/50 text-sm text-center mt-2">Add songs to your queue to continue your journey</p>
      </div>
    );
  }

  return (
    <div className="queue-section rounded-xl p-5 flex flex-col">
      <h2 className="section-title text-xl font-bold mb-4 flex items-center">
        <i className="fas fa-stream text-accent mr-2"></i>
        Your Queue
      </h2>
      <div className="queue-list flex-grow overflow-y-auto">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`song-card flex items-center p-3 my-2 rounded-lg cursor-pointer transition-all duration-200 ${
              currentTrack?.id === track.id
                ? 'bg-white/10 border-accent'
                : 'hover:bg-white/10'
            }`}
            onClick={() => handleTrackClick(track)}
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/20 rounded flex items-center justify-center flex-shrink-0">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <i className="fas fa-pause text-accent"></i>
                  ) : (
                    <i className="fas fa-play text-white/70"></i>
                  )}
                </div>
                <div className="song-details min-w-0 flex-1">
                  <h4 className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    {track.title}
                  </h4>
                  <p className="text-xs text-white/70 whitespace-nowrap overflow-hidden text-ellipsis">
                    {track.artist_name}
                  </p>
                </div>
              </div>
              <span className="duration text-xs text-white/70 flex-shrink-0">
                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;