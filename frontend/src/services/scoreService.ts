import api from './api';
import type { ScoreResponse, LeaderboardEntry } from '../types';

export const scoreService = {
  async saveScore(levelId: number, moves: number, timeTaken: number): Promise<ScoreResponse> {
    const response = await api.post<ScoreResponse>('/scores', { levelId, moves, timeTaken });
    return response.data;
  },

  async getLeaderboard(count: number = 20): Promise<LeaderboardEntry[]> {
    const response = await api.get<LeaderboardEntry[]>(`/scores/leaderboard?count=${count}`);
    return response.data;
  },
};
