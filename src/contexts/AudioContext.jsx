import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [queue, setQueue] = useState([]);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      if (queue.length > 0) {
        const nextTrack = queue[0];
        setQueue(queue.slice(1));
        setCurrentTrack(nextTrack);
        audio.src = nextTrack.file_url;
        audio.play();
      } else {
        setIsPlaying(false);
        setCurrentTrack(null);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queue]);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (currentTrack) {
      audio.src = currentTrack.file_url;
      if (isPlaying) {
        audio.play();
      }
    } else {
      audio.pause();
      audio.src = '';
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
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
    setQueue([...queue, track]);
  };

  const clearQueue = () => {
    setQueue([]);
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