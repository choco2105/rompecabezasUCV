'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Level, GamePhase } from '@/lib/types';
import { THEME_BACKGROUNDS } from '@/lib/constants';
import { markLevelCompleted, getNextLevel } from '@/lib/progress';
import { audioSystem } from '@/lib/audio';
import TracingPhase from './TracingPhase';
import ColoringPhase from './ColoringPhase';
import PuzzlePhase from './PuzzlePhase';
import AnimatedBackground from '@/components/ambient/AnimatedBackground';

interface GameContainerProps {
  level: Level;
}

// Confeti SVG para pantalla de logros
const confettiColors = ['#FFD700', '#FF69B4', '#87CEEB', '#90EE90', '#FFA500'];

function ConfettiBurst() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    color: confettiColors[i % confettiColors.length],
    rotation: Math.random() * 360,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function GameContainer({ level }: GameContainerProps) {
  const [phase, setPhase] = useState<GamePhase>('tracing');
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(audioSystem.isMuted());
    const unsubscribe = audioSystem.subscribe(() => {
      setMuted(audioSystem.isMuted());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (phase === 'achievement') {
      markLevelCompleted(level.id);
      audioSystem.playSfx('levelComplete');
      setTimeout(() => audioSystem.playSfx('starPop'), 300);
      setTimeout(() => audioSystem.playSfx('starPop'), 600);
      setTimeout(() => audioSystem.playSfx('starPop'), 900);
    }
  }, [phase, level.id]);

  const handleMuteToggle = () => {
    audioSystem.toggleMute();
  };

  const bgGradient = THEME_BACKGROUNDS[level.theme];
  const nextLevel = getNextLevel(level.id);

  return (
    <main
      className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-b ${bgGradient}`}
    >
      {/* Fondo ambiental con partículas */}
      <AnimatedBackground theme={level.theme} />

      {/* Confeti solo en pantalla de logros */}
      {phase === 'achievement' && <ConfettiBurst />}

      <Link
        href="/"
        className="absolute left-4 top-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl shadow-lg ring-4 ring-white/50 transition-transform hover:scale-110 active:scale-95"
        aria-label="Volver al menú"
      >
        ←
      </Link>

      <button
        onClick={handleMuteToggle}
        className="absolute right-4 top-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl shadow-lg ring-4 ring-white/50 transition-transform hover:scale-110 active:scale-95"
        aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-white shadow-lg">
        {level.order}
      </div>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-20">
        {phase === 'tracing' && (
          <TracingPhase
            level={level}
            onComplete={() => {
              audioSystem.playSfx('tracingDone');
              setPhase('coloring');
            }}
          />
        )}

        {phase === 'coloring' && (
          <ColoringPhase
            level={level}
            onComplete={() => setPhase('puzzle')}
          />
        )}

        {phase === 'puzzle' && (
          <PuzzlePhase
            level={level}
            onComplete={() => setPhase('achievement')}
          />
        )}

        {phase === 'achievement' && (
          <div className="text-center achievement-fade-in z-20">
            <p className="text-9xl mb-4 animate-bounce">{level.emoji}</p>
            <p className="text-4xl text-slate-800 font-bold mb-4 drop-shadow-md">
              ¡Lo lograste! 🎉
            </p>
            <div className="flex justify-center gap-3 mb-8">
              <span className="text-6xl achievement-star-1">⭐</span>
              <span className="text-6xl achievement-star-2">⭐</span>
              <span className="text-6xl achievement-star-3">⭐</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-block bg-white/90 text-slate-800 text-xl font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                🏠 Menú
              </Link>
              {nextLevel && (
                <Link
                  href={`/jugar/${nextLevel.id}`}
                  className="inline-block bg-yellow-400 text-slate-800 text-xl font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform animate-pulse"
                >
                  Siguiente nivel →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex gap-3">
        <div
          className={`h-3 w-12 rounded-full shadow-md transition-all ${
            phase === 'tracing' ? 'bg-white' : 'bg-white/40'
          }`}
        />
        <div
          className={`h-3 w-12 rounded-full shadow-md transition-all ${
            phase === 'coloring' ? 'bg-white' : 'bg-white/40'
          }`}
        />
        <div
          className={`h-3 w-12 rounded-full shadow-md transition-all ${
            phase === 'puzzle' || phase === 'achievement' ? 'bg-white' : 'bg-white/40'
          }`}
        />
      </div>
    </main>
  );
}