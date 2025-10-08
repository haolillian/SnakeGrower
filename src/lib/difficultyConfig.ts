import { Difficulty, DifficultyConfig } from '../types/game';

export const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: '簡單',
    baseSpeed: 200,
    description: '慢速移動，適合新手'
  },
  medium: {
    name: '中等',
    baseSpeed: 150,
    description: '中等速度，平衡體驗'
  },
  hard: {
    name: '困難',
    baseSpeed: 100,
    description: '快速移動，挑戰專家'
  }
};