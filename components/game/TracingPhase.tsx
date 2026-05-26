'use client';

import { useEffect, useRef, useState } from 'react';
import type { Level, Point } from '@/lib/types';
import { GAME_VIEWBOX } from '@/lib/constants';
import {
  samplePathPoints,
  screenToSvg,
  findNextPathPoint,
  isNearStart,
} from '@/lib/pathMath';

interface TracingPhaseProps {
  level: Level;
  onComplete: () => void;
}

export default function TracingPhase({ level, onComplete }: TracingPhaseProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const pathPointsRef = useRef<Point[]>([]);
  const totalLengthRef = useRef<number>(0);

  const [isTracing, setIsTracing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pathReady, setPathReady] = useState(false);
  const lastIndexRef = useRef(0);

  // Inicializar puntos del path al montar
  useEffect(() => {
    if (!pathRef.current) return;
    pathPointsRef.current = samplePathPoints(pathRef.current, 200);
    totalLengthRef.current = pathRef.current.getTotalLength();
    setPathReady(true);
  }, []);

  // Resetear cuando cambia el nivel
  useEffect(() => {
    setProgress(0);
    setIsTracing(false);
    lastIndexRef.current = 0;
  }, [level.id]);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const fingerPos = screenToSvg(svgRef.current, e.clientX, e.clientY);

    if (isNearStart(fingerPos, level.tracingStart, level.tracingTolerance + 20)) {
      setIsTracing(true);
      lastIndexRef.current = 0;
      svgRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isTracing || !svgRef.current) return;

    const fingerPos = screenToSvg(svgRef.current, e.clientX, e.clientY);
    const pathPoints = pathPointsRef.current;

    const newIndex = findNextPathPoint(
      pathPoints,
      fingerPos,
      lastIndexRef.current,
      level.tracingTolerance,
      25
    );

    if (newIndex !== -1 && newIndex >= lastIndexRef.current) {
      lastIndexRef.current = newIndex;
      const newProgress = newIndex / (pathPoints.length - 1);
      setProgress(newProgress);

      if (newProgress >= 0.97) {
        setIsTracing(false);
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (svgRef.current && svgRef.current.hasPointerCapture(e.pointerId)) {
      svgRef.current.releasePointerCapture(e.pointerId);
    }
    setIsTracing(false);
  };

  // Si el path no está listo aún, ocultarlo completamente con un offset enorme
  const dashOffset = pathReady
    ? totalLengthRef.current * (1 - progress)
    : 10000;

  return (
    <div className="relative h-full w-full flex items-center justify-center touch-none select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${GAME_VIEWBOX.width} ${GAME_VIEWBOX.height}`}
        className="h-full w-full max-h-[80vh] max-w-[95vw]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Contorno punteado guía */}
        <path
          d={level.tracingPath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="12 16"
        />

        {/* Trazo blanco que se rellena */}
        <path
          ref={pathRef}
          d={level.tracingPath}
          fill="none"
          stroke="white"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLengthRef.current || 1}
          strokeDashoffset={dashOffset}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
            transition: 'stroke-dashoffset 0.1s ease-out',
          }}
        />

        {/* Estrella amarilla en punto de inicio */}
        {progress < 0.05 && pathReady && (
          <g transform={`translate(${level.tracingStart.x}, ${level.tracingStart.y})`}>
            <circle r="20" fill="yellow" opacity="0.4" className="animate-ping" />
            <circle r="14" fill="yellow" stroke="white" strokeWidth="3" />
            <text
              y="6"
              textAnchor="middle"
              fontSize="20"
              fill="#FFA500"
              fontWeight="bold"
            >
              ✋
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}