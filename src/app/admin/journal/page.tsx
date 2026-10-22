import React from 'react';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/rbac';
import { ShieldCheck, UserCheck, Clock, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    action?: string;
  }>;
}

export default async function AdminJournalPage({ searchParams }: PageProps) {
  // Contrôle strict : administrateur uniquement (§8)
  await requireAdmin();

  const params = await searchParams;
  const actionFilter = params.action;

  const logs = await prisma.auditLog.findMany({
    where: actionFilter ? { action: actionFilter } : {},
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  const getActionBadge = (action: string) => {
    if (action.includes('LOGIN_SUCCESS')) {
      return <span className="badge" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>Connexion</span>;
    }
    if (action.includes('LOGIN_FAILED')) {
      return <span className="badge" style={{ backgroundColor: '#ffebee', color: '#c62828' }}>Échec connexion</span>;
    }
    if (action.includes('CREATE')) {
      return <span className="badge badge-blue">Création</span>;
    }
    if (action.includes('UPDATE')) {
      return <span className="badge badge-gold">Modification</span>;
    }
    if (action.includes('DELETE')) {
      return <span className="badge" style={{ backgroundColor: '#ffebee', color: '#c62828' }}>Suppression</span>;
    }
    if (action.includes('UNPUBLISH')) {
      return <span className="badge" style={{ backgroundColor: '#fff3e0', color: '#ef6c00' }}>Dépublication</span>;
    }
    return <span className="badge" style={{ backgroundColor: '#f0eff4', color: 'var(--color-text-main)' }}>{action}</span>;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Journal d'activité &amp; Sécurité
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Traçabilité des actions réalisées par les bénévoles et événements de sécurité (conservé 12 mois). Aucun mot de passe ni jeton n'est jamais enregistré.
        </p>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f6f5f8', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Date &amp; Heure</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Utilisateur</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Action</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Entité</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Détails</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Adresse IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', color: 'var(--color-text-muted)' }}>
                    {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(log.createdAt))}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    <strong>{log.userName || 'Système / Anonyme'}</strong>
                    {log.userEmail && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{log.userEmail}</div>}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {getActionBadge(log.action)}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-blue)', fontWeight: 600 }}>
                    {log.entity}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-main)', maxWidth: '350px' }}>
                    {log.details || '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-light)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {log.ipAddress || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
