import React, { useEffect, useRef } from 'react';

const LOCAL_TRACK = './audio/sun-or-suck.mp3';

export const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const start = () => {
      const audio = audioRef.current;
      if (!audio || !audio.paused) return;
      audio.volume = 0.42;
      void audio.play().catch(() => undefined);
    };
    document.addEventListener('pointerdown', start, { capture: true });
    document.addEventListener('keydown', start, { capture: true });
    start();
    return () => {
      document.removeEventListener('pointerdown', start, { capture: true });
      document.removeEventListener('keydown', start, { capture: true });
    };
  }, []);

  return <audio ref={audioRef} src={LOCAL_TRACK} loop preload="auto" aria-hidden="true" />;
};
