
import React from 'react';
import { Canvas } from '@react-three/fiber';

interface TireProps {
  color: 'red' | 'blue';
  size?: number;
}

const TireGeometry = ({ color }: { color: 'red' | 'blue' }) => {
  const tireColor = color === 'red' ? '#1a1a1a' : '#1a1a1a'; // Realistic black tire
  const rimColor = color === 'red' ? '#dc2626' : '#2563eb';
  const sidewallColor = color === 'red' ? '#2d2d2d' : '#2d2d2d';
  
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Main tire body - outer rubber */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.5, 32]} />
        <meshPhongMaterial color={tireColor} />
      </mesh>
      
      {/* Inner tire body - creates the rounded profile */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.85, 0.35, 16, 32]} />
        <meshPhongMaterial color={tireColor} />
      </mesh>
      
      {/* Rim/Wheel center */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.6, 32]} />
        <meshPhongMaterial color={rimColor} />
      </mesh>
      
      {/* Inner hole */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.7, 16]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
      
      {/* Tire treads - more realistic pattern */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const x = Math.cos(angle) * 1.15;
        const y = Math.sin(angle) * 1.15;
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.15, 0.08, 0.6]} />
            <meshPhongMaterial color="#0a0a0a" />
          </mesh>
        );
      })}
      
      {/* Rim spokes */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 0.3;
        const y = Math.sin(angle) * 0.3;
        return (
          <mesh key={`spoke-${i}`} position={[x, y, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.1, 0.4, 0.5]} />
            <meshPhongMaterial color={rimColor} />
          </mesh>
        );
      })}
      
      {/* Side wall details */}
      <mesh position={[0, 0, 0.3]}>
        <ringGeometry args={[0.6, 1.1, 32]} />
        <meshPhongMaterial color={sidewallColor} side={2} />
      </mesh>
      <mesh position={[0, 0, -0.3]}>
        <ringGeometry args={[0.6, 1.1, 32]} />
        <meshPhongMaterial color={sidewallColor} side={2} />
      </mesh>
    </group>
  );
};

const Tire3D = ({ color, size = 50 }: TireProps) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [2, 2, 2], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        <spotLight position={[0, 10, 0]} intensity={0.5} />
        
        <TireGeometry color={color} />
      </Canvas>
    </div>
  );
};

export default Tire3D;
