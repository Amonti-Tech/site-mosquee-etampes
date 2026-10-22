import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Clock, BookOpen, Heart, Users, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Activités & Enseignements — Mosquée d'Etampes Centre",
  description: "Découvrez les cours, cercles d'études et actions de solidarité de la Mosquée d'Etampes Centre."
};

export default async function ActivitiesPage() {
  const activities = await prisma.activity.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="section section-cream">
      <div className="container">
        <header className="page-header">
          <span className="section-subtitle">Apprentissage &amp; Pôles</span>
          <h1 className="page-title">Nos Activités &amp; Cours</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem' }}>
            La Mosquée d'Etampes Centre propose tout au long de l'année des programmes d'apprentissage, d'accompagnement éducatif et de fraternité pour tous les âges.
          </p>
        </header>

        {activities.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '960px', margin: '0 auto' }}>
            {activities.map((act, index) => (
              <article
                key={act.id}
                className="card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  alignItems: 'center'
                }}
                aria-labelledby={`act-title-${act.id}`}
              >
                <div style={{ height: '100%', minHeight: '260px', position: 'relative' }}>
                  <img
                    src={act.imageUrl || '/images/provisoires/actu-cours.jpg'}
                    alt={act.imageAlt || act.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                    loading="lazy"
                  />
                </div>

                <div className="card-body" style={{ padding: '2.5rem' }}>
                  <span className="badge badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>
                    Pôle {index + 1}
                  </span>
                  <h2 id={`act-title-${act.id}`} style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                    {act.title}
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {act.description}
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.75rem 1.25rem',
                      backgroundColor: 'var(--color-bg-beige)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      color: 'var(--color-primary-blue)',
                      fontSize: '0.95rem'
                    }}
                  >
                    <Clock size={18} color="var(--color-gold)" aria-hidden="true" />
                    <span>{act.schedule}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Aucune activité répertoriée pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
