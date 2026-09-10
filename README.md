# CS 499 Advanced Web Systems - Course Site

## 1. Project Identity

| Field | Value |
|---|---|
| What | Static course site for CS 499 Advanced Web Systems (Fall 2026, Dr. Elena Vasquez) |
| Framework | Astro ^5.18.2, `output: 'static'` (strict SSG, no SSR) |
| UI | Starwind UI (@starwind-ui/astro ^1.2.1), vendored under `src/components/starwind/` |
| Styling | Tailwind CSS ^4.3.3 via `@tailwindcss/vite`, semantic tokens only |
| Language | TypeScript ^5.9.3 (`astro/tsconfigs/strict`, alias `@/*` -> `src/*`) |
| Deploy target | Cloudflare Pages - static, no Node runtime |
| Repo | `github.com/harrizsb/course-template` |
| Node | 24.20.0 (verified runtime) |
| Package manager | npm 12.0.2 (verified runtime) |

Versions are declared in `package.json` as caret ranges; the resolved install lives in `package-lock.json`. Do not invent other versions.

## 2. Quickstart

All commands run from the repo root `/home/butler/course-template`.

| Task | Command | Notes |
|---|---|---|
| Install | `npm install` | Reads `package.json` + `package-lock.json` |
| Dev server | `npm run dev` | Runs `materials` first (`predev`), then `astro dev`; default `http://localhost:4321` |
| Production build | `npm run build` | Runs `materials` first (`prebuild`), then `astro build` -> `dist/` |
| Preview built site | `npm run preview` | `astro preview`, serves `dist/` |
| Type check | `npm run check` | Runs `materials` first (`precheck`), then `astro check` |
| Regenerate materials | `npm run materials` | `node scripts/encode-materials.mjs` (normally automatic) |
| Raw Astro CLI | `npm run astro` | Not needed for normal work |

`npm run dev`, `npm run build`, and `npm run check` automatically regenerate `src/data/materials.generated.ts` via npm pre-scripts. Run `npm run materials` manually only after changing PDFs outside a dev/build/check cycle.

## 3. Repository Map

