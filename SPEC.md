# Project Specification: Astro + Starwind UI

## 1. Technology Stack
* **Framework:** Astro (Strict Static Site Generation)
* **UI System:** Starwind UI
* **Styling Engine:** Tailwind CSS (Zero-runtime)
* **Hosting:** Cloudflare Pages

## 2. Architecture & Rendering
* **Static-First:** 100% SSG. Server-Side Rendering (SSR) and on-demand rendering are strictly disabled.
* **Zero-JS Default:** Pages must render as pure HTML/CSS by default.
* **Islands Architecture:** Interactive elements must be isolated in Astro islands using `client:visible` or `client:idle`. `client:load` is prohibited to maintain optimal Time to Interactive (TTI).
* **Ads-Serving Ready:** The site is developed with ad serving in mind. Ad slots are first-class layout elements (currently a right-rail placeholder on desktop) rendered server-side as static markup using Starwind tokens. Third-party ad scripts are the only permitted JavaScript and MUST be served to the end-user as client-side bundles via Astro islands with `client:idle` (never `client:load`), not via SSR. The core page stays pure HTML/CSS until the ad script hydrates in the browser. A tiny fraction of JavaScript for ad delivery is expected in production; all other interactivity remains island-based per the rules above.

## 3. UI & Styling Constraints
* **Opinionated Composition:** UI must be built exclusively by composing existing Starwind UI components.
* **No Custom Primitives:** Inventing custom base UI elements using raw Tailwind classes or custom CSS is forbidden.
* **Zero Custom CSS:** No `<style>` blocks or external custom CSS files. All styling must flow through Starwind's Tailwind implementation and design tokens.

## 4. Asset Management
* **Images:** All local images must be processed via `astro:assets` `<Image />` component for automatic optimization.
* **Remote Media:** Remote images should be routed through Cloudflare's image resizing pipeline where applicable.
* **Course Materials (PDFs):** Source PDFs live under `src/assets/materials/{slides,rubrics,handouts}/`. They are never served as files. `npm run materials` (wired as `predev`, `prebuild`, and `precheck` via `scripts/encode-materials.mjs`) walks that directory and emits `src/data/materials.generated.ts`, inlining every PDF as a base64 `data:` URI. The generated schedule links point at `/materials/<path>/` preview pages (`src/pages/materials/[...path].astro`, strict SSG via `getStaticPaths()`), which embed the PDF through `<object type="application/pdf" data="data:application/pdf;base64,...">` plus a download fallback link. Consequences: `dist/` contains zero `.pdf` files, no direct file route exists to enumerate or scrape, every preview page is discoverable only from its schedule row, and each page carries only its own document.

To add a week's material: drop the PDF into `src/assets/materials/<kind>/`, reference it as `materials: ['<kind>/<file>.pdf']` in `src/data/schedule.ts` (a week may list several documents), and run `npm run materials`. Never add PDFs to `public/`.

## 5. Deployment Pipeline (Cloudflare Pages)
* **Build Command:** `npm run build` (or package manager equivalent).
* **Output Directory:** `dist`.
* **Runtime:** Static (No Node.js runtime in production).
* **Caching Strategy:**
  * `/assets/*`: Aggressive edge caching (1 year).
  * HTML files: `no-cache` or short TTL to ensure instant rollbacks and content freshness.

## 6. Course Content Notes
* **Sample data:** All content under `src/data/` is sample content for a CS 499 course. It is deliberately Astro-based (not SvelteKit, the previous template generation). When swapping in real course data, update the modules in place; do not change the shapes or the file layout.

## 7. Commits
* **Conventional Commits 1.0.0:** every commit MUST use the format `<type>[optional scope]: <description>` with one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
* Subject in imperative mood, lowercase, no trailing period, at most 72 characters.
* One logical change per commit; never mix refactors with features or formatting sweeps.
* Breaking changes: `!` after the type/scope plus a `BREAKING CHANGE:` footer.
