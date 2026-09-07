'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { range: [0, 0.16], title: 'Votre CCTP arrive', text: 'Le cahier des charges de l’appel d’offres est déposé — 40 pages d’exigences techniques à dépouiller.' },
  { range: [0.16, 0.36], title: 'MemoBTP l’analyse', text: 'Exigences techniques, critères de notation, contraintes administratives : tout est repéré automatiquement.' },
  { range: [0.36, 0.56], title: 'Il se transforme', text: 'Le contenu est restructuré selon le plan attendu par l’acheteur public.' },
  { range: [0.56, 0.8], title: 'Rédigé avec vos données', text: 'Références chantiers, moyens, certifications — votre profil vient remplir chaque section.' },
  { range: [0.8, 1.01], title: 'Prêt à déposer', text: 'Un mémoire technique complet, exporté en PDF et Word.' },
];

export default function CardScene({ parallax = false }: { parallax?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cctpRef = useRef<HTMLDivElement>(null);
  const memoireRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cctp = cctpRef.current;
      const memoire = memoireRef.current;
      const scan = scanRef.current;
      const check = checkRef.current;
      const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!cctp || !memoire || !check) return;

      if (prefersReduced) {
        gsap.set(cctp, { opacity: 0 });
        gsap.set(memoire, { opacity: 1, x: 0, rotateY: 0, scale: 1 });
        gsap.set(lines, { scaleX: 1 });
        gsap.set(check, { opacity: 1, scale: 1 });
        const lastCopy = copyRefs.current[copyRefs.current.length - 1];
        if (lastCopy) gsap.set(lastCopy, { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ paused: true });
      tl.set(cctp, { opacity: 0, x: -110, rotateY: -32, scale: 0.85 });
      tl.set(memoire, { opacity: 0, x: 70, rotateY: 26, scale: 0.85 });
      if (scan) tl.set(scan, { opacity: 0, y: 0 });
      tl.set(lines, { scaleX: 0, transformOrigin: 'left center' });
      tl.set(check, { opacity: 0, scale: 0 });

      tl.to(cctp, { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 0.16, ease: 'power2.out' }, 0);

      tl.to(cctp, { rotateY: 6, y: -6, duration: 0.1, ease: 'power1.inOut' }, 0.16);
      if (scan) {
        tl.to(scan, { opacity: 1, duration: 0.03 }, 0.17);
        tl.to(scan, { y: 300, duration: 0.16, ease: 'none' }, 0.18);
        tl.to(scan, { opacity: 0, duration: 0.03 }, 0.34);
      }

      tl.to(cctp, { opacity: 0, x: -90, rotateY: -28, scale: 0.8, duration: 0.14, ease: 'power2.in' }, 0.36);
      tl.to(memoire, { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 0.2, ease: 'power2.out' }, 0.42);
      tl.to(lines, { scaleX: 1, duration: 0.14, stagger: 0.025, ease: 'power2.out' }, 0.58);
      tl.to(check, { opacity: 1, scale: 1, duration: 0.16, ease: 'back.out(2.2)' }, 0.84);

      const updateCopy = (progress: number) => {
        STEPS.forEach((step, i) => {
          const el = copyRefs.current[i];
          const dot = dotRefs.current[i];
          const active = progress >= step.range[0] && progress < step.range[1];
          if (el) gsap.to(el, { opacity: active ? 1 : 0, y: active ? 0 : 10, duration: 0.25 });
          if (dot) dot.classList.toggle('on', active);
        });
      };

      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          tl.progress(self.progress);
          updateCopy(self.progress);
          if (parallax) {
            gsap.set(gridRef.current, { xPercent: self.progress * -6, yPercent: self.progress * 8 });
            gsap.set(blob1Ref.current, { x: self.progress * 40, y: self.progress * -30 });
            gsap.set(blob2Ref.current, { x: self.progress * -50, y: self.progress * 20 });
          }
        },
      });
      updateCopy(0);
    }, wrapRef);

    return () => ctx.revert();
  }, [parallax]);

  return (
    <section className="v3-wrap" ref={wrapRef} style={{ height: '480vh' }}>
      <div className="v3-pin">
        {parallax && <div className="v4-bg-grid" ref={gridRef} style={{ position: 'absolute' }} />}
        <div className="v3-stage">
          <div className="v3-blob b1" ref={blob1Ref} />
          <div className="v3-blob b2" ref={blob2Ref} />

          <div className="v3-copy">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => {
                  copyRefs.current[i] = el;
                }}
                style={{ position: i === 0 ? 'static' : 'absolute', top: 0, left: 0, opacity: i === 0 ? 1 : 0 }}
              >
                <span className="tag v3-tag">Comment ça marche</span>
                <h2 style={{ opacity: 1 }}>{step.title}</h2>
                <p style={{ opacity: 1 }}>{step.text}</p>
              </div>
            ))}
          </div>

          <div className="v3-card-zone">
            <div className="v3-card v3-cctp" ref={cctpRef}>
              <span className="v3-card-label">Appel d&apos;offres</span>
              <span className="v3-card-title">CCTP — Lot 2 Gros Œuvre</span>
              <div className="v3-line w100" />
              <div className="v3-line w80" />
              <div className="v3-line scan w60" />
              <div className="v3-line w100" />
              <div className="v3-line w80" />
              <div ref={scanRef} style={{ position: 'absolute', left: 26, right: 26, top: 90, height: 3, background: 'var(--accent)', borderRadius: 2 }} />
            </div>

            <div className="v3-card v3-memoire" ref={memoireRef}>
              <span className="v3-card-label">Mémoire technique</span>
              <span className="v3-card-title">Généré par MemoBTP</span>
              {[100, 80, 100, 65, 90, 70].map((w, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className="v3-line"
                  style={{ width: `${w}%` }}
                />
              ))}
              <div className="v3-check" ref={checkRef}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
          </div>

          <div className="v3-progress">
            {STEPS.map((step, i) => (
              <span
                key={step.title}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className={i === 0 ? 'on' : ''}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
