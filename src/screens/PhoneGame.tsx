import React, {useEffect,useRef,useState} from 'react';
import {useProgress} from '../hooks/useProgress';
import {PhoneIcon,SystemStatus,LockGlyph} from '../components/PhoneIcons';
import {ShowMark} from '../components/ShowMark';
import {ContentRenderer,MODULE_META} from '../renderers';
import {CHAPTER_ORDER} from '../data/loader';
import {APP_INFO,GRID_APPS,DOCK_APPS,PHONE_STEPS,PHONE_GROUPS,groupsFor,indexOfLocation,nextHint,streamAt,type AppId,type PhoneGroup} from '../utils/phoneStory';

const END_KEY='wooseok-iphone-finished-v1';
const HOME_HINT_KEY='wooseok-iphone-home-hint-v1';
function readFlag(key:string){try{return localStorage.getItem(key)==='yes';}catch{return false;}}
function writeFlag(key:string,value:boolean){try{localStorage.setItem(key,value?'yes':'no');}catch{/* private browsing */}}
function episode(chapter:string){return String(CHAPTER_ORDER.indexOf(chapter)+1).padStart(2,'0');}
function appTitle(app:AppId){return app==='dc'?'dcinside':app==='messages'?'信息':APP_INFO[app].name;}
function groupPreview(group:PhoneGroup,cursor:number){
 const step=PHONE_STEPS[Math.min(group.end,cursor)].step;
 const text=group.app==='dc'?PHONE_STEPS[group.start].step.items.find(i=>i.subtype==='title')?.text:step.text;
 return (text||APP_INFO[group.app].subtitle).replace(/^\[|\]$/g,'').replace(/\n/g,' ').slice(0,55);
}

