'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { levels } from '@/lib/levels';
import { getCompletedLevels, isLevelUnlocked } from '@/lib/progress';
import { audioSystem } from '@/lib/audio';

export default function Home() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    setCompleted(getCompletedLevels());
    setMounted(true);
    if (audioSystem.isInitialized()) {
      setAudioStarted(true);
    }
  }, []);

  const handleStart = () => {
    audioSystem.init();
    setAudioStarted(true);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-amber-100 via-rose-100 to-sky-200">
      {/* Sol */}
      <div
        className="absolute top-8 right-8 h-24 w-24 rounded-full bg-yellow-300 ambient-sun shadow-2xl"
        style={{ boxShadow: '0 0 60px rgba(253, 224, 71, 0.6)' }}
      />

      {/* Nubes */}
      {[
        { left: 8, top: 12, size: 90, delay: 0 },
        { left: 35, top: 18, size: 70, delay: 3 },
        { left: 65, top: 8, size: 80, delay: 6 },
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

      {/* PANTALLA DE BIENVENIDA */}
      {!audioStarted && mounted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/95 via-rose-100/95 to-sky-100/95 backdrop-blur-sm px-6">
          {/* Bandera grande animada */}
          <div className="welcome-bounce text-9xl mb-2 drop-shadow-2xl">
            🇵🇪
          </div>

          {/* Título */}
          <h1 className="title-breathe text-center text-5xl md:text-7xl font-extrabold text-slate-800 drop-shadow-md mb-2">
            Mi Perú
          </h1>
          <p className="text-center text-2xl md:text-3xl text-slate-700 font-bold mb-2">
            Rompecabezas Mágico
          </p>
          <p className="text-center text-base md:text-lg text-slate-600 max-w-md mb-10">
            Descubre los animales, plantas y paisajes de mi tierra 🌄
          </p>

          {/* Animalitos decorativos a los lados */}
          <div className="flex items-center gap-6 mb-10">
            <span className="text-5xl welcome-wiggle">🦙</span>
            <span className="text-5xl welcome-wiggle" style={{ animationDelay: '0.2s' }}>🦜</span>
            <span className="text-5xl welcome-wiggle" style={{ animationDelay: '0.4s' }}>🐹</span>
            <span className="text-5xl welcome-wiggle" style={{ animationDelay: '0.6s' }}>🌿</span>
          </div>

          {/* Botón grande JUGAR */}
          <button
            onClick={handleStart}
            className="welcome-pulse flex items-center gap-3 bg-gradient-to-b from-yellow-300 to-yellow-500 text-slate-800 font-extrabold rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform px-14 py-6 ring-4 ring-white text-3xl md:text-4xl"
            aria-label="Empezar a jugar"
          >
            <span>▶️</span>
            <span>¡JUGAR!</span>
          </button>

          <p className="mt-6 text-xs text-slate-500 italic">
            Toca el botón amarillo para empezar
          </p>
        </div>
      )}

      {/* GRID DE NIVELES */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <h1 className="title-breathe mb-2 text-center text-5xl font-extrabold text-slate-800 drop-shadow-md md:text-6xl">
          🇵🇪 Mi Perú
        </h1>
        <p className="mb-2 text-center text-2xl text-slate-700 drop-shadow font-bold">
          Rompecabezas Intercultural
        </p>
        <p className="mb-10 text-center text-base text-slate-600">
          Descubre nuestro Peru
        </p>

        <div className="grid w-full max-w-5xl grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {levels.map((level) => {
            const unlocked = mounted
              ? isLevelUnlocked(level.order)
              : level.order === 1;
            const isCompleted = completed.has(level.id);

            const cardContent = (
              <>
                <div className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-base font-bold text-white shadow-md">
                  {level.order}
                </div>

                <div className="absolute inset-0">
                  <img
                    src={level.imageSrc}
                    alt={level.nombre}
                    className={`h-full w-full object-cover transition-transform duration-300 ${
                      unlocked ? 'group-hover:scale-110' : 'grayscale opacity-50'
                    }`}
                    style={{ objectPosition: level.imagePosition || '50% 50%' }}
                  />
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                  <p className="text-sm font-bold text-white drop-shadow-md">
                    {level.nombre}
                  </p>
                </div>

                {!unlocked && (
                  <div className="lock-shake absolute inset-0 flex items-center justify-center bg-black/40 text-5xl">
                    🔒
                  </div>
                )}

                {isCompleted && (
                  <div className="absolute right-3 top-3 z-10 flex gap-0.5 text-sm">
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                  </div>
                )}
              </>
            );

            if (unlocked) {
              return (
                <Link
                  key={level.id}
                  href={`/jugar/${level.id}`}
                  className={`group relative aspect-square overflow-hidden rounded-2xl bg-white ring-4 ring-white/60 transition-all duration-300 hover:scale-105 hover:ring-yellow-300 active:scale-95 ${
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
                className="group relative aspect-square overflow-hidden rounded-2xl bg-white/40 shadow-md ring-4 ring-white/30 cursor-not-allowed"
              >
                {cardContent}
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-sm text-slate-600 drop-shadow text-center">
          Termina un rompecabezas para descubrir el siguiente 🎮
        </p>
      </div>
    </main>
  );
}