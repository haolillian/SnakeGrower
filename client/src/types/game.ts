export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  gameStatus: 'playing' | 'gameOver' | 'paused' | 'menu';
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
  difficulty: Difficulty;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  name: string;
  baseSpeed: number;
  description: string;
}

export interface GameConfig {
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
  gameSpeed: number;
}
