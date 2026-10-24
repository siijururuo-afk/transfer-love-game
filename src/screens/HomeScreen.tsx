import React from 'react';
import { ShowMark } from '../components/ShowMark';
import { Icon } from '../components/Doodles';
import { CHAPTER_ORDER, manifestData } from '../data/loader';
import type { ProgressState } from '../hooks/useProgress';

interface Props {
  state: ProgressState;
  hasProgress: boolean;
  onContinue: () => void;
  onRestart: () => void;
  onOpenChapters: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  state,
  hasProgress,
  onContinue,
  onRestart,
  onOpenChapters,
}) => {
  const total = manifestData.totalBlocks;
  const read = Object.keys(state.readSourceIds).length;
  const pct = total ? Math.round((read / total) * 100) : 0;
  const recent = state.current.chapter;
  const episode = Math.max(1, CHAPTER_ORDER.indexOf(recent) + 1);
  return (
    <div className="home">
      <header className="home__topline">
        <span className="home__edition">TVING <small>ORIGINAL</small></span>
        <span className="home__onair">EP {String(episode).padStart(2, '0')} <i /></span>
      </header>

      <section className="home__hero" aria-labelledby="home-title">
        <div className="home__title-wrap">
          <span className="home__eyebrow">끝난 사랑, 다시 시작할 수 있을까</span>
          <ShowMark />
          <h1 className="home__title" id="home-title">换乘恋爱</h1>
          <span className="home__title-en">EXchange · 承硕的故事</span>
        </div>
      </section>

      <section className="home__resume" aria-label="阅读进度">
        <div className="home__notification"><span className="app-icon app-icon--message">✉</span><span>信息<small>现在</small></span></div>
        <div className="home__notification-copy"><strong>换乘恋爱 节目组</strong><span>属于你们的故事，已经送达。</span></div>
        <div className="home__resume-head">
          <span>{hasProgress ? 'CONTINUE' : 'START'}</span>
          <strong>{pct}%</strong>
        </div>
        <div className="home__progress-line" aria-label={`总阅读进度 ${pct}%`}><i style={{ width: `${pct}%` }} /></div>
        <div className="home__resume-copy">
          <strong>{hasProgress ? recent : '第1部分'}</strong>
          <span>{hasProgress ? `第 ${state.current.stepIndex + 1} 个阅读节点` : '从开场开始'}</span>
        </div>
      </section>

      <div className="home__actions">
        <button
          className="btn btn--primary btn--hero"
          onClick={hasProgress ? onContinue : onRestart}
          aria-label={hasProgress ? '继续阅读' : '开始观看'}
        >
          <span>{hasProgress ? '解锁 · 继续观看' : '解锁 · 打开故事'}</span>
          <Icon name="next" size={20} />
        </button>
        <div className="home__action-row">
          {hasProgress && (
            <button className="btn btn--quiet" onClick={onRestart} aria-label="从头开始">
              <Icon name="reset" size={17} /> 从头开始
            </button>
          )}
          <button className="btn btn--quiet" onClick={onOpenChapters} aria-label="章节目录">
            <Icon name="list" size={17} /> 章节目录
          </button>
        </div>
      </div>

      <footer className="home__footer">
        <span>{manifestData.totalChapters} EPISODES</span><i />
        <span>{read.toLocaleString('zh-CN')} / {total.toLocaleString('zh-CN')}</span>
      </footer>
    </div>
  );
};
