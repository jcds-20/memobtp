import type { Metadata, Viewport } from 'next';
import { Public_Sans } from 'next/font/google';
import './globals.css';

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0b1d47',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://memobtp.fr'),
  title: "Mémoire technique BTP par IA : réponse aux appels d'offres | MemoBTP",
  description:
    "MemoBTP génère votre mémoire technique à partir du CCTP de l'appel d'offres : import du dossier, profil d'entreprise, export PDF/Word. Accès anticipé pour les PME du BTP.",
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'MemoBTP',
    locale: 'fr_FR',
    url: 'https://memobtp.fr/',
    title: "Mémoire technique BTP par IA : réponse aux appels d'offres",
    description:
      "Générez un mémoire technique structuré à partir du CCTP de votre appel d'offres, sans repartir d'une page blanche. Rejoignez l'accès anticipé MemoBTP.",
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary',
    title: "Mémoire technique BTP par IA : réponse aux appels d'offres",
    description:
      "Générez un mémoire technique structuré à partir du CCTP de votre appel d'offres, sans repartir d'une page blanche.",
    images: ['/logo.png'],
  },
};

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MemoBTP',
  url: 'https://memobtp.fr/',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    "MemoBTP génère automatiquement des mémoires techniques pour les entreprises du BTP qui répondent à des appels d'offres publics, à partir du CCTP et du profil de l'entreprise.",
  publisher: {
    '@type': 'Organization',
    name: 'MemoBTP',
    url: 'https://memobtp.fr/',
  },
  inLanguage: 'fr-FR',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Qu'est-ce qu'un CCTP ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Le CCTP (Cahier des Clauses Techniques Particulières) est le document d'un appel d'offres qui décrit précisément les exigences techniques du marché : nature des travaux, matériaux, normes à respecter, contraintes de chantier. C'est la pièce de référence à partir de laquelle une entreprise du BTP construit sa réponse technique.",
      },
    },
    {
      '@type': 'Question',
      name: "Qu'est-ce qu'un mémoire technique dans un appel d'offres BTP ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Le mémoire technique est le document par lequel une entreprise démontre à l'acheteur public qu'elle est capable de réaliser les travaux décrits dans le CCTP : moyens humains et matériels, méthodologie, références de chantiers similaires, mesures qualité, sécurité et environnement. Avec le prix, c'est l'un des critères qui déterminent l'attribution du marché.",
      },
    },
    {
      '@type': 'Question',
      name: "Comment répondre à un appel d'offres public dans le BTP ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Répondre à un appel d'offres BTP suppose de récupérer le dossier de consultation des entreprises (DCE), d'analyser le CCTP et le règlement de consultation, puis de constituer un dossier administratif (Kbis, attestations, DC1/DC2 ou DUME) et un mémoire technique adapté aux critères de notation annoncés. MemoBTP se concentre sur cette dernière étape, la plus chronophage.",
      },
    },
    {
      '@type': 'Question',
      name: "Combien de temps prend la rédaction d'un mémoire technique ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "En moyenne, la rédaction manuelle d'un mémoire technique demande entre 1 et 3 jours de travail selon la complexité du lot et le nombre de pages exigées. Avec MemoBTP, il ne s'agit plus de partir d'une page blanche : le contenu se structure à partir de votre profil et des exigences du CCTP, l'entreprise gardant la main pour relire et ajuster le document avant dépôt.",
      },
    },
    {
      '@type': 'Question',
      name: 'MemoBTP remplace-t-il un bureau d\'études ou un rédacteur technique ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Non. MemoBTP est un outil d'aide à la rédaction : il structure et pré-rédige le mémoire technique à partir de vos données réelles (moyens, références, certifications) et des exigences du CCTP. La validation finale et les choix stratégiques de réponse restent entre les mains de votre entreprise.",
      },
    },
    {
      '@type': 'Question',
      name: "Mes données d'entreprise sont-elles sécurisées avec MemoBTP ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Les données saisies (profil d'entreprise, références, informations de contact) sont hébergées sur une infrastructure européenne et ne sont ni revendues ni partagées avec des tiers. Vous restez propriétaire de vos données à tout moment.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={publicSans.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
