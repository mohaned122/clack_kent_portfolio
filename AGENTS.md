# AGENTS.md

## Project Overview

Angular 21.1.x single-page portfolio site. Two routes: Home (`/`) and Blog (`/blog`).

## Key Commands

- `npm start` — dev server at localhost:4200
- `npm run build` — production build to `dist/`
- `npm test` — Vitest unit tests
- `ng generate component <name>` — scaffold component

## Architecture

- **Standalone components** (no NgModules). Root bootstrap in `src/main.ts`.
- **Routes**: `src/app/app.routes.ts`. Home component renders all sections via fragment-based scrolling (`ScrollService`).
- **Legacy jQuery initialization**: `HomeComponent` calls a global `clarkInit()` declared via `declare function clarkInit(): void`. This function is defined in `public/js/clark-site.js` and wired via script tags in the HTML. Do not remove this bridge.
- **Static assets** in `public/` — images, fonts, legacy JS (jQuery, Bootstrap, Owl Carousel, etc.), and CSS.
- **Global styles** loaded from two files: `src/styles.scss` and `src/scss/style.scss`.

## Styling

- **SCSS** with a vendored Bootstrap 4 SCSS source tree at `src/scss/bootstrap/`. Do not `@import 'bootstrap'` expecting node_modules — the imports reference this local copy.
- Custom color vars in `src/scss/style.scss` (`$primary: #ffbd39`, `$secondary: #a0f669`, `$black: #000000`).
- `angular.json` silences several Sass deprecation warnings (`import`, `global-builtin`, `color-functions`, `slash-div`, `if-function`).
- Inline styles use SCSS (`inlineStyleLanguage: "scss"`).
- Don't step over use the same Design

## Code Conventions

- Component selector prefix: `app`. Files follow `name.component.ts` + `name.html` + `name.scss` pattern in feature folders under `src/app/`.
- `angular.json` schematics: `skipTests: true` for all generated components, services, pipes, etc. — no test files are scaffolded by default.
- Prettier (in `package.json`): 100 char width, single quotes, Angular parser for HTML.
- EditorConfig: 2-space indent, single quotes for TS.
- TypeScript strict mode enabled (`strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`).

## Gotchas

- The `public/` directory is served as static assets (configured in `angular.json` under `assets`). Files here are NOT compiled — they are copied as-is to `dist/`.
- `HomeComponent` has no test file and its `ngAfterViewInit` depends on the global `clarkInit` function. If you restructure this component, preserve the lifecycle hook.
- Production build has budgets: initial bundle warning at 800kB, error at 1.5MB.
- No e2e test framework is configured.

## Mandatory Agent Workflow

Before executing **ANY command**, the agent MUST:

1. Identify the skills required for the current task.
2. Download/load all necessary skills.
3. Verify that the required skills are available.
4. Inspect the existing project structure and relevant files.
5. Reuse existing code, assets, services, and components whenever possible.
6. Only then execute commands or make changes.

**NEVER run a command before downloading/loading the necessary skills.**

## Repository Cleanliness

- **Do not fill the repository with AI-generated or scraped content.**
- Do not scrape websites or copy their content/assets into the project unless explicitly requested.
- Do not create unnecessary files or folders.
- Do not generate duplicate components, services, styles, assets, or configuration.
- Do not create temporary files inside the project directory.
- Remove temporary artifacts before finishing.
- Prefer modifying existing files over creating new ones.
- Before creating a new file, verify that an existing file cannot be reused.
- Only create files that are required for the requested functionality.
- Keep the repository clean, minimal, and production-ready.

## Animation Guidelines

- Maintain **one coherent animation language** across the entire website.
- Do not mix unrelated animation libraries, animation styles, or visual effects without a clear design reason.
- Prefer subtle, smooth, purposeful animations over flashy effects.
- Reuse the same transition timing, easing, duration, and reveal patterns throughout the site.
- Avoid excessive particles, parallax, 3D effects, bouncing elements, animated backgrounds, and competing motion effects.
- Each section should feel like part of the same design system.
- Do not introduce a new animation style simply because it looks impressive in isolation.
- Before adding an animation, check the existing animation system and reuse it whenever possible.
- **Do not add multiple animation libraries when the existing project already provides an adequate solution.**
- Prioritize performance and accessibility. Respect `prefers-reduced-motion`.
- Animations must support the content and user experience, not distract from it.
