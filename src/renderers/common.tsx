import React from 'react';
import type { ContentType } from '../types/content';
import { Icon } from '../components/Doodles';

export interface ModuleMeta {
  label: string;
  icon: string;
  blocking: boolean; // requires an explicit reveal tap before advancing
}

export const MODULE_META: Record<ContentType, ModuleMeta> = {
  narrative: { label: '正文', icon: 'note', blocking: false },
  dialogue: { label: '对白', icon: 'chat', blocking: false },
  scene_card: { label: '场景', icon: 'sun', blocking: false },
  program_task: { label: '任务卡', icon: 'stamp', blocking: true },
  program_rule: { label: '入住指南', icon: 'note', blocking: true },
  program_notice: { label: '节目通知', icon: 'bell', blocking: false },
  letter: { label: '信件', icon: 'mail', blocking: true },
  sms: { label: '短信', icon: 'phone', blocking: true },
  interview: { label: '采访', icon: 'mic', blocking: false },
  observation_room: { label: '观察室', icon: 'observer', blocking: false },
  text_chat: { label: '聊天室', icon: 'chat', blocking: false },
  talking_room: { label: 'Talking Room', icon: 'mic', blocking: false },
  x_room: { label: 'X ROOM', icon: 'door', blocking: true },
  identity_reveal: { label: '节目公开', icon: 'route', blocking: true },
  date_task: { label: '约会', icon: 'heart', blocking: true },
  finger_game: { label: '手指游戏', icon: 'card', blocking: false },
  truth_game: { label: '真心话', icon: 'card', blocking: false },
  interlude: { label: '幕间', icon: 'star', blocking: false },
  forum: { label: '论坛', icon: 'forum', blocking: false },
  social_media: { label: '动态', icon: 'phone', blocking: false },
  media: { label: '媒体', icon: 'video', blocking: false },
  program_caption: { label: '字幕', icon: 'video', blocking: false },
  final_choice: { label: '最终选择', icon: 'route', blocking: false },
  epilogue: { label: '后日谈', icon: 'image', blocking: false },
  lyrics: { label: '片尾曲', icon: 'star', blocking: false },
  fallback: { label: '原文', icon: 'note', blocking: false },
};

// Presentation-only cleanup. The source data remains byte-for-byte intact.
export function displayBody(text: string, speaker?: string): string {
  let body = text.trim();
  const m = body.match(/^([^：:]{1,16})[：:]\s*([\s\S]*)$/);
  if (m && (!speaker || m[1] === speaker || m[1].endsWith(speaker))) body = m[2].trim();
  body = body.replace(/\s*——\s*(?:曹承衍|金宇硕|金曜汉|承衍|宇硕|曜汉X|曜汉|男[一二三四五六七八九])\s*$/, '').trim();
  // A speech bubble already communicates direct speech. Remove Chinese outer
  // quotation marks even when a short action beat follows the first sentence.
  if (body.startsWith('“') || body.startsWith('‘')) {
    body = body.replace(/[“”‘’]/g, '').trim();
  }
  const quotePairs: Array<[string, string]> = [['“', '”'], ['‘', '’'], ['"', '"'], ["'", "'"]];
  for (const [open, close] of quotePairs) {
    if (body.startsWith(open) && body.endsWith(close) && body.length > 1) {
      body = body.slice(open.length, -close.length).trim();
      break;
    }
  }
  return body;
}

export function ModuleFrame({
  type,
  children,
  bare = false,
}: {
  type: ContentType;
  children: React.ReactNode;
  bare?: boolean;
}) {
  const meta = MODULE_META[type];
  if (bare) return <>{children}</>;
  return (
    <div className="modframe" data-module={type}>
      <span className="modframe__chip">
        <Icon name={meta.icon} size={16} />
        {meta.label}
      </span>
      <div className="modframe__body">{children}</div>
    </div>
  );
}
