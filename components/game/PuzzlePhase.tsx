'use client';

import { useEffect, useRef, useState } from 'react';
import type { Level } from '@/lib/types';
import { GAME_VIEWBOX } from '@/lib/constants';
import { getCharacterDetails } from '@/lib/characters';
import {
  generatePieces,
  isPieceNearTarget,
  calculateBBoxFromPath,
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

export default function PuzzlePhase({ level, onComplete }: PuzzlePhaseProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const bbox = calculateBBoxFromPath(level.tracingPath);

  const [pieces, setPieces] = useState<PieceState[]>(() => {
    const regions = generatePieces(
      level.puzzlePieces,
      level.cutStyle,
      level.tracingPath
    );
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
          // 🔔 Sonido al encajar
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
          {pieces.map((p) => (
            <clipPath key={`clip-${p.id}`} id={`piece-clip-${level.id}-${p.id}`}>
              <rect
                x={p.clipX}
                y={p.clipY}
                width={p.clipWidth}
                height={p.clipHeight}
              />
            </clipPath>
          ))}
          <clipPath id={`character-shape-${level.id}`}>
            <path d={level.tracingPath} />
          </clipPath>
        </defs>

        <g opacity="0.2">
          <path
            d={level.tracingPath}
            fill={level.fillColor}
            stroke={level.accentColor}
            strokeWidth="3"
          />
        </g>

        {pieces.map((piece) => {
          const pieceCenterX = piece.clipX + piece.clipWidth / 2;
          const pieceCenterY = piece.clipY + piece.clipHeight / 2;
          const translateX = piece.currentX - pieceCenterX;
          const translateY = piece.currentY - pieceCenterY;

          const isDragging = draggingId === piece.id;

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
                  ? 'none'
                  : 'drop-shadow(0 6px 10px rgba(0,0,0,0.3))',
              }}
            >
              <g clipPath={`url(#piece-clip-${level.id}-${piece.id})`}>
                <g clipPath={`url(#character-shape-${level.id})`}>
                  <path d={level.tracingPath} fill={level.fillColor} />
                  {getCharacterDetails(level.id)}
                </g>
                <path
                  d={level.tracingPath}
                  fill="none"
                  stroke="white"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          );
        })}

        {allSnapped && (
          <g style={{ animation: 'puzzleComplete 0.5s ease-out forwards' }}>
            <circle
              cx={bbox.x + bbox.width / 2}
              cy={bbox.y + bbox.height / 2}
              r="30"
              fill="#FFD700"
              opacity="0.6"
            />
            <text
              x={bbox.x + bbox.width / 2}
              y={bbox.y + bbox.height / 2 + 12}
              textAnchor="middle"
              fontSize="40"
            >
              ✨
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}