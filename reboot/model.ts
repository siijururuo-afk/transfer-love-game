import{parseTheqoo,parseInstiz,parseNeutral}from'./forum-parser';
import{FORUM_EVIDENCE,forumSource}from'./forum-sources';
import{SMS_CONTACTS,smsDefaultContact}from'./sms';
import chapter from './chapter01.json';
import chapter2 from './chapter02.json';
import chapter3 from './chapter03.json';
import chapter4 from './chapter04.json';
import chapter5 from './chapter05.json';
import chapter6 from './chapter06.json';
import chapter7 from './chapter07.json';
import chapter8 from './chapter08.json';
import chapter9 from './chapter09.json';
import chapter10 from './chapter10.json';
import chapter11 from './chapter11.json';
import chapter12 from './chapter12.json';
export const EPILOGUE_LAST=chapter12;
export const EPILOGUE=chapter11;
export const FINALE=chapter10;
export type StoryApp='forum'|'instiz'|'instagram'|'x'|'tving'|'cafe'|'theqoo'|'files'|'messages'|'chat'|'youtube'|'photos';
export type AppId=StoryApp|'safari'|'messages'|'kakao'|'x'|'instagram'|'photos'|'notes'|'music'|'settings'|'phone'|'calendar'|'clock';
export interface Scene{id:string;app:StoryApp;title:string;body:string;kind:string;chapter:number;pictures?:{src:string;caption:string;original:string;width?:number;height?:number}[];count?:string;author?:string;media?:string[];filename?:string;speaker?:string;subtitle?:string;note?:string;parent?:string;channelName?:string;videoKey?:string;handle?:string;posted?:string;metrics?:{replies:string;reposts:string;likes:string};voice?:{src:string;label?:string};attachment?:{src:string;alt:string;width?:number;height?:number}}
export const CHAPTER=chapter;
export const SCENES=[...chapter.scenes.map(s=>({...s,chapter:1})),...chapter2.scenes,...chapter3.scenes,...chapter4.scenes,...chapter5.scenes,...chapter6.scenes,...chapter7.scenes,...chapter8.scenes,...chapter9.scenes,...chapter10.scenes,...chapter11.scenes,...chapter12.scenes].map(s=>({...s,app:['theqoo','cafe','instiz'].includes(s.app)?FORUM_EVIDENCE[s.id]?.platform||'forum':s.app})) as Scene[];
export const CHAPTERS=[chapter,chapter2,chapter3,chapter4,chapter5,chapter6,chapter7,chapter8,chapter9,chapter10,chapter11,chapter12];
export const APPS:Record<AppId,{name:string,color:string}>= {
 forum:{name:'커뮤니티',color:'#537c87'},instiz:{name:'Instiz',color:'#54a920'},cafe:{name:'Daum Café',color:'#eb5734'},chat:{name:'Talking Room',color:'#354257'},youtube:{name:'YouTube',color:'#ff2525'},
 tving:{name:'TVING',color:'#ff153c'},theqoo:{name:'theqoo',color:'#ba1837'},files:{name:'文件',color:'#1488ff'},safari:{name:'Safari',color:'#1e96ef'},messages:{name:'信息',color:'#40ca58'},kakao:{name:'KakaoTalk',color:'#fee500'},x:{name:'X',color:'#111'},instagram:{name:'Instagram',color:'#f25379'},photos:{name:'照片',color:'#f38d83'},notes:{name:'备忘录',color:'#dfb649'},music:{name:'Melon',color:'#00cd3c'},settings:{name:'设置',color:'#81848c'},phone:{name:'电话',color:'#31c454'},calendar:{name:'日历',color:'#fc463f'},clock:{name:'时钟',color:'#17171b'}
};
export const HOME_APPS:AppId[]=['photos','calendar','clock','files','tving','theqoo','x','instagram','kakao','notes','music','settings'];
export const DOCK:AppId[]=['phone','safari','messages','kakao'];
export const FOLDERS:{id:string;name:string;apps:AppId[]}[]=[{id:'photos',name:'사진',apps:['photos']},{id:'productivity',name:'생산성',apps:['files','notes','chat','calendar','clock','settings']},{id:'video',name:'사진 및 비디오',apps:['tving','instagram']},{id:'community',name:'커뮤니티',apps:['forum','theqoo','cafe','instiz','x']}];
export interface Save{cursor:number;saved:string[];liked:string[];font:number;reduced:boolean;finished:boolean;storyVersion?:number;muted?:boolean;read?:string[]}
const KEY='transit-rewritten-chapter-one-v1';
export function readSave():Save{try{const d=JSON.parse(localStorage.getItem(KEY)||'{}');const cursor=Math.max(0,Math.min(SCENES.length-1,Math.floor(Number(d.cursor)||0)));const resume=!!d.finished&&cursor<SCENES.length-1&&SCENES[cursor].chapter!==SCENES[cursor+1].chapter;return{cursor:resume?cursor+1:cursor,saved:Array.isArray(d.saved)?d.saved.filter((id:string)=>SCENES.some(s=>s.id===id)):[],liked:Array.isArray(d.liked)?d.liked:[],font:[.9,1,1.12].includes(d.font)?d.font:1,reduced:!!d.reduced,finished:!!d.finished&&!resume,storyVersion:12,muted:!!d.muted,read:Array.isArray(d.read)?d.read.filter((id:string)=>SCENES.some(s=>s.id===id)):SCENES.slice(0,cursor).map(s=>s.id)};}catch{return{cursor:0,saved:[],liked:[],font:1,reduced:false,finished:false,storyVersion:12};}}
export function writeSave(s:Save){try{localStorage.setItem(KEY,JSON.stringify({...s,storyVersion:12}));}catch{/* Storage may be unavailable in private mode. */}}
export function unlocked(app:AppId,cursor:number){return SCENES.map((s,index)=>({...s,index})).filter(s=>s.app===app&&s.index<=cursor).reverse();}
export function nextState(save:Save,sceneIndex:number){if(sceneIndex!==save.cursor||save.finished)return save;return sceneIndex===SCENES.length-1?{...save,finished:true}:{...save,cursor:save.cursor+1};}
export function noticeFor(scene:Scene){if(scene.app==='instiz')return{from:'Instiz',title:scene.title,body:'关注的话题有新内容。'};if(scene.app==='instagram')return{from:'Instagram',title:scene.author||scene.title,body:'发布了一条动态。'};if(scene.app==='x')return{from:'X',title:scene.title,body:'关注的动态有新内容。'};if(scene.app==='messages')return{from:'信息',title:SMS_CONTACTS[smsDefaultContact(scene)].name,body:smsDefaultContact(scene)==='production'?scene.body.split('\n')[0]:'收到一条个人心意短信。'};if(scene.app==='chat')return{from:'Talking Room',title:'X',body:'可以开始对话了。'};if(scene.app==='youtube')return{from:'YouTube',title:scene.title,body:'关注的节目更新了。'};if(scene.app==='photos')return{from:'照片',title:'照片',body:'相簿已更新。'};if(scene.app==='forum')return{from:'커뮤니티',title:scene.title,body:'有新的帖子，轻点查看。'};if(scene.app==='cafe')return{from:'Daum Café',title:scene.title,body:'收藏的话题有新内容，轻点查看。'};if(scene.app==='theqoo')return{from:'theqoo',title:scene.title,body:'收藏的话题有新内容，轻点查看。'};if(scene.app==='files')return{from:'文件',title:scene.filename||scene.title,body:'一份新的节目文件可供查看。'};return{from:'TVING',title:sourceLabel(scene),body:scene.kind==='interview'?'一段采访记录已经到达。':scene.kind==='montage'?'新的预告已更新。':'《换乘恋爱》有一段新的记录。'};}
export function forumParts(s:Scene){return s.app==='instiz'?parseInstiz(s.body):forumSource(s)==='theqoo'?parseTheqoo(s.body):parseNeutral(s.body)}

export function sourceLabel(scene:Scene){return scene.app==='tving'?(scene.speaker?scene.speaker+' · 采访':CHAPTERS[scene.chapter-1].title):scene.app==='photos'?'照片':scene.title;}

export function chapterLabel(chapter:number){return chapter===12?'外传·下':chapter===11?'外传·上':chapter===10?'完结篇':`第${chapter}章`;}
