import type { GameBoard, LevelConfig } from '../types';
import { MAX_BALLS_PER_TUBE, checkWinCondition } from './gameLogic';

// ============================================
// PUZZLE GENERATOR - Generates solvable puzzles
// ============================================

/** Difficulty presets */
export const DIFFICULTY_PRESETS = {
  1: { colors: 2, emptyTubes: 2, name: 'Easy' },
  2: { colors: 3, emptyTubes: 2, name: 'Medium' },
  3: { colors: 5, emptyTubes: 2, name: 'Hard' },
  4: { colors: 8, emptyTubes: 3, name: 'Expert' },
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
  // Increase shuffle moves for better mixing
  const shuffleMoves = colorCount * 150;

  for (let i = 0; i < shuffleMoves; i++) {
    const validMoves: [number, number][] = [];
    for (let from = 0; from < totalTubes; from++) {
      for (let to = 0; to < totalTubes; to++) {
        // Reverse move logic: we can move a ball if it wouldn't immediately 
        // violate forward rules (or we just want a good mix)
        if (from === to) continue;
        if (current[from].length === 0) continue;
        if (current[to].length >= MAX_BALLS_PER_TUBE) continue;

        // Strategy: avoid putting the same color on top of itself too much in reverse
        // because that makes it "easier" to solve later.
        const ball = current[from][current[from].length - 1];
        const destTop = current[to].length > 0 ? current[to][current[to].length - 1] : null;

        if (ball === destTop && Math.random() > 0.2) continue; // Discourage same-color stacks in reverse

        validMoves.push([from, to]);
      }
    }

    if (validMoves.length === 0) break;

    const [from, to] = validMoves[Math.floor(Math.random() * validMoves.length)];
    // Manual move to avoid multi-ball logic during shuffle
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
  if (levelNum <= 50) difficulty = 1;
  else if (levelNum <= 150) difficulty = 2;
  else if (levelNum <= 350) difficulty = 3;
  else difficulty = 4;

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
