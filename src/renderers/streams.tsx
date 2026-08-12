import React from 'react';
import type { PresentationItem, ReadStep } from '../types/content';
import { Icon } from '../components/Doodles';
import { TransitHeart } from '../components/TransitHeart';
import { displayBody } from './common';

const Lines: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <div className={className} style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
);

function participants(stream: ReadStep[]): string[] {
  return Array.from(new Set(stream.map((step) => step.speaker?.trim()).filter(Boolean) as string[]));
}

function sideFor(speaker: string | undefined, index: number, names: string[]): 'left' | 'right' | 'system' {
  if (!speaker) return 'system';
  if (/宇硕/.test(speaker)) return 'right';
  if (/承衍/.test(speaker) && names.some((name) => /宇硕/.test(name))) return 'left';
  const at = names.indexOf(speaker);
  if (at >= 0) return at % 2 ? 'right' : 'left';
  return index % 2 ? 'right' : 'left';
}

const RouteMedia: React.FC<{ entry: PresentationItem }> = ({ entry }) => {
  const video = ['video', 'youtube', 'preview', 'early_release', 'sneak_peek'].includes(entry.subtype || '');
  return (
    <div className={`route-media ${video ? 'route-media--video' : 'route-media--photo'}`} aria-label={entry.text}>
      <TransitHeart compact />
      {video && <span className="route-media__play"><Icon name="play" size={24} /></span>}
      <span className="sr-only">{entry.text}</span>
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
        <div className="forum-thread__author"><i /> 匿名网友 <span>刚刚</span></div>
        {title && <Lines text={title.text} className="forum-thread__title" />}
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
        <header><strong>{count?.text || `评论（${comments.length}）`}</strong><span>按时间</span></header>
        {comments.map((comment, index) => {
          const contentItems = comment.items.filter((entry) => !/^\s*\d+\.\s*匿名网友/.test(entry.text));
          return (
            <div className={`forum-comment ${index === comments.length - 1 ? 'is-new' : ''}`} key={`${comment.sourceId}-${index}`}>
              <div className="forum-comment__avatar">{String(index + 1).padStart(2, '0')}</div>
              <div className="forum-comment__main">
                <div className="forum-comment__name">{comment.speaker || '匿名网友'} <span>· 刚刚</span></div>
                {contentItems.map((entry) => (
                  entry.type === 'media'
                    ? <RouteMedia key={entry.sourceId} entry={entry} />
                    : <Lines key={entry.sourceId} text={entry.text} className="forum-comment__text" />
                ))}
                {!contentItems.length && <Lines text={comment.text} className="forum-comment__text" />}
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
          <span className="chat-flow__status"><i /> ONLINE</span>
          <strong>匿名聊天室</strong>
          <small>只读</small>
        </header>
      )}
      {dialogue && <div className="dialogue-flow__route"><TransitHeart compact /><span>CONVERSATION</span></div>}
      <div className="message-flow">
        {stream.map((step, index) => {
          const side = sideFor(step.speaker, index, names);
          if (side === 'system') return <Lines key={`${step.sourceId}-${index}`} text={step.text} className="message-flow__system" />;
          return (
            <div className={`message-flow__row message-flow__row--${side} ${index === stream.length - 1 ? 'is-new' : ''}`} key={`${step.sourceId}-${index}`}>
              {step.speaker && <small>{step.speaker}</small>}
              <Lines text={displayBody(step.text, step.speaker)} className="message-flow__bubble" />
            </div>
          );
        })}
      </div>
      {!dialogue && <div className="chat-flow__readonly">MESSAGE HISTORY · INPUT DISABLED</div>}
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
        <TransitHeart compact />
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
            <span>{String(index + 1).padStart(2, '0')}</span><Lines text={step.text} />
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
    <header><span>9:41</span><strong>节目短信</strong><i>•••</i></header>
    <div className="sms-flow__thread">
      {stream.map((step, index) => {
        const current = index === stream.length - 1;
        if (current && !revealed) return <div className="sms-flow__notice is-new" key={step.sourceId}><Icon name="mail" size={20} /><span>收到一条新消息</span></div>;
        return <Lines key={`${step.sourceId}-${index}`} text={step.text} className={`sms-flow__bubble ${current ? 'is-new' : ''}`} />;
      })}
    </div>
    <div className="sms-flow__home" />
  </article>
);

export const FinalStreamRenderer: React.FC<{ stream: ReadStep[] }> = ({ stream }) => (
  <article className="final-flow">
    <header><TransitHeart compact /><div><span>FINAL CHOICE</span><strong>最终选择</strong></div></header>
    <div className="final-flow__route">
      {stream.map((step, index) => (
        <div className={`final-flow__event ${index === stream.length - 1 ? 'is-new' : ''}`} key={`${step.sourceId}-${index}`}>
          <i />
          <div><small>{(step.block.subtype || 'step').toUpperCase()}</small><Lines text={step.text} /></div>
        </div>
      ))}
    </div>
  </article>
);

export const EpilogueStreamRenderer: React.FC<{ stream: ReadStep[] }> = ({ stream }) => (
  <article className="epilogue-flow">
    <header><span>AND NOW</span><strong>以及现在</strong><TransitHeart compact /></header>
    <div className="epilogue-flow__film">
      {stream.map((step, index) => (
        <div className={index === stream.length - 1 ? 'is-new' : ''} key={`${step.sourceId}-${index}`}>
          <span>{String(index + 1).padStart(2, '0')}</span><Lines text={step.text} />
        </div>
      ))}
    </div>
  </article>
);