| Path | Purpose |
|---|---|
| `astro.config.mjs` | Astro config: `output: 'static'`, `build.format: 'directory'`, `build.assets: 'assets'`, Tailwind Vite plugin |
| `tsconfig.json` | Extends `astro/tsconfigs/strict`, alias `@/*` -> `src/*` |
| `starwind.config.json` | Starwind registry config, `componentDir: src/components/starwind` |
| `package.json` | Scripts and dependencies (see Quickstart) |
| `.npmrc` | `allow-scripts=true` for install scripts |
| `.gitignore` | Ignores `node_modules/`, `dist/`, `.astro/`, env files, editor files |
| `SPEC.md` | Authoritative spec: SSG, zero-JS, Starwind-only, materials pipeline, Cloudflare Pages, commit rules |
| `AGENTS.md` | Agent directives: Lego rule, hydration rules, routing, commits |
| `public/_headers` | Cloudflare Pages header rules (caching) |
| `public/favicon.svg` | Site favicon (only asset in `public/` besides `_headers`) |
| `src/assets/materials/slides/` | Source lecture slide PDFs (never served as files) |
| `src/assets/materials/rubrics/` | Source rubric PDFs |
| `src/assets/materials/handouts/` | Source handout PDFs |
| `scripts/encode-materials.mjs` | Walks `src/assets/materials/**/*.pdf`, writes `src/data/materials.generated.ts` with base64 data URIs |
| `src/styles/starwind.css` | Single global stylesheet: Tailwind import, Starwind theme tokens, `--radius: 0rem` |
| `src/layouts/BaseLayout.astro` | Shared layout: header band, top nav, right-rail ad slot, footer, skip link |
| `src/components/PageHeader.astro` | Page title block: `h1` + meta `p` |
| `src/components/Section.astro` | Standard page section: owns the `mt-10` rhythm and the `h2` idiom |
| `src/components/PrerequisitesSection.astro` | Reusable prerequisites list section |
| `src/components/starwind/` | Vendored Starwind UI components - do not hand-edit except via Starwind tooling |
| `src/components/starwind/card/` | Card primitives (`Card`, `CardHeader`, `CardTitle`, `CardContent`, etc.) |
| `src/components/starwind/table/` | Table primitives (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`, `TableFoot`) |
| `src/components/starwind/button/` | Button primitive |
| `src/components/starwind/badge/` | Badge primitive |
| `src/components/starwind/alert/` | Alert primitive |
| `src/components/starwind/dialog/` | Dialog primitives |
| `src/components/starwind/sheet/` | Sheet primitives |
| `src/components/starwind/accordion/` | Accordion primitives |
| `src/components/starwind/avatar/` | Avatar primitives |
| `src/components/starwind/breadcrumb/` | Breadcrumb primitives |
| `src/components/starwind/input/` | Input primitive |
| `src/components/starwind/label/` | Label primitive |
| `src/components/starwind/textarea/` | Textarea primitive |
| `src/components/starwind/native-select/` | NativeSelect primitives |
| `src/components/starwind/field/` | Field primitives |
| `src/components/starwind/item/` | Item primitives |
| `src/components/starwind/separator/` | Separator primitive |
| `src/components/starwind/prose/` | Prose primitive |
| `src/components/starwind/navigation-menu/` | NavigationMenu primitives |
| `src/lib/ui.ts` | Site-wide presentation constants: `textLinkClass` (the single content-link idiom) |
| `src/data/index.ts` | Re-export barrel - import from here, never from individual modules |
| `src/data/course.ts` | Course metadata, instructor, grading, prerequisites, `courseMeta` |
| `src/data/schedule.ts` | Weekly schedule array (`weeks`) |
| `src/data/assignments.ts` | Assignment array (`assignments`) |
| `src/data/resources.ts` | Resource groups (`resources`) |
| `src/data/navigation.ts` | Top-nav links (`navItems`) |
| `src/data/policies.ts` | Course policies (`policies`) |
| `src/data/materials.generated.ts` | GENERATED: material assets + lookup maps. Never edit by hand |
| `src/pages/index.astro` | Home page (`/`) |
| `src/pages/syllabus.astro` | Syllabus page (`/syllabus/`) |
| `src/pages/schedule.astro` | Schedule page (`/schedule/`) |
| `src/pages/assignments.astro` | Assignments page (`/assignments/`) |
| `src/pages/resources.astro` | Resources page (`/resources/`) |
| `src/pages/404.astro` | Not-found page |
| `src/pages/materials/[...path].astro` | Static preview page per material, e.g. `/materials/slides/week01/` |

Paths not listed (e.g., `.astro/`, `dist/`, `node_modules/`, `.svelte-kit/`) are generated and not edited.

## 4. Data Layer Contract

Rule: pages and layouts import from `src/data/index.ts` (or `src/data`), never directly from an individual module like `src/data/course.ts`. The barrel re-exports values and types so the module layout can change without touching consumers.

```ts
// canonical import
import { course, courseMeta, weeks, assignments, resources, navItems, policies, materialByFile } from '../data';
```

### 4.1 `src/data/course.ts`

```ts
export interface Instructor {
  name: string;
  email: string;
  office: string;
  officeHours: string;
}

export interface Course {
  code: string;
  title: string;
  term: string;
  description: string;
  instructor: Instructor;
  location: string;
  schedule: string;
  /** Footer freshness line, e.g. "September 2026". */
  lastUpdated: string;
}

export interface Grading {
  participation: number;
  assignments: number;
  midterm: number;
  final: number;
}

export const course: Course = { /* ... */ };
export const grading: Grading = { /* ... */ };
export const prerequisites: string[] = [ /* ... */ ];

/** Standard PageHeader meta line: "CS 499 · Fall 2026 · Dr. Elena Vasquez". */
export const courseMeta = `${course.code} · ${course.term} · ${course.instructor.name}`;
```

Edit `course`, `grading`, or `prerequisites` in place. `courseMeta` is derived; do not edit it. Use `courseMeta` for `PageHeader` `meta` and `course.lastUpdated` for footer freshness.

### 4.2 `src/data/schedule.ts`

```ts
export interface Week {
  week: number;
  date: string;       // dd/mm/yyyy
  topic: string;
  readings: string[];
  materials: string[]; // source paths under src/assets/materials, e.g. ["slides/week01.pdf"]
}

export const weeks: Week[] = [ /* ... */ ];
```

To add a week:

1. Drop the PDF in `src/assets/materials/slides/` (e.g. `week14.pdf`).
2. Append to `weeks`:

```ts
// src/data/schedule.ts
export const weeks: Week[] = [
  // ... existing weeks
  { week: 14, date: '23/11/2026', topic: 'Final review', readings: ['Course notes'], materials: ['slides/week14.pdf'] },
];
```

3. Run `npm run materials` (or just `npm run dev` / `npm run build`, which run it automatically). This regenerates `src/data/materials.generated.ts` so `materialByFile['slides/week14.pdf']` resolves.

Keep `week` numbers sequential. Each entry in `materials` is a source path relative to `src/assets/materials/`, never a URL. A week may carry more than one document (for example a slide deck plus a handout). Never place PDFs in `public/`.

### 4.3 `src/data/assignments.ts`

```ts
export interface KaplayGameConfig {
  id: string;
  title: string;
  description: string;
  controls: string[];
}

export interface Assignment {
  id: number;
  title: string;
  due: string;          // dd/mm/yyyy
  weight: number;       // percent of final grade
  description: string;
  requirements: string[];
  kaplay: KaplayGameConfig;
}
```

Every assignment has one small Kaplay practice game. The game is mounted inside its assignment's collapsible details panel with `client:visible`. It uses the assignment rubric as its scoring basis; there is no submission endpoint or server persistence.

### 4.4 `src/data/rubrics.ts`

```ts
export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  levels: { high: string; middle: string; lower: string };
}
```

Each criterion has three achievement descriptors. The shared score multipliers are High = 1.0, Middle = 0.6, and Lower = 0.3. The final score is `sum(criterion.weight * multiplier)` across all criteria. Students must rate every criterion, then use Capture final score to copy a breakdown containing the assignment, score, level for each criterion, and the date in `dd/mm/yyyy` format. The score is a practice record, not a submission.

Use stable criterion IDs for data references. Do not map game scoring by display names.

### 4.5 International formats and metrics

All authored course dates use `dd/mm/yyyy` (for example, `24/08/2026`). Authored measurements use SI/international metric units, such as milliseconds, kilobytes, metres, and degrees Celsius. Do not add units where a value is a percentage, score, count, or other dimensionless quantity.

### 4.6 `src/data/resources.ts`

```ts
export interface ResourceItem {
  /** Primary label, e.g. the book or tool name. Linked when `url` is set. */
  title: string;
  /** Secondary editorial line, e.g. author or format qualifier. */
  subtitle?: string;
  /** One-line annotation shown under the title block. */
  description?: string;
  /** Official external URL. When set, the title renders as a link. */
  url?: string;
}

