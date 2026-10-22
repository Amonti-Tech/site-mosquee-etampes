import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  settings?: {
    officialName: string;
    address: string;
    whatsapp: string;
    email?: string | null;
  };
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const officialName = settings?.officialName || "Mosquée d'Etampes Centre";
  const address = settings?.address || "2 avenue du 8 mai 1945, 91150 Étampes";
  const whatsapp = settings?.whatsapp || "+33 7 49 60 90 62";

  // Formatage du numéro WhatsApp pour l'URL wa.me (sans espaces ni signes +)
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Colonne 1 : Identité & Coordonnées */}
          <div className="footer-brand">
            <div className="footer-logo-badge">
              <img
                src="/logo-mosquee-opaque.svg"
                alt="Logo de la Mosquée d'Etampes Centre"
                className="footer-logo"
                width={52}
                height={64}
              />
            </div>
            <div>
              <h2 className="footer-title">{officialName}</h2>
              <p style={{ color: '#d5cfe0', fontSize: '0.95rem' }}>
                Lieu de culte, de paix, de savoir et de solidarité fraternelle pour la communauté musulmane d'Étampes et ses environs.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <MapPin size={16} color="var(--color-gold)" aria-hidden="true" />
                <span>{address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <Phone size={16} color="var(--color-gold)" aria-hidden="true" />
                <span>WhatsApp : {whatsapp}</span>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ fontSize: '0.875rem', padding: '0.6rem 1.2rem', minHeight: '44px' }}
                aria-label="Nous contacter directement sur WhatsApp (ouvre une nouvelle fenêtre)"
              >
                <MessageSquare size={16} aria-hidden="true" />
                <span>Contacter sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div className="footer-col">
            <h3>Navigation</h3>
            <ul className="footer-links">
              <li><Link href="/">Accueil &amp; Horaires</Link></li>
              <li><Link href="/la-mosquee">La mosquée</Link></li>
              <li><Link href="/actualites">Actualités</Link></li>
              <li><Link href="/evenements">Événements</Link></li>
              <li><Link href="/activites">Activités &amp; Cours</Link></li>
              <li><Link href="/informations-pratiques">Informations pratiques</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Informations légales & Conformité */}
          <div className="footer-col">
            <h3>Conformité &amp; Informations</h3>
            <ul className="footer-links">
              <li><Link href="/mentions-legales">Mentions légales</Link></li>
              <li><Link href="/confidentialite">Politique de confidentialité</Link></li>
              <li><Link href="/informations-pratiques#acces">Plan d'accès &amp; Transports</Link></li>
              <li>
                <a
                  href="https://mawaqit.net/fr/w/centre-cultuel-mohamed-6-etampes"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Portail Mawaqit (ouvre un nouvel onglet)"
                >
                  Portail Mawaqit
                </a>
              </li>
              <li>
                <Link href="/admin" style={{ opacity: 0.6, fontSize: '0.85rem' }}>
                  Espace Bénévoles
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne inférieure de copyright */}
        <div className="footer-bottom">
          <p>
            &copy; {currentYear} {officialName}. Tous droits réservés.
          </p>
          <p style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>Site sobre, sécurisé et accessible aux personnes en situation de handicap (WCAG 2.1 AA)</span>
            <ShieldCheck size={16} color="var(--color-gold)" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
