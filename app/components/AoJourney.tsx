'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import AoJourneyFallback from './AoJourneyFallback';

const AoJourney3D = dynamic(() => import('./AoJourney3D'), { ssr: false });

export default function AoJourney() {
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isWideEnough = window.matchMedia('(min-width: 900px)').matches;
    setUse3D(!prefersReduced && isWideEnough);
  }, []);

  return use3D ? <AoJourney3D /> : <AoJourneyFallback />;
}
