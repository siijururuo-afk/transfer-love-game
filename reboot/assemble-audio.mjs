import fs from 'node:fs';import path from 'node:path';
const parts=fs.readdirSync('audio-parts').filter(f=>/^sun-or-suck\.\d+$/.test(f)).sort();
if(!parts.length)throw new Error('The existing Sun or Suck audio parts are missing.');
const target='reboot/public/audio/sun-or-suck.mp3';fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,Buffer.concat(parts.map(p=>fs.readFileSync(path.join('audio-parts',p)))));
console.log('Restored Sun or Suck from '+parts.length+' existing repository parts.');
