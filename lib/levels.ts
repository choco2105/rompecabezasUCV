// ============================================
// CATÁLOGO DE NIVELES — 8 niveles iniciales
// ============================================
// Paths SVG de personajes diseñados para trazado infantil:
// - Una sola línea continua (cerrada con Z)
// - Curvas suaves, sin esquinas cerradas
// - Reconocibles a primera vista

import type { Level } from './types';

export const levels: Level[] = [
  {
    id: 'rabbit-01',
    order: 1,
    theme: 'jungle',
    emoji: '🐰',
    fillColor: '#FFFFFF',
    accentColor: '#FFB6C1',
    // Conejo: cuerpo redondo + 2 orejas
    tracingPath:
      'M 400 460 C 320 460 280 420 280 360 C 280 320 300 290 320 270 C 310 240 305 200 310 150 C 315 110 340 110 345 150 C 350 200 345 240 355 270 C 370 260 400 260 430 260 C 445 260 430 260 445 270 C 455 240 450 200 455 150 C 460 110 485 110 490 150 C 495 200 490 240 480 270 C 500 290 520 320 520 360 C 520 420 480 460 400 460 Z',
    tracingStart: { x: 400, y: 460 },
    tracingTolerance: 50,
    characterSvg: '/characters/rabbit.svg',
    fillAnimation: 'splash',
    puzzlePieces: 3,
    cutStyle: 'horizontal',
    pieceTolerance: 40,
    rewardSound: 'soft-bell',
  },
  {
    id: 'fish-02',
    order: 2,
    theme: 'ocean',
    emoji: '🐟',
    fillColor: '#FFA500',
    accentColor: '#FF6347',
    // Pez: cuerpo ovalado + cola triangular
    tracingPath:
      'M 220 300 C 220 230 280 200 360 200 C 460 200 530 240 560 290 C 600 250 640 240 660 230 C 660 290 650 310 660 370 C 640 360 600 350 560 310 C 530 360 460 400 360 400 C 280 400 220 370 220 300 Z',
    tracingStart: { x: 220, y: 300 },
    tracingTolerance: 50,
    characterSvg: '/characters/fish.svg',
    fillAnimation: 'wipe',
    puzzlePieces: 3,
    cutStyle: 'horizontal',
    pieceTolerance: 40,
    rewardSound: 'sparkle',
  },
  {
    id: 'butterfly-03',
    order: 3,
    theme: 'garden',
    emoji: '🦋',
    fillColor: '#FF69B4',
    accentColor: '#9370DB',
    // Mariposa: 2 alas grandes con cuerpo central
    tracingPath:
      'M 400 410 C 380 380 365 360 355 340 C 340 360 320 380 290 390 C 245 405 195 395 175 360 C 155 320 175 280 215 265 C 175 250 140 215 130 175 C 115 110 165 75 220 95 C 270 115 310 160 340 210 C 360 245 380 280 395 320 C 405 340 405 365 400 390 C 405 365 415 345 425 320 C 440 280 460 245 480 210 C 510 160 550 115 600 95 C 655 75 705 110 690 175 C 680 215 645 250 605 265 C 645 280 665 320 645 360 C 625 395 575 405 530 390 C 500 380 480 360 465 340 C 455 360 440 380 420 410 Z',
    tracingStart: { x: 400, y: 410 },
    tracingTolerance: 55,
    characterSvg: '/characters/butterfly.svg',
    fillAnimation: 'confetti',
    puzzlePieces: 3,
    cutStyle: 'horizontal',
    pieceTolerance: 40,
    rewardSound: 'sparkle',
  },
  {
    id: 'cat-04',
    order: 4,
    theme: 'garden',
    emoji: '🐱',
    fillColor: '#FFA07A',
    accentColor: '#FFFFFF',
    // Gato: cara redonda con 2 orejas triangulares
    tracingPath:
      'M 400 460 C 310 460 250 400 250 320 C 250 290 260 270 270 250 C 250 210 240 170 260 150 C 280 140 310 170 330 210 C 350 200 380 195 400 195 C 420 195 450 200 470 210 C 490 170 520 140 540 150 C 560 170 550 210 530 250 C 540 270 550 290 550 320 C 550 400 490 460 400 460 Z',
    tracingStart: { x: 400, y: 460 },
    tracingTolerance: 50,
    characterSvg: '/characters/cat.svg',
    fillAnimation: 'expand',
    puzzlePieces: 4,
    cutStyle: 'grid',
    pieceTolerance: 40,
    rewardSound: 'chime',
  },
  {
    id: 'duck-05',
    order: 5,
    theme: 'farm',
    emoji: '🦆',
    fillColor: '#FFD700',
    accentColor: '#FF8C00',
    // Pato: cuerpo ovalado + cabeza redonda + pico
    tracingPath:
      'M 250 400 C 230 380 230 340 250 320 C 240 300 240 270 270 270 C 290 240 330 230 380 240 C 400 200 430 180 470 180 C 510 180 540 210 540 240 C 580 240 600 250 600 260 C 600 270 580 280 560 280 C 580 310 580 350 560 380 C 540 410 480 430 400 430 C 320 430 270 420 250 400 Z',
    tracingStart: { x: 250, y: 400 },
    tracingTolerance: 50,
    characterSvg: '/characters/duck.svg',
    fillAnimation: 'splash',
    puzzlePieces: 4,
    cutStyle: 'grid',
    pieceTolerance: 40,
    rewardSound: 'soft-bell',
  },
  {
    id: 'star-06',
    order: 6,
    theme: 'sky',
    emoji: '⭐',
    fillColor: '#FFD700',
    accentColor: '#FFA500',
    // Estrella de 5 puntas (con puntas redondeadas para suavizar el trazo)
    tracingPath:
      'M 400 180 L 437 290 L 555 290 L 460 360 L 495 470 L 400 405 L 305 470 L 340 360 L 245 290 L 363 290 Z',
    tracingStart: { x: 400, y: 180 },
    tracingTolerance: 50,
    characterSvg: '/characters/star.svg',
    fillAnimation: 'confetti',
    puzzlePieces: 4,
    cutStyle: 'grid',
    pieceTolerance: 40,
    rewardSound: 'magic',
  },
  {
    id: 'turtle-07',
    order: 7,
    theme: 'ocean',
    emoji: '🐢',
    fillColor: '#90EE90',
    accentColor: '#228B22',
    // Tortuga: caparazón en cúpula + cabeza + 4 patas
    tracingPath:
      'M 200 400 C 180 400 170 380 180 360 C 200 360 220 360 240 360 C 220 320 220 280 260 240 C 320 200 480 200 540 240 C 580 280 580 320 560 360 C 580 360 600 360 620 360 C 630 380 620 400 600 400 C 580 400 570 390 560 380 C 540 400 520 410 480 410 C 480 420 480 440 460 440 C 440 440 440 420 440 410 C 420 410 380 410 360 410 C 360 420 360 440 340 440 C 320 440 320 420 320 410 C 280 410 260 400 240 380 C 230 390 220 400 200 400 Z',
    tracingStart: { x: 200, y: 400 },
    tracingTolerance: 55,
    characterSvg: '/characters/turtle.svg',
    fillAnimation: 'wipe',
    puzzlePieces: 6,
    cutStyle: 'grid',
    pieceTolerance: 40,
    rewardSound: 'chime',
  },
  {
    id: 'penguin-08',
    order: 8,
    theme: 'snow',
    emoji: '🐧',
    fillColor: '#2C3E50',
    accentColor: '#FFFFFF',
    // Pingüino: cuerpo de gota + cabeza redonda + 2 aletas pequeñas
    tracingPath:
      'M 400 485 C 320 485 265 425 265 345 C 265 305 275 270 295 245 C 280 220 275 195 285 175 C 305 145 345 145 370 170 C 380 160 420 160 430 170 C 455 145 495 145 515 175 C 525 195 520 220 505 245 C 525 270 535 305 535 345 C 535 425 480 485 400 485 Z',
    tracingStart: { x: 400, y: 485 },
    tracingTolerance: 50,
    characterSvg: '/characters/penguin.svg',
    fillAnimation: 'expand',
    puzzlePieces: 6,
    cutStyle: 'grid',
    pieceTolerance: 40,
    rewardSound: 'magic',
  },
];

/**
 * Obtiene un nivel por su ID
 */
export function getLevelById(id: string): Level | undefined {
  return levels.find((level) => level.id === id);
}

/**
 * Obtiene un nivel por su orden (1-8)
 */
export function getLevelByOrder(order: number): Level | undefined {
  return levels.find((level) => level.order === order);
}