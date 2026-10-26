import chapter from './chapter01.json';
import chapter2 from './chapter02.json';
import chapter3 from './chapter03.json';
import chapter4 from './chapter04.json';
import chapter5 from './chapter05.json';
import chapter6 from './chapter06.json';
import chapter7 from './chapter07.json';
import chapter8 from './chapter08.json';
export type StoryApp='tving'|'cafe'|'theqoo'|'files'|'messages'|'chat'|'youtube'|'photos';
export type AppId=StoryApp|'safari'|'messages'|'kakao'|'x'|'instagram'|'photos'|'notes'|'music'|'settings'|'phone'|'calendar'|'clock';
export interface Scene{id:string;app:StoryApp;title:string;body:string;kind:string;chapter:number;pictures?:{src:string;caption:string;original:string;width?:number;height?:number}[];count?:string;author?:string;media?:string[];filename?:string;speaker?:string;subtitle?:string;note?:string;parent?:string}
export const CHAPTER=chapter;
export const SCENES=[...chapter.scenes.map(s=>({...s,chapter:1})),...chapter2.scenes,...chapter3.scenes,...chapter4.scenes,...chapter5.scenes,...chapter6.scenes,...chapter7.scenes,...chapter8.scenes].map(s=>({...s,app:s.app==='theqoo'&&!/^\d+\. 无名的德库/m.test(s.body)?'cafe':s.app})) as Scene[];
export const CHAPTERS=[chapter,chapter2,chapter3,chapter4,chapter5,chapter6,chapter7,chapter8];
export const APPS:Record<AppId,{name:string,color:string}>= {
 cafe:{name:'Daum Café',color:'#eb5734'},chat:{name:'Talking Room',color:'#354257'},youtube:{name:'YouTube',color:'#ff2525'},
 tving:{name:'TVING',color:'#ff153c'},theqoo:{name:'theqoo',color:'#ba1837'},files:{name:'文件',color:'#1488ff'},safari:{name:'Safari',color:'#1e96ef'},messages:{name:'信息',color:'#40ca58'},kakao:{name:'KakaoTalk',color:'#fee500'},x:{name:'X',color:'#111'},instagram:{name:'Instagram',color:'#f25379'},photos:{name:'照片',color:'#f38d83'},notes:{name:'备忘录',color:'#dfb649'},music:{name:'Melon',color:'#f3375f'},settings:{name:'设置',color:'#81848c'},phone:{name:'电话',color:'#31c454'},calendar:{name:'日历',color:'#fc463f'},clock:{name:'时钟',color:'#17171b'}
};
export const HOME_APPS:AppId[]=['photos','calendar','clock','files','tving','theqoo','x','instagram','kakao','notes','music','settings'];
export const DOCK:AppId[]=['phone','safari','messages','kakao'];
export const FOLDERS:{id:string;name:string;apps:AppId[]}[]=[{id:'photos',name:'사진',apps:['photos']},{id:'productivity',name:'생산성',apps:['files','notes','chat','calendar','clock','settings']},{id:'video',name:'사진 및 비디오',apps:['tving','instagram']},{id:'community',name:'커뮤니티',apps:['theqoo','cafe','x']}];
export interface Save{cursor:number;saved:string[];liked:string[];font:number;reduced:boolean;finished:boolean;storyVersion?:number}
const KEY='transit-rewritten-chapter-one-v1';
export function readSave():Save{try{const d=JSON.parse(localStorage.getItem(KEY)||'{}');const cursor=Math.max(0,Math.min(SCENES.length-1,Number(d.cursor)||0));const resume=!!d.finished&&cursor<SCENES.length-1&&SCENES[cursor].chapter!==SCENES[cursor+1].chapter;return{cursor:resume?cursor+1:cursor,saved:Array.isArray(d.saved)?d.saved.filter((id:string)=>SCENES.some(s=>s.id===id)):[],liked:Array.isArray(d.liked)?d.liked:[],font:[.9,1,1.12].includes(d.font)?d.font:1,reduced:!!d.reduced,finished:!!d.finished&&!resume,storyVersion:8};}catch{return{cursor:0,saved:[],liked:[],font:1,reduced:false,finished:false,storyVersion:8};}}
export function writeSave(s:Save){try{localStorage.setItem(KEY,JSON.stringify({...s,storyVersion:8}));}catch{/* Storage may be unavailable in private mode. */}}
export function unlocked(app:AppId,cursor:number){return SCENES.map((s,index)=>({...s,index})).filter(s=>s.app===app&&s.index<=cursor).reverse();}
export function nextState(save:Save,sceneIndex:number){if(sceneIndex!==save.cursor||save.finished)return save;return sceneIndex===SCENES.length-1?{...save,finished:true}:{...save,cursor:save.cursor+1};}
export function noticeFor(scene:Scene){if(scene.app==='messages')return{from:'信息',title:scene.title,body:'换乘恋爱 制作组发来一条信息。'};if(scene.app==='chat')return{from:'Talking Room',title:'X',body:'可以开始对话了。'};if(scene.app==='youtube')return{from:'YouTube',title:scene.title,body:'关注的节目更新了。'};if(scene.app==='photos')return{from:'照片',title:'照片',body:'相簿已更新。'};if(scene.app==='cafe')return{from:'Daum Café',title:scene.title,body:'收藏的话题有新内容，轻点查看。'};if(scene.app==='theqoo')return{from:'theqoo',title:scene.title,body:'收藏的话题有新内容，轻点查看。'};if(scene.app==='files')return{from:'文件',title:scene.filename||scene.title,body:'一份新的节目文件可供查看。'};return{from:'TVING',title:sourceLabel(scene),body:scene.kind==='interview'?'一段采访记录已经到达。':scene.kind==='montage'?'新的预告已更新。':'《换乘恋爱》有一段新的记录。'};}
export function forumParts(s:Scene){const lines=s.body.split('\n');const at=lines.findIndex(l=>/^\s*↳|^\d+\. 无名的德库/.test(l));if(at<0)return{post:s.body,comments:[] as{by:string;text:string,nested:boolean}[]};const post=lines.slice(0,at).join('\n').trim(),comments:{by:string;text:string,nested:boolean}[]=[];let numbered:{by:string;text:string,nested:boolean}|null=null;for(const l of lines.slice(at)){if(/^\d+\. 无名的德库/.test(l)){if(numbered)comments.push(numbered);numbered={by:l,text:'',nested:false};}else if(/^\s*↳/.test(l)){if(numbered){comments.push(numbered);numbered=null;}comments.push({by:'无名的德库',text:l.replace(/^\s*↳\s*/,''),nested:/^[　\s]+↳/.test(l)});}else if(numbered){numbered.text+=(numbered.text?'\n':'')+l;}else if(l.trim()&&comments.length){comments[comments.length-1].text+='\n'+l;}}if(numbered)comments.push(numbered);return{post,comments:comments.filter(c=>c.text.trim())};}

export function sourceLabel(scene:Scene){return scene.app==='tving'?(scene.speaker?scene.speaker+' · 采访':CHAPTERS[scene.chapter-1].title):scene.app==='photos'?'照片':scene.title;}
