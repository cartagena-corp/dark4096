export const BOARD_SIZE = 4
export const WIN_VALUE = 4096
export const GRID_SIZES = [3, 4, 5] as const
export const DEFAULT_GRID_SIZE = 4 as const
export const TIMED_MODE_DURATION = 90 * 1000 // 90 seconds in ms
export const DEFAULT_TIMER_SECONDS = 90
export const TIMER_PRESETS = [30, 60, 90, 120, 180] as const

export const STORAGE_KEYS = {
  BEST_SCORE: '4096_best_score',
  GAME_STATE: '4096_game_state',
  THEME: '4096_theme',
  GRID_SIZE: '4096_grid_size',
  GAME_MODE: '4096_game_mode',
  LEADERBOARD: '4096_leaderboard',
} as const

// Probability of spawning a 4 instead of a 2
export const SPAWN_4_PROBABILITY = 0.1

// Animation durations in ms
export const ANIMATION = {
  MOVE_DURATION: 100,
  MERGE_DURATION: 150,
  SPAWN_DURATION: 200,
  GAME_OVER_DELAY: 400,
} as const

// Tile value to CSS class mapping
export const TILE_COLORS: Record<number, { bg: string; fg: string; size: string }> = {
  2:    { bg: 'var(--tile-2-bg)',    fg: 'var(--tile-2-fg)',    size: 'text-3xl sm:text-4xl' },
  4:    { bg: 'var(--tile-4-bg)',    fg: 'var(--tile-4-fg)',    size: 'text-3xl sm:text-4xl' },
  8:    { bg: 'var(--tile-8-bg)',    fg: 'var(--tile-8-fg)',    size: 'text-3xl sm:text-4xl' },
  16:   { bg: 'var(--tile-16-bg)',   fg: 'var(--tile-16-fg)',   size: 'text-2xl sm:text-3xl' },
  32:   { bg: 'var(--tile-32-bg)',   fg: 'var(--tile-32-fg)',   size: 'text-2xl sm:text-3xl' },
  64:   { bg: 'var(--tile-64-bg)',   fg: 'var(--tile-64-fg)',   size: 'text-2xl sm:text-3xl' },
  128:  { bg: 'var(--tile-128-bg)',  fg: 'var(--tile-128-fg)',  size: 'text-xl sm:text-2xl' },
  256:  { bg: 'var(--tile-256-bg)',  fg: 'var(--tile-256-fg)',  size: 'text-xl sm:text-2xl' },
  512:  { bg: 'var(--tile-512-bg)',  fg: 'var(--tile-512-fg)',  size: 'text-xl sm:text-2xl' },
  1024: { bg: 'var(--tile-1024-bg)', fg: 'var(--tile-1024-fg)', size: 'text-lg sm:text-xl' },
  2048: { bg: 'var(--tile-2048-bg)', fg: 'var(--tile-2048-fg)', size: 'text-lg sm:text-xl' },
  4096: { bg: 'var(--tile-4096-bg)', fg: 'var(--tile-4096-fg)', size: 'text-base sm:text-lg' },
}

export function getTileColor(value: number) {
  if (TILE_COLORS[value]) return TILE_COLORS[value]
  return { bg: 'var(--tile-super-bg)', fg: 'var(--tile-super-fg)', size: 'text-sm sm:text-base' }
}
