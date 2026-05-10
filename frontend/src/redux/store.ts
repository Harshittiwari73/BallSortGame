import { configureStore, combineReducers } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import userReducer from './userSlice';
import uiReducer from './uiSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('ballSortGameState');
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);

    // Ensure the game doesn't load in a permanently paused state if it was paused when closed
    if (parsedState?.game) {
      parsedState.game.isPaused = false;
    }

    return parsedState;
  } catch (err) {
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('ballSortGameState', serializedState);
  } catch {
    // Ignore write errors
  }
};

const rootReducer = combineReducers({
  game: gameReducer,
  user: userReducer,
  ui: uiReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
});

// Subscribe to store changes to save state
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
