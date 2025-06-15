import React, { useState, useRef } from 'react';
import Tire3D from './Tire3D';

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
  const VISIBLE_TRACK_LENGTH = 50;
  
  // State for tire horizontal positions (0-100, where 50 is center)
  const [leftTireHorizontalPos, setLeftTireHorizontalPos] = useState(50);
  const [rightTireHorizontalPos, setRightTireHorizontalPos] = useState(50);
  
  // Touch tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // Calculate separate viewport offsets for each track
  const leftViewportStart = Math.max(0, leftCarDistance - VISIBLE_TRACK_LENGTH * 0.7);
  const leftViewportEnd = leftViewportStart + VISIBLE_TRACK_LENGTH;
  
  const rightViewportStart = Math.max(0, rightCarDistance - VISIBLE_TRACK_LENGTH * 0.7);
  const rightViewportEnd = rightViewportStart + VISIBLE_TRACK_LENGTH;
  
  // Calculate car positions relative to their respective viewports
  const leftCarRelativePosition = Math.max(0, Math.min(100, ((leftCarDistance - leftViewportStart) / VISIBLE_TRACK_LENGTH) * 100));
  const rightCarRelativePosition = Math.max(0, Math.min(100, ((rightCarDistance - rightViewportStart) / VISIBLE_TRACK_LENGTH) * 100));
  
  // Show finish line for each track when it's within their respective viewports
  const showLeftFinishLine = leftViewportEnd >= FINISH_LINE;
  const leftFinishLinePosition = showLeftFinishLine ? ((FINISH_LINE - leftViewportStart) / VISIBLE_TRACK_LENGTH) * 100 : 100;
  
  const showRightFinishLine = rightViewportEnd >= FINISH_LINE;
  const rightFinishLinePosition = showRightFinishLine ? ((FINISH_LINE - rightViewportStart) / VISIBLE_TRACK_LENGTH) * 100 : 100;

  // Generate distance markers for left track
  const generateLeftDistanceMarkers = () => {
    const markers = [];
    const startMarker = Math.ceil(leftViewportStart / 10) * 10;
    const endMarker = Math.floor(leftViewportEnd / 10) * 10;
    
    for (let distance = startMarker; distance <= endMarker; distance += 10) {
      if (distance > 0 && distance < FINISH_LINE) {
        const position = ((distance - leftViewportStart) / VISIBLE_TRACK_LENGTH) * 100;
        if (position >= 0 && position <= 100) {
          markers.push({ distance, position });
        }
      }
    }
    return markers;
  };

  // Generate distance markers for right track
  const generateRightDistanceMarkers = () => {
    const markers = [];
    const startMarker = Math.ceil(rightViewportStart / 10) * 10;
    const endMarker = Math.floor(rightViewportEnd / 10) * 10;
    
    for (let distance = startMarker; distance <= endMarker; distance += 10) {
      if (distance > 0 && distance < FINISH_LINE) {
        const position = ((distance - rightViewportStart) / VISIBLE_TRACK_LENGTH) * 100;
        if (position >= 0 && position <= 100) {
          markers.push({ distance, position });
        }
      }
    }
    return markers;
  };

  const leftDistanceMarkers = generateLeftDistanceMarkers();
  const rightDistanceMarkers = generateRightDistanceMarkers();

  const handleTouchStart = (event: React.TouchEvent, side: 'left' | 'right') => {
    if (!isGameActive) return;
    
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent, side: 'left' | 'right') => {
    if (!isGameActive || !touchStartRef.current) return;
    
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Determine if this is primarily a vertical or horizontal swipe
    const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);
    
    if (isVerticalSwipe) {
      // Vertical swipe for forward/backward movement
      if (deltaY < -30) { // Swipe up
        if (side === 'left') {
          onLeftPush();
        } else {
          onRightPush();
        }
      } else if (deltaY > 30) { // Swipe down
        if (side === 'left') {
          onLeftBack();
        } else {
          onRightBack();
        }
      }
    } else {
      // Horizontal swipe for left/right movement
      if (Math.abs(deltaX) > 20) {
        const moveAmount = Math.min(Math.abs(deltaX) / 5, 20); // Scale movement
        
        if (side === 'left') {
          setLeftTireHorizontalPos(prev => {
            const newPos = deltaX > 0 ? prev + moveAmount : prev - moveAmount;
            return Math.max(10, Math.min(90, newPos)); // Keep within bounds
          });
        } else {
          setRightTireHorizontalPos(prev => {
            const newPos = deltaX > 0 ? prev + moveAmount : prev - moveAmount;
            return Math.max(10, Math.min(90, newPos)); // Keep within bounds
          });
        }
      }
    }
    
    touchStartRef.current = null;
  };

  const handleClick = (event: React.MouseEvent, side: 'left' | 'right') => {
    if (!isGameActive) return;
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const clickY = event.clientY - rect.top;
    const clickX = event.clientX - rect.left;
    const relativeY = (clickY / rect.height) * 100;
    const relativeX = (clickX / rect.width) * 100;
    
    const carPosition = side === 'left' ? leftCarRelativePosition : rightCarRelativePosition;
    const carPositionFromTop = 100 - carPosition;
    
    // Check if click is significantly horizontal (for steering)
    if (Math.abs(relativeX - 50) > 20) {
      // Horizontal movement
      const moveAmount = Math.abs(relativeX - 50) / 2;
      
      if (side === 'left') {
        setLeftTireHorizontalPos(prev => {
          const newPos = relativeX > 50 ? prev + moveAmount : prev - moveAmount;
          return Math.max(10, Math.min(90, newPos));
        });
      } else {
        setRightTireHorizontalPos(prev => {
          const newPos = relativeX > 50 ? prev + moveAmount : prev - moveAmount;
          return Math.max(10, Math.min(90, newPos));
        });
      }
    } else {
      // Vertical movement (existing logic)
      if (relativeY < carPositionFromTop) {
        if (side === 'left') {
          onLeftPush();
        } else {
          onRightPush();
        }
      } else {
        if (side === 'left') {
          onLeftBack();
        } else {
          onRightBack();
        }
      }
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-lg p-4 mb-4 h-[500px]">
      {/* Track Info for both tracks */}
      <div className="absolute top-2 left-2 text-white text-xs bg-black/70 px-2 py-1 rounded z-10">
        Red: {leftViewportStart.toFixed(0)}m - {leftViewportEnd.toFixed(0)}m
      </div>
      <div className="absolute top-2 right-2 text-white text-xs bg-black/70 px-2 py-1 rounded z-10">
        Blue: {rightViewportStart.toFixed(0)}m - {rightViewportEnd.toFixed(0)}m
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
          {leftDistanceMarkers.map(({ distance, position }) => (
            <div
              key={`left-${distance}`}
              className="absolute left-2 text-xs font-bold text-red-800 bg-white/80 px-1 rounded"
              style={{ top: `${100 - position}%`, transform: 'translateY(-50%)' }}
            >
              {distance}m
            </div>
          ))}
          
          {/* Left Tire with horizontal positioning */}
          <div 
            className="absolute transition-all duration-300 ease-out"
            style={{ 
              bottom: `${leftCarRelativePosition}%`, 
              left: `${leftTireHorizontalPos}%`,
              transform: 'translateX(-50%) translateY(50%)'
            }}
          >
            <Tire3D color="red" size={50} />
          </div>
          
          {/* Left Finish Line */}
          {showLeftFinishLine && (
            <div 
              className="absolute left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"
              style={{ top: `${100 - leftFinishLinePosition}%` }}
            >
              <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 text-2xl">
                🏁
              </div>
            </div>
          )}
          
          {/* Touch Area */}
          <button
            className="absolute inset-0 bg-transparent active:bg-red-300/40 rounded-lg transition-colors"
            onTouchStart={(e) => handleTouchStart(e, 'left')}
            onTouchEnd={(e) => handleTouchEnd(e, 'left')}
            onClick={(e) => handleClick(e, 'left')}
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
          {rightDistanceMarkers.map(({ distance, position }) => (
            <div
              key={`right-${distance}`}
              className="absolute right-2 text-xs font-bold text-blue-800 bg-white/80 px-1 rounded"
              style={{ top: `${100 - position}%`, transform: 'translateY(-50%)' }}
            >
              {distance}m
            </div>
          ))}
          
          {/* Right Tire with horizontal positioning */}
          <div 
            className="absolute transition-all duration-300 ease-out"
            style={{ 
              bottom: `${rightCarRelativePosition}%`, 
              left: `${rightTireHorizontalPos}%`,
              transform: 'translateX(-50%) translateY(50%)'
            }}
          >
            <Tire3D color="blue" size={50} />
          </div>
          
          {/* Right Finish Line */}
          {showRightFinishLine && (
            <div 
              className="absolute left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"
              style={{ top: `${100 - rightFinishLinePosition}%` }}
            >
              <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 text-2xl">
                🏁
              </div>
            </div>
          )}
          
          {/* Touch Area */}
          <button
            className="absolute inset-0 bg-transparent active:bg-blue-300/40 rounded-lg transition-colors"
            onTouchStart={(e) => handleTouchStart(e, 'right')}
            onTouchEnd={(e) => handleTouchEnd(e, 'right')}
            onClick={(e) => handleClick(e, 'right')}
            disabled={!isGameActive}
          />
        </div>
      </div>

      {/* Updated Touch Instructions */}
      {isGameActive && (
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <p className="text-white text-xs">
            Swipe up/down to move forward/back • Swipe left/right to steer!
          </p>
        </div>
      )}
    </div>
  );
};

export default RaceTrack;
