import React from 'react';
import { Icon } from '../components/Doodles';
import type { ProgressState } from '../hooks/useProgress';
import { CHAPTER_ORDER, manifestData } from '../data/loader';
import { globalBlocks } from '../utils/reading';

/* ---------------- Settings ---------------- */
export const SettingsSheet: React.FC<{
  state: ProgressState;
  update: (p: Partial<ProgressState>) => void;
  onClose: () => void;
}> = ({ state, update, onClose }) => {
  const fs = state.fontScale;
  const speed = state.autoplaySpeed;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__title">
          <Icon name="settings" size={20} /> 阅读设置
          <button className="iconbtn sheet__close" onClick={onClose} aria-label="关闭"><Icon name="close" /></button>
        </div>

        <div className="setrow">
          <div>
            <div className="setrow__label">字号</div>
            <div className="setrow__desc">正文字号大小</div>
          </div>
          <div className="spacer" />
          <div className="seg" role="group" aria-label="字号">
            {([0.9, 1, 1.15] as const).map((v) => (
              <button key={v} aria-pressed={fs === v} onClick={() => update({ fontScale: v })}>
                {v === 0.9 ? '小' : v === 1 ? '标准' : '大'}
              </button>
            ))}
          </div>
        </div>

        <div className="setrow">
          <div>
            <div className="setrow__label">自动播放</div>
            <div className="setrow__desc">定时自动推进文字，遇到信封、物件或选择时暂停</div>
          </div>
          <div className="spacer" />
          <button
            className="switch"
            role="switch"
            aria-checked={state.autoplay}
            aria-label="自动播放"
            onClick={() => update({ autoplay: !state.autoplay })}
          />
        </div>

        <div className="setrow">
          <div>
            <div className="setrow__label">播放速度</div>
            <div className="setrow__desc">仅在自动播放开启时生效</div>
          </div>
          <div className="spacer" />
          <div className="seg" role="group" aria-label="速度">
            {([3200, 2200, 1400] as const).map((v) => (
              <button key={v} aria-pressed={speed === v} onClick={() => update({ autoplaySpeed: v })}>
                {v === 3200 ? '慢' : v === 2200 ? '中' : '快'}
              </button>
            ))}
          </div>
        </div>

        <div className="setrow">
          <div>
            <div className="setrow__label">减少动态效果</div>
            <div className="setrow__desc">关闭纸张、开门等动效</div>
          </div>
          <div className="spacer" />
          <button
            className="switch"
            role="switch"
            aria-checked={state.reduceMotion}
            aria-label="减少动态效果"
            onClick={() => update({ reduceMotion: !state.reduceMotion })}
          />
        </div>

        <div style={{ height: 14 }} />
        <button className="btn btn--block" onClick={onClose}>完成</button>
      </div>
    </div>
  );
};

/* ---------------- History ---------------- */
export const HistorySheet: React.FC<{
  state: ProgressState;
  onClose: () => void;
  onJump: (sourceId: string) => void;
}> = ({ state, onClose, onJump }) => {
  const read = globalBlocks().filter((b) => state.readSourceIds[b.sourceId]);
  const shown = read.slice(-300);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__title">
          <Icon name="history" size={20} /> 历史记录
          <button className="iconbtn sheet__close" onClick={onClose} aria-label="关闭"><Icon name="close" /></button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 8 }}>
          共 {read.length} 段已读 · 按原文顺序排列（最近 {shown.length} 条）
        </div>
        <div className="hist">
          {shown.map((b) => (
            <div
              key={b.sourceId}
              className="hist__item"
              role="button"
              tabIndex={0}
              onClick={() => { onJump(b.sourceId); onClose(); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { onJump(b.sourceId); onClose(); } }}
            >
              <span className="hist__ch">{b.chapter}</span>
              <span className="hist__id">{b.sourceId}</span>
              <span className="hist__txt">{b.text.slice(0, 22)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Chapter list ---------------- */
export const ChapterSheet: React.FC<{
  state: ProgressState;
  onClose: () => void;
  onSelect: (chapter: string) => void;
}> = ({ state, onClose, onSelect }) => {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__title">
          <Icon name="list" size={20} /> 章节目录
          <button className="iconbtn sheet__close" onClick={onClose} aria-label="关闭"><Icon name="close" /></button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 8 }}>
          仅可进入已读到的章节
        </div>
        <div className="chlist">
          {CHAPTER_ORDER.map((name, i) => {
            const meta = manifestData.chapters[i];
            const unlocked = i + 1 <= state.maxChapterIndex;
            return (
              <button
                key={name}
                className={'chip-row' + (unlocked ? '' : ' chip-row--locked')}
                disabled={!unlocked}
                aria-label={unlocked ? `进入${name}` : `${name} 未解锁`}
                onClick={() => { if (unlocked) { onSelect(name); onClose(); } }}
              >
                <span className="chip-row__no">{i + 1}</span>
                <span className="chip-row__name">{name}</span>
                <span className="chip-row__meta">
                  <span>{meta.blockCount} 段</span>
                  {unlocked ? <Icon name="next" size={16} /> : <Icon name="lock" size={16} className="lock-ico" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
