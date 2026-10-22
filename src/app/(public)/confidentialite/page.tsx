import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Politique de confidentialité — Mosquée d'Etampes Centre",
  description: "Politique de confidentialité, cookies et protection des données personnelles de la Mosquée d'Etampes Centre."
};

export default async function ConfidentialitePage() {
  const page = await prisma.pageContent.findUnique({
    where: { key: 'confidentialite' }
  });

  return (
    <article className="section section-cream" aria-labelledby="privacy-title">
      <div className="container" style={{ maxWidth: '860px' }}>
        <header className="page-header">
          <span className="section-subtitle">Protection de vos données</span>
          <h1 id="privacy-title" className="page-title">{page?.title || "Politique de Confidentialité"}</h1>
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
