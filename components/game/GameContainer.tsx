'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Level } from '@/lib/types';
import { THEME_BACKGROUNDS } from '@/lib/constants';
import { markLevelCompleted, getNextLevel } from '@/lib/progress';
import { audioSystem } from '@/lib/audio';
import PuzzlePhase from './PuzzlePhase';
import AnimatedBackground from '@/components/ambient/AnimatedBackground';

interface GameContainerProps {
  level: Level;
}

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
  const [phase, setPhase] = useState<'puzzle' | 'achievement'>('puzzle');
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
  const imagePosition = level.imagePosition || '50% 50%';

  return (
    <main
      className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-b ${bgGradient}`}
    >
      <AnimatedBackground theme={
        level.theme === 'selva' ? 'jungle' :
        level.theme === 'costa' ? 'ocean' :
        level.theme === 'sierra' ? 'snow' :
        'garden'
      } />

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

      <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-white shadow-lg">
          {level.order}
        </div>
        <div className="hidden sm:block rounded-full bg-white/90 px-5 py-3 text-lg font-bold text-slate-800 shadow-lg">
          {level.nombre}
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-20">
        {phase === 'puzzle' && (
          <PuzzlePhase
            level={level}
            onComplete={() => setPhase('achievement')}
          />
        )}

        {phase === 'achievement' && (
          <div className="text-center achievement-fade-in z-20 max-w-2xl w-full px-4">
            <div className="achievement-float mb-4 inline-block overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white/80">
              <img
                src={level.imageSrc}
                alt={level.nombre}
                className="block h-56 w-56 sm:h-72 sm:w-72 object-cover"
                style={{ objectPosition: imagePosition }}
              />
            </div>

            <p className="text-3xl sm:text-4xl text-slate-800 font-bold mb-1 drop-shadow-md">
              {level.nombre}
            </p>
            <p className="text-base sm:text-lg text-slate-600 mb-4 italic">
              {level.region}
            </p>

            <div className="mx-auto mb-4 max-w-md rounded-2xl bg-white/85 px-5 py-3 shadow-md">
              <p className="text-sm sm:text-base text-slate-700">
                💡 {level.dato}
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              <span className="text-5xl achievement-star-1">⭐</span>
              <span className="text-5xl achievement-star-2">⭐</span>
              <span className="text-5xl achievement-star-3">⭐</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-block bg-white/90 text-slate-800 text-lg font-bold px-7 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                🏠 Menú
              </Link>
              {nextLevel && (
                <Link
                  href={`/jugar/${nextLevel.id}`}
                  className="inline-block bg-yellow-400 text-slate-800 text-lg font-bold px-7 py-3 rounded-full shadow-lg hover:scale-105 transition-transform animate-pulse"
                >
                  Siguiente nivel →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}