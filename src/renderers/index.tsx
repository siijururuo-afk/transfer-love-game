import React from 'react';
import type { ReadStep } from '../types/content';
import { Icon } from '../components/Doodles';
import { MODULE_META, displayBody } from './common';
import {
  ForumThreadRenderer,
  ChatStreamRenderer,
  InterviewStreamRenderer,
  ObservationStreamRenderer,
  GameStreamRenderer,
  SmsStreamRenderer,
  FinalStreamRenderer,
  EpilogueStreamRenderer,
  VoiceStreamRenderer,
  XRoomStreamRenderer,
  SocialStreamRenderer,
} from './streams';

export interface RenderProps {
  step: ReadStep;
  revealed: boolean;
  stream?: ReadStep[];
}

const Lines: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <div className={className} style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
);

const MIXED_NARRATIVE_SPEAKERS: Record<string, Array<{ speaker: string; side: 'left' | 'right' }>> = {
  P01_0107: [{ speaker: '宇硕', side: 'right' }],
  P02_0148: [{ speaker: '承衍', side: 'left' }, { speaker: '宇硕', side: 'right' }],
};

function mixedNarrativeParts(text: string, speakers: Array<{ speaker: string; side: 'left' | 'right' }>) {
  const parts: Array<{ kind: 'narration' | 'dialogue'; text: string; speaker?: string; side?: 'left' | 'right' }> = [];
  const quoted = /“([^”]*)”/g;
  let cursor = 0;
  let quoteIndex = 0;
  for (const match of text.matchAll(quoted)) {
    const start = match.index ?? cursor;
    const narration = text.slice(cursor, start).replace(/[：:]\s*$/, '').trim();
    if (narration) parts.push({ kind: 'narration', text: narration });
    const role = speakers[quoteIndex];
    parts.push({ kind: 'dialogue', text: match[1], speaker: role?.speaker, side: role?.side || 'left' });
    cursor = start + match[0].length;
    quoteIndex += 1;
  }
  const tail = text.slice(cursor).trim();
  if (tail) parts.push({ kind: 'narration', text: tail });
  return parts;
}

/* ---------- 正片：不套卡片，保留阅读呼吸 ---------- */
export const NarrativeRenderer: React.FC<RenderProps> = ({ step }) => {
  const mixedSpeakers = MIXED_NARRATIVE_SPEAKERS[step.sourceId];
  if (mixedSpeakers) {
    const mixed = mixedNarrativeParts(step.text, mixedSpeakers);
    return (
      <article className="mixed-narrative">
        {mixed.map((part, index) => part.kind === 'narration' ? (
          <Lines key={index} text={part.text} className="mixed-narrative__copy" />
        ) : (
          <div className={`mixed-narrative__speech mixed-narrative__speech--${part.side} ${/宇硕/.test(part.speaker || '') ? 'is-wooseok' : 'is-seungyoun'}`} key={index}>
            <small>{part.speaker}</small>
            <Lines text={part.text} />
          </div>
        ))}
      </article>
    );
  }
  return (
    <article className="m-narrative">
      <div className="m-narrative__mark" aria-hidden="true">“</div>
      <Lines text={step.text} className="m-narrative__copy" />
      <div className="m-narrative__rule" aria-hidden="true"><i /><span>STORY</span></div>
    </article>
  );
};

export const DialogueRenderer: React.FC<RenderProps> = ({ step }) => (
  <article className="m-dialogue">
    <div className="m-dialogue__rail" aria-hidden="true"><span /><i /></div>
    {step.speaker && <div className="m-dialogue__name">{step.speaker}</div>}
    <Lines text={displayBody(step.text, step.speaker)} className="m-dialogue__text" />
  </article>
);

export const SceneCardRenderer: React.FC<RenderProps> = ({ step }) => {
  const night = /夜|凌晨|深夜|傍晚|月亮|晚/.test(step.text);
  return (
    <article className={'m-scene' + (night ? ' m-scene--night' : '')}>
      <div className="m-scene__index">SCENE / 场记</div>
      <Icon name={night ? 'moon' : 'sun'} size={42} className="m-scene__doodle" />
      <Lines text={step.text} className="m-scene__big" />
      <div className="m-scene__route" aria-hidden="true"><i /><span /><i /></div>
    </article>
  );
};

