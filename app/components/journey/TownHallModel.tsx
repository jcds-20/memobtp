'use client';

import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { FACADE_CLIP_Z } from './path';

// Door was located by raycasting the raw asset: the facade's front surface
// faces local +X, with the door opening centered at local
// (x≈28.7, y≈196.9, z≈-8.4), threshold at y≈195.8. This group rotates the
// facade -90° around Y so it faces world +Z, and translates it so the door
// lands at world (0, ~1.15, 0).
//
// The asset's own bounding volume runs far deeper than the visible facade
// (courtyard/ground geometry bundled in the export) — a clipping plane keeps
// only the front slice so it can never bleed into the construction site
// further down the path.
export default function TownHallModel() {
  const { scene } = useGLTF('/models/mairie.glb');

  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -FACADE_CLIP_Z), []);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material) {
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach((mat) => {
          mat.clippingPlanes = [clipPlane];
          mat.clipShadows = true;
        });
      }
    });
  }, [scene, clipPlane]);

  return (
    <group position={[-8.4, -195.75, -28.74]} rotation={[0, -Math.PI / 2, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/mairie.glb');
