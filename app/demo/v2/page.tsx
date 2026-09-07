'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Chiffres factuels du secteur uniquement — aucune métrique de performance
// MemoBTP inventée (voir consignes de contenu).
type StatConfig = { ref: string; target: number; suffix: string };

const STATS: StatConfig[] = [
  { ref: 'v2-pages', target: 80, suffix: '' },
  { ref: 'v2-jours', target: 3, suffix: ' jours' },
  { ref: 'v2-semaines', target: 3, suffix: ' sem.' },
];

export default function V2Page() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      STATS.forEach((stat) => {
        const el = document.getElementById(stat.ref);
        if (!el) return;

        if (prefersReduced) {
          el.textContent = stat.target + stat.suffix;
          return;
        }

        const proxy = { value: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(proxy, {
              value: stat.target,
              duration: 1.6,
              ease: 'power3.out',
              onUpdate: () => {
                el.textContent = Math.round(proxy.value) + stat.suffix;
              },
            });
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <section className="v2-section">
        <div className="v2-header">
          <span className="tag" style={{ color: 'var(--brand)', background: 'var(--brand-tint)' }}>Le problème</span>
          <h2>Ce à quoi une PME du BTP fait face à chaque appel d&apos;offres</h2>
          <p>Des chiffres factuels du secteur, pas des promesses de performance produit.</p>
        </div>
        <div className="v2-stats">
          <div className="v2-stat accent">
            <div className="v2-value" id="v2-pages">0</div>
            <div className="v2-label">pages en moyenne dans un mémoire technique</div>
          </div>
          <div className="v2-stat">
            <div className="v2-value" id="v2-jours">0 jours</div>
            <div className="v2-label">de rédaction manuelle pour un dossier complexe</div>
          </div>
          <div className="v2-stat">
            <div className="v2-value" id="v2-semaines">0 sem.</div>
            <div className="v2-label">de délai de réponse en moyenne</div>
          </div>
        </div>
      </section>

      <section className="v2-section" style={{ paddingTop: 0 }}>
        <div className="v2-header">
          <p>Scrollez à nouveau vers le haut puis revenez pour rejouer l&apos;animation (déclenchement unique par chargement de page).</p>
        </div>
      </section>
    </div>
  );
}
