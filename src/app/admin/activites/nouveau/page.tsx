import React from 'react';
import { requireAuth } from '@/lib/rbac';
import ActivityForm from '@/components/admin/ActivityForm';

export const dynamic = 'force-dynamic';

export default async function AdminNouvelleActivitePage() {
  await requireAuth();

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Ajouter une activité ou un cours
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Renseignez l'intitulé, les jours et horaires, et la description.
        </p>
      </div>

      <ActivityForm />
    </div>
  );
}
