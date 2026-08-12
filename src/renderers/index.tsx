import React from 'react';
import type { ContentBlock, ReadStep } from '../types/content';
import { Icon } from '../components/Doodles';
import { ModuleFrame, MODULE_META, displayBody } from './common';

export interface RenderProps {
  step: ReadStep;
  revealed: boolean;
}

/* ---------------- plain reading ---------------- */
export const NarrativeRenderer: React.FC<RenderProps> = ({ step }) => (
  <div className="m-narrative">
    {step.text.split('\n').map((line, i) => (
      <p key={i}>{line}</p>
    ))}
  </div>
);

export const DialogueRenderer: React.FC<RenderProps> = ({ step }) => {
  const body = displayBody(step.text, step.speaker);
  return (
    <div className="m-dialogue">
      {step.speaker && <div className="m-dialogue__name">{step.speaker}</div>}
      <div className="m-dialogue__text">{body}</div>
    </div>
  );
};

export const SceneCardRenderer: React.FC<RenderProps> = ({ step }) => {
  const t = step.text;
  const night = /夜|凌晨|深夜|傍晚|月亮|晚/.test(t);
  return (
    <div className="m-scene">
      <div className="m-scene__kicker">SCENE</div>
      <div className="m-scene__big">{t}</div>
      <Icon name={night ? 'moon' : 'sun'} size={30} className="m-scene__doodle" />
    </div>
  );
};

export const InterludeRenderer: React.FC<RenderProps> = ({ step }) => (
  <div className="m-interlude">— {step.text} —</div>
);

export const ProgramCaptionRenderer: React.FC<RenderProps> = ({ step }) => (
  <div className="m-cap">{step.text}</div>
);

export const FallbackRenderer: React.FC<RenderProps> = ({ step }) => (
  <div className="m-fallback">{step.text}</div>
);

/* ---------------- program / tasks ---------------- */
export const ProgramTaskRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  if (!revealed) {
    return (
      <div className="m-task" role="button" aria-label="展开任务卡">
        <div className="m-task__mission">MISSION</div>
        <div className="m-task__no">节目组任务 · 点击展开</div>
      </div>
    );
  }
  return (
    <div className="m-task">
      <div className="m-task__stamp">节目组</div>
      <div className="m-task__mission">MISSION</div>
      <div className="m-task__no">任务卡</div>
      <div className="m-task__rule">{step.text}</div>
    </div>
  );
};

export const ProgramRuleRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  if (!revealed) {
    return (
      <div className="m-rule" role="button" aria-label="展开入住指南">
        <div className="m-rule__item" style={{ borderBottom: 'none' }}>
          入住指南 · 点击查看
        </div>
      </div>
    );
  }
  return (
    <div className="m-rule">
      <div className="m-rule__item">
        <span className="m-rule__no">入住指南</span>
        {step.text}
      </div>
    </div>
  );
};

export const ProgramNoticeRenderer: React.FC<RenderProps> = ({ step }) => (
  <div className="m-notice">
    <div className="m-notice__bar">
      <i /><i /><i /><i /><i />
    </div>
    <div className="m-notice__text">{step.text}</div>
  </div>
);

/* ---------------- letter ---------------- */
export const LetterRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  if (!revealed) {
    return (
      <div className="m-letter-wrap">
        <div className="m-envelope" role="button" aria-label="打开信封">
          <div className="m-envelope__prompt">✉ 一封来信 · 点击拆开</div>
        </div>
      </div>
    );
  }
  return (
    <div className="m-letter-wrap">
      <div className="m-letter" style={{ animation: 'envOpen .26s ease' }}>
        <div className="m-letter__stamp">邮戳</div>
        <div className="m-letter__crease" />
        {step.text.split('\n').map((l, i) => (
          <p key={i} style={{ margin: '0 0 .4em' }}>{l}</p>
        ))}
      </div>
    </div>
  );
};

