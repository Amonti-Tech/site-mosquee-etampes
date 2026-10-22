import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface NewsDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NewsDetailProps): Promise<Metadata> {
  const resolvedParams = await params;
  const news = await prisma.news.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!news) {
    return { title: "Article introuvable — Mosquée d'Etampes Centre" };
  }

  return {
    title: `${news.title} — Mosquée d'Etampes Centre`,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: news.imageUrl ? [news.imageUrl] : ['/images/provisoires/hero-facade.jpg']
    }
  };
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const resolvedParams = await params;
  const news = await prisma.news.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true, author: true }
  });

  if (!news || news.status !== 'PUBLISHED') {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(news.publishedAt));

  return (
    <article className="section section-cream" aria-labelledby="news-article-title">
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Bouton retour */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            href="/actualites"
            className="btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', padding: '0.4rem 0.8rem', minHeight: 'auto' }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Retour aux actualités</span>
          </Link>
        </div>

        {/* En-tête de l'article */}
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {news.category && (
              <span className="badge badge-gold">
                <Tag size={12} aria-hidden="true" />
                <span>{news.category.name}</span>
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <Calendar size={15} aria-hidden="true" />
              <time dateTime={new Date(news.publishedAt).toISOString()}>{formattedDate}</time>
            </span>
          </div>

          <h1 id="news-article-title" style={{ fontSize: 'clamp(1.8rem, 3vw + 1rem, 2.6rem)', marginBottom: '1rem' }}>
            {news.title}
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', lineHeight: '1.5', fontStyle: 'italic' }}>
            {news.excerpt}
          </p>
        </header>

        {/* Image principale si présente */}
        {news.imageUrl && (
          <div
            style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '2.5rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)'
            }}
          >
            <img
              src={news.imageUrl}
              alt={news.imageAlt || news.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}

        {/* Corps de l'article */}
        <div
          style={{
            backgroundColor: 'var(--color-white)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            fontSize: '1.05rem',
            lineHeight: '1.8'
          }}
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Pied d'article */}
        <div
          style={{
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <Link href="/actualites" className="btn btn-outline">
            &larr; Toutes les actualités
          </Link>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Publié par : {news.author.name}
          </span>
        </div>
      </div>
    </article>
  );
}
