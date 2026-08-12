// Runtime contract check: every block type/subtype has a renderer; no empty text.
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'app', 'src', 'data');
const RENDERER_TYPES = new Set([
  'narrative','dialogue','scene_card','program_task','program_rule','program_notice',
  'letter','sms','interview','observation_room','text_chat','talking_room','x_room',
  'identity_reveal','date_task','finger_game','truth_game','interlude','forum',
  'social_media','media','program_caption','final_choice','epilogue','lyrics','fallback'
]);
let total = 0, empty = 0, badType = 0, typesSeen = new Set(), subtypesSeen = {};
for (let i = 1; i <= 10; i++) {
  const f = path.join(DATA, `chapter-${String(i).padStart(2,'0')}.json`);
  const arr = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const b of arr) {
    total++;
    if (!b.text || !b.text.trim()) empty++;
    if (!RENDERER_TYPES.has(b.type)) { badType++; console.log('BAD TYPE', b.sourceId, b.type); }
    typesSeen.add(b.type);
    if (b.subtype) subtypesSeen[b.type + '/' + b.subtype] = (subtypesSeen[b.type + '/' + b.subtype] || 0) + 1;
  }
}
console.log('total blocks:', total);
console.log('empty text:', empty);
console.log('bad type:', badType);
console.log('types present:', [...typesSeen].sort().join(', '));
console.log('subtypes present:', Object.keys(subtypesSeen).sort().join(', '));
const missing = [...RENDERER_TYPES].filter(t => !typesSeen.has(t));
console.log('renderer types UNUSED in data:', missing.join(', ') || '(none)');
