// ============================================
// UTILIDADES MATEMÁTICAS PARA EL TRAZADO
// ============================================

import type { Point } from './types';

/**
 * Calcula la distancia euclidiana entre dos puntos
 */
export function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Pre-calcula N puntos equidistantes a lo largo de un SVG path
 * Útil para detectar dónde está el dedo del niño en el contorno
 */
export function samplePathPoints(
  pathElement: SVGPathElement,
  samples: number = 200
): Point[] {
  const totalLength = pathElement.getTotalLength();
  const points: Point[] = [];

  for (let i = 0; i <= samples; i++) {
    const distance = (i / samples) * totalLength;
    const svgPoint = pathElement.getPointAtLength(distance);
    points.push({ x: svgPoint.x, y: svgPoint.y });
  }

  return points;
}

/**
 * Convierte coordenadas de pantalla (pixeles del mouse/dedo) 
 * a coordenadas internas del SVG (viewBox)
 */
export function screenToSvg(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number
): Point {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;

  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };

  const svgPoint = point.matrixTransform(ctm.inverse());
  return { x: svgPoint.x, y: svgPoint.y };
}

/**
 * Encuentra el índice del punto del path más cercano al dedo,
 * pero SOLO buscando hacia adelante desde el último progreso.
 * Esto fuerza al niño a trazar en orden (no saltar adelante).
 */
export function findNextPathPoint(
  pathPoints: Point[],
  fingerPos: Point,
  lastIndex: number,
  tolerance: number,
  lookAhead: number = 25
): number {
  let bestIndex = -1;
  let bestDistance = tolerance;

  // Buscar solo en una ventana hacia adelante
  const startSearch = Math.max(0, lastIndex - 2); // permitir leve retroceso
  const endSearch = Math.min(pathPoints.length - 1, lastIndex + lookAhead);

  for (let i = startSearch; i <= endSearch; i++) {
    const d = distance(pathPoints[i], fingerPos);
    if (d < bestDistance) {
      bestDistance = d;
      bestIndex = i;
    }
  }

  return bestIndex; // -1 si no se encontró nada cercano
}

/**
 * Verifica si el dedo está cerca del punto de inicio del trazado
 */
export function isNearStart(
  fingerPos: Point,
  startPos: Point,
  tolerance: number
): boolean {
  return distance(fingerPos, startPos) <= tolerance;
}