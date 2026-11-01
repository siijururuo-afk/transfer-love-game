import type{Scene}from'./model';
// Attributed only when the Korean HTML explicitly identifies the platform.
export const FORUM_EVIDENCE:Record<string,{platform:'theqoo'|'instiz'|'cafe';evidence:string}>={
  "rumour": {
    "platform": "theqoo",
    "evidence": "原文第1篇 L5: 무명의더쿠 ㅣ 야 김우석 환승연애 나온다는데?"
  },
  "obvious-x": {
    "platform": "theqoo",
    "evidence": "原文第1篇 L113: 무명의 더쿠 ㅣ 조승연 엑스 누가봐도 김우석 아냐??"
  },
  "c2-nervous": {
    "platform": "theqoo",
    "evidence": "原文第2篇 L30: 무명의 더쿠ㅣ김우석 말 왜 저렇게 하지"
  },
  "c2-zero-vote-post": {
    "platform": "theqoo",
    "evidence": "原文第2篇 L87: 무명의 더쿠ㅣ우석이 0표 ㅁㅊ에바아님?"
  },
  "c3-finger-post": {
    "platform": "theqoo",
    "evidence": "原文第3篇 L64: 무명의 더쿠ㅣ손병호게임으로 알 수 있는 조승연X김우석 연애"
  },
  "c3-jealousy-post": {
    "platform": "theqoo",
    "evidence": "原文第3篇 L183: 무명의 더쿠ㅣ조승연 너 그거 사랑이야 멍청아..."
  },
  "c4-surprise-post": {
    "platform": "theqoo",
    "evidence": "原文第4篇 L61: 무명의 더쿠ㅣ원래 깜짝 데이트를 저렇게 신청하나?"
  },
  "c5-newcomer-profile": {
    "platform": "theqoo",
    "evidence": "原文第5篇 L68: 무명의 더쿠ㅣ연프 제안만 5번 받았다는 환승연애10 메기"
  },
  "c6-breathe-post": {
    "platform": "theqoo",
    "evidence": "原文第6篇 L42: 무명의 더쿠ㅣ환친자들 숨 쉬세요"
  },
  "c6-new-fan-post": {
    "platform": "theqoo",
    "evidence": "原文第6篇 L119: 무명의 더쿠ㅣ나는 어제 승석 입덕했는데"
  },
  "c6-who-judges-post": {
    "platform": "theqoo",
    "evidence": "原文第6篇 L267: 무명의 더쿠ㅣ참나 왜 그걸 자기가 판단하지"
  },
  "c7-crossed-text-post": {
    "platform": "theqoo",
    "evidence": "原文第7篇 L111: 무명의 더쿠ㅣ헐 문자 결과 되게 의외다"
  },
  "c7-tanghulu-post": {
    "platform": "theqoo",
    "evidence": "原文第7篇 L257: 무명의 더쿠ㅣ내가 오늘 어이없는 일을 겪었는데... 원래 탕후루란게 제철이고 수요많은 과일들로 만드는 거 아니야..? 오늘 탕후루 가게에 갔는데 글쎄 승석 탕후루가 없다는거야... 승석만큼 제철인게 어디 있다고... 심지어 계절도 안타서 항상 제철일텐데... 속상한 마음에 글이라도 쓴다..."
  },
  "c8-hope-circuit-post": {
    "platform": "theqoo",
    "evidence": "原文第8篇 L66: 무명의 더쿠ㅣ승석러 행복회로 좀 돌려도 되겠습니까?"
  },
  "c9-refusal-post": {
    "platform": "theqoo",
    "evidence": "原文第9篇 L42: 무명의 더쿠ㅣ왜 내가 다 아깝지"
  },
  "c10-doomed-post": {
    "platform": "theqoo",
    "evidence": "原文第10篇 L47: 무명의 더쿠ㅣㅋㅋ얘들아 진짜 망했다"
  },
  "c10-yohan-come-post": {
    "platform": "theqoo",
    "evidence": "原文第10篇 L270: 무명의 더쿠ㅣ요한아 나한테 와"
  },
  "e1-channel-name-post": {
    "platform": "theqoo",
    "evidence": "原文第11篇 L50: 무명의 더쿠ㅣ근데 승석 채널명 왜 이렇게 구려?"
  },
  "e1-soundcloud-post": {
    "platform": "theqoo",
    "evidence": "原文第11篇 L332: 무명의 더쿠ㅣ조승연 노래 발매했어? 되게 좋다"
  },
  "e2-marriage-post": {
    "platform": "instiz",
    "evidence": "原文第12篇 L118: 익인1 / 익인2 / 익인3 / 익인4 / 익인5"
  },
  "e2-last-words-post": {
    "platform": "theqoo",
    "evidence": "原文第12篇 L308: 무명의 더쿠ㅣ마지막에 한 말 뭔가 감동이지 않아ㅠㅠ?"
  }
};
export function forumSource(scene:Scene):'theqoo'|'instiz'|'cafe'|'unknown'{return FORUM_EVIDENCE[scene.id]?.platform||'unknown'}
