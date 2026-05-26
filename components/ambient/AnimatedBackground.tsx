'use client';

import type { Theme } from '@/lib/types';

interface AnimatedBackgroundProps {
  theme: Theme;
}

/**
 * Capa decorativa de partículas/elementos flotando
 * según el tema del nivel. Posicionada con z-index bajo
 * para no interferir con el juego.
 */
export default function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  // Generar posiciones aleatorias para cada elemento
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 90 + 5, // 5% a 95%
    top: Math.random() * 90 + 5,
    delay: Math.random() * 8,
    duration: 10 + Math.random() * 10,
    size: 20 + Math.random() * 30,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Sol o luna rotando (común a todos los temas) */}
      <div
        className="absolute top-6 right-6 h-24 w-24 rounded-full bg-yellow-300 opacity-80 shadow-2xl ambient-sun"
        style={{
          boxShadow: '0 0 60px rgba(253, 224, 71, 0.6)',
        }}
      />

      {/* Elementos específicos por tema */}
      {theme === 'jungle' && (
        <>
          {items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="absolute text-3xl ambient-float"
              style={{
                left: `${item.left}%`,
                top: `${item.top}%`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration}s`,
                fontSize: `${item.size}px`,
                opacity: 0.4,
              }}
            >
              🍃
            </div>
          ))}
        </>
      )}

      {theme === 'ocean' && (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute ambient-bubble"
              style={{
                left: `${item.left}%`,
                bottom: `-10%`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration}s`,
                width: `${item.size}px`,
                height: `${item.size}px`,
              }}
            >
              <div className="w-full h-full rounded-full bg-white/40 border border-white/60" />
            </div>
          ))}
        </>
      )}

      {theme === 'garden' && (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute ambient-fall"
              style={{
                left: `${item.left}%`,
                top: `-10%`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration}s`,
                fontSize: `${item.size}px`,
                opacity: 0.6,
              }}
            >
              🌸
            </div>
          ))}
        </>
      )}

      {theme === 'farm' && (
        <>
          {items.slice(0, 8).map((item) => (
            <div
              key={item.id}
              className="absolute ambient-drift"
              style={{
                left: `${item.left}%`,
                top: `${item.top}%`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration * 1.5}s`,
                fontSize: `${item.size}px`,
                opacity: 0.5,
              }}
            >
              ☁️
            </div>
          ))}
        </>
      )}

      {theme === 'sky' && (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute ambient-twinkle"
              style={{
                left: `${item.left}%`,
                top: `${item.top}%`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                fontSize: `${item.size * 0.6}px`,
              }}
            >
              ✨
            </div>
          ))}
        </>
      )}

      {theme === 'snow' && (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute ambient-fall"
              style={{
                left: `${item.left}%`,
                top: `-10%`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration * 1.3}s`,
                fontSize: `${item.size * 0.7}px`,
                opacity: 0.8,
              }}
            >
              ❄️
            </div>
          ))}
        </>
      )}
    </div>
  );
}