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
