import fs from 'node:fs';
import assert from 'node:assert/strict';
const data=JSON.parse(fs.readFileSync('reboot/chapter01.json','utf8'));
const text=fs.readFileSync('reboot/public/chapter-01-translation.txt','utf8');
assert.equal(data.scenes.length,23);
assert.equal(new Set(data.scenes.map(s=>s.id)).size,23);
assert.equal(data.author,'샛별');
for(const s of data.scenes){assert(s.body.trim()&&s.title.trim());assert(['tving','theqoo','files'].includes(s.app));for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text.includes(line),`translation export missing: ${s.id}: ${line}`);}
assert.equal(data.scenes.find(s=>s.body.includes('你的 X 没有选择你')).kind,'montage');
assert.equal(data.scenes.find(s=>s.id==='wooseok-letter').app,'files');
assert.equal(data.scenes.find(s=>s.id==='seungyoun-letter-post').app,'theqoo');
assert(data.scenes.find(s=>s.id==='x-reveal').body.includes('19.08.27～22.02.08'));
assert(data.scenes.find(s=>s.id==='x-reveal').body.includes('22.07.18～23.06.30'));
const entry=fs.readFileSync('index.html','utf8');assert(entry.includes('/reboot/main.tsx'));assert(!entry.includes('/src/main.tsx'));
for(const file of fs.readdirSync('reboot').filter(f=>/\.[jt]sx?$/.test(f))){assert(!/from\s*['"]\.\.\/src\//.test(fs.readFileSync(`reboot/${file}`,'utf8')),`legacy source import ${file}`);}
assert(!fs.readFileSync('reboot/phone.css','utf8').includes('@import'));
console.log(JSON.stringify({chapter:1,scenes:data.scenes.length,exportedCharacters:text.length,apps:[...new Set(data.scenes.map(s=>s.app))],legacyImports:0,result:'PASS'}));
const second=JSON.parse(fs.readFileSync('reboot/chapter02.json','utf8'));
const text2=fs.readFileSync('reboot/public/chapter-02-translation.txt','utf8');
assert.equal(second.scenes.length,37);
assert.equal(new Set([...data.scenes,...second.scenes].map(s=>s.id)).size,60);
for(const s of second.scenes){assert(s.chapter===2&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text2.includes(line),`missing chapter2 export ${s.id}: ${line}`);}
assert.equal(second.scenes.find(s=>s.id==='c2-seungyoun-messages').app,'tving');
assert.equal(second.scenes.find(s=>s.id==='c2-x-not-selected').app,'messages');
const pictures=second.scenes.at(-1).pictures;assert.equal(pictures.length,4);for(const p of pictures)assert(fs.existsSync('reboot/public/'+p.src.replace('./','')));
assert(!fs.readFileSync('reboot/phone.tsx','utf8').includes('读完帖子，继续剧情'));
assert.equal(fs.readdirSync('audio-parts').filter(f=>f.startsWith('sun-or-suck.')).length,27);
console.log(JSON.stringify({chapter:2,scenes:37,exportedCharacters:text2.length,photos:pictures.length,totalScenes:60,result:'PASS'}));
const third=JSON.parse(fs.readFileSync('reboot/chapter03.json','utf8'));
const text3=fs.readFileSync('reboot/public/chapter-03-translation.txt','utf8');
assert.equal(third.scenes.length,25);const all=[...data.scenes,...second.scenes,...third.scenes];assert.equal(new Set(all.map(s=>s.id)).size,85);
for(const s of third.scenes){assert(s.chapter===3&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text3.includes(line),`missing chapter3 export ${s.id}: ${line}`)}
assert.equal(third.scenes[0].app,'theqoo');assert.equal(third.scenes.at(-1).app,'photos');assert.equal(third.scenes.filter(s=>s.app==='messages').length,0); // Other people's texts appear only in quoted forum reports in this chapter.
assert.equal(third.scenes.filter(s=>s.app==='files').length,2);
const photos3=third.scenes.at(-1).pictures;assert.deepEqual(photos3.map(p=>p.original),['한강 산책','프랑스 여행','승연 연습실 놀러갔을 때','우석이 대본연습 도와줄 때']);for(const p of photos3)assert(fs.existsSync('reboot/public/'+p.src.replace('./','')));
assert(third.scenes.find(s=>s.id==='c3-timeline-post').body.includes('22年2月'));assert(third.scenes.find(s=>s.id==='c3-timeline-post').body.includes('23年6月'));
console.log(JSON.stringify({chapter:3,scenes:25,exportedCharacters:text3.length,photos:photos3.length,totalScenes:all.length,result:'PASS'}));
const fourth=JSON.parse(fs.readFileSync('reboot/chapter04.json','utf8'));
const text4=fs.readFileSync('reboot/public/chapter-04-translation.txt','utf8');const fourChapters=[...all,...fourth.scenes];
assert.equal(fourth.scenes.length,28);assert.equal(new Set(fourChapters.map(s=>s.id)).size,113);
for(const s of fourth.scenes){assert(s.chapter===4&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text4.includes(line),`missing chapter4 export ${s.id}: ${line}`)}
assert.equal(fourth.scenes.filter(s=>s.app==='messages').length,1);assert.equal(fourth.scenes.find(s=>s.id==='c4-x-room-open-sms').app,'messages');assert(fourth.scenes.find(s=>s.id==='c4-next-preview').body.includes('你的 X 选择了你'));assert.equal(fourth.scenes.find(s=>s.id==='c4-next-preview').app,'tving');
assert.equal(fourth.scenes.find(s=>s.id==='c4-seungyoun-diary').app,'tving');assert.equal(fourth.scenes.find(s=>s.id==='c4-wooseok-diary').app,'tving');assert(!fourth.authorNote);assert(!text4.includes("作者附言"));
const photos4=fourth.scenes.at(-1).pictures;assert.equal(photos4.length,5);assert.deepEqual(photos4.map(p=>p.original),['첫 생일 축하','보드타러 간 날','따따와 함께한 산책','승연이 콘서트 보러 간 날 올라온 사진','심통난 우석이']);for(const p of photos4){assert(p.width>0&&p.height>0);assert(fs.existsSync('reboot/public/'+p.src.replace('./','')))}
console.log(JSON.stringify({chapter:4,scenes:28,exportedCharacters:text4.length,photos:photos4.length,totalScenes:fourChapters.length,result:'PASS'}));

const fifth=JSON.parse(fs.readFileSync('reboot/chapter05.json','utf8')),text5=fs.readFileSync('reboot/public/chapter-05-translation.txt','utf8');
const fiveChapters=[...fourChapters,...fifth.scenes];assert.equal(fifth.scenes.length,35);assert.equal(new Set(fiveChapters.map(s=>s.id)).size,148);
for(const s of fifth.scenes){assert(s.chapter===5&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text5.includes(line),`missing chapter5 export ${s.id}: ${line}`)}
assert.equal(fifth.scenes.filter(s=>s.app==='messages').length,2);assert.equal(fifth.scenes.find(s=>s.id==='c5-first-x-text').app,'messages');assert.equal(fifth.scenes.find(s=>s.id==='c5-mutual-texts').app,'tving');assert.equal(fifth.scenes.find(s=>s.id==='c5-seungyoun-notice').app,'tving');assert.equal(fifth.scenes.find(s=>s.id==='c5-next-preview').app,'tving');assert.equal(fifth.scenes.filter(s=>s.app==='chat').length,2);
assert(!fifth.authorNote);for(const phrase of ['为了剧情节奏','谢谢阅读','篇幅控制失败'])assert(!text5.includes(phrase));
const photos5=fifth.scenes.at(-1).pictures;assert.equal(photos5.length,5);assert.deepEqual(photos5.map(p=>p.original),['해외 여행 갔을 때','친구들과 함께 한 술자리','촬영하다 승연에게 보내준 사진','일본 여행 갔을 때','우석의 집에서 잠든 승연']);for(const p of photos5){assert(p.width>0&&p.height>0);assert(fs.existsSync('reboot/public/'+p.src.replace('./','')))}
assert(fs.readFileSync('reboot/phone.tsx','utf8').includes('下载第五章完整译文'));assert(!fs.readFileSync('reboot/phone.tsx','utf8').includes('authorNote'));
console.log(JSON.stringify({chapter:5,scenes:35,exportedCharacters:text5.length,photos:photos5.length,totalScenes:fiveChapters.length,result:'PASS'}));

const sixth=JSON.parse(fs.readFileSync('reboot/chapter06.json','utf8')),text6=fs.readFileSync('reboot/public/chapter-06-translation.txt','utf8');
const sixChapters=[...fiveChapters,...sixth.scenes];assert.equal(sixth.scenes.length,32);assert.equal(new Set(sixChapters.map(s=>s.id)).size,180);
for(const s of sixth.scenes){assert(s.chapter===6&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text6.includes(line),`missing chapter6 export ${s.id}: ${line}`)}
assert.equal(sixth.scenes.filter(s=>s.app==='messages').length,2);assert.equal(sixth.scenes.find(s=>s.id==='c6-seungyoun-unselected').app,'tving');assert.equal(sixth.scenes.find(s=>s.id==='c6-received-texts').app,'messages');assert.equal(sixth.scenes.find(s=>s.id==='c6-jeju-invitation').app,'files');assert.equal(sixth.scenes.find(s=>s.id==='c6-next-preview').app,'tving');assert(!sixth.authorNote);
const photos6=sixth.scenes.at(-1).pictures;assert.deepEqual(photos6.map(p=>p.original),['따따와 놀 때','작업실 이사가던 날','제주도 갔을 때','승연이 제일 좋아하는 우석의 셀카','즉흥적으로 밤바다 보러 간 날']);assert.equal(photos6[0].width,706);assert.equal(photos6[0].height,707);for(const p of photos6){assert(p.width>0&&p.height>0);assert(fs.existsSync('reboot/public/'+p.src.replace('./','')))}
assert(fs.readFileSync('reboot/phone.tsx','utf8').includes('下载第六章完整译文'));
console.log(JSON.stringify({chapter:6,scenes:32,exportedCharacters:text6.length,photos:photos6.length,totalScenes:sixChapters.length,result:'PASS'}));

const seventh=JSON.parse(fs.readFileSync('reboot/chapter07.json','utf8')),text7=fs.readFileSync('reboot/public/chapter-07-translation.txt','utf8');
const sevenChapters=[...sixChapters,...seventh.scenes];assert.equal(seventh.scenes.length,33);assert.equal(new Set(sevenChapters.map(s=>s.id)).size,213);
for(const s of seventh.scenes){assert(s.chapter===7&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text7.includes(line),`missing chapter7 export ${s.id}: ${line}`)}
assert.equal(seventh.scenes.filter(s=>s.app==='messages').length,2);assert.equal(seventh.scenes.find(s=>s.id==='c7-seungyoun-text').app,'tving');assert.equal(seventh.scenes.find(s=>s.id==='c7-wooseok-text').app,'messages');assert.equal(seventh.scenes.find(s=>s.id==='c7-date-invitation').app,'files');assert.equal(seventh.scenes.find(s=>s.id==='c7-next-preview').app,'tving');assert(!seventh.authorNote);
const photos7=seventh.scenes.at(-1).pictures;assert.deepEqual(photos7.map(p=>p.original),['해외 여행 중 길거리 음식먹기','똥개 조승연','승연이가 두 번째로 좋아하는 셀카','카페 데이트 때 승연이 찍어준 사진','우석이 술 마시고 뻗은 날']);for(const p of photos7){assert(p.width>0&&p.height>0);assert(fs.existsSync('reboot/public/'+p.src.replace('./','')))}
assert.equal(seventh.referenceVideo.id,'9QjQlnoFq_8');assert(text7.includes(seventh.referenceVideo.url));assert(fs.readFileSync('reboot/youtube.tsx','utf8').includes(seventh.referenceVideo.id));assert(fs.readFileSync('reboot/phone.tsx','utf8').includes('下载第七章完整译文'));
console.log(JSON.stringify({chapter:7,scenes:33,exportedCharacters:text7.length,photos:photos7.length,totalScenes:sevenChapters.length,result:'PASS'}));

const eighth=JSON.parse(fs.readFileSync('reboot/chapter08.json','utf8')),text8=fs.readFileSync('reboot/public/chapter-08-translation.txt','utf8');
const eightChapters=[...sevenChapters,...eighth.scenes];assert.equal(eighth.scenes.length,36);assert.equal(new Set(eightChapters.map(s=>s.id)).size,249);
for(const s of eighth.scenes){assert(s.chapter===8&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text8.includes(line),`missing chapter8 export ${s.id}: ${line}`)}
assert.equal(eighth.scenes.filter(s=>s.app==='messages').length,2);assert.equal(eighth.scenes.find(s=>s.id==='c8-seungyoun-received').app,'tving');assert.equal(eighth.scenes.find(s=>s.id==='c8-wooseok-received').app,'messages');assert.equal(eighth.scenes.filter(s=>s.app==='files').length,2);assert.equal(eighth.scenes.find(s=>s.id==='c8-next-preview').app,'tving');assert(!eighth.authorNote);
const photos8=eighth.scenes.at(-1).pictures;assert.deepEqual(photos8.map(p=>p.original),['빙어낚시','한강산책','두번째 생일축하','남친 따라 간 헬스장','우석이 생일상 차리기']);for(const p of photos8){assert(p.width>0&&p.height>0);assert(fs.existsSync('reboot/public/'+p.src.replace('./','')))}
assert(fs.readFileSync('reboot/phone.tsx','utf8').includes('下载第八章完整译文'));
console.log(JSON.stringify({chapter:8,scenes:36,exportedCharacters:text8.length,photos:photos8.length,totalScenes:eightChapters.length,result:'PASS'}));

const ninth=JSON.parse(fs.readFileSync('reboot/chapter09.json','utf8')),text9=fs.readFileSync('reboot/public/chapter-09-translation.txt','utf8');
const nineChapters=[...eightChapters,...ninth.scenes];assert.equal(ninth.scenes.length,26);assert.equal(new Set(nineChapters.map(s=>s.id)).size,275);
for(const s of ninth.scenes){assert(s.chapter===9&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text9.includes(line),`missing chapter9 export ${s.id}: ${line}`);if(s.app==='tving')assert.equal(s.title,ninth.title);}
assert.equal(ninth.scenes.filter(s=>s.app==='messages').length,2);assert.equal(ninth.scenes.find(s=>s.id==='c9-secret-date-invitation').app,'messages');assert.equal(ninth.scenes.find(s=>s.id==='c9-secret-date-matched').app,'messages');assert(ninth.scenes.find(s=>s.id==='c9-parting').body.includes('曹承衍先生与男嘉宾3'));assert.equal(ninth.scenes.find(s=>s.id==='c9-next-preview').app,'tving');assert(!ninth.authorNote);assert(text9.includes(ninth.readingNote));
const photos9=ninth.scenes.at(-1).pictures;assert.deepEqual(photos9.map(p=>p.original),['승연의 카톡 프사였던 것','늦은 밤 석촌호수 산책','우석이 집 가는 길','즉흥으로 떠난 겨울 바다','승연과의 영상통화 중']);for(const p of photos9){assert(p.width>0&&p.height>0);assert(fs.existsSync('reboot/public/'+p.src.replace('./','')))}
assert(fs.readFileSync('reboot/phone.tsx','utf8').includes('下载第九章完整译文'));
console.log(JSON.stringify({chapter:9,scenes:26,exportedCharacters:text9.length,photos:photos9.length,totalScenes:nineChapters.length,result:'PASS'}));

const finale=JSON.parse(fs.readFileSync('reboot/chapter10.json','utf8')),text10=fs.readFileSync('reboot/public/chapter-10-translation.txt','utf8');
const tenChapters=[...nineChapters,...finale.scenes];assert.equal(finale.scenes.length,39);assert.equal(new Set(tenChapters.map(s=>s.id)).size,314);
for(const s of finale.scenes){assert(s.chapter===10&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text10.includes(line),`missing finale export ${s.id}: ${line}`);if(s.app==='tving')assert.equal(s.title,finale.title);}
assert.equal(finale.scenes.filter(s=>s.app==='messages').length,3);assert.equal(finale.scenes.find(s=>s.id==='c10-x-coming').app,'messages');assert.equal(finale.scenes.find(s=>s.id==='c10-wooseok-final-instructions').app,'messages');assert.equal(finale.scenes.find(s=>s.id==='c10-yohan-calls').app,'tving');assert.equal(finale.scenes.filter(s=>s.app==='x').length,2);const meme=finale.scenes.find(s=>s.id==='c10-samijo-tweet');assert.equal(meme.posted,'23分钟前');assert(fs.existsSync('reboot/public/'+meme.attachment.src.replace('./','')));assert(!finale.scenes.find(s=>s.id==='c10-signblue-tweet').attachment);
const photos10=finale.scenes.find(s=>s.id==='c10-and-now-memories').pictures;assert.deepEqual(photos10.map(p=>p.original),['둘이 함께 찍은 인생네컷','승석 셀카','지인이 찍어준 커플 에어팟 착용 사진','작업실에 다시 놀러 간 우석이 찍어준 승연','우석과의 데이트 도중','승석 투샷','우석이가 찍어주는 승연']);for(const p of photos10){assert(p.width>0&&p.height>0);assert(fs.existsSync('reboot/public/'+p.src.replace('./','')))}assert(!photos10.some(p=>p.src.includes('samijo')));assert.equal(finale.scenes.at(-1).id,'c10-beautiful-together-post');assert(text10.includes(finale.afterword));assert(fs.readFileSync('reboot/phone.tsx','utf8').includes('下载完结篇完整译文'));
console.log(JSON.stringify({chapter:10,scenes:39,exportedCharacters:text10.length,photos:photos10.length,tweetAttachment:1,totalScenes:tenChapters.length,result:'PASS'}));

const epilogue=JSON.parse(fs.readFileSync('reboot/chapter11.json','utf8')),text11=fs.readFileSync('reboot/public/chapter-11-translation.txt','utf8');
const withEpilogue=[...tenChapters,...epilogue.scenes];assert.equal(epilogue.scenes.length,23);assert.equal(new Set(withEpilogue.map(s=>s.id)).size,337);
for(const s of epilogue.scenes){assert(s.chapter===11&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text11.includes(line),`missing epilogue export ${s.id}: ${line}`);if(s.app==='tving')assert.equal(s.title,epilogue.title);}
assert.equal(epilogue.scenes.filter(s=>s.app==='messages').length,0);assert.equal(epilogue.scenes.filter(s=>s.kind==='qna').length,4);for(const s of epilogue.scenes.filter(s=>s.kind==='qna'))assert.equal(s.channelName,'일단승석');assert(!epilogue.scenes.some(s=>s.pictures));const story=epilogue.scenes.find(s=>s.id==='e1-question-story');assert.equal(story.kind,'story');assert.equal(story.app,'instagram');assert(fs.existsSync('reboot/public/'+story.attachment.src.replace('./','')));assert(story.attachment.width>0&&story.attachment.height>0);assert.equal(epilogue.scenes[1].id,story.id);assert.equal(epilogue.scenes.at(-1).id,'e1-live-announcement-post');assert(text11.includes(epilogue.preface));assert(text11.includes(epilogue.afterword));assert(text11.includes(epilogue.readingNote));assert(fs.readFileSync('reboot/phone.tsx','utf8').includes('下载外传上完整译文'));
console.log(JSON.stringify({chapter:11,scenes:23,exportedCharacters:text11.length,qnaSections:4,instagramStory:1,totalScenes:withEpilogue.length,result:'PASS'}));

const epilogue2=JSON.parse(fs.readFileSync('reboot/chapter12.json','utf8')),text12=fs.readFileSync('reboot/public/chapter-12-translation.txt','utf8');
const fullStory=[...withEpilogue,...epilogue2.scenes];assert.equal(epilogue2.scenes.length,19);assert.equal(new Set(fullStory.map(s=>s.id)).size,356);
for(const s of epilogue2.scenes){assert(s.chapter===12&&s.body.trim()&&s.title.trim());for(const line of s.body.split('\n').filter(x=>x.trim()))assert(text12.includes(line),`missing epilogue2 export ${s.id}: ${line}`);if(s.app==='tving')assert.equal(s.title,epilogue2.title);}
assert.equal(epilogue2.scenes.filter(s=>s.app==='messages').length,0);assert.equal(epilogue2.scenes.filter(s=>s.kind==='live-qna').length,7);assert.equal(epilogue2.scenes.filter(s=>s.app==='instiz').length,1);assert(!epilogue2.scenes.some(s=>s.pictures||s.attachment));assert.equal(epilogue2.scenes.at(-1).id,'e2-last-words-post');assert(text12.includes(epilogue2.preface));assert(text12.includes(epilogue2.afterword));assert(fs.readFileSync('reboot/phone.tsx','utf8').includes('下载外传下完整译文'));
console.log(JSON.stringify({chapter:12,scenes:19,exportedCharacters:text12.length,liveSections:7,totalScenes:fullStory.length,result:'PASS'}));
