import React, { useState } from 'react';
import { useProgress } from './hooks/useProgress';
import { HomeScreen } from './screens/HomeScreen';
import { ReaderScreen } from './screens/ReaderScreen';
import { ChapterSheet } from './screens/Panels';

export default function App() {
  const prog = useProgress();
  const [view, setView] = useState<'home' | 'reader'>('home');
  const [homeChapters, setHomeChapters] = useState(false);

  const startContinue = () => { prog.goTo(prog.state.current); setView('reader'); };
  const startRestart = () => { prog.resetPosition(); setView('reader'); };
  const startChapter = (chapter: string) => {
    prog.goTo({ chapter, stepIndex: 0 });
    setHomeChapters(false);
    setView('reader');
  };

  const phoneStyle = { '--fs': `${17 * prog.state.fontScale}px` } as React.CSSProperties;

  return (
    <div className="app">
      <div
        className={'phone' + (prog.state.reduceMotion ? ' anim-reduced' : '')}
        style={phoneStyle}
      >
        {view === 'home' ? (
          <HomeScreen
            state={prog.state}
            hasProgress={prog.hasProgress}
            onContinue={startContinue}
            onRestart={startRestart}
            onOpenChapters={() => setHomeChapters(true)}
          />
        ) : (
          <ReaderScreen
            state={prog.state}
            goTo={prog.goTo}
            next={prog.next}
            prev={prog.prev}
            markRead={prog.markRead}
            jumpToSource={prog.jumpToSource}
            updateSettings={prog.updateSettings}
            onHome={() => setView('home')}
          />
        )}
      </div>

      {homeChapters && view === 'home' && (
        <ChapterSheet
          state={prog.state}
          onClose={() => setHomeChapters(false)}
          onSelect={startChapter}
        />
      )}
    </div>
  );
}
