'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { levels } from '@/lib/levels';
import { getCompletedLevels, isLevelUnlocked } from '@/lib/progress';

export default function Home() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCompleted(getCompletedLevels());
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200">
      {/* Sol decorativo rotando */}
      <div
        className="absolute top-8 right-8 h-24 w-24 rounded-full bg-yellow-300 ambient-sun shadow-2xl"
        style={{ boxShadow: '0 0 60px rgba(253, 224, 71, 0.6)' }}
      />

      {/* Nubes flotando */}
      {[
        { left: 8, top: 12, size: 100, delay: 0 },
        { left: 35, top: 18, size: 80, delay: 3 },
        { left: 65, top: 8, size: 90, delay: 6 },
        { left: 18, top: 30, size: 70, delay: 9 },
      ].map((cloud, i) => (
        <div
          key={i}
          className="absolute ambient-drift opacity-60"
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            fontSize: `${cloud.size}px`,
            animationDelay: `${cloud.delay}s`,
            animationDuration: '25s',
          }}
        >
          ☁️
        </div>
      ))}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <h1 className="title-breathe mb-2 text-center text-6xl font-extrabold text-slate-800 drop-shadow-md md:text-7xl">
          🐰 Rompecabezas
        </h1>
        <p className="mb-12 text-center text-2xl text-slate-700 drop-shadow">
          Elige un nivel para jugar
        </p>

        <div className="grid w-full max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {levels.map((level) => {
            const unlocked = mounted ? isLevelUnlocked(level.order) : level.order === 1;
            const isCompleted = completed.has(level.id);

            const cardContent = (
              <>
                <div className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xl font-bold text-white">
                  {level.order}
                </div>

                <div
                  className={`flex h-full w-full items-center justify-center text-7xl transition-transform duration-300 md:text-8xl ${
                    unlocked ? 'group-hover:scale-110' : 'grayscale opacity-40'
                  }`}
                >
                  {level.emoji}
                </div>

                {!unlocked && (
                  <div className="lock-shake absolute inset-0 flex items-center justify-center bg-black/30 text-6xl">
                    🔒
                  </div>
                )}

                <div className="absolute bottom-3 right-3 flex gap-1 text-lg">
                  <span className={isCompleted ? '' : 'opacity-30'}>⭐</span>
                  <span className={isCompleted ? '' : 'opacity-30'}>⭐</span>
                  <span className={isCompleted ? '' : 'opacity-30'}>⭐</span>
                </div>
              </>
            );

            if (unlocked) {
              return (
                <Link
                  key={level.id}
                  href={`/jugar/${level.id}`}
                  className={`group relative aspect-square overflow-hidden rounded-3xl bg-white/80 ring-4 ring-white/50 transition-all duration-300 hover:scale-105 hover:ring-yellow-300 active:scale-95 ${
                    !isCompleted ? 'card-glow' : 'shadow-xl'
                  }`}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={level.id}
                className="group relative aspect-square overflow-hidden rounded-3xl bg-white/40 shadow-md ring-4 ring-white/30 cursor-not-allowed"
              >
                {cardContent}
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-sm text-slate-600 drop-shadow">
          Termina un nivel para desbloquear el siguiente 🎮
        </p>
      </div>
    </main>
  );
}