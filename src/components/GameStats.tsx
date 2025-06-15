
import React from 'react';

interface GameStatsProps {
  leftDistance: number;
  rightDistance: number;
  leftPushes: number;
  rightPushes: number;
}

const GameStats = ({ leftDistance, rightDistance, leftPushes, rightPushes }: GameStatsProps) => {
  const FINISH_LINE = 100;

  return (
    <div className="mb-6 space-y-4">
      {/* Progress Bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-red-600">🚗 Red Car</span>
            <span className="text-sm text-gray-600">{leftDistance.toFixed(1)}m</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-red-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(leftDistance / FINISH_LINE) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-blue-600">🚙 Blue Car</span>
            <span className="text-sm text-gray-600">{rightDistance.toFixed(1)}m</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(rightDistance / FINISH_LINE) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Push Counter */}
      <div className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <div className="text-center">
          <div className="font-semibold text-red-600">{leftPushes}</div>
          <div>Red Pushes</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-600">{rightPushes}</div>
          <div>Blue Pushes</div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
