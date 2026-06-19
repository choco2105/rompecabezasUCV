'use client';

import { useEffect, useState } from 'react';

interface Firework {
  id: number;
  cx: number; // centro X en %
  cy: number; // centro Y en %
  color: string;
  delay: number;
}

interface Balloon {
  id: number;
  left: number;
  emoji: string;
  delay: number;
  duration: number;
}

const FIREWORK_COLORS = [
  '#FFD700', '#FF69B4', '#87CEEB', '#90EE90',
  '#FFA500', '#FF6B6B', '#9B59B6', '#4ECDC4',
];

const BALLOON_EMOJIS = ['🎈', '🎉', '🌟', '✨'];

/**
 * Efectos espectaculares de victoria.
 * Combina fuegos artificiales + globos subiendo.
 */
export default function AchievementParticles() {
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    // Generar 5 explosiones de fuegos artificiales en cascada
    const fws: Firework[] = [];
    for (let i = 0; i < 5; i++) {
      fws.push({
        id: i,
        cx: 20 + Math.random() * 60,
        cy: 20 + Math.random() * 40,
        color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
        delay: i * 0.4,
      });
    }
    setFireworks(fws);

    // Generar globos
    const bls: Balloon[] = [];
    for (let i = 0; i < 8; i++) {
      bls.push({
        id: i,
        left: Math.random() * 90 + 5,
        emoji: BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)],
        delay: Math.random() * 3,
        duration: 6 + Math.random() * 4,
      });
    }
    setBalloons(bls);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-15 overflow-hidden">
      {/* Globos subiendo */}
      {balloons.map((b) => (
        <div
          key={`balloon-${b.id}`}
          className="balloon-rise text-4xl"
          style={{
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        >
          {b.emoji}
        </div>
      ))}

      {/* Fuegos artificiales */}
      {fireworks.map((fw) => (
        <FireworkBurst key={`fw-${fw.id}`} firework={fw} />
      ))}
    </div>
  );
}

function FireworkBurst({ firework }: { firework: Firework }) {
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const distance = 80 + Math.random() * 40;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    return { id: i, dx, dy };
  });

  return (
    <div
      className="absolute"
      style={{
        left: `${firework.cx}%`,
        top: `${firework.cy}%`,
        animationDelay: `${firework.delay}s`,
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="firework-particle"
          style={
            {
              backgroundColor: firework.color,
              animationDelay: `${firework.delay}s`,
              boxShadow: `0 0 8px ${firework.color}`,
              ['--dx' as string]: `${p.dx}px`,
              ['--dy' as string]: `${p.dy}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}