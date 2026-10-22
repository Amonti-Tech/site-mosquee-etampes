import React from 'react';

interface AnnouncementBannerProps {
  active: boolean;
  text?: string | null;
  link?: string | null;
  endDate?: Date | null;
}

export function AnnouncementBanner({ active, text, link, endDate }: AnnouncementBannerProps) {
  if (!active || !text) return null;

  // Si une date de fin est fixée et déjà passée, ne pas afficher
  if (endDate && new Date(endDate) < new Date()) {
    return null;
  }

  return (
    <aside className="announcement-banner" aria-label="Annonce importante">
      <div className="container">
        <span>{text}</span>
        {link && (
          <a href={link} className="announcement-link">
            En savoir plus &rarr;
          </a>
        )}
      </div>
    </aside>
  );
}

export default AnnouncementBanner;
