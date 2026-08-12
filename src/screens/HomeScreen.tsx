import React from 'react';
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

const VIEWER_NOTICE = '你将以观众视角观看既定故事，点选只负责推进剧情。';

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
  const progressStyle = { '--progress': `${pct * 3.6}deg` } as React.CSSProperties;

  return (
    <div className="home">
      <header className="home__topline">
        <span className="home__edition">VIEWER'S CUT · 10 EPISODES</span>
        <span className="home__onair"><i /> ON AIR</span>
      </header>

      <section className="home__hero" aria-labelledby="home-title">
        <div className="home__route" aria-hidden="true">
          <span className="home__route-dot" />
          <span className="home__route-line" />
          <Icon name="heart" size={22} />
        </div>
        <div className="home__title-wrap">
          <div className="home__eyebrow">TRANSIT LOVE</div>
          <h1 className="home__title" id="home-title">
            <span>换乘</span>
            <span className="home__title-second">恋爱<i>×</i></span>
          </h1>
          <p className="home__sub">一档只能观看，不能改写的恋爱真人秀</p>
        </div>
        <div className="home__stamp" aria-hidden="true">
          GOD'S<br />EYE<br /><small>观众席</small>
        </div>
      </section>

      <section className="home__ticket" aria-label="作品说明">
        <div className="home__ticket-no">NO. 2893</div>
        <p>{VIEWER_NOTICE}</p>
        <div className="home__ticket-modules" aria-hidden="true">
          <span>采访</span><span>短信</span><span>X ROOM</span><span>最终选择</span>
        </div>
      </section>

      <section className="home__resume">
        <div className="home__dial" style={progressStyle} aria-label={`总阅读进度 ${pct}%`}>
          <div><strong>{pct}</strong><small>%</small></div>
        </div>
        <div className="home__resume-copy">
          <span className="home__resume-kicker">{hasProgress ? 'CONTINUE WATCHING' : 'START WATCHING'}</span>
          <strong>{hasProgress ? `${recent} · 第 ${state.current.stepIndex + 1} 段` : '从第1部分开始观看'}</strong>
          <small>已读 {read.toLocaleString('zh-CN')} / {total.toLocaleString('zh-CN')} 段</small>
        </div>
        <div className="home__episode">EP<br /><b>{String(episode).padStart(2, '0')}</b></div>
      </section>

      <div className="home__actions">
        <button
          className="btn btn--primary btn--hero"
          onClick={hasProgress ? onContinue : onRestart}
          aria-label={hasProgress ? '继续阅读' : '开始观看'}
        >
          <span>{hasProgress ? '继续观看' : '开始观看'}</span>
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
        <span>{manifestData.totalChapters} PARTS</span>
        <span className="home__footer-line" />
        <span>ORIGINAL TEXT · NO BRANCHES</span>
      </footer>
    </div>
  );
};
