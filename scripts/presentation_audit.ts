import fs from 'node:fs';
import path from 'node:path';
import type { ContentBlock } from '../src/types/content';
import { buildPresentationSteps } from '../src/utils/presentation';
import { displayBody } from '../src/renderers/common';
import { forumTitle } from '../src/renderers/streams';

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
  const stepBySource = new Map<string, (typeof steps)[number]>();
  rawTotal += blocks.length;
  logicalTotal += steps.length;

  for (const step of steps) {
    sceneCounts.set(step.sceneKind || 'single', (sceneCounts.get(step.sceneKind || 'single') || 0) + 1);
    if (step.sourceIds.length > 1) mergedSourceGroups += 1;
    for (const sourceId of step.sourceIds) {
      seen.set(sourceId, (seen.get(sourceId) || 0) + 1);
      stepBySource.set(sourceId, step);
    }
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
    if (['dialogue', 'chat', 'voice'].includes(step.sceneKind || '')) {
      const visible = displayBody(step.text, step.speaker);
      if (/^[“”‘’"']|[“”‘’"']$/.test(visible)) {
        errors.push(`${file}: outer quote remains in bubble ${step.sourceId}: ${visible}`);
      }
    }
  }

  for (const block of blocks) {
    const count = seen.get(block.sourceId) || 0;
    if (count !== 1) errors.push(`${file}: ${block.sourceId} covered ${count} times`);
    if (/^\s*ㄴ/.test(block.text) && stepBySource.get(block.sourceId)?.sceneKind !== 'forum') {
      errors.push(`${file}: nested forum reply outside forum ${block.sourceId}`);
    }
    if (block.type === 'forum' && block.subtype === 'title') {
      const visible = forumTitle(block.text);
      if (/^\[|\]$|^匿名网友\s*[|ㅣ]/.test(visible)) {
        errors.push(`${file}: forum title decoration remains ${block.sourceId}: ${visible}`);
      }
    }
  }

  for (const sourceId of ['P02_0232', 'P06_0274', 'P08_0132']) {
    const step = stepBySource.get(sourceId);
    if (step && step.sceneKind !== 'forum') {
      errors.push(`${file}: no-count forum thread split at ${sourceId}`);
    }
  }
  const interviewExit = stepBySource.get('P05_0039');
  if (interviewExit && (interviewExit.sceneKind === 'interview' || interviewExit.block.type !== 'narrative')) {
    errors.push(`${file}: interview exit narration misclassified P05_0039`);
  }

  const expectedSpeakers: Record<string, string> = {
    P01_0099: '男三', P01_0100: '男一', P01_0101: '宇硕',
    P04_0052: '宇硕', P04_0053: '承衍', P04_0054: '宇硕', P04_0055: '承衍',
    P08_0041: '男三', P08_0043: '男三', P08_0044: '承衍', P08_0045: '男三', P08_0046: '承衍',
    P09_0024: '男一', P09_0025: '宇硕', P09_0026: '男一', P09_0027: '曜汉',
    P10_0090: '男一', P10_0091: '宇硕', P10_0092: '男一', P10_0093: '宇硕',
  };
  for (const [sourceId, expected] of Object.entries(expectedSpeakers)) {
    const verifiedStep = stepBySource.get(sourceId);
    const actual = verifiedStep?.speaker;
    if (verifiedStep && canonicalSpeaker(actual || '') !== canonicalSpeaker(expected)) {
      errors.push(`${file}: verified speaker mismatch ${sourceId}: ${actual} != ${expected}`);
    }
  }

  const screenshot = stepBySource.get('P02_0111');
  if (screenshot && (
    screenshot.sceneKind !== 'forum'
    || !screenshot.sourceIds.includes('P02_0110')
    || !screenshot.items.some((entry) => entry.sourceId === 'P02_0111' && entry.type === 'media')
  )) errors.push(`${file}: screenshot is not attached to its forum comment P02_0111`);
  const qrInstruction = stepBySource.get('P02_0140');
  if (qrInstruction && (qrInstruction.block.type !== 'program_notice' || !qrInstruction.sourceIds.includes('P02_0139'))) {
    errors.push(`${file}: QR instruction split from program card P02_0140`);
  }
  for (const sourceId of ['P02_0254', 'P05_0149']) {
    const mixedNarration = stepBySource.get(sourceId);
    if (mixedNarration && mixedNarration.block.type !== 'narrative') errors.push(`${file}: mixed narration remains dialogue ${sourceId}`);
  }
  const social = stepBySource.get('P10_0278');
  if (social && !['P10_0278', 'P10_0279', 'P10_0280', 'P10_0281', 'P10_0282', 'P10_0283', 'P10_0284', 'P10_0285', 'P10_0286'].every((id) => social.sourceIds.includes(id))) {
    errors.push(`${file}: social timeline split into separate pages`);
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
