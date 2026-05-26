// ============================================
// TIPOS DEL JUEGO — Rompecabezas para Niños
// ============================================

/**
 * Tema visual del nivel (escenario de fondo)
 */
export type Theme =
  | 'jungle'
  | 'farm'
  | 'ocean'
  | 'garden'
  | 'sky'
  | 'snow';

/**
 * Punto en coordenadas SVG
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Estilo de animación al colorear el personaje (Fase 2)
 */
export type FillAnimation = 'splash' | 'wipe' | 'expand' | 'confetti';

/**
 * Cantidad de piezas del rompecabezas (Fase 3)
 */
export type PieceCount = 3 | 4 | 6;

/**
 * Estilo de corte del rompecabezas
 */
export type CutStyle = 'horizontal' | 'grid';

/**
 * Sonido de recompensa al completar nivel
 */
export type RewardSound = 'soft-bell' | 'sparkle' | 'chime' | 'magic';

/**
 * Definición completa de un nivel del juego
 */
export interface Level {
  // Identificación
  id: string;                  // ej: "rabbit-01"
  order: number;               // orden en el catálogo (1-8)
  theme: Theme;
  
  // Información visual (sin texto para niños)
  emoji: string;               // emoji que representa al personaje (para selector)
  fillColor: string;           // color principal del personaje
  accentColor: string;         // color secundario
  
  // FASE 1 — Trazado del contorno
  tracingPath: string;         // atributo "d" del SVG path
  tracingStart: Point;         // punto donde comienza el trazo
  tracingTolerance: number;    // px de tolerancia al trazar (default 45)
  
  // FASE 2 — Coloreado animado
  characterSvg: string;        // ruta al SVG del personaje coloreado
  fillAnimation: FillAnimation;
  
  // FASE 3 — Rompecabezas
  puzzlePieces: PieceCount;
  cutStyle: CutStyle;
  pieceTolerance: number;      // px para snap (default 40)
  
  // Audio
  rewardSound: RewardSound;
}

/**
 * Estado del progreso del jugador en un nivel
 */
export interface LevelProgress {
  levelId: string;
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
}

/**
 * Fases del juego en un nivel
 */
export type GamePhase = 'tracing' | 'coloring' | 'puzzle' | 'achievement';

/**
 * Estado de una pieza del rompecabezas
 */
export interface PuzzlePiece {
  id: number;
  currentPosition: Point;
  targetPosition: Point;
  isSnapped: boolean;
  rotation: number;
}