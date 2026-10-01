import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';

const latestRun = JSON.parse(await readFile('data/latest-run.json', 'utf8'));

const result = spawnSync(
  'npx',
  [
    'remotion',
    'render',
    'src/index.ts',
    'DailyEnglishReading',
    latestRun.videoPath,
    `--props=${latestRun.readingPath}`,
  ],
  {
    stdio: 'inherit',
  },
);

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Video: ${latestRun.videoPath}`);
console.log(`Post caption: ${latestRun.captionPath}`);
console.log(`Japanese translation: ${latestRun.translationJaPath}`);
