import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import EventForm from '@/components/admin/EventForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminModifierEvenementPage({ params }: PageProps) {
  await requireAuth();

  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id }
  });

  if (!event) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Modifier l'événement
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Mettez à jour les horaires, la description ou les options d'affichage.
        </p>
      </div>

      <EventForm initialData={event} />
    </div>
  );
}
