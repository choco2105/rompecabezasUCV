// ============================================
// GEOMETRÍA DE LAS PIEZAS DEL ROMPECABEZAS
// 4 piezas en cuadrícula 2x2, dispersión aleatoria
// El bounding box se calcula dinámicamente por personaje
// ============================================

import type { Point, PieceCount, CutStyle } from './types';

export interface PieceRegion {
  id: number;
  clipX: number;
  clipY: number;
  clipWidth: number;
  clipHeight: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  rotation: number;
}

const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 600;

/**
 * Calcula el bounding box de un path SVG analizando sus coordenadas.
 * Extrae todos los pares (x,y) del atributo "d" del path.
 */
export function calculateBBoxFromPath(pathD: string) {
  // Extraer todos los números del path (incluyendo decimales y negativos)
  const numbers = pathD.match(/-?\d+\.?\d*/g);
  if (!numbers || numbers.length < 2) {
    return { x: 100, y: 100, width: 600, height: 400 };
  }

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  // Los números vienen en pares (x, y)
  for (let i = 0; i < numbers.length - 1; i += 2) {
    const x = parseFloat(numbers[i]);
    const y = parseFloat(numbers[i + 1]);
    if (!isNaN(x) && !isNaN(y)) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  // Agregar margen para que las piezas tengan colchón visual
  const margin = 30;
  return {
    x: Math.max(0, minX - margin),
    y: Math.max(0, minY - margin),
    width: Math.min(VIEWBOX_WIDTH, maxX - minX + margin * 2),
    height: Math.min(VIEWBOX_HEIGHT, maxY - minY + margin * 2),
  };
}

/**
 * Mezcla un array aleatoriamente (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Genera 4 piezas en cuadrícula 2x2 sobre el bounding box del personaje.
 * Las posiciones de dispersión se asignan aleatoriamente a las 4 esquinas
 * de la pantalla, con rotación ligera para parecer "tiradas".
 */
export function generatePieces(
  _count: PieceCount,
  _cutStyle: CutStyle,
  pathD: string
): PieceRegion[] {
  const bbox = calculateBBoxFromPath(pathD);
  const pieceWidth = bbox.width / 2;
  const pieceHeight = bbox.height / 2;

  const positions = [
    { col: 0, row: 0 },
    { col: 1, row: 0 },
    { col: 0, row: 1 },
    { col: 1, row: 1 },
  ];

  // Esquinas de la pantalla donde dispersar piezas
  const corners = [
    { x: 90, y: 90 },
    { x: VIEWBOX_WIDTH - 90, y: 90 },
    { x: 90, y: VIEWBOX_HEIGHT - 90 },
    { x: VIEWBOX_WIDTH - 90, y: VIEWBOX_HEIGHT - 90 },
  ];

  // Mezclar las esquinas para que las piezas no siempre vayan al mismo lugar
  const shuffledCorners = shuffleArray(corners);

  return positions.map((pos, i) => {
    const corner = shuffledCorners[i];
    // Pequeña variación aleatoria dentro de cada esquina (±25 px)
    const jitterX = (Math.random() - 0.5) * 50;
    const jitterY = (Math.random() - 0.5) * 50;
    // Rotación aleatoria entre -20° y +20°
    const rotation = (Math.random() - 0.5) * 40;

    return {
      id: i,
      clipX: bbox.x + pos.col * pieceWidth,
      clipY: bbox.y + pos.row * pieceHeight,
      clipWidth: pieceWidth,
      clipHeight: pieceHeight,
      targetX: bbox.x + pos.col * pieceWidth + pieceWidth / 2,
      targetY: bbox.y + pos.row * pieceHeight + pieceHeight / 2,
      startX: corner.x + jitterX,
      startY: corner.y + jitterY,
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

export { VIEWBOX_WIDTH, VIEWBOX_HEIGHT };