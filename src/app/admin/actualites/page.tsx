import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Eye,
  Archive,
  RotateCcw,
  Trash2,
  CheckCircle,
  Clock,
  Archive as ArchiveIcon,
  Star
} from 'lucide-react';
import { unpublishNewsAction, archiveNewsAction, deleteNewsAction } from './actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    statut?: string;
    q?: string;
  }>;
}

export default async function AdminActualitesPage({ searchParams }: PageProps) {
  const user = await requireAuth();
  const isAdmin = user.role === 'ADMIN';

  const params = await searchParams;
  const currentStatus = params.statut || 'ALL';
  const query = params.q?.trim() || '';

  // Filtres Prisma
  const whereClause: {
    status?: string;
    OR?: Array<{ title?: { contains: string }; excerpt?: { contains: string } }>;
  } = {};

  if (currentStatus !== 'ALL') {
    whereClause.status = currentStatus;
  }

  if (query) {
    whereClause.OR = [
      { title: { contains: query } },
      { excerpt: { contains: query } }
    ];
  }

  const [newsList, countAll, countPublished, countDraft, countArchived] = await Promise.all([
    prisma.news.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      include: { category: true, author: true }
    }),
    prisma.news.count(),
    prisma.news.count({ where: { status: 'PUBLISHED' } }),
    prisma.news.count({ where: { status: 'DRAFT' } }),
    prisma.news.count({ where: { status: 'ARCHIVED' } })
  ]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* En-tête de page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
            Gestion des Actualités
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Publiez et modifiez les annonces de la communauté en quelques clics.
          </p>
        </div>

        <Link href="/admin/actualites/nouveau" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}>
          <PlusCircle size={18} />
          <span>Nouvelle actualité</span>
        </Link>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Filtres de statut */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link
            href="/admin/actualites"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              backgroundColor: currentStatus === 'ALL' ? 'var(--color-primary-blue)' : '#f0eef5',
              color: currentStatus === 'ALL' ? '#fff' : 'var(--color-text-main)'
            }}
          >
            Tous ({countAll})
          </Link>

          <Link
            href="/admin/actualites?statut=PUBLISHED"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              backgroundColor: currentStatus === 'PUBLISHED' ? '#2e7d32' : '#f0eef5',
              color: currentStatus === 'PUBLISHED' ? '#fff' : 'var(--color-text-main)'
            }}
          >
            Publiés ({countPublished})
          </Link>

          <Link
            href="/admin/actualites?statut=DRAFT"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              backgroundColor: currentStatus === 'DRAFT' ? 'var(--color-gold)' : '#f0eef5',
              color: currentStatus === 'DRAFT' ? '#121216' : 'var(--color-text-main)'
            }}
          >
            Brouillons ({countDraft})
          </Link>

          <Link
            href="/admin/actualites?statut=ARCHIVED"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              backgroundColor: currentStatus === 'ARCHIVED' ? '#616161' : '#f0eef5',
              color: currentStatus === 'ARCHIVED' ? '#fff' : 'var(--color-text-main)'
            }}
          >
            Archivés ({countArchived})
          </Link>
        </div>

        {/* Barre de recherche */}
        <form method="GET" action="/admin/actualites" style={{ display: 'flex', gap: '0.5rem' }}>
          {currentStatus !== 'ALL' && <input type="hidden" name="statut" value={currentStatus} />}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Rechercher par titre..."
              style={{
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontSize: '0.9rem',
                fontFamily: 'inherit'
              }}
            />
            <Search size={16} color="var(--color-text-light)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button type="submit" className="btn-outline" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', minHeight: 'auto' }}>
            Filtrer
          </button>
        </form>
      </div>

      {/* Tableau des actualités */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {newsList.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f6f5f8', borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Article</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Catégorie</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Statut</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsList.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '1rem', minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.imageAlt || item.title}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, backgroundColor: '#eee' }}
                          />
                        ) : (
                          <div style={{ width: '50px', height: '50px', backgroundColor: '#e2dfeb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-blue)', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>
                            Texte
                          </div>
                        )}
                        <div>
                          <Link href={`/admin/actualites/${item.id}`} style={{ fontWeight: 600, color: 'var(--color-primary-blue)', textDecoration: 'none' }}>
                            {item.title}
                          </Link>
                          {item.isFeatured && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700 }}>
                              <Star size={13} fill="var(--color-gold)" /> À la une
                            </span>
                          )}
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                            Par {item.author?.name || 'Bénévole'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-gold">{item.category.name}</span>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Intl.DateTimeFormat('fr-FR').format(new Date(item.publishedAt))}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {item.status === 'PUBLISHED' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2e7d32', fontWeight: 600, fontSize: '0.85rem' }}>
                          <CheckCircle size={15} /> Publié
                        </span>
                      )}
                      {item.status === 'DRAFT' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#b78103', fontWeight: 600, fontSize: '0.85rem' }}>
                          <Clock size={15} /> Brouillon
                        </span>
                      )}
                      {item.status === 'ARCHIVED' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#616161', fontWeight: 600, fontSize: '0.85rem' }}>
                          <ArchiveIcon size={15} /> Archivé
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                        {/* Voir sur le site public */}
                        {item.status === 'PUBLISHED' && (
                          <Link
                            href={`/actualites/${item.slug}`}
                            target="_blank"
                            className="btn-outline"
                            title="Voir sur le site public"
                            style={{ padding: '0.35rem 0.55rem', minHeight: 'auto' }}
                          >
                            <Eye size={15} />
                          </Link>
                        )}

                        {/* Éditer */}
                        <Link
                          href={`/admin/actualites/${item.id}`}
                          className="btn-outline"
                          title="Modifier l'actualité"
                          style={{ padding: '0.35rem 0.55rem', minHeight: 'auto' }}
                        >
                          <Edit size={15} />
                        </Link>

                        {/* Dépublier si publié */}
                        {item.status === 'PUBLISHED' && (
                          <form action={async () => {
                            'use server';
                            await unpublishNewsAction(item.id);
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

                        {/* Archiver si non archivé */}
                        {item.status !== 'ARCHIVED' && (
                          <form action={async () => {
                            'use server';
                            await archiveNewsAction(item.id);
                          }}>
                            <button
                              type="submit"
                              title="Archiver l'actualité"
                              style={{ padding: '0.35rem 0.55rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: '#616161' }}
                            >
                              <Archive size={15} />
                            </button>
                          </form>
                        )}

                        {/* Suppression définitive (§7 & §8 : ADMIN uniquement) */}
                        {isAdmin && (
                          <form action={async () => {
                            'use server';
                            await deleteNewsAction(item.id);
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
              Aucune actualité ne correspond à ces critères.
            </p>
            <Link href="/admin/actualites/nouveau" className="btn btn-primary" style={{ minHeight: 'auto', padding: '0.6rem 1.25rem' }}>
              Créer la première actualité
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
