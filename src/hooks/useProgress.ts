import { useCallback, useEffect, useRef, useState } from 'react';
import type { StepLocation } from '../utils/reading';
import { nextLocation, prevLocation, blockGlobalInfo } from '../utils/reading';
import { CHAPTER_ORDER, chapterIndex } from '../data/loader';

export interface ProgressState {
  current: StepLocation;
  readSourceIds: Record<string, true>;
  maxChapterIndex: number; // highest chapter unlocked (1..10)
  fontScale: number;
  autoplay: boolean;
  autoplaySpeed: number; // ms
  reduceMotion: boolean;
  lastReadAt: string;
}

const STORAGE_KEY = 'huancheng-progress-v1';

const DEFAULT_STATE: ProgressState = {
  current: { chapter: CHAPTER_ORDER[0], stepIndex: 0 },
  readSourceIds: {},
  maxChapterIndex: 1,
  fontScale: 1,
  autoplay: false,
  autoplaySpeed: 2200,
  reduceMotion: false,
  lastReadAt: '',
};

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => load());
  const saveTimer = useRef<number | null>(null);

  // Auto-save (debounced) on every change.
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* ignore quota */
      }
    }, 150);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [state]);

  const markRead = useCallback((sourceId: string) => {
    setState((s) => {
      if (s.readSourceIds[sourceId]) return s;
      return { ...s, readSourceIds: { ...s.readSourceIds, [sourceId]: true } };
    });
  }, []);

  const goTo = useCallback((loc: StepLocation) => {
    setState((s) => {
      const maxIdx = Math.max(s.maxChapterIndex, chapterIndex(loc.chapter));
      return {
        ...s,
        current: loc,
        maxChapterIndex: maxIdx,
        lastReadAt: new Date().toISOString(),
      };
    });
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      const n = nextLocation(s.current);
      if (!n) return s;
      return {
        ...s,
        current: n,
        maxChapterIndex: Math.max(s.maxChapterIndex, chapterIndex(n.chapter)),
        lastReadAt: new Date().toISOString(),
      };
    });
  }, []);

  const prev = useCallback(() => {
    setState((s) => {
      const p = prevLocation(s.current);
      if (!p) return s;
      return { ...s, current: p, lastReadAt: new Date().toISOString() };
    });
  }, []);

  const jumpToSource = useCallback((sourceId: string) => {
    const info = blockGlobalInfo(sourceId);
    if (info) goTo(info);
  }, [goTo]);

  // "从头开始": reset position to ch1 start, clear read, keep unlocks + settings.
  const resetPosition = useCallback(() => {
    setState((s) => ({
      ...s,
      current: { chapter: CHAPTER_ORDER[0], stepIndex: 0 },
      readSourceIds: {},
      lastReadAt: new Date().toISOString(),
    }));
  }, []);

  // "重新开始": full reset of progress (keep settings).
  const fullReset = useCallback(() => {
    setState((s) => ({
      ...s,
      current: { chapter: CHAPTER_ORDER[0], stepIndex: 0 },
      readSourceIds: {},
      maxChapterIndex: 1,
      lastReadAt: '',
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<ProgressState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const hasProgress = Object.keys(state.readSourceIds).length > 0;

  return {
    state,
    hasProgress,
    goTo,
    next,
    prev,
    jumpToSource,
    markRead,
    resetPosition,
    fullReset,
    updateSettings,
  };
}
