import React from "react";
import { SnakeGame } from "./components/SnakeGame";
import { GameUI } from "./components/GameUI";
import { DifficultyMenu } from "./components/DifficultyMenu";
import { useSnakeGame } from "./hooks/useSnakeGame";
import { useAudio } from "./hooks/useAudio";
import "@fontsource/inter";

function App() {
  const { 
    audioState, 
    playBackgroundMusic, 
    stopBackgroundMusic, 
    playEatSound, 
    playGameOverSound, 
    toggleMute, 
    setVolume 
  } = useAudio();

  const { 
    gameState, 
    resetGame, 
    togglePause, 
    getCurrentSpeed,
    selectDifficulty,
    returnToMenu
  } = useSnakeGame({
    playBackgroundMusic,
    stopBackgroundMusic,
    playEatSound,
    playGameOverSound
  });

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden">
      {/* Difficulty Menu */}
      {gameState.gameStatus === 'menu' && (
        <DifficultyMenu onSelectDifficulty={selectDifficulty} />
      )}
      
      {/* Game Canvas */}
      {gameState.gameStatus !== 'menu' && (
        <SnakeGame gameState={gameState} />
      )}
      
      {/* Game UI Overlay */}
      {gameState.gameStatus !== 'menu' && (
        <GameUI 
          gameState={gameState}
          onRestart={resetGame}
          onTogglePause={togglePause}
          getCurrentSpeed={getCurrentSpeed}
          audioState={audioState}
          onToggleMute={toggleMute}
          onVolumeChange={setVolume}
          onReturnToMenu={returnToMenu}
        />
      )}

      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #00ff00 1px, transparent 1px),
              linear-gradient(#00ff00 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>
    </div>
  );
}

export default App;
