'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Chiffres factuels du secteur uniquement — aucune métrique de performance
// MemoBTP inventée (voir consignes de contenu).
const STATS = [
  { ref: 'c-pages', target: 80, suffix: '' },
  { ref: 'c-jours', target: 3, suffix: ' jours' },
  { ref: 'c-semaines', target: 3, suffix: ' sem.' },
];

export default function V1V2Page() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      document.querySelectorAll('.v1-section').forEach((section) => {
        if (prefersReduced) {
          gsap.set(section, { opacity: 1, y: 0 });
          return;
        }
        gsap.fromTo(
          section,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 82%' } }
        );
      });

      // Counters fire once their section has (roughly) revealed.
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
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap.to(proxy, {
              value: stat.target,
              duration: 1.5,
              ease: 'power3.out',
              delay: 0.15,
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
      <section className="v1-section v1-reveal">
        <div className="v1-header">
          <span className="tag">Le problème</span>
          <h2>Répondre à un appel d&apos;offres BTP prend un temps que les PME n&apos;ont pas</h2>
          <p>Entre l&apos;analyse du CCTP et la rédaction du mémoire technique, chaque réponse mobilise plusieurs journées.</p>
        </div>
        <div className="v1-grid">
          <div className="v1-card"><h3>20 à 80 pages</h3><p>Un mémoire technique complet et personnalisé à chaque dossier.</p></div>
          <div className="v1-card"><h3>Copier-coller sans fin</h3><p>Reprendre d&apos;anciens dossiers, les adapter, les reformater.</p></div>
          <div className="v1-card"><h3>Délais serrés</h3><p>2 à 3 semaines pour répondre avec les ressources d&apos;une PME.</p></div>
          <div className="v1-card"><h3>Un risque réel</h3><p>Un dossier mal rédigé peut coûter le marché.</p></div>
        </div>
      </section>

      <section className="v1-section v1-reveal v1-alt">
        <div className="v2-header" style={{ marginBottom: 40 }}>
          <span className="tag" style={{ color: 'var(--brand)', background: 'var(--brand-tint)' }}>Le problème, en chiffres</span>
          <h2>L&apos;ampleur du dossier à produire</h2>
          <p>Toute la section apparaît en fondu, puis les chiffres comptent jusqu&apos;à leur valeur — des faits du secteur, pas des promesses produit.</p>
        </div>
        <div className="v2-stats">
          <div className="v2-stat accent"><div className="v2-value" id="c-pages">0</div><div className="v2-label">pages en moyenne dans un mémoire technique</div></div>
          <div className="v2-stat"><div className="v2-value" id="c-jours">0 jours</div><div className="v2-label">de rédaction manuelle pour un dossier complexe</div></div>
          <div className="v2-stat"><div className="v2-value" id="c-semaines">0 sem.</div><div className="v2-label">de délai de réponse en moyenne</div></div>
        </div>
      </section>
    </div>
  );
}
