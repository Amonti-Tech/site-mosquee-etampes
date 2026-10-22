import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import EventCard from '@/components/public/EventCard';
import { Calendar, Archive } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Événements & Agenda — Mosquée d'Etampes Centre",
  description: "Agenda des rencontres, conférences et événements à la Mosquée d'Etampes Centre."
};

export default async function EventsPage() {
  const now = new Date();

  // Événements futurs
  const upcomingEvents = await prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      startDate: { gte: now }
    },
    orderBy: { startDate: 'asc' }
  });

  // Événements passés (archivés automatiquement selon la date)
  const pastEvents = await prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      startDate: { lt: now }
    },
    orderBy: { startDate: 'desc' },
    take: 6
  });

  return (
    <div className="section section-cream">
      <div className="container">
        <header className="page-header">
          <span className="section-subtitle">Agenda &amp; Rencontres</span>
          <h1 className="page-title">Événements de la Mosquée</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem' }}>
            Consultez les dates des prochaines conférences, réunions communautaires et temps forts de notre mosquée.
          </p>
        </header>

        {/* Section Événements à venir */}
        <section aria-labelledby="titre-a-venir" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <Calendar size={24} color="var(--color-primary-blue)" aria-hidden="true" />
            <h2 id="titre-a-venir" style={{ marginBottom: 0, fontSize: '1.75rem' }}>
              Prochains rendez-vous
            </h2>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="cards-grid">
              {upcomingEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} isPast={false} />
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '2.5rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                border: '1px solid var(--color-border)'
              }}
            >
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                Aucun événement public n'est programmé pour les prochains jours.
              </p>
            </div>
          )}
        </section>

        {/* Section Événements passés (Archives automatiques) */}
        {pastEvents.length > 0 && (
          <section aria-labelledby="titre-archives" style={{ paddingTop: '2rem', borderTop: '2px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <Archive size={24} color="var(--color-gold)" aria-hidden="true" />
              <h2 id="titre-archives" style={{ marginBottom: 0, fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>
                Événements passés (Archives)
              </h2>
            </div>

            <div className="cards-grid">
              {pastEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} isPast={true} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
