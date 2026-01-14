'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleBrain(props: any) {
  const ref = useRef<THREE.Points>(null!);

  // Generate random particles within a sphere shape
  const particlesPosition = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = unittriangle(); // Uniform distribution on sphere
      const phi = 2 * Math.PI * Math.random();
      const r = 2.5 * Math.cbrt(Math.random()); // Volume distribution

      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    return positions;
  }, []);

  // Helper for uniform sphere distribution
  function unittriangle() {
    return Math.acos(2 * Math.random() - 1);
  }

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;

      // Breathing effect
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#06B6D4" // Brand Cyan
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function HeroVisual() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-slate-50">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/* Soft Ambient Light */}
        <ambientLight intensity={0.5} />

        {/* Main Particle Brain */}
        <ParticleBrain />

        {/* Background Fog for depth */}
        <color attach="background" args={['#F8FAFC']} />
        <fog attach="fog" args={['#F8FAFC', 5, 15]} />
      </Canvas>

      {/* Overlay Gradient for seamless blending with content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />
    </div>
  );
}