export const InterludeRenderer: React.FC<RenderProps> = ({ step }) => (
  <article className="m-interlude"><span>PAUSE</span><Lines text={step.text} /><i /></article>
);

export const ProgramCaptionRenderer: React.FC<RenderProps> = ({ step }) => (
  <article className="m-cap"><span>PROGRAM</span><Lines text={step.text} /></article>
);

export const FallbackRenderer: React.FC<RenderProps> = ({ step }) => (
  <article className="m-fallback"><span>ORIGINAL TEXT</span><Lines text={step.text} /></article>
);

/* ---------- 节目组 ---------- */
export const ProgramTaskRenderer: React.FC<RenderProps> = ({ step, revealed }) => (
  <article className={'m-task' + (revealed ? ' is-open' : '')}>
    <div className="m-task__head">
      <span className="m-task__mission">PROGRAM CARD</span>
      <span className="m-task__serial">NO. {step.sourceId.replace(/\D/g, '').slice(-4)}</span>
    </div>
    <div className="m-task__route" aria-hidden="true"><i /><span /><i /></div>
    {revealed ? (
      <div className="m-task__rules">
        {step.items.map((entry) => <Lines key={entry.sourceId} text={entry.text} className="m-task__rule" />)}
      </div>
    ) : (
      <div className="m-task__closed"><strong>节目卡</strong><small>点按后显示内容</small></div>
    )}
  </article>
);

export const ProgramRuleRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  const rules = step.items.filter((entry) => entry.text.trim() !== '入住指南');
  return (
    <article className={'m-rule' + (revealed ? ' is-open' : '')}>
      <header><span>HOUSE GUIDE</span><strong>入住指南</strong></header>
      {revealed ? (
        <div className="m-rule__pages">
          {rules.map((entry, index) => (
            <div className="m-rule__page" key={entry.sourceId} style={{ animationDelay: `${index * .07}s` }}>
              <span className="m-rule__bullet">{String(index + 1).padStart(2, '0')}</span><Lines text={entry.text.replace(/^\d+[.、]\s*/, '')} />
            </div>
          ))}
        </div>
      ) : <div className="m-rule__locked"><span>点按展开完整指南</span></div>}
    </article>
  );
};

export const ProgramNoticeRenderer: React.FC<RenderProps> = ({ step }) => (
  <article className="m-notice">
    <div className="m-notice__label"><span>PROGRAM</span><b>节目通知</b></div>
    <div className="m-notice__copy">{step.items.map((entry) => <Lines key={entry.sourceId} text={entry.text} className="m-notice__text" />)}</div>
  </article>
);

/* ---------- 信件 ---------- */
export const LetterRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  if (!revealed) {
    return (
      <article className="m-letter-wrap">
        <div className="m-envelope">
          <div className="m-envelope__back" aria-hidden="true" />
          <div className="m-envelope__flap" aria-hidden="true" />
          <div className="m-envelope__seal">X</div>
          <div className="m-envelope__prompt"><span>LETTER</span><strong>一封尚未拆开的信</strong></div>
        </div>
      </article>
    );
  }
  return (
    <article className="m-letter-wrap">
      <div className="m-letter">
        <header><span>LETTER</span><i>POST</i></header>
        <div className="m-letter__crease" aria-hidden="true" />
        <div className="m-letter__copy">
          {step.items.map((entry) => <Lines key={entry.sourceId} text={entry.text} />)}
        </div>
        <div className="m-letter__sign" aria-hidden="true">—</div>
      </div>
    </article>
  );
};

