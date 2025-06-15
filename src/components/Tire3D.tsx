
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Cylinder, Ring } from '@react-three/drei';

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
      <Cylinder
        args={[1, 1, 0.6, 32]}
        position={[0, 0, 0]}
      >
        <meshPhongMaterial color={tireColor} />
      </Cylinder>
      
      {/* Inner rim/hole */}
      <Cylinder
        args={[0.4, 0.4, 0.7, 32]}
        position={[0, 0, 0]}
      >
        <meshPhongMaterial color={rimColor} />
      </Cylinder>
      
      {/* Tire treads - multiple small cylinders around the tire */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.cos(angle) * 0.9;
        const y = Math.sin(angle) * 0.9;
        return (
          <Cylinder
            key={i}
            args={[0.05, 0.05, 0.8, 8]}
            position={[x, y, 0]}
          >
            <meshPhongMaterial color="#1f2937" />
          </Cylinder>
        );
      })}
      
      {/* Side wall details */}
      <Ring
        args={[0.4, 1, 32]}
        position={[0, 0, 0.35]}
      >
        <meshPhongMaterial color={rimColor} side={2} />
      </Ring>
      <Ring
        args={[0.4, 1, 32]}
        position={[0, 0, -0.35]}
      >
        <meshPhongMaterial color={rimColor} side={2} />
      </Ring>
    </group>
  );
};

const Tire3D = ({ color, size = 40 }: TireProps) => {
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
