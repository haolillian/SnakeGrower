import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Direction, Position, GameConfig, Difficulty } from '../types/game';
import { difficultyConfigs } from '../lib/difficultyConfig';

const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

const GRID_SIZE = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const GAME_SPEED = 150;

const gameConfig: GameConfig = {
  gridSize: GRID_SIZE,
  canvasWidth: CANVAS_WIDTH,
  canvasHeight: CANVAS_HEIGHT,
  gameSpeed: GAME_SPEED
};

interface AudioCallbacks {
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  playEatSound: () => void;
  playGameOverSound: () => void;
}

export const useSnakeGame = (audioCallbacks?: AudioCallbacks) => {

  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 15, y: 15 },
    direction: 'RIGHT',
    score: 0,
    gameStatus: 'menu',
    gridSize: GRID_SIZE,
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    difficulty: 'medium'
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastDirectionRef = useRef<Direction>('RIGHT');

  // Generate random food position
  const generateFood = useCallback((snake: Position[]): Position => {
    const maxX = Math.floor(CANVAS_WIDTH / GRID_SIZE) - 1;
    const maxY = Math.floor(CANVAS_HEIGHT / GRID_SIZE) - 1;
    
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, []);

  // Check collision with walls or self
  const checkCollision = useCallback((head: Position, snake: Position[]): boolean => {
    const maxX = Math.floor(CANVAS_WIDTH / GRID_SIZE) - 1;
    const maxY = Math.floor(CANVAS_HEIGHT / GRID_SIZE) - 1;

    // Wall collision
    if (head.x < 0 || head.x > maxX || head.y < 0 || head.y > maxY) {
      return true;
    }

    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  // Move snake in current direction
  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameStatus !== 'playing') return prevState;

      const { snake, direction, food } = prevState;
      const head = { ...snake[0] };

      // Update head position based on direction
      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check collision
      if (checkCollision(head, snake)) {
        console.log('Game Over - Collision detected');
        audioCallbacks?.playGameOverSound();
        audioCallbacks?.stopBackgroundMusic();
        return { ...prevState, gameStatus: 'gameOver' };
      }

      const newSnake = [head, ...snake];

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        const newFood = generateFood(newSnake);
        console.log('Food eaten! Score:', prevState.score + 10);
        audioCallbacks?.playEatSound();
        return {
          ...prevState,
          snake: newSnake,
          food: newFood,
          score: prevState.score + 10
        };
      } else {
        // Remove tail if no food eaten
        newSnake.pop();
        return {
          ...prevState,
          snake: newSnake
        };
      }
    });
  }, [checkCollision, generateFood, audioCallbacks]);

  // Handle direction change
  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prevState => {
      const { direction } = prevState;
      
      // Prevent opposite direction changes
      const opposites = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT'
      };

      if (opposites[newDirection] === direction) {
        return prevState;
      }

      lastDirectionRef.current = newDirection;
      console.log('Direction changed to:', newDirection);
      return { ...prevState, direction: newDirection };
    });
  }, []);

  // Select difficulty and start game
  const selectDifficulty = useCallback((difficulty: Difficulty) => {
    console.log('Difficulty selected:', difficulty);
    const newFood = generateFood(INITIAL_SNAKE);
    setGameState(prevState => ({
      ...prevState,
      snake: INITIAL_SNAKE,
      food: newFood,
      direction: 'RIGHT',
      score: 0,
      gameStatus: 'playing',
      difficulty: difficulty
    }));
    lastDirectionRef.current = 'RIGHT';
    audioCallbacks?.playBackgroundMusic();
  }, [generateFood, audioCallbacks]);

  // Reset game with current difficulty
  const resetGame = useCallback(() => {
    console.log('Game reset');
    const newFood = generateFood(INITIAL_SNAKE);
    setGameState(prevState => ({
      ...prevState,
      snake: INITIAL_SNAKE,
      food: newFood,
      direction: 'RIGHT',
      score: 0,
      gameStatus: 'playing'
    }));
    lastDirectionRef.current = 'RIGHT';
    audioCallbacks?.playBackgroundMusic();
  }, [generateFood, audioCallbacks]);

  // Return to menu
  const returnToMenu = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      gameStatus: 'menu'
    }));
    audioCallbacks?.stopBackgroundMusic();
  }, [audioCallbacks]);

  // Pause/unpause game
  const togglePause = useCallback(() => {
    setGameState(prevState => {
      const newStatus = prevState.gameStatus === 'playing' ? 'paused' : 'playing';
      if (newStatus === 'playing') {
        audioCallbacks?.playBackgroundMusic();
      } else {
        audioCallbacks?.stopBackgroundMusic();
      }
      return {
        ...prevState,
        gameStatus: newStatus
      };
    });
  }, [audioCallbacks]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameStatus === 'gameOver') {
        if (event.code === 'Space' || event.code === 'Enter') {
          resetGame();
        }
        return;
      }

      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          event.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 'KeyS':
          event.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'KeyA':
          event.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'KeyD':
          event.preventDefault();
          changeDirection('RIGHT');
          break;
        case 'Space':
          event.preventDefault();
          togglePause();
          break;
        case 'KeyR':
          event.preventDefault();
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, resetGame, togglePause, gameState.gameStatus]);

  // Calculate dynamic speed based on score and difficulty
  const getCurrentSpeed = useCallback((score: number, difficulty: Difficulty): number => {
    const baseSpeed = difficultyConfigs[difficulty].baseSpeed;
    // Decreases by 5ms every 20 points, minimum 50ms
    const speedReduction = Math.floor(score / 20) * 5;
    const newSpeed = Math.max(50, baseSpeed - speedReduction);
    return newSpeed;
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const currentSpeed = getCurrentSpeed(gameState.score, gameState.difficulty);
      gameLoopRef.current = setInterval(moveSnake, currentSpeed);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.gameStatus, gameState.score, gameState.difficulty, moveSnake, getCurrentSpeed]);

  // Start background music when game begins
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      audioCallbacks?.playBackgroundMusic();
    }
  }, [audioCallbacks]); // Only run once on mount

  return {
    gameState,
    resetGame,
    togglePause,
    changeDirection,
    gameConfig,
    getCurrentSpeed,
    selectDifficulty,
    returnToMenu
  };
};