/* ---------- 短信 ---------- */
export const SmsRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  const subtype = step.block.subtype;
  const result = subtype === 'result';
  const anonymous = subtype === 'anonymous';
  return (
    <article className={'m-sms' + (result ? ' m-sms--result' : '')}>
      <div className="m-sms__phone">
        <div className="m-sms__speaker" aria-hidden="true" />
        <header>
          <Icon name="phone" size={16} />
          <span>{result ? '节目结果通知' : anonymous ? '匿名心意' : '节目短信'}</span>
          <i>•••</i>
        </header>
        {!revealed ? (
          <div className="m-sms__locked">
            <div className="m-sms__pulse"><Icon name="mail" size={24} /></div>
            <strong>收到一条新消息</strong>
            <small>内容将在点按后显示</small>
          </div>
        ) : result ? (
          <Lines text={step.text} className="m-sms__result" />
        ) : (
          <div className="m-sms__thread">
            {anonymous && <span className="m-sms__anon">ANONYMOUS</span>}
            <Lines text={step.text} className="m-sms__bubble" />
          </div>
        )}
        <div className="m-sms__homebar" aria-hidden="true" />
      </div>
    </article>
  );
};

/* ---------- 采访与观察室 ---------- */
export const InterviewRenderer: React.FC<RenderProps> = ({ step }) => {
  const subtype = step.block.subtype;
  const question = step.text.replace(/^Q\.\s*/, '');
  return (
    <article className="m-interview">
      <div className="m-interview__viewport" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="m-interview__rec"><b /> REC</div>
      <div className="m-interview__track">DOCUMENTARY INTERVIEW</div>
      {subtype === 'header' ? (
        <Lines text={step.text} className="m-interview__name" />
      ) : subtype === 'question' ? (
        <div className="m-interview__question"><b>Q.</b><Lines text={question} /></div>
      ) : (
        <div className="m-interview__answer">{step.speaker && <span>{step.speaker}</span>}<Lines text={step.text} /></div>
      )}
    </article>
  );
};

export const ObservationRoomRenderer: React.FC<RenderProps> = ({ step }) => {
  const speaker = step.speaker || '观察员';
  const n = speaker.match(/观察员([1-4])/)?.[1] || '·';
  return (
    <article className="m-obs">
      <header><span>STUDIO LIVE</span><div aria-hidden="true"><i /><i /><i /></div></header>
      <div className="m-obs__screen">
        <span className={`m-obs__tag m-obs__tag--${n}`}>{n}</span>
        <div className="m-obs__speaker">{speaker}</div>
        <Lines text={displayBody(step.text, step.speaker)} className="m-obs__text" />
      </div>
      <div className="m-obs__ticker">OBSERVATION ROOM / 实时观看中</div>
    </article>
  );
};

/* ---------- 两种聊天室 ---------- */
export const TextChatRenderer: React.FC<RenderProps> = ({ step }) => (
  <article className="m-chat">
    <header><span className="m-chat__lights"><i /><i /><i /></span><strong>匿名聊天室</strong><small>IDENTITY HIDDEN</small></header>
    <div className="m-chat__stream">
      <span className="m-chat__avatar">#</span>
      <Lines text={displayBody(step.text, step.speaker)} className="m-chat__msg" />
    </div>
    <div className="m-chat__input" aria-hidden="true"><span>只读模式</span><i /></div>
  </article>
);

export const TalkingRoomRenderer: React.FC<RenderProps> = ({ step }) => (
  <article className="m-talk">
    <div className="m-talk__orbit" aria-hidden="true"><span>VOICE</span><i /></div>
    <div className="m-talk__handset"><Icon name="phone" size={28} /></div>
    <div className="m-talk__rec"><span /> TALKING ROOM · 变声通话</div>
    <div className="m-talk__wave" aria-hidden="true">
      {[12, 28, 18, 40, 24, 34, 14, 30, 20, 38, 16].map((height, i) => <i key={i} style={{ height, animationDelay: `${i * .06}s` }} />)}
    </div>
    <Lines text={displayBody(step.text, step.speaker)} className="m-talk__text" />
  </article>
);