export interface ResourceGroup {
  category: string;
  items: ResourceItem[];
}

export const resources: ResourceGroup[] = [ /* ... */ ];
```

To add a resource, push into the appropriate group or add a new group:

```ts
// src/data/resources.ts - add item to existing group
export const resources: ResourceGroup[] = [
  { category: 'Tools', items: [
    // ... existing
    { title: 'MDN Web Docs', subtitle: 'developer.mozilla.org', description: 'Reference for HTML, CSS, and JS.', url: 'https://developer.mozilla.org/' },
  ]},
];

// Or add a new category
export const resources: ResourceGroup[] = [
  // ... existing groups
  { category: 'Videos', items: [
    { title: 'HTTP 203 - Rendering strategies', description: 'Short explainer series.' },
  ]},
];
```

Only `title` is required. External links render with `target="_blank" rel="noopener noreferrer"`.

### 4.5 `src/data/navigation.ts`

```ts
export interface NavItem {
  href: string;         // must start with "/", e.g. "/syllabus"
  label: string;        // display text, e.g. "Syllabus"
  description: string;  // one-line summary used by the home page section index
}

export const navItems: NavItem[] = [
  { href: '/', label: 'Home', description: 'Course overview, instructor, and prerequisites.' },
  { href: '/syllabus', label: 'Syllabus', description: 'Policies, grading scheme, and course expectations.' },
  { href: '/schedule', label: 'Schedule', description: 'Weekly topics, readings, and lecture materials.' },
  { href: '/assignments', label: 'Assignments', description: 'Homework, milestones, and the team project.' },
  { href: '/resources', label: 'Resources', description: 'Textbooks, tools, and reference material.' },
];
```

To add a nav link, append to `navItems`. All three fields are required:

```ts
// src/data/navigation.ts
export const navItems: NavItem[] = [
  // ... existing
  { href: '/faq', label: 'FAQ', description: 'Frequently asked questions.' },  // new
];
```

`BaseLayout.astro` renders `href` and `label` in the header nav and highlights the current page by comparing `Astro.url.pathname` (trailing-slash stripped) to `item.href`. The home page renders every non-`/` item in its "Course sections" table using `label` and `description`. Use root-relative `href` values only.

### 4.6 `src/data/policies.ts`

```ts
export interface Policy {
  title: string;
  body: string[];
}

