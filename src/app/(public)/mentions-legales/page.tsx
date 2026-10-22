import React from 'react';
import type { Metadata } from 'next';
import { getPublicPageContent } from '@/lib/public-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Mentions légales — Mosquée d'Etampes Centre",
  description: "Mentions légales et informations réglementaires du site de la Mosquée d'Etampes Centre."
};

export default async function MentionsLegalesPage() {
  const page = await getPublicPageContent('mentions-legales');

  return (
    <article className="section section-cream" aria-labelledby="mentions-title">
      <div className="container" style={{ maxWidth: '860px' }}>
        <header className="page-header">
          <span className="section-subtitle">Informations Réglementaires</span>
          <h1 id="mentions-title" className="page-title">{page?.title || "Mentions Légales"}</h1>
        </header>

        <div
          style={{
            backgroundColor: 'var(--color-white)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            lineHeight: '1.8'
          }}
        >
          {page?.content ? (
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : (
            <p>Contenu en cours de rédaction.</p>
          )}
        </div>
      </div>
    </article>
  );
}
