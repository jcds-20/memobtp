'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { COLORS } from './path';

// The interior the camera crosses after the window: a small upper landing,
// a staircase down, and a reception floor before exiting toward the site.
// Built entirely from primitives (the mairie.glb is exterior-only and gets
// clipped well before this point — see TownHallModel).

const STEP_COUNT = 12;
const STAIR_TOP: [number, number, number] = [0.4, 4.9, -2];
const STAIR_BOTTOM: [number, number, number] = [1, 1.3, -6];

function Staircase() {
  const steps = useMemo(() => {
    const arr: { position: [number, number, number] }[] = [];
    for (let i = 0; i < STEP_COUNT; i++) {
      const t = i / (STEP_COUNT - 1);
      arr.push({
        position: [
          STAIR_TOP[0] + (STAIR_BOTTOM[0] - STAIR_TOP[0]) * t,
          STAIR_TOP[1] + (STAIR_BOTTOM[1] - STAIR_TOP[1]) * t,
          STAIR_TOP[2] + (STAIR_BOTTOM[2] - STAIR_TOP[2]) * t,
        ],
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {steps.map((s, i) => (
        <mesh key={i} position={s.position} receiveShadow castShadow>
          <boxGeometry args={[1.6, 0.22, 0.42]} />
          <meshStandardMaterial color={COLORS.concrete} />
        </mesh>
      ))}
    </group>
  );
}

function ReceptionDesk() {
  return (
    <group position={[-1.1, 0, -7.2]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.6, 1.1, 0.6]} />
        <meshStandardMaterial color={COLORS.brand} />
      </mesh>
      <mesh position={[0, 1.13, 0]}>
        <boxGeometry args={[1.7, 0.06, 0.7]} />
        <meshStandardMaterial color={COLORS.light} />
      </mesh>
    </group>
  );
}

export default function Interior() {
  const { scene: floorScene } = useGLTF('/models/sol-bois.glb');
  const upperFloorScene = useMemo(() => floorScene.clone(), [floorScene]);
  const groundFloorScene = useMemo(() => floorScene.clone(), [floorScene]);

  return (
    <group>
      {/* upper landing, just past the window */}
      <primitive object={upperFloorScene} scale={0.02} position={[0, 4.85, -1]} />
      <pointLight position={[0, 5.6, -1]} color={COLORS.warm} intensity={10} distance={5} decay={2} />

      <Staircase />

      {/* reception floor */}
      <primitive object={groundFloorScene} scale={0.035} position={[0, 1.02, -7]} />
      <ReceptionDesk />
      <pointLight position={[-0.5, 3, -7]} color={COLORS.warm} intensity={16} distance={7} decay={2} />
      <pointLight position={[1.5, 2.5, -4]} color={COLORS.warm} intensity={8} distance={5} decay={2} />

      {/* enclosing shell so the crossing reads as an interior, not a void */}
      <mesh position={[-2.2, 3, -4]}>
        <boxGeometry args={[0.15, 6, 9]} />
        <meshStandardMaterial color={COLORS.brandDark} />
      </mesh>
      <mesh position={[2.6, 3, -4]}>
        <boxGeometry args={[0.15, 6, 9]} />
        <meshStandardMaterial color={COLORS.brandDark} />
      </mesh>
      <mesh position={[0.2, 6, -4]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.8, 9]} />
        <meshStandardMaterial color="#22345f" side={2} />
      </mesh>
      <mesh position={[0.2, 0, -8.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.8, 0.3]} />
        <meshStandardMaterial color={COLORS.brandDark} />
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/sol-bois.glb');