export const policies: Policy[] = [ /* ... */ ];
```

To add a policy, append an object with a `title` and a `body` array of paragraph strings. The syllabus page renders them as `h3` blocks under the "Policies" section.

### 4.7 `src/data/materials.generated.ts` (generated)

Never edit this file by hand. It is produced by `npm run materials` from `scripts/encode-materials.mjs`.

```ts
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

export const materials: MaterialAsset[] = [ /* ... */ ];
export const materialByPath: Record<string, MaterialAsset>;  // keyed by "slides/week01"
export const materialByFile: Record<string, MaterialAsset>;  // keyed by "slides/week01.pdf"
```

How it works: every PDF under `src/assets/materials/` is inlined as a base64 data URI. `src/pages/materials/[...path].astro` generates one static preview page per asset with `getStaticPaths()` and embeds the PDF in an `<object type="application/pdf">` plus a download link. `src/pages/schedule.astro` resolves each entry in `Week.materials` through `materialByFile` and links to `/materials/<path>/`. Consequences: `dist/` contains zero `.pdf` files and no direct file route exists to enumerate or scrape.

To consume materials in a page:

```astro
---
import { materialByFile } from '../data';
import { textLinkClass } from '../lib/ui';

const material = materialByFile['slides/week01.pdf'];
---
{material && <a href={`/materials/${material.path}/`} class={textLinkClass}>{material.label}</a>}
```

### 4.8 Adding a new data module

See section 12.

## 5. Page Pattern

Every content page follows the same composition. Do not deviate.

Stack:

1. `BaseLayout` wraps the page and provides header, nav, ad rail, footer.
2. `PageHeader` renders the single `h1` and the meta line. Pass `meta={courseMeta}` (or a page-specific meta string).
3. `<article class="max-w-3xl">` (or `max-w-4xl` for wide tables like the schedule) wraps the content.
4. `Section` wraps every `h2` section and owns the `mt-10` rhythm plus the `h2` classes. Never hand-write `<section>` + `<h2>`.
5. Content links use `textLinkClass` imported from `src/lib/ui.ts`. Never retype the class string.
6. The lead paragraph directly after `PageHeader` uses `class="mt-8 leading-relaxed"`.

Minimal skeleton - copy this to start a new page:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHeader from '../components/PageHeader.astro';
import Section from '../components/Section.astro';
import { course, courseMeta } from '../data';
import { textLinkClass } from '../lib/ui';
---

<BaseLayout title={`Page Title - ${course.code}: ${course.title}`} description="One-sentence description for the meta tag.">
  <article class="max-w-3xl">
    <PageHeader title="Page Title" meta={courseMeta} />

    <p class="mt-8 leading-relaxed"><strong class="font-semibold">Lead.</strong> Opening paragraph text.</p>

    <Section id="first-heading" title="First section">
      <p class="leading-relaxed">Body text with a <a href="/schedule" class={textLinkClass}>content link</a>.</p>
      <h3 class="text-lg font-semibold mb-2">Subsection</h3>
      <p class="leading-relaxed">More body text.</p>
    </Section>

    <Section id="second-heading" title="Second section">
      <p class="leading-relaxed">More body text.</p>
    </Section>
  </article>
</BaseLayout>
```

Rules:

- One `h1` per page, rendered by `PageHeader.astro`. Do not add another `h1`.
- `Section` requires `id` and `title`; it renders `<section aria-labelledby={id}>` with the matching `<h2 id={id}>`.
- Subsections inside a section use `h3` with `class="text-lg font-semibold mb-2"`.
- Tables are wrapped in `<div class="border border-border overflow-hidden">` then Starwind `Table` primitives.
- File-based routing: `src/pages/foo.astro` -> `/foo/`, `src/pages/index.astro` -> `/`, `src/pages/404.astro` -> 404 page, `src/pages/materials/[...path].astro` -> `/materials/<path>/` via `getStaticPaths()`.

