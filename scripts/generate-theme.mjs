#!/usr/bin/env node
/** Build-time generator for brand CSS variables and favicon from theme.ts. */
import { readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const themePath = join(root, 'src', 'data', 'theme.ts');
const cssPath = join(root, 'src', 'styles', 'starwind.css');
const faviconPath = join(root, 'public', 'favicon.svg');

const src = await readFile(themePath, 'utf8');
const match = src.match(/export const brandColors: BrandColors = \{([\s\S]*?)\};/);
if (!match) throw new Error('Could not parse brandColors from theme.ts');
const theme = {};
for (const line of match[1].split('\n')) {
  const item = line.match(/(\w+):\s*['"]([^'"]+)['"]/);
  if (item) theme[item[1]] = item[2];
}

let css = await readFile(cssPath, 'utf8');
const replacements = {
  '--primary': theme.primary,
  '--primary-foreground': theme.primaryForeground,
  '--primary-accent': theme.primaryAccent,
  '--sidebar-primary': theme.primary,
  '--sidebar-primary-foreground': theme.primaryForeground,
};

// Scope edits to the :root block so later brand changes regenerate cleanly,
// regardless of the value currently in the file.
const rootStart = css.indexOf(':root {');
if (rootStart === -1) throw new Error('Could not find :root block in starwind.css');
const rootEnd = css.indexOf('}', rootStart);
if (rootEnd === -1) throw new Error('Could not find end of :root block in starwind.css');

let rootBlock = css.slice(rootStart, rootEnd);
for (const [name, value] of Object.entries(replacements)) {
  const pattern = new RegExp(`${name}:\\s*[^;]+;`);
  rootBlock = rootBlock.replace(pattern, `${name}: ${value};`);
}
css = css.slice(0, rootStart) + rootBlock + css.slice(rootEnd);
await writeFile(cssPath, css, 'utf8');

await writeFile(faviconPath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="6" fill="${theme.primary}"/>
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="${theme.faviconForeground}">CS</text>
</svg>
`, 'utf8');
console.log(`theme: generated ${relative(root, cssPath)} and ${relative(root, faviconPath)}`);
