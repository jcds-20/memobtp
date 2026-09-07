export type JourneyStep = {
  badge: string;
  title: string;
  start: number;
  end: number;
};

// `start`/`end` are scroll-progress fractions (0-1) during which each
// narrative beat is the active one — matched to the camera path in
// app/components/journey/path.ts, not an even split.
export const JOURNEY_STEPS: JourneyStep[] = [
  { badge: 'Étape 1', title: "Un appel d'offres publié", start: 0, end: 0.16 },
  { badge: 'Étape 2', title: '80 pages de mémoire technique à rédiger', start: 0.16, end: 0.32 },
  { badge: 'Étape 3', title: '1 à 3 jours de travail manuel', start: 0.32, end: 0.52 },
  { badge: 'Étape 4', title: 'Le marché se joue sur la qualité du dossier', start: 0.52, end: 0.78 },
  { badge: 'Étape 5', title: 'Le mémoire technique est prêt à déposer', start: 0.78, end: 1.001 },
];

export function stepIndexForProgress(progress: number): number {
  for (let i = 0; i < JOURNEY_STEPS.length; i++) {
    if (progress >= JOURNEY_STEPS[i].start && progress < JOURNEY_STEPS[i].end) return i;
  }
  return JOURNEY_STEPS.length - 1;
}
