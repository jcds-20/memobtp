'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function V1Page() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      document.querySelectorAll('.v1-section').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 82%' },
          }
        );
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
          <p>Entre l&apos;analyse du CCTP, la rédaction du mémoire technique et la constitution du dossier administratif, chaque réponse mobilise plusieurs journées de travail.</p>
        </div>
        <div className="v1-grid">
          <div className="v1-card">
            <h3>Des mémoires de 20 à 80 pages</h3>
            <p>La rédaction manuelle prend entre 1 et 3 jours selon la complexité du lot.</p>
          </div>
          <div className="v1-card">
            <h3>Du copier-coller sans fin</h3>
            <p>Reprendre d&apos;anciens dossiers, les adapter, les reformater — sans valeur ajoutée.</p>
          </div>
          <div className="v1-card">
            <h3>Des délais serrés</h3>
            <p>2 à 3 semaines pour répondre, avec les ressources limitées d&apos;une PME.</p>
          </div>
          <div className="v1-card">
            <h3>Un dossier mal rédigé peut coûter le marché</h3>
            <p>La qualité de la rédaction compte autant que le prix.</p>
          </div>
        </div>
      </section>

      <section className="v1-section v1-reveal v1-alt">
        <div className="v1-header">
          <span className="tag">Comment ça marche</span>
          <h2>De l&apos;appel d&apos;offres au mémoire finalisé, en 3 étapes</h2>
          <p>MemoBTP analyse le CCTP et génère un mémoire technique adapté à votre entreprise.</p>
        </div>
        <div className="v1-grid">
          <div className="v1-card">
            <h3>1. Importez le CCTP</h3>
            <p>Déposez le PDF, MemoBTP analyse les exigences techniques et administratives.</p>
          </div>
          <div className="v1-card">
            <h3>2. Votre profil entreprise</h3>
            <p>Références, effectifs, certifications — renseignés une fois, réutilisés à chaque dossier.</p>
          </div>
          <div className="v1-card">
            <h3>3. Export du mémoire</h3>
            <p>Un document structuré, exportable en PDF et Word, prêt à déposer.</p>
          </div>
        </div>
      </section>

      <section className="v1-section v1-reveal">
        <div className="v1-header">
          <span className="tag">Les bénéfices</span>
          <h2>Ce que MemoBTP change pour votre PME</h2>
          <p>Des changements concrets dans la façon de préparer vos réponses aux appels d&apos;offres.</p>
        </div>
        <div className="v1-grid">
          <div className="v1-card">
            <h3>Gain de temps considérable</h3>
            <p>Ce qui mobilisait 1 à 3 jours de rédaction laisse place à un processus structuré, sans ressaisie.</p>
          </div>
          <div className="v1-card">
            <h3>Meilleure qualité des dossiers</h3>
            <p>Des mémoires structurés et argumentés, adaptés à chaque marché.</p>
          </div>
          <div className="v1-card">
            <h3>Réutilisation intelligente</h3>
            <p>Votre bibliothèque de références s&apos;enrichit à chaque dossier.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
