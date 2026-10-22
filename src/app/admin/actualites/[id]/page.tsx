import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import NewsForm from '@/components/admin/NewsForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminModifierActualitePage({ params }: PageProps) {
  await requireAuth();

  const { id } = await params;

  const [news, categories] = await Promise.all([
    prisma.news.findUnique({
      where: { id }
    }),
    prisma.category.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, name: true }
    })
  ]);

  if (!news) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Modifier l'actualité
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Éditez le contenu, prévisualisez ou modifiez le statut de publication.
        </p>
      </div>

      <NewsForm initialData={news} categories={categories} />
    </div>
  );
}
