import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import {
  PlusCircle,
  Calendar,
  FileEdit,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const user = await requireAuth();

  // Métriques clés
  const [totalPublishedNews, totalDraftNews, upcomingEventsCount, latestDrafts, latestPublished] = await Promise.all([
    prisma.news.count({ where: { status: 'PUBLISHED' } }),
    prisma.news.count({ where: { status: 'DRAFT' } }),
    prisma.event.count({ where: { status: 'PUBLISHED', startDate: { gte: new Date() } } }),
    prisma.news.findMany({
      where: { status: 'DRAFT' },
      orderBy: { updatedAt: 'desc' },
      take: 4,
      include: { category: true }
    }),
    prisma.news.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      include: { category: true }
    })
  ]);

  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* En-tête de bienvenue */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Tableau de bord
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Bienvenue, <strong>{user.name}</strong>. Gérez simplement les publications et les annonces de la Mosquée d'Etampes Centre.
        </p>
      </div>

      {/* Raccourcis d'actions rapides (§7) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <Link
          href="/admin/actualites/nouveau"
          className="card"
          style={{
            padding: '1.25rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderLeft: '4px solid var(--color-primary-blue)'
          }}
        >
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(27, 31, 96, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--color-primary-blue)' }}>
            <PlusCircle size={24} aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-primary-blue)', fontSize: '1rem' }}>Nouvelle actualité</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Rédiger une annonce</div>
          </div>
        </Link>

        <Link
          href="/admin/evenements/nouveau"
          className="card"
          style={{
            padding: '1.25rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderLeft: '4px solid var(--color-gold)'
          }}
        >
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(189, 122, 55, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--color-gold)' }}>
            <Calendar size={24} aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-primary-blue)', fontSize: '1rem' }}>Nouvel événement</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Conférence ou rencontre</div>
          </div>
        </Link>

        <Link
          href="/admin/pages"
          className="card"
          style={{
            padding: '1.25rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderLeft: '4px solid var(--color-terracotta)'
          }}
        >
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(169, 96, 66, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--color-terracotta)' }}>
            <FileEdit size={24} aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-primary-blue)', fontSize: '1rem' }}>Modifier une page</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Histoire ou infos pratiques</div>
          </div>
        </Link>

        <Link
          href="/admin/medias"
          className="card"
          style={{
            padding: '1.25rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderLeft: '4px solid #4caf50'
          }}
        >
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(76, 175, 80, 0.15)', borderRadius: 'var(--radius-sm)', color: '#2e7d32' }}>
            <ImageIcon size={24} aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-primary-blue)', fontSize: '1rem' }}>Médiathèque</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Téléverser des photos</div>
          </div>
        </Link>
      </div>

      {/* Cartes d'indicateurs de synthèse */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Actualités publiées</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '0.25rem' }}>
            {totalPublishedNews}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Brouillons en attente</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-gold)', marginTop: '0.25rem' }}>
            {totalDraftNews}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Événements à venir</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '0.25rem' }}>
            {upcomingEventsCount}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Bandeau d'alerte</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>
            {settings?.announcementActive ? (
              <span style={{ color: '#2e7d32', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={16} /> Actif sur l'accueil
              </span>
            ) : (
              <span style={{ color: 'var(--color-text-muted)' }}>Inactif</span>
            )}
          </div>
        </div>
      </div>

      {/* Colonnes de listes : Brouillons & Récents */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Brouillons */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 0 }}>Brouillons à finaliser</h2>
            <Link href="/admin/actualites?statut=DRAFT" style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)' }}>
              Voir tout
            </Link>
          </div>

          {latestDrafts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {latestDrafts.map((d) => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-primary-blue)' }}>{d.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{d.category.name}</div>
                  </div>
                  <Link href={`/admin/actualites/${d.id}`} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', minHeight: 'auto' }}>
                    Éditer
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
              Aucun brouillon en attente. Tout est publié !
            </p>
          )}
        </div>

        {/* Dernières actualités publiées */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 0 }}>Actualités publiées récemment</h2>
            <Link href="/admin/actualites" style={{ fontSize: '0.85rem', color: 'var(--color-primary-blue)' }}>
              Toutes les actualités
            </Link>
          </div>

          {latestPublished.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {latestPublished.map((p) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-primary-blue)' }}>{p.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Publié le {new Intl.DateTimeFormat('fr-FR').format(new Date(p.publishedAt))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/actualites/${p.slug}`} target="_blank" className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', minHeight: 'auto' }} aria-label="Voir sur le site">
                      <Eye size={14} />
                    </Link>
                    <Link href={`/admin/actualites/${p.id}`} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', minHeight: 'auto' }}>
                      Éditer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
              Aucun article publié récemment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
