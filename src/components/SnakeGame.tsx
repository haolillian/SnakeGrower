import React, { useRef, useEffect } from 'react';
import { GameState, Position } from '../types/game';

interface SnakeGameProps {
  gameState: GameState;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, gameState.canvasWidth, gameState.canvasHeight);

    // Draw grid (optional, for better visibility)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x <= gameState.canvasWidth; x += gameState.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, gameState.canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= gameState.canvasHeight; y += gameState.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(gameState.canvasWidth, y);
      ctx.stroke();
    }

    // Draw snake
    gameState.snake.forEach((segment: Position, index: number) => {
      const x = segment.x * gameState.gridSize;
      const y = segment.y * gameState.gridSize;

      if (index === 0) {
        // Snake head - brighter green
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(x, y, gameState.gridSize, gameState.gridSize);
        
        // Add eyes to the head
        ctx.fillStyle = '#000';
        const eyeSize = 3;
        const eyeOffset = 5;
        ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(x + gameState.gridSize - eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize);
      } else {
        // Snake body - darker green
        ctx.fillStyle = '#008000';
        ctx.fillRect(x + 1, y + 1, gameState.gridSize - 2, gameState.gridSize - 2);
      }

      // Add border to snake segments
      ctx.strokeStyle = '#004000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, gameState.gridSize, gameState.gridSize);
    });

    // Draw food
    const foodX = gameState.food.x * gameState.gridSize;
    const foodY = gameState.food.y * gameState.gridSize;
    
    // Draw food as a circle
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
      foodX + gameState.gridSize / 2,
      foodY + gameState.gridSize / 2,
      gameState.gridSize / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Add shine effect to food
    ctx.fillStyle = '#ff6666';
    ctx.beginPath();
    ctx.arc(
      foodX + gameState.gridSize / 2 - 3,
      foodY + gameState.gridSize / 2 - 3,
      3,
      0,
      2 * Math.PI
    );
    ctx.fill();

  }, [gameState]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={gameState.canvasWidth}
          height={gameState.canvasHeight}
          className="border-2 border-green-500 bg-black shadow-lg shadow-green-500/20"
          style={{
            imageRendering: 'pixelated'
          }}
        />
      </div>
    </div>
  );
};
