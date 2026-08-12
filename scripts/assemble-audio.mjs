import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const target = path.join(root, 'public', 'audio', 'sun-or-suck.mp3');
const partsDir = path.join(root, 'audio-parts');

if (!fs.existsSync(target)) {
  const parts = fs.existsSync(partsDir)
    ? fs.readdirSync(partsDir).filter((name) => name.startsWith('sun-or-suck.')).sort()
    : [];
  if (!parts.length) throw new Error('Missing bundled background-audio parts.');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const output = fs.openSync(target, 'w');
  try {
    for (const part of parts) fs.writeSync(output, fs.readFileSync(path.join(partsDir, part)));
  } finally {
    fs.closeSync(output);
  }
}
