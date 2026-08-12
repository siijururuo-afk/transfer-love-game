import React from 'react';
import { Icon } from '../components/Doodles';
import { manifestData } from '../data/loader';
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

  return (
    <div className="home">
      <div className="home__brand">
        <Icon name="heart" size={16} /> 换乘恋爱 · TRANSIT LOVE
      </div>
      <div>
        <h1 className="home__title">换乘恋爱</h1>
        <p className="home__sub">以上帝视角，观看一档恋爱真人秀的既定故事。</p>
      </div>

      <div className="home__notice">{VIEWER_NOTICE}</div>

      <div className="home__actions">
        <button
          className="btn btn--primary btn--block"
          onClick={onContinue}
          disabled={!hasProgress}
          aria-label="继续阅读"
        >
          <Icon name="play" size={18} /> 继续阅读
        </button>
        <button className="btn btn--block" onClick={onRestart} aria-label="从头开始">
          <Icon name="reset" size={18} /> 从头开始
        </button>
        <button className="btn btn--block" onClick={onOpenChapters} aria-label="章节目录">
          <Icon name="list" size={18} /> 章节目录
        </button>
      </div>

      <div>
        <div className="home__section-title">阅读进度</div>
        <div className="home__progress" style={{ marginTop: 8 }}>
          <i style={{ width: `${pct}%` }} />
        </div>
        <div className="home__meta" style={{ marginTop: 10 }}>
          <span className="pill">总进度 <b>{pct}%</b></span>
          <span className="pill">已读 <b>{read}</b> / {total}</span>
          <span className="pill">最近 <b>{recent}</b></span>
        </div>
      </div>

      <div className="home__meta" style={{ marginTop: 'auto' }}>
        <span className="pill">共 {manifestData.totalChapters} 部分</span>
        <span className="pill">{manifestData.totalBlocks} 段原文</span>
      </div>
    </div>
  );
};