/* ---------- X ROOM 与身份档案 ---------- */
export const XRoomRenderer: React.FC<RenderProps> = ({ step, revealed }) => (
  <article className={'m-xroom' + (revealed ? ' is-open' : '')}>
    <header><span>X ROOM</span><small>MEMORY RECORD</small></header>
    <div className="m-xroom__route" aria-hidden="true"><i /><span /><i /><span /><i /></div>
    {revealed ? (
      <div className="m-xroom__archive">
        {step.items.map((entry) => {
          const question = /^Q[.．]/.test(entry.text.trim());
          const quote = /^[“‘\"]/.test(entry.text.trim());
          return (
            <div className={`m-xroom__entry ${question ? 'is-question' : ''} ${quote ? 'is-memory' : ''}`} key={entry.sourceId}>
              {entry.speaker && <small>{entry.speaker}</small>}
              <Lines text={displayBody(entry.text, entry.speaker)} />
            </div>
          );
        })}
      </div>
    ) : <div className="m-xroom__locked"><Icon name="door" size={24} /><span>点按进入记忆记录</span></div>}
  </article>
);

export const IdentityRevealRenderer: React.FC<RenderProps> = ({ step, revealed }) => (
  <article className={'m-id' + (revealed ? ' is-open' : '')}>
    <div className="m-id__tab">ON AIR</div>
    <header><span>节目公开卡</span><i /></header>
    {revealed ? (
      <div className="m-id__data"><span>ON AIR</span>{step.items.map((entry, index) => <Lines key={entry.sourceId} text={entry.text} className="m-id__line" />)}</div>
    ) : (
      <div className="m-id__preview"><div className="m-id__redact"><i /><i /><i /></div><small>点按后文字依次浮现</small></div>
    )}
  </article>
);

/* ---------- 约会任务 ---------- */
const DATE_KIND: Record<string, { label: string; en: string; icon: string; skin: string }> = {
  assigned_date: { label: '指定约会', en: 'ASSIGNED DATE', icon: 'stamp', skin: 'assigned' },
  assigned_x_date: { label: '指定X约会', en: 'ASSIGNED X DATE', icon: 'key', skin: 'x' },
  surprise_date: { label: '突袭约会', en: 'SURPRISE DATE', icon: 'bell', skin: 'surprise' },
  mutual_choice_date: { label: '双选约会', en: 'MUTUAL CHOICE', icon: 'heart', skin: 'mutual' },
  x_date: { label: 'X约会', en: 'X DATE', icon: 'key', skin: 'x' },
  secret_date: { label: '秘密约会', en: 'SECRET DATE', icon: 'lock', skin: 'secret' },
  travel_date: { label: '旅行约会', en: 'TRAVEL DATE', icon: 'route', skin: 'travel' },
};

export const DateTaskRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  const kind = DATE_KIND[step.block.subtype || 'assigned_date'] || DATE_KIND.assigned_date;
  return (
    <article className={`m-date m-date--${kind.skin} ${revealed ? 'is-open' : ''}`}>
      <header><Icon name={kind.icon} size={18} /><span>{kind.en}</span><b>{kind.label}</b></header>
      <div className="m-date__route" aria-hidden="true"><i /><span /><i /><span /><i /></div>
      {revealed ? (
        <div className="m-date__texts">{step.items.map((entry, index) => <Lines key={entry.sourceId} text={entry.text} className="m-date__text" />)}</div>
      ) : <div className="m-date__closed">展开节目约会安排</div>}
      <div className="m-date__corner" aria-hidden="true">{kind.skin === 'secret' ? '◐' : kind.skin === 'x' ? 'X' : '♡'}</div>
    </article>
  );
};

/* ---------- 游戏 ---------- */
const GameCard: React.FC<RenderProps & { title: string; token: string }> = ({ step, revealed, title, token }) => (
  <article className="m-game">
    <div className={'m-game__card' + (revealed ? ' is-flipped' : '')}>
      <header><span>{title}</span><b>{token}</b></header>
      {revealed ? <Lines text={step.text} className="m-game__q" /> : <div className="m-game__back"><Icon name="card" size={34} /><span>点击翻牌</span></div>}
    </div>
    <div className="m-game__chips" aria-hidden="true"><i>1</i><i>2</i><i>↺</i></div>
  </article>
);
export const FingerGameRenderer: React.FC<RenderProps> = (props) => <GameCard {...props} title="FINGER GAME · 手指游戏" token="✌" />;
export const TruthGameRenderer: React.FC<RenderProps> = (props) => <GameCard {...props} title="TRUTH CARD · 真心话" token="?" />;

