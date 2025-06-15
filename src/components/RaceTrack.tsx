
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
  const VISIBLE_TRACK_LENGTH = 50; // Show only 50m of the track at a time
  
  // Calculate the viewport offset based on the leading car
  const leadingDistance = Math.max(leftCarDistance, rightCarDistance);
  const viewportStart = Math.max(0, leadingDistance - VISIBLE_TRACK_LENGTH * 0.7); // Start scrolling when car is 70% through visible area
  const viewportEnd = viewportStart + VISIBLE_TRACK_LENGTH;
  
  // Calculate car positions relative to the visible viewport
  const leftCarRelativePosition = Math.max(0, Math.min(100, ((leftCarDistance - viewportStart) / VISIBLE_TRACK_LENGTH) * 100));
  const rightCarRelativePosition = Math.max(0, Math.min(100, ((rightCarDistance - viewportStart) / VISIBLE_TRACK_LENGTH) * 100));
  
  // Show finish line only when it's within the viewport
  const showFinishLine = viewportEnd >= FINISH_LINE;
  const finishLinePosition = showFinishLine ? ((FINISH_LINE - viewportStart) / VISIBLE_TRACK_LENGTH) * 100 : 100;

  // Generate distance markers for current viewport
  const generateDistanceMarkers = () => {
    const markers = [];
    const startMarker = Math.ceil(viewportStart / 10) * 10; // Round up to nearest 10
    const endMarker = Math.floor(viewportEnd / 10) * 10; // Round down to nearest 10
    
    for (let distance = startMarker; distance <= endMarker; distance += 10) {
      if (distance > 0 && distance < FINISH_LINE) {
        const position = ((distance - viewportStart) / VISIBLE_TRACK_LENGTH) * 100;
        if (position >= 0 && position <= 100) {
          markers.push({ distance, position });
        }
      }
    }
    return markers;
  };

  const distanceMarkers = generateDistanceMarkers();

  const handleTouch = (event: React.TouchEvent | React.MouseEvent, side: 'left' | 'right') => {
    if (!isGameActive) return;
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const touchY = 'touches' in event ? event.touches[0].clientY : (event as React.MouseEvent).clientY;
    const relativeY = touchY - rect.top;
    const clickPercentage = (relativeY / rect.height) * 100;
    
    // Get car position relative to viewport (from bottom, so we need to invert)
    const carPosition = side === 'left' ? leftCarRelativePosition : rightCarRelativePosition;
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
      {/* Track Info - moved to top right and made more visible */}
      <div className="absolute top-2 right-2 text-white text-xs bg-black/70 px-3 py-1 rounded z-10">
        View: {viewportStart.toFixed(0)}m - {viewportEnd.toFixed(0)}m
      </div>

      {/* Vertical Track Lanes */}
      <div className="flex h-full space-x-4">
        {/* Left Lane - Red Track */}
        <div className="relative flex-1 bg-red-200 rounded-lg border-2 border-red-400 overflow-hidden">
          {/* Lane Markings */}
          <div className="absolute inset-0 flex flex-col items-center justify-evenly">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-8 bg-white opacity-70 rounded"
              />
            ))}
          </div>

          {/* Distance Markers */}
          {distanceMarkers.map(({ distance, position }) => (
            <div
              key={`left-${distance}`}
              className="absolute left-2 text-xs font-bold text-red-800 bg-white/80 px-1 rounded"
              style={{ top: `${100 - position}%`, transform: 'translateY(-50%)' }}
            >
              {distance}m
            </div>
          ))}
          
          {/* Left Car - only show if within viewport */}
          {leftCarDistance >= viewportStart && leftCarDistance <= viewportEnd && (
            <div 
              className="absolute left-1/2 w-10 h-10 bg-red-500 rounded-lg shadow-lg transition-all duration-300 ease-out flex items-center justify-center text-white text-xl transform -translate-x-1/2"
              style={{ bottom: `${leftCarRelativePosition}%` }}
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
          )}
          
          {/* Touch Area */}
          <button
            className="absolute inset-0 bg-transparent active:bg-red-300/40 rounded-lg transition-colors"
            onTouchStart={(e) => handleTouch(e, 'left')}
            onClick={(e) => handleTouch(e, 'left')}
            disabled={!isGameActive}
          />
        </div>

        {/* Right Lane - Blue Track */}
        <div className="relative flex-1 bg-blue-200 rounded-lg border-2 border-blue-400 overflow-hidden">
          {/* Lane Markings */}
          <div className="absolute inset-0 flex flex-col items-center justify-evenly">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-8 bg-white opacity-70 rounded"
              />
            ))}
          </div>

          {/* Distance Markers */}
          {distanceMarkers.map(({ distance, position }) => (
            <div
              key={`right-${distance}`}
              className="absolute right-2 text-xs font-bold text-blue-800 bg-white/80 px-1 rounded"
              style={{ top: `${100 - position}%`, transform: 'translateY(-50%)' }}
            >
              {distance}m
            </div>
          ))}
          
          {/* Right Car - only show if within viewport */}
          {rightCarDistance >= viewportStart && rightCarDistance <= viewportEnd && (
            <div 
              className="absolute left-1/2 w-10 h-10 bg-blue-500 rounded-lg shadow-lg transition-all duration-300 ease-out flex items-center justify-center text-white text-xl transform -translate-x-1/2"
              style={{ bottom: `${rightCarRelativePosition}%` }}
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
          )}
          
          {/* Touch Area */}
          <button
            className="absolute inset-0 bg-transparent active:bg-blue-300/40 rounded-lg transition-colors"
            onTouchStart={(e) => handleTouch(e, 'right')}
            onClick={(e) => handleTouch(e, 'right')}
            disabled={!isGameActive}
          />
        </div>
      </div>

      {/* Finish Line - only show when in viewport */}
      {showFinishLine && (
        <div 
          className="absolute left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"
          style={{ top: `${100 - finishLinePosition}%` }}
        >
          <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 text-2xl">
            🏁
          </div>
        </div>
      )}

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
