import React from 'react';
import type { PresentationItem, ReadStep } from '../types/content';
import { Icon } from '../components/Doodles';
import { displayBody } from './common';

const Lines: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <div className={className} style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
);

function participants(stream: ReadStep[]): string[] {
  return Array.from(new Set([
    ...stream.flatMap((step) => step.sceneParticipants || []),
    ...stream.map((step) => step.speaker?.trim()).filter(Boolean) as string[],
  ]));
}

function sideFor(speaker: string | undefined, names: string[]): 'left' | 'right' | 'system' {
  if (!speaker) return 'system';
  if (/宇硕/.test(speaker)) return 'right';
  if (/承衍/.test(speaker)) return names.some((name) => /宇硕/.test(name)) ? 'left' : 'right';
  return 'left';
}

function speakerTone(speaker?: string): string {
  if (/宇硕/.test(speaker || '')) return 'speaker--wooseok';
  if (/承衍/.test(speaker || '')) return 'speaker--seungyoun';
  return 'speaker--support';
}

export function forumTitle(text: string): string {
  return text
    .trim()
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .replace(/^匿名网友\s*[|ㅣ]\s*/, '')
    .replace(/\s*\.\s*(?:jpg|jpeg|png|gif|mp4)\s*$/i, '')
    .trim();
}

const RouteMedia: React.FC<{ entry: PresentationItem }> = ({ entry }) => {
  const subtype = entry.subtype || 'image';
  const label = ['video', 'youtube', 'preview', 'early_release', 'sneak_peek'].includes(subtype)
    ? '视频'
    : subtype === 'gif' ? '动图' : subtype === 'screenshot' ? '截图' : '图片';
  return (
    <div className="route-media-inline" aria-label={entry.text}>
      （{label}）
    </div>
  );
};

