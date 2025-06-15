
import React from 'react';

interface GameStatsProps {
  leftDistance: number;
  rightDistance: number;
  leftPushes: number;
  rightPushes: number;
}

const GameStats = ({ leftDistance, rightDistance, leftPushes, rightPushes }: GameStatsProps) => {
  return (
    <div className="flex justify-between items-center mb-2 w-full">
      {/* Left Lane Stats */}
      <div className="flex flex-col items-center space-y-1 text-center">
        <div className="text-xs font-medium text-red-600">🚗 Red</div>
        <div className="text-sm font-bold text-red-600">{leftDistance.toFixed(1)}m</div>
        <div className="text-xs text-gray-600">{leftPushes} pushes</div>
      </div>

      {/* Right Lane Stats */}
      <div className="flex flex-col items-center space-y-1 text-center">
        <div className="text-xs font-medium text-blue-600">🚙 Blue</div>
        <div className="text-sm font-bold text-blue-600">{rightDistance.toFixed(1)}m</div>
        <div className="text-xs text-gray-600">{rightPushes} pushes</div>
      </div>
    </div>
  );
};

export default GameStats;
