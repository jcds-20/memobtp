'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardScene from '../_shared/CardScene';

gsap.registerPlugin(ScrollTrigger);

export default function V1V3Page() {
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
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <CardScene />

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
        <div className="v1-header">
          <span className="tag">Comment ça marche</span>
          <h2>De l&apos;appel d&apos;offres au mémoire finalisé, en 3 étapes</h2>
          <p>MemoBTP analyse le CCTP et génère un mémoire technique adapté à votre entreprise.</p>
        </div>
        <div className="v1-grid">
          <div className="v1-card"><h3>1. Importez le CCTP</h3><p>Déposez le PDF, MemoBTP analyse les exigences.</p></div>
          <div className="v1-card"><h3>2. Votre profil entreprise</h3><p>Références, effectifs, certifications — réutilisés à chaque dossier.</p></div>
          <div className="v1-card"><h3>3. Export du mémoire</h3><p>Un document structuré, exportable en PDF et Word.</p></div>
        </div>
      </section>

      <section className="v1-section v1-reveal">
        <div className="v1-header">
          <span className="tag">Les bénéfices</span>
          <h2>Ce que MemoBTP change pour votre PME</h2>
          <p>Des changements concrets dans la façon de préparer vos réponses aux appels d&apos;offres.</p>
        </div>
        <div className="v1-grid">
          <div className="v1-card"><h3>Gain de temps</h3><p>La rédaction manuelle laisse place à un processus structuré, sans ressaisie.</p></div>
          <div className="v1-card"><h3>Meilleure qualité</h3><p>Des mémoires structurés et argumentés.</p></div>
          <div className="v1-card"><h3>Réutilisation intelligente</h3><p>Votre bibliothèque de références s&apos;enrichit à chaque dossier.</p></div>
        </div>
      </section>
    </div>
  );
}
