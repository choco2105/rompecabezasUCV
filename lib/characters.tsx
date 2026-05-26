// ============================================
// DETALLES VISUALES DE LOS PERSONAJES
// Ojos, sonrisas, detalles que se dibujan ENCIMA
// del contorno coloreado
// ============================================

import type { ReactNode } from 'react';

/**
 * Mapa de detalles SVG por ID de nivel.
 * Cada función retorna los elementos SVG que se superponen al contorno.
 */
export const characterDetails: Record<string, () => ReactNode> = {
  // 🐰 CONEJO
  'rabbit-01': () => (
    <g>
      {/* Interior rosa de orejas */}
      <ellipse cx="327" cy="190" rx="11" ry="35" fill="#FFB6C1" />
      <ellipse cx="473" cy="190" rx="11" ry="35" fill="#FFB6C1" />
      {/* Ojos */}
      <circle cx="365" cy="340" r="9" fill="#222" />
      <circle cx="435" cy="340" r="9" fill="#222" />
      {/* Brillito en ojos */}
      <circle cx="368" cy="337" r="3" fill="#FFF" />
      <circle cx="438" cy="337" r="3" fill="#FFF" />
      {/* Nariz rosa */}
      <ellipse cx="400" cy="375" rx="8" ry="6" fill="#FF9999" />
      {/* Boca pequeña */}
      <path d="M 395 388 Q 400 395 405 388" stroke="#444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Cachetes */}
      <circle cx="345" cy="370" r="10" fill="#FFCCCC" opacity="0.6" />
      <circle cx="455" cy="370" r="10" fill="#FFCCCC" opacity="0.6" />
    </g>
  ),

  // 🐟 PEZ
  'fish-02': () => (
    <g>
      {/* Ojo */}
      <circle cx="320" cy="280" r="18" fill="#FFF" />
      <circle cx="324" cy="282" r="10" fill="#222" />
      <circle cx="326" cy="278" r="4" fill="#FFF" />
      {/* Boca */}
      <path d="M 245 310 Q 260 320 270 310" stroke="#222" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Línea de aleta lateral */}
      <path d="M 380 295 Q 430 280 470 290" stroke="#CC6600" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Escamas (puntos decorativos) */}
      <circle cx="420" cy="270" r="3" fill="#CC6600" opacity="0.5" />
      <circle cx="450" cy="280" r="3" fill="#CC6600" opacity="0.5" />
      <circle cx="440" cy="310" r="3" fill="#CC6600" opacity="0.5" />
    </g>
  ),

  // 🦋 MARIPOSA
  'butterfly-03': () => (
    <g>
      {/* Antenas */}
      <path d="M 395 220 Q 380 200 370 175" stroke="#222" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 405 220 Q 420 200 430 175" stroke="#222" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="370" cy="172" r="4" fill="#222" />
      <circle cx="430" cy="172" r="4" fill="#222" />
      {/* Manchas en alas */}
      <circle cx="240" cy="200" r="12" fill="#FFF" opacity="0.7" />
      <circle cx="560" cy="200" r="12" fill="#FFF" opacity="0.7" />
      <circle cx="220" cy="320" r="10" fill="#FFD700" opacity="0.7" />
      <circle cx="580" cy="320" r="10" fill="#FFD700" opacity="0.7" />
      {/* Ojos en cuerpo */}
      <circle cx="395" cy="260" r="3" fill="#222" />
      <circle cx="405" cy="260" r="3" fill="#222" />
    </g>
  ),

  // 🐱 GATO
  'cat-04': () => (
    <g>
      {/* Interior rosa de orejas */}
      <path d="M 275 165 L 295 200 L 305 180 Z" fill="#FFB6C1" />
      <path d="M 525 165 L 505 180 L 495 200 Z" fill="#FFB6C1" />
      {/* Ojos */}
      <ellipse cx="350" cy="290" rx="14" ry="18" fill="#FFF" />
      <ellipse cx="450" cy="290" rx="14" ry="18" fill="#FFF" />
      <ellipse cx="350" cy="293" rx="6" ry="13" fill="#222" />
      <ellipse cx="450" cy="293" rx="6" ry="13" fill="#222" />
      <circle cx="352" cy="288" r="3" fill="#FFF" />
      <circle cx="452" cy="288" r="3" fill="#FFF" />
      {/* Nariz */}
      <path d="M 393 340 L 407 340 L 400 350 Z" fill="#FF9999" />
      {/* Boca */}
      <path d="M 400 350 Q 388 365 380 360" stroke="#444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 400 350 Q 412 365 420 360" stroke="#444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Bigotes */}
      <path d="M 340 350 L 290 345" stroke="#444" strokeWidth="2" />
      <path d="M 340 360 L 290 365" stroke="#444" strokeWidth="2" />
      <path d="M 460 350 L 510 345" stroke="#444" strokeWidth="2" />
      <path d="M 460 360 L 510 365" stroke="#444" strokeWidth="2" />
    </g>
  ),

  // 🦆 PATO
  'duck-05': () => (
    <g>
      {/* Pico */}
      <ellipse cx="580" cy="260" rx="25" ry="12" fill="#FF8C00" />
      <line x1="555" y1="260" x2="600" y2="260" stroke="#CC6600" strokeWidth="1" />
      {/* Ojo */}
      <circle cx="520" cy="220" r="6" fill="#222" />
      <circle cx="522" cy="218" r="2" fill="#FFF" />
      {/* Ala */}
      <path d="M 350 360 Q 420 380 470 360" stroke="#CC9900" strokeWidth="3" fill="none" />
      <path d="M 360 370 Q 410 385 460 375" stroke="#CC9900" strokeWidth="2" fill="none" opacity="0.6" />
    </g>
  ),

  // ⭐ ESTRELLA
  'star-06': () => (
    <g>
      {/* Cara sonriente en el centro */}
      <circle cx="380" cy="320" r="5" fill="#222" />
      <circle cx="420" cy="320" r="5" fill="#222" />
      <path d="M 380 345 Q 400 365 420 345" stroke="#222" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Brillitos */}
      <circle cx="350" cy="270" r="3" fill="#FFF" opacity="0.8" />
      <circle cx="450" cy="270" r="3" fill="#FFF" opacity="0.8" />
      <circle cx="400" cy="380" r="3" fill="#FFF" opacity="0.8" />
    </g>
  ),

  // 🐢 TORTUGA
  'turtle-07': () => (
    <g>
      {/* Cabeza más oscura */}
      <ellipse cx="240" cy="380" rx="40" ry="30" fill="#5BAC4D" />
      {/* Ojo */}
      <circle cx="220" cy="370" r="5" fill="#222" />
      <circle cx="221" cy="368" r="2" fill="#FFF" />
      {/* Sonrisa */}
      <path d="M 215 388 Q 225 395 235 388" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Patrones del caparazón (hexágonos simples) */}
      <polygon points="400,260 430,275 430,305 400,320 370,305 370,275" fill="#5BAC4D" opacity="0.7" />
      <polygon points="340,290 365,300 365,325 340,335 315,325 315,300" fill="#5BAC4D" opacity="0.5" />
      <polygon points="460,290 485,300 485,325 460,335 435,325 435,300" fill="#5BAC4D" opacity="0.5" />
    </g>
  ),

  // 🐧 PINGÜINO
  'penguin-08': () => (
    <g>
      {/* Panza blanca */}
      <ellipse cx="400" cy="380" rx="80" ry="90" fill="#FFFFFF" />
      {/* Ojos */}
      <circle cx="375" cy="220" r="9" fill="#FFF" />
      <circle cx="425" cy="220" r="9" fill="#FFF" />
      <circle cx="377" cy="222" r="5" fill="#222" />
      <circle cx="423" cy="222" r="5" fill="#222" />
      {/* Pico naranja */}
      <path d="M 388 245 L 412 245 L 400 260 Z" fill="#FFA500" />
      {/* Pies */}
      <ellipse cx="370" cy="490" rx="20" ry="8" fill="#FFA500" />
      <ellipse cx="430" cy="490" rx="20" ry="8" fill="#FFA500" />
    </g>
  ),
};

/**
 * Devuelve los detalles visuales de un personaje
 */
export function getCharacterDetails(levelId: string): ReactNode {
  const detailFn = characterDetails[levelId];
  return detailFn ? detailFn() : null;
}