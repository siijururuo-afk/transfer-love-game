import fs from 'node:fs';
import path from 'node:path';
import type { ContentBlock } from '../src/types/content';
import { buildPresentationSteps } from '../src/utils/presentation';

const dataDir = path.resolve(process.cwd(), 'src/data');
const files = fs.readdirSync(dataDir).filter((name) => /^chapter-\d+\.json$/.test(name)).sort();
const errors: string[] = [];
const sceneCounts = new Map<string, number>();
let rawTotal = 0;
let logicalTotal = 0;
let normalizedForumComments = 0;
let normalizedInterviewContinuations = 0;
let mergedSourceGroups = 0;
let unresolvedDialogueSpeakers = 0;

function canonicalSpeaker(name: string): string {
  return name.trim().replace(/^曹承衍$/, '承衍').replace(/^金宇硕$/, '宇硕').replace(/^金曜汉$/, '曜汉');
}

for (const file of files) {
  const blocks = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8')) as ContentBlock[];
  const steps = buildPresentationSteps(blocks);
  const seen = new Map<string, number>();
  rawTotal += blocks.length;
  logicalTotal += steps.length;

  for (const step of steps) {
    sceneCounts.set(step.sceneKind || 'single', (sceneCounts.get(step.sceneKind || 'single') || 0) + 1);
    if (step.sourceIds.length > 1) mergedSourceGroups += 1;
    for (const sourceId of step.sourceIds) seen.set(sourceId, (seen.get(sourceId) || 0) + 1);
    if (step.block.type === 'forum' && /^\s*ㄴ/.test(step.text)) normalizedForumComments += 1;
    if (step.items.some((item) => item.subtype === 'answer_continuation')) normalizedInterviewContinuations += 1;
    if (/^\s*\d+\.\s*匿名网友/.test(step.text) && step.sourceIds.length === 1) {
      errors.push(`${file}: standalone forum username ${step.sourceId}`);
    }
    if (step.block.type === 'date_task' && /^\s*[“\"]/.test(step.text)) {
      errors.push(`${file}: quoted dialogue remains date_task ${step.sourceId}`);
    }
    if (step.sceneKind === 'dialogue') {
      if (!step.speaker || step.speaker === '出演者') {
        unresolvedDialogueSpeakers += 1;
      }
      const leading = step.text.match(/^\s*(曹承衍|金宇硕|金曜汉|承衍|宇硕|曜汉X|曜汉|男[一二三四五六七八九])\s*[：:]/);
      const trailing = step.text.match(/——\s*(曹承衍|金宇硕|金曜汉|承衍|宇硕|曜汉X|曜汉|男[一二三四五六七八九])\s*$/);
      const explicit = leading?.[1] || trailing?.[1];
      if (explicit && canonicalSpeaker(explicit) !== canonicalSpeaker(step.speaker || '')) {
        errors.push(`${file}: explicit speaker mismatch ${step.sourceId}: ${explicit} != ${step.speaker}`);
      }
    }
  }

  for (const block of blocks) {
    const count = seen.get(block.sourceId) || 0;
    if (count !== 1) errors.push(`${file}: ${block.sourceId} covered ${count} times`);
  }
}

console.log(`raw blocks: ${rawTotal}`);
console.log(`logical taps: ${logicalTotal}`);
console.log(`merged source groups: ${mergedSourceGroups}`);
console.log(`contextual forum comments: ${normalizedForumComments}`);
console.log(`interview continuations: ${normalizedInterviewContinuations}`);
console.log(`unresolved dialogue speakers: ${unresolvedDialogueSpeakers}`);
console.log(`scene steps: ${Array.from(sceneCounts).map(([key, value]) => `${key}=${value}`).join(', ')}`);
console.log(`presentation errors: ${errors.length}`);
for (const error of errors.slice(0, 50)) console.log(`- ${error}`);
if (errors.length) process.exitCode = 1;
