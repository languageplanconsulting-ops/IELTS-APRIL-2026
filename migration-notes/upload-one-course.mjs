import fs from 'node:fs';
import path from 'node:path';

const [, , course, fileArg, key] = process.argv;
const LIBRARIES = { speaking: '713546', listening: '713547', reading: '713390', grammar: '714012' };
if (!LIBRARIES[course] || !fileArg || !key) {
  console.error('Usage: node upload-one-course.mjs <speaking|listening|reading> <fileNameInDownloads> <lessonKey>');
  process.exit(1);
}

const envPath = new URL('./.env.local', import.meta.url);
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8').trim().split('\n').filter(Boolean).map((l) => {
    const idx = l.indexOf('=');
    return [l.slice(0, idx), l.slice(idx + 1)];
  })
);

const LIBRARY_ID = LIBRARIES[course];
const API_KEY = env[`BUNNY_${course.toUpperCase()}_API_KEY`];
const BUNNY_IDS_PATH = new URL(`../src/${course}VideoIds.json`, import.meta.url);
const DOWNLOADS_DIR = path.join(process.env.HOME, 'Downloads');
const UPLOAD_TIMEOUT_MS = 60 * 60 * 1000;

function loadJson(url, fallback) {
  try {
    return JSON.parse(fs.readFileSync(url, 'utf8'));
  } catch {
    return fallback;
  }
}
function saveJson(url, data) {
  fs.writeFileSync(url, JSON.stringify(data, null, 2) + '\n');
}

const filePath = path.isAbsolute(fileArg) ? fileArg : path.join(DOWNLOADS_DIR, fileArg);
if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const bunnyIds = loadJson(BUNNY_IDS_PATH, {});
if (bunnyIds[key]) {
  console.log(`[skip] ${key} already uploaded (guid ${bunnyIds[key]}) — not re-uploading`);
  process.exit(0);
}

const stat = fs.statSync(filePath);
console.log(`Uploading ${path.basename(filePath)} (${(stat.size / 1024 / 1024).toFixed(1)} MB) -> ${key} ...`);

const createRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
  method: 'POST',
  headers: { AccessKey: API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ title: key }),
});
if (!createRes.ok) {
  console.error(`create video failed: ${createRes.status} ${await createRes.text()}`);
  process.exit(1);
}
const { guid } = await createRes.json();

const stream = fs.createReadStream(filePath);
const uploadRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${guid}`, {
  method: 'PUT',
  headers: { AccessKey: API_KEY, 'Content-Type': 'application/octet-stream' },
  body: stream,
  duplex: 'half',
  signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
});
if (!uploadRes.ok) {
  console.error(`upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
  process.exit(1);
}

bunnyIds[key] = guid;
saveJson(BUNNY_IDS_PATH, bunnyIds);

let deletedLocal = false;
try {
  fs.unlinkSync(filePath);
  deletedLocal = true;
} catch (err) {
  console.log(`local delete failed: ${err.message} — file kept`);
}

console.log(`[done] ${key} -> bunny guid ${guid}, local copy ${deletedLocal ? 'removed' : 'kept'}`);
