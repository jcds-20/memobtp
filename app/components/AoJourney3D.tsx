'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JOURNEY_STEPS, stepIndexForProgress } from './journeySteps';
import CameraRig from './journey/CameraRig';
import SkyRig from './journey/SkyRig';
import PaperCluster from './journey/PaperCluster';
import TownHallModel from './journey/TownHallModel';
import Interior from './journey/Interior';
import ConstructionSite from './journey/ConstructionSite';
import BetonniereModel from './journey/BetonniereModel';
import Crane from './journey/Crane';
import Clouds from './journey/Clouds';
import { COLORS } from './journey/path';

gsap.registerPlugin(ScrollTrigger);

function GroundFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog(COLORS.brandDark, 10, 42);
    scene.background = new THREE.Color(COLORS.brandDark);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  return null;
}

function Scene({ progressRef, lowPower }: { progressRef: React.MutableRefObject<number>; lowPower: boolean }) {
  return (
    <>
      <GroundFog />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1}
        castShadow={!lowPower}
        shadow-mapSize-width={lowPower ? 512 : 1024}
        shadow-mapSize-height={lowPower ? 512 : 1024}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={40}
      />
      <directionalLight position={[-6, 5, -8]} intensity={0.3} color={COLORS.brand} />

      <Suspense fallback={null}>
        <PaperCluster />
        <TownHallModel />
        <Interior />
        <BetonniereModel />
      </Suspense>
      <ConstructionSite />
      <Crane />
      <Clouds clusterCount={lowPower ? 4 : 7} puffsPerCluster={lowPower ? 4 : 5} />

      <CameraRig progressRef={progressRef} />
      <SkyRig progressRef={progressRef} />
    </>
  );
}

export default function AoJourney3D() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    setLowPower(window.matchMedia('(max-width: 1200px)').matches || (navigator.hardwareConcurrency ?? 8) <= 4);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const stepIndex = stepIndexForProgress(self.progress);
          setActiveStep((prev) => (prev === stepIndex ? prev : stepIndex));
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const dpr = useMemo<[number, number]>(() => (lowPower ? [1, 1.2] : [1, 1.5]), [lowPower]);

  return (
    <section id="parcours" className="journey-wrap" ref={wrapperRef} style={{ height: '760vh' }}>
      <div className="journey-sticky">
        <div className="journey-canvas">
          <Canvas
            onCreated={(state) => {
              state.gl.localClippingEnabled = true;
            }}
            shadows={!lowPower}
            camera={{ fov: 55, near: 0.1, far: 90 }}
            dpr={dpr}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <Scene progressRef={progressRef} lowPower={lowPower} />
          </Canvas>
        </div>
        <div className="journey-overlay">
          <div className="container">
            {JOURNEY_STEPS.map((step, i) => (
              <div className={`journey-step-text${i === activeStep ? ' active' : ''}`} key={step.title}>
                <span className="badge badge-accent">{step.badge}</span>
                <h3>{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
        <div className="journey-progress">
          {JOURNEY_STEPS.map((step, i) => (
            <div key={step.title} className={`journey-progress-dot${i === activeStep ? ' active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
