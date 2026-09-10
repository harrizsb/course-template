# Agent Directives

## Stack & Context
- Astro (Strict SSG), Starwind UI (via MCP), Tailwind, Cloudflare Pages.
- Always query Starwind MCP for components, tokens, and accessibility rules before generating code.
- Always load the kaplay-3001 skill and query the kaplay MCP before writing game code.
- Kaplay is pinned to exactly kaplay@3001.0.19. Never mix kaplay@4000-alpha idioms. Gravity is setGravity() after kaplay(), never a kaplay({ gravity }) option.

## The Lego Rule (UI Composition)
Compose pages using existing Starwind components (Legos). 
- **Do:** Arrange, nest, and combine existing blocks.
- **Don't:** Invent custom UI primitives. No `<style>` blocks, custom CSS, or arbitrary Tailwind classes to build new elements.
- **Fallback:** If a request requires a "custom Lego", state the violation and propose a layout using only existing Starwind blocks.

## Astro Constraints
- **Zero-JS Default:** Maximize static HTML/CSS. 
- **Hydration:** Interactive components require `client:visible` or `client:idle`. `client:load` is forbidden.
- **Routing:** File-based. Dynamic routes require `getStaticPaths()`.
- **Assets:** Use `<Image />` from `astro:assets` for local images.

## Commits
- **Conventional Commits 1.0.0, always.** Every commit message MUST match `<type>[optional scope]: <description>`, using `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`. Example: `feat(schedule): add week 14 review session`.
- **Subject:** imperative mood, lowercase, no trailing period, 72 characters or fewer.
- **Body:** required when the change is not self-evident; explain why, not what. Wrap at 72 characters.
- **Breaking changes:** append `!` after the type/scope and add a `BREAKING CHANGE:` footer.
- **One logical change per commit.** Never mix a refactor with a feature or a formatting sweep.
- **Never** use `--no-verify` to bypass hooks, and never rewrite published history with `--force`; use `--force-with-lease` only on an unshared branch you own.

## Orchestration
- **Fan-out and fan-in, proactively.** For any non-trivial task, decompose it into independent slices and dispatch them as parallel subagents in a single batch. Fan out only independent units with disjoint file ownership; verify no overlap before spawn to avoid clobbering. Fan in by consolidating results and verifying the merged tree (via build/test) before declaring done. Never serialize work that can run concurrently, and never delegate the top-level plan.

## Output
- Concise, production-ready Astro code only. No explanations unless asked.
- **Engineering principles:** Guide load-bearing code with SOLID; apply YAGNI and avoid abstractions without a clear responsibility or a real consumer need.
