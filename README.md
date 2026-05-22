# 4096 — The Number Tile Game

A modern, mobile-friendly take on the classic 2048-style tile-merging puzzle. Slide tiles, merge equal numbers, and chase the **4096** tile. Built with Next.js 16, React 19, TypeScript and Framer Motion.

> Join the numbers and get to the **4096** tile!

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [How to Play](#how-to-play)
- [Architecture](#architecture)
  - [Game Engine](#game-engine)
  - [State Management](#state-management)
  - [Rendering & Animation](#rendering--animation)
  - [Input Handling](#input-handling)
  - [Timed Mode](#timed-mode)
  - [Persistence](#persistence)
- [Internationalization (i18n)](#internationalization-i18n)
- [Theming](#theming)
- [Configuration & Constants](#configuration--constants)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- 🎯 **Classic tile-merging gameplay** — reach the 4096 tile to win, then keep going for a high score.
- 🔢 **Multiple grid sizes** — play on **3×3**, **4×4**, or **5×5** boards.
- ⏱️ **Two game modes** — *Classic* (no time limit) and *Timed* (configurable countdown).
- ↩️ **Undo** — revert your last move (one step of history).
- 🏆 **Leaderboard** — top scores stored locally, segmented by grid size and game mode.
- 🌗 **Light & dark themes** — with a no-flash, pre-paint theme script.
- 🌍 **4 languages** — English, Spanish, French and Portuguese, with automatic detection.
- 📱 **Mobile-first** — swipe controls, haptic feedback, responsive board sizing.
- ⚡ **Snappy animations** — tuned for maximum input responsiveness with Framer Motion.
- 💾 **Offline-friendly** — full game state, settings and scores persist in `localStorage`.

---

## Tech Stack

| Layer            | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (App Router, Turbopack)|
| UI library       | [React 19](https://react.dev)                           |
| Language         | [TypeScript 5.7](https://www.typescriptlang.org)        |
| State management | [Zustand 5](https://zustand-demo.pmnd.rs)               |
| Animation        | [Framer Motion 12](https://www.framer.com/motion)       |
| Styling          | [Tailwind CSS 4](https://tailwindcss.com)               |
| Icons            | [lucide-react](https://lucide.dev)                      |
| UI primitives    | [shadcn/ui](https://ui.shadcn.com) + Radix UI           |
| Fonts            | Nunito (via `next/font`)                                |
| Analytics        | [Vercel Analytics](https://vercel.com/analytics)        |

---

## Getting Started

### Prerequisites

- **Node.js 18.18+** (Node 20+ recommended)
- A package manager: `pnpm` (recommended — the repo ships a `pnpm-lock.yaml`), `npm`, or `yarn`

### Installation

```bash
# install dependencies
pnpm install
```

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
pnpm build   # create an optimized production build
pnpm start   # serve the production build
```

---

## Available Scripts

| Script          | Description                                  |
| --------------- | -------------------------------------------- |
| `pnpm dev`      | Start the Next.js development server.        |
| `pnpm build`    | Create an optimized production build.        |
| `pnpm start`    | Serve the production build.                  |
| `pnpm lint`     | Run ESLint across the project.               |

---

## Project Structure

```
4096/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout — fonts, metadata, theme script, I18nProvider
│   ├── page.tsx              # Game page — composition root & responsive board sizing
│   └── globals.css           # Tailwind base + CSS custom properties (color palette)
│
├── components/
│   ├── game/                 # Game-specific components
│   │   ├── Board.tsx         # Renders the grid, cells and animated tiles
│   │   ├── HUD.tsx           # Title, scores, selectors and action buttons
│   │   ├── ScoreCard.tsx     # Animated score / best-score chip
│   │   ├── GridSelector.tsx  # 3×3 / 4×4 / 5×5 picker
│   │   ├── GameModeSelector.tsx  # Classic / Timed picker
│   │   ├── TimerSelector.tsx # Countdown duration input + presets
│   │   ├── LanguageSelector.tsx  # Language dropdown (ES / EN / FR / PT)
│   │   ├── GameOverModal.tsx # Win / game-over dialog + leaderboard
│   │   ├── ConfirmModal.tsx  # Generic confirmation dialog
│   │   ├── Leaderboard.tsx   # Top-5 local scores
│   │   ├── SwipeIndicator.tsx# "Swipe to move" hint (mobile only)
│   │   └── Instructions.tsx  # "How to play" text
│   ├── ui/                   # shadcn/ui primitives (buttons, dialogs, etc.)
│   └── theme-provider.tsx    # next-themes provider wrapper
│
├── hooks/
│   ├── use-game-store.ts     # Zustand store — the single source of game truth
│   ├── use-game-timer.ts     # rAF-based countdown for Timed mode
│   ├── use-keyboard.ts       # Arrow-key / WASD input
│   ├── use-swipe.ts          # Touch swipe input
│   ├── use-theme.ts          # Light/dark theme state
│   └── use-i18n.tsx          # I18nProvider + useI18n() hook
│
├── lib/
│   ├── game/
│   │   └── engine.ts         # Pure game logic — board, moves, merges, win/lose
│   ├── storage/
│   │   └── persist.ts        # localStorage read/write helpers
│   ├── i18n/
│   │   └── translations.ts   # Dictionaries (4 languages) + locale detection
│   └── utils.ts              # cn() class-name helper
│
├── constants/
│   └── game.ts               # Board size, win value, storage keys, tile colors
│
├── types/
│   └── game.ts               # Core TypeScript types (Tile, GameState, etc.)
│
└── public/                   # Icons and static assets
```

---

## How to Play

1. **Move** all tiles in one direction with the arrow keys / **WASD**, or by **swiping** on touch devices.
2. When two tiles with the **same number** collide, they **merge** into a single tile of double the value.
3. Every move spawns a new tile (a `2`, or occasionally a `4`).
4. Reach the **4096** tile to win — then choose *Keep Going* to chase a higher score.
5. The game ends when the board is full and **no moves** are possible (or the timer runs out in *Timed* mode).

---

## Architecture

The codebase separates **pure logic** (the engine), **state** (a Zustand store), **rendering** (React components), and **side effects** (input hooks, persistence, timer). This keeps the game logic fully testable and framework-agnostic.

```
 input hooks ──▶ Zustand store ──▶ game engine (pure)
 (keyboard/swipe)      │                    │
                       ▼                    ▼
                  React render        localStorage
                  (Board/HUD)         (persistence)
```

### Game Engine

`lib/game/engine.ts` is **pure and stateless** (aside from a monotonic tile-ID counter). It owns all game rules:

- `createEmptyBoard(gridSize)` / `buildBoardFromTiles(tiles, gridSize)` — board construction.
- `spawnTile(board, gridSize)` — places a new tile on a random empty cell (`2` with 90% probability, `4` with 10%).
- `applyMove(tiles, direction, gridSize)` — the core move:
  1. Records every tile's previous position (used for slide animations).
  2. Normalizes the board to a "slide-left" problem via `transpose` / `reverseRows`.
  3. Slides and merges each row (`slideLeft`).
  4. Tags moved tiles with `prevRow` / `prevCol`, spawns a new tile, and computes `gameOver` / `gameWon`.
  5. Returns a `MoveResult`; if nothing moved, the move is a no-op.
- `hasMovesLeft(board, gridSize)` — detects game-over (no empty cells and no adjacent equal tiles).
- `initGame(...)` — fresh game state with two starting tiles.
- `snapshotHistory(state)` — deep-copies state for the undo feature.

**Merge rule:** each tile can only merge once per move; a freshly merged tile gets a new ID and is flagged `isMerged`.

### State Management

`hooks/use-game-store.ts` is a **Zustand store** that extends `GameState` with actions:

| Action                | Responsibility                                                        |
| --------------------- | --------------------------------------------------------------------- |
| `hydrate()`           | Loads grid size, mode, best score and any saved game from storage.    |
| `startNewGame()`      | Resets the board and clears the saved game.                           |
| `move(direction)`     | Runs the engine, updates score/best, persists state, records history. |
| `undo()`              | Restores the single previous snapshot.                                |
| `continueGame()`      | Dismisses the win modal so play can continue past 4096.               |
| `setGridSize(size)`   | Switches grid size and reloads the matching best score.               |
| `setGameMode(mode)`   | Switches game mode and reloads the matching best score.               |

The store is the **single source of truth**. Best scores and leaderboards are keyed per `gridSize` + `gameMode`, so each combination has its own records.

### Rendering & Animation

`components/game/Board.tsx` renders three layers absolutely positioned inside a rounded frame:

1. **Background cells** — a static grid of empty slots.
2. **Tiles** — `motion.div`s keyed by tile ID, translated via `x` / `y` transforms.
3. **Frame** — the board background and padding.

Each tile picks its `initial` state and `transition` based on its flags:

| Tile state | Initial            | Transition                  |
| ---------- | ------------------ | --------------------------- |
| New        | `scale: 0`         | `0.085s`, `backOut` (pop-in)|
| Merged     | `scale: 0.86`      | `0.1s`, `backOut` (pop)     |
| Moved      | previous position  | `0.07s`, `easeOut` (slide)  |
| Idle       | current position   | instant                     |

Durations are intentionally short to **maximize responsiveness** — the board can keep up with rapid input without feeling laggy.

The board is sized responsively by `useBoardDimensions` in `app/page.tsx`: it measures the viewport, derives a `gap` and a thinner outer `padding` (`gap × 0.7`), and computes a per-cell size capped at 140px.

### Input Handling

Two hooks translate raw input into `Direction` values:

- **`use-keyboard.ts`** — listens for arrow keys and `W` / `A` / `S` / `D`.
- **`use-swipe.ts`** — listens for touch gestures (min. distance 24px, perpendicular-ratio guard against diagonal mis-fires) with a short 55ms debounce and optional haptic feedback (`navigator.vibrate`).

> **Design note:** both hooks bind their event listeners **exactly once** and read the latest callback through a `ref`. Re-binding listeners on every move opened a tiny window where a keypress could land between *unbind* and *rebind* — a dropped move. Binding once eliminates that race and keeps input perfectly reliable under fast play.

Both hooks accept an `enabled` flag so input is ignored once the game is over.

### Timed Mode

`hooks/use-game-timer.ts` runs a `requestAnimationFrame` loop for smooth, drift-free countdowns. The timer:

- Starts on the **first move** (not when the mode is selected).
- Uses a wall-clock reference (`Date.now()`) so it stays accurate even if frames are dropped.
- Calls `onTimeUp()` when it hits zero, ending the game.

Duration is configurable via `TimerSelector` (10–600 seconds, with presets of 30 / 60 / 90 / 120 / 180).

### Persistence

`lib/storage/persist.ts` wraps `localStorage` with safe, try/catch'd helpers. All keys are namespaced under `4096_`:

| Key                    | Stores                                              |
| ---------------------- | --------------------------------------------------- |
| `4096_game_state`      | The in-progress game (tiles, score, flags).         |
| `4096_best_score_*`    | Best score, per grid size **and** game mode.        |
| `4096_grid_size`       | Last selected grid size.                            |
| `4096_game_mode`       | Last selected game mode.                            |
| `4096_leaderboard`     | Top-10 leaderboard entries.                         |
| `4096_theme`           | `light` or `dark`.                                  |
| `4096_locale`          | Manually chosen language (`es` / `en` / `fr` / `pt`).|

The game state is saved after **every move**, so a refresh resumes exactly where you left off.

---

## Internationalization (i18n)

The game ships in **4 languages**: English, Spanish, French and Portuguese.

- **No URL routing.** The locale is *not* part of the path or a query parameter — it lives entirely in client state and `localStorage` (`4096_locale`).
- **Manual switching.** The `LanguageSelector` (globe icon in the HUD) lets the player change language at any time; the choice is persisted.
- **Automatic detection** runs only when the user has *not* picked a language manually. `detectLocale()` resolves the locale in priority order:
  1. **Browser language** — the first match in `navigator.languages`.
  2. **Approximate location** — the device's IANA timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`) is mapped to a language. This is a coarse geographic hint that requires **no permission prompt** (e.g. `America/Sao_Paulo` → Portuguese, `Europe/Paris` → French, `America/Lima` → Spanish).
  3. **Fallback** — English.

### Implementation

- `lib/i18n/translations.ts` — typed translation dictionaries plus the detection logic. The `TranslationKey` type is derived from the English dictionary, so **every language must define every key** or the build fails.
- `hooks/use-i18n.tsx` — `I18nProvider` (mounted in `app/layout.tsx`) and the `useI18n()` hook, which exposes:
  - `locale` — the current `Locale`.
  - `setLocale(locale)` — switches and persists the language.
  - `t(key)` — returns the translated string for the active locale.

The provider also keeps `document.documentElement.lang` in sync with the active locale.

### Adding a new string

1. Add the key and its English value to the `en` object in `translations.ts`.
2. TypeScript will now require that key in `es`, `fr` and `pt` — add the translations.
3. Use it in a component: `const { t } = useI18n()` → `t('myNewKey')`.

### Adding a new language

1. Add the language code to the `Locale` type and the `LOCALES` array.
2. Add entries to `LOCALE_LABELS` and `LOCALE_SHORT`.
3. Add a full dictionary (`Record<TranslationKey, string>`) and register it in `translations`.
4. Optionally extend `detectFromTimezone()` with relevant timezones.

---

## Theming

- Two themes — **light** and **dark** — defined as CSS custom properties in `app/globals.css` (`:root` and `.dark`).
- The dark class is applied **before first paint** by a small inline script in `app/layout.tsx`, preventing a flash of the wrong theme.
- `hooks/use-theme.ts` manages the theme state and persists it to `localStorage`.
- The full warm color palette — board background, cell background, and a distinct color for every tile value from `2` to `4096` (plus a "super" color for higher values) — is themeable via CSS variables.

---

## Configuration & Constants

Key tunables live in `constants/game.ts`:

| Constant                | Default        | Description                                  |
| ----------------------- | -------------- | -------------------------------------------- |
| `BOARD_SIZE`            | `4`            | Default board dimension.                     |
| `WIN_VALUE`             | `4096`         | The tile value required to win.              |
| `GRID_SIZES`            | `[3, 4, 5]`    | Selectable grid sizes.                       |
| `TIMER_PRESETS`         | `30…180`       | Countdown presets (seconds).                 |
| `DEFAULT_TIMER_SECONDS` | `90`           | Default Timed-mode duration.                 |
| `SPAWN_4_PROBABILITY`   | `0.1`          | Chance a spawned tile is a `4` instead of `2`.|
| `STORAGE_KEYS`          | —              | All `localStorage` key names.                |
| `TILE_COLORS`           | —              | Per-value background / text color + font size.|

---

## Accessibility

- Semantic roles on the board (`role="grid"` / `role="gridcell"`) and modals (`role="dialog"`, `aria-modal`).
- `aria-label`s on tiles, buttons and score chips, localized through `t()`.
- `aria-live` regions announce score and board updates.
- The language `<html lang>` attribute is updated to match the active locale.
- Keyboard playable end-to-end (arrows / WASD).

---

## Deployment

The project is a standard Next.js app and deploys cleanly to [Vercel](https://vercel.com) (or any Node host):

```bash
pnpm build
pnpm start
```

On Vercel, every push to `main` builds and deploys automatically. Vercel Analytics is enabled in production builds only.

---

## License

This project is provided as-is for educational and personal use. No license file is currently included — add one if you intend to distribute it.
