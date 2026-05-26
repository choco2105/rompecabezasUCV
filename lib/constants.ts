// ============================================
// CONSTANTES GLOBALES DEL JUEGO
// ============================================

/** Dimensiones del SVG del juego (área de trabajo) */
export const GAME_VIEWBOX = {
  width: 800,
  height: 600,
} as const;

/** Paletas de color por tema (Tailwind classes) */
export const THEME_BACKGROUNDS = {
  jungle: 'from-emerald-200 via-green-300 to-emerald-400',
  farm: 'from-yellow-200 via-amber-200 to-orange-300',
  ocean: 'from-cyan-200 via-blue-300 to-blue-500',
  garden: 'from-pink-200 via-rose-200 to-purple-200',
  sky: 'from-blue-200 via-indigo-200 to-purple-300',
  snow: 'from-slate-100 via-blue-100 to-cyan-200',
} as const;

/** Volúmenes por defecto (0.0 a 1.0) */
export const AUDIO_DEFAULTS = {
  music: 0.3,
  sfx: 0.5,
  reward: 0.6,
} as const;

/** Duración de animaciones (ms) */
export const ANIMATION_DURATIONS = {
  fillAnimation: 1500,      // duración del coloreado fase 2
  pieceSnap: 300,           // bounce al encajar pieza
  starAppear: 400,          // aparición de cada estrella
  starDelayBetween: 200,    // delay entre estrellas
  characterIdle: 2000,      // ciclo de respiración del personaje
} as const;

/** Configuración del LocalStorage para progreso */
export const STORAGE_KEYS = {
  progress: 'rompecabezas:progress',
  audioMuted: 'rompecabezas:muted',
} as const;