## 6. Design System Rules

### 6.1 Tokens actually used

Do not introduce other tokens or raw palette colors (e.g., `bg-red-800`, `text-neutral-600`). Use only these semantic tokens:

| Token class | Where it appears |
|---|---|
| `bg-primary` | Header band, skip-link focus background |
| `text-primary-foreground` | Header text, skip-link text |
| `text-muted-foreground` | PageHeader meta, table secondary text, footer, requirement lists |
| `border-border` | Heading underlines, table wrappers, footer top border |
| `text-primary` | Content links (default state, via `textLinkClass`) |
| `text-primary-accent` | Content links on hover (via `textLinkClass`) |
| `bg-muted/30` | Ad placeholder, footer background |
| `bg-card` | Card background (via Starwind Card) |
| `text-card-foreground` | Card text (via Starwind Card) |
| `ring-border` | Card ring (via Starwind Card) |
| `bg-muted/50` | Table header row background (`<TableRow class="bg-muted/50">`) |

Additional tokens exist in `src/styles/starwind.css` but are not used in current pages. Prefer the list above; if you need another token, verify it exists in `starwind.css` and is semantic (not a raw palette value).

### 6.2 Heading and spacing scale

Copy these class strings exactly. Do not adjust sizes, weights, or spacing.

| Element | Classes | Source |
|---|---|---|
| `h1` | `text-3xl md:text-4xl font-bold tracking-tight border-b border-border pb-4` | `PageHeader.astro` |
| `h1` meta `p` | `text-base text-muted-foreground mt-2` | `PageHeader.astro` |
| `h2` | `text-2xl font-semibold border-b border-border pb-2 mb-4` | `Section.astro` |
| `h3` | `text-lg font-semibold mb-2` | pages |
| Lead paragraph (first `p` after header) | `mt-8 leading-relaxed` | pages |
| Section wrapper | `mt-10` | `Section.astro` |
| Article container | `max-w-3xl` (default) or `max-w-4xl` (wide tables) | pages |

### 6.3 Content link idiom

There is exactly one link style for content links, exported as `textLinkClass` from `src/lib/ui.ts`:

```ts
export const textLinkClass =
  'text-primary underline underline-offset-4 hover:text-primary-accent outline-none focus-visible:ring-3 focus-visible:ring-outline/50';
```

Use it for every inline link inside page content:

```astro
---
import { textLinkClass } from '../lib/ui';
---

<a href="/path" class={textLinkClass}>Link text</a>
```

Links inside tables use the same constant. The only variation is the `download` attribute when the target is a file. Do not use `textLinkClass` for the header nav, buttons, or the skip link - those have their own treatments.

### 6.4 Square corners

`src/styles/starwind.css` sets `--radius: 0rem`. All Starwind components therefore render with square corners. Do not override with `rounded-*` utilities except where the existing code already does (`rounded-md` on the skip link, `rounded-none` on the ad Card). New code should default to square.

## 7. Table Accessibility Pattern

Every table uses Starwind table primitives and follows this pattern:

- Every `TableHead` has a `scope` attribute: `scope="col"` for column headers, `scope="row"` for row headers.
- Every `Table` has a `TableCaption`. If the caption would be visually redundant, hide it with `class="sr-only"` - do not omit it.

Example - column headers inside a `Section`:

```astro
---
import Section from '../components/Section.astro';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/starwind/table';
---

<Section id="schedule-heading" title="Schedule">
  <div class="border border-border overflow-hidden">
    <Table>
      <TableCaption class="sr-only">Weekly lecture schedule</TableCaption>
      <TableHeader>
        <TableRow class="bg-muted/50">
          <TableHead scope="col" class="w-16">Week</TableHead>
          <TableHead scope="col">Topic</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell class="font-medium">1</TableCell>
          <TableCell>Course overview</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</Section>
```

Example - row headers (key/value table):

