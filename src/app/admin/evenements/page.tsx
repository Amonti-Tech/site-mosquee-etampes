import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import {
  PlusCircle,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Archive as ArchiveIcon,
  RotateCcw,
  Star
} from 'lucide-react';
import { unpublishEventAction, deleteEventAction } from './actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    filtre?: string;
  }>;
}

export default async function AdminEvenementsPage({ searchParams }: PageProps) {
  const user = await requireAuth();
  const isAdmin = user.role === 'ADMIN';

  const params = await searchParams;
  const filter = params.filtre || 'UPCOMING';

  const now = new Date();
  let whereClause = {};

  if (filter === 'UPCOMING') {
    whereClause = { status: 'PUBLISHED', startDate: { gte: now } };
  } else if (filter === 'PAST') {
    whereClause = { status: 'PUBLISHED', startDate: { lt: now } };
  } else if (filter === 'DRAFT') {
    whereClause = { status: 'DRAFT' };
  }

  const [events, countUpcoming, countPast, countDraft, countAll] = await Promise.all([
    prisma.event.findMany({
      where: whereClause,
      orderBy: { startDate: filter === 'PAST' ? 'desc' : 'asc' }
    }),
    prisma.event.count({ where: { status: 'PUBLISHED', startDate: { gte: now } } }),
    prisma.event.count({ where: { status: 'PUBLISHED', startDate: { lt: now } } }),
    prisma.event.count({ where: { status: 'DRAFT' } }),
    prisma.event.count()
  ]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
            Gestion des Événements
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Planifiez les conférences, prières exceptionnelles et rencontres communautaires.
          </p>
        </div>

        <Link href="/admin/evenements/nouveau" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}>
          <PlusCircle size={18} />
          <span>Nouvel événement</span>
        </Link>
      </div>

      {/* Filtres par onglets */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Link
          href="/admin/evenements?filtre=UPCOMING"
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            backgroundColor: filter === 'UPCOMING' ? 'var(--color-primary-blue)' : '#f0eef5',
            color: filter === 'UPCOMING' ? '#fff' : 'var(--color-text-main)'
          }}
        >
          À venir ({countUpcoming})
        </Link>

        <Link
          href="/admin/evenements?filtre=PAST"
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            backgroundColor: filter === 'PAST' ? 'var(--color-terracotta)' : '#f0eef5',
            color: filter === 'PAST' ? '#fff' : 'var(--color-text-main)'
          }}
        >
          Passés / Archivés auto ({countPast})
        </Link>

        <Link
          href="/admin/evenements?filtre=DRAFT"
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            backgroundColor: filter === 'DRAFT' ? 'var(--color-gold)' : '#f0eef5',
            color: filter === 'DRAFT' ? '#121216' : 'var(--color-text-main)'
          }}
        >
          Brouillons ({countDraft})
        </Link>

        <Link
          href="/admin/evenements?filtre=ALL"
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            backgroundColor: filter === 'ALL' ? '#616161' : '#f0eef5',
            color: filter === 'ALL' ? '#fff' : 'var(--color-text-main)'
          }}
        >
          Tous ({countAll})
        </Link>
      </div>

      {/* Tableau des événements */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {events.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f6f5f8', borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Événement</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Date &amp; Heure</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Lieu</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Statut</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '1rem', minWidth: '260px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {evt.imageUrl ? (
                          <img
                            src={evt.imageUrl}
                            alt={evt.imageAlt || evt.title}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, backgroundColor: '#eee' }}
                          />
                        ) : (
                          <div style={{ width: '50px', height: '50px', backgroundColor: '#e2dfeb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-blue)', flexShrink: 0 }}>
                            <Calendar size={22} />
                          </div>
                        )}
                        <div>
                          <Link href={`/admin/evenements/${evt.id}`} style={{ fontWeight: 600, color: 'var(--color-primary-blue)', textDecoration: 'none' }}>
                            {evt.title}
                          </Link>
                          {evt.showOnHome && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700 }}>
                              <Star size={13} fill="var(--color-gold)" /> Accueil
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--color-text-main)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      <strong>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(evt.startDate))}</strong>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      {evt.location}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {evt.status === 'PUBLISHED' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2e7d32', fontWeight: 600, fontSize: '0.85rem' }}>
                          <CheckCircle size={15} /> Publié
                        </span>
                      )}
                      {evt.status === 'DRAFT' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#b78103', fontWeight: 600, fontSize: '0.85rem' }}>
                          <Clock size={15} /> Brouillon
                        </span>
                      )}
                      {evt.status === 'ARCHIVED' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#616161', fontWeight: 600, fontSize: '0.85rem' }}>
                          <ArchiveIcon size={15} /> Archivé
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                        <Link
                          href={`/admin/evenements/${evt.id}`}
                          className="btn-outline"
                          title="Modifier l'événement"
                          style={{ padding: '0.35rem 0.55rem', minHeight: 'auto' }}
                        >
                          <Edit size={15} />
                        </Link>

                        {evt.status === 'PUBLISHED' && (
                          <form action={async () => {
                            'use server';
                            await unpublishEventAction(evt.id);
                          }}>
                            <button
                              type="submit"
                              title="Dépublier (remettre en brouillon)"
                              style={{ padding: '0.35rem 0.55rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: '#b78103' }}
                            >
                              <RotateCcw size={15} />
                            </button>
                          </form>
                        )}

                        {isAdmin && (
                          <form action={async () => {
                            'use server';
                            await deleteEventAction(evt.id);
                          }}>
                            <button
                              type="submit"
                              title="Supprimer définitivement (Admin)"
                              style={{ padding: '0.35rem 0.55rem', background: '#fff', border: '1px solid #ffcdd2', borderRadius: '4px', cursor: 'pointer', color: '#d32f2f' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
              Aucun événement dans cette section.
            </p>
            <Link href="/admin/evenements/nouveau" className="btn btn-primary" style={{ minHeight: 'auto', padding: '0.6rem 1.25rem' }}>
              Créer un nouvel événement
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
