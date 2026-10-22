import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import NewsCard from '@/components/public/NewsCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Actualités — Mosquée d'Etampes Centre",
  description: "Toutes les actualités, annonces et communications de la Mosquée d'Etampes Centre."
};

interface NewsPageProps {
  searchParams: Promise<{
    categorie?: string;
  }>;
}

export default async function NewsListPage({ searchParams }: NewsPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentCategorySlug = resolvedSearchParams.categorie;

  // Récupérer toutes les catégories ayant au moins un article
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' }
  });

  // Filtrer les actualités publiées
  const whereClause: { status: string; category?: { slug: string } } = {
    status: 'PUBLISHED'
  };

  if (currentCategorySlug) {
    whereClause.category = { slug: currentCategorySlug };
  }

  const newsList = await prisma.news.findMany({
    where: whereClause,
    orderBy: { publishedAt: 'desc' },
    include: { category: true }
  });

  return (
    <div className="section section-cream">
      <div className="container">
        <header className="page-header">
          <span className="section-subtitle">Communications &amp; Vie locale</span>
          <h1 className="page-title">Actualités de la Mosquée</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem' }}>
            Retrouvez les dernières annonces, les projets communautaires et les événements marquants d'Étampes.
          </p>
        </header>

        {/* Filtres par catégorie */}
        <nav aria-label="Filtrer par catégorie" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <Link
            href="/actualites"
            className={`btn ${!currentCategorySlug ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.9rem', minHeight: '40px' }}
          >
            Toutes les actualités
          </Link>
          {categories.map((cat) => {
            const isSelected = currentCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/actualites?categorie=${cat.slug}`}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.5rem 1.1rem', fontSize: '0.9rem', minHeight: '40px' }}
              >
                {cat.name}
              </Link>
            );
          })}
        </nav>

        {/* Grille des articles */}
        {newsList.length > 0 ? (
          <div className="cards-grid">
            {newsList.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--color-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
              Aucun article publié dans cette catégorie pour le moment.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <Link href="/actualites" className="btn btn-outline">
                Voir toutes les actualités
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
