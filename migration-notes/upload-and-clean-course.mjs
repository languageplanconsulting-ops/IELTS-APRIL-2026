import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const course = process.argv[2];
const LIBRARIES = { speaking: '713546', listening: '713547', reading: '713390', grammar: '714012' };
if (!LIBRARIES[course]) {
  console.error('Usage: node upload-and-clean-course.mjs <speaking|listening>');
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
const MANIFEST_PATH = new URL(`./${course}-video-map.json`, import.meta.url);
const LOG_PATH = new URL(`./upload-log-${course}.json`, import.meta.url);
const DOWNLOADS_DIR = path.join(process.env.HOME, 'Downloads');
const MIGRATION_START = new Date('2026-07-25T17:00:00').getTime();

const CONCURRENCY = 1;
const TOLERANCE = 1;
const POLL_INTERVAL_MS = 5000;
const UPLOAD_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour — large files over slow uplinks need real headroom

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

const manifest = loadJson(MANIFEST_PATH, []);
const bunnyIds = loadJson(BUNNY_IDS_PATH, {});
const uploadLog = loadJson(LOG_PATH, {});

console.log(`Watching ${DOWNLOADS_DIR} for ${course} course video downloads (${manifest.length} known lessons, matching by duration)...`);
console.log(`Only touching files newer than ${new Date(MIGRATION_START).toISOString()}`);

function durationOf(filePath) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', filePath]);
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.on('close', (code) => {
      if (code !== 0) return reject(new Error('ffprobe failed'));
      resolve(Math.round(parseFloat(out.trim())));
    });
    p.on('error', reject);
  });
}

async function findMatch(seconds) {
  const candidates = manifest.filter((l) => Math.abs(l.seconds - seconds) <= TOLERANCE && !bunnyIds[l.key]);
  if (candidates.length === 0) return null;
  if (candidates.length > 1) return { ambiguous: true, candidates };
  return { key: candidates[0].key };
}

async function createVideo(key) {
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: { AccessKey: API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ title: key }),
  });
  if (!res.ok) throw new Error(`create video failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.guid;
}

async function uploadVideo(guid, filePath) {
  const stat = fs.statSync(filePath);
  const stream = fs.createReadStream(filePath);
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${guid}`, {
    method: 'PUT',
    headers: { AccessKey: API_KEY, 'Content-Type': 'application/octet-stream' },
    body: stream,
    duplex: 'half',
    signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`upload failed: ${res.status} ${await res.text()}`);
  return stat.size;
}

const processing = new Set();
const skippedAmbiguous = new Set();

async function processFile(filePath) {
  const base = path.basename(filePath);
  if (processing.has(base)) return;
  processing.add(base);
  try {
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      return;
    }
    if (stat.mtimeMs < MIGRATION_START) return;
    if (!/\.(mp4|mov)$/i.test(base)) return;
    if (uploadLog[base] && uploadLog[base].guid) return;

    let seconds;
    try {
      seconds = await durationOf(filePath);
    } catch {
      return;
    }

    const match = await findMatch(seconds);
    if (!match) {
      console.log(`[SKIP]   ${base} — duration ${seconds}s doesn't match any known ${course} lesson`);
      uploadLog[base] = { seconds, skipped: true, reason: 'no duration match', attemptedAt: new Date().toISOString() };
      saveJson(LOG_PATH, uploadLog);
      return;
    }
    if (match.ambiguous) {
      const comboKey = match.candidates.map((c) => c.key).sort().join(',');
      if (!skippedAmbiguous.has(comboKey)) {
        skippedAmbiguous.add(comboKey);
        console.log(`Ambiguous durations requiring manual resolution: ${seconds} (${comboKey})`);
      }
      console.log(`[SKIP]   ${base} — duration ${seconds}s is ambiguous (collides between multiple lessons), needs manual resolution`);
      uploadLog[base] = { seconds, skipped: true, reason: 'ambiguous duration', attemptedAt: new Date().toISOString() };
      saveJson(LOG_PATH, uploadLog);
      return;
    }

    const key = match.key;
    if (bunnyIds[key]) {
      console.log(`[skip]   ${base} — lesson ${key} already uploaded, removing local duplicate`);
      try {
        fs.unlinkSync(filePath);
      } catch {}
      return;
    }

    console.log(`[match]  ${base} (${seconds}s) -> ${key}`);
    const guid = await createVideo(key);
    const sizeMB = (stat.size / 1024 / 1024).toFixed(1);
    console.log(`[upload] ${base} -> ${key} (${sizeMB} MB) ...`);
    await uploadVideo(guid, filePath);

    bunnyIds[key] = guid;
    saveJson(BUNNY_IDS_PATH, bunnyIds);
    uploadLog[base] = { key, guid, sizeBytes: stat.size, uploadedAt: new Date().toISOString(), deletedLocal: false };
    saveJson(LOG_PATH, uploadLog);

    let deletedLocal = false;
    try {
      fs.unlinkSync(filePath);
      deletedLocal = true;
    } catch (err) {
      console.log(`[FAILED] ${base}: ${err.message} — local file kept, not deleted`);
    }
    uploadLog[base].deletedLocal = deletedLocal;
    saveJson(LOG_PATH, uploadLog);

    console.log(`[done]   ${base} -> ${key} -> bunny guid ${guid}, local copy ${deletedLocal ? 'removed' : 'KEPT (delete failed)'}`);
    console.log(`[progress] ${Object.keys(bunnyIds).length}/${manifest.length} lessons uploaded so far`);
  } catch (err) {
    console.log(`[FAILED] ${base}: ${err.message} — local file kept, not deleted`);
    uploadLog[base] = { error: err.message, attemptedAt: new Date().toISOString(), deletedLocal: false };
    saveJson(LOG_PATH, uploadLog);
  } finally {
    processing.delete(base);
  }
}

const queue = [];
let draining = false;

async function drain() {
  if (draining) return;
  draining = true;
  const active = [];
  while (queue.length > 0 || active.length > 0) {
    while (active.length < CONCURRENCY && queue.length > 0) {
      const f = queue.shift();
      active.push(processFile(f).finally(() => {
        const idx = active.indexOf(p);
        if (idx >= 0) active.splice(idx, 1);
      }));
      var p = active[active.length - 1];
    }
    if (active.length > 0) await Promise.race(active);
  }
  draining = false;
}

function scan() {
  let entries;
  try {
    entries = fs.readdirSync(DOWNLOADS_DIR);
  } catch {
    return;
  }
  for (const name of entries) {
    if (!/\.(mp4|mov)$/i.test(name)) continue;
    const full = path.join(DOWNLOADS_DIR, name);
    if (!queue.includes(full) && !processing.has(name)) queue.push(full);
  }
  drain();
}

scan();
setInterval(scan, POLL_INTERVAL_MS);
