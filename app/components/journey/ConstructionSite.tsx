'use client';

import { COLORS, CONSTRUCTION_Z } from './path';

function Pallet({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[1, 0.16, 1]} />
        <meshStandardMaterial color="#9c7a4a" flatShading />
      </mesh>
      {[-0.35, 0, 0.35].map((z) => (
        <mesh key={z} position={[0, 0.17, z]}>
          <boxGeometry args={[1, 0.05, 0.12]} />
          <meshStandardMaterial color="#7a5c34" flatShading />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color={COLORS.brand} flatShading />
      </mesh>
    </group>
  );
}

function Cone({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 10]} />
        <meshStandardMaterial color="#2a2a2a" flatShading />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <coneGeometry args={[0.18, 0.55, 10]} />
        <meshStandardMaterial color={COLORS.accent} flatShading />
      </mesh>
    </group>
  );
}

function BarrierSegment({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-0.75, 0.75].map((x) => (
        <mesh key={x} position={[x, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
          <meshStandardMaterial color={COLORS.gray} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.7, 0.14, 0.04]} />
        <meshStandardMaterial color={COLORS.accent} flatShading />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.7, 0.14, 0.04]} />
        <meshStandardMaterial color={COLORS.light} flatShading />
      </mesh>
    </group>
  );
}

function SteelBay({ position, height = 3.2 }: { position: [number, number, number]; height?: number }) {
  const span = 1.9;
  const diagLen = Math.sqrt(span * span + height * height);
  const diagAngle = Math.atan2(height, span);
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[0.12, height, 0.12]} />
        <meshStandardMaterial color={COLORS.gray} flatShading />
      </mesh>
      <mesh position={[span, height / 2, 0]} castShadow>
        <boxGeometry args={[0.12, height, 0.12]} />
        <meshStandardMaterial color={COLORS.gray} flatShading />
      </mesh>
      <mesh position={[span / 2, height, 0]} castShadow>
        <boxGeometry args={[span + 0.1, 0.12, 0.12]} />
        <meshStandardMaterial color={COLORS.gray} flatShading />
      </mesh>
      <mesh position={[span / 2, height * 0.55, 0]} rotation={[0, 0, diagAngle]} castShadow>
        <boxGeometry args={[diagLen, 0.08, 0.08]} />
        <meshStandardMaterial color={COLORS.concrete} flatShading />
      </mesh>
      <mesh position={[span / 2, height * 0.55, 0]} rotation={[0, 0, -diagAngle]} castShadow>
        <boxGeometry args={[diagLen, 0.08, 0.08]} />
        <meshStandardMaterial color={COLORS.concrete} flatShading />
      </mesh>
    </group>
  );
}

function RebarStack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.12 + i * 0.14, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2.4, 8]} />
          <meshStandardMaterial color="#5b6472" flatShading metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function ConstructionSite() {
  const cx = 2.2;
  const cz = CONSTRUCTION_Z;

  return (
    <group>
      {/* large ground slab */}
      <mesh position={[cx, -0.02, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[34, 30]} />
        <meshStandardMaterial color="#6b6f78" flatShading />
      </mesh>
      <mesh position={[cx, -0.015, cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9, 9.3, 4, 1]} />
        <meshStandardMaterial color={COLORS.accent} flatShading />
      </mesh>

      {/* unfinished steel frame — five bays, taller */}
      {[0, 1, 2, 3, 4].map((bay) => (
        <SteelBay key={bay} position={[cx - 8 + bay * 2.1, 0, cz + 5]} height={3.6} />
      ))}
      {[0, 1, 2, 3, 4].map((bay) => (
        <SteelBay key={`b2-${bay}`} position={[cx - 8 + bay * 2.1, 0, cz + 2.6]} height={3.6} />
      ))}

      <Pallet position={[cx - 10.5, 0, cz - 1]} />
      <Pallet position={[cx - 10.5, 0, cz - 0.1]} />
      <Pallet position={[cx - 9.4, 0, cz - 1]} />
      <RebarStack position={[cx - 12, 0, cz - 3]} />
      <RebarStack position={[cx - 11.3, 0, cz - 3.6]} />

      {[-6, -4.4, -2.8, -1.2, 0.4, 2].map((x, i) => (
        <Cone key={i} position={[cx + x, 0, cz - 6.5]} />
      ))}
      <BarrierSegment position={[cx - 5, 0, cz - 7]} />
      <BarrierSegment position={[cx - 3.2, 0, cz - 7]} />
      <BarrierSegment position={[cx - 1.4, 0, cz - 7]} />
      <BarrierSegment position={[cx + 0.4, 0, cz - 7]} />

      <Pallet position={[cx + 6, 0, cz - 2]} />
      <Pallet position={[cx + 7, 0, cz - 2]} />
      <Pallet position={[cx + 6.5, 0, cz - 3]} />
    </group>
  );
}
