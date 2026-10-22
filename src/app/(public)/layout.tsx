import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import AnnouncementBanner from '@/components/public/AnnouncementBanner';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await prisma.siteSetting.findUnique({
      where: { id: 1 }
    });
  } catch (error) {
    console.error('Erreur chargement paramètres:', error);
  }

  const officialName = settings?.officialName || "Mosquée d'Etampes Centre";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AnnouncementBanner
        active={settings?.announcementActive ?? false}
        text={settings?.announcementText}
        link={settings?.announcementLink}
        endDate={settings?.announcementEndDate}
      />
      <Header officialName={officialName} />
      <main id="contenu-principal" style={{ flexGrow: 1 }}>
        {children}
      </main>
      <Footer settings={settings || undefined} />
    </div>
  );
}
