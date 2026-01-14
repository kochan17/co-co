'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron, TorusKnot, MeshDistortMaterial, Float, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- COMPONENTS ---

function HeroParticles({ visible }: { visible: boolean }) {
  const count = 2000;
  const meshRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.05;
      meshRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={meshRef} visible={visible}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#67E8F9" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function ProblemShape({ visible, opacity }: { visible: boolean, opacity: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={1}>
      <group scale={visible ? 1.4 : 0} visible={visible}>
        <Icosahedron args={[1, 0]} ref={meshRef}>
          <MeshDistortMaterial
            color="#1E293B" // Slate 800
            attach="material"
            distort={0.6}
            speed={3}
            roughness={0.4}
            metalness={0.8}
            transparent
            opacity={opacity}
          />
        </Icosahedron>
      </group>
    </Float>
  );
}

function SolutionShape({ visible, opacity }: { visible: boolean, opacity: number }) {
  // Torus Knot represents "Circulation" and "Infinite Loop"
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group scale={visible ? 1.2 : 0} visible={visible}>
        <TorusKnot args={[0.8, 0.3, 100, 16]} >
          <MeshDistortMaterial
            color="#06B6D4" // Cyan 500
            attach="material"
            distort={0.2}
            speed={1.5}
            roughness={0.1}
            metalness={0.6}
            clearcoat={1}
            transparent
            opacity={opacity}
          />
        </TorusKnot>
      </group>
    </Float>
  );
}

export default function SceneController({ scrollY }: { scrollY: number }) {
  // Scroll Logic
  // 0 - 800: Hero (Particles)
  // 800 - 1600: Problem (Chaos Shape)
  // 1600+: Solution (Circulation Shape)

  // Use simple thresholds for boolean visibility to keep it clean, 
  // but we can use opacity for smoother entrance if needed.

  const showHero = scrollY < 1000;
  const showProblem = scrollY >= 600 && scrollY < 1800;
  const showSolution = scrollY >= 1400;

  // Opacity calculations for smooth transitions
  // Problem enters at 600, fully visible at 1000. Exits at 1600, invisible at 1800.
  let problemOpacity = 0;
  if (scrollY >= 600 && scrollY < 1000) problemOpacity = (scrollY - 600) / 400;
  else if (scrollY >= 1000 && scrollY < 1600) problemOpacity = 1;
  else if (scrollY >= 1600 && scrollY < 1800) problemOpacity = 1 - (scrollY - 1600) / 200;

  // Solution enters at 1400, full at 1800
  let solutionOpacity = 0;
  if (scrollY >= 1400 && scrollY < 1800) solutionOpacity = (scrollY - 1400) / 400;
  else if (scrollY >= 1800) solutionOpacity = 1;


  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#020617] transition-colors duration-1000">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06B6D4" />

        <Environment preset="city" />

        <HeroParticles visible={showHero} />
        <ProblemShape visible={showProblem} opacity={problemOpacity} />
        <SolutionShape visible={showSolution} opacity={solutionOpacity} />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