```astro
<Table>
  <TableCaption class="sr-only">Course information</TableCaption>
  <TableBody>
    <TableRow>
      <TableHead scope="row" class="w-44 align-middle bg-muted/50">Instructor</TableHead>
      <TableCell>Dr. Elena Vasquez</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

Reference implementations: `src/pages/schedule.astro` (column headers), `src/pages/index.astro` (row headers), `src/pages/assignments.astro` (both).

## 8. Ads Slot

Location: `src/layouts/BaseLayout.astro`, inside `<main>`, as a sibling to the content `<div class="flex-1 min-w-0">`. The layout is a flex row: content on the left, ad rail on the right.

Current markup (zero-JS placeholder):

```astro
<aside aria-label="Advertisement" class="hidden lg:block w-72 shrink-0">
  <Card size="sm" class="rounded-none">
    <CardHeader>
      <CardTitle>Advertisement</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- Ad slot: drop ad-network island (client:idle) here when ready; stays zero-JS until then -->
      <div class="bg-muted/30 h-64" aria-hidden="true"></div>
    </CardContent>
  </Card>
</aside>
```

Properties:

- Rendered server-side as static HTML/CSS. No JavaScript ships for this slot today.
- Uses Starwind `Card` with `class="rounded-none"` and a `bg-muted/30` placeholder div.
- Hidden below `lg` breakpoint (`hidden lg:block`), fixed width `w-72`.
- Has `aria-label="Advertisement"` on the `aside` and `aria-hidden="true"` on the placeholder.

To integrate a real ad network:

1. Create an Astro island component (e.g., `src/components/AdSlot.astro` or `.tsx`) that loads the ad script.
2. Place it inside `CardContent` where the placeholder `div` is.
3. Hydrate with `client:idle` only - never `client:load`.

```astro
<!-- src/layouts/BaseLayout.astro - inside CardContent -->
<CardContent>
  <AdSlot client:idle />
