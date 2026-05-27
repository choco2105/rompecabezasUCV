// ============================================
// GEOMETRÍA DEL ROMPECABEZAS CON IMÁGENES JPG
// ============================================

import type { Point, PieceCount } from './types';

export interface PieceRegion {
  id: number;
  row: number;
  col: number;
  // Posición ORIGEN (donde debe encajar) en el SVG
  targetX: number;
  targetY: number;
  // Posición INICIAL (dispersa)
  startX: number;
  startY: number;
  // Rotación inicial
  rotation: number;
}

const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 600;

// Tamaño del puzzle armado (cuadrado centrado en el viewbox)
export const PUZZLE_SIZE = 380;
export const PUZZLE_OFFSET_X = (VIEWBOX_WIDTH - PUZZLE_SIZE) / 2;
export const PUZZLE_OFFSET_Y = (VIEWBOX_HEIGHT - PUZZLE_SIZE) / 2;

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Calcula filas y columnas según cantidad de piezas
 */
function getGrid(count: PieceCount): { rows: number; cols: number } {
  switch (count) {
    case 4:
      return { rows: 2, cols: 2 };
    case 6:
      return { rows: 2, cols: 3 };
    case 9:
      return { rows: 3, cols: 3 };
    default:
      return { rows: 2, cols: 2 };
  }
}

/**
 * Calcula posiciones de dispersión alrededor del puzzle
 * (sin pisarlo, distribuidas en los márgenes)
 */
function getScatterPositions(count: number): Point[] {
  const margin = 80;
  const positions: Point[] = [];

  // Lado izquierdo
  positions.push({ x: margin, y: margin + 30 });
  positions.push({ x: margin, y: VIEWBOX_HEIGHT / 2 });
  positions.push({ x: margin, y: VIEWBOX_HEIGHT - margin - 30 });

  // Lado derecho
  positions.push({ x: VIEWBOX_WIDTH - margin, y: margin + 30 });
  positions.push({ x: VIEWBOX_WIDTH - margin, y: VIEWBOX_HEIGHT / 2 });
  positions.push({ x: VIEWBOX_WIDTH - margin, y: VIEWBOX_HEIGHT - margin - 30 });

  // Si faltan, agregar arriba y abajo
  positions.push({ x: VIEWBOX_WIDTH / 2 - 100, y: margin });
  positions.push({ x: VIEWBOX_WIDTH / 2 + 100, y: VIEWBOX_HEIGHT - margin });
  positions.push({ x: VIEWBOX_WIDTH / 2, y: margin });

  return positions.slice(0, count);
}

export function generatePieces(count: PieceCount): PieceRegion[] {
  const { rows, cols } = getGrid(count);
  const pieceWidth = PUZZLE_SIZE / cols;
  const pieceHeight = PUZZLE_SIZE / rows;

  const positions: { row: number; col: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions.push({ row: r, col: c });
    }
  }

  const scatterPos = shuffleArray(getScatterPositions(positions.length));

  return positions.map((pos, i) => {
    const scatter = scatterPos[i];
    const jitterX = (Math.random() - 0.5) * 30;
    const jitterY = (Math.random() - 0.5) * 30;
    const rotation = (Math.random() - 0.5) * 30;

    return {
      id: i,
      row: pos.row,
      col: pos.col,
      targetX: PUZZLE_OFFSET_X + pos.col * pieceWidth + pieceWidth / 2,
      targetY: PUZZLE_OFFSET_Y + pos.row * pieceHeight + pieceHeight / 2,
      startX: scatter.x + jitterX,
      startY: scatter.y + jitterY,
      rotation,
    };
  });
}

export function isPieceNearTarget(
  current: Point,
  target: Point,
  tolerance: number
): boolean {
  const dx = current.x - target.x;
  const dy = current.y - target.y;
  return Math.sqrt(dx * dx + dy * dy) <= tolerance;
}

export function getPieceDimensions(count: PieceCount) {
  const { rows, cols } = getGrid(count);
  return {
    width: PUZZLE_SIZE / cols,
    height: PUZZLE_SIZE / rows,
    rows,
    cols,
  };
}

export { VIEWBOX_WIDTH, VIEWBOX_HEIGHT };