export function PhoneGame(){
 const prog=useProgress();
 const cursor=indexOfLocation(prog.state.current),current=PHONE_STEPS[cursor];
 const [screen,setScreen]=useState<'lock'|'home'|'app'>('lock');
 const [app,setApp]=useState<AppId>('tving');
 const [shown,setShown]=useState<number|null>(null);
 const [opened,setOpened]=useState<Set<number>>(new Set());
 const [banner,setBanner]=useState(false);
 const [done,setDone]=useState(()=>readFlag(END_KEY));
 const [showEnd,setShowEnd]=useState(false);
 const [music,setMusic]=useState(false);
 const [hint,setHint]=useState(()=>!readFlag(HOME_HINT_KEY));
 const [reset,setReset]=useState(false);
 const [clockTab,setClockTab]=useState('世界时钟');
 const audio=useRef<HTMLAudioElement>(null),scroll=useRef<HTMLDivElement>(null),touch=useRef<{x:number;y:number}|null>(null);
 const entry=shown===null?null:PHONE_STEPS[shown];
 const stream=shown===null?[]:streamAt(shown);
 const blocked=!!entry&&MODULE_META[entry.step.block.type].blocking&&!(entry.step.sceneKind==='xroom'&&stream.length>1);
 const revealed=!!entry&&(!blocked||opened.has(shown!)||entry.step.sourceIds.every(id=>prog.state.readSourceIds[id]));
 const pendingApp=current.app;
 const light=screen!=='app'||['tving','phone','music'].includes(app);
 const activeGroups=groupsFor(app,cursor);

 useEffect(()=>{if(screen==='app'&&entry&&revealed)entry.step.sourceIds.forEach(prog.markRead);},[screen,shown,revealed,prog.markRead]);
 useEffect(()=>{const el=scroll.current;if(el)el.scrollTo({top:entry?.step.sceneKey&&stream.length>1?el.scrollHeight:0,behavior:prog.state.reduceMotion?'auto':'smooth'});},[shown,screen,app,revealed]);
 useEffect(()=>{writeFlag(END_KEY,done);},[done]);
 useEffect(()=>{const a=audio.current;if(!a)return;a.volume=.28;if(music)void a.play().catch(()=>setMusic(false));else a.pause();},[music]);

 function unlock(){setScreen('home');setBanner(false);}
 function home(){setScreen('home');setShown(null);setBanner(false);setShowEnd(false);}
 function openApp(id:AppId,focus=false){if(id===pendingApp){setHint(false);writeFlag(HOME_HINT_KEY,true);}setApp(id);setScreen('app');setBanner(false);setShowEnd(false);setShown(focus&&id===current.app?cursor:null);}
 function openCurrent(){openApp(pendingApp,true);setHint(false);writeFlag(HOME_HINT_KEY,true);}
 function openGroup(g:PhoneGroup){setShown(Math.min(g.end,cursor));setBanner(false);}
 function previous(){if(shown===null)return;const g=PHONE_GROUPS[entry!.group];if(shown>g.start)setShown(shown-1);}
 function advance(){
  if(shown===null||!entry)return;
  if(!revealed){setOpened(s=>new Set(s).add(shown));return;}
  const group=PHONE_GROUPS[entry.group];
  if(shown<cursor){if(shown<group.end)setShown(shown+1);else setShown(null);return;}
  if(cursor===PHONE_STEPS.length-1){setDone(true);setShowEnd(true);return;}
  const incoming=PHONE_STEPS[cursor+1];
  prog.goTo(incoming.location);
  if(incoming.group===entry.group)setShown(cursor+1);
  else {setBanner(true);try{navigator.vibrate?.([12,28,12]);}catch{/* optional haptics */}}
 }
 function actionLabel(){
  if(!entry)return '';
  if(!revealed)return app==='notes'?'打开这份记录':app==='files'?'打开文件':app==='messages'?'查看信息':'点按查看';
  if(shown!<cursor){const g=PHONE_GROUPS[entry.group];return shown!<g.end?'下一页':'返回记录列表';}
  if(cursor===PHONE_STEPS.length-1)return '收好这段故事';
  const incoming=PHONE_STEPS[cursor+1];
  if(incoming.group!==entry.group)return '看完了';
  return ({tving:'继续播放',dc:'加载下一条回复',x:'查看下一条动态',messages:'查看新信息',kakao:'查看下一条消息',notes:'翻到下一页',files:'下一页',photos:'查看下一项',phone:'继续听',music:'下一句'} as Record<string,string>)[app]||'继续';
 }
 const boundary=entry&&shown!==null&&shown<cursor&&PHONE_STEPS[cursor].group!==entry.group;
 function renderNotification(className=''){
  return <button className={`os-notification ${className}`} onClick={openCurrent} aria-label={`打开${APP_INFO[pendingApp].name}的新线索`}><PhoneIcon app={pendingApp}/><span><small>{APP_INFO[pendingApp].name}<i>现在</i></small><strong>{pendingApp==='messages'?'换乘恋爱 节目组':PHONE_GROUPS[current.group].title}</strong><em>{nextHint(pendingApp)}</em></span></button>;
 }
 function renderList(){return <>
  <div className="os-list-intro"><span>{app==='tving'?'MY TVING':app==='dc'?'즐겨찾기':app==='notes'?'我的 iPhone':'最近'}</span><h1>{app==='tving'?'继续观看':app==='dc'?'收藏的帖子':APP_INFO[app].subtitle}</h1></div>
  {app==='tving'&&<div className="os-tv-hero"><ShowMark/><span>TVING ORIGINAL</span><strong>환승연애</strong><p>结束的恋爱，未完的故事。</p></div>}
  {activeGroups.length>0?<div className="os-records">{activeGroups.map(g=><button key={g.id} className={`os-record ${g.id===current.group&&!done?'is-unread':''}`} onClick={()=>openGroup(g)}><span className="os-record-art">{app==='tving'?<><span>환승연애</span><b>EP {episode(g.chapter)}</b></>:app==='notes'?<span>{g.kind==='xroom'?'X':'✎'}</span>:<PhoneIcon app={app}/>}</span><span className="os-record-copy"><small>{g.id===current.group&&!done?'新记录':'已保存'} · EP {episode(g.chapter)}</small><strong>{g.title}</strong><em>{groupPreview(g,cursor)}</em></span><span className="os-record-chevron">›</span></button>)}</div>:<div className="os-empty"><PhoneIcon app={app}/><h2>这里还很安静</h2><p>故事继续时，新的记录会出现在这里。</p><button onClick={openCurrent}>前往{APP_INFO[pendingApp].name}查看新线索 ›</button></div>}
 </>}
 function renderUtilities(){
  if(app==='safari')return <div className="os-safari"><div className="os-safari-field">􀎡　搜索或输入网站名称</div><h1>个人收藏</h1><div className="os-bookmarks">{(['dc','x','tving'] as AppId[]).map(id=><button key={id} onClick={()=>openApp(id)}><PhoneIcon app={id}/><span>{APP_INFO[id].name}</span></button>)}</div><h2>最近打开</h2>{renderNotification()}<p className="os-utility-caption">收藏的网页随故事进度恢复。</p></div>;
  if(app==='calendar')return <div className="os-calendar"><span className="os-red">九月</span><h1>节目日程</h1><div className="os-month">{['一','二','三','四','五','六','日','',...Array.from({length:30},(_,i)=>String(i+1))].map((d,i)=><span key={i} className={d==='18'?'today':''}>{d}</span>)}</div><h2>已恢复的日程</h2>{CHAPTER_ORDER.map((chapter,i)=>{const target=PHONE_GROUPS.find(g=>g.chapter===chapter);const unlocked=!!target&&target.start<=cursor;return <button className="os-event" key={chapter} disabled={!unlocked} onClick={()=>{if(target){setApp(target.app);setShown(Math.min(target.end,cursor));}}}><span>{String(i+1).padStart(2,'0')}</span><div><strong>换乘恋爱 · EP {String(i+1).padStart(2,'0')}</strong><small>{unlocked?'点按查看已恢复的记录':'尚未解锁'}</small></div><i>{unlocked?'›':'⌑'}</i></button>})}</div>;
  if(app==='clock')return <div className="os-clock"><h1>{clockTab}</h1>{clockTab==='世界时钟'?<><div className="os-world-clock"><span><small>今天，+0小时</small>首尔</span><strong>21:41</strong></div><div className="os-world-clock"><span><small>今天，−1小时</small>深圳</span><strong>20:41</strong></div></>:clockTab==='闹钟'?<div className="os-world-clock"><span>07:30<small>明天 · 起床</small></span><button className="os-toggle" aria-label="闹钟" aria-pressed={false} onClick={e=>{e.currentTarget.classList.toggle('is-on');e.currentTarget.setAttribute('aria-pressed',e.currentTarget.getAttribute('aria-pressed')==='true'?'false':'true');}}/></div>:<p className="os-utility-caption">时间停在这一刻，故事仍在继续。</p>}<div className="os-clock-tabs">{['世界时钟','闹钟'].map(t=><button className={clockTab===t?'is-active':''} key={t} onClick={()=>setClockTab(t)}>{t}</button>)}</div></div>;
  if(app==='settings')return <div className="os-settings"><h1>设置</h1><div className="os-profile"><span>W</span><div><strong>김우석</strong><small>金宇硕的 iPhone</small></div><b>›</b></div><section><div className="os-setting-row"><span>手机名称</span><small>Wooseok’s iPhone</small></div><div className="os-setting-row"><span>文字大小</span><div className="os-font-controls">{[.9,1,1.15].map(v=><button key={v} aria-pressed={prog.state.fontScale===v} onClick={()=>prog.updateSettings({fontScale:v})}>{v===.9?'小':v===1?'标准':'大'}</button>)}</div></div><div className="os-setting-row"><span>减少动态效果</span><button className={`os-toggle ${prog.state.reduceMotion?'is-on':''}`} role="switch" aria-checked={prog.state.reduceMotion} aria-label="减少动态效果" onClick={()=>prog.updateSettings({reduceMotion:!prog.state.reduceMotion})}/></div><div className="os-setting-row"><span>背景音乐</span><button className={`os-toggle ${music?'is-on':''}`} role="switch" aria-checked={music} aria-label="背景音乐" onClick={()=>setMusic(!music)}/></div></section><section><button className="os-setting-row" onClick={()=>{setScreen('lock');setShown(null);}}>锁定屏幕 <span>›</span></button><button className="os-setting-row os-danger" onClick={()=>setReset(true)}>重新开始故事 <span>›</span></button></section><p className="os-about">承硕同人互动故事。<br/>这是一部虚构的手机，故事记录并非真实私人资料。<br/>你的进度自动保存在当前浏览器。</p></div>;
  return null;
 }
 function renderDetail(){
  if(!entry)return null;
  const g=PHONE_GROUPS[entry.group];
  return <div className={`os-detail os-detail--${app}`}>
   {app==='tving'&&<div className="os-video-title"><ShowMark small/><span>TVING ORIGINAL</span><b>환승연애</b><small>EP {episode(g.chapter)} · 节目记录</small></div>}
   {app==='music'&&<div className="os-album"><ShowMark/><strong>환승연애</strong><span>Original Soundtrack</span></div>}
   {app==='photos'&&<div className="os-photo-info"><span>已保存的影像</span><small>换乘恋爱</small></div>}
   <div className="os-scene" data-surface={entry.step.sceneKind||entry.step.block.type}><ContentRenderer step={entry.step} revealed={revealed} stream={stream}/></div>
   {boundary?<div className="os-read-done"><span>这份记录已读完</span>{!done&&<button onClick={openCurrent}>查看{APP_INFO[pendingApp].name}的新线索 ›</button>}<button onClick={()=>setShown(null)}>返回{APP_INFO[app].subtitle}</button></div>:<div className={`os-story-action os-story-action--${app}`}><button onClick={advance} aria-label={actionLabel()}>{actionLabel()}<span>{app==='tving'?'▷':'›'}</span></button>{shown!>g.start&&<button className="os-previous" onClick={previous}>上一页</button>}</div>}
  </div>;
 }
 function touchEnd(e:React.TouchEvent){if(!touch.current)return;const diff=touch.current.y-e.changedTouches[0].clientY;const dx=Math.abs(touch.current.x-e.changedTouches[0].clientX);if(diff>65&&dx<100){if(screen==='lock')unlock();else if(touch.current.y>window.innerHeight-110)home();}touch.current=null;}
 return <div className="os-world"><div className={`os-device os-device--${screen} ${prog.state.reduceMotion?'os-reduce-motion':''} ${screen==='app'?'os-app-'+app:''}`} style={{'--os-fs':`${16*prog.state.fontScale}px`} as React.CSSProperties} onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={touchEnd}>
  <SystemStatus light={light} time={screen==='lock'?'':'21:41'}/>
  {screen==='lock'?<main className="os-lock"><div className="os-lock-owner"><LockGlyph name="lock"/></div><div className="os-lock-date">9月18日 星期五</div><div className="os-lock-time">21:41</div><div className="os-owner-name">김우석의 iPhone</div><div className="os-lock-notices">{!done?renderNotification():<button className="os-notification" onClick={()=>{setScreen('home');setShowEnd(true);}}><PhoneIcon app="notes"/><span><small>备忘录<i>现在</i></small><strong>故事已经抵达结尾</strong><em>那些留下的记录，仍在手机里。</em></span></button>}</div><div className="os-lock-bottom"><button onClick={unlock} aria-label="解锁手机"><LockGlyph name="flashlight"/></button><span onClick={unlock}>向上轻扫以打开<br/><small>金宇硕的 iPhone</small></span><button onClick={unlock} aria-label="打开手机"><LockGlyph name="camera"/></button></div></main>:screen==='home'?<main className="os-home"><div className="os-home-widgets"><div className="os-date-widget"><span>星期五</span><strong>18</strong><small>九月 · 서울</small><div><b>换乘恋爱</b><em>未完的故事</em></div></div><button className="os-clue-widget" onClick={done?()=>setShowEnd(true):openCurrent}><PhoneIcon app={done?'notes':pendingApp}/><small>{done?'故事已完结':'下一条线索'}</small><strong>{done?'留在手机里的我们':APP_INFO[pendingApp].name}</strong><span>{done?'回看所有记录':nextHint(pendingApp)}</span><i>打开 ›</i></button></div><div className="os-app-grid">{GRID_APPS.map(id=><button key={id} className="os-app-button" onClick={()=>openApp(id)} aria-label={`打开${APP_INFO[id].name}`}><span className="os-app-image"><PhoneIcon app={id}/>{!done&&id===pendingApp&&<b className="os-badge">1</b>}</span><span>{APP_INFO[id].name}</span></button>)}</div><button className="os-home-search" onClick={()=>openApp('safari')}>⌕ 搜索</button><div className="os-dock">{DOCK_APPS.map(id=><button key={id} className="os-app-button" onClick={()=>openApp(id)} aria-label={`打开${APP_INFO[id].name}`}><span className="os-app-image"><PhoneIcon app={id}/>{!done&&id===pendingApp&&<b className="os-badge">1</b>}</span></button>)}</div>{hint&&<button className="os-first-hint" onClick={openCurrent}><span>你捡到了金宇硕的手机。</span><strong>先点开有红点的 App 看看。 ›</strong></button>}</main>:<main className="os-app-view"><header className="os-app-nav"><button onClick={()=>{if(shown!==null){setShown(null);setBanner(false);}else home();}} aria-label={shown===null?'返回桌面':'返回列表'}>‹<span>{shown===null?'':app==='notes'?'备忘录':app==='messages'?'信息':'返回'}</span></button><strong>{shown!==null?(app==='messages'?'换乘恋爱 节目组':app==='kakao'?'换乘恋爱':app==='phone'?'通话记录':app==='tving'?'TVING':app==='notes'?'':appTitle(app)):appTitle(app)}</strong><button onClick={home} aria-label="返回主屏幕" className="os-nav-home"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="3" width="6" height="6" rx="1.5"/><rect x="3" y="15" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/></svg></button></header><div className="os-app-scroll" ref={scroll}>{shown===null?renderUtilities()||renderList():renderDetail()}{app==='music'&&<div className="os-music-player"><PhoneIcon app="music"/><div><strong>Sun or Suck</strong><span>WOODZ</span></div><button onClick={()=>setMusic(!music)} aria-label={music?'暂停音乐':'播放音乐'}>{music?'Ⅱ':'▶'}</button></div>}</div></main>}
  {banner&&screen==='app'&&!done&&<div className="os-banner">{renderNotification()}<button aria-label="收起通知" onClick={()=>setBanner(false)}>×</button></div>}
  {showEnd&&<div className="os-ending"><button onClick={()=>{setShowEnd(false);home();}} aria-label="关闭结局">×</button><small>AND NOW</small><ShowMark/><h1>故事读到了最后，<br/>爱还在继续。</h1><p>金宇硕的手机里，<br/>留下了关于他们的全部记录。</p><button onClick={()=>{setShowEnd(false);home();}}>回到手机 · 重温这段故事</button></div>}
  {reset&&<div className="os-alert-layer"><div className="os-alert"><strong>重新开始故事？</strong><p>将清除这部手机的故事进度，<br/>从第一条线索重新开始。</p><div><button onClick={()=>setReset(false)}>取消</button><button className="os-danger" onClick={()=>{prog.fullReset();setDone(false);setOpened(new Set());setReset(false);setShown(null);setBanner(false);setHint(true);writeFlag(HOME_HINT_KEY,false);setScreen('lock');}}>重新开始</button></div></div></div>}
  <button className={`os-home-indicator ${light?'is-light':''}`} aria-label={screen==='lock'?'上滑解锁':'返回桌面'} onClick={screen==='lock'?unlock:home}/>
  <audio ref={audio} src="./audio/sun-or-suck.mp3" loop preload="none"/>
 </div></div>;
}
