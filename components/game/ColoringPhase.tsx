'use client';

import { useEffect, useState } from 'react';
import type { Level } from '@/lib/types';
import { GAME_VIEWBOX, ANIMATION_DURATIONS } from '@/lib/constants';
import { getCharacterDetails } from '@/lib/characters';

interface ColoringPhaseProps {
  level: Level;
  onComplete: () => void;
}

export default function ColoringPhase({ level, onComplete }: ColoringPhaseProps) {
  // Etapas de la animación
  const [stage, setStage] = useState<'fillIn' | 'showDetails' | 'done'>('fillIn');

  // Después de la animación de relleno, mostrar detalles
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage('showDetails');
    }, ANIMATION_DURATIONS.fillAnimation);

    const t2 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, ANIMATION_DURATIONS.fillAnimation + 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  // Generar 20 partículas aleatorias para la animación "confetti" y "splash"
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 300 + Math.random() * 200,
    y: 200 + Math.random() * 200,
    delay: Math.random() * 0.8,
    size: 4 + Math.random() * 8,
    color: [level.fillColor, level.accentColor, '#FFD700', '#FF69B4'][i % 4],
  }));

  return (
    <div className="relative h-full w-full flex items-center justify-center select-none">
      <svg
        viewBox={`0 0 ${GAME_VIEWBOX.width} ${GAME_VIEWBOX.height}`}
        className="h-full w-full max-h-[80vh] max-w-[95vw]"
      >
        <defs>
          {/* Clip-path para animación "expand" (relleno circular desde el centro) */}
          <clipPath id={`clip-expand-${level.id}`}>
            <circle
              cx="400"
              cy="300"
              r={stage === 'fillIn' ? '0' : '500'}
              style={{
                transition: `r ${ANIMATION_DURATIONS.fillAnimation}ms ease-out`,
              }}
            />
          </clipPath>

          {/* Clip-path para animación "wipe" (barrido horizontal) */}
          <clipPath id={`clip-wipe-${level.id}`}>
            <rect
              x="0"
              y="0"
              width={stage === 'fillIn' ? '0' : '800'}
              height="600"
              style={{
                transition: `width ${ANIMATION_DURATIONS.fillAnimation}ms ease-in-out`,
              }}
            />
          </clipPath>
        </defs>

        {/* Capa 1: Contorno blanco siempre visible (el trazo del niño) */}
        <path
          d={level.tracingPath}
          fill="none"
          stroke="white"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
          }}
        />

        {/* Capa 2: Relleno coloreado, según el tipo de animación */}
        {level.fillAnimation === 'expand' && (
          <g clipPath={`url(#clip-expand-${level.id})`}>
            <path
              d={level.tracingPath}
              fill={level.fillColor}
              stroke={level.accentColor}
              strokeWidth="3"
            />
          </g>
        )}

        {level.fillAnimation === 'wipe' && (
          <g clipPath={`url(#clip-wipe-${level.id})`}>
            <path
              d={level.tracingPath}
              fill={level.fillColor}
              stroke={level.accentColor}
              strokeWidth="3"
            />
          </g>
        )}

        {level.fillAnimation === 'splash' && (
          <g
            style={{
              opacity: stage === 'fillIn' ? 1 : 1,
              animation: stage === 'fillIn' ? 'fillSplash 1.5s ease-out forwards' : 'none',
            }}
          >
            <path
              d={level.tracingPath}
              fill={level.fillColor}
              stroke={level.accentColor}
              strokeWidth="3"
              style={{
                opacity: 0,
                animation: 'fillFadeIn 1.5s ease-in forwards',
              }}
            />
            {/* Partículas de salpicadura */}
            {stage === 'fillIn' &&
              particles.map((p) => (
                <circle
                  key={p.id}
                  cx={p.x}
                  cy={p.y}
                  r={p.size}
                  fill={p.color}
                  opacity="0"
                  style={{
                    animation: `splashParticle 1.2s ease-out ${p.delay}s forwards`,
                  }}
                />
              ))}
          </g>
        )}

        {level.fillAnimation === 'confetti' && (
          <g>
            <path
              d={level.tracingPath}
              fill={level.fillColor}
              stroke={level.accentColor}
              strokeWidth="3"
              style={{
                opacity: 0,
                animation: 'fillFadeIn 1.5s ease-in forwards',
              }}
            />
            {/* Confeti cayendo */}
            {stage === 'fillIn' &&
              particles.map((p) => (
                <rect
                  key={p.id}
                  x={p.x - 4}
                  y={-20}
                  width="8"
                  height="12"
                  fill={p.color}
                  style={{
                    animation: `confettiFall 1.5s ease-in ${p.delay}s forwards`,
                    transformOrigin: `${p.x}px ${p.y}px`,
                  }}
                />
              ))}
          </g>
        )}

        {/* Capa 3: Detalles del personaje (ojos, sonrisa, etc.) — solo cuando termine el relleno */}
        {stage !== 'fillIn' && (
          <g style={{ animation: 'detailsAppear 0.5s ease-out forwards' }}>
            {getCharacterDetails(level.id)}
          </g>
        )}
      </svg>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes fillFadeIn {
          to {
            opacity: 1;
          }
        }
        @keyframes detailsAppear {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes splashParticle {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
          100% {
            opacity: 0;
            transform: scale(0.5) translateY(20px);
          }
        }
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}