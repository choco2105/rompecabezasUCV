// ============================================
// CATÁLOGO DE 8 NIVELES — Flora, fauna y paisajes peruanos
// ============================================

import type { Level } from './types';

export const levels: Level[] = [
  {
    id: 'paisaje-selva',
    order: 1,
    theme: 'selva',
    imageSrc: '/characters/paisaje-selva.jpg',
    emoji: '🌿',
    nombre: 'Paisaje de la Selva',
    region: 'Selva amazónica',
    dato: 'La selva peruana tiene los ríos más caudalosos del mundo.',
    puzzlePieces: 4,
    pieceTolerance: 50,
  },
  {
    id: 'paisaje-sierra',
    order: 2,
    theme: 'sierra',
    imageSrc: '/characters/paisaje-sierra.jpg',
    emoji: '🏔️',
    nombre: 'Paisaje de la Sierra',
    region: 'Andes',
    dato: 'En la sierra está la Cordillera Blanca, con picos nevados.',
    puzzlePieces: 4,
    pieceTolerance: 50,
  },
  {
    id: 'paisaje-costa',
    order: 3,
    theme: 'costa',
    imageSrc: '/characters/paisaje-costa.jpg',
    emoji: '🌊',
    nombre: 'Paisaje de la Costa',
    region: 'Costa pacífica',
    dato: 'La costa peruana tiene playas y desiertos junto al mar.',
    puzzlePieces: 4,
    pieceTolerance: 50,
  },
  {
    id: 'cuy',
    order: 4,
    theme: 'sierra',
    imageSrc: '/characters/cuy.jpg',
    emoji: '🐹',
    nombre: 'Cuy',
    region: 'Sierra',
    dato: 'El cuy es un animalito muy querido en los hogares andinos.',
    puzzlePieces: 4,
    pieceTolerance: 50,
  },
  {
    id: 'perro-peruano',
    order: 5,
    theme: 'universal',
    imageSrc: '/characters/perro-peruano.jpg',
    emoji: '🐕',
    nombre: 'Perro Peruano',
    region: 'Costa y Sierra',
    dato: 'El perro peruano sin pelo es una raza muy antigua del Perú.',
    puzzlePieces: 6,
    pieceTolerance: 45,
  },
  {
    id: 'alpaca',
    order: 6,
    theme: 'sierra',
    imageSrc: '/characters/alpaca.jpg',
    emoji: '🦙',
    nombre: 'Alpaca',
    region: 'Sierra (puna)',
    dato: 'La alpaca da una lana suavecita y abriga mucho.',
    puzzlePieces: 6,
    pieceTolerance: 45,
  },
  {
    id: 'guacamayo',
    order: 7,
    theme: 'selva',
    imageSrc: '/characters/guacamayo.jpg',
    // El guacamayo tiene la cara hacia arriba; centramos en 30% vertical
    imagePosition: '50% 30%',
    emoji: '🦜',
    nombre: 'Guacamayo',
    region: 'Selva amazónica',
    dato: 'El guacamayo tiene colores muy brillantes y le encanta volar.',
    puzzlePieces: 6,
    pieceTolerance: 45,
  },
  {
    id: 'puma',
    order: 8,
    theme: 'sierra',
    imageSrc: '/characters/puma.jpg',
    emoji: '🐆',
    nombre: 'Puma Andino',
    region: 'Sierra',
    dato: 'El puma era un animal sagrado para los antiguos incas.',
    puzzlePieces: 6,
    pieceTolerance: 45,
  },
];

export function getLevelById(id: string): Level | undefined {
  return levels.find((level) => level.id === id);
}

export function getLevelByOrder(order: number): Level | undefined {
  return levels.find((level) => level.order === order);
}