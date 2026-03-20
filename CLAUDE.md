# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server at localhost:8080
npm run build        # production build → dist/
npm run lint         # ESLint (zero errors enforced in CI)
npx tsc --noEmit     # type-check without emitting files
npm test             # vitest run (single pass)
npm run test:watch   # vitest watch mode
```

CI (`.github/workflows/ci.yml`) runs `tsc --noEmit`, `eslint --max-warnings 0`, and `vite build` on every PR to main.

## Architecture

This is a React + TypeScript + Vite SPA. The `@` alias points to `src/`.

### Routing (`src/App.tsx`)
React Router v6. Routes: `/` (Index), `/about`, `/skills`, `/work`, `/lab`, `/privacy`, `*` (NotFound).

### Main experience (`src/pages/Index.tsx`)
A 600 vh tall scrollable div. `scrollProgress` (0–1) is the master control variable:
- drives the Three.js camera along a z-axis flythrough of the city
- controls which glass panel is visible (about 0.09–0.29, skills 0.29–0.44, work 0.44–0.59)
- fades the hero overlay in/out
- triggers UX hints and the contact billboard at the end

### 3D Scene (`src/components/CityScene.tsx`)
`@react-three/fiber` Canvas with `@react-three/drei` helpers. Key sub-components all in this one file:
- **`CameraController`** — lerps camera position based on `scrollProgress`
- **`NavigationStalls`** — 5 interactive 3D kiosk panels at `x = side * 7`, each triggering `onStallClick(id)` which navigates to `/about|skills|work|lab` or scrolls to contact
- **`StreetProps`** — procedurally placed cars, trash cans, manholes, puddles (seeded via `useMemo`)
- **`CityEnvironment`** — buildings, lamps, neon accents, signs, rain particles, steam vents
- Buildings are procedurally generated with `xOff = 12–18` from center; inner face guaranteed ≥ 10.5 from road center. Stalls sit at x=7 (on the sidewalk, in front).

### Content data (`src/content/sections.ts`)
**Edit this file to update all content.** It exports `ABOUT`, `SKILLS`, `WORK`, `LAB` objects with typed arrays. Both the glass panel teasers in `Index.tsx` and the full section pages read from here.

### Section pages (`src/pages/sections/`)
Four full scrollable pages sharing `SectionShell.tsx` (sticky header + back-to-city button + next-section footer). They import all content from `src/content/sections.ts`.

### Glass panels
Fixed-position overlays in `Index.tsx` that slide in/out based on `scrollProgress`. Each shows a teaser + `ENTER ↗` button that navigates to the full section page. Panel content is rendered from `sections.ts` data.

### Fonts & styling
Inline styles throughout (no CSS modules). Two fonts loaded in `index.html`: `Syne` (headings, labels) and `Inter` (body). Color palette: background `#050512`, bright text `#F0F0F5`, dim text `#8888AA`, muted `#44445A`, border `#1E1E2E`, primary accent `#6E6EFF`.

### UI component library (`src/components/ui/`)
Full shadcn/ui set — used only in the contact billboard form and toasts. Not used in the 3D scene or section pages.

## GitHub token
Stored in `.env` as `GH_TOKEN` (gitignored). Required scope: `public_repo` for creating PRs.
