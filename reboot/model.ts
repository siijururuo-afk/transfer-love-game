import chapter from './chapter01.json';
export type StoryApp='tving'|'theqoo'|'files';
export type AppId=StoryApp|'safari'|'messages'|'kakao'|'x'|'instagram'|'photos'|'notes'|'music'|'settings'|'phone'|'calendar'|'clock';
export interface Scene{id:string;app:StoryApp;title:string;body:string;kind:string;count?:string;author?:string;media?:string[];filename?:string;speaker?:string;subtitle?:string;note?:string;parent?:string}
export const CHAPTER=chapter;
export const SCENES=chapter.scenes as Scene[];
export const APPS:Record<AppId,{name:string,color:string}>= {
 tving:{name:'TVING',color:'#ff153c'},theqoo:{name:'theqoo',color:'#ba1837'},files:{name:'文件',color:'#1488ff'},safari:{name:'Safari',color:'#1e96ef'},messages:{name:'信息',color:'#40ca58'},kakao:{name:'KakaoTalk',color:'#fee500'},x:{name:'X',color:'#111'},instagram:{name:'Instagram',color:'#f25379'},photos:{name:'照片',color:'#f38d83'},notes:{name:'备忘录',color:'#dfb649'},music:{name:'音乐',color:'#f3375f'},settings:{name:'设置',color:'#81848c'},phone:{name:'电话',color:'#31c454'},calendar:{name:'日历',color:'#fc463f'},clock:{name:'时钟',color:'#17171b'}
};
export const HOME_APPS:AppId[]=['photos','calendar','clock','files','tving','theqoo','x','instagram','kakao','notes','music','settings'];
export const DOCK:AppId[]=['phone','safari','messages'];
export interface Save{cursor:number;saved:string[];liked:string[];font:number;reduced:boolean;finished:boolean}
const KEY='transit-rewritten-chapter-one-v1';
export function readSave():Save{try{const d=JSON.parse(localStorage.getItem(KEY)||'{}');return{cursor:Math.max(0,Math.min(SCENES.length-1,Number(d.cursor)||0)),saved:Array.isArray(d.saved)?d.saved.filter((id:string)=>SCENES.some(s=>s.id===id)):[],liked:Array.isArray(d.liked)?d.liked:[],font:[.9,1,1.12].includes(d.font)?d.font:1,reduced:!!d.reduced,finished:!!d.finished};}catch{return{cursor:0,saved:[],liked:[],font:1,reduced:false,finished:false};}}
export function writeSave(s:Save){try{localStorage.setItem(KEY,JSON.stringify(s));}catch{/* Storage may be unavailable in private mode. */}}
export function unlocked(app:AppId,cursor:number){return SCENES.map((s,index)=>({...s,index})).filter(s=>s.app===app&&s.index<=cursor).reverse();}
export function nextState(save:Save,sceneIndex:number){if(sceneIndex!==save.cursor||save.finished)return save;return sceneIndex===SCENES.length-1?{...save,finished:true}:{...save,cursor:save.cursor+1};}
export function noticeFor(scene:Scene){if(scene.app==='theqoo')return{from:'theqoo',title:scene.title,body:'收藏的话题有新内容，轻点查看。'};if(scene.app==='files')return{from:'文件',title:scene.filename||scene.title,body:'一份新的节目文件可供查看。'};return{from:'TVING',title:scene.title,body:scene.kind==='interview'?'一段采访记录已经到达。':scene.kind==='montage'?'新的预告已更新。':'《换乘恋爱》有一段新的记录。'};}
export function forumParts(s:Scene){const lines=s.body.split('\n');const at=lines.findIndex(l=>/^\s*↳|^\d+\. 无名的德库/.test(l));if(at<0)return{post:s.body,comments:[] as{by:string;text:string,nested:boolean}[]};const post=lines.slice(0,at).join('\n').trim(),comments:{by:string;text:string,nested:boolean}[]=[];let numbered:{by:string;text:string,nested:boolean}|null=null;for(const l of lines.slice(at)){if(/^\d+\. 无名的德库/.test(l)){if(numbered)comments.push(numbered);numbered={by:l,text:'',nested:false};}else if(/^\s*↳/.test(l)){if(numbered){comments.push(numbered);numbered=null;}comments.push({by:'无名的德库',text:l.replace(/^\s*↳\s*/,''),nested:/^[　\s]+↳/.test(l)});}else if(numbered){numbered.text+=(numbered.text?'\n':'')+l;}}if(numbered)comments.push(numbered);return{post,comments:comments.filter(c=>c.text.trim())};}
