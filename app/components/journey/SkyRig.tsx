'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SKY_RAMP } from './path';

function sampleRamp(progress: number, out: THREE.Color) {
  const stops = SKY_RAMP;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (progress >= a.at && progress <= b.at) {
      const span = b.at - a.at || 1;
      const localT = (progress - a.at) / span;
      out.set(a.color).lerp(new THREE.Color(b.color), localT);
      return;
    }
  }
  out.set(stops[stops.length - 1].color);
}

export default function SkyRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { scene } = useThree();
  const tmp = useMemo(() => new THREE.Color(), []);
  const lastApplied = useRef(-1);

  useFrame(() => {
    const t = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    // Sky color barely changes between frames — skip redundant color churn.
    if (Math.abs(t - lastApplied.current) < 0.002) return;
    lastApplied.current = t;

    sampleRamp(t, tmp);
    if (scene.background instanceof THREE.Color) scene.background.copy(tmp);
    else scene.background = tmp.clone();
    if (scene.fog && 'color' in scene.fog) (scene.fog as THREE.Fog).color.copy(tmp);
  });

  return null;
}
