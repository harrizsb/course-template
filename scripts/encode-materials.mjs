#!/usr/bin/env node
/**
 * Encodes every PDF under src/assets/materials into a base64 data-URI module.
 *
 * Why: material PDFs must never ship as files under a directly fetchable route
 * (for example /slides/week01.pdf), where they can be enumerated and scraped.
 * Instead each PDF is inlined as a data URI into the generated preview page at
 * build time, so `dist/` contains no .pdf files at all.
 *
 * Output: src/data/materials.generated.ts (deterministic, safe to commit).
 * Runs automatically before dev, build, and check via package.json pre-scripts.
 *
 * Usage: npm run materials
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceDir = join(root, 'src', 'assets', 'materials');
const outFile = join(root, 'src', 'data', 'materials.generated.ts');

/** Directory name -> short link label. Unknown directories fall back to the directory name. */
const KIND_LABEL = { slides: 'Slides', rubrics: 'Rubric', handouts: 'Handout' };

/** Recursively collect every .pdf path, relative to sourceDir, sorted for deterministic output. */
async function collect(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await collect(join(dir, entry.name), rel)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
      files.push(rel);
    }
  }
  return files.sort();
}

/** "slides/week01.pdf" -> { path: "slides/week01", label: "Slides", title: "Week 1 slides" } */
function describe(file) {
  const segments = file.split('/');
  const kind = segments.length > 1 ? segments[0] : 'materials';
  const base = segments[segments.length - 1].replace(/\.pdf$/i, '');
  const label = KIND_LABEL[kind] ?? `${kind[0].toUpperCase()}${kind.slice(1)}`;

  const week = /^week(\d+)$/i.exec(base);
  let title;
  if (week) {
    title = `Week ${Number(week[1])} ${label.toLowerCase()}`;
  } else {
    const words = base.split(/[-_]+/).filter(Boolean);
    const phrase = words.map((word, index) =>
      index === 0 ? `${word[0].toUpperCase()}${word.slice(1)}` : word.toLowerCase(),
    );
    title = `${phrase.join(' ')} ${label.toLowerCase()}`;
  }

  return { path: file.replace(/\.pdf$/i, '').split(sep).join('/'), file, label, title };
}

const files = await collect(sourceDir);

const entries = [];
for (const file of files) {
  const bytes = await readFile(join(sourceDir, file));
  entries.push({
    ...describe(file),
    bytes: bytes.byteLength,
    dataUri: `data:application/pdf;base64,${bytes.toString('base64')}`,
  });
}

const body = entries
  .map(
    (entry) => `  {
    path: ${JSON.stringify(entry.path)},
    file: ${JSON.stringify(entry.file)},
    label: ${JSON.stringify(entry.label)},
    title: ${JSON.stringify(entry.title)},
    bytes: ${entry.bytes},
    dataUri: ${JSON.stringify(entry.dataUri)},
  },`,
  )
  .join('\n');

const output = `// GENERATED FILE - do not edit by hand.
// Source:    src/assets/materials/**/*.pdf
// Regenerate: npm run materials   (also runs before dev, build, and check)
//
// Every PDF is inlined as a base64 data URI so the built site never exposes a
// direct file route for course materials. Consume through src/data/index.ts.

export interface MaterialAsset {
  /** Route path under /materials/, e.g. "slides/week01". */
  path: string;
  /** Source file relative to src/assets/materials, e.g. "slides/week01.pdf". */
  file: string;
  /** Short link label, e.g. "Slides". */
  label: string;
  /** Preview page title, e.g. "Week 1 slides". */
  title: string;
  /** File size in bytes. */
  bytes: number;
  /** data:application/pdf;base64,... payload embedded into the preview page. */
  dataUri: string;
}

export const materials: MaterialAsset[] = [
${body}
];

/** Lookup by route path, e.g. materialByPath["slides/week01"]. */
export const materialByPath: Record<string, MaterialAsset> = Object.fromEntries(
  materials.map((material) => [material.path, material]),
);

/** Lookup by source file, e.g. materialByFile["slides/week01.pdf"]. */
export const materialByFile: Record<string, MaterialAsset> = Object.fromEntries(
  materials.map((material) => [material.file, material]),
);
`;

await writeFile(outFile, output, 'utf8');
console.log(`materials: encoded ${entries.length} PDF(s) -> ${relative(root, outFile)}`);
