import React from 'react';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/rbac';
import SettingsForm from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminParametresPage() {
  // Contrôle strict : administrateur uniquement (§8)
  await requireAdmin();

  let settings = await prisma.siteSetting.findUnique({
    where: { id: 1 }
  });

  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: { id: 1 }
    });
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Paramètres du site &amp; Bandeau d'annonce
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Configuration centrale de la Mosquée d'Etampes Centre. Modifiez le bandeau d'alerte ou les coordonnées officielles.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