export const ForumThreadRenderer: React.FC<{ stream: ReadStep[] }> = ({ stream }) => {
  const intro = stream[0];
  const introItems = intro?.items ?? [];
  const title = introItems.find((entry) => entry.type === 'forum' && entry.subtype === 'title');
  const count = introItems.find((entry) => entry.type === 'forum' && entry.subtype === 'count');
  const body = introItems.filter((entry) => entry !== title && entry !== count);
  const comments = stream.slice(1);

  return (
    <article className="forum-thread">
      <header className="forum-thread__nav">
        <span className="forum-thread__back">‹</span>
        <strong>匿名社区</strong>
        <span>•••</span>
      </header>
      <section className="forum-thread__post">
        <div className="forum-thread__author"><i /> 匿名网友</div>
        {title && <Lines text={forumTitle(title.text)} className="forum-thread__title" />}
        <div className="forum-thread__body">
          {body.map((entry) => {
            if (entry.type === 'media') return <RouteMedia key={entry.sourceId} entry={entry} />;
            if (entry.type === 'letter') return <Lines key={entry.sourceId} text={entry.text} className="forum-thread__letter" />;
            if (entry.type === 'lyrics') return <Lines key={entry.sourceId} text={entry.text.replace(/\//g, '\n')} className="forum-thread__quote" />;
            if (entry.type === 'text_chat') {
              const side = /宇硕/.test(entry.speaker || '') ? 'right' : 'left';
              return (
                <div className={`forum-thread__chat forum-thread__chat--${side}`} key={entry.sourceId}>
                  {entry.speaker && <small>{entry.speaker}</small>}
                  <Lines text={displayBody(entry.text, entry.speaker)} />
                </div>
              );
            }
            return <Lines key={entry.sourceId} text={entry.text} className="forum-thread__paragraph" />;
          })}
        </div>
        <footer><span>♡</span><span>↗</span><span>保存</span></footer>
      </section>
      <section className="forum-thread__comments">
        <header><strong>{count?.text || '评论'}</strong><span>按顺序</span></header>
        {comments.map((comment, index) => {
          const contentItems = comment.items.filter((entry) => !/^\s*\d+\.\s*匿名网友/.test(entry.text));
          const nested = comment.block.subtype === 'nested_comment' || /^\s*(?:ㄴ|@)/.test(comment.text);
          return (
            <div className={`forum-comment ${nested ? 'forum-comment--nested' : ''} ${index === comments.length - 1 ? 'is-new' : ''}`} key={`${comment.sourceId}-${index}`}>
              <div className="forum-comment__avatar"><i /></div>
              <div className="forum-comment__main">
                <div className="forum-comment__name">{nested ? '回复' : (comment.speaker || '匿名网友')}</div>
                {contentItems.map((entry) => (
                  entry.type === 'media'
                    ? <RouteMedia key={entry.sourceId} entry={entry} />
                    : <Lines key={entry.sourceId} text={entry.text.replace(/^\s*ㄴ\s*/, '')} className="forum-comment__text" />
                ))}
                {!contentItems.length && <Lines text={comment.text.replace(/^\s*ㄴ\s*/, '')} className="forum-comment__text" />}
                <div className="forum-comment__actions"><span>♡</span><span>回复</span></div>
              </div>
            </div>
          );
        })}
      </section>
    </article>
  );
};

export const ChatStreamRenderer: React.FC<{ stream: ReadStep[]; dialogue?: boolean }> = ({ stream, dialogue = false }) => {
  const names = participants(stream);
  return (
    <article className={dialogue ? 'dialogue-flow' : 'chat-flow'}>
      {!dialogue && (
        <header className="chat-flow__head">
          <span className="chat-flow__status"><i /> LIVE</span>
          <strong>节目聊天室</strong>
          <small>只读记录</small>
        </header>
      )}
      <div className="message-flow">
        {stream.map((step, index) => {
          const side = sideFor(step.speaker, names);
          if (side === 'system') {
            const systemText = step.text.trim().replace(/^\[/, '').replace(/\]$/, '');
            return <Lines key={`${step.sourceId}-${index}`} text={systemText} className="message-flow__system" />;
          }
          return (
            <div className={`message-flow__row message-flow__row--${side} ${speakerTone(step.speaker)} ${index === stream.length - 1 ? 'is-new' : ''}`} key={`${step.sourceId}-${index}`}>
              {step.speaker && <small>{step.speaker}</small>}
              <Lines text={displayBody(step.text, step.speaker)} className="message-flow__bubble" />
            </div>
          );
        })}
      </div>
      {!dialogue && <div className="chat-flow__readonly">MESSAGE HISTORY</div>}
    </article>
  );
};

export const VoiceStreamRenderer: React.FC<{ stream: ReadStep[] }> = ({ stream }) => {
  const names = participants(stream);
  return (
    <article className="voice-flow">
      <header><span><i /> REC</span><strong>Talking Room</strong><small>变声通话记录</small></header>
      <div className="voice-flow__wave" aria-hidden="true">{[10, 21, 14, 28, 18, 24, 12, 30, 16, 22, 11].map((height, index) => <i key={index} style={{ height }} />)}</div>
      <div className="message-flow">
        {stream.map((step, index) => {
          const side = sideFor(step.speaker, names);
          return (
            <div className={`message-flow__row message-flow__row--${side === 'system' ? 'left' : side} ${speakerTone(step.speaker)} ${index === stream.length - 1 ? 'is-new' : ''}`} key={`${step.sourceId}-${index}`}>
              <small>{step.speaker || '通话者'}</small>
              <Lines text={displayBody(step.text, step.speaker)} className="message-flow__bubble" />
            </div>
          );
        })}
      </div>
    </article>
  );
};

function plainLabel(kind: 'xroom' | 'truth' | 'finger' | 'final' | 'epilogue'): string {
  if (kind === 'xroom') return 'X ROOM';
  if (kind === 'truth') return '真心话';
  if (kind === 'finger') return '手指游戏';
  if (kind === 'final') return '最终选择';
  return '以及现在';
}

export const PlainReadingStreamRenderer: React.FC<{
  stream: ReadStep[];
  kind: 'xroom' | 'truth' | 'finger' | 'final' | 'epilogue';
}> = ({ stream, kind }) => {
  const names = participants(stream);
  const entries = stream.flatMap((step) => step.items.length ? step.items : [{
    sourceId: step.sourceId,
    type: step.block.type,
    subtype: step.block.subtype,
    speaker: step.speaker,
    text: step.text,
  }]);
  return (
    <article className="plain-reading-flow">
      <div className="plain-reading-flow__label">{plainLabel(kind)}</div>
      {entries.map((entry, index) => {
        if (entry.type === 'media') return <RouteMedia key={entry.sourceId} entry={entry} />;
        const spoken = entry.type === 'dialogue' || Boolean(entry.speaker);
        if (spoken) {
          const side = sideFor(entry.speaker, names);
          return (
            <div
              className={`message-flow__row message-flow__row--${side === 'system' ? 'left' : side} ${speakerTone(entry.speaker)} ${index === entries.length - 1 ? 'is-new' : ''}`}
              key={entry.sourceId}
            >
              {entry.speaker && <small>{entry.speaker}</small>}
              <Lines text={displayBody(entry.text, entry.speaker)} className="message-flow__bubble" />
            </div>
          );
        }
        return (
          <Lines
            key={entry.sourceId}
            text={entry.text}
            className={`plain-reading-flow__copy ${index === entries.length - 1 ? 'is-new' : ''}`}
          />
        );
      })}
    </article>
  );
};

export const XRoomStreamRenderer: React.FC<{ stream: ReadStep[]; revealed: boolean }> = ({ stream, revealed }) => {
  const entries = stream.flatMap((step) => step.items);
  return (
    <article className="xroom-flow">
      <header>
        <div><span>X ROOM</span><strong>记忆档案</strong></div>
        <small>{String(entries.length).padStart(2, '0')} / ARCHIVE</small>
      </header>
      {!revealed ? (
        <div className="xroom-flow__door">
          <Icon name="door" size={34} />
          <strong>X ROOM</strong>
        </div>
      ) : (
        <div className="xroom-flow__archive">
          {entries.map((entry, index) => {
            const question = /^\s*Q[.．]/.test(entry.text);
            const object = /(?:照片|相片|门票|票根|专辑|DVD|视频|影像|戒指|香水|诗集|信|台本|球衣|物品|截图|图片)/i.test(entry.text)
              && !question && !entry.speaker;
            const tone = /宇硕/.test(entry.speaker || '') ? ' is-wooseok' : /承衍/.test(entry.speaker || '') ? ' is-seungyoun' : '';
            return (
              <section
                className={`xroom-flow__entry${question ? ' is-question' : ''}${object ? ' is-object' : ''}${tone}${index === entries.length - 1 ? ' is-new' : ''}`}
                key={entry.sourceId}
              >
                {object && <div className="xroom-flow__object-mark"><Icon name="image" size={16} /><span>MEMORY OBJECT</span></div>}
                {question && <b>Q.</b>}
                {entry.speaker && <small>{entry.speaker}</small>}
                <Lines text={question ? entry.text.replace(/^\s*Q[.．]\s*/, '') : displayBody(entry.text, entry.speaker)} />
              </section>
            );
          })}
        </div>
      )}
    </article>
  );
};

export const InterviewStreamRenderer: React.FC<{ stream: ReadStep[] }> = ({ stream }) => {
  const allItems = stream.flatMap((step) => step.items);
  const header = allItems.find((entry) => entry.subtype === 'header');
  const name = header?.text.replace(/采访\s*$/, '').trim()
    || allItems.find((entry) => entry.speaker)?.speaker
    || '人物';
  return (
    <article className="interview-flow">
      <header>
        <div className="interview-flow__rec"><i /> REC</div>
        <div><strong>{name}</strong><span>INTERVIEW</span></div>
      </header>
      <div className="interview-flow__questions">
        {stream.map((step, index) => {
          const question = step.items.find((entry) => entry.subtype === 'question');
          const answers = step.items.filter((entry) => entry.subtype === 'answer' || entry.subtype === 'answer_continuation');
          return (
            <section className={index === stream.length - 1 ? 'is-new' : ''} key={`${step.sourceId}-${index}`}>
              {question && <div className="interview-flow__q"><b>Q.</b><Lines text={question.text.replace(/^Q\.\s*/, '')} /></div>}
              {answers.length > 0 && (
                <div className="interview-flow__a">
                  {answers.map((answer) => <Lines key={answer.sourceId} text={displayBody(answer.text, answer.speaker)} />)}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </article>
  );
};

export const ObservationStreamRenderer: React.FC<{ stream: ReadStep[] }> = ({ stream }) => (
  <article className="observation-flow">
    <header><span><i /> LIVE</span><strong>观察室</strong><small>STUDIO COMMENTARY</small></header>
    <div className="observation-flow__screen">
      {stream.map((step, index) => (
        <div className={`observation-flow__line ${index === stream.length - 1 ? 'is-new' : ''}`} key={`${step.sourceId}-${index}`}>
          <b>{step.speaker || '观察员'}</b>
          <Lines text={displayBody(step.text, step.speaker)} />
        </div>
      ))}
    </div>
  </article>
);

export const GameStreamRenderer: React.FC<{ stream: ReadStep[]; truth?: boolean }> = ({ stream, truth = false }) => (
  <article className={`game-flow ${truth ? 'game-flow--truth' : 'game-flow--finger'}`}>
    <header><span>{truth ? 'TRUTH GAME' : 'FINGER GAME'}</span><strong>{truth ? '真心话' : '手指游戏'}</strong><i>{truth ? '?' : '✌'}</i></header>
    <div className="game-flow__table">
      {stream.map((step, index) => {
        const quote = /^\s*[“\"]/.test(step.text) || /提问|问题|回答/.test(step.text);
        return quote ? (
          <div className={`game-flow__card ${index === stream.length - 1 ? 'is-new' : ''}`} key={`${step.sourceId}-${index}`}>
            <span>{String(index + 1).padStart(2, '0')}</span><Lines text={displayBody(step.text, step.speaker)} />
          </div>
        ) : (
          <Lines key={`${step.sourceId}-${index}`} text={step.text} className={`game-flow__narration ${index === stream.length - 1 ? 'is-new' : ''}`} />
        );
      })}
    </div>
    <footer><span>SKIP × 1</span><span className="game-flow__tokens"><i /><i /><i /></span></footer>
  </article>
);

export const SmsStreamRenderer: React.FC<{ stream: ReadStep[]; revealed: boolean }> = ({ stream, revealed }) => (
  <article className="sms-flow">
    <header><span>短信</span><strong>节目通知</strong><i>•••</i></header>
    <div className="sms-flow__thread" aria-live="polite">
      {stream.map((step, index) => {
        const current = index === stream.length - 1;
        if (current && !revealed) return <div className="sms-flow__notice is-new" key={step.sourceId}><span>节目组</span><strong>收到一条新消息</strong></div>;
        return <Lines key={`${step.sourceId}-${index}`} text={step.text} className={`sms-flow__bubble ${current ? 'is-new' : ''}`} />;
      })}
    </div>
    <div className="sms-flow__home" />
  </article>
);

export const FinalStreamRenderer: React.FC<{ stream: ReadStep[] }> = ({ stream }) => (
  <article className="final-flow">
    <header><div><span>FINAL CHOICE</span><strong>最终选择</strong></div></header>
    <div className="final-flow__route">
      {stream.map((step, index) => (
        <div className={`final-flow__event final-flow__event--${step.block.subtype || 'step'} ${index === stream.length - 1 ? 'is-new' : ''}`} key={`${step.sourceId}-${index}`}>
          <i />
          <div><small>{(step.block.subtype || 'step').toUpperCase()}</small><Lines text={displayBody(step.text, step.speaker)} /></div>
        </div>
      ))}
    </div>
  </article>
);

export const EpilogueStreamRenderer: React.FC<{ stream: ReadStep[] }> = ({ stream }) => (
  <article className="epilogue-flow">
    <header><span>AND NOW</span><strong>以及现在</strong></header>
    <div className="epilogue-flow__film">
      {stream.map((step, index) => {
        const spoken = /^\s*[“‘"']/.test(step.text);
        return (
        <div className={`${spoken ? 'is-dialogue ' : ''}${index === stream.length - 1 ? 'is-new' : ''}`} key={`${step.sourceId}-${index}`}>
          <Lines text={spoken ? displayBody(step.text, step.speaker) : step.text} />
        </div>
        );
      })}
    </div>
  </article>
);

function socialPosts(items: PresentationItem[]): PresentationItem[][] {
  const groups: PresentationItem[][] = [];
  for (const entry of items) {
    if (/@\S+.*(?:分钟前|小时前|天前)/.test(entry.text) || !groups.length) groups.push([entry]);
    else groups[groups.length - 1].push(entry);
  }
  return groups;
}

export const SocialStreamRenderer: React.FC<{ stream: ReadStep[] }> = ({ stream }) => {
  const groups = socialPosts(stream.flatMap((step) => step.items));
  return (
    <article className="social-flow">
      <header><strong>实时动态</strong><span>•••</span></header>
      {groups.map((group, index) => {
        const account = group[0];
        const stats = group.find((entry) => /评论\d+.*转发\d+.*点赞\d+/.test(entry.text));
        const body = group.filter((entry) => entry !== account && entry !== stats);
        return (
          <section key={account.sourceId} className={index === groups.length - 1 ? 'is-new' : ''}>
            <div className="social-flow__account"><i>{account.text.trim().slice(0, 1)}</i><Lines text={account.text} /></div>
            <div className="social-flow__body">{body.map((entry) => <Lines key={entry.sourceId} text={entry.text.replace(/^评分：/, '')} />)}</div>
            {stats && <Lines text={stats.text.replace(/(评论\d+)\s*(转发\d+)\s*(点赞\d+)/, '$1   $2   $3')} className="social-flow__stats" />}
          </section>
        );
      })}
    </article>
  );
};
