import type { Level } from '../../../shared/types/game';
import { level1 } from './level1';
import { level2 } from './level2';
import { level3 } from './level3';
import { level4 } from './level4';
import { level5 } from './level5';

const levels: Level[] = [level1, level2, level3, level4, level5];

export function loadLevel(id: number): Level {
  const level = levels.find((l) => l.id === id);
  if (!level) {
    return levels[levels.length - 1]!;
  }
  return level;
}

export function getMaxLevel(): number {
  return levels.length;
}

export { levels };
