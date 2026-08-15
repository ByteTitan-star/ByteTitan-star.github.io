const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');

const tracks = path.join(process.cwd(), 'public', 'audio', 'tracks');
const files = fs.readdirSync(tracks).filter((f) => f.toLowerCase().endsWith('.flac'));

if (!ffmpeg || !fs.existsSync(ffmpeg)) {
  console.error('ffmpeg-static binary missing');
  process.exit(1);
}

let failed = 0;
for (const file of files) {
  const input = path.join(tracks, file);
  const output = path.join(tracks, `${path.basename(file, path.extname(file))}.mp3`);
  console.log(`converting ${file} -> ${path.basename(output)}`);
  const result = spawnSync(
    ffmpeg,
    ['-y', '-hide_banner', '-loglevel', 'error', '-i', input, '-codec:a', 'libmp3lame', '-b:a', '160k', '-ar', '44100', '-ac', '2', output],
    { encoding: 'utf8' }
  );
  if (result.status !== 0 || !fs.existsSync(output)) {
    failed += 1;
    console.error('FAIL', file, result.stderr || result.error);
    continue;
  }
  const mb = (fs.statSync(output).size / 1024 / 1024).toFixed(1);
  console.log(`OK ${path.basename(output)} ${mb}MB`);
}

process.exit(failed ? 1 : 0);
