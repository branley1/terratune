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
      <div className="p-4 text-center text-gray-500">
        Your queue is empty
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Queue</h2>
      <div className="space-y-2">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              currentTrack?.id === track.id
                ? 'bg-indigo-100 border-indigo-500'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleTrackClick(track)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{track.title}</h3>
                  <p className="text-sm text-gray-500">{track.artist_name}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
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