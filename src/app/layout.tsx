import type { Metadata } from 'next';
import './globals.css';
import { SkipLink } from '@/components/public/SkipLink';

export const metadata: Metadata = {
  title: {
    default: "Mosquée d'Etampes Centre — Horaires de prière & Vie communautaire",
    template: "%s — Mosquée d'Etampes Centre"
  },
  description: "Site officiel de la Mosquée d'Etampes Centre (2 avenue du 8 mai 1945, Étampes) : horaires de prière en direct, enseignements, actualités et vie fraternelle.",
  robots: {
    index: false,
    follow: false
  },
  icons: {
    icon: '/logo-mosquee.svg'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
