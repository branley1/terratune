import React, { useRef, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';

const Visualizer = () => {
  const canvasRef = useRef(null);
  const { isPlaying /*, getAudioData */ } = useAudio();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const draw = () => {
      if (!isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height * (isPlaying ? Math.random() * 0.2 + 0.1 : 0));

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying /*, getAudioData */]);

  return (
    <canvas ref={canvasRef} width="150" height="40" className="visualizer-canvas"></canvas>
  );
};

export default Visualizer; 