/* ---------- 论坛、动态和媒体 ---------- */
export const ForumRenderer: React.FC<RenderProps> = ({ step }) => {
  const subtype = step.block.subtype;
  return (
    <article className={'m-forum m-forum--' + (subtype || 'comment')}>
      <header><span>익명 / ANONYMOUS BOARD</span><i>⌕</i></header>
      {subtype === 'title' ? (
        <Lines text={step.text} className="m-forum__title" />
      ) : subtype === 'count' ? (
        <Lines text={step.text} className="m-forum__count" />
      ) : (
        <div className="m-forum__post">
          <div className="m-forum__user"><span>{step.speaker || (subtype === 'body' ? 'MAIN POST' : 'COMMENT')}</span><i>{subtype === 'body' ? 'POST' : 'REPLY'}</i></div>
          <Lines text={step.text} className="m-forum__body" />
        </div>
      )}
    </article>
  );
};

export const SocialMediaRenderer: React.FC<RenderProps> = ({ step }) => {
  const handle = step.speaker;
  return (
    <article className="m-social">
      <header>
        <div className="m-social__avatar">{handle ? handle.slice(0, 1) : '@'}</div>
        <div>{handle && <strong>{handle}</strong>}<small>SOCIAL TIMELINE</small></div>
        <span>•••</span>
      </header>
      <Lines text={step.text} className="m-social__body" />
      <footer aria-hidden="true"><Icon name="chat" size={17} /><Icon name="route" size={17} /><Icon name="heart" size={17} /></footer>
    </article>
  );
};

const MEDIA_LABEL: Record<string, string> = {
  image: '图片', video: '视频', gif: '动图', youtube: 'YouTube',
  preview: '预告', early_release: '先公开', sneak_peek: '抢先看',
};
export const MediaRenderer: React.FC<RenderProps> = ({ step }) => {
  const subtype = step.block.subtype || 'image';
  const variant = Number(step.sourceId.replace(/\D/g, '')) % 4;
  const label = MEDIA_LABEL[subtype] || '媒体';
  const playable = ['video', 'youtube', 'preview', 'early_release', 'sneak_peek'].includes(subtype);
  const placeholderOnly = /^\s*[（(](?:图片|视频|动图|截图|YouTube视频)[）)]\s*$/i.test(step.text);
  return (
    <article className={`m-media m-media--variant-${variant}`}>
      <div className="m-media__frame">
        <header><span>{label}</span><i>{subtype.toUpperCase()}</i></header>
        <div className="m-media__art" aria-label={step.text}>
          <div className={`m-media__visual m-media__visual--${subtype}`} aria-hidden="true"><i /><i /><i /><span /></div>
          {playable && <span className="m-media__play"><Icon name="play" size={25} /></span>}
          <span className="sr-only">{step.text}</span>
        </div>
        <div className="m-media__timeline" aria-hidden="true"><i /></div>
      </div>
      {step.text && !placeholderOnly && <Lines text={step.text} className="m-media__cap" />}
    </article>
  );
};

/* ---------- 最终选择、后日谈、片尾 ---------- */
export const FinalChoiceRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  const subtype = step.block.subtype || 'step';
  const labels: Record<string, string> = { rule: 'RULE', call: 'CALL', waiting: 'WAITING', action: 'ACTION', result: 'RESULT', step: 'CHOICE' };
  return (
    <article className={'m-final m-final--' + subtype + (revealed ? ' is-open' : '')}>
      <header><span>FINAL CHOICE</span><b>{labels[subtype] || 'CHOICE'}</b></header>
      <div className="m-final__road" aria-hidden="true"><i className="is-start" /><span /><i /><span /><i className="is-end" /></div>
      <div className="m-final__icons" aria-hidden="true"><Icon name="phone" size={23} /><Icon name="route" size={23} /><Icon name="door" size={23} /></div>
      {revealed ? <Lines text={step.text} className="m-final__reveal" /> : <div className="m-final__closed"><strong>既定选择尚未揭晓</strong><small>玩家只能观看，不能替人物决定</small></div>}
      {revealed && subtype === 'result' && <div className="m-final__seal">ACTUAL<br />RESULT</div>}
    </article>
  );
};

