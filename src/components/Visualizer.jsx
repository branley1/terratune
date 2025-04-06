import React, { useRef, useEffect, useState } from 'react';
import { useAudio } from '../contexts/AudioContext';

const Visualizer = () => {
  const canvasRef = useRef(null);
  const workerRef = useRef(null);
  const [audioData, setAudioData] = useState(null);
  const { isPlaying } = useAudio();

  useEffect(() => {
    console.log('[Visualizer] Attempting to create audio worker...');
    try {
      // Construct worker URL relative to frontend origin
      const workerUrl = new URL('../workers/audioWorker.js', window.location.origin);
      console.log(`[Visualizer] Constructed worker URL: ${workerUrl.href}`);
      
      // Check if URL is blob - indicates potential issue
      if (workerUrl.protocol === 'blob:') {
          console.warn('[Visualizer] Worker URL is unexpectedly a blob URL. This might cause issues.');
      }

      workerRef.current = new Worker(workerUrl);
      console.log('[Visualizer] Audio worker created:', workerRef.current);

      workerRef.current.onmessage = (e) => {
        console.log('[Visualizer] Message received from worker:', e.data);
        setAudioData(e.data);
      };

      workerRef.current.onerror = (e) => {
        console.error('[Visualizer] Error from audio worker:', e);
        if (e instanceof ErrorEvent) {
          console.error(`   Message: ${e.message}`);
          console.error(`   Filename: ${e.filename}`);
          console.error(`   Lineno: ${e.lineno}`);
        }
      };
    } catch (error) {
      console.error('[Visualizer] Failed to construct Worker:', error);
    }

    return () => {
      console.log('[Visualizer] Terminating worker');
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId;

    const draw = () => {
      if (!canvas || !ctx) return;
      if (!isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      const intensity = audioData?.average ? audioData.average / 255 : Math.random() * 0.2 + 0.1;
      
      ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(0, canvas.height * (1 - intensity), canvas.width, canvas.height * intensity);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, audioData]);

  return (
    <canvas ref={canvasRef} width="150" height="40" className="visualizer-canvas"></canvas>
  );
};

export default Visualizer; 