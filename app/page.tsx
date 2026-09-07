'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CctpToMemoireScene from './components/CctpToMemoireScene';
// 3D scroll journey temporarily disabled — see app/components/AoJourney.tsx
// import AoJourney from './components/AoJourney';

gsap.registerPlugin(ScrollTrigger);

const TURNSTILE_SITE_KEY = '0x4AAAAAAEr7B20CXq0KGoZt';
const TURNSTILE_ACTION = 'waitlist_signup';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

type ProspectResponse = { message?: string; success?: boolean };

export default function Home() {
  const heroEmailRef = useRef<HTMLInputElement>(null);
  const nomRef = useRef<HTMLInputElement>(null);
  const entrepriseRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const employesRef = useRef<HTMLSelectElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileToken = useRef('');

  function renderTurnstile() {
    if (!window.turnstile || !turnstileRef.current || turnstileWidgetId.current) return;
    turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      action: TURNSTILE_ACTION,
      callback: (token: string) => { turnstileToken.current = token; },
      'expired-callback': () => { turnstileToken.current = ''; },
      'error-callback': () => { turnstileToken.current = ''; },
    });
  }

  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function heroEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = heroEmailRef.current?.value.trim() ?? '';
    if (!email) return;
    if (emailRef.current) emailRef.current.value = email;
    document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => nomRef.current?.focus(), 500);
  }

  async function submitInscription() {
    if (websiteRef.current && websiteRef.current.value !== '') return;

    const nom = nomRef.current?.value.trim() ?? '';
    const entreprise = entrepriseRef.current?.value.trim() ?? '';
    const email = emailRef.current?.value.trim() ?? '';
    const nb_employes = employesRef.current?.value ?? '';
    const website = websiteRef.current?.value ?? '';

    const errors: Record<string, boolean> = {};
    const missing: string[] = [];
    if (!nom) { errors.nom = true; missing.push('nom'); }
    if (!entreprise) { errors.entreprise = true; missing.push('entreprise'); }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.email = true; missing.push('email valide'); }
    if (!nb_employes) { errors.employes = true; missing.push("nombre d'employés"); }

    setFieldErrors(errors);

    if (missing.length) {
      setErrorMsg('Merci de renseigner : ' + missing.join(', ') + '.');
      setShowError(true);
      return;
    }

    if (!turnstileToken.current) {
      setErrorMsg('Merci de valider le champ de sécurité avant de continuer.');
      setShowError(true);
      return;
    }

    setShowError(false);
    setSubmitting(true);

    try {
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, entreprise, email, nb_employes, website, turnstileToken: turnstileToken.current }),
      });

      const payload: ProspectResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(payload.message || `Erreur serveur (${res.status})`);
      }

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Une erreur est survenue : ${message}. Veuillez réessayer ou nous contacter à contact@memobtp.fr`);
      setShowError(true);
      setSubmitting(false);
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current);
        turnstileToken.current = '';
      }
    }
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (prefersReduced) {
          gsap.set(el, { opacity: 1, y: 0, scale: 1 });
          return;
        }
        gsap.fromTo(
          el,
          { opacity: 0, y: 24, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        );
      });

      // background layers behind the hero content, each moving at a different
      // rate on scroll — the grid drifts a little, the two blobs drift a lot
      // more (in opposite directions), which is what makes the depth effect
      // actually readable instead of a barely-visible grid shift.
      if (!prefersReduced) {
        gsap.to('#hero .hero-grid-bg', {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('#hero .hero-blob.blob-a', {
          yPercent: -32,
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('#hero .hero-blob.blob-b', {
          yPercent: 26,
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      // Compteurs factuels (secteur), pas de métrique de performance MemoBTP inventée.
      const stats: { id: string; target: number; suffix: string }[] = [
        { id: 'stat-pages', target: 80, suffix: '' },
        { id: 'stat-jours', target: 3, suffix: ' jours' },
        { id: 'stat-semaines', target: 3, suffix: ' sem.' },
      ];
      stats.forEach(({ id, target, suffix }) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (prefersReduced) {
          el.textContent = target + suffix;
          return;
        }
        const proxy = { value: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(proxy, {
              value: target,
              duration: 1.3,
              ease: 'power3.out',
              delay: 0.1,
              onUpdate: () => { el.textContent = Math.round(proxy.value) + suffix; },
            });
          },
        });
      });
    });

    const header = document.querySelector('.site-header');
    const onScrollHeader = () => {
      if (window.scrollY > 30) header?.classList.add('scrolled');
      else header?.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();

    const heroRight = document.querySelector('.hero-right') as HTMLElement | null;
    const heroSection = document.getElementById('hero');
    let ticking = false;
    const updateParallax = () => {
      if (heroRight && heroSection) {
        const rect = heroSection.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);
          heroRight.style.transform = `translateY(${progress * 34}px)`;
        }
      }
      ticking = false;
    };
    const onScrollParallax = () => {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    };
    if (heroRight && heroSection && !prefersReduced) {
      window.addEventListener('scroll', onScrollParallax, { passive: true });
      updateParallax();
    }

    // doc mockup progress bar — purely decorative (no number displayed)
    const progFill = document.getElementById('prog-fill');
    const progTimer = setTimeout(() => {
      progFill?.classList.add('filled');
    }, 650);

    return () => {
      clearTimeout(progTimer);
      ctx.revert();
      window.removeEventListener('scroll', onScrollHeader);
      window.removeEventListener('scroll', onScrollParallax);
    };
  }, []);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" onLoad={renderTurnstile} />

      <header className="site-header">
        <div className="nav-inner">
          <a className="logo" href="#hero">Memo<em>BTP</em></a>
          <ul className="nav-links">
            <li><a href="#probleme">Le problème</a></li>
            <li><a href="#solution">Comment ça marche</a></li>
            <li><a href="#avantages">Bénéfices</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a className="btn btn-accent" href="#inscription">Rejoindre la liste</a></li>
          </ul>
        </div>
      </header>

      <main>
        <section id="hero">
          <div className="hero-grid-bg" />
          <div className="hero-blob blob-a" />
          <div className="hero-blob blob-b" />
          <div className="hero-left">
            <div className="hero-badge-row">
              <span className="badge badge-accent"><span className="badge-dot" />Accès anticipé · Places limitées</span>
            </div>
            <h1>Générez votre <span className="hl">mémoire technique BTP</span>, prêt à déposer</h1>
            <p className="hero-sub">MemoBTP transforme le CCTP de votre appel d&apos;offres en un mémoire technique structuré et prêt à déposer, sans repartir d&apos;une page blanche à chaque marché public.</p>
            <form className="hero-form" id="hero-form" onSubmit={heroEmailSubmit}>
              <label htmlFor="hero-email" className="visually-hidden">Email professionnel</label>
              <input ref={heroEmailRef} type="email" id="hero-email" placeholder="votre@email-pro.fr" required autoComplete="email" />
              <button type="submit" className="btn btn-accent btn-lg">
                Rejoindre la liste d&apos;attente
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </form>
            <div className="hero-trust">
              <span className="item"><svg className="ico" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>Aucun paiement requis</span>
              <span className="item"><svg className="ico" viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /></svg>Hébergement en Europe</span>
              <span className="item"><svg className="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></svg>Résiliation en 1 clic</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="doc-wrap">
              <div className="doc-card">
                <div className="doc-header">
                  <svg className="ico" viewBox="0 0 24 24"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5" /></svg>
                  <span className="doc-name">Mémoire Technique — Lot 2 Gros Œuvre</span>
                </div>
                <div className="doc-body">
                  <div className="doc-row w100" />
                  <div className="doc-row w80" />
                  <div className="doc-row w65" />
                  <div className="doc-block">
                    <div className="doc-block-label">1. Présentation de l&apos;entreprise</div>
                    <div className="doc-row w100" style={{ marginBottom: 6 }} />
                    <div className="doc-row w80" />
                  </div>
                  <div className="doc-block">
                    <div className="doc-block-label">2. Moyens techniques &amp; humains</div>
                    <div className="doc-row w100" style={{ marginBottom: 6 }} />
                    <div className="doc-row w65" />
                  </div>
                  <div className="doc-prog">
                    <div className="prog-track"><div className="prog-fill" id="prog-fill" /></div>
                  </div>
                </div>
              </div>
              <div className="float-pill pill-time">
                <svg className="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                <div>Moins de tâches répétitives<span className="pill-sub">Le contenu se structure automatiquement</span></div>
              </div>
              <div className="float-pill pill-ai">
                <svg className="ico" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="12" rx="2" /><path d="M9 7V5a3 3 0 0 1 6 0v2M9 13h.01M15 13h.01" /></svg>
                <div>IA spécialisée BTP<span className="pill-sub">Adaptée à votre profil</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="probleme">
          <div className="container">
            <div className="sec-header centered reveal">
              <span className="badge badge-navy">Le problème</span>
              <h2>Répondre à un appel d&apos;offres BTP prend un temps que les PME n&apos;ont pas</h2>
              <p>Entre l&apos;analyse du CCTP, la rédaction du mémoire technique et la constitution du dossier administratif, chaque réponse à un marché public mobilise plusieurs journées de travail — souvent au détriment du suivi de chantier.</p>
            </div>
            <div className="prob-grid stagger">
              <div className="prob-card reveal">
                <div className="prob-ico"><svg className="ico" viewBox="0 0 24 24"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg></div>
                <div>
                  <h3>Des mémoires techniques de 20 à 80 pages</h3>
                  <p>Chaque appel d&apos;offres exige un mémoire technique complet et personnalisé. La rédaction manuelle prend entre 1 et 3 jours selon la complexité du lot.</p>
                </div>
              </div>
              <div className="prob-card reveal">
                <div className="prob-ico"><svg className="ico" viewBox="0 0 24 24"><path d="M17 2l4 4-4 4" /><path d="M3 12v-2a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 12v2a4 4 0 0 1-4 4H3" /></svg></div>
                <div>
                  <h3>Du copier-coller sans fin depuis d&apos;anciens dossiers</h3>
                  <p>Vous reprenez les mêmes sections, les adaptez à chaque nouveau marché, reformatez… un travail répétitif qui n&apos;apporte aucune valeur ajoutée à votre offre.</p>
                </div>
              </div>
              <div className="prob-card reveal">
                <div className="prob-ico"><svg className="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l4 2" /></svg></div>
                <div>
                  <h3>Des délais serrés et une pression constante</h3>
                  <p>Les délais de réponse sont souvent courts (2 à 3 semaines). Difficile de répondre à toutes les opportunités avec les ressources d&apos;une PME.</p>
                </div>
              </div>
              <div className="prob-card reveal">
                <div className="prob-ico"><svg className="ico" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8" /><path d="M21 3h-6" /><path d="M21 3v6" /></svg></div>
                <div>
                  <h3>Un dossier mal rédigé peut faire perdre le marché</h3>
                  <p>La qualité de la rédaction compte autant que le prix. Un mémoire incomplet ou peu convaincant peut éliminer votre offre dès l&apos;analyse des candidatures.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="solution">
          <div className="container">
            <div className="sec-header centered reveal">
              <span className="badge badge-navy">Comment ça marche</span>
              <h2>De l&apos;appel d&apos;offres au mémoire technique finalisé</h2>
              <p>MemoBTP analyse le CCTP de votre dossier et génère un mémoire technique adapté à votre entreprise et aux exigences du marché.</p>
            </div>
          </div>
          <CctpToMemoireScene />
        </section>

        <section id="avantages">
          <div className="container">
            <div className="sec-header centered reveal">
              <span className="badge badge-navy">Les bénéfices</span>
              <h2>Ce que MemoBTP change concrètement pour votre PME</h2>
              <p>Trois changements concrets dans la façon dont votre équipe prépare ses réponses aux appels d&apos;offres.</p>
            </div>
            <div className="benefits-grid stagger">
              <div className="bene-card primary reveal">
                <div className="bene-ico-wrap"><svg className="ico" viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg></div>
                <h3>Gain de temps considérable</h3>
                <p>Ce qui mobilisait 1 à 3 jours de rédaction laisse place à un processus structuré, sans ressaisie ni copier-coller. De quoi répondre à davantage d&apos;appels d&apos;offres sans alourdir votre charge de travail.</p>
              </div>
              <div className="bene-card reveal">
                <div className="bene-ico-wrap"><svg className="ico" viewBox="0 0 24 24"><path d="M12 3l2.5 5.5L20 9l-4.2 3.8L17 19l-5-3-5 3 1.2-6.2L4 9l5.5-.5z" /></svg></div>
                <h3>Meilleure qualité des dossiers</h3>
                <p>Des mémoires structurés et argumentés, adaptés aux critères de notation de chaque marché — avec le même niveau d&apos;exigence qu&apos;un bureau d&apos;études spécialisé.</p>
              </div>
              <div className="bene-card reveal">
                <div className="bene-ico-wrap"><svg className="ico" viewBox="0 0 24 24"><path d="M17 2l4 4-4 4" /><path d="M3 12v-2a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 12v2a4 4 0 0 1-4 4H3" /></svg></div>
                <h3>Réutilisation intelligente</h3>
                <p>Votre bibliothèque de références et de moyens s&apos;enrichit à chaque dossier. Chaque nouveau mémoire est encore plus rapide et pertinent à produire.</p>
              </div>
            </div>

            <div className="stats-row stagger">
              <div className="stat-tile reveal">
                <div className="stat-value" id="stat-pages">0</div>
                <p className="stat-label">pages qu&apos;un mémoire technique peut compter, du sommaire à la dernière annexe</p>
              </div>
              <div className="stat-tile reveal">
                <div className="stat-value" id="stat-jours">0</div>
                <p className="stat-label">de rédaction manuelle sur les dossiers les plus complexes, remplacés par un contenu déjà structuré</p>
              </div>
              <div className="stat-tile reveal">
                <div className="stat-value" id="stat-semaines">0</div>
                <p className="stat-label">de délai moyen pour répondre à un marché public</p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq">
          <div className="container">
            <div className="sec-header centered reveal">
              <span className="badge badge-navy">Questions fréquentes</span>
              <h2>Tout savoir sur le mémoire technique et la réponse aux appels d&apos;offres BTP</h2>
            </div>
            <div className="faq-list stagger">
              <details className="faq-item reveal">
                <summary><h3>Qu&apos;est-ce qu&apos;un CCTP&nbsp;?</h3><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></summary>
                <p className="faq-answer">Le CCTP (Cahier des Clauses Techniques Particulières) est le document d&apos;un appel d&apos;offres qui décrit précisément les exigences techniques du marché : nature des travaux, matériaux, normes à respecter, contraintes de chantier. C&apos;est la pièce de référence à partir de laquelle une entreprise du BTP construit sa réponse technique.</p>
              </details>
              <details className="faq-item reveal">
                <summary><h3>Qu&apos;est-ce qu&apos;un mémoire technique dans un appel d&apos;offres BTP&nbsp;?</h3><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></summary>
                <p className="faq-answer">Le mémoire technique est le document par lequel une entreprise démontre à l&apos;acheteur public qu&apos;elle est capable de réaliser les travaux décrits dans le CCTP : moyens humains et matériels, méthodologie, références de chantiers similaires, mesures qualité, sécurité et environnement. Avec le prix, c&apos;est l&apos;un des critères qui déterminent l&apos;attribution du marché.</p>
              </details>
              <details className="faq-item reveal">
                <summary><h3>Comment répondre à un appel d&apos;offres public dans le BTP&nbsp;?</h3><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></summary>
                <p className="faq-answer">Répondre à un appel d&apos;offres BTP suppose de récupérer le dossier de consultation des entreprises (DCE), d&apos;analyser le CCTP et le règlement de consultation, puis de constituer un dossier administratif (Kbis, attestations, DC1/DC2 ou DUME) et un mémoire technique adapté aux critères de notation annoncés. MemoBTP se concentre sur cette dernière étape, la plus chronophage.</p>
              </details>
              <details className="faq-item reveal">
                <summary><h3>Combien de temps prend la rédaction d&apos;un mémoire technique&nbsp;?</h3><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></summary>
                <p className="faq-answer">En moyenne, la rédaction manuelle d&apos;un mémoire technique demande entre 1 et 3 jours de travail selon la complexité du lot et le nombre de pages exigées. Avec MemoBTP, il ne s&apos;agit plus de partir d&apos;une page blanche : le contenu se structure à partir de votre profil et des exigences du CCTP, l&apos;entreprise gardant la main pour relire et ajuster le document avant dépôt.</p>
              </details>
              <details className="faq-item reveal">
                <summary><h3>MemoBTP remplace-t-il un bureau d&apos;études ou un rédacteur technique&nbsp;?</h3><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></summary>
                <p className="faq-answer">Non. MemoBTP est un outil d&apos;aide à la rédaction : il structure et pré-rédige le mémoire technique à partir de vos données réelles (moyens, références, certifications) et des exigences du CCTP. La validation finale et les choix stratégiques de réponse restent entre les mains de votre entreprise.</p>
              </details>
              <details className="faq-item reveal">
                <summary><h3>Mes données d&apos;entreprise sont-elles sécurisées avec MemoBTP&nbsp;?</h3><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></summary>
                <p className="faq-answer">Oui. Les données saisies (profil d&apos;entreprise, références, informations de contact) sont hébergées sur une infrastructure européenne et ne sont ni revendues ni partagées avec des tiers. Vous restez propriétaire de vos données à tout moment.</p>
              </details>
            </div>
          </div>
        </section>

        <section id="inscription">
          <div className="hero-grid-bg" />
          <div className="container">
            <div className="form-card reveal">
              <div className="form-card-header">
                <span className="badge badge-accent"><span className="badge-dot" />Accès anticipé ouvert</span>
                <h2>Rejoignez la liste d&apos;attente dès maintenant</h2>
                <p>Soyez parmi les premiers à accéder à MemoBTP. Tarif early access garanti pour les premiers inscrits. Aucun engagement.</p>
              </div>

              {!success && (
                <div id="form-body">
                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="f-nom">Nom complet <span>*</span></label>
                      <input ref={nomRef} type="text" id="f-nom" placeholder="Jean Dupont" autoComplete="name" className={fieldErrors.nom ? 'error' : ''} />
                    </div>
                    <div className="field">
                      <label htmlFor="f-entreprise">Entreprise <span>*</span></label>
                      <input ref={entrepriseRef} type="text" id="f-entreprise" placeholder="Dupont BTP SAS" autoComplete="organization" className={fieldErrors.entreprise ? 'error' : ''} />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="f-email">Email professionnel <span>*</span></label>
                    <input ref={emailRef} type="email" id="f-email" placeholder="jean@dupont-btp.fr" autoComplete="email" className={fieldErrors.email ? 'error' : ''} />
                  </div>
                  <div className="field">
                    <label htmlFor="f-employes">Nombre d&apos;employés <span>*</span></label>
                    <select ref={employesRef} id="f-employes" defaultValue="" className={fieldErrors.employes ? 'error' : ''}>
                      <option value="">Sélectionnez une tranche…</option>
                      <option value="1-5">1 à 5 employés</option>
                      <option value="6-20">6 à 20 employés</option>
                      <option value="21-50">21 à 50 employés</option>
                      <option value="51-200">51 à 200 employés</option>
                      <option value="200+">Plus de 200 employés</option>
                    </select>
                  </div>

                  {/* Honeypot anti-bot : champ invisible, ne jamais remplir */}
                  <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
                    <label htmlFor="website">Ne pas remplir</label>
                    <input ref={websiteRef} type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="turnstile-wrap">
                    <div ref={turnstileRef} />
                  </div>

                  {showError && <div className="form-error-msg">{errorMsg}</div>}

                  <button className="form-submit-btn" id="submit-btn" type="button" disabled={submitting} onClick={submitInscription}>
                    <span id="btn-label" style={{ display: submitting ? 'none' : 'inline' }}>Rejoindre la liste d&apos;attente →</span>
                    <div className="spinner" id="btn-spinner" style={{ display: submitting ? 'block' : 'none' }} />
                  </button>
                  <p className="form-note">🔒 Vos données sont protégées et ne seront jamais revendues · Sans engagement</p>
                </div>
              )}

              {success && (
                <div className="form-success" id="form-success">
                  <svg className="success-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg>
                  <h3>Votre inscription est confirmée !</h3>
                  <p>Merci ! Vous serez parmi les premiers à recevoir votre accès à MemoBTP.<br />Nous vous contacterons par email dès le lancement.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <a className="logo" href="#hero">Memo<em>BTP</em></a>
          <span className="footer-copy">© 2026 MemoBTP · Produit en cours de développement</span>
          <div className="footer-right">
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
            <a href="/cdn-cgi/l/email-protection#adcec2c3d9ccced9edc0c8c0c2cfd9dd83cbdf">Contact</a>
          </div>
        </div>
        {/* Modèles 3D crédités ici si/quand le parcours scroll 3D est réactivé (voir app/components/AoJourney.tsx) */}
      </footer>
    </>
  );
}
