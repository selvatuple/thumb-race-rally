
import React from 'react';

interface RaceTrackProps {
  leftCarDistance: number;
  rightCarDistance: number;
  onLeftPush: () => void;
  onRightPush: () => void;
  isGameActive: boolean;
}

const RaceTrack = ({ 
  leftCarDistance, 
  rightCarDistance, 
  onLeftPush, 
  onRightPush, 
  isGameActive 
}: RaceTrackProps) => {
  const FINISH_LINE = 100;
  
  // Calculate car positions as percentages (from bottom to top)
  const leftCarPosition = (leftCarDistance / FINISH_LINE) * 100;
  const rightCarPosition = (rightCarDistance / FINISH_LINE) * 100;

  return (
    <div className="relative bg-gray-800 rounded-lg p-4 mb-4 h-96">
      {/* Vertical Track Lanes */}
      <div className="flex h-full space-x-4">
        {/* Left Lane */}
        <div className="relative flex-1 bg-gradient-to-t from-red-100 to-red-50 rounded-lg border-2 border-red-300 overflow-hidden">
          {/* Lane Markings */}
          <div className="absolute inset-0 flex flex-col items-center justify-evenly">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-8 bg-white opacity-50 rounded"
              />
            ))}
          </div>
          
          {/* Left Car */}
          <div 
            className="absolute left-1/2 w-10 h-10 bg-red-500 rounded-lg shadow-lg transition-all duration-300 ease-out flex items-center justify-center text-white text-xl transform -translate-x-1/2 rotate-90"
            style={{ bottom: `${leftCarPosition}%` }}
          >
            🚗
          </div>
          
          {/* Touch Area */}
          <button
            className="absolute inset-0 bg-transparent active:bg-red-200/30 rounded-lg transition-colors"
            onTouchStart={onLeftPush}
            onClick={onLeftPush}
            disabled={!isGameActive}
          />
        </div>

        {/* Right Lane */}
        <div className="relative flex-1 bg-gradient-to-t from-blue-100 to-blue-50 rounded-lg border-2 border-blue-300 overflow-hidden">
          {/* Lane Markings */}
          <div className="absolute inset-0 flex flex-col items-center justify-evenly">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-8 bg-white opacity-50 rounded"
              />
            ))}
          </div>
          
          {/* Right Car */}
          <div 
            className="absolute left-1/2 w-10 h-10 bg-blue-500 rounded-lg shadow-lg transition-all duration-300 ease-out flex items-center justify-center text-white text-xl transform -translate-x-1/2 rotate-90"
            style={{ bottom: `${rightCarPosition}%` }}
          >
            🚙
          </div>
          
          {/* Touch Area */}
          <button
            className="absolute inset-0 bg-transparent active:bg-blue-200/30 rounded-lg transition-colors"
            onTouchStart={onRightPush}
            onClick={onRightPush}
            disabled={!isGameActive}
          />
        </div>
      </div>

      {/* Finish Line */}
      <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-t-lg">
        <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 text-2xl">
          🏁
        </div>
      </div>

      {/* Touch Instructions */}
      {isGameActive && (
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <p className="text-white text-xs">
            Touch lanes with thumbs to push cars up!
          </p>
        </div>
      )}
    </div>
  );
};

export default RaceTrack;
