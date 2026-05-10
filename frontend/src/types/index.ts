// ============================================
// GAME TYPES
// ============================================

/** A single tube is an array of color IDs (0 = empty slot). Index 0 = bottom */
export type Tube = number[];

/** Full game board state */
export type GameBoard = Tube[];

/** Represents a single move for undo */
export interface GameMove {
  fromTube: number;
  toTube: number;
  color: number;
}

/** Game state for Redux */
export interface GameState {
  tubes: GameBoard;
  selectedTube: number | null;
  moves: number;
  level: number;
  history: GameBoard[];
  isWon: boolean;
  timer: number;
  isPlaying: boolean;
  coins: number;
  hintFrom: number | null;
  hintTo: number | null;
}

/** Level configuration from API */
export interface LevelConfig {
  id: number;
  difficulty: number;
  difficultyName: string;
  tubeCount: number;
  colorCount: number;
  data: string;
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: number;
  username: string;
  email: string;
  coins: number;
  currentLevel: number;
  avatarUrl?: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  token: string;
  coins: number;
  currentLevel: number;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  coins: number;
  currentLevel: number;
  levelsCompleted: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  unlockedAt: string | null;
}

// ============================================
// SCORE / LEADERBOARD TYPES
// ============================================

export interface ScoreResponse {
  id: number;
  levelId: number;
  moves: number;
  timeTaken: number;
  coinsEarned: number;
  completedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  totalScore: number;
  levelsCompleted: number;
  totalCoins: number;
}

// ============================================
// UI TYPES
// ============================================

export interface UIState {
  darkMode: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
}
