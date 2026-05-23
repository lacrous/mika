import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Icosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.15}
          roughness={0.15}
          metalness={0.8}
          distort={0.15}
          speed={2}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

function Wireframe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      ref.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.04) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} scale={2.4}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.08} />
      </mesh>
    </Float>
  );
}

function Particles() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#D4AF37" size={0.04} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#D4AF37" />
      <pointLight position={[-5, -3, 2]} intensity={0.5} color="#F0D878" />
      <Icosahedron />
      <Wireframe />
      <Particles />
      <Sparkles count={30} scale={8} size={2} speed={0.3} opacity={0.3} color="#D4AF37" />
    </>
  );
}

export function Admin3DHero({ className = "" }: { className?: string }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.05), var(--nv-bg-body), rgba(212,175,55,0.03))" }}>
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <Scene />
        </Canvas>
      </div>
      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)" }} />
    </div>
  );
}