/* ---------------- sms ---------------- */
export const SmsRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  const sub = step.block.subtype;
  if (sub === 'result') {
    if (!revealed) {
      return (
        <div className="m-sms">
          <div className="m-sms__notif" role="button" aria-label="揭晓结果通知">
            <div className="m-sms__app"><Icon name="phone" /></div>
            <div>
              <div className="m-sms__title">结果通知</div>
              <div className="m-sms__preview">点击查看节目组通知</div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="m-sms">
        <div className="m-sms__result">{step.text}</div>
      </div>
    );
  }
  // normal / anonymous
  const anon = sub === 'anonymous';
  if (!revealed) {
    return (
      <div className="m-sms">
        <div className="m-sms__notif" role="button" aria-label="打开短信">
          <div className="m-sms__app"><Icon name="phone" /></div>
          <div>
            <div className="m-sms__title">{anon ? '匿名短信' : '短信'}</div>
            <div className="m-sms__preview">{step.text.slice(0, 18)}…</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="m-sms">
      <div className={'m-sms__bubble' + (anon ? ' m-sms__anon' : '')}>
        {step.text}
      </div>
    </div>
  );
};

/* ---------------- interview ---------------- */
export const InterviewRenderer: React.FC<RenderProps> = ({ step }) => {
  const sub = step.block.subtype;
  let inner: React.ReactNode;
  if (sub === 'header') inner = <div className="m-interview__name">{step.text}</div>;
  else if (sub === 'question')
    inner = (
      <div className="m-interview__q">
        <span className="m-interview__qmark">Q. </span>
        {step.text}
      </div>
    );
  else
    inner = <div className="m-interview__a">{step.text}</div>;
  return (
    <div className="m-interview">
      <div className="m-interview__view" />
      {inner}
    </div>
  );
};

/* ---------------- observation room ---------------- */
export const ObservationRoomRenderer: React.FC<RenderProps> = ({ step }) => {
  const sp = step.speaker || '观察员';
  const m = sp.match(/观察员([1-4])/);
  const tagClass = m ? `m-obs__tag m-obs__tag--${m[1]}` : 'm-obs__tag';
  return (
    <div className="m-obs">
      <div className="m-obs__screen">
        <span className={tagClass}>{sp}</span>
        <div className="m-obs__text">{step.text}</div>
      </div>
    </div>
  );
};

/* ---------------- text chat ---------------- */
export const TextChatRenderer: React.FC<RenderProps> = ({ step }) => (
  <div className="m-chat">
    <div className="m-chat__head">
      <span>匿名聊天室</span>
      <span>身份隐藏中</span>
    </div>
    <div className="m-chat__msg">{step.text}</div>
  </div>
);

/* ---------------- talking room ---------------- */
export const TalkingRoomRenderer: React.FC<RenderProps> = ({ step }) => (
  <div className="m-talk">
    <div className="m-talk__handset"><Icon name="phone" size={26} /></div>
    <div className="m-talk__rec"><span className="m-talk__dot" /> 通话中 · 变声处理</div>
    <div className="m-talk__wave">
      {[10, 26, 16, 34, 20, 30, 12, 24, 18].map((h, i) => (
        <i key={i} style={{ height: h, animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
    <div className="m-talk__text">{step.text}</div>
  </div>
);

/* ---------------- x room ---------------- */
export const XRoomRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  if (!revealed) {
    return (
      <div className="m-xroom">
        <div className="m-xroom__door" />
        <div className="m-xroom__label">X ROOM</div>
        <div className="m-xroom__item m-xroom__item--locked" role="button" aria-label="查看记忆物件">
          记忆物件 · 点击查看
        </div>
      </div>
    );
  }
  return (
    <div className="m-xroom">
      <div className="m-xroom__door" style={{ animation: 'doorOpen .28s ease' }} />
      <div className="m-xroom__label">X ROOM</div>
      <div className="m-xroom__item m-xroom__item--active">
        {step.text}
      </div>
    </div>
  );
};

/* ---------------- identity reveal ---------------- */
export const IdentityRevealRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  if (!revealed) {
    return (
      <div className="m-id" role="button" aria-label="揭晓身份档案">
        <div className="m-id__seal">SEALED</div>
        <div className="m-id__row">
          <span className="m-id__k">档案</span>
          <div className="m-id__censor">██████████</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 8 }}>点击揭晓</div>
      </div>
    );
  }
  return (
    <div className="m-id">
      <div className="m-id__seal">OPEN</div>
      <div className="m-id__row">
        <span className="m-id__k">档案</span>
        <div className="m-id__v">{step.text}</div>
      </div>
    </div>
  );
};

/* ---------------- date task ---------------- */
const DATE_KIND: Record<string, { label: string; icon: string }> = {
  assigned_date: { label: '指定约会', icon: 'stamp' },
  assigned_x_date: { label: '指定X约会', icon: 'key' },
  surprise_date: { label: '突袭约会', icon: 'bell' },
  mutual_choice_date: { label: '双选约会', icon: 'heart' },
  x_date: { label: 'X约会', icon: 'key' },
  secret_date: { label: '秘密约会', icon: 'lock' },
  travel_date: { label: '旅行约会', icon: 'route' },
};
export const DateTaskRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  const sub = step.block.subtype || 'assigned_date';
  const kind = DATE_KIND[sub] || DATE_KIND.assigned_date;
  const mutual = sub === 'mutual_choice_date';
  if (!revealed) {
    return (
      <div className={'m-date m-date--' + (sub === 'secret_date' ? 'secret' : sub === 'travel_date' ? 'travel' : sub === 'assigned_x_date' || sub === 'x_date' ? 'x' : sub === 'surprise_date' ? 'torn' : 'stamp')}
        role="button" aria-label="查看约会">
        <span className="m-date__kind"><Icon name={kind.icon} size={14} />{kind.label}</span>
        <div className="m-date__text">点击查看既定安排</div>
      </div>
    );
  }
  if (mutual) {
    return (
      <div className="m-date m-date--mutual">
        <div className="m-date__card">选择卡 A</div>
        <div className="m-date__card">选择卡 B</div>
        <div className="m-date__match">{step.text}</div>
      </div>
    );
  }
  return (
    <div className={'m-date m-date--' + (sub === 'secret_date' ? 'secret' : sub === 'travel_date' ? 'travel' : sub === 'assigned_x_date' || sub === 'x_date' ? 'x' : sub === 'surprise_date' ? 'torn' : 'stamp')}>
      <span className="m-date__kind"><Icon name={kind.icon} size={14} />{kind.label}</span>
      <div className="m-date__text">{step.text}</div>
    </div>
  );
};

/* ---------------- games ---------------- */
export const FingerGameRenderer: React.FC<RenderProps> = ({ step, revealed }) => (
  <div className="m-game">
    <div className="m-game__card" style={revealed ? { animation: 'flip .3s ease' } : undefined}>
      <div className="m-game__q">{revealed ? step.text : '手指游戏 · 点击翻牌'}</div>
    </div>
    <div className="m-game__chips">
      <span className="m-game__chip">✌</span>
      <span className="m-game__chip">⦿</span>
      <span className="m-game__chip">↺</span>
    </div>
  </div>
);

export const TruthGameRenderer: React.FC<RenderProps> = ({ step, revealed }) => (
  <div className="m-game">
    <div className="m-game__card" style={revealed ? { animation: 'flip .3s ease' } : undefined}>
      <div className="m-game__q">{revealed ? step.text : '真心话 · 点击翻牌'}</div>
    </div>
    <div className="m-game__chips">
      <span className="m-game__chip">？</span>
      <span className="m-game__chip">♥</span>
    </div>
  </div>
);

/* ---------------- forum ---------------- */
export const ForumRenderer: React.FC<RenderProps> = ({ step }) => {
  const sub = step.block.subtype;
  if (sub === 'title')
    return (
      <div className="m-forum">
        <div className="m-forum__title">{step.text}</div>
      </div>
    );
  if (sub === 'body')
    return (
      <div className="m-forum">
        {step.speaker && <div className="m-forum__user">{step.speaker}</div>}
        <div className="m-forum__body">{step.text}</div>
      </div>
    );
  if (sub === 'count')
    return (
      <div className="m-forum">
        <div className="m-forum__count">{step.text}</div>
      </div>
    );
  // comment
  return (
    <div className="m-forum m-forum--comment">
      <div className="m-forum__user">
        {step.speaker || '匿名网友'}
        <span className="m-forum__floor">楼层</span>
      </div>
      <div className="m-forum__body">{step.text}</div>
    </div>
  );
};

/* ---------------- social media ---------------- */
export const SocialMediaRenderer: React.FC<RenderProps> = ({ step }) => {
  const handle = step.speaker || '网友';
  return (
    <div className="m-social">
      <div className="m-social__head">
        <div className="m-social__avatar">{handle.slice(0, 1)}</div>
        <div>
          <div className="m-social__handle">{handle}</div>
          <div className="m-social__time">动态</div>
        </div>
      </div>
      <div className="m-social__body">{step.text}</div>
    </div>
  );
};

/* ---------------- media ---------------- */
const MEDIA_LABEL: Record<string, string> = {
  image: '图片', video: '视频', gif: '动图', youtube: 'YouTube',
  preview: '预告', early_release: '先公开', sneak_peek: '抢先看',
};
export const MediaRenderer: React.FC<RenderProps> = ({ step }) => {
  const sub = step.block.subtype || 'image';
  const label = MEDIA_LABEL[sub] || '媒体';
  return (
    <div className="m-media">
      <div className="m-media__frame">
        <span className="m-media__tag">{label}</span>
        {sub === 'video' || sub === 'youtube' || sub === 'preview' || sub === 'early_release' || sub === 'sneak_peek' ? (
          <span className="m-media__play"><Icon name="play" size={22} /></span>
        ) : (
          <span className="m-media__ph">
            <Icon name={sub === 'gif' ? 'image' : 'image'} size={40} />
            <span>{label} · 占位</span>
          </span>
        )}
      </div>
      {step.text && step.text !== `（${label}）` && <div className="m-media__cap">{step.text}</div>}
    </div>
  );
};

/* ---------------- final choice ---------------- */
export const FinalChoiceRenderer: React.FC<RenderProps> = ({ step, revealed }) => {
  const sub = step.block.subtype || 'step';
  const STEP_LABEL: Record<string, string> = {
    rule: '规则', call: '通话', waiting: '等待', action: '行动', result: '结果', step: '环节',
  };
  if (!revealed) {
    return (
      <div className="m-final" role="button" aria-label="查看最终选择">
        <div className="m-final__step">最终选择 · {STEP_LABEL[sub]}</div>
        <div className="m-final__big">点击查看既定结果</div>
      </div>
    );
  }
  return (
    <div className="m-final">
      <div className="m-final__step">最终选择 · {STEP_LABEL[sub]}</div>
      {sub === 'result' ? (
        <>
          <div className="m-final__cards">
            <div className="m-final__namecard">他的选择</div>
            <div className="m-final__namecard">她的选择</div>
          </div>
          <div className="m-final__reveal">{step.text}</div>
          <div className="m-final__pairline">
            <span className="m-final__pair">实际互选</span>
          </div>
        </>
      ) : (
        <>
          <div className="m-final__road">
            <span className="m-final__node">车</span>
            <span className="m-final__line" />
            <span className="m-final__node">等待</span>
            <span className="m-final__line" />
            <span className="m-final__node">选择</span>
          </div>
          <div className="m-final__reveal">{step.text}</div>
        </>
      )}
    </div>
  );
};

/* ---------------- epilogue ---------------- */
export const EpilogueRenderer: React.FC<RenderProps> = ({ step }) => (
  <div className="m-epi">
    <div className="m-epi__grid">
      <div className="m-epi__frame"><div className="m-epi__ph">以及现在</div></div>
      <div className="m-epi__frame"><div className="m-epi__ph">人生四格</div></div>
    </div>
    <div className="m-epi__single" style={{ marginTop: 10 }}>{step.text}</div>
  </div>
);

/* ---------------- lyrics ---------------- */
export const LyricsRenderer: React.FC<RenderProps> = ({ step }) => (
  <div className="m-lyrics">
    {step.text.split('\n').map((line, i) => (
      <div className="m-lyrics__line" key={i} style={{ animationDelay: `${i * 0.4}s` }}>
        {line}
      </div>
    ))}
  </div>
);

/* ---------------- dispatcher ---------------- */
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

export function ContentRenderer({ step, revealed }: RenderProps) {
  const Comp = MAP[step.block.type] || FallbackRenderer;
  return <Comp step={step} revealed={revealed} />;
}

export { MODULE_META };
