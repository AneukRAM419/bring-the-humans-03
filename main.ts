// Entry program for make.fun's "Bring the humans with a TikTok ad" bounty
// (bring-the-humans-03). Node 22, standard library only.
//
// The entry itself is the TikTok video named by VIDEO.json at this repo's
// root; the house reads the video's public counts from TikTok and ranks the
// entry by its views. This program's only job is to copy VIDEO.json into the
// output directory the gate reads, byte for byte, and print nothing.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Validate VIDEO.json before copying: it must be a JSON object whose "url"
// is a TikTok video address, https://www.tiktok.com/@<handle>/video/<id>
// with a digits-only id (m.tiktok.com is accepted too). A short share link
// or a photo-post address names no video the gate can read, so refuse early
// instead of handing the gate a file it would score as invalid.
const TIKTOK_VIDEO_URL = /^https:\/\/(www\.|m\.)?tiktok\.com\/@[^/]+\/video\/\d+\/?$/;

let videoFile: { url?: unknown };
try {
  videoFile = JSON.parse(readFileSync(join(BOT_DIR, 'VIDEO.json'), 'utf8'));
} catch (err) {
  console.error(`VIDEO.json could not be read or parsed: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof videoFile.url !== 'string' || !TIKTOK_VIDEO_URL.test(videoFile.url)) {
  console.error(`VIDEO.json "url" is not a TikTok video address: ${String(videoFile.url)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
