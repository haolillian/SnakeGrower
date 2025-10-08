import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Difficulty } from '../types/game';
import { difficultyConfigs } from '../lib/difficultyConfig';

interface DifficultyMenuProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export const DifficultyMenu: React.FC<DifficultyMenuProps> = ({ onSelectDifficulty }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <Card className="bg-gray-800/95 border-green-500 border-2 max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-400">
            🐍 貪吃蛇遊戲
          </CardTitle>
          <p className="text-gray-300 mt-2">選擇難度等級</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {(Object.entries(difficultyConfigs) as [Difficulty, DifficultyConfig][]).map(([difficulty, config]) => (
            <Button
              key={difficulty}
              onClick={() => onSelectDifficulty(difficulty)}
              className={`w-full p-6 text-left justify-start ${
                difficulty === 'easy' 
                  ? 'bg-green-600 hover:bg-green-700'
                  : difficulty === 'medium'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white font-bold text-lg`}
              variant="default"
            >
              <div className="flex flex-col items-start">
                <span className="text-xl">{config.name}</span>
                <span className="text-sm opacity-80 font-normal">
                  {config.description}
                </span>
                <span className="text-xs opacity-60 font-normal">
                  基礎速度: {config.baseSpeed}ms
                </span>
              </div>
            </Button>
          ))}
          
          <div className="mt-6 pt-4 border-t border-gray-600">
            <p className="text-gray-400 text-sm text-center">
              使用 ↑↓←→ 或 WASD 控制方向
            </p>
            <p className="text-gray-400 text-sm text-center">
              SPACE 暫停 • R 重新開始
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

