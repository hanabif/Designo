#!/usr/bin/env node
/**
 * fetch-zodiak.mjs — obtains the Zodiak webfonts directly from Fontshare.
 *
 * WHY THIS EXISTS
 * Zodiak is licensed under the ITF Free Font License (FFL) 2.0. Section 02 of
 * that license prohibits making the Font Software available to others through
 * a repository / publicly accessible server, so the font *binaries* are
 * gitignored (see the root .gitignore). Section 02 also requires that anyone
 * who wants the fonts obtains their own copy directly from Fontshare — which
 * is exactly what this script does for every fresh clone and CI run.
 *
 * The tracked file `src/css/zodiak.css` (@font-face rules) is not font
 * software and stays in git; it references `../fonts/zodiak/*`, which this
 * script populates.
 *
 * Usage:
 *   node scripts/fetch-zodiak.mjs           # install if missing (postinstall)
 *   node scripts/fetch-zodiak.mjs --force   # re-download even if present
 */
import { execFileSync } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const DOWNLOAD_URL = 'https://api.fontshare.com/v2/fonts/download/zodiak';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(SCRIPT_DIR, '..');
const TARGET_DIR = path.join(FRONTEND_DIR, 'src', 'fonts', 'zodiak');

/** Extensions referenced by src/css/zodiak.css (eot is legacy and unused). */
const COPY_EXTENSIONS = new Set(['.woff2', '.woff', '.ttf']);
/** Once the variable font exists, css/zodiak.css can resolve every weight. */
const PRESENT_MARKER = path.join(TARGET_DIR, 'Zodiak-Variable.woff2');

const force = process.argv.includes('--force');

function fontsPresent() {
  return fs.existsSync(PRESENT_MARKER);
}

/** Extract a zip with tools available out-of-the-box (bsdtar / unzip / PowerShell). */
function extractZip(zipPath, destDir) {
  const attempts = [
    () => execFileSync('tar', ['-xf', zipPath, '-C', destDir], { stdio: 'ignore' }),
    () => execFileSync('unzip', ['-o', '-q', zipPath, '-d', destDir], { stdio: 'ignore' }),
    () =>
      execFileSync(
        'powershell.exe',
        ['-NoProfile', '-Command', `Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${destDir}' -Force`],
        { stdio: 'ignore' },
      ),
  ];
  let lastError;
  for (const attempt of attempts) {
    try {
      attempt();
      return;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

/** Collect Zodiak webfont files, preferring the archive's WEB folder. */
function findWebFonts(rootDir) {
  const roots = [];
  const walkDirs = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const p = path.join(dir, entry.name);
      if (entry.name.toUpperCase() === 'WEB') roots.push(p);
      else walkDirs(p);
    }
  };
  walkDirs(rootDir);
  if (roots.length === 0) roots.push(rootDir); // fall back to whole archive

  const found = [];
  const walkFiles = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walkFiles(p);
      else if (entry.name.startsWith('Zodiak-') && COPY_EXTENSIONS.has(path.extname(entry.name))) found.push(p);
    }
  };
  for (const r of roots) walkFiles(r);
  return found;
}

async function main() {
  if (fontsPresent() && !force) {
    console.log('[zodiak] webfonts already installed — skipping (use --force to re-fetch).');
    return;
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zodiak-'));
  const zipPath = path.join(tmpDir, 'zodiak.zip');
  const extractDir = path.join(tmpDir, 'extract');

  try {
    console.log('[zodiak] downloading Zodiak from Fontshare…');
    const res = await fetch(DOWNLOAD_URL, {
      headers: { 'User-Agent': 'designo-build (self-hosting per ITF FFL §01)' },
    });
    if (!res.ok || !res.body) throw new Error(`Fontshare responded with ${res.status} ${res.statusText}`);
    fs.mkdirSync(extractDir, { recursive: true });
    await pipeline(Readable.fromWeb(res.body), createWriteStream(zipPath));

    console.log('[zodiak] extracting…');
    extractZip(zipPath, extractDir);

    const fontFiles = findWebFonts(extractDir);
    if (!fontFiles.some((f) => f.endsWith('.woff2'))) {
      throw new Error('archive did not contain any Zodiak .woff2 files');
    }

    fs.mkdirSync(TARGET_DIR, { recursive: true });
    for (const file of fontFiles) {
      fs.copyFileSync(file, path.join(TARGET_DIR, path.basename(file)));
    }

    const installed = fs.readdirSync(TARGET_DIR).filter((f) => COPY_EXTENSIONS.has(path.extname(f)));
    console.log(`[zodiak] installed ${installed.length} font files → src/fonts/zodiak/`);
  } catch (err) {
    console.error(`[zodiak] FAILED to fetch the Zodiak fonts: ${err.message}`);
    console.error(
      [
        '',
        'The font binaries are gitignored because the ITF Free Font License (FFL)',
        'Section 02 prohibits redistributing them through a public repository.',
        'Obtain your own copy directly from Fontshare (as the license requires):',
        `  1. Download   ${DOWNLOAD_URL}`,
        '  2. Extract    …/Fonts/WEB/fonts/*.woff2, *.woff, *.ttf',
        '  3. Copy them into   frontend/src/fonts/zodiak/',
        '  (or simply re-run:  npm run fonts:zodiak  when you are online)',
        '',
      ].join('\n'),
    );
    process.exitCode = 1;
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main();