</CardContent>
```

Do not use `client:load`, do not add SSR, do not load ad scripts in `<head>`.

## 9. Constraints and Prohibitions

These are hard rules from `SPEC.md` and `AGENTS.md`. Violating them breaks the build contract or design system.

| Rule | Detail |
|---|---|
| Zero-JS by default | Pages must render as pure HTML/CSS. No `client:` directive unless the component is an island that requires JS. |
| `client:load` forbidden | Only `client:visible` or `client:idle` are allowed. `client:load` is never permitted. |
| No custom primitives | Build UI only by composing Starwind components from `src/components/starwind/`. Do not create new base UI elements with raw Tailwind or custom CSS. |
| No `<style>` blocks | No `<style>` tags in `.astro` files and no custom CSS files beyond `src/styles/starwind.css`. |
| No arbitrary Tailwind values | No `w-[123px]`, `text-[#ff0000]`, or other bracket values. Use the token set and scale in section 6. |
| No raw palette colors | No `bg-red-800`, `text-neutral-600`, `border-gray-200`, etc. Use semantic tokens (`bg-primary`, `text-muted-foreground`, `border-border`, etc.). |
| No SSR | `astro.config.mjs` sets `output: 'static'`. Do not add server routes, middleware, or `export const prerender = false`. |
| File-based routing only | Dynamic routes require `getStaticPaths()`. No server-side route handlers. |
| No PDFs in `public/` | Course materials live under `src/assets/materials/` and are inlined by `npm run materials`. Never add a fetchable PDF route. |
| Images via `astro:assets` | Local images must use `Image` from `astro:assets` for optimization. |
| Conventional Commits | Every commit uses `<type>[optional scope]: <description>` (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`). Imperative, lowercase, no trailing period, subject 72 characters or fewer. One logical change per commit. |

If a task seems to require breaking a rule, state the violation and propose a layout using only existing Starwind blocks (per `AGENTS.md` fallback).

## 10. Deployment

| Field | Value |
|---|---|
| Platform | Cloudflare Pages |
| Build command | `npm run build` |
| Output directory | `dist` |
| Runtime | Static - no Node.js in production |

Caching rules from `public/_headers` (Cloudflare Pages `_headers` format):

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*
  Cache-Control: no-cache
```

Meaning:

- Hashed assets under `/assets/*` are cached for 1 year as immutable (safe because Astro hashes filenames).
- Everything else, including all HTML, is never cached (`no-cache`), so content updates and rollbacks are instant.

Do not add long-lived caching to HTML. Do not remove the `immutable` directive from assets. `dist/` contains zero `.pdf` files by design: materials are inlined into their preview pages.

## 11. How to Add a New Page

Steps to add a page at `/faq`:

1. Create the file `src/pages/faq.astro`. Use the skeleton from section 5:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHeader from '../components/PageHeader.astro';
import Section from '../components/Section.astro';
import { course, courseMeta } from '../data';
---

<BaseLayout title={`FAQ - ${course.code}: ${course.title}`} description="Frequently asked questions for CS 499.">
  <article class="max-w-3xl">
    <PageHeader title="FAQ" meta={courseMeta} />

    <Section id="general-heading" title="General">
      <p class="leading-relaxed">Answer text.</p>
    </Section>
  </article>
</BaseLayout>
```

2. Add a nav entry in `src/data/navigation.ts`. `description` is required and appears on the home page:

```ts
export const navItems: NavItem[] = [
  // ... existing
  { href: '/faq', label: 'FAQ', description: 'Frequently asked questions.' },
];
```

3. Verify locally:

```sh
npm run dev      # check http://localhost:4321/faq (dev serves no trailing slash)
npm run build    # must succeed, output in dist/
npm run check    # must pass with no errors
```

4. No other file needs editing. `BaseLayout.astro` picks up the new nav item automatically, and the home page section index includes it. The production build emits `dist/faq/index.html` (URL `/faq/`) because `build.format` is `directory`; the dev server serves the same page at `/faq`.

## 12. How to Add a New Data Module

Steps to add a new data module `src/data/handouts.ts`:

1. Create `src/data/handouts.ts`:

```ts
export interface Handout {
  id: number;
  title: string;
  /** Source path under src/assets/materials, e.g. "handouts/freeze-checklist.pdf". */
  file: string;
  date: string;
}

export const handouts: Handout[] = [
  { id: 1, title: 'Freeze checklist', file: 'handouts/freeze-checklist.pdf', date: '24/08/2026' },
];
```

2. Re-export through the barrel `src/data/index.ts`:

```ts
// add to src/data/index.ts
export { handouts } from './handouts';
export type { Handout } from './handouts';
```

3. Consume from the barrel in a page, resolving PDF paths through `materialByFile`:

```astro
---
import { handouts, materialByFile } from '../data';
import { textLinkClass } from '../lib/ui';
---

<ul class="space-y-2">
  {handouts.map((h) => {
    const material = materialByFile[h.file];
    return (
      <li>
        {material ? <a href={`/materials/${material.path}/`} class={textLinkClass}>{h.title}</a> : h.title}
        <span class="text-sm text-muted-foreground"> - {h.date}</span>
      </li>
    );
  })}
</ul>
```

4. Put any referenced PDFs in `src/assets/materials/<kind>/` and run `npm run materials` so the generated lookup maps include them. Never put them in `public/`.

5. Verify:

```sh
npm run check
npm run build
```

Rules for data modules:

- Export a typed interface and a const array/object. Keep shapes flat and JSON-serializable.
- Always re-export through `src/data/index.ts` - consumers import from the barrel, never from `src/data/handouts.ts` directly.
- Keep one concern per file (`schedule.ts` for weeks, `assignments.ts` for assignments, etc.).
- Never edit `src/data/materials.generated.ts` by hand; regenerate it with `npm run materials`.

---

## Quick Reference

| Need | Do |
|---|---|
| Add a week | PDF to `src/assets/materials/slides/`, append to `weeks` in `src/data/schedule.ts`, run `npm run materials` |
| Add an assignment | Append to `assignments` in `src/data/assignments.ts` |
| Add a resource | Edit `src/data/resources.ts`, push to a group or add a group |
| Add a nav link | Append to `navItems` in `src/data/navigation.ts` (include `description`) |
| Add a policy | Append to `policies` in `src/data/policies.ts` |
| Add a page | Create `src/pages/<name>.astro` from the section 5 skeleton, add a nav entry |
| Add a data module | Create `src/data/<name>.ts`, re-export in `src/data/index.ts` |
| Change course info | Edit `src/data/course.ts` (`course`, `grading`, `prerequisites`) |
| Change the link style | Edit `textLinkClass` in `src/lib/ui.ts` |
| Check types | `npm run check` |
| Build | `npm run build` -> `dist/` |