export const EpilogueRenderer: React.FC<RenderProps> = ({ step }) => (
  <article className="m-epi">
    <header><span>AND NOW</span><strong>以及现在</strong></header>
    <div className="m-epi__film" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    <div className="m-epi__frames" aria-hidden="true"><span>01</span><span>02</span><span>03</span><span>04</span></div>
    <Lines text={step.text} className="m-epi__copy" />
  </article>
);

export const LyricsRenderer: React.FC<RenderProps> = ({ step }) => (
  <article className="m-lyrics">
    <header><span>LYRICS</span><strong>片尾文字</strong></header>
    <div className="m-lyrics__linework" aria-hidden="true"><i /><span /><i /></div>
    <div className="m-lyrics__sheet">
      {step.items.flatMap((entry) => entry.text.split(/[\n/]+/)).map((line, i) => <div className="m-lyrics__line" key={`${line}-${i}`} style={{ animationDelay: `${i * .08}s` }}>{line}</div>)}
    </div>
  </article>
);

const MAP: Record<string, React.FC<RenderProps>> = {
  narrative: NarrativeRenderer,
  dialogue: DialogueRenderer,
  scene_card: SceneCardRenderer,
  program_task: ProgramTaskRenderer,
  program_rule: ProgramRuleRenderer,
  program_notice: ProgramNoticeRenderer,
  letter: LetterRenderer,
  sms: SmsRenderer,
  interview: InterviewRenderer,
  observation_room: ObservationRoomRenderer,
  text_chat: TextChatRenderer,
  talking_room: TalkingRoomRenderer,
  x_room: XRoomRenderer,
  identity_reveal: IdentityRevealRenderer,
  date_task: DateTaskRenderer,
  finger_game: FingerGameRenderer,
  truth_game: TruthGameRenderer,
  interlude: InterludeRenderer,
  forum: ForumRenderer,
  social_media: SocialMediaRenderer,
  media: MediaRenderer,
  program_caption: ProgramCaptionRenderer,
  final_choice: FinalChoiceRenderer,
  epilogue: EpilogueRenderer,
  lyrics: LyricsRenderer,
  fallback: FallbackRenderer,
};

export function ContentRenderer({ step, revealed, stream }: RenderProps) {
  const activeStream = stream?.length ? stream : [step];
  switch (step.sceneKind) {
    case 'forum': return <ForumThreadRenderer stream={activeStream} />;
    case 'chat': return <ChatStreamRenderer stream={activeStream} />;
    case 'voice': return <VoiceStreamRenderer stream={activeStream} />;
    case 'xroom': return <XRoomStreamRenderer stream={activeStream} revealed={revealed} />;
    case 'dialogue': return <ChatStreamRenderer stream={activeStream} dialogue />;
    case 'interview': return <InterviewStreamRenderer stream={activeStream} />;
    case 'observation': return <ObservationStreamRenderer stream={activeStream} />;
    case 'game': return <GameStreamRenderer stream={activeStream} truth={step.block.type === 'truth_game'} />;
    case 'sms': return <SmsStreamRenderer stream={activeStream} revealed={revealed} />;
    case 'final': return <FinalStreamRenderer stream={activeStream} />;
    case 'epilogue': return <EpilogueStreamRenderer stream={activeStream} />;
    case 'social': return <SocialStreamRenderer stream={activeStream} />;
    default: break;
  }
  const Component = MAP[step.block.type] || FallbackRenderer;
  return <Component step={step} revealed={revealed} />;
}

export { MODULE_META };
