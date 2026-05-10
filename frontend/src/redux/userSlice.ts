import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

interface UserState {
  user: User;
  loading: boolean;
  error: string | null;
}

const DEFAULT_USER: User = {
  id: 0,
  username: 'Player',
  email: '',
  coins: 0,
  currentLevel: 1
};

// Load persisted user from localStorage or use default
function loadUser(): User {
  try {
    const userStr = localStorage.getItem('bsg_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch {}
  return DEFAULT_USER;
}

const initialState: UserState = {
  user: loadUser(),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateCoins(state, action: PayloadAction<number>) {
      state.user.coins = action.payload;
      localStorage.setItem('bsg_user', JSON.stringify(state.user));
    },

    updateCurrentLevel(state, action: PayloadAction<number>) {
      state.user.currentLevel = action.payload;
      localStorage.setItem('bsg_user', JSON.stringify(state.user));
    },

    updateProfile(state, action: PayloadAction<{ username?: string; avatarUrl?: string }>) {
      if (action.payload.username) state.user.username = action.payload.username;
      if (action.payload.avatarUrl !== undefined) state.user.avatarUrl = action.payload.avatarUrl;
      localStorage.setItem('bsg_user', JSON.stringify(state.user));
    },

    resetProgress(state) {
      state.user = { ...DEFAULT_USER };
      localStorage.setItem('bsg_user', JSON.stringify(state.user));
    }
  },
});

export const { updateCoins, updateCurrentLevel, updateProfile, resetProgress } = userSlice.actions;

export default userSlice.reducer;
