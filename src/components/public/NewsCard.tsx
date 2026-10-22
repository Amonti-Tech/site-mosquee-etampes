import React from 'react';
import Link from 'next/link';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    imageUrl?: string | null;
    imageAlt?: string | null;
    publishedAt: Date | string;
    isFeatured?: boolean;
    category?: {
      name: string;
      slug: string;
    };
  };
}

export function NewsCard({ news }: NewsCardProps) {
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(news.publishedAt));

  return (
    <article className="card" aria-labelledby={`news-title-${news.id}`}>
      <div className="card-img-wrap">
        <img
          src={news.imageUrl || '/images/provisoires/hero-facade.jpg'}
          alt={news.imageAlt || news.title}
          className="card-img"
          loading="lazy"
        />
        {news.isFeatured && (
          <span
            className="badge badge-gold"
            style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}
          >
            À la une
          </span>
        )}
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} aria-hidden="true" />
            <time dateTime={new Date(news.publishedAt).toISOString()}>{formattedDate}</time>
          </span>
          {news.category && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={14} aria-hidden="true" />
              <span>{news.category.name}</span>
            </span>
          )}
        </div>

        <h3 id={`news-title-${news.id}`} className="card-title">
          <Link href={`/actualites/${news.slug}`}>{news.title}</Link>
        </h3>

        <p className="card-excerpt">{news.excerpt}</p>

        <div className="card-footer">
          <Link
            href={`/actualites/${news.slug}`}
            className="btn-outline"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.875rem', minHeight: 'auto' }}
            aria-label={`Lire l'article complet : ${news.title}`}
          >
            <span>Lire la suite</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;
