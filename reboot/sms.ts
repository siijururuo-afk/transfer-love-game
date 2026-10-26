import type{Scene}from'./model';
export type SmsContact='production'|'x'|'yohan';
export const SMS_CONTACTS:Record<SmsContact,{name:string;note:string}>={production:{name:'换乘恋爱 制作组',note:'节目通知与选择结果'},x:{name:'X',note:'个人心意 · 节目匿名转达'},yohan:{name:'金曜汉',note:'个人心意 · 节目匿名转达'}};
export type SmsMessage={contact:SmsContact;text:string;source:string;index:number;id:string};
export function smsParts(scene:Scene,index:number):SmsMessage[]{const make=(contact:SmsContact,text:string,n:number):SmsMessage=>({contact,text,source:contact==='production'?'节目组通知':'节目匿名转达',index,id:`${scene.id}-${n}`});
 switch(scene.id){
 case'c5-first-x-text':return[make('x','别哭。',0),make('production','你的 X 选择了你。',1)];
 case'c6-received-texts':return[make('yohan','哥！以后我会让你笑很多的。',0),make('x','如果要放弃我，就慢慢放弃吧。',1),make('production','你的 X 选择了你。',2)];
 case'c7-wooseok-text':return[make('yohan','现在别再哭了！我有信心让你笑ㅎ。',0),make('production','你的 X 没有选择你。\n\n你的 X 选择了男嘉宾3。',1)];
 case'c8-wooseok-received':return[make('yohan','哥已经尽了全力，现在别再太难受。这段时间，真的辛苦了。在外面，也想见哥。',0),make('x','我现在已经没有为你流泪的资格，可看到你哭，心里还是不好受。别哭。',1),make('production','你的 X 选择了你。',2)];
 default:return[make('production',scene.body,0)];
 }}
export function smsDefaultContact(scene:Scene):SmsContact{const parts=smsParts(scene,0);return parts.find(p=>p.contact==='x')?.contact||parts[0].contact;}
