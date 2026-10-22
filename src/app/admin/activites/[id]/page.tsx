import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import ActivityForm from '@/components/admin/ActivityForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminModifierActivitePage({ params }: PageProps) {
  await requireAuth();

  const { id } = await params;
  const activity = await prisma.activity.findUnique({
    where: { id }
  });

  if (!activity) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Modifier l'activité : {activity.title}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Mettez à jour les horaires, la description ou le statut.
        </p>
      </div>

      <ActivityForm initialData={activity} />
    </div>
  );
}
