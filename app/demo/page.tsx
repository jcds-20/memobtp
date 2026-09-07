import Link from 'next/link';

export default function DemoIndex() {
  return (
    <div className="demo-index">
      <h1>Variantes d&apos;animation — landing MemoBTP</h1>
      <p>
        Exploration locale uniquement (route bloquée en production). Chaque variante applique une direction
        différente sur du contenu réel de la landing, pour comparer avant d&apos;intégrer au site.
      </p>

      <div className="demo-index-group">
        <h3>Variantes seules</h3>
        <div className="demo-list">
          <Link href="/demo/v1" className="demo-card">
            <span className="tag">v1</span>
            <h2>Reveal au scroll</h2>
            <p>Chaque section (Problème, Solution, Avantages) apparaît en fondu + léger décalage vertical à l&apos;entrée dans le viewport. Un seul effet, cohérent partout.</p>
          </Link>
          <Link href="/demo/v2" className="demo-card">
            <span className="tag">v2</span>
            <h2>Compteurs animés</h2>
            <p>Des chiffres factuels du secteur (80 pages, 3 jours, 3 semaines) comptent de 0 à leur valeur finale à l&apos;entrée dans le viewport, easing dégressif.</p>
          </Link>
          <Link href="/demo/v3" className="demo-card">
            <span className="tag">v3</span>
            <h2>Carte animée — CCTP → Mémoire technique</h2>
            <p>Timeline pilotée par le scroll (scrub) : le CCTP entre, tourne, se transforme, laisse place au mémoire technique généré. 5 étapes, style sobre BTP.</p>
          </Link>
          <Link href="/demo/v4" className="demo-card">
            <span className="tag">v4</span>
            <h2>Parallax léger</h2>
            <p>Les formes d&apos;arrière-plan défilent plus lentement que le premier plan pour une sensation de profondeur.</p>
          </Link>
        </div>
      </div>

      <div className="demo-index-group">
        <h3>Combinaisons</h3>
        <div className="demo-list">
          <Link href="/demo/v1-v2" className="demo-card">
            <span className="tag">v1 + v2</span>
            <h2>Reveal + compteurs</h2>
            <p>Sections en reveal, avec les chiffres qui comptent au moment où leur section apparaît.</p>
          </Link>
          <Link href="/demo/v3-v4" className="demo-card">
            <span className="tag">v3 + v4</span>
            <h2>Carte animée + parallax</h2>
            <p>La carte CCTP → Mémoire avec un arrière-plan qui défile plus lentement.</p>
          </Link>
          <Link href="/demo/v1-v3" className="demo-card">
            <span className="tag">v1 + v3</span>
            <h2>Carte en intro + reveal sur le reste</h2>
            <p>La carte animée en ouverture, puis un reveal classique et sobre sur les sections texte qui suivent.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
