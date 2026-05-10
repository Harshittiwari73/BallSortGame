import type { GameBoard } from '../types';

// ============================================
// GAME LOGIC - Core Ball Sort Puzzle Engine
// ============================================

/** Maximum balls per tube */
export const MAX_BALLS_PER_TUBE = 4;

/**
 * Check if a move from one tube to another is valid
 * Rules:
 *  - Source tube must have at least one ball
 *  - Destination tube must not be full
 *  - Destination must be empty OR top ball color must match
 */
export function isValidMove(tubes: GameBoard, from: number, to: number): boolean {
  if (from === to) return false;

  const sourceTube = tubes[from];
  const destTube = tubes[to];

  // Source must have balls
  if (sourceTube.length === 0) return false;

  // Destination must not be full
  if (destTube.length >= MAX_BALLS_PER_TUBE) return false;

  // Destination must be empty or top colors must match
  if (destTube.length === 0) return true;

  const sourceTop = sourceTube[sourceTube.length - 1];
  const destTop = destTube[destTube.length - 1];

  return sourceTop === destTop;
}

/**
 * Get how many balls of the same color are consecutively at the top
 */
export function getConsecutiveCount(tube: number[]): number {
  if (tube.length === 0) return 0;
  const topColor = tube[tube.length - 1];
  let count = 0;
  for (let i = tube.length - 1; i >= 0; i--) {
    if (tube[i] === topColor) count++;
    else break;
  }
  return count;
}

/**
 * Execute a move: remove top ball(s) from source, add to destination
 * If multiple balls of the same color are at the top, move all that fit.
 * Returns a new board state (immutable)
 */
export function executeMove(tubes: GameBoard, from: number, to: number): GameBoard {
  const newTubes = tubes.map(tube => [...tube]);
  const sourceTube = newTubes[from];
  const destTube = newTubes[to];

  if (sourceTube.length === 0) return newTubes;

  // const ballColor = sourceTube[sourceTube.length - 1];
  const countInSource = getConsecutiveCount(sourceTube);
  const spaceInDest = MAX_BALLS_PER_TUBE - destTube.length;

  // In a professional Ball Sort game, we move the whole stack if it fits.
  // If only part of the stack fits, some games move what fits, others block.
  // The user requirement says "move all matching top balls together".
  const actualToMove = Math.min(countInSource, spaceInDest);

  for (let i = 0; i < actualToMove; i++) {
    const ball = sourceTube.pop()!;
    destTube.push(ball);
  }

  return newTubes;
}

/**
 * Check if the puzzle is solved
 * Each non-empty tube must contain exactly MAX_BALLS_PER_TUBE balls of the same color
 */
export function checkWinCondition(tubes: GameBoard): boolean {
  for (const tube of tubes) {
    if (tube.length === 0) continue; // Empty tubes are OK
    if (tube.length !== MAX_BALLS_PER_TUBE) return false;

    const color = tube[0];
    if (!tube.every(ball => ball === color)) return false;
  }
  return true;
}

/**
 * Get the top ball color of a tube (or null if empty)
 */
export function getTopBall(tube: number[]): number | null {
  return tube.length > 0 ? tube[tube.length - 1] : null;
}

/**
 * Check if a tube is complete (4 same-color balls)
 */
export function isTubeComplete(tube: number[]): boolean {
  if (tube.length !== MAX_BALLS_PER_TUBE) return false;
  return tube.every(ball => ball === tube[0]);
}

/**
 * Check if a tube has all same color (but possibly not full)
 */
export function isTubeSingleColor(tube: number[]): boolean {
  if (tube.length === 0) return true;
  return tube.every(ball => ball === tube[0]);
}

/**
 * Get all valid moves from current state
 */
export function getValidMoves(tubes: GameBoard): [number, number][] {
  const moves: [number, number][] = [];
  for (let from = 0; from < tubes.length; from++) {
    for (let to = 0; to < tubes.length; to++) {
      if (from !== to && isValidMove(tubes, from, to)) {
        // Skip moving from a complete tube
        if (isTubeComplete(tubes[from])) continue;
        // Skip moving to an empty tube if source is all same color
        if (tubes[to].length === 0 && isTubeSingleColor(tubes[from])) continue;
        moves.push([from, to]);
      }
    }
  }
  return moves;
}

/**
 * Deep clone a game board
 */
export function cloneBoard(tubes: GameBoard): GameBoard {
  return tubes.map(tube => [...tube]);
}
