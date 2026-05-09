import api from './api';
import type { LevelConfig } from '../types';

export const levelService = {
  async getLevels(): Promise<LevelConfig[]> {
    const response = await api.get<LevelConfig[]>('/levels');
    return response.data;
  },

  async getLevel(id: number): Promise<LevelConfig> {
    const response = await api.get<LevelConfig>(`/levels/${id}`);
    return response.data;
  },
};
