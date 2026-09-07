'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { range: [0, 0.16], title: "Votre CCTP arrive", text: "Déposez le PDF du CCTP ou du dossier de consultation de votre appel d'offres." },
  { range: [0.16, 0.36], title: 'MemoBTP l’analyse', text: 'Exigences techniques, administratives et critères de notation sont repérés automatiquement.' },
  { range: [0.36, 0.56], title: 'Il se structure', text: 'Le contenu est organisé selon le plan attendu par l’acheteur public.' },
  { range: [0.56, 0.8], title: 'Rédigé avec votre profil', text: 'Références chantiers, effectifs, certifications — vos données réelles remplissent chaque section.' },
  { range: [0.8, 1.01], title: 'Prêt à déposer', text: 'Un mémoire technique complet, exportable en PDF et Word.' },
];

export default function CctpToMemoireScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cctpRef = useRef<HTMLDivElement>(null);
  const memoireRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);
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
      tl.set(cctp, { opacity: 0, x: -100, rotateY: -30, scale: 0.86 });
      tl.set(memoire, { opacity: 0, x: 60, rotateY: 24, scale: 0.86 });
      if (scan) tl.set(scan, { opacity: 0, y: 0 });
      tl.set(lines, { scaleX: 0, transformOrigin: 'left center' });
      tl.set(check, { opacity: 0, scale: 0 });

      tl.to(cctp, { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 0.16, ease: 'power2.out' }, 0);
      tl.to(cctp, { rotateY: 6, y: -6, duration: 0.1, ease: 'power1.inOut' }, 0.16);
      if (scan) {
        tl.to(scan, { opacity: 1, duration: 0.03 }, 0.17);
        tl.to(scan, { y: 260, duration: 0.16, ease: 'none' }, 0.18);
        tl.to(scan, { opacity: 0, duration: 0.03 }, 0.34);
      }
      tl.to(cctp, { opacity: 0, x: -80, rotateY: -26, scale: 0.8, duration: 0.14, ease: 'power2.in' }, 0.36);
      tl.to(memoire, { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 0.2, ease: 'power2.out' }, 0.42);
      tl.to(lines, { scaleX: 1, duration: 0.14, stagger: 0.025, ease: 'power2.out' }, 0.58);
      tl.to(check, { opacity: 1, scale: 1, duration: 0.16, ease: 'back.out(2.2)' }, 0.84);

      const updateCopy = (progress: number) => {
        STEPS.forEach((step, i) => {
          const el = copyRefs.current[i];
          const dot = dotRefs.current[i];
          const active = progress >= step.range[0] && progress < step.range[1];
          if (el) gsap.to(el, { opacity: active ? 1 : 0, y: active ? 0 : 10, duration: 0.25, overwrite: true });
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
        },
      });
      updateCopy(0);
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="scene-wrap" ref={wrapRef}>
      <div className="scene-pin">
        <div className="scene-stage">
          <div className="scene-blob b1" />
          <div className="scene-blob b2" />

          <div className="scene-copy">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => { copyRefs.current[i] = el; }}
                className="scene-copy-step"
                style={{ position: i === 0 ? 'static' : 'absolute', top: 0, left: 0, opacity: i === 0 ? 1 : 0 }}
              >
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>

          <div className="scene-card-zone">
            <div className="scene-card scene-cctp" ref={cctpRef}>
              <span className="scene-card-label">Appel d&apos;offres</span>
              <span className="scene-card-title">CCTP — Lot 2 Gros Œuvre</span>
              <div className="scene-line w100" />
              <div className="scene-line w80" />
              <div className="scene-line w60" />
              <div className="scene-line w100" />
              <div className="scene-line w80" />
              <div ref={scanRef} className="scene-scanline" />
            </div>

            <div className="scene-card scene-memoire" ref={memoireRef}>
              <span className="scene-card-label">Mémoire technique</span>
              <span className="scene-card-title">Généré par MemoBTP</span>
              {[100, 80, 100, 65, 90, 70].map((w, i) => (
                <div key={i} ref={(el) => { lineRefs.current[i] = el; }} className="scene-line" style={{ width: `${w}%` }} />
              ))}
              <div className="scene-check" ref={checkRef}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
          </div>

          <div className="scene-progress">
            {STEPS.map((step, i) => (
              <span key={step.title} ref={(el) => { dotRefs.current[i] = el; }} className={i === 0 ? 'on' : ''} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
