import type{Scene}from'./model';
// Explicit source evidence only. Unknown scenes retain their original app IDs for save compatibility.
export const FORUM_EVIDENCE:Record<string,{platform:'theqoo'|'instiz'|'cafe';evidence:string}>={
 'e2-marriage-post':{platform:'instiz',evidence:'Provided Korean text uses 익인1–익인5.'},
 'e2-last-words-post':{platform:'theqoo',evidence:'Provided Korean text explicitly labels 무명의 더쿠.'}
};
export function forumSource(scene:Scene):'theqoo'|'instiz'|'cafe'|'unknown'{return FORUM_EVIDENCE[scene.id]?.platform||'unknown'}
