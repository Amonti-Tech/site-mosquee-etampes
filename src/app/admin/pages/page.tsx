import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { FileText, Edit, Eye, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  await requireAuth();

  const pages = await prisma.pageContent.findMany({
    orderBy: { key: 'asc' }
  });

  const pageLabels: Record<string, { label: string; desc: string; url: string }> = {
    'la-mosquee': {
      label: 'La mosquée (Présentation & Histoire)',
      desc: 'Présentation de l’édifice, de son rôle et de la communauté musulmane à Étampes.',
      url: '/la-mosquee'
    },
    'informations-pratiques': {
      label: 'Informations pratiques',
      desc: 'Accès, adresse, transports, salles d’ablutions et contacts.',
      url: '/informations-pratiques'
    },
    'mentions-legales': {
      label: 'Mentions légales',
      desc: 'Informations éditeur, directeur de la publication et hébergement.',
      url: '/mentions-legales'
    },
    'confidentialite': {
      label: 'Politique de confidentialité',
      desc: 'Traitement des données personnelles, cookies et droits des utilisateurs.',
      url: '/confidentialite'
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Pages institutionnelles
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Modifiez simplement les textes fixes du site. Aucun constructeur de page complexe : vous rédigez le texte, le site s’occupe du design.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
        {pages.map((p) => {
          const meta = pageLabels[p.key] || {
            label: p.title,
            desc: 'Page du site',
            url: `/${p.key}`
          };

          return (
            <div
              key={p.id}
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'rgba(27, 31, 96, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-primary-blue)',
                    marginTop: '2px'
                  }}
                >
                  <FileText size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                    <Link href={`/admin/pages/${p.key}`} style={{ color: 'var(--color-primary-blue)', textDecoration: 'none' }}>
                      {meta.label}
                    </Link>
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {meta.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                    <Clock size={13} />
                    <span>Dernière mise à jour le {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(p.updatedAt))}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  href={meta.url}
                  target="_blank"
                  className="btn-outline"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', minHeight: 'auto' }}
                  title="Voir la page sur le site"
                >
                  <Eye size={15} />
                  <span>Voir</span>
                </Link>

                <Link
                  href={`/admin/pages/${p.key}`}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', minHeight: 'auto' }}
                >
                  <Edit size={15} />
                  <span>Modifier le texte</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
