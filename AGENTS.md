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
