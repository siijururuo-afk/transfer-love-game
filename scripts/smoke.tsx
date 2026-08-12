import React from 'react';
import { renderToString } from 'react-dom/server';
import { ContentRenderer } from '../src/renderers/index';
import { CHAPTER_ORDER, getChapter, buildSteps } from '../src/data/loader';
import type { ReadStep } from '../src/types/content';

let count = 0;
let errors = 0;
const seenTypes = new Set<string>();

for (const chap of CHAPTER_ORDER) {
  const blocks = getChapter(chap);
  for (const b of blocks) {
    const steps: ReadStep[] = buildSteps(b);
    for (const s of steps) {
      try {
        const html = renderToString(
          React.createElement(ContentRenderer, { step: s, revealed: true })
        );
        if (!html || html.length < 2) throw new Error('empty render');
        seenTypes.add(b.type);
        count++;
      } catch (e) {
        errors++;
        if (errors <= 10) console.log('RENDER ERROR', b.sourceId, b.type, (e as Error).message);
      }
    }
  }
}
console.log('rendered steps:', count, 'errors:', errors);
console.log('types rendered:', [...seenTypes].sort().join(', '));
