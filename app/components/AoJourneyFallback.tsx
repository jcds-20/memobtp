import { JOURNEY_STEPS } from './journeySteps';

export default function AoJourneyFallback() {
  return (
    <section id="parcours" className="journey-fallback">
      <div className="container">
        <div className="sec-header centered reveal">
          <span className="badge badge-navy">Le parcours d&apos;un appel d&apos;offres</span>
          <h2 style={{ color: '#fff' }}>De la publication du marché au dossier déposé</h2>
        </div>
        <div className="journey-fallback-list stagger">
          {JOURNEY_STEPS.map((step, i) => (
            <div className="journey-fallback-item reveal" key={step.title}>
              <div className="journey-fallback-num">{i + 1}</div>
              <div>
                <h3>{step.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
