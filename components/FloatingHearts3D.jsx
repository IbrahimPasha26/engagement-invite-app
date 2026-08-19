'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function FloatingShape({ position, speed, rotationSpeed }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed.x * delta;
      meshRef.current.rotation.y += rotationSpeed.y * delta;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial
        color="#fb7185"
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export default function FloatingHearts3D() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent server-side canvas mismatch

  const particles = [
    { pos: [-1.8, 2.5, -2], speed: 1.2, rot: { x: 0.5, y: 0.8 } },
    { pos: [1.8, 3.5, -3], speed: 0.8, rot: { x: 0.3, y: 0.6 } },
    { pos: [-1.2, -1.5, -1], speed: 1.5, rot: { x: 0.7, y: 0.2 } },
    { pos: [1.5, -2.5, -2], speed: 1.0, rot: { x: 0.4, y: 0.9 } },
    { pos: [0, 0.5, -3.5], speed: 0.9, rot: { x: 0.2, y: 0.5 } },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={3} />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} />

        {particles.map((p, index) => (
          <FloatingShape
            key={index}
            position={p.pos}
            speed={p.speed}
            rotationSpeed={p.rot}
          />
        ))}
      </Canvas>
    </div>
  );
}