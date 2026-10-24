import { CHAPTER_ORDER } from '../data/loader';
import { chapterSteps, type StepLocation } from './reading';
import type { ReadStep } from '../types/content';

export type StoryApp = 'tving' | 'dc' | 'x' | 'messages' | 'kakao' | 'notes' | 'files' | 'photos' | 'phone' | 'music';
export type AppId = StoryApp | 'safari' | 'calendar' | 'clock' | 'settings';
export const APP_INFO: Record<AppId, {name:string; subtitle:string; color:string}> = {
  tving:{name:'TVING',subtitle:'节目记录',color:'#ff304d'},
  dc:{name:'dcinside',subtitle:'환승연애 갤러리',color:'#3b4890'},
  x:{name:'X',subtitle:'时间线',color:'#111'},
  messages:{name:'信息',subtitle:'换乘恋爱 节目组',color:'#33c859'},
  kakao:{name:'KakaoTalk',subtitle:'聊天记录',color:'#fae100'},
  notes:{name:'备忘录',subtitle:'我的 iPhone',color:'#eebc32'},
  files:{name:'文件',subtitle:'最近项目',color:'#2489f7'},
  photos:{name:'照片',subtitle:'图库',color:'#ef6488'},
  phone:{name:'电话',subtitle:'通话记录',color:'#32c85b'},
  music:{name:'音乐',subtitle:'资料库',color:'#fc4966'},
  safari:{name:'Safari',subtitle:'个人收藏',color:'#168bfa'},
  calendar:{name:'日历',subtitle:'节目日程',color:'#f34848'},
  clock:{name:'时钟',subtitle:'首尔',color:'#222'},
  settings:{name:'设置',subtitle:'김우석',color:'#8c9097'},
};
export const GRID_APPS: AppId[] = ['tving','photos','notes','files','dc','x','calendar','clock','music','settings'];
export const DOCK_APPS: AppId[] = ['phone','safari','kakao','messages'];
export function routeStep(step:ReadStep):StoryApp {
  if(step.sceneKind==='forum') return 'dc';
  if(step.sceneKind==='social') return 'x';
  if(step.sceneKind==='chat') return 'kakao';
  if(step.sceneKind==='sms') return 'messages';
  if(step.sceneKind==='voice'||step.sceneKind==='final') return 'phone';
  if(step.sceneKind==='xroom') return 'notes';
  const type=step.block.type;
  if(type==='forum')return 'dc';
  if(type==='social_media')return 'x';
  if(type==='sms')return 'messages';
  if(type==='text_chat')return 'kakao';
  if(type==='talking_room')return 'phone';
  if(type==='letter'||type==='x_room')return 'notes';
  if(['program_task','program_rule','program_notice','date_task','identity_reveal'].includes(type))return 'files';
  if(type==='media')return 'photos';
  if(type==='lyrics')return 'music';
  return 'tving';
}
export interface PhoneEntry {step:ReadStep;location:StepLocation;app:StoryApp;group:number;index:number}
export interface PhoneGroup {id:number;app:StoryApp;start:number;end:number;chapter:string;title:string;kind:string}
export const PHONE_STEPS:PhoneEntry[]=[];
export const PHONE_GROUPS:PhoneGroup[]=[];
for(const chapter of CHAPTER_ORDER){
  const steps=chapterSteps(chapter);
  for(let i=0;i<steps.length;i++){
    const step=steps[i],app=routeStep(step),prev=PHONE_STEPS[PHONE_STEPS.length-1];
    const same=prev&&prev.app===app&&prev.location.chapter===chapter&&(
      app==='tving'||(step.sceneKey&&step.sceneKey===prev.step.sceneKey));
    if(!same){
      const kind=step.sceneKind||step.block.type;
      const titles:Partial<Record<StoryApp,string>>={tving:'换乘恋爱 · 节目片段',dc:'환승연애 갤러리',x:'承硕 · 时间线',messages:'换乘恋爱 节目组',kakao:'换乘恋爱 · 聊天记录',notes:kind==='xroom'?'X ROOM · 记忆档案':step.block.type==='letter'?'X 留下的信':'私人记录',files:step.block.type==='program_rule'?'入住指南.pdf':step.block.type==='identity_reveal'?'出演者资料.pdf':step.block.type==='date_task'?'约会任务.pdf':'节目组的文件.pdf',photos:'已保存的影像',phone:kind==='final'?'最终选择 · 通话记录':'Talking Room',music:'片尾 · 歌词'};
      PHONE_GROUPS.push({id:PHONE_GROUPS.length,app,start:PHONE_STEPS.length,end:PHONE_STEPS.length,chapter,title:titles[app]||APP_INFO[app].name,kind});
    }
    const group=PHONE_GROUPS[PHONE_GROUPS.length-1];group.end=PHONE_STEPS.length;
    PHONE_STEPS.push({step,location:{chapter,stepIndex:i},app,group:group.id,index:PHONE_STEPS.length});
  }
}
export function indexOfLocation(loc:StepLocation){return Math.max(0,PHONE_STEPS.findIndex(e=>e.location.chapter===loc.chapter&&e.location.stepIndex===loc.stepIndex));}
export function streamAt(index:number):ReadStep[]{
  const entry=PHONE_STEPS[index];if(!entry)return [];
  let start=index;
  if(entry.step.sceneKey)while(start>0&&PHONE_STEPS[start-1].step.sceneKey===entry.step.sceneKey&&PHONE_STEPS[start-1].location.chapter===entry.location.chapter)start--;
  return PHONE_STEPS.slice(start,index+1).map(e=>e.step);
}
export function groupsFor(app:AppId,cursor:number){return PHONE_GROUPS.filter(g=>g.app===app&&g.start<=cursor).reverse();}
export function nextHint(app:AppId){return ({tving:'一段节目记录已恢复，点按继续观看。',dc:'收藏的讨论帖有了新回复。',x:'你关注的时间线有新动态。',messages:'节目组发来了一条新信息。',kakao:'一段新的聊天记录已送达。',notes:'一份关于 X 的记录已恢复。',files:'节目组共享了一份文件。',photos:'一段影像已保存到图库。',phone:'有一段等待接听的通话记录。',music:'片尾的文字，已经留在这里。'} as Partial<Record<AppId,string>>)[app]||'有新的记录可以查看。';}
