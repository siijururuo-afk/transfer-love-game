import type { ContentBlock, Manifest, ReadStep } from '../types/content';
import manifest from '../data/manifest.json';

import ch01 from '../data/chapter-01.json';
import ch02 from '../data/chapter-02.json';
import ch03 from '../data/chapter-03.json';
import ch04 from '../data/chapter-04.json';
import ch05 from '../data/chapter-05.json';
import ch06 from '../data/chapter-06.json';
import ch07 from '../data/chapter-07.json';
import ch08 from '../data/chapter-08.json';
import ch09 from '../data/chapter-09.json';
import ch10 from '../data/chapter-10.json';

const CHAPTER_FILES: Record<string, ContentBlock[]> = {
  '第1部分': ch01 as ContentBlock[],
  '第2部分': ch02 as ContentBlock[],
  '第3部分': ch03 as ContentBlock[],
  '第4部分': ch04 as ContentBlock[],
  '第5部分': ch05 as ContentBlock[],
  '第6部分': ch06 as ContentBlock[],
  '第7部分': ch07 as ContentBlock[],
  '第8部分': ch08 as ContentBlock[],
  '第9部分': ch09 as ContentBlock[],
  '完结篇': ch10 as ContentBlock[],
};

export const CHAPTER_ORDER = [
  '第1部分',
  '第2部分',
  '第3部分',
  '第4部分',
  '第5部分',
  '第6部分',
  '第7部分',
  '第8部分',
  '第9部分',
  '完结篇',
];

export const manifestData = manifest as Manifest;

export function getChapter(name: string): ContentBlock[] {
  return CHAPTER_FILES[name] ?? [];
}

export function getChapterMeta(name: string) {
  return manifestData.chapters.find((c) => c.name === name);
}

export function chapterIndex(name: string): number {
  return CHAPTER_ORDER.indexOf(name) + 1;
}

// Expand a block into one or more display steps.
export function buildSteps(block: ContentBlock): ReadStep[] {
  if (block.childSegments && block.childSegments.length > 0) {
    return block.childSegments.map((seg) => ({
      sourceId: block.sourceId,
      block,
      childIndex: seg.order - 1,
      text: seg.text,
      speaker: seg.speaker,
    }));
  }
  return [
    {
      sourceId: block.sourceId,
      block,
      childIndex: null,
      text: block.text,
      speaker: block.speaker,
    },
  ];
}

// Build the full ordered step list for a chapter.
export function buildChapterSteps(chapterName: string): ReadStep[] {
  const blocks = getChapter(chapterName);
  const steps: ReadStep[] = [];
  for (const b of blocks) steps.push(...buildSteps(b));
  return steps;
}
