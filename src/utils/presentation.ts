import type { ContentBlock, ContentType, PresentationItem, ReadStep, SceneKind } from '../types/content';

const QUOTED = /^\s*[“\"‘']/;
const COMMENTER = /^\s*\d+\.\s*匿名网友(?:（[^）]+）)?\s*$/;
const BRACKETED = /^\s*\[[\s\S]+\]\s*$/;
const PERSON = /(曹承衍|金宇硕|金曜汉|承衍|宇硕|曜汉X|曜汉|男[一二三四五六七八九])/g;

const SPEAKER_OVERRIDES: Record<string, string> = {
  P01_0039: '宇硕', P01_0073: '承衍',
  P01_0090: '承衍', P01_0091: '宇硕', P01_0092: '承衍', P01_0101: '宇硕',
  P02_0005: '承衍', P02_0006: '宇硕', P02_0008: '宇硕', P02_0011: '承衍',
  P02_0146: '承衍', P02_0147: '宇硕',
  P03_0075: '宇硕', P03_0076: '承衍', P03_0077: '宇硕',
  P03_0109: '承衍', P05_0019: '承衍',
  P08_0086: '曜汉', P09_0029: '宇硕', P09_0030: '曜汉', P09_0031: '宇硕',
  P09_0032: '曜汉', P09_0033: '宇硕', P09_0034: '男一',
  P10_0090: '男一', P10_0091: '宇硕', P10_0092: '男一', P10_0093: '宇硕',
  P10_0094: '男一', P10_0095: '宇硕', P10_0096: '男一', P10_0097: '宇硕', P10_0098: '男一',

  // Context-verified dialogue runs. These are presentation labels only; the
  // original source text remains untouched.
  P02_0149: '承衍', P02_0150: '宇硕', P02_0151: '承衍', P02_0152: '宇硕', P02_0153: '承衍',
  P03_0102: '宇硕', P03_0103: '承衍', P03_0104: '宇硕', P03_0105: '承衍',
  P03_0158: '男一',
  P03_0161: '承衍', P03_0162: '宇硕', P03_0163: '承衍', P03_0164: '宇硕', P03_0165: '承衍',
  P05_0007: '宇硕',
  P05_0134: '承衍', P05_0135: '宇硕',
  P05_0150: '宇硕', P05_0151: '承衍', P05_0152: '宇硕', P05_0153: '承衍', P05_0154: '宇硕',
  P05_0231: '曜汉',
  P06_0024: '曜汉', P06_0025: '宇硕', P06_0026: '曜汉', P06_0027: '宇硕', P06_0028: '曜汉',
  P06_0032: '曜汉', P06_0033: '宇硕', P06_0034: '曜汉', P06_0035: '宇硕', P06_0036: '曜汉',
  P06_0040: '曜汉', P06_0055: '宇硕', P06_0157: '宇硕',
  P06_0180: '承衍', P06_0181: '宇硕', P06_0182: '承衍', P06_0183: '宇硕', P06_0184: '承衍', P06_0185: '宇硕',
  P07_0032: '承衍', P07_0033: '宇硕', P07_0034: '承衍', P07_0035: '宇硕',
  P07_0037: '承衍', P07_0038: '宇硕', P07_0039: '承衍', P07_0040: '宇硕',
  P07_0041: '承衍', P07_0042: '宇硕', P07_0043: '承衍', P07_0044: '宇硕',
  P07_0045: '承衍', P07_0046: '宇硕', P07_0047: '承衍', P07_0048: '宇硕',
  P07_0049: '承衍', P07_0050: '宇硕', P07_0057: '曜汉', P07_0061: '承衍', P07_0063: '宇硕',
  P07_0094: '曜汉', P07_0095: '宇硕', P07_0096: '曜汉', P07_0097: '宇硕',
  P07_0098: '曜汉', P07_0099: '宇硕', P07_0100: '曜汉', P07_0101: '宇硕', P07_0102: '曜汉',
  P07_0189: '承衍', P07_0190: '宇硕', P07_0192: '承衍', P07_0193: '宇硕',
  P07_0194: '承衍', P07_0195: '宇硕', P07_0197: '宇硕', P07_0198: '承衍',
  P07_0199: '宇硕', P07_0200: '承衍', P07_0201: '宇硕', P07_0203: '宇硕',
  P07_0204: '承衍', P07_0205: '宇硕', P07_0206: '承衍', P07_0207: '宇硕',
  P07_0208: '承衍', P07_0209: '宇硕', P07_0210: '承衍',
  P08_0041: '男三', P08_0043: '男三', P08_0044: '承衍', P08_0045: '男三', P08_0046: '承衍',
  P08_0008: '宇硕',
  P08_0063: '男三', P08_0065: '承衍', P08_0088: '宇硕',
  P08_0089: '曜汉', P08_0090: '宇硕', P08_0091: '曜汉', P08_0092: '宇硕',
  P08_0093: '曜汉', P08_0094: '宇硕', P08_0095: '曜汉', P08_0096: '宇硕', P08_0097: '曜汉',
  P08_0118: '宇硕', P08_0120: '宇硕', P08_0121: '承衍', P08_0122: '宇硕',
  P09_0024: '男一', P09_0025: '宇硕', P09_0026: '男一', P09_0027: '曜汉',
  P09_0036: '承衍', P09_0037: '宇硕', P09_0038: '承衍', P09_0039: '宇硕', P09_0040: '承衍',
  P09_0053: '承衍', P09_0054: '宇硕', P09_0055: '承衍', P09_0076: '宇硕',
  P09_0119: '宇硕', P09_0120: '承衍', P09_0121: '宇硕', P09_0122: '承衍',
  P09_0123: '宇硕', P09_0124: '承衍', P09_0125: '宇硕', P09_0126: '承衍', P09_0127: '宇硕',
  P09_0164: '宇硕', P09_0165: '承衍', P09_0166: '宇硕', P09_0167: '承衍',
  P09_0189: '宇硕', P09_0190: '曜汉', P09_0191: '宇硕', P09_0192: '曜汉', P09_0193: '宇硕', P09_0194: '曜汉',
  P09_0196: '承衍', P09_0197: '宇硕', P09_0198: '承衍', P09_0199: '宇硕',
  P09_0200: '承衍', P09_0201: '宇硕', P09_0202: '承衍', P09_0203: '宇硕',
  P09_0204: '承衍', P09_0205: '宇硕', P09_0206: '承衍', P09_0207: '宇硕',
  P10_0027: '宇硕', P10_0028: '承衍', P10_0030: '承衍', P10_0031: '宇硕',
  P10_0032: '承衍', P10_0033: '宇硕', P10_0034: '承衍',
};

function canonicalName(name?: string): string | undefined {
  const value = name?.trim().replace(/^曹承衍$/, '承衍').replace(/^金宇硕$/, '宇硕').replace(/^金曜汉$/, '曜汉');
  return value || undefined;
}

function namesIn(text: string): string[] {
  const found: string[] = [];
  for (const match of text.matchAll(PERSON)) {
    const name = canonicalName(match[0]);
    if (name && !found.includes(name)) found.push(name);
  }
  return found;
}

function explicitSpeaker(block: ContentBlock): string | undefined {
  if (SPEAKER_OVERRIDES[block.sourceId]) return SPEAKER_OVERRIDES[block.sourceId];
  if (block.speaker) return canonicalName(block.speaker);
  const leading = block.text.match(/^\s*(曹承衍|金宇硕|金曜汉|承衍|宇硕|曜汉X|曜汉|男[一二三四五六七八九])\s*[：:]/);
  if (leading) return canonicalName(leading[1]);
  const trailing = block.text.match(/——\s*(曹承衍|金宇硕|金曜汉|承衍|宇硕|曜汉X|曜汉|男[一二三四五六七八九])\s*$/);
  if (trailing) return canonicalName(trailing[1]);
  const embedded = block.text.match(/[”\"]\s*(曹承衍|金宇硕|金曜汉|承衍|宇硕|曜汉X|曜汉|男[一二三四五六七八九])(?:嗤笑|笑|说|问|答|喊|低声|轻声|开口)/);
  return embedded ? canonicalName(embedded[1]) : undefined;
}

function speakerCue(text: string): string | undefined {
  const tail = text.slice(-240);
  const patterns = [
    /(曹承衍|金宇硕|金曜汉|承衍|宇硕|曜汉X|曜汉|男[一二三四五六七八九])[^。！？：]{0,42}(?:说道|说着|说|问道|发问|开口|喊道|喊|回答|答道|轻声|低声|笑道|腹诽|嘀咕|调侃|提醒|叫住|呼唤|脱口而出)[^。！？]{0,14}[：:]?\s*$/,
    /(?:响起|传来)(曹承衍|金宇硕|金曜汉|承衍|宇硕|曜汉X|曜汉|男[一二三四五六七八九])的声音[：:]?\s*$/,
    /(曹承衍|金宇硕|金曜汉|承衍|宇硕|曜汉X|曜汉|男[一二三四五六七八九])[^。！？]{0,35}[：:]\s*$/,
  ];
  for (const pattern of patterns) {
    const match = tail.match(pattern);
    if (match) return canonicalName(match[1]);
  }
  return undefined;
}

function item(block: ContentBlock): PresentationItem {
  return {
    sourceId: block.sourceId,
    type: block.type,
    subtype: block.subtype,
    speaker: canonicalName(block.speaker),
    text: block.text,
  };
}

function makeStep(
  base: ContentBlock,
  items: PresentationItem[],
  options: {
    text?: string;
    speaker?: string;
    sceneKey?: string;
    sceneKind?: SceneKind;
    sceneParticipants?: string[];
    type?: ContentType;
    subtype?: string;
  } = {},
): ReadStep {
  const block = {
    ...base,
    type: options.type ?? base.type,
    subtype: options.subtype ?? base.subtype,
  };
  return {
    sourceId: items[0]?.sourceId ?? base.sourceId,
    sourceIds: items.map((entry) => entry.sourceId),
    block,
    childIndex: null,
    text: options.text ?? items.map((entry) => entry.text).join('\n'),
    speaker: options.speaker ?? base.speaker,
    items,
    sceneKey: options.sceneKey,
    sceneKind: options.sceneKind ?? 'single',
    sceneParticipants: options.sceneParticipants,
  };
}

function normalize(blocks: ContentBlock[]): ContentBlock[] {
  const result = blocks.map((block) => ({ ...block, speaker: canonicalName(block.speaker) }));

  for (let index = 0; index < result.length; index += 1) {
    const block = result[index];
    const prev = result[index - 1];
    const next = result[index + 1];

    if (block.type === 'narrative' && /^\s*[（(]?截图[）)]?\s*$/.test(block.text)) {
      block.type = 'media';
      block.subtype = 'screenshot';
    }

    if (block.type === 'narrative' && /^\s*ㄴ/.test(block.text)) {
      block.type = 'forum';
      block.subtype = 'comment';
    }
    if (block.type === 'program_caption' && BRACKETED.test(block.text)) {
      const nearCount = result.slice(index + 1, index + 45).some((entry) => entry.type === 'forum' && entry.subtype === 'count');
      // Some source posts omit an explicit “评论（n）” line. Their title is
      // still followed by post media/body and then forum replies, so looking
      // only for a count incorrectly split those threads into several pages.
      const nearForum = result.slice(index + 1, index + 12).some((entry) => (
        entry.type === 'forum' || /^\s*ㄴ/.test(entry.text)
      ));
      if (nearCount || nearForum) {
        block.type = 'forum';
        block.subtype = 'title';
      } else if (/\.(?:jpg|jpeg|png|gif|mp4)\s*\]$/i.test(block.text)) {
        block.type = 'media';
        block.subtype = /\.gif/i.test(block.text) ? 'gif' : /\.mp4/i.test(block.text) ? 'video' : 'image';
      }
    }
    if (
      block.type === 'narrative'
      && prev?.type === 'program_notice'
      && /QR\s*码|二维码|关键词|自动生成|选择权|约会对象的X|进行聊天/.test(block.text)
    ) {
      block.type = 'program_notice';
      block.subtype = 'instruction';
    }
    if (block.sourceId === 'P02_0254') {
      block.type = 'narrative';
      block.subtype = undefined;
      block.speaker = undefined;
    }
    // The transcript heading and its two context lines belong to the chat log.
    // Keeping them in the same scene prevents three isolated "正文" pages before
    // the first actual message appears.
    if (block.sourceId === 'P02_0179') {
      block.type = 'text_chat';
      block.subtype = 'transcript_header';
      block.speaker = undefined;
    }
    if (block.sourceId === 'P02_0180' || block.sourceId === 'P02_0181') {
      block.type = 'text_chat';
      block.subtype = 'transcript_context';
      block.speaker = undefined;
    }
    if (block.type === 'dialogue' && prev?.type === 'forum' && next?.type === 'forum') {
      block.type = 'forum';
      block.subtype = 'comment';
      block.speaker = undefined;
    }
    if (
      block.type === 'dialogue'
      && result.slice(Math.max(0, index - 3), index).some((entry) => entry.type === 'forum')
      && result.slice(index + 1, index + 4).some((entry) => entry.type === 'forum')
    ) {
      block.type = 'forum';
      block.subtype = 'comment';
      block.speaker = undefined;
    }
    if (block.sourceId === 'P05_0149') {
      block.type = 'narrative';
      block.subtype = undefined;
      block.speaker = undefined;
    }
    if (['P02_0237', 'P07_0265', 'P07_0266'].includes(block.sourceId)) {
      block.type = 'forum';
      block.subtype = 'comment';
      block.speaker = undefined;
    }
    if (block.type === 'date_task' && QUOTED.test(block.text)) {
      block.type = 'dialogue';
      block.subtype = undefined;
    }
    if (block.type === 'truth_game' && (prev?.type === 'finger_game' || next?.type === 'finger_game')) {
      block.type = 'finger_game';
      block.subtype = undefined;
    }
    if (
      block.type === 'narrative'
      && block.sourceId !== 'P05_0039'
      && prev?.type === 'interview'
      && prev.subtype === 'answer'
      && (
        next?.type === 'interview'
        || /^(?:不过|而且|当然|但|其实|我|（[^）]*采访)/.test(block.text.trim())
      )
    ) {
      block.type = 'interview';
      block.subtype = 'answer_continuation';
      block.speaker = canonicalName(prev.speaker);
    }
  }

  return result;
}

function findForumEnd(blocks: ContentBlock[], start: number): number {
  let seenCount = false;
  let seenComment = false;
  let previous: ContentBlock | undefined;
  let index = start + 1;
  for (; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.type === 'forum' && block.subtype === 'title') break;
    if (block.type === 'forum') {
      if (block.subtype === 'count') seenCount = true;
      if (block.subtype === 'comment') seenComment = true;
      previous = block;
      continue;
    }
    if (block.type === 'media' || (!seenComment && ['letter', 'text_chat', 'lyrics'].includes(block.type))) {
      previous = block;
      continue;
    }
    if (!seenCount && block.type === 'narrative') {
      block.type = 'forum';
      block.subtype = 'body';
      previous = block;
      continue;
    }
    if (seenComment && block.type === 'lyrics') {
      previous = block;
      continue;
    }
    if (seenComment && block.type === 'narrative' && previous?.type === 'lyrics') {
      block.type = 'forum';
      block.subtype = 'comment';
      previous = block;
      continue;
    }
    break;
  }
  return index;
}

function buildForumSteps(blocks: ContentBlock[], start: number, end: number): ReadStep[] {
  const group = blocks.slice(start, end);
  const key = `forum:${group[0].sourceId}`;
  const firstComment = group.findIndex((block) => block.type === 'forum' && block.subtype === 'comment');
  const introEnd = firstComment < 0 ? group.length : firstComment;
  const intro = group.slice(0, introEnd).map(item);
  const steps: ReadStep[] = [];

  if (intro.length) {
    steps.push(makeStep(group[0], intro, { sceneKey: key, sceneKind: 'forum', type: 'forum', subtype: 'thread' }));
  }

  for (let index = introEnd; index < group.length; index += 1) {
    const block = group[index];
    if (COMMENTER.test(block.text) && group[index + 1]) {
      const mergedBlocks = [block];
      let cursor = index + 1;
      while (cursor < group.length && group[cursor].type === 'media') {
        mergedBlocks.push(group[cursor]);
        cursor += 1;
      }
      if (cursor < group.length && !COMMENTER.test(group[cursor].text)) {
        mergedBlocks.push(group[cursor]);
        cursor += 1;
      }
      const body = [...mergedBlocks].reverse().find((entry) => entry.type !== 'media' && !COMMENTER.test(entry.text));
      steps.push(makeStep(block, mergedBlocks.map(item), {
        text: body?.text ?? '',
        speaker: block.text.trim(),
        sceneKey: key,
        sceneKind: 'forum',
        type: 'forum',
        subtype: 'comment',
      }));
      index = cursor - 1;
      continue;
    }
    // A screenshot/photo directly after a comment belongs to that comment.
    // Keeping it in the same step avoids rendering the media as a new
    // anonymous reply with its own avatar.
    if (block.type === 'forum' && block.subtype === 'comment' && group[index + 1]?.type === 'media') {
      const mergedBlocks = [block];
      let cursor = index + 1;
      while (cursor < group.length && group[cursor].type === 'media') {
        mergedBlocks.push(group[cursor]);
        cursor += 1;
      }
      const nested = /^\s*(?:ㄴ|@)/.test(block.text);
      steps.push(makeStep(block, mergedBlocks.map(item), {
        sceneKey: key,
        sceneKind: 'forum',
        type: 'forum',
        subtype: nested ? 'nested_comment' : 'comment',
        speaker: nested ? '楼中楼回复' : (block.speaker || '匿名网友'),
      }));
      index = cursor - 1;
      continue;
    }
    const nested = /^\s*(?:ㄴ|@)/.test(block.text);
    steps.push(makeStep(block, [item(block)], {
      sceneKey: key,
      sceneKind: 'forum',
      type: 'forum',
      subtype: nested ? 'nested_comment' : 'comment',
      speaker: nested ? '楼中楼回复' : (block.speaker || '匿名网友'),
    }));
  }
  return steps;
}

function inferDialogueSpeakers(blocks: ContentBlock[], start: number, end: number): Array<string | undefined> {
  const run = blocks.slice(start, end);
  const before = [blocks[start - 2]?.text, blocks[start - 1]?.text].filter(Boolean).join(' ');
  const after = blocks[end]?.text ?? '';
  const explicit = run.map(explicitSpeaker);
  const participants = Array.from(new Set([
    ...explicit.filter(Boolean),
    ...namesIn(before),
    ...namesIn(after),
  ] as string[]));
  const cue = speakerCue(blocks[start - 1]?.text ?? '') || speakerCue(before);
  const resolved: Array<string | undefined> = [];

  for (let index = 0; index < run.length; index += 1) {
    if (explicit[index]) {
      resolved.push(explicit[index]);
      continue;
    }
    if (index === 0 && cue) {
      resolved.push(cue);
      continue;
    }
    const previous = resolved[index - 1];
    if (participants.length === 2 && previous && previous !== '出演者') {
      resolved.push(participants.find((name) => name !== previous) || previous);
      continue;
    }
    if (participants.length === 1) {
      resolved.push(participants[0]);
      continue;
    }
    const addressed = namesIn(run[index].text);
    if (participants.length === 2 && addressed.length === 1) {
      resolved.push(participants.find((name) => name !== addressed[0]));
      continue;
    }
    resolved.push('出演者');
  }
  return resolved;
}

function buildInterviewSteps(blocks: ContentBlock[], start: number, end: number): ReadStep[] {
  const key = `interview:${blocks[start].sourceId}`;
  const steps: ReadStep[] = [];
  let header: ContentBlock | undefined;
  let index = start;
  while (index < end) {
    if (blocks[index].subtype === 'header') {
      header = blocks[index];
      index += 1;
      continue;
    }
    const unit: ContentBlock[] = [];
    if (header) {
      unit.push(header);
      header = undefined;
    }
    if (blocks[index]?.subtype === 'question') unit.push(blocks[index++]);
    while (index < end && blocks[index].subtype !== 'question' && blocks[index].subtype !== 'header') unit.push(blocks[index++]);
    if (!unit.length && index < end) unit.push(blocks[index++]);
    const answer = unit.find((block) => block.subtype === 'answer');
    steps.push(makeStep(unit[0], unit.map(item), {
      text: answer?.text ?? unit.map((block) => block.text).join('\n'),
      speaker: answer?.speaker,
      sceneKey: key,
      sceneKind: 'interview',
      type: 'interview',
      subtype: 'unit',
    }));
  }
  if (header) {
    steps.push(makeStep(header, [item(header)], {
      sceneKey: key,
      sceneKind: 'interview',
      type: 'interview',
      subtype: 'unit',
    }));
  }
  return steps;
}

function contiguousEnd(blocks: ContentBlock[], start: number, type: ContentType): number {
  let end = start + 1;
  while (end < blocks.length && blocks[end].type === type) end += 1;
  return end;
}

export function buildPresentationSteps(source: ContentBlock[]): ReadStep[] {
  const blocks = normalize(source);
  const steps: ReadStep[] = [];

  for (let index = 0; index < blocks.length;) {
    const block = blocks[index];

    if (block.type === 'forum' && block.subtype === 'title') {
      const end = findForumEnd(blocks, index);
      steps.push(...buildForumSteps(blocks, index, end));
      index = end;
      continue;
    }

    if (block.type === 'forum') {
      const end = contiguousEnd(blocks, index, 'forum');
      steps.push(...buildForumSteps(blocks, index, end));
      index = end;
      continue;
    }

    if (block.type === 'interview') {
      const end = contiguousEnd(blocks, index, 'interview');
      steps.push(...buildInterviewSteps(blocks, index, end));
      index = end;
      continue;
    }

    if (block.type === 'letter') {
      const end = contiguousEnd(blocks, index, 'letter');
      const grouped = blocks.slice(index, end);
      steps.push(makeStep(grouped[0], grouped.map(item), { type: 'letter' }));
      index = end;
      continue;
    }

    if (['program_task', 'program_rule', 'program_notice', 'identity_reveal', 'date_task', 'lyrics'].includes(block.type)) {
      const end = contiguousEnd(blocks, index, block.type);
      const grouped = blocks.slice(index, end);
      steps.push(makeStep(grouped[0], grouped.map(item), { type: block.type }));
      index = end;
      continue;
    }

    if (block.type === 'dialogue') {
      const end = contiguousEnd(blocks, index, 'dialogue');
      const names = inferDialogueSpeakers(blocks, index, end);
      const sceneParticipants = Array.from(new Set(names.filter((name): name is string => Boolean(name && name !== '出演者'))));
      const key = `dialogue:${block.sourceId}`;
      for (let cursor = index; cursor < end; cursor += 1) {
        steps.push(makeStep(blocks[cursor], [item(blocks[cursor])], {
          speaker: names[cursor - index], sceneKey: key, sceneKind: 'dialogue', sceneParticipants, type: 'dialogue',
        }));
      }
      index = end;
      continue;
    }

    if (block.type === 'x_room') {
      const end = contiguousEnd(blocks, index, 'x_room');
      const key = `xroom:${block.sourceId}`;
      for (let cursor = index; cursor < end; cursor += 1) {
        steps.push(makeStep(blocks[cursor], [item(blocks[cursor])], {
          sceneKey: key, sceneKind: 'xroom', type: 'x_room',
        }));
      }
      index = end;
      continue;
    }

    const streamKinds: Partial<Record<ContentType, SceneKind>> = {
      text_chat: 'chat', observation_room: 'observation', finger_game: 'game', truth_game: 'game',
      sms: 'sms', final_choice: 'final', epilogue: 'epilogue', social_media: 'social',
      talking_room: 'voice',
    };
    const sceneKind = streamKinds[block.type];
    if (sceneKind) {
      const end = contiguousEnd(blocks, index, block.type);
      const key = `${sceneKind}:${block.sourceId}`;
      const sceneParticipants = Array.from(new Set(
        blocks.slice(index, end).map((entry) => canonicalName(entry.speaker)).filter((name): name is string => Boolean(name)),
      ));
      if (sceneKind === 'social') {
        const grouped = blocks.slice(index, end);
        steps.push(makeStep(grouped[0], grouped.map(item), { sceneKey: key, sceneKind, sceneParticipants, type: block.type }));
        index = end;
        continue;
      }
      for (let cursor = index; cursor < end; cursor += 1) {
        steps.push(makeStep(blocks[cursor], [item(blocks[cursor])], { sceneKey: key, sceneKind, sceneParticipants, type: block.type }));
      }
      index = end;
      continue;
    }

    if (block.childSegments?.length) {
      for (const segment of block.childSegments) {
        steps.push({
          sourceId: block.sourceId,
          sourceIds: [block.sourceId],
          block,
          childIndex: segment.order - 1,
          text: segment.text,
          speaker: segment.speaker,
          items: [item(block)],
          sceneKind: 'single',
        });
      }
    } else {
      steps.push(makeStep(block, [item(block)]));
    }
    index += 1;
  }

  return steps;
}
