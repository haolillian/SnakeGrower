import React, { useEffect, useState } from 'react';
import { GameState } from '../types/game';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface AudioState {
  isMuted: boolean;
  volume: number;
}

interface GameUIProps {
  gameState: GameState;
  onRestart: () => void;
  onTogglePause: () => void;
  getCurrentSpeed: (score: number, difficulty: string) => number;
  audioState: AudioState;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onReturnToMenu: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({ 
  gameState, 
  onRestart, 
  onTogglePause, 
  getCurrentSpeed, 
  audioState, 
  onToggleMute, 
  onVolumeChange,
  onReturnToMenu
}) => {
  const { score, gameStatus, difficulty } = gameState;
  
  // High score management
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    // Update high score if current score is higher
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const currentSpeed = getCurrentSpeed(score, difficulty);
  const speedLevel = Math.max(1, Math.floor((200 - currentSpeed) / 5) + 1);

  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      {/* Score and Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <Card className="bg-black/80 border-green-500">
            <CardContent className="p-3">
              <div className="text-green-400 font-mono text-xl font-bold">
                Score: {score}
              </div>
              {highScore > 0 && (
                <div className="text-yellow-400 font-mono text-sm">
                  Best: {highScore}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-black/80 border-blue-500">
            <CardContent className="p-3">
              <div className="text-blue-400 font-mono text-sm">
                Speed: Lv.{speedLevel}
              </div>
              <div className="text-gray-400 font-mono text-xs">
                {currentSpeed}ms
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={onTogglePause}
            disabled={gameStatus === 'gameOver'}
            className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
          >
            {gameStatus === 'paused' ? 'Resume' : 'Pause'}
          </Button>
          <Button
            onClick={onToggleMute}
            className={`${audioState.isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold`}
          >
            {audioState.isMuted ? '🔇' : '🔊'}
          </Button>
          <Button
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Restart
          </Button>
          <Button
            onClick={onReturnToMenu}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold"
          >
            Menu
          </Button>
        </div>
      </div>

      {/* Game Over Screen */}
      {gameStatus === 'gameOver' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20">
          <Card className="bg-red-900/90 border-red-500 border-2">
            <CardContent className="p-8 text-center">
              <h2 className="text-4xl font-bold text-red-400 mb-4">GAME OVER</h2>
              <p className="text-white text-xl mb-2">Final Score: {score}</p>
              {score === highScore && score > 0 && (
                <p className="text-yellow-400 text-lg mb-2 font-bold">
                  🎉 NEW HIGH SCORE! 🎉
                </p>
              )}
              <p className="text-gray-300 mb-2">Speed Level: {speedLevel}</p>
              <p className="text-gray-300 mb-6">
                You crashed! Better luck next time.
              </p>
              <Button
                onClick={onRestart}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3"
              >
                Play Again
              </Button>
              <p className="text-gray-400 text-sm mt-4">
                Press SPACE or ENTER to restart
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pause Screen */}
      {gameStatus === 'paused' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20">
          <Card className="bg-blue-900/90 border-blue-500 border-2">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-blue-400 mb-4">PAUSED</h2>
              <p className="text-white text-lg mb-6">
                Press SPACE to continue
              </p>
              <Button
                onClick={onTogglePause}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3"
              >
                Resume Game
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls Help */}
      <Card className="bg-black/60 border-gray-600 mt-4">
        <CardContent className="p-3">
          <div className="text-gray-300 text-sm font-mono">
            <div className="flex justify-between">
              <span>Arrow Keys / WASD: Move</span>
              <span>SPACE: Pause</span>
              <span>R: Restart</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
