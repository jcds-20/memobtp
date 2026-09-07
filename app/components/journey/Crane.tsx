'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { COLORS, CRANE_BASE } from './path';

const MAST_HEIGHT = 15.5;
const MAST_HALF = 0.5;
const SEGMENT_H = 1.05;
const SEGMENT_COUNT = Math.round(MAST_HEIGHT / SEGMENT_H);
const CORNERS: [number, number][] = [
  [-MAST_HALF, -MAST_HALF],
  [MAST_HALF, -MAST_HALF],
  [MAST_HALF, MAST_HALF],
  [-MAST_HALF, MAST_HALF],
];

type StrutTransform = { position: THREE.Vector3; quaternion: THREE.Quaternion; length: number };

function strutBetween(a: THREE.Vector3, b: THREE.Vector3): StrutTransform {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const dir = b.clone().sub(a).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return { position: mid, quaternion: quat, length: a.distanceTo(b) };
}

function useLatticeStruts() {
  return useMemo(() => {
    const struts: StrutTransform[] = [];
    for (let s = 0; s < SEGMENT_COUNT; s++) {
      const yLow = s * SEGMENT_H;
      const yHigh = yLow + SEGMENT_H;
      // horizontal rungs at the lower boundary of each segment
      for (let c = 0; c < 4; c++) {
        const [x1, z1] = CORNERS[c];
        const [x2, z2] = CORNERS[(c + 1) % 4];
        struts.push(strutBetween(new THREE.Vector3(x1, yLow, z1), new THREE.Vector3(x2, yLow, z2)));
      }
      // diagonal braces on each of the 4 faces
      for (let c = 0; c < 4; c++) {
        const [x1, z1] = CORNERS[c];
        const [x2, z2] = CORNERS[(c + 1) % 4];
        struts.push(strutBetween(new THREE.Vector3(x1, yLow, z1), new THREE.Vector3(x2, yHigh, z2)));
      }
    }
    return struts;
  }, []);
}

function Mast() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const struts = useLatticeStruts();
  const geometry = useMemo(() => new THREE.BoxGeometry(0.06, 1, 0.06), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.accent, flatShading: true }), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const scale = new THREE.Vector3(1, 1, 1);
    struts.forEach((strut, i) => {
      scale.set(1, strut.length, 1);
      m.compose(strut.position, strut.quaternion, scale);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [struts]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  return (
    <>
      <instancedMesh ref={meshRef} args={[geometry, material, struts.length]} castShadow />
      {CORNERS.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, MAST_HEIGHT / 2, z]} castShadow>
          <boxGeometry args={[0.09, MAST_HEIGHT, 0.09]} />
          <meshStandardMaterial color={COLORS.gray} flatShading />
        </mesh>
      ))}
    </>
  );
}

export default function Crane() {
  const [bx, , bz] = CRANE_BASE;
  const jibLen = 6.5;
  const counterJibLen = 2.2;
  const topY = MAST_HEIGHT;

  return (
    <group position={[bx, 0, bz]}>
      {/* base / ballast */}
      <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.6, 0.7, 1.6]} />
        <meshStandardMaterial color={COLORS.brandDark} flatShading />
      </mesh>

      <Mast />

      {/* cab */}
      <mesh position={[0, topY - 0.4, 0]} castShadow>
        <boxGeometry args={[0.9, 0.6, 0.9]} />
        <meshStandardMaterial color={COLORS.light} flatShading />
      </mesh>

      {/* main jib + counter-jib */}
      <mesh position={[jibLen / 2, topY + 0.15, 0]} castShadow>
        <boxGeometry args={[jibLen, 0.16, 0.16]} />
        <meshStandardMaterial color={COLORS.accent} flatShading />
      </mesh>
      <mesh position={[-counterJibLen / 2, topY + 0.15, 0]} castShadow>
        <boxGeometry args={[counterJibLen, 0.16, 0.16]} />
        <meshStandardMaterial color={COLORS.accent} flatShading />
      </mesh>
      <mesh position={[-counterJibLen, topY + 0.4, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={COLORS.gray} flatShading />
      </mesh>

      {/* apex + support cables (tie rods) */}
      <mesh position={[0, topY + 1.1, 0]} castShadow>
        <boxGeometry args={[0.08, 1.1, 0.08]} />
        <meshStandardMaterial color={COLORS.gray} flatShading />
      </mesh>
      <mesh
        position={[jibLen / 2.4, topY + 0.6, 0]}
        rotation={[0, 0, -Math.atan2(1, jibLen / 2.2)]}
      >
        <cylinderGeometry args={[0.02, 0.02, jibLen * 0.62, 6]} />
        <meshStandardMaterial color={COLORS.gray} flatShading />
      </mesh>
      <mesh
        position={[-counterJibLen / 2.4, topY + 0.6, 0]}
        rotation={[0, 0, Math.atan2(1, counterJibLen / 2.2)]}
      >
        <cylinderGeometry args={[0.02, 0.02, counterJibLen * 0.9, 6]} />
        <meshStandardMaterial color={COLORS.gray} flatShading />
      </mesh>

      {/* trolley, hoist cable, hook */}
      <mesh position={[jibLen * 0.65, topY + 0.15, 0]}>
        <boxGeometry args={[0.22, 0.14, 0.22]} />
        <meshStandardMaterial color={COLORS.gray} flatShading />
      </mesh>
      <mesh position={[jibLen * 0.65, topY - 1.1, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 2.5, 6]} />
        <meshStandardMaterial color="#3a3f47" flatShading />
      </mesh>
      <mesh position={[jibLen * 0.65, topY - 2.4, 0]} castShadow>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial color={COLORS.brandDark} flatShading />
      </mesh>
    </group>
  );
}
