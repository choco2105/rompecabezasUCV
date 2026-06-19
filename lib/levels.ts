// ============================================
// CATÁLOGO DE 8 NIVELES — Flora, fauna y paisajes peruanos
// ============================================

import type { Level } from './types';

export const levels: Level[] = [
  {
    id: 'paisaje-costa',
    order: 1,
    theme: 'costa',
    imageSrc: '/characters/paisaje-costa.jpg',
    emoji: '🌅',
    nombre: 'Paisaje de la Costa',
    region: 'Costa peruana',
    dato: 'En la costa hay playas, desiertos y caballitos de totora.',
    puzzlePieces: 4,
    pieceTolerance: 50,
  },
  {
    id: 'paisaje-sierra',
    order: 2,
    theme: 'sierra',
    imageSrc: '/characters/paisaje-sierra.jpg',
    emoji: '🏔️',
    nombre: 'Machu Picchu',
    region: 'Sierra (Cusco)',
    dato: 'Machu Picchu es una de las maravillas del mundo. ¡Lo construyeron los incas!',
    puzzlePieces: 4,
    pieceTolerance: 50,
  },
  {
    id: 'paisaje-selva',
    order: 3,
    theme: 'selva',
    imageSrc: '/characters/paisaje-selva.jpg',
    emoji: '🌿',
    nombre: 'Río Amazonas',
    region: 'Selva amazónica',
    dato: 'El Amazonas es el río más caudaloso del mundo y nace en el Perú.',
    puzzlePieces: 4,
    pieceTolerance: 50,
  },
  {
    id: 'lago-titicaca',
    order: 4,
    theme: 'sierra',
    imageSrc: '/characters/lago-titicaca.jpg',
    emoji: '💧',
    nombre: 'Lago Titicaca',
    region: 'Sierra (Puno)',
    dato: 'Es el lago navegable más alto del mundo. Hay islas flotantes hechas de totora.',
    puzzlePieces: 4,
    pieceTolerance: 50,
  },
  {
    id: 'animales-costa',
    order: 5,
    theme: 'costa',
    imageSrc: '/characters/animales-costa.jpg',
    emoji: '🐔',
    nombre: 'Animales de la Costa',
    region: 'Costa peruana',
    dato: 'En la costa viven gallinas, chanchitos, vaquitas y muchos animales más.',
    puzzlePieces: 6,
    pieceTolerance: 45,
  },
  {
    id: 'llamas',
    order: 6,
    theme: 'sierra',
    imageSrc: '/characters/llamas.jpg',
    emoji: '🦙',
    nombre: 'Llamas',
    region: 'Sierra (Andes)',
    dato: 'Las llamas viven en los Andes y nos dan lana suavecita para abrigarnos.',
    puzzlePieces: 6,
    pieceTolerance: 45,
  },
  {
    id: 'guacamayos',
    order: 7,
    theme: 'selva',
    imageSrc: '/characters/guacamayos.jpg',
    emoji: '🦜',
    nombre: 'Guacamayos',
    region: 'Selva amazónica',
    dato: 'Los guacamayos tienen colores muy brillantes y vuelan en grupos.',
    puzzlePieces: 6,
    pieceTolerance: 45,
  },
  {
    id: 'gallito-rocas',
    order: 8,
    theme: 'selva',
    imageSrc: '/characters/gallito-rocas.jpg',
    emoji: '🐦',
    nombre: 'Gallito de las Rocas',
    region: 'Selva',
    dato: '¡Es el ave nacional del Perú! Tiene plumas anaranjadas brillantes.',
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