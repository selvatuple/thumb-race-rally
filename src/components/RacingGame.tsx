
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RaceTrack from './RaceTrack';
import GameStats from './GameStats';
import WinnerModal from './WinnerModal';
import StartScreen from './StartScreen';
import confetti from 'canvas-confetti';

interface GameState {
  leftCarDistance: number;
  rightCarDistance: number;
  isGameActive: boolean;
  winner: 'left' | 'right' | null;
  leftPushes: number;
  rightPushes: number;
  currentScreen: 'start' | 'game';
}

const RacingGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    leftCarDistance: 0,
    rightCarDistance: 0,
    isGameActive: false,
    winner: null,
    leftPushes: 0,
    rightPushes: 0,
    currentScreen: 'start',
  });

  const PUSH_DISTANCE = 2.5; // meters per push - increased for more visible movement
  const FINISH_LINE = 100; // meters

  const showGameScreen = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'game'
    }));
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      leftCarDistance: 0,
      rightCarDistance: 0,
      isGameActive: true,
      winner: null,
      leftPushes: 0,
      rightPushes: 0,
      currentScreen: 'game'
    }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      leftCarDistance: 0,
      rightCarDistance: 0,
      isGameActive: false,
      winner: null,
      leftPushes: 0,
      rightPushes: 0,
      currentScreen: 'start'
    }));
  };

  const pushCar = (side: 'left' | 'right') => {
    if (!gameState.isGameActive || gameState.winner) return;

    setGameState(prev => {
      const newState = { ...prev };
      
      if (side === 'left') {
        newState.leftCarDistance = Math.min(prev.leftCarDistance + PUSH_DISTANCE, FINISH_LINE);
        newState.leftPushes = prev.leftPushes + 1;
      } else {
        newState.rightCarDistance = Math.min(prev.rightCarDistance + PUSH_DISTANCE, FINISH_LINE);
        newState.rightPushes = prev.rightPushes + 1;
      }

      return newState;
    });
  };

  const pullBackCar = (side: 'left' | 'right') => {
    if (!gameState.isGameActive || gameState.winner) return;

    setGameState(prev => {
      const newState = { ...prev };
      
      if (side === 'left') {
        newState.leftCarDistance = Math.max(prev.leftCarDistance - PUSH_DISTANCE, 0);
      } else {
        newState.rightCarDistance = Math.max(prev.rightCarDistance - PUSH_DISTANCE, 0);
      }

      return newState;
    });
  };

  useEffect(() => {
    if (gameState.leftCarDistance >= FINISH_LINE && !gameState.winner) {
      setGameState(prev => ({ ...prev, winner: 'left', isGameActive: false }));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (gameState.rightCarDistance >= FINISH_LINE && !gameState.winner) {
      setGameState(prev => ({ ...prev, winner: 'right', isGameActive: false }));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [gameState.leftCarDistance, gameState.rightCarDistance, gameState.winner]);

  if (gameState.currentScreen === 'start') {
    return <StartScreen onStart={showGameScreen} />;
  }

  return (
    <div className="min-h-screen p-2 bg-gradient-to-b from-sky-400 to-green-400">
      <Card className="w-full max-w-md mx-auto p-3 bg-white/90 backdrop-blur-sm">
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold text-gray-800 mb-1">🏁 Thumb Race</h1>
          <p className="text-xs text-gray-600">Race to 100 meters!</p>
        </div>

        <div className="flex justify-between mb-2">
          <GameStats 
            leftDistance={gameState.leftCarDistance}
            rightDistance={gameState.rightCarDistance}
            leftPushes={gameState.leftPushes}
            rightPushes={gameState.rightPushes}
          />
        </div>

        <RaceTrack 
          leftCarDistance={gameState.leftCarDistance}
          rightCarDistance={gameState.rightCarDistance}
          onLeftPush={() => pushCar('left')}
          onRightPush={() => pushCar('right')}
          onLeftBack={() => pullBackCar('left')}
          onRightBack={() => pullBackCar('right')}
          isGameActive={gameState.isGameActive}
        />

        <div className="flex gap-4 mt-3">
          {!gameState.isGameActive && !gameState.winner && (
            <Button onClick={startGame} className="flex-1 bg-green-500 hover:bg-green-600">
              Start Race
            </Button>
          )}
          {gameState.winner && (
            <Button onClick={resetGame} className="flex-1 bg-blue-500 hover:bg-blue-600">
              Back to Menu
            </Button>
          )}
        </div>
      </Card>

      {gameState.winner && (
        <WinnerModal 
          winner={gameState.winner}
          onClose={resetGame}
        />
      )}
    </div>
  );
};

export default RacingGame;
