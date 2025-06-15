
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
  
  // Calculate car positions as percentages
  const leftCarPosition = (leftCarDistance / FINISH_LINE) * 100;
  const rightCarPosition = (rightCarDistance / FINISH_LINE) * 100;

  return (
    <div className="relative bg-gray-800 rounded-lg p-4 mb-4">
      {/* Track Lanes */}
      <div className="space-y-4">
        {/* Left Lane */}
        <div className="relative h-16 bg-gradient-to-r from-red-100 to-red-50 rounded-lg border-2 border-red-300 overflow-hidden">
          {/* Lane Markings */}
          <div className="absolute inset-0 flex items-center">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="h-1 bg-white opacity-50 flex-1 mx-1 rounded"
              />
            ))}
          </div>
          
          {/* Left Car */}
          <div 
            className="absolute top-2 w-12 h-12 bg-red-500 rounded-lg shadow-lg transition-all duration-300 ease-out flex items-center justify-center text-white text-2xl"
            style={{ left: `${leftCarPosition}%`, transform: 'translateX(-50%)' }}
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
        <div className="relative h-16 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg border-2 border-blue-300 overflow-hidden">
          {/* Lane Markings */}
          <div className="absolute inset-0 flex items-center">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="h-1 bg-white opacity-50 flex-1 mx-1 rounded"
              />
            ))}
          </div>
          
          {/* Right Car */}
          <div 
            className="absolute top-2 w-12 h-12 bg-blue-500 rounded-lg shadow-lg transition-all duration-300 ease-out flex items-center justify-center text-white text-2xl"
            style={{ left: `${rightCarPosition}%`, transform: 'translateX(-50%)' }}
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
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-r-lg">
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-2xl">
          🏁
        </div>
      </div>

      {/* Touch Instructions */}
      {isGameActive && (
        <div className="mt-4 text-center">
          <p className="text-white text-sm">
            Touch the lanes alternately with your thumbs to push the cars!
          </p>
        </div>
      )}
    </div>
  );
};

export default RaceTrack;
