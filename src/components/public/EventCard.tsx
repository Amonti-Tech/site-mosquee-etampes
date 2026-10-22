import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string;
    startDate: Date | string;
    endDate?: Date | string | null;
    location: string;
    imageUrl?: string | null;
    imageAlt?: string | null;
  };
  isPast?: boolean;
}

export function EventCard({ event, isPast = false }: EventCardProps) {
  const start = new Date(event.startDate);
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(start);

  const formattedTime = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(start);

  return (
    <article
      className="card"
      style={{ opacity: isPast ? 0.8 : 1 }}
      aria-labelledby={`event-title-${event.id}`}
    >
      <div className="card-img-wrap">
        <img
          src={event.imageUrl || '/images/provisoires/evenement-conference.jpg'}
          alt={event.imageAlt || event.title}
          className="card-img"
          loading="lazy"
        />
        <span
          className={`badge ${isPast ? 'badge-blue' : 'badge-gold'}`}
          style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}
        >
          {isPast ? 'Événement passé' : 'À venir'}
        </span>
      </div>

      <div className="card-body">
        <div className="card-meta" style={{ flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} aria-hidden="true" />
            <time dateTime={start.toISOString()}>{formattedDate}</time>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} aria-hidden="true" />
            <span>{formattedTime}</span>
          </span>
        </div>

        <h3 id={`event-title-${event.id}`} className="card-title">
          {event.title}
        </h3>

        <p className="card-excerpt">{event.description}</p>

        <div className="card-footer">
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)'
            }}
          >
            <MapPin size={15} color="var(--color-terracotta)" aria-hidden="true" />
            <span>{event.location}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
