import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import PageEditForm from '@/components/admin/PageEditForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ key: string }>;
}

export default async function AdminModifierPagePage({ params }: PageProps) {
  await requireAuth();

  const { key } = await params;
  const page = await prisma.pageContent.findUnique({
    where: { key }
  });

  if (!page) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Modifier la page : {page.title}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Modifiez le texte affiché aux fidèles sur la page officielle.
        </p>
      </div>

      <PageEditForm page={page} />
    </div>
  );
}
