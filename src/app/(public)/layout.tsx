import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import AnnouncementBanner from '@/components/public/AnnouncementBanner';
import { getPublicSettings } from '@/lib/public-data';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettings();
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
