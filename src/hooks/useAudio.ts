import { useCallback, useRef, useEffect, useState } from 'react';

interface AudioState {
  isMuted: boolean;
  volume: number;
}

export const useAudio = () => {
  const [audioState, setAudioState] = useState<AudioState>({
    isMuted: false,
    volume: 0.7
  });

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const soundEffectsRef = useRef<{
    eat: HTMLAudioElement;
    gameOver: HTMLAudioElement;
  } | null>(null);

  // Initialize audio
  useEffect(() => {
    try {
      // Initialize background music
      backgroundMusicRef.current = new Audio('/sounds/background.mp3');
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = audioState.volume * 0.3; // Background music quieter

      // Initialize sound effects
      soundEffectsRef.current = {
        eat: new Audio('/sounds/success.mp3'),
        gameOver: new Audio('/sounds/hit.mp3')
      };

      // Set volume for sound effects
      soundEffectsRef.current.eat.volume = audioState.volume;
      soundEffectsRef.current.gameOver.volume = audioState.volume;

    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }

    return () => {
      // Cleanup audio
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Update volumes when audioState changes
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = audioState.isMuted ? 0 : audioState.volume * 0.3;
    }
    if (soundEffectsRef.current) {
      const volume = audioState.isMuted ? 0 : audioState.volume;
      soundEffectsRef.current.eat.volume = volume;
      soundEffectsRef.current.gameOver.volume = volume;
    }
  }, [audioState]);

  const playBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current && !audioState.isMuted) {
      backgroundMusicRef.current.play().catch(error => {
        console.error('Failed to play background music:', error);
      });
    }
  }, [audioState.isMuted]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
  }, []);

  const playEatSound = useCallback(() => {
    if (soundEffectsRef.current && !audioState.isMuted) {
      soundEffectsRef.current.eat.currentTime = 0;
      soundEffectsRef.current.eat.play().catch(error => {
        console.error('Failed to play eat sound:', error);
      });
    }
  }, [audioState.isMuted]);

  const playGameOverSound = useCallback(() => {
    if (soundEffectsRef.current && !audioState.isMuted) {
      soundEffectsRef.current.gameOver.currentTime = 0;
      soundEffectsRef.current.gameOver.play().catch(error => {
        console.error('Failed to play game over sound:', error);
      });
    }
  }, [audioState.isMuted]);

  const toggleMute = useCallback(() => {
    setAudioState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setAudioState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  return {
    audioState,
    playBackgroundMusic,
    stopBackgroundMusic,
    playEatSound,
    playGameOverSound,
    toggleMute,
    setVolume
  };
};