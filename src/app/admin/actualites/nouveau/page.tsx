import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import NewsForm from '@/components/admin/NewsForm';

export const dynamic = 'force-dynamic';

export default async function AdminNouvelleActualitePage() {
  await requireAuth();

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    select: { id: true, name: true }
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Rédiger une nouvelle actualité
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Renseignez le titre, la catégorie et le texte. La mise en page s'adapte automatiquement.
        </p>
      </div>

      <NewsForm categories={categories} />
    </div>
  );
}
