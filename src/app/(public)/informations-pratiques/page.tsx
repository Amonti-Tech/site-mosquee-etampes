import React from 'react';
import type { Metadata } from 'next';
import { MapPin, Phone, Clock, Train, Car, Navigation, ExternalLink, MessageSquare } from 'lucide-react';
import { getPublicPageContent, getPublicSettings } from '@/lib/public-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Informations pratiques & Accès — Mosquée d'Etampes Centre",
  description: "Adresse, horaires d'ouverture, accès transports et contacts de la Mosquée d'Etampes Centre."
};

export default async function PracticalInfoPage() {
  const page = await getPublicPageContent('informations-pratiques');
  const settings = await getPublicSettings();

  const officialName = settings?.officialName || "Mosquée d'Etampes Centre";
  const address = settings?.address || "2 avenue du 8 mai 1945, 91150 Étampes";
  const whatsapp = settings?.whatsapp || "+33 7 49 60 90 62";
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;

  // URL itinéraire externe Google Maps / OpenStreetMap
  const encodedAddress = encodeURIComponent(`${address}, France`);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  const osmUrl = `https://www.openstreetmap.org/search?query=${encodedAddress}`;

  return (
    <article className="section section-cream" aria-labelledby="practical-title">
      <div className="container">
        <header className="page-header">
          <span className="section-subtitle">Nous rendre visite</span>
          <h1 id="practical-title" className="page-title">Informations Pratiques &amp; Accès</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem' }}>
            Retrouvez tous les renseignements utiles pour venir prier ou participer à nos activités.
          </p>
        </header>

        {/* Grille des informations clés */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          {/* Bloc 1 : Coordonnées & Itinéraire */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <MapPin size={28} color="var(--color-primary-blue)" aria-hidden="true" />
              <h2 style={{ fontSize: '1.4rem', marginBottom: 0 }}>Adresse officielle</h2>
            </div>
            <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-primary-blue)', marginBottom: '0.75rem' }}>
              {officialName}
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              {address}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: '0.9rem', padding: '0.6rem 1.1rem' }}
                aria-label="Ouvrir l'itinéraire vers la mosquée dans Google Maps (nouvelle fenêtre)"
              >
                <Navigation size={16} aria-hidden="true" />
                <span>Itinéraire Google Maps</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>

              <a
                href={osmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '0.9rem', padding: '0.6rem 1.1rem' }}
                aria-label="Voir l'emplacement sur OpenStreetMap (nouvelle fenêtre)"
              >
                <span>OpenStreetMap</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                <Phone size={16} color="var(--color-gold)" aria-hidden="true" />
                <span>WhatsApp : <strong>{whatsapp}</strong></span>
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ marginTop: '0.5rem', width: '100%' }}
              >
                <MessageSquare size={16} aria-hidden="true" />
                <span>Écrire sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Bloc 2 : Horaires d'ouverture */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Clock size={28} color="var(--color-gold)" aria-hidden="true" />
              <h2 style={{ fontSize: '1.4rem', marginBottom: 0 }}>Horaires d'ouverture</h2>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
                Prières quotidiennes :
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                La mosquée ouvre ses portes environ 20 minutes avant chaque prière obligatoire (Fajr, Dhuhr, Asr, Maghrib, Isha) et la prière du Vendredi (Jumu'a).
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-white)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--color-border)' }}>
              <p style={{ fontWeight: 600, color: 'var(--color-terracotta)', marginBottom: '0.25rem' }}>
                Horaires d'accueil administratif :
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                <em>[À COMPLÉTER - En attente de confirmation par le bureau de la mosquée]</em>
              </p>
            </div>
          </div>
        </div>

        {/* Moyens d'accès détaillés */}
        <section id="acces" style={{ backgroundColor: 'var(--color-white)', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', maxWidth: '960px', margin: '0 auto 3rem' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>Comment vous rendre à la mosquée</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                <Train size={20} color="var(--color-gold)" aria-hidden="true" />
                <span>En Train / RER C</span>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                Gare d'Étampes (RER C et trains régionaux TER Paris-Austerlitz). La mosquée est ensuite accessible en bus urbain ou à pied (environ 15 minutes).
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                <Car size={20} color="var(--color-gold)" aria-hidden="true" />
                <span>En Voiture</span>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                Accès direct depuis la RN20 (sortie Étampes Centre). Stationnement possible dans les rues avoisinantes dans le strict respect de la tranquillité du voisinage.
              </p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
