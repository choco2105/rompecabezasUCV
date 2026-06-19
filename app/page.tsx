'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { levels } from '@/lib/levels';
import { getCompletedLevels, isLevelUnlocked } from '@/lib/progress';
import { audioSystem } from '@/lib/audio';
import PeruFlag from '@/components/ui/PeruFlag';

interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Home() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Filtrar progreso a niveles válidos actuales
    const all = getCompletedLevels();
    const validIds = new Set(levels.map((l) => l.id));
    const filtered = new Set([...all].filter((id) => validIds.has(id)));
    setCompleted(filtered);
    setMounted(true);

    // Generar estrellitas SOLO en el cliente (después de hidratación)
    const generatedStars: Star[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 95 + 2,
      top: Math.random() * 90 + 5,
      size: 15 + Math.random() * 20,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 2,
    }));
    setStars(generatedStars);

    if (audioSystem.isInitialized()) {
      setAudioStarted(true);
    }
  }, []);

  const handleStart = () => {
    audioSystem.init();
    setAudioStarted(true);
  };

  const completedCount = completed.size;
  const totalLevels = levels.length;
  const progressPercent = (completedCount / totalLevels) * 100;

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* FONDO MULTICOLOR VIBRANTE */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-pink-200 via-purple-200 via-blue-200 via-cyan-200 to-emerald-200 animated-rainbow-bg" />

      {/* Blobs de color flotando */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 ambient-blob" />
      <div
        className="absolute top-40 right-20 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 ambient-blob"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 ambient-blob"
        style={{ animationDelay: '4s' }}
      />

      {/* Sol grande */}
      <div className="absolute top-6 right-6 z-0">
        <div
          className="h-28 w-28 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 ambient-sun shadow-2xl"
          style={{ boxShadow: '0 0 80px rgba(253, 224, 71, 0.8)' }}
        />
      </div>

      {/* Nubes */}
      {[
        { left: 8, top: 12, size: 90, delay: 0 },
        { left: 35, top: 18, size: 70, delay: 3 },
        { left: 65, top: 8, size: 80, delay: 6 },
        { left: 75, top: 30, size: 60, delay: 9 },
      ].map((cloud, i) => (
        <div
          key={i}
          className="absolute ambient-drift opacity-70 z-0"
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

      {/* Estrellitas — solo cliente, evita hydration mismatch */}
      {stars.map((s) => (
        <div
          key={`star-${s.id}`}
          className="absolute ambient-twinkle z-0"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          ✨
        </div>
      ))}

      {/* PANTALLA DE BIENVENIDA */}
      {!audioStarted && mounted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/95 via-rose-100/95 to-sky-100/95 backdrop-blur-sm px-6">
          <div className="welcome-bounce mb-3" style={{ lineHeight: '1' }}>
            <PeruFlag size={130} withWave />
          </div>

          <h1 className="title-rainbow text-center text-6xl md:text-7xl font-extrabold drop-shadow-md mb-2">
            Mi Perú
          </h1>
          <p className="text-center text-2xl md:text-3xl text-purple-700 font-extrabold mb-2 drop-shadow">
            Rompecabezas Mágico
          </p>
          <p className="text-center text-base md:text-lg text-slate-700 max-w-md mb-10 font-semibold">
            Descubre los animales, plantas y paisajes de mi tierra 🌄
          </p>

          <div className="flex items-center gap-6 mb-10">
            <span className="text-5xl mascot-jump">🦙</span>
            <span className="text-5xl mascot-jump" style={{ animationDelay: '0.2s' }}>🦜</span>
            <span className="text-5xl mascot-jump" style={{ animationDelay: '0.4s' }}>🐦</span>
            <span className="text-5xl mascot-jump" style={{ animationDelay: '0.6s' }}>🌿</span>
          </div>

          <button
            onClick={handleStart}
            className="welcome-pulse flex items-center gap-3 bg-gradient-to-b from-yellow-300 via-orange-400 to-pink-500 text-white font-extrabold rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform px-14 py-6 ring-4 ring-white text-3xl md:text-4xl"
            style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}
            aria-label="Empezar a jugar"
          >
            <span>▶️</span>
            <span>¡JUGAR!</span>
          </button>

          <p className="mt-6 text-sm text-purple-600 italic font-bold">
            ✨ Toca el botón mágico para empezar ✨
          </p>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start px-6 py-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="title-breathe">
            <PeruFlag size={70} withWave />
          </div>
          <h1 className="title-rainbow text-5xl md:text-6xl font-extrabold drop-shadow-md">
            Mi Perú
          </h1>
        </div>

        <div className="rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 px-6 py-2 shadow-lg mb-2 ring-4 ring-white/60">
          <p className="text-xl md:text-2xl text-white font-extrabold drop-shadow">
            Rompecabezas Intercultural
          </p>
        </div>

        <p className="mb-6 text-center text-base text-slate-700 font-bold drop-shadow">
          🌈 Descubre nuestra flora, fauna y paisajes 🌈
        </p>

        {/* BARRA DE PROGRESO */}
        {mounted && (
          <div className="mb-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-2 text-sm font-extrabold text-slate-800">
              <span className="flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full shadow">
                🎯 Tu aventura
              </span>
              <span className="flex items-center gap-1 bg-yellow-300 px-3 py-1 rounded-full shadow">
                {completedCount} / {totalLevels} ⭐
              </span>
            </div>
            <div className="relative h-6 w-full rounded-full bg-white/70 shadow-inner overflow-hidden border-4 border-white">
              <div
                className="h-full bg-gradient-to-r from-yellow-300 via-orange-400 via-pink-500 to-purple-500 transition-all duration-700 ease-out relative"
                style={{
                  width: `${progressPercent}%`,
                  boxShadow: '0 0 15px rgba(253, 224, 71, 0.8)',
                }}
              >
                <div className="absolute inset-0 shimmer-bg" />
              </div>
            </div>
          </div>
        )}

        {/* GRID DE NIVELES */}
        <div className="grid w-full max-w-5xl grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {levels.map((level, idx) => {
            const unlocked = mounted ? isLevelUnlocked(level.order) : level.order === 1;
            const isCompleted = completed.has(level.id);

            const cardColors = [
              'ring-pink-400',
              'ring-purple-400',
              'ring-blue-400',
              'ring-emerald-400',
              'ring-orange-400',
              'ring-yellow-400',
              'ring-red-400',
              'ring-cyan-400',
            ];
            const cardColor = cardColors[idx % cardColors.length];

            const cardContent = (
              <>
                <div className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-base font-extrabold text-white shadow-lg ring-2 ring-white">
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

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent p-3 pointer-events-none">
                  <p className="text-sm font-extrabold text-white drop-shadow-lg">
                    {level.nombre}
                  </p>
                </div>

                {!unlocked && (
                  <div className="lock-shake absolute inset-0 flex items-center justify-center bg-purple-900/50 text-5xl pointer-events-none">
                    🔒
                  </div>
                )}

                {isCompleted && (
                  <div className="absolute top-1/2 left-1/2 z-20 pointer-events-none completed-stamp">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs sm:text-sm font-extrabold px-3 py-1 rounded-lg shadow-2xl border-4 border-white whitespace-nowrap">
                      ¡LISTO! ✓
                    </div>
                  </div>
                )}

                {isCompleted && (
                  <div className="absolute right-3 top-3 z-10 flex gap-0.5 text-sm pointer-events-none">
                    <span style={{ filter: 'drop-shadow(0 0 4px gold)' }}>⭐</span>
                    <span style={{ filter: 'drop-shadow(0 0 4px gold)' }}>⭐</span>
                    <span style={{ filter: 'drop-shadow(0 0 4px gold)' }}>⭐</span>
                  </div>
                )}
              </>
            );

            const popDelay = `${idx * 0.08}s`;

            if (unlocked) {
              return (
                <Link
                  key={level.id}
                  href={`/jugar/${level.id}`}
                  className={`card-pop-in group relative aspect-square overflow-hidden rounded-3xl bg-white ring-4 ${cardColor} transition-all duration-300 hover:scale-105 hover:ring-yellow-400 hover:rotate-1 active:scale-95 ${
                    !isCompleted ? 'card-glow' : 'shadow-2xl'
                  }`}
                  style={{ animationDelay: popDelay }}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={level.id}
                className="card-pop-in group relative aspect-square overflow-hidden rounded-3xl bg-white/40 shadow-md ring-4 ring-white/30 cursor-not-allowed"
                style={{ animationDelay: popDelay }}
              >
                {cardContent}
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-base text-purple-700 font-extrabold text-center drop-shadow bg-white/70 px-6 py-2 rounded-full">
          🌟 Termina un rompecabezas para descubrir el siguiente 🎮
        </p>
      </div>
    </main>
  );
}