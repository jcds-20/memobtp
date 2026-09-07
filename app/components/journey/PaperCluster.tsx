'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// paper_debris.glb's own bounding box is ~32 x 8 x 132 units, so each
// instance is scaled well down. Positions straddle the slalom waypoints
// (camera weaves x≈±2.9 between z≈21 and z≈9.5) so the camera visibly
// passes between clusters rather than just past a still-life pile.
const INSTANCES: {
  position: [number, number, number];
  rotationY: number;
  scale: number;
  floatSpeed: number;
  floatAmp: number;
  spinSpeed: number;
  phase: number;
}[] = [
  { position: [-1.8, 1.4, 18], rotationY: 0.4, scale: 0.05, floatSpeed: 0.6, floatAmp: 0.35, spinSpeed: 0.25, phase: 0 },
  { position: [1.5, 2, 15.5], rotationY: 2.1, scale: 0.045, floatSpeed: 0.5, floatAmp: 0.4, spinSpeed: -0.2, phase: 1.1 },
  { position: [3.6, 1.2, 12.5], rotationY: 1.1, scale: 0.055, floatSpeed: 0.7, floatAmp: 0.3, spinSpeed: 0.3, phase: 2.4 },
  { position: [0.5, 1.8, 11], rotationY: 3.4, scale: 0.04, floatSpeed: 0.45, floatAmp: 0.45, spinSpeed: -0.15, phase: 3.6 },
  { position: [-3.4, 1.5, 9], rotationY: 0.9, scale: 0.05, floatSpeed: 0.55, floatAmp: 0.35, spinSpeed: 0.22, phase: 4.8 },
  { position: [-1, 2.2, 6.5], rotationY: 2.7, scale: 0.045, floatSpeed: 0.65, floatAmp: 0.4, spinSpeed: -0.28, phase: 0.6 },
];

export default function PaperCluster() {
  const { scene } = useGLTF('/models/papier.glb');
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const clones = useMemo(() => INSTANCES.map(() => scene.clone()), [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    INSTANCES.forEach((inst, i) => {
      const g = groupRefs.current[i];
      if (!g) return;
      g.position.y = inst.position[1] + Math.sin(t * inst.floatSpeed + inst.phase) * inst.floatAmp;
      g.rotation.y = inst.rotationY + t * inst.spinSpeed;
      g.rotation.x = Math.sin(t * inst.floatSpeed * 0.7 + inst.phase) * 0.08;
    });
  });

  return (
    <>
      {INSTANCES.map((inst, i) => (
        <group
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={inst.position}
        >
          <primitive object={clones[i]} scale={inst.scale} />
        </group>
      ))}
    </>
  );
}

useGLTF.preload('/models/papier.glb');
