'use client';

import { useEffect, useRef, useState } from 'react';
import type { Level } from '@/lib/types';
import {
  generatePieces,
  isPieceNearTarget,
  getPieceDimensions,
  PUZZLE_SIZE,
  type PieceRegion,
} from '@/lib/puzzleGeometry';
import { audioSystem } from '@/lib/audio';

interface PuzzlePhaseProps {
  level: Level;
  onComplete: () => void;
}

interface PieceState extends PieceRegion {
  currentX: number;
  currentY: number;
  isSnapped: boolean;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const SPARKLE_EMOJIS = ['✨', '⭐', '🌟', '💫', '🎉'];

export default function PuzzlePhase({ level, onComplete }: PuzzlePhaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dims = getPieceDimensions(level.puzzlePieces);

  // Escala del SVG virtual (800x600) al contenedor real
  const [scale, setScale] = useState(1);

  const [pieces, setPieces] = useState<PieceState[]>(() => {
    const regions = generatePieces(level.puzzlePieces);
    return regions.map((r) => ({
      ...r,
      currentX: r.startX,
      currentY: r.startY,
      isSnapped: false,
    }));
  });

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleIdRef = useRef(0);

  const allSnapped = pieces.every((p) => p.isSnapped);

  // Calcular escala según tamaño del contenedor
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = rect.width / 800;
      const scaleY = rect.height / 600;
      setScale(Math.min(scaleX, scaleY));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (allSnapped) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allSnapped, onComplete]);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Ignorar
      }
    }
  };

  const spawnSparkles = (x: number, y: number) => {
    const newSparkles: Sparkle[] = [];
    for (let i = 0; i < 6; i++) {
      newSparkles.push({
        id: sparkleIdRef.current++,
        x: x + (Math.random() - 0.5) * 80,
        y: y + (Math.random() - 0.5) * 80,
        emoji: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
      });
    }
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) =>
        prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id))
      );
    }, 800);
  };

  /** Convierte coordenadas de pantalla (px del mouse) a coordenadas internas del juego (0-800 / 0-600) */
  const screenToGame = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    // Centro del SVG en pantalla
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Offset relativo al centro del juego (400, 300)
    const x = 400 + (clientX - centerX) / scale;
    const y = 300 + (clientY - centerY) / scale;
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent, pieceId: number) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece || piece.isSnapped) return;

    const gamePos = screenToGame(e.clientX, e.clientY);
    dragOffsetRef.current = {
      x: piece.currentX - gamePos.x,
      y: piece.currentY - gamePos.y,
    };
    setDraggingId(pieceId);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId === null) return;
    const gamePos = screenToGame(e.clientX, e.clientY);
    setPieces((prev) =>
      prev.map((p) =>
        p.id === draggingId
          ? {
              ...p,
              currentX: gamePos.x + dragOffsetRef.current.x,
              currentY: gamePos.y + dragOffsetRef.current.y,
            }
          : p
      )
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId === null) return;
    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== draggingId) return p;
        const near = isPieceNearTarget(
          { x: p.currentX, y: p.currentY },
          { x: p.targetX, y: p.targetY },
          level.pieceTolerance
        );
        if (near) {
          audioSystem.playSfx('pieceSnap');
          triggerHaptic();
          spawnSparkles(p.targetX, p.targetY);
          return {
            ...p,
            currentX: p.targetX,
            currentY: p.targetY,
            isSnapped: true,
            rotation: 0,
          };
        }
        return p;
      })
    );
    (e.target as Element).releasePointerCapture(e.pointerId);
    setDraggingId(null);
  };

  const snappedCount = pieces.filter((p) => p.isSnapped).length;
  const imagePosition = level.imagePosition || '50% 50%';

  return (
    <div className="relative h-full w-full flex items-center justify-center select-none touch-none">
      {/* Contador */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-xl ring-4 ring-yellow-300/50">
        <span className="text-2xl">🧩</span>
        <span className="text-lg font-extrabold text-slate-800">
          {snappedCount} / {pieces.length}
        </span>
      </div>

      {/* Contenedor del juego con escala fija 800x600 */}
      <div
        ref={containerRef}
        className="relative w-full h-full max-h-[85vh] max-w-[95vw]"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          aspectRatio: '800 / 600',
        }}
      >
        {/* Marco guía punteado */}
        <div
          className="absolute"
          style={{
            left: `${((400 - PUZZLE_SIZE / 2) / 800) * 100}%`,
            top: `${((300 - PUZZLE_SIZE / 2) / 600) * 100}%`,
            width: `${(PUZZLE_SIZE / 800) * 100}%`,
            height: `${(PUZZLE_SIZE / 600) * 100}%`,
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '3px dashed rgba(255,255,255,0.7)',
            borderRadius: '8px',
          }}
        />

        {/* Imagen fantasma como pista (muy tenue) */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${((400 - PUZZLE_SIZE / 2) / 800) * 100}%`,
            top: `${((300 - PUZZLE_SIZE / 2) / 600) * 100}%`,
            width: `${(PUZZLE_SIZE / 800) * 100}%`,
            height: `${(PUZZLE_SIZE / 600) * 100}%`,
            backgroundImage: `url(${level.imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: imagePosition,
            opacity: 0.2,
            borderRadius: '8px',
          }}
        />

        {/* Las piezas como divs con background-image */}
        {pieces.map((piece) => {
          const pieceLeft = ((piece.currentX - dims.width / 2) / 800) * 100;
          const pieceTop = ((piece.currentY - dims.height / 2) / 600) * 100;
          const pieceWidth = (dims.width / 800) * 100;
          const pieceHeight = (dims.height / 600) * 100;

          // Posición del fondo: -col*100% por columna, -row*100% por fila
          // El backgroundSize es 200% si hay 2 columnas (porque cada pieza es la mitad)
          // o 300% si hay 3 columnas, etc.
          const bgSizeX = dims.cols * 100;
          const bgSizeY = dims.rows * 100;
          const bgPosX = (piece.col / (dims.cols - 1 || 1)) * 100;
          const bgPosY = (piece.row / (dims.rows - 1 || 1)) * 100;

          const isDragging = draggingId === piece.id;

          return (
            <div
              key={piece.id}
              onPointerDown={(e) => handlePointerDown(e, piece.id)}
              className="absolute"
              style={{
                left: `${pieceLeft}%`,
                top: `${pieceTop}%`,
                width: `${pieceWidth}%`,
                height: `${pieceHeight}%`,
                backgroundImage: `url(${level.imageSrc})`,
                backgroundSize: `${bgSizeX}% ${bgSizeY}%`,
                backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                border: piece.isSnapped ? '3px solid #fbbf24' : '3px solid white',
                borderRadius: '6px',
                boxShadow: piece.isSnapped
                  ? '0 2px 4px rgba(0,0,0,0.2)'
                  : '0 8px 16px rgba(0,0,0,0.4)',
                transform: `rotate(${piece.rotation}deg)`,
                transition: isDragging
                  ? 'none'
                  : 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.3s ease-out, border-color 0.2s',
                cursor: piece.isSnapped ? 'default' : 'grab',
                touchAction: 'none',
                zIndex: isDragging ? 20 : piece.isSnapped ? 5 : 10,
              }}
            />
          );
        })}

        {/* Sparkles al encajar */}
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="absolute pointer-events-none text-3xl"
            style={{
              left: `${(s.x / 800) * 100}%`,
              top: `${(s.y / 600) * 100}%`,
              transform: 'translate(-50%, -50%)',
              animation: 'sparkleBurst 0.8s ease-out forwards',
              zIndex: 30,
            }}
          >
            {s.emoji}
          </div>
        ))}

        {/* Brillito final al completar */}
        {allSnapped && (
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'puzzleComplete 0.5s ease-out forwards',
              zIndex: 40,
            }}
          >
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: '160px',
                height: '160px',
                background: 'rgba(255,215,0,0.4)',
                fontSize: '80px',
              }}
            >
              ✨
            </div>
          </div>
        )}
      </div>
    </div>
  );
}