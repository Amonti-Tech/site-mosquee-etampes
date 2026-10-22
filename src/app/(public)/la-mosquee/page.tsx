import React from 'react';
import type { Metadata } from 'next';
import { Building2, Compass, Shield, Users } from 'lucide-react';
import { getPublicPageContent, getPublicSettings } from '@/lib/public-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageContent('la-mosquee');

  return {
    title: page?.metaTitle || "La Mosquée — Mosquée d'Etampes Centre",
    description: page?.metaDescription || "Histoire, mission et valeurs de la Mosquée d'Etampes Centre."
  };
}

export default async function MosqueePage() {
  const page = await getPublicPageContent('la-mosquee');
  const settings = await getPublicSettings();

  const officialName = settings?.officialName || "Mosquée d'Etampes Centre";
  const interiorImage = settings?.interiorPhotoUrl || '/images/provisoires/interieur-mosquee.jpg';

  return (
    <article className="section section-cream" aria-labelledby="page-title">
      <div className="container">
        {/* En-tête de page */}
        <header className="page-header">
          <span className="section-subtitle">Notre Institution</span>
          <h1 id="page-title" className="page-title">{page?.title || "La Mosquée d'Etampes Centre"}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
            Un lieu de culte et de sérénité au service des fidèles et des citoyens d'Étampes.
          </p>
        </header>

        {/* Grand visuel intérieur */}
        <div
          style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '3rem',
            border: '2px solid var(--color-border)',
            position: 'relative'
          }}
        >
          <img
            src={interiorImage}
            alt="Intérieur de la salle de prière"
            style={{ width: '100%', maxHeight: '480px', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'rgba(27, 31, 96, 0.85)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem'
            }}
          >
            Visuel architectural provisoire
          </div>
        </div>

        {/* Piliers / Valeurs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Building2 size={24} color="var(--color-gold)" aria-hidden="true" />
              <h2 style={{ fontSize: '1.25rem', marginBottom: 0 }}>Culte &amp; Prière</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              Accueillir les fidèles pour les cinq prières quotidiennes et la prière collective du vendredi dans la dignité et le calme.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Compass size={24} color="var(--color-gold)" aria-hidden="true" />
              <h2 style={{ fontSize: '1.25rem', marginBottom: 0 }}>Éducation</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              Transmission des savoirs, enseignement de la langue et soutien éducatif pour les jeunes générations.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Users size={24} color="var(--color-gold)" aria-hidden="true" />
              <h2 style={{ fontSize: '1.25rem', marginBottom: 0 }}>Fraternité &amp; Entraide</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              Actions de solidarité locale, écoute, partage et distribution de denrées pour les plus fragiles.
            </p>
          </div>
        </div>

        {/* Contenu principal de la page (issu de la base de données) */}
        <div
          style={{
            backgroundColor: 'var(--color-white)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          {page?.content ? (
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <p>Contenu en cours de validation par la mosquée.</p>
          )}
        </div>
      </div>
    </article>
  );
}
