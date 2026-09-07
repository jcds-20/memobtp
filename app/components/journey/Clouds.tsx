'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CLOUD_LAYER_Y } from './path';

type Puff = { position: THREE.Vector3; scale: number };

export default function Clouds({ clusterCount = 7, puffsPerCluster = 5 }: { clusterCount?: number; puffsPerCluster?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        roughness: 1,
      }),
    []
  );

  const puffs = useMemo<Puff[]>(() => {
    const arr: Puff[] = [];
    for (let c = 0; c < clusterCount; c++) {
      const center = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        CLOUD_LAYER_Y + (Math.random() - 0.5) * 3,
        -8 + (Math.random() - 0.5) * 10
      );
      for (let p = 0; p < puffsPerCluster; p++) {
        arr.push({
          position: center
            .clone()
            .add(new THREE.Vector3((Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 2.4)),
          scale: 0.8 + Math.random() * 1.1,
        });
      }
    }
    return arr;
  }, [clusterCount, puffsPerCluster]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    puffs.forEach((puff, i) => {
      m.compose(puff.position, quat, new THREE.Vector3(puff.scale, puff.scale * 0.7, puff.scale));
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [puffs]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  return <instancedMesh ref={meshRef} args={[geometry, material, puffs.length]} />;
}
