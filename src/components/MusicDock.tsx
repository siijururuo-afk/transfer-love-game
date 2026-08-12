import React, { useEffect, useRef, useState } from 'react';

const LOCAL_TRACK = './audio/sun-or-suck.mp3';
const OFFICIAL_TRACK = 'https://music.apple.com/us/song/sun-or-suck/1574859611';

export const MusicDock: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(LOCAL_TRACK, { method: 'HEAD' })
      .then((response) => { if (active) setAvailable(response.ok); })
      .catch(() => { if (active) setAvailable(false); });
    return () => { active = false; };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try { await audio.play(); setPlaying(true); } catch { setPlaying(false); }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <aside className="music-dock" aria-label="背景音乐">
      {available && <audio ref={audioRef} src={LOCAL_TRACK} loop preload="metadata" onEnded={() => setPlaying(false)} />}
      <div className="music-dock__disc" aria-hidden="true"><i /></div>
      <div className="music-dock__copy">
        <strong>SUN OR SUCK</strong>
        <span>WOODZ · BGM</span>
      </div>
      {available ? (
        <button className="music-dock__play" onClick={toggle} aria-label={playing ? '暂停背景音乐' : '播放背景音乐'}>
          {playing ? 'Ⅱ' : '▶'}
        </button>
      ) : (
        <a className="music-dock__official" href={OFFICIAL_TRACK} target="_blank" rel="noreferrer">官方播放 ↗</a>
      )}
    </aside>
  );
};
