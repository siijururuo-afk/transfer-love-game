import type { ContentBlock, ContentType, PresentationItem, ReadStep, SceneKind } from '../types/content';

const QUOTED = /^\s*[“\"]/;
const COMMENTER = /^\s*\d+\.\s*匿名网友(?:（[^）]+）)?\s*$/;
const BRACKETED = /^\s*\[[\s\S]+\]\s*$/;
const KNOWN_NAMES = ['承衍', '宇硕', '曜汉', '男一', '男二', '男三', '男四', '男五'];

function item(block: ContentBlock): PresentationItem {
  return {
    sourceId: block.sourceId,
    type: block.type,
    subtype: block.subtype,
    speaker: block.speaker,
    text: block.text,
  };
}

function makeStep(
  base: ContentBlock,
  items: PresentationItem[],
  options: { text?: string; speaker?: string; sceneKey?: string; sceneKind?: SceneKind; type?: ContentType; subtype?: string } = {},
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
  };
}

function normalize(blocks: ContentBlock[]): ContentBlock[] {
  const result = blocks.map((block) => ({ ...block }));

  for (let index = 0; index < result.length; index += 1) {
    const block = result[index];
    const prev = result[index - 1];
    const next = result[index + 1];

    if (block.type === 'narrative' && /^\s*ㄴ/.test(block.text)) {
      block.type = 'forum';
      block.subtype = 'comment';
    }
    if (block.type === 'program_caption' && BRACKETED.test(block.text)) {
      const nearCount = result.slice(index + 1, index + 45).some((entry) => entry.type === 'forum' && entry.subtype === 'count');
      if (nearCount) {
        block.type = 'forum';
        block.subtype = 'title';
      } else if (/\.(?:jpg|jpeg|png|gif|mp4)\s*\]$/i.test(block.text)) {
        block.type = 'media';
        block.subtype = /\.gif/i.test(block.text) ? 'gif' : /\.mp4/i.test(block.text) ? 'video' : 'image';
      }
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
      && prev?.type === 'interview'
      && prev.subtype === 'answer'
      && (
        next?.type === 'interview'
        || /^(?:不过|而且|当然|但|其实|我|（[^）]*采访)/.test(block.text.trim())
      )
    ) {
      block.type = 'interview';
      block.subtype = 'answer_continuation';
      block.speaker = prev.speaker;
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
    steps.push(makeStep(block, [item(block)], {
      sceneKey: key,
      sceneKind: 'forum',
      type: 'forum',
      subtype: 'comment',
      speaker: block.speaker || '匿名网友',
    }));
  }
  return steps;
}

function inferDialogueSpeakers(blocks: ContentBlock[], start: number, end: number): Array<string | undefined> {
  const context = [blocks[start - 2]?.text, blocks[start - 1]?.text, blocks[end]?.text].filter(Boolean).join(' ');
  const participants = KNOWN_NAMES.filter((name) => context.includes(name));
  if (participants.length !== 2) return blocks.slice(start, end).map((block) => block.speaker);
  const before = `${blocks[start - 1]?.text ?? ''}`;
  const first = participants
    .map((name) => ({ name, at: before.lastIndexOf(name) }))
    .sort((a, b) => b.at - a.at)[0]?.name ?? participants[0];
  const second = participants.find((name) => name !== first) ?? participants[1];
  return blocks.slice(start, end).map((block, index) => block.speaker || (index % 2 === 0 ? first : second));
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

    if (['program_task', 'program_rule', 'identity_reveal', 'date_task'].includes(block.type)) {
      const end = contiguousEnd(blocks, index, block.type);
      const grouped = blocks.slice(index, end);
      steps.push(makeStep(grouped[0], grouped.map(item), { type: block.type }));
      index = end;
      continue;
    }

    if (block.type === 'dialogue') {
      const end = contiguousEnd(blocks, index, 'dialogue');
      const names = inferDialogueSpeakers(blocks, index, end);
      const key = `dialogue:${block.sourceId}`;
      for (let cursor = index; cursor < end; cursor += 1) {
        steps.push(makeStep(blocks[cursor], [item(blocks[cursor])], {
          speaker: names[cursor - index], sceneKey: key, sceneKind: 'dialogue', type: 'dialogue',
        }));
      }
      index = end;
      continue;
    }

    const streamKinds: Partial<Record<ContentType, SceneKind>> = {
      text_chat: 'chat', observation_room: 'observation', finger_game: 'game', truth_game: 'game',
      sms: 'sms', final_choice: 'final', epilogue: 'epilogue', social_media: 'social',
    };
    const sceneKind = streamKinds[block.type];
    if (sceneKind) {
      const end = contiguousEnd(blocks, index, block.type);
      const key = `${sceneKind}:${block.sourceId}`;
      for (let cursor = index; cursor < end; cursor += 1) {
        steps.push(makeStep(blocks[cursor], [item(blocks[cursor])], { sceneKey: key, sceneKind, type: block.type }));
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
