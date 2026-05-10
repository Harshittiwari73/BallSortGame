import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GameBoard } from '../types';
import { isValidMove, executeMove, checkWinCondition, cloneBoard } from '../utils/gameLogic';
import { generatePuzzle, parseLevelData, DIFFICULTY_PRESETS } from '../utils/puzzleGenerator';

interface GameState {
  tubes: GameBoard;
  selectedTube: number | null;
  moves: number;
  level: number;
  history: GameBoard[];
  isWon: boolean;
  timer: number;
  isPlaying: boolean;
  hintFrom: number | null;
  hintTo: number | null;
  perfectTubeIndex: number | null;
}

function getInitialBoard(level: number): GameBoard {
  let difficulty: number;
  if (level <= 50) difficulty = 1;
  else if (level <= 150) difficulty = 2;
  else if (level <= 350) difficulty = 3;
  else difficulty = 4;

  const preset = DIFFICULTY_PRESETS[difficulty as keyof typeof DIFFICULTY_PRESETS];
  return generatePuzzle(preset.colors, preset.emptyTubes);
}

const initialState: GameState = {
  tubes: getInitialBoard(1),
  selectedTube: null,
  moves: 0,
  level: 1,
  history: [],
  isWon: false,
  timer: 0,
  isPlaying: false,
  hintFrom: null,
  hintTo: null,
  perfectTubeIndex: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    /** Start or resume the game timer */
    startPlaying(state) {
      state.isPlaying = true;
    },

    /** Pause the game */
    pauseGame(state) {
      state.isPlaying = false;
    },

    /** Increment timer by 1 second */
    tick(state) {
      if (state.isPlaying && !state.isWon) {
        state.timer += 1;
      }
    },

    /** Player taps a tube */
    selectTube(state, action: PayloadAction<number>) {
      const tubeIndex = action.payload;

      // Clear hint and perfect effect when player interacts
      state.hintFrom = null;
      state.hintTo = null;
      state.perfectTubeIndex = null;

      // If no tube selected yet, select this one (if it has balls)
      if (state.selectedTube === null) {
        if (state.tubes[tubeIndex].length > 0) {
          state.selectedTube = tubeIndex;
        }
        return;
      }

      // If same tube tapped, deselect
      if (state.selectedTube === tubeIndex) {
        state.selectedTube = null;
        return;
      }

      // Try to move ball from selected tube to tapped tube
      if (isValidMove(state.tubes, state.selectedTube, tubeIndex)) {
        // Save current state for undo
        state.history.push(cloneBoard(state.tubes));

        // Execute the move
        state.tubes = executeMove(state.tubes, state.selectedTube, tubeIndex);
        state.moves += 1;
        
        // Check if this was a "Perfect Move" (completing a tube)
        const destTube = state.tubes[tubeIndex];
        if (destTube.length === 4 && destTube.every(b => b === destTube[0])) {
          state.perfectTubeIndex = tubeIndex;
        }

        state.selectedTube = null;

        // Check win condition
        if (checkWinCondition(state.tubes)) {
          state.isWon = true;
          state.isPlaying = false;
        }
      } else {
        // Invalid move - select the new tube instead if it has balls
        if (state.tubes[tubeIndex].length > 0) {
          state.selectedTube = tubeIndex;
        } else {
          state.selectedTube = null;
        }
      }
    },

    /** Undo the last move */
    undoMove(state) {
      if (state.history.length > 0) {
        state.tubes = state.history.pop()!;
        state.moves = Math.max(0, state.moves - 1);
        state.selectedTube = null;
        state.isWon = false;
        state.hintFrom = null;
        state.hintTo = null;
        state.perfectTubeIndex = null;
      }
    },

    /** Restart current level */
    restartLevel(state) {
      state.tubes = getInitialBoard(state.level);
      state.selectedTube = null;
      state.moves = 0;
      state.history = [];
      state.isWon = false;
      state.timer = 0;
      state.isPlaying = true;
      state.hintFrom = null;
      state.hintTo = null;
      state.perfectTubeIndex = null;
    },

    /** Go to next level */
    nextLevel(state) {
      state.level += 1;
      state.tubes = getInitialBoard(state.level);
      state.selectedTube = null;
      state.moves = 0;
      state.history = [];
      state.isWon = false;
      state.timer = 0;
      state.isPlaying = true;
      state.hintFrom = null;
      state.hintTo = null;
      state.perfectTubeIndex = null;
    },

    /** Load a specific level */
    loadLevel(state, action: PayloadAction<{ level: number; data?: string }>) {
      state.level = action.payload.level;
      if (action.payload.data) {
        state.tubes = parseLevelData(action.payload.data);
      } else {
        state.tubes = getInitialBoard(action.payload.level);
      }
      state.selectedTube = null;
      state.moves = 0;
      state.history = [];
      state.isWon = false;
      state.timer = 0;
      state.isPlaying = true;
      state.hintFrom = null;
      state.hintTo = null;
      state.perfectTubeIndex = null;
    },

    /** Show a hint (highlight from/to tubes) */
    setHint(state, action: PayloadAction<{ from: number; to: number } | null>) {
      if (action.payload) {
        state.hintFrom = action.payload.from;
        state.hintTo = action.payload.to;
      } else {
        state.hintFrom = null;
        state.hintTo = null;
      }
    },
  },
});

export const {
  startPlaying,
  pauseGame,
  tick,
  selectTube,
  undoMove,
  restartLevel,
  nextLevel,
  loadLevel,
  setHint,
} = gameSlice.actions;

export default gameSlice.reducer;
