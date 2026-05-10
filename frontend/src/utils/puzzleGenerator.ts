import type { GameBoard, LevelConfig } from '../types';
import { MAX_BALLS_PER_TUBE, checkWinCondition } from './gameLogic';

// ============================================
// PUZZLE GENERATOR - Generates solvable puzzles
// ============================================

/** Advanced Difficulty presets */
export const DIFFICULTY_PRESETS = {
  1: { colors: 3, emptyTubes: 2, name: 'Easy', colorClass: 'text-green-400', glowClass: 'shadow-green-500/50' },
  2: { colors: 5, emptyTubes: 2, name: 'Medium', colorClass: 'text-blue-400', glowClass: 'shadow-blue-500/50' },
  3: { colors: 7, emptyTubes: 2, name: 'Hard', colorClass: 'text-orange-400', glowClass: 'shadow-orange-500/50' },
  4: { colors: 10, emptyTubes: 2, name: 'Expert', colorClass: 'text-red-500', glowClass: 'shadow-red-500/60' },
  5: { colors: 14, emptyTubes: 2, name: 'Legend', colorClass: 'text-purple-500', glowClass: 'shadow-purple-500/80' },
};

/**
 * Generate a solvable puzzle by starting from a solved state
 * and applying random reverse moves
 */
// Helper for puzzle generation: reverse move logic
/*function isValidReverseMove(board: GameBoard, from: number, to: number): boolean {
  if (from === to) return false;
  const fromTube = board[from];
  const toTube = board[to];
  
  if (fromTube.length === 0) return false;
  if (toTube.length === MAX_BALLS_PER_TUBE) return false;
  
  // In normal play, a ball could only be placed here if it was empty
  // or if it matched the color of the ball below it.
  if (fromTube.length > 1) {
    if (fromTube[fromTube.length - 1] !== fromTube[fromTube.length - 2]) {
      return false;
    }
  }
  
  // Also, avoid moving a ball if it's the last ball in a tube AND the target tube is empty,
  // as this is a redundant move (just swapping empty tubes)
  if (fromTube.length === 1 && toTube.length === 0) return false;
  
  return true;
}*/

/**
 * Check if a level is too easy (e.g. a tube already has 3 or 4 matching balls)
 */
function isLevelTooEasy(board: GameBoard): boolean {
  for (const tube of board) {
    if (tube.length >= 3) {
      const color = tube[0];
      if (tube.every(ball => ball === color)) return true;
    }
  }
  return false;
}

export function generatePuzzle(colorCount: number, emptyTubes: number = 2, maxRetries: number = 100): GameBoard {
  const totalTubes = colorCount + emptyTubes;

  // Start with solved state
  const solved: GameBoard = [];
  for (let color = 1; color <= colorCount; color++) {
    solved.push(Array(MAX_BALLS_PER_TUBE).fill(color));
  }
  for (let i = 0; i < emptyTubes; i++) {
    solved.push([]);
  }

  let current = solved.map(t => [...t]);
  // Massively increase shuffle moves to ensure deep randomization
  const shuffleMoves = colorCount * 250;

  for (let i = 0; i < shuffleMoves; i++) {
    const validMoves: [number, number][] = [];
    for (let from = 0; from < totalTubes; from++) {
      for (let to = 0; to < totalTubes; to++) {
        if (from === to) continue;
        if (current[from].length === 0) continue;
        if (current[to].length >= MAX_BALLS_PER_TUBE) continue;

        const ball = current[from][current[from].length - 1];
        const destTop = current[to].length > 0 ? current[to][current[to].length - 1] : null;

        // HIGH DIFFICULTY LOGIC:
        // We aggressively discourage stacking the same color on top of itself during reverse generation.
        // This guarantees that in forward play, identical colors will be deeply buried beneath other colors,
        // drastically increasing the need for strategic planning.
        if (ball === destTop && Math.random() > 0.05) continue; // 95% chance to reject same-color stacks

        validMoves.push([from, to]);
      }
    }

    if (validMoves.length === 0) break;

    const [from, to] = validMoves[Math.floor(Math.random() * validMoves.length)];
    const ball = current[from].pop()!;
    current[to].push(ball);
  }

  // Check if fully solved tube exists or if it's too easy
  const hasFullySolvedTube = current.some(t => t.length === MAX_BALLS_PER_TUBE && t.every(b => b === t[0]));
  const tooEasy = isLevelTooEasy(current);

  if ((checkWinCondition(current) || hasFullySolvedTube || tooEasy) && maxRetries > 0) {
    return generatePuzzle(colorCount, emptyTubes, maxRetries - 1);
  }

  return current;
}

/**
 * Parse a level's JSON data string into a GameBoard
 */
export function parseLevelData(data: string): GameBoard {
  try {
    return JSON.parse(data) as GameBoard;
  } catch {
    return [];
  }
}

/**
 * Generate a level config for local play
 */
export function generateLevelConfig(levelNum: number): LevelConfig {
  let difficulty: number;
  if (levelNum <= 50) difficulty = 1;         // 1-50: Easy
  else if (levelNum <= 200) difficulty = 2;   // 51-200: Medium
  else if (levelNum <= 400) difficulty = 3;   // 201-400: Hard
  else if (levelNum <= 700) difficulty = 4;   // 401-700: Expert
  else difficulty = 5;                        // 701+: Legend

  const preset = DIFFICULTY_PRESETS[difficulty as keyof typeof DIFFICULTY_PRESETS];
  const board = generatePuzzle(preset.colors, preset.emptyTubes);

  return {
    id: levelNum,
    difficulty,
    difficultyName: preset.name,
    tubeCount: preset.colors + preset.emptyTubes,
    colorCount: preset.colors,
    data: JSON.stringify(board),
  };
}
