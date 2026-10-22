import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { deleteActivityAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminActivitesPage() {
  const user = await requireAuth();
  const isAdmin = user.role === 'ADMIN';

  const activities = await prisma.activity.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
            Activités &amp; Cours
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Gérez les cours réguliers (apprentissage du Coran, arabe, soutien scolaire, solidarité).
          </p>
        </div>

        <Link href="/admin/activites/nouveau" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}>
          <PlusCircle size={18} />
          <span>Ajouter une activité</span>
        </Link>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {activities.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f6f5f8', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700, width: '60px' }}>Ordre</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Activité</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Jours &amp; Horaires</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Statut</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--color-primary-blue)' }}>
                    {a.order}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/admin/activites/${a.id}`} style={{ fontWeight: 600, color: 'var(--color-primary-blue)', textDecoration: 'none' }}>
                      {a.title}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>
                    {a.schedule}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {a.isActive ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2e7d32', fontWeight: 600, fontSize: '0.85rem' }}>
                        <CheckCircle size={15} /> Active
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#757575', fontWeight: 600, fontSize: '0.85rem' }}>
                        <XCircle size={15} /> Inactive
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                      <Link
                        href={`/admin/activites/${a.id}`}
                        className="btn-outline"
                        title="Modifier"
                        style={{ padding: '0.35rem 0.55rem', minHeight: 'auto' }}
                      >
                        <Edit size={15} />
                      </Link>

                      {isAdmin && (
                        <form action={async () => {
                          'use server';
                          await deleteActivityAction(a.id);
                        }}>
                          <button
                            type="submit"
                            title="Supprimer définitivement"
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
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
              Aucune activité enregistrée.
            </p>
            <Link href="/admin/activites/nouveau" className="btn btn-primary" style={{ minHeight: 'auto', padding: '0.6rem 1.25rem' }}>
              Ajouter la première activité
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
