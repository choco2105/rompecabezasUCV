// ============================================
// CONSTANTES GLOBALES DEL JUEGO
// ============================================

export const GAME_VIEWBOX = {
  width: 800,
  height: 600,
} as const;

/** Paletas de color por región peruana */
export const THEME_BACKGROUNDS = {
  selva: 'from-green-200 via-emerald-300 to-green-400',
  sierra: 'from-amber-100 via-orange-200 to-rose-200',
  costa: 'from-sky-200 via-cyan-200 to-yellow-100',
  universal: 'from-violet-200 via-fuchsia-200 to-rose-200',
} as const;

export const AUDIO_DEFAULTS = {
  music: 0.3,
  sfx: 0.5,
  reward: 0.6,
} as const;

export const ANIMATION_DURATIONS = {
  pieceSnap: 300,
  starAppear: 400,
  starDelayBetween: 200,
} as const;

export const STORAGE_KEYS = {
  progress: 'rompecabezas:progress',
  audioMuted: 'rompecabezas:muted',
} as const;