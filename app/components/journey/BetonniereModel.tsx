'use client';

import { useGLTF } from '@react-three/drei';
import { CONSTRUCTION_Z } from './path';

// betonniere_chantier.glb's own bbox is ~0.2 x 0.14 x 0.11 units (exported at
// a tiny arbitrary scale) — scaled up ~12x to read as a human-scale mixer
// next to the rest of the construction site.
export default function BetonniereModel() {
  const { scene } = useGLTF('/models/betonniere.glb');
  return (
    <primitive
      object={scene}
      position={[-1.6, 0, CONSTRUCTION_Z - 1.5]}
      rotation={[0, 0.6, 0]}
      scale={12}
    />
  );
}

useGLTF.preload('/models/betonniere.glb');
