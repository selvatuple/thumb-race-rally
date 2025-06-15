import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface TirePhysicsProps {
  onPositionUpdate: (distance: number, horizontalPos: number) => void;
  pushForce: number;
  resetTrigger: number;
  horizontalForce: number;
}

const TirePhysics = ({ onPositionUpdate, pushForce, resetTrigger, horizontalForce }: TirePhysicsProps) => {
  const engineRef = useRef<Matter.Engine | null>(null);
  const tireBodyRef = useRef<Matter.Body | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Create physics engine
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 0; // Disable default gravity since we're working in 2D top-down view
    engineRef.current = engine;

    // Create tire body - 50 pounds = ~22.7 kg
    const tire = Matter.Bodies.circle(50, 0, 25, {
      mass: 22.7, // 50 pounds in kg
      frictionAir: 0.02, // Rolling resistance
      friction: 0.8,
      restitution: 0.3,
      inertia: Infinity // Prevent rotation for simplicity
    });
    
    tireBodyRef.current = tire;
    Matter.World.add(engine.world, tire);

    // Create boundaries to keep tire in lane (0-100 horizontal range)
    const leftWall = Matter.Bodies.rectangle(-10, 0, 20, 1000, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(110, 0, 20, 1000, { isStatic: true });
    Matter.World.add(engine.world, [leftWall, rightWall]);

    // Physics update loop
    const updatePhysics = () => {
      if (engineRef.current && tireBodyRef.current) {
        Matter.Engine.update(engineRef.current, 16.67); // ~60fps
        
        const position = tireBodyRef.current.position;
        // Convert physics position to game units (distance and horizontal position)
        const distance = Math.max(0, position.y / 2.5); // Scale physics units to meters
        const horizontalPos = Math.max(10, Math.min(90, position.x)); // Keep within lane bounds
        
        onPositionUpdate(distance, horizontalPos);
      }
      animationRef.current = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [onPositionUpdate]);

  // Apply push force when user interacts
  useEffect(() => {
    if (tireBodyRef.current && pushForce !== 0) {
      // 5N force to move 3 meters - scale appropriately
      const forceScale = 0.001;
      Matter.Body.applyForce(tireBodyRef.current, tireBodyRef.current.position, {
        x: 0,
        y: pushForce * forceScale
      });
    }
  }, [pushForce]);

  // Apply horizontal force for steering
  useEffect(() => {
    if (tireBodyRef.current && horizontalForce !== 0) {
      const horizontalForceScale = 0.0005;
      Matter.Body.applyForce(tireBodyRef.current, tireBodyRef.current.position, {
        x: horizontalForce * horizontalForceScale,
        y: 0
      });
    }
  }, [horizontalForce]);

  // Reset tire position
  useEffect(() => {
    if (tireBodyRef.current) {
      Matter.Body.setPosition(tireBodyRef.current, { x: 50, y: 0 });
      Matter.Body.setVelocity(tireBodyRef.current, { x: 0, y: 0 });
    }
  }, [resetTrigger]);

  return null; // This component only handles physics, no UI
};

export default TirePhysics;
