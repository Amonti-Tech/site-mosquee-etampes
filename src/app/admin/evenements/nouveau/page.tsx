import React from 'react';
import { requireAuth } from '@/lib/rbac';
import EventForm from '@/components/admin/EventForm';

export const dynamic = 'force-dynamic';

export default async function AdminNouvelEvenementPage() {
  await requireAuth();

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Créer un nouvel événement
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Renseignez la date, le lieu et le programme.
        </p>
      </div>

      <EventForm />
    </div>
  );
}
