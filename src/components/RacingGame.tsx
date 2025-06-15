
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RaceTrack from './RaceTrack';
import GameStats from './GameStats';
import WinnerModal from './WinnerModal';
import StartScreen from './StartScreen';
import TirePhysics from './TirePhysics';
import confetti from 'canvas-confetti';

interface GameState {
  leftCarDistance: number;
  rightCarDistance: number;
  leftHorizontalPos: number;
  rightHorizontalPos: number;
  isGameActive: boolean;
  winner: 'left' | 'right' | null;
  leftPushes: number;
  rightPushes: number;
  currentScreen: 'start' | 'game';
  leftPushForce: number;
  rightPushForce: number;
  leftHorizontalForce: number;
  rightHorizontalForce: number;
  resetTrigger: number;
}

const RacingGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    leftCarDistance: 0,
    rightCarDistance: 0,
    leftHorizontalPos: 50,
    rightHorizontalPos: 50,
    isGameActive: false,
    winner: null,
    leftPushes: 0,
    rightPushes: 0,
    currentScreen: 'start',
    leftPushForce: 0,
    rightPushForce: 0,
    leftHorizontalForce: 0,
    rightHorizontalForce: 0,
    resetTrigger: 0,
  });

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
      leftHorizontalPos: 50,
      rightHorizontalPos: 50,
      isGameActive: true,
      winner: null,
      leftPushes: 0,
      rightPushes: 0,
      currentScreen: 'game',
      leftPushForce: 0,
      rightPushForce: 0,
      leftHorizontalForce: 0,
      rightHorizontalForce: 0,
      resetTrigger: prev.resetTrigger + 1,
    }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      leftCarDistance: 0,
      rightCarDistance: 0,
      leftHorizontalPos: 50,
      rightHorizontalPos: 50,
      isGameActive: false,
      winner: null,
      leftPushes: 0,
      rightPushes: 0,
      currentScreen: 'start',
      leftPushForce: 0,
      rightPushForce: 0,
      leftHorizontalForce: 0,
      rightHorizontalForce: 0,
      resetTrigger: prev.resetTrigger + 1,
    }));
  };

  const pushCar = (side: 'left' | 'right') => {
    if (!gameState.isGameActive || gameState.winner) return;

    setGameState(prev => {
      const newState = { ...prev };
      
      if (side === 'left') {
        newState.leftPushForce = 5; // 5N force
        newState.leftPushes = prev.leftPushes + 1;
        // Reset force after applying
        setTimeout(() => {
          setGameState(current => ({ ...current, leftPushForce: 0 }));
        }, 100);
      } else {
        newState.rightPushForce = 5; // 5N force
        newState.rightPushes = prev.rightPushes + 1;
        // Reset force after applying
        setTimeout(() => {
          setGameState(current => ({ ...current, rightPushForce: 0 }));
        }, 100);
      }

      return newState;
    });
  };

  const pullBackCar = (side: 'left' | 'right') => {
    if (!gameState.isGameActive || gameState.winner) return;

    setGameState(prev => {
      const newState = { ...prev };
      
      if (side === 'left') {
        newState.leftPushForce = -3; // Reverse force (less than forward)
        setTimeout(() => {
          setGameState(current => ({ ...current, leftPushForce: 0 }));
        }, 100);
      } else {
        newState.rightPushForce = -3; // Reverse force (less than forward)
        setTimeout(() => {
          setGameState(current => ({ ...current, rightPushForce: 0 }));
        }, 100);
      }

      return newState;
    });
  };

  const steerCar = (side: 'left' | 'right', direction: 'left' | 'right') => {
    if (!gameState.isGameActive || gameState.winner) return;

    const force = direction === 'left' ? -2 : 2;
    
    setGameState(prev => {
      const newState = { ...prev };
      
      if (side === 'left') {
        newState.leftHorizontalForce = force;
        setTimeout(() => {
          setGameState(current => ({ ...current, leftHorizontalForce: 0 }));
        }, 150);
      } else {
        newState.rightHorizontalForce = force;
        setTimeout(() => {
          setGameState(current => ({ ...current, rightHorizontalForce: 0 }));
        }, 150);
      }

      return newState;
    });
  };

  const handleLeftPositionUpdate = (distance: number, horizontalPos: number) => {
    setGameState(prev => ({
      ...prev,
      leftCarDistance: distance,
      leftHorizontalPos: horizontalPos
    }));
  };

  const handleRightPositionUpdate = (distance: number, horizontalPos: number) => {
    setGameState(prev => ({
      ...prev,
      rightCarDistance: distance,
      rightHorizontalPos: horizontalPos
    }));
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
      {/* Physics engines for both tires */}
      <TirePhysics
        onPositionUpdate={handleLeftPositionUpdate}
        pushForce={gameState.leftPushForce}
        resetTrigger={gameState.resetTrigger}
        horizontalForce={gameState.leftHorizontalForce}
      />
      <TirePhysics
        onPositionUpdate={handleRightPositionUpdate}
        pushForce={gameState.rightPushForce}
        resetTrigger={gameState.resetTrigger}
        horizontalForce={gameState.rightHorizontalForce}
      />

      <Card className="w-full max-w-md mx-auto p-3 bg-white/90 backdrop-blur-sm">
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold text-gray-800 mb-1">🏁 Physics Tire Race</h1>
          <p className="text-xs text-gray-600">Realistic tire physics with momentum!</p>
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
          leftTireHorizontalPos={gameState.leftHorizontalPos}
          rightTireHorizontalPos={gameState.rightHorizontalPos}
          onLeftPush={() => pushCar('left')}
          onRightPush={() => pushCar('right')}
          onLeftBack={() => pullBackCar('left')}
          onRightBack={() => pullBackCar('right')}
          onLeftSteer={(direction) => steerCar('left', direction)}
          onRightSteer={(direction) => steerCar('right', direction)}
          isGameActive={gameState.isGameActive}
        />

        <div className="flex gap-4 mt-3">
          {!gameState.isGameActive && !gameState.winner && (
            <Button onClick={startGame} className="flex-1 bg-green-500 hover:bg-green-600">
              Start Physics Race
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
