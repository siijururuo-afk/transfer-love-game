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
