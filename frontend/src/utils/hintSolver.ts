import type { GameBoard } from '../types';
import { isValidMove, executeMove, checkWinCondition } from './gameLogic';

// ============================================
// HINT SOLVER - BFS to find the next best move
// ============================================

interface BFSState {
  board: GameBoard;
  moves: [number, number][];
}

/**
 * Use BFS to find a solution path, then return the first move as a hint
 * Returns [fromTube, toTube] or null if no solution found
 * Limited to maxDepth to prevent performance issues
 */
export function findHint(tubes: GameBoard, maxDepth: number = 50): [number, number] | null {
  if (checkWinCondition(tubes)) return null;

  const queue: BFSState[] = [{ board: tubes, moves: [] }];
  const visited = new Set<string>();
  visited.add(boardToString(tubes));

  while (queue.length > 0 && visited.size < 5000) {
    const current = queue.shift()!;
    
    if (current.moves.length >= maxDepth) continue;

    // Get all valid moves from current state
    for (let from = 0; from < current.board.length; from++) {
      for (let to = 0; to < current.board.length; to++) {
        if (from === to) continue;
        if (!isValidMove(current.board, from, to)) continue;
        
        // Skip trivially useless moves
        if (current.board[from].length === 0) continue;
        if (current.board[to].length === 0 && 
            current.board[from].every(b => b === current.board[from][0])) continue;

        const newBoard = executeMove(current.board, from, to);
        const key = boardToString(newBoard);
        
        if (visited.has(key)) continue;
        visited.add(key);

        const newMoves: [number, number][] = [...current.moves, [from, to]];

        if (checkWinCondition(newBoard)) {
          return newMoves[0]; // Return first move of solution
        }

        queue.push({ board: newBoard, moves: newMoves });
      }
    }
  }

  return null; // No solution found within limits
}

/**
 * Convert board to string for visited set
 */
function boardToString(board: GameBoard): string {
  return board.map(tube => tube.join(',')).join('|');
}
