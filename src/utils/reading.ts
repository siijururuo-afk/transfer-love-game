import type { ContentBlock, ReadStep } from '../types/content';
import {
  CHAPTER_ORDER,
  buildSteps,
  getChapter,
} from '../data/loader';

export interface StepLocation {
  chapter: string;
  stepIndex: number;
}

// Cache of per-chapter step lists (rebuilt lazily, stable per session).
const stepCache = new Map<string, ReadStep[]>();
export function chapterSteps(chapter: string): ReadStep[] {
  let s = stepCache.get(chapter);
  if (!s) {
    s = buildChapterStepsSafe(chapter);
    stepCache.set(chapter, s);
  }
  return s;
}

function buildChapterStepsSafe(chapter: string): ReadStep[] {
  const blocks = getChapter(chapter);
  const steps: ReadStep[] = [];
  for (const b of blocks) steps.push(...buildSteps(b));
  return steps;
}

export function firstStepOfBlock(chapter: string, sourceId: string): number {
  const steps = chapterSteps(chapter);
  return steps.findIndex((s) => s.sourceId === sourceId);
}

export function nextLocation(loc: StepLocation): StepLocation | null {
  const steps = chapterSteps(loc.chapter);
  if (loc.stepIndex + 1 < steps.length) {
    return { chapter: loc.chapter, stepIndex: loc.stepIndex + 1 };
  }
  const idx = CHAPTER_ORDER.indexOf(loc.chapter);
  if (idx + 1 < CHAPTER_ORDER.length) {
    const nextChap = CHAPTER_ORDER[idx + 1];
    if (chapterSteps(nextChap).length > 0) {
      return { chapter: nextChap, stepIndex: 0 };
    }
  }
  return null; // end of entire story
}

export function prevLocation(loc: StepLocation): StepLocation | null {
  if (loc.stepIndex - 1 >= 0) {
    return { chapter: loc.chapter, stepIndex: loc.stepIndex - 1 };
  }
  const idx = CHAPTER_ORDER.indexOf(loc.chapter);
  if (idx - 1 >= 0) {
    const prevChap = CHAPTER_ORDER[idx - 1];
    const steps = chapterSteps(prevChap);
    if (steps.length > 0) return { chapter: prevChap, stepIndex: steps.length - 1 };
  }
  return null;
}

// Flatten all blocks in global reading order (for history + progress math).
let _globalBlocks: ContentBlock[] | null = null;
export function globalBlocks(): ContentBlock[] {
  if (_globalBlocks) return _globalBlocks;
  const all: ContentBlock[] = [];
  for (const c of CHAPTER_ORDER) all.push(...getChapter(c));
  _globalBlocks = all;
  return all;
}

export function blockGlobalInfo(sourceId: string): { chapter: string; stepIndex: number } | null {
  for (const c of CHAPTER_ORDER) {
    const i = firstStepOfBlock(c, sourceId);
    if (i >= 0) return { chapter: c, stepIndex: i };
  }
  return null;
}
