import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
}

const initialState: UIState = {
  darkMode: localStorage.getItem('bsg_darkMode') !== 'false', // default true
  soundEnabled: localStorage.getItem('bsg_sound') !== 'false',
  musicEnabled: localStorage.getItem('bsg_music') !== 'false',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('bsg_darkMode', String(state.darkMode));
    },
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('bsg_sound', String(state.soundEnabled));
    },
    toggleMusic(state) {
      state.musicEnabled = !state.musicEnabled;
      localStorage.setItem('bsg_music', String(state.musicEnabled));
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
      localStorage.setItem('bsg_darkMode', String(state.darkMode));
    },
  },
});

export const { toggleDarkMode, toggleSound, toggleMusic, setDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
