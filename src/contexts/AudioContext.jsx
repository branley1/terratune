import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const AudioContext = createContext();

const VOLUME_KEY = 'audio_volume';
const QUEUE_KEY = 'audio_queue';

export const AudioProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem(VOLUME_KEY);
    return savedVolume ? parseFloat(savedVolume) : 0.7; // Default to 70% volume
  });
  const [queue, setQueue] = useState(() => {
    const savedQueue = localStorage.getItem(QUEUE_KEY);
    return savedQueue ? JSON.parse(savedQueue) : [];
  });
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Initialize audio element with proper settings
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleError = useCallback((error) => {
    console.error('Audio playback error:', error);
    let errorMessage;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error?.target instanceof HTMLAudioElement) {
      // Handle media error codes
      switch (error.target.error?.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'Playback aborted by the user';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error while loading audio';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'Audio decoding failed';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Audio format not supported';
          break;
        default:
          errorMessage = error.target.error?.message || 'Unknown audio error';
      }
    } else {
      errorMessage = 'Failed to play audio. Please try again.';
    }

    setError(errorMessage);
    setIsPlaying(false);
    
    // Clear the error after 5 seconds
    setTimeout(() => setError(null), 5000);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      if (queue.length > 0) {
        const nextTrack = queue[0];
        const newQueue = queue.slice(1);
        setQueue(newQueue);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
        setCurrentTrack(nextTrack);
        setError(null);
        
        try {
          audio.src = nextTrack.file_url;
          audio.play().catch(handleError);
        } catch (err) {
          handleError(err);
        }
      } else {
        setIsPlaying(false);
        setCurrentTrack(null);
      }
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setError('Error playing track: ' + (e.message || 'Unknown error'));
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [queue, handleError]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (!isAuthenticated) {
      audio.pause();
      audio.src = '';
      setCurrentTrack(null);
      setIsPlaying(false);
      return;
    }
    
    const loadAndPlayTrack = async () => {
      if (!currentTrack?.file_url) {
        audio.pause();
        audio.src = '';
        if (currentTrack && !currentTrack.file_url) {
          handleError(new Error('Track URL is missing'));
        }
        return;
      }

      try {
        // Reset the audio element
        audio.pause();
        audio.currentTime = 0;
        
        // Load and play the new track
        audio.src = currentTrack.file_url;
        
        // Wait for metadata to load
        await new Promise((resolve, reject) => {
          const loadHandler = () => {
            audio.removeEventListener('loadedmetadata', loadHandler);
            audio.removeEventListener('error', errorHandler);
            resolve();
          };
          
          const errorHandler = (error) => {
            audio.removeEventListener('loadedmetadata', loadHandler);
            audio.removeEventListener('error', errorHandler);
            reject(error);
          };
          
          audio.addEventListener('loadedmetadata', loadHandler);
          audio.addEventListener('error', errorHandler);
          
          audio.load();
        });
        
        if (isPlaying) {
          await audio.play();
        }
      } catch (err) {
        handleError(err);
      }
    };
    
    loadAndPlayTrack();
  }, [currentTrack, isPlaying, handleError, isAuthenticated]);

  useEffect(() => {
    audioRef.current.volume = volume;
    localStorage.setItem(VOLUME_KEY, volume.toString());
  }, [volume]);

  const togglePlay = async () => {
    if (currentTrack) {
      try {
        if (!isPlaying) {
          await audioRef.current.play();
          setIsPlaying(true);
          setError(null);
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } catch (err) {
        handleError(err);
      }
    }
  };

  const seek = (time) => {
    if (currentTrack) {
      const audio = audioRef.current;
      audio.currentTime = (time / 100) * audio.duration;
    }
  };

  const addToQueue = (track) => {
    const newQueue = [...queue, track];
    setQueue(newQueue);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
  };

  const clearQueue = () => {
    setQueue([]);
    localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
  };

  const nextTrack = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const newQueue = queue.slice(1);
      setQueue(newQueue);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
      setCurrentTrack(nextTrack);
      setError(null);
      setIsPlaying(true);
    }
  };

  const prevTrack = () => {
    // For now, just restart the current track
    // In a real app, you'd want to maintain a history of played tracks
    if (currentTrack) {
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        isPlaying,
        setIsPlaying,
        progress,
        volume,
        setVolume,
        queue,
        addToQueue,
        clearQueue,
        togglePlay,
        seek,
        error,
        nextTrack,
        prevTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}; 