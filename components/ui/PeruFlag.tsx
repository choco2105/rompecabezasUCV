'use client';

interface PeruFlagProps {
  size?: number;
  className?: string;
  withWave?: boolean;
}

/**
 * Bandera del Perú dibujada con SVG.
 * No depende de emojis del sistema operativo.
 */
export default function PeruFlag({ size = 48, className = '', withWave = false }: PeruFlagProps) {
  return (
    <svg
      width={size}
      height={size * (2 / 3)}
      viewBox="0 0 60 40"
      className={`${className} ${withWave ? 'flag-wave' : ''}`}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    >
      {/* Franja roja izquierda */}
      <rect x="0" y="0" width="20" height="40" fill="#D91023" />
      {/* Franja blanca central */}
      <rect x="20" y="0" width="20" height="40" fill="#FFFFFF" />
      {/* Franja roja derecha */}
      <rect x="40" y="0" width="20" height="40" fill="#D91023" />
      {/* Borde sutil */}
      <rect x="0" y="0" width="60" height="40" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
    </svg>
  );
}