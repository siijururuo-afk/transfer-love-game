import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../components/Doodles';
import { ContentRenderer, MODULE_META } from '../renderers/index';
import { chapterSteps, globalBlocks, nextLocation } from '../utils/reading';
import { CHAPTER_ORDER } from '../data/loader';
import type { StepLocation } from '../utils/reading';
import type { ProgressState } from '../hooks/useProgress';
import { SettingsSheet, HistorySheet, ChapterSheet } from './Panels';

interface Props {
  state: ProgressState;
  goTo: (loc: StepLocation) => void;
  next: () => void;
  prev: () => void;
  markRead: (sourceId: string) => void;
  jumpToSource: (sourceId: string) => void;
  updateSettings: (p: Partial<ProgressState>) => void;
  onHome: () => void;
}

type Inter = null | { kind: 'chapter'; to: string } | { kind: 'end' };

export const ReaderScreen: React.FC<Props> = ({
  state, goTo, next, prev, markRead, jumpToSource, updateSettings, onHome,
}) => {
  const loc = state.current;
  const steps = useMemo(() => chapterSteps(loc.chapter), [loc.chapter]);
  const step = steps[loc.stepIndex];

  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [inter, setInter] = useState<Inter>(null);
  const [panel, setPanel] = useState<null | 'settings' | 'history' | 'chapters'>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const keyOf = (l: StepLocation, sIdx: number, cIdx: number | null) =>
    `${steps[sIdx]?.sourceId}#${cIdx ?? -1}`;

  const curKey = `${step?.sourceId}#${step?.childIndex ?? -1}`;
  const meta = step ? MODULE_META[step.block.type] : MODULE_META.fallback;
  const isBlocking = meta.blocking;
  const isRevealed = !isBlocking || revealed.has(curKey);

  // total / global progress
  const { totalSteps, globalIndex } = useMemo(() => {
    let total = 0;
    for (const c of CHAPTER_ORDER) total += chapterSteps(c).length;
    let gi = 0;
    const ci = CHAPTER_ORDER.indexOf(loc.chapter);
    for (let i = 0; i < ci; i++) gi += chapterSteps(CHAPTER_ORDER[i]).length;
    gi += loc.stepIndex;
    return { totalSteps: total, globalIndex: gi };
  }, [loc.chapter, loc.stepIndex]);

  // mark read + auto-reveal non-blocking on step change
  useEffect(() => {
    if (!step) return;
    markRead(step.sourceId);
    if (!isBlocking) {
      setRevealed((s) => {
        if (s.has(curKey)) return s;
        const n = new Set(s);
        n.add(curKey);
        return n;
      });
    }
    stageRef.current?.scrollTo({ top: 0 });
  }, [curKey, step, isBlocking, markRead]);

  const advance = useCallback(() => {
    if (!step) return;
    if (isBlocking && !revealed.has(curKey)) {
      setRevealed((s) => new Set(s).add(curKey));
      return;
    }
    const n = nextLocation(loc);
    if (!n) { setInter({ kind: 'end' }); return; }
    if (n.chapter !== loc.chapter) {
      setInter({ kind: 'chapter', to: n.chapter });
      return;
    }
    goTo(n);
  }, [step, isBlocking, revealed, curKey, loc, goTo]);

  const doPrev = useCallback(() => {
    prev();
  }, [prev]);

  // autoplay
  useEffect(() => {
    if (!state.autoplay || inter || !step) return;
    if (isBlocking && !revealed.has(curKey)) return; // pause at blocking
    const t = window.setTimeout(() => advance(), state.autoplaySpeed);
    return () => window.clearTimeout(t);
  }, [state.autoplay, state.autoplaySpeed, inter, step, isBlocking, revealed, curKey, advance]);

  const skipRead = useCallback(() => {
    const all = globalBlocks();
    const startIdx = all.findIndex((b) => b.sourceId === step?.sourceId);
    const from = startIdx < 0 ? 0 : startIdx + 1;
    for (let i = from; i < all.length; i++) {
      if (!state.readSourceIds[all[i].sourceId]) {
        jumpToSource(all[i].sourceId);
        return;
      }
    }
    // all read: go to end
    const last = all[all.length - 1];
    jumpToSource(last.sourceId);
  }, [step, state.readSourceIds, jumpToSource]);

  const chapterPct = Math.round(((loc.stepIndex + 1) / steps.length) * 100);
  const totalPct = Math.round((globalIndex / Math.max(1, totalSteps)) * 100);

  if (inter) {
    return (
      <div className="reader">
        <div className="inter">
          {inter.kind === 'end' ? (
            <>
              <Icon name="star" size={40} />
              <div className="inter__big">全剧终</div>
              <div className="inter__sub">你已观看完《换乘恋爱》的全部既定故事。</div>
              <button className="btn btn--primary" onClick={onHome}>返回首页</button>
              <button className="btn btn--ghost" onClick={() => { setConfirmReset(true); }}>重新开始</button>
            </>
          ) : (
            <>
              <Icon name="flower" size={36} />
              <div className="inter__big">{loc.chapter} · 阅读完毕</div>
              <div className="inter__sub">下一部分：{inter.to}</div>
              <button className="btn btn--primary" onClick={() => {
                const n = nextLocation(loc);
                if (n) goTo(n);
                setInter(null);
              }}>进入下一部分</button>
              <button className="btn btn--ghost" onClick={onHome}>返回首页</button>
            </>
          )}
        </div>
        {confirmReset && (
          <div className="overlay" onClick={() => setConfirmReset(false)}>
            <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 360 }}>
              <div className="sheet__title">确认重新开始？</div>
              <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
                将清除全部阅读进度与已读记录，且无法恢复。
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="btn btn--block" onClick={() => setConfirmReset(false)}>取消</button>
                <button className="btn btn--primary btn--block" onClick={() => {
                  updateSettings({ current: { chapter: CHAPTER_ORDER[0], stepIndex: 0 }, readSourceIds: {}, maxChapterIndex: 1, lastReadAt: '' });
                  setRevealed(new Set());
                  setInter(null);
                  setConfirmReset(false);
                }}>确认清除</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="reader">
      <div className="reader__top">
        <button className="iconbtn" onClick={onHome} aria-label="返回首页"><Icon name="home" /></button>
        <strong style={{ fontSize: 14 }}>{loc.chapter}</strong>
        <span className="spacer" />
        <button className="iconbtn" onClick={() => setPanel('chapters')} aria-label="章节目录"><Icon name="list" /></button>
        <button className="iconbtn" onClick={() => setPanel('history')} aria-label="历史记录"><Icon name="history" /></button>
        <button className="iconbtn" onClick={() => setPanel('settings')} aria-label="设置"><Icon name="settings" /></button>
      </div>

      <div className="reader__bar"><i style={{ width: `${totalPct}%` }} /></div>
      <div className="reader__hint">当前环节：{meta.label} · 总进度 {totalPct}%</div>

      <div
        className="reader__stage"
        ref={stageRef}
        onClick={advance}
        role="button"
        tabIndex={0}
        aria-label="点击继续阅读"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); } }}
      >
        {step && <ContentRenderer step={step} revealed={isRevealed} />}
        {!isRevealed && <div className="stage-hint">点击揭晓</div>}
      </div>

      <div className="reader__foot">
        <button className="iconbtn" onClick={doPrev} disabled={globalIndex === 0} aria-label="上一段"><Icon name="prev" /></button>
        <span className="apdot" style={state.autoplay ? { background: 'var(--ink)' } : undefined} aria-hidden />
        <button className="btn btn--sm" onClick={skipRead} aria-label="跳过已读">跳过已读</button>
        <span className="spacer" />
        <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{loc.stepIndex + 1}/{steps.length}</span>
        <button className="iconbtn" onClick={advance} aria-label="下一段"><Icon name="next" /></button>
      </div>

      {panel === 'settings' && (
        <SettingsSheet state={state} update={updateSettings} onClose={() => setPanel(null)} />
      )}
      {panel === 'history' && (
        <HistorySheet state={state} onClose={() => setPanel(null)} onJump={jumpToSource} />
      )}
      {panel === 'chapters' && (
        <ChapterSheet state={state} onClose={() => setPanel(null)} onSelect={(c) => goTo({ chapter: c, stepIndex: 0 })} />
      )}
    </div>
  );
};
