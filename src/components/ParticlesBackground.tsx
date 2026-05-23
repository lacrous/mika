import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 150;

function Particles() {
 const meshRef = useRef<THREE.Points>(null);
 const mouseRef = useRef({ x: 0, y: 0 });

 const [positions, velocities] = useMemo(() => {
 const pos = new Float32Array(PARTICLE_COUNT * 3);
 const vel = new Float32Array(PARTICLE_COUNT * 3);

 for (let i = 0; i < PARTICLE_COUNT; i++) {
 // Spread particles across a wide area
 pos[i * 3] = (Math.random() - 0.5) * 20; // x
 pos[i * 3 + 1] = (Math.random() - 0.5) * 12; // y
 pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z

 // Slow drift velocities
 vel[i * 3] = (Math.random() - 0.5) * 0.003;
 vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
 vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
 }

 return [pos, vel];
 }, []);

 const sizes = useMemo(() => {
 const s = new Float32Array(PARTICLE_COUNT);
 for (let i = 0; i < PARTICLE_COUNT; i++) {
 s[i] = Math.random() * 3 + 1; // Varying particle sizes
 }
 return s;
 }, []);

 // Track mouse
 useMemo(() => {
 const handleMouseMove = (e: MouseEvent) => {
 mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
 mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
 };
 window.addEventListener("mousemove", handleMouseMove, { passive: true });
 return () => window.removeEventListener("mousemove", handleMouseMove);
 }, []);

 useFrame(() => {
 if (!meshRef.current) return;
 const posAttr = meshRef.current.geometry.attributes.position;
 const posArray = posAttr.array as Float32Array;

 for (let i = 0; i < PARTICLE_COUNT; i++) {
 const idx = i * 3;

 // Apply drift velocity
 posArray[idx] += velocities[idx];
 posArray[idx + 1] += velocities[idx + 1];
 posArray[idx + 2] += velocities[idx + 2];

 // Gentle mouse repulsion
 const dx = posArray[idx] - mouseRef.current.x * 4;
 const dy = posArray[idx + 1] - mouseRef.current.y * 3;
 const dist = Math.sqrt(dx * dx + dy * dy);
 if (dist < 3) {
 const force = (3 - dist) * 0.0008;
 posArray[idx] += (dx / dist) * force;
 posArray[idx + 1] += (dy / dist) * force;
 }

 // Wrap around boundaries
 if (posArray[idx] > 10) posArray[idx] = -10;
 if (posArray[idx] < -10) posArray[idx] = 10;
 if (posArray[idx + 1] > 6) posArray[idx + 1] = -6;
 if (posArray[idx + 1] < -6) posArray[idx + 1] = 6;
 }

 posAttr.needsUpdate = true;

 // Slow rotation of entire particle field
 meshRef.current.rotation.y += 0.0002;
 meshRef.current.rotation.x += 0.0001;
 });

 return (
 <points ref={meshRef}>
 <bufferGeometry>
 <bufferAttribute
 attach="attributes-position"
 args={[positions, 3]}
 />
 <bufferAttribute
 attach="attributes-size"
 args={[sizes, 1]}
 />
 </bufferGeometry>
 <pointsMaterial
 size={0.04}
 color="#D4AF37"
 transparent
 opacity={0.7}
 sizeAttenuation
 blending={THREE.AdditiveBlending}
 depthWrite={false}
 />
 </points>
 );
}

function FloatingOrbs() {
 const groupRef = useRef<THREE.Group>(null);

 useFrame((state) => {
 if (!groupRef.current) return;
 groupRef.current.rotation.z = state.clock.elapsedTime * 0.02;
 groupRef.current.children.forEach((child, i) => {
 child.position.y += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.0005;
 });
 });

 return (
 <group ref={groupRef}>
 {/* Large subtle orb */}
 <mesh position={[4, 2, -4]}>
 <sphereGeometry args={[1.5, 32, 32]} />
 <meshBasicMaterial
 color="#D4AF37"
 transparent
 opacity={0.04}
 blending={THREE.AdditiveBlending}
 depthWrite={false}
 />
 </mesh>
 {/* Medium orb */}
 <mesh position={[-5, -1, -5]}>
 <sphereGeometry args={[1, 32, 32]} />
 <meshBasicMaterial
 color="#F0D878"
 transparent
 opacity={0.03}
 blending={THREE.AdditiveBlending}
 depthWrite={false}
 />
 </mesh>
 {/* Small orb */}
 <mesh position={[2, -3, -3]}>
 <sphereGeometry args={[0.6, 32, 32]} />
 <meshBasicMaterial
 color="#D4AF37"
 transparent
 opacity={0.05}
 blending={THREE.AdditiveBlending}
 depthWrite={false}
 />
 </mesh>
 </group>
 );
}

export function ParticlesBackground() {
 return (
 <div
 style={{
 position: "absolute",
 inset: 0,
 zIndex: 1,
 pointerEvents: "none",
 }}
 >
 <Canvas
 camera={{ position: [0, 0, 5], fov: 60 }}
 dpr={[1, 1.5]}
 gl={{
 antialias: true,
 alpha: true,
 powerPreference: "high-performance",
 }}
 style={{ background: "transparent" }}
 >
 <Particles />
 <FloatingOrbs />
 </Canvas>
 </div>
 );
}
