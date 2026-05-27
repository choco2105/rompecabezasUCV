'use client';

import { useEffect, useRef, useState } from 'react';
import type { Level } from '@/lib/types';
import { GAME_VIEWBOX } from '@/lib/constants';
import {
  generatePieces,
  isPieceNearTarget,
  getPieceDimensions,
  PUZZLE_SIZE,
  PUZZLE_OFFSET_X,
  PUZZLE_OFFSET_Y,
  type PieceRegion,
} from '@/lib/puzzleGeometry';
import { screenToSvg } from '@/lib/pathMath';
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

/**
 * Convierte un imagePosition CSS ("50% 30%") al preserveAspectRatio SVG
 * equivalente. SVG usa keywords: xMin/xMid/xMax y yMin/yMid/yMax.
 * Aproximamos según los porcentajes.
 */
function cssPositionToSvgAspect(pos?: string): string {
  if (!pos) return 'xMidYMid slice';

  const [xStr, yStr] = pos.split(' ');
  const x = parseInt(xStr) || 50;
  const y = parseInt(yStr) || 50;

  const xKey = x <= 33 ? 'xMin' : x >= 66 ? 'xMax' : 'xMid';
  const yKey = y <= 33 ? 'YMin' : y >= 66 ? 'YMax' : 'YMid';

  return `${xKey}${yKey} slice`;
}

export default function PuzzlePhase({ level, onComplete }: PuzzlePhaseProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const dims = getPieceDimensions(level.puzzlePieces);
  const aspectRatio = cssPositionToSvgAspect(level.imagePosition);

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

  const allSnapped = pieces.every((p) => p.isSnapped);

  useEffect(() => {
    if (allSnapped) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allSnapped, onComplete]);

  const handlePointerDown = (e: React.PointerEvent, pieceId: number) => {
    if (!svgRef.current) return;
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece || piece.isSnapped) return;

    const svgPos = screenToSvg(svgRef.current, e.clientX, e.clientY);
    dragOffsetRef.current = {
      x: piece.currentX - svgPos.x,
      y: piece.currentY - svgPos.y,
    };
    setDraggingId(pieceId);

    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId === null || !svgRef.current) return;
    const svgPos = screenToSvg(svgRef.current, e.clientX, e.clientY);
    setPieces((prev) =>
      prev.map((p) =>
        p.id === draggingId
          ? {
              ...p,
              currentX: svgPos.x + dragOffsetRef.current.x,
              currentY: svgPos.y + dragOffsetRef.current.y,
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

  return (
    <div className="relative h-full w-full flex items-center justify-center select-none touch-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${GAME_VIEWBOX.width} ${GAME_VIEWBOX.height}`}
        className="h-full w-full max-h-[80vh] max-w-[95vw]"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          {pieces.map((p) => {
            const srcX = PUZZLE_OFFSET_X + p.col * dims.width;
            const srcY = PUZZLE_OFFSET_Y + p.row * dims.height;
            return (
              <clipPath key={`clip-${p.id}`} id={`clip-${level.id}-${p.id}`}>
                <rect
                  x={srcX}
                  y={srcY}
                  width={dims.width}
                  height={dims.height}
                />
              </clipPath>
            );
          })}
        </defs>

        <rect
          x={PUZZLE_OFFSET_X}
          y={PUZZLE_OFFSET_Y}
          width={PUZZLE_SIZE}
          height={PUZZLE_SIZE}
          fill="rgba(255,255,255,0.15)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="3"
          strokeDasharray="8 6"
          rx="8"
        />

        {/* Imagen fantasma como pista */}
        <image
          href={level.imageSrc}
          x={PUZZLE_OFFSET_X}
          y={PUZZLE_OFFSET_Y}
          width={PUZZLE_SIZE}
          height={PUZZLE_SIZE}
          preserveAspectRatio={aspectRatio}
          opacity="0.18"
          style={{ pointerEvents: 'none' }}
        />

        {pieces.map((piece) => {
          const pieceCenterX = piece.targetX;
          const pieceCenterY = piece.targetY;
          const translateX = piece.currentX - pieceCenterX;
          const translateY = piece.currentY - pieceCenterY;
          const isDragging = draggingId === piece.id;

          const srcX = PUZZLE_OFFSET_X + piece.col * dims.width;
          const srcY = PUZZLE_OFFSET_Y + piece.row * dims.height;

          return (
            <g
              key={piece.id}
              transform={`
                translate(${translateX}, ${translateY})
                rotate(${piece.rotation}, ${pieceCenterX}, ${pieceCenterY})
              `}
              onPointerDown={(e) => handlePointerDown(e, piece.id)}
              style={{
                cursor: piece.isSnapped ? 'default' : 'grab',
                transition: isDragging
                  ? 'none'
                  : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                filter: piece.isSnapped
                  ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  : 'drop-shadow(0 8px 12px rgba(0,0,0,0.4))',
              }}
            >
              <g clipPath={`url(#clip-${level.id}-${piece.id})`}>
                <image
                  href={level.imageSrc}
                  x={PUZZLE_OFFSET_X}
                  y={PUZZLE_OFFSET_Y}
                  width={PUZZLE_SIZE}
                  height={PUZZLE_SIZE}
                  preserveAspectRatio={aspectRatio}
                />
              </g>
              <rect
                x={srcX}
                y={srcY}
                width={dims.width}
                height={dims.height}
                fill="none"
                stroke="white"
                strokeWidth="3"
                rx="4"
              />
            </g>
          );
        })}

        {allSnapped && (
          <g style={{ animation: 'puzzleComplete 0.5s ease-out forwards' }}>
            <circle
              cx={PUZZLE_OFFSET_X + PUZZLE_SIZE / 2}
              cy={PUZZLE_OFFSET_Y + PUZZLE_SIZE / 2}
              r="50"
              fill="rgba(255,215,0,0.4)"
            />
            <text
              x={PUZZLE_OFFSET_X + PUZZLE_SIZE / 2}
              y={PUZZLE_OFFSET_Y + PUZZLE_SIZE / 2 + 18}
              textAnchor="middle"
              fontSize="60"
            >
              ✨
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}