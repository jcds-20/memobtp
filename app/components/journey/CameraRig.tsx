'use client';

import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_WAYPOINTS, CAMERA_TARGETS } from './path';

export default function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();

  const posCurve = useMemo(
    () => new THREE.CatmullRomCurve3(CAMERA_WAYPOINTS.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.5),
    []
  );
  const lookCurve = useMemo(
    () => new THREE.CatmullRomCurve3(CAMERA_TARGETS.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.5),
    []
  );
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const t = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    camera.position.copy(posCurve.getPointAt(t));
    lookTarget.copy(lookCurve.getPointAt(t));
    camera.lookAt(lookTarget);
  });

  return null;
}
