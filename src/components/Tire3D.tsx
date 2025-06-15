
import React from 'react';
import { Canvas } from '@react-three/fiber';

interface TireProps {
  color: 'red' | 'blue';
  size?: number;
}

const TireGeometry = ({ color }: { color: 'red' | 'blue' }) => {
  const tireColor = color === 'red' ? '#dc2626' : '#2563eb';
  const rimColor = color === 'red' ? '#991b1b' : '#1d4ed8';
  
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Main tire body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.6, 32]} />
        <meshPhongMaterial color={tireColor} />
      </mesh>
      
      {/* Inner rim/hole */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.7, 32]} />
        <meshPhongMaterial color={rimColor} />
      </mesh>
      
      {/* Tire treads - multiple small cylinders around the tire */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.cos(angle) * 0.9;
        const y = Math.sin(angle) * 0.9;
        return (
          <mesh key={i} position={[x, y, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
            <meshPhongMaterial color="#1f2937" />
          </mesh>
        );
      })}
      
      {/* Side wall details */}
      <mesh position={[0, 0, 0.35]}>
        <ringGeometry args={[0.4, 1, 32]} />
        <meshPhongMaterial color={rimColor} side={2} />
      </mesh>
      <mesh position={[0, 0, -0.35]}>
        <ringGeometry args={[0.4, 1, 32]} />
        <meshPhongMaterial color={rimColor} side={2} />
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
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        
        <TireGeometry color={color} />
      </Canvas>
    </div>
  );
};

export default Tire3D;
