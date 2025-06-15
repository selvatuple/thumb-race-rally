
import React from 'react';

interface RaceTrackProps {
  leftCarDistance: number;
  rightCarDistance: number;
  onLeftPush: () => void;
  onRightPush: () => void;
  onLeftBack: () => void;
  onRightBack: () => void;
  isGameActive: boolean;
}

const RaceTrack = ({ 
  leftCarDistance, 
  rightCarDistance, 
  onLeftPush, 
  onRightPush, 
  onLeftBack,
  onRightBack,
  isGameActive 
}: RaceTrackProps) => {
  const FINISH_LINE = 100;
  
  // Calculate car positions as percentages (from bottom to top)
  const leftCarPosition = (leftCarDistance / FINISH_LINE) * 100;
  const rightCarPosition = (rightCarDistance / FINISH_LINE) * 100;

  const handleTouch = (event: React.TouchEvent | React.MouseEvent, side: 'left' | 'right') => {
    if (!isGameActive) return;
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const touchY = 'touches' in event ? event.touches[0].clientY : (event as React.MouseEvent).clientY;
    const relativeY = touchY - rect.top;
    const clickPercentage = (relativeY / rect.height) * 100;
    
    // Get car position (from bottom, so we need to invert)
    const carPosition = side === 'left' ? leftCarPosition : rightCarPosition;
    const carPositionFromTop = 100 - carPosition;
    
    // If clicked above the car (in front), move forward
    // If clicked below the car (behind), move backward
    if (clickPercentage < carPositionFromTop) {
      // Clicked in front of car - move forward
      if (side === 'left') {
        onLeftPush();
      } else {
        onRightPush();
      }
    } else {
      // Clicked behind car - move backward
      if (side === 'left') {
        onLeftBack();
      } else {
        onRightBack();
      }
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-lg p-4 mb-4 h-[500px]">
      {/* Vertical Track Lanes */}
      <div className="flex h-full space-x-4">
        {/* Left Lane */}
        <div className="relative flex-1 bg-gradient-to-t from-red-100 to-red-50 rounded-lg border-2 border-red-300 overflow-hidden">
          {/* Lane Markings */}
          <div className="absolute inset-0 flex flex-col items-center justify-evenly">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-8 bg-white opacity-50 rounded"
              />
            ))}
          </div>
          
          {/* Left Car */}
          <div 
            className="absolute left-1/2 w-10 h-10 bg-red-500 rounded-lg shadow-lg transition-all duration-300 ease-out flex items-center justify-center text-white text-xl transform -translate-x-1/2"
            style={{ bottom: `${leftCarPosition}%` }}
          >
            <div className="w-8 h-8 bg-red-600 rounded-sm relative">
              {/* Car body */}
              <div className="absolute inset-1 bg-red-400 rounded-sm"></div>
              {/* Windshield */}
              <div className="absolute top-1 left-2 right-2 h-2 bg-blue-200 rounded-sm opacity-70"></div>
              {/* Wheels */}
              <div className="absolute -left-1 top-2 w-2 h-1 bg-gray-800 rounded"></div>
              <div className="absolute -right-1 top-2 w-2 h-1 bg-gray-800 rounded"></div>
              <div className="absolute -left-1 bottom-2 w-2 h-1 bg-gray-800 rounded"></div>
              <div className="absolute -right-1 bottom-2 w-2 h-1 bg-gray-800 rounded"></div>
            </div>
          </div>
          
          {/* Touch Area */}
          <button
            className="absolute inset-0 bg-transparent active:bg-red-200/30 rounded-lg transition-colors"
            onTouchStart={(e) => handleTouch(e, 'left')}
            onClick={(e) => handleTouch(e, 'left')}
            disabled={!isGameActive}
          />
        </div>

        {/* Right Lane */}
        <div className="relative flex-1 bg-gradient-to-t from-blue-100 to-blue-50 rounded-lg border-2 border-blue-300 overflow-hidden">
          {/* Lane Markings */}
          <div className="absolute inset-0 flex flex-col items-center justify-evenly">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-8 bg-white opacity-50 rounded"
              />
            ))}
          </div>
          
          {/* Right Car */}
          <div 
            className="absolute left-1/2 w-10 h-10 bg-blue-500 rounded-lg shadow-lg transition-all duration-300 ease-out flex items-center justify-center text-white text-xl transform -translate-x-1/2"
            style={{ bottom: `${rightCarPosition}%` }}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-sm relative">
              {/* Car body */}
              <div className="absolute inset-1 bg-blue-400 rounded-sm"></div>
              {/* Windshield */}
              <div className="absolute top-1 left-2 right-2 h-2 bg-blue-200 rounded-sm opacity-70"></div>
              {/* Wheels */}
              <div className="absolute -left-1 top-2 w-2 h-1 bg-gray-800 rounded"></div>
              <div className="absolute -right-1 top-2 w-2 h-1 bg-gray-800 rounded"></div>
              <div className="absolute -left-1 bottom-2 w-2 h-1 bg-gray-800 rounded"></div>
              <div className="absolute -right-1 bottom-2 w-2 h-1 bg-gray-800 rounded"></div>
            </div>
          </div>
          
          {/* Touch Area */}
          <button
            className="absolute inset-0 bg-transparent active:bg-blue-200/30 rounded-lg transition-colors"
            onTouchStart={(e) => handleTouch(e, 'right')}
            onClick={(e) => handleTouch(e, 'right')}
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
            Touch in front of car to go forward, behind to go back!
          </p>
        </div>
      )}
    </div>
  );
};

export default RaceTrack;
