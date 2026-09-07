'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function V4Page() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const s1Ref = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.to(gridRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(s1Ref.current, {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(s2Ref.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div>
      <section className="v4-hero" ref={heroRef}>
        <div className="v4-bg-grid" ref={gridRef} />
        <div className="v4-bg-shape s1" ref={s1Ref} />
        <div className="v4-bg-shape s2" ref={s2Ref} />
        <div className="v4-fg">
          <span className="tag v3-tag">Accès anticipé</span>
          <h2>Générez votre mémoire technique BTP, prêt à déposer</h2>
          <p>MemoBTP transforme le CCTP de votre appel d&apos;offres en un mémoire technique structuré et prêt à déposer.</p>
        </div>
      </section>

      <section className="v1-section v4-mid">
        <div className="v1-header">
          <span className="tag">Le principe</span>
          <h2>Le fond bouge un peu moins vite que le premier plan</h2>
          <p>Remontez et redescendez lentement sur le hero ci-dessus : la grille et les formes en arrière-plan suivent le scroll à une vitesse différente du texte, ce qui crée une sensation de profondeur sans effet criard.</p>
        </div>
      </section>
    </div>
  );
}
