// ============================================
// SISTEMA DE PROGRESO (localStorage)
// ============================================

import { STORAGE_KEYS } from './constants';
import { levels } from './levels';

export function getCompletedLevels(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.progress);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function markLevelCompleted(levelId: string): void {
  if (typeof window === 'undefined') return;
  const completed = getCompletedLevels();
  completed.add(levelId);
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.progress,
      JSON.stringify(Array.from(completed))
    );
  } catch {
    // Silenciar si localStorage está lleno o deshabilitado
  }
}

export function isLevelUnlocked(levelOrder: number): boolean {
  if (levelOrder === 1) return true;
  const completed = getCompletedLevels();
  const previousLevel = levels.find((l) => l.order === levelOrder - 1);
  if (!previousLevel) return false;
  return completed.has(previousLevel.id);
}

export function getNextLevel(currentLevelId: string) {
  const current = levels.find((l) => l.id === currentLevelId);
  if (!current) return null;
  return levels.find((l) => l.order === current.order + 1) ?? null;
}