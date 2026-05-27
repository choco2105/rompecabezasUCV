// ============================================
// TIPOS DEL JUEGO — Rompecabezas Intercultural Perú
// ============================================

export type Theme = 'selva' | 'sierra' | 'costa' | 'universal';

export interface Point {
  x: number;
  y: number;
}

export type PieceCount = 4 | 6 | 9;

export interface Level {
  id: string;
  order: number;
  theme: Theme;

  // Visual
  imageSrc: string;
  thumbnail?: string;
  emoji: string;
  /**
   * Posición CSS de la imagen al recortarse a cuadrado.
   * Formato: "X% Y%" donde 0% es izquierda/arriba y 100% es derecha/abajo.
   * Por defecto "50% 50%" (centro). Para animales con cara descentrada
   * hacia arriba, usar "50% 25%" o "50% 30%".
   */
  imagePosition?: string;

  // Información educativa
  nombre: string;
  region: string;
  dato: string;

  // Mecánica
  puzzlePieces: PieceCount;
  pieceTolerance: number;
}

export interface LevelProgress {
  levelId: string;
  completed: boolean;
}

export interface PuzzlePiece {
  id: number;
  currentPosition: Point;
  targetPosition: Point;
  isSnapped: boolean;
  rotation: number;
}