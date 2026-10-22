import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import MawaqitWidget from '@/components/public/MawaqitWidget';
import NewsCard from '@/components/public/NewsCard';
import EventCard from '@/components/public/EventCard';
import { ArrowRight, BookOpen, Heart, Users, MapPin, Calendar, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 1. Récupération des paramètres
  const settings = await prisma.siteSetting.findUnique({
    where: { id: 1 }
  });

  // 2. Récupération des 3 dernières actualités publiées
  const latestNews = await prisma.news.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    include: { category: true }
  });

  // 3. Récupération des 3 prochains événements à venir
  const upcomingEvents = await prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      showOnHome: true,
      startDate: { gte: new Date() }
    },
    orderBy: { startDate: 'asc' },
    take: 3
  });

  // 4. Récupération des activités actives
  const activities = await prisma.activity.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: 3
  });

  const officialName = settings?.officialName || "Mosquée d'Etampes Centre";
  const address = settings?.address || "2 avenue du 8 mai 1945, 91150 Étampes";
  const heroImage = settings?.heroBannerUrl || '/images/provisoires/hero-facade.jpg';

  // Données structurées Schema.org (JSON-LD) selon §10
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Mosque',
    name: officialName,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2 avenue du 8 mai 1945',
      addressLocality: 'Étampes',
      postalCode: '91150',
      addressCountry: 'FR'
    },
    telephone: settings?.whatsapp || '+33 7 49 60 90 62',
    description: settings?.description
  };

  return (
    <>
      {/* Données structurées pour le SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section (Bandeau Façade) */}
      <section className="hero-section" aria-label="Bandeau d'accueil">
        <div className="hero-banner-wrap">
          <img
            src={heroImage}
            alt="Façade de la mosquée avec arches et colonnades contemporaines"
            className="hero-bg-img"
          />
          <div className="container">
            <div className="hero-content">
              <span className="hero-badge">Bienvenue</span>
              <h1 className="hero-title">{officialName}</h1>
              <p className="hero-desc">
                Un lieu de prière, de recueillement et d'épanouissement fraternel ouvert à toute la communauté au cœur d'Étampes.
              </p>
              <div className="hero-actions">
                <a href="#titre-horaires-priere" className="btn btn-gold">
                  <Clock size={18} aria-hidden="true" />
                  <span>Consulter les horaires de prière</span>
                </a>
                <Link href="/informations-pratiques" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>
                  <MapPin size={18} aria-hidden="true" />
                  <span>Venir à la mosquée</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Widget Mawaqit (Immédiatement sous le bandeau façade conformément au §3, §5 et §6) */}
      <MawaqitWidget />

      {/* 3. Section Actualités Récentes */}
      <section className="section section-cream" aria-labelledby="titre-actus">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Vie de la communauté</span>
              <h2 id="titre-actus">Dernières Actualités</h2>
            </div>
            <Link href="/actualites" className="btn btn-outline" aria-label="Voir toutes les actualités publiées">
              <span>Toutes les actualités</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="cards-grid">
              {latestNews.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>Aucune actualité publiée pour le moment.</p>
          )}
        </div>
      </section>

      {/* 4. Section Prochains Événements */}
      {upcomingEvents.length > 0 && (
        <section className="section section-white" aria-labelledby="titre-evenements">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-subtitle">Agenda &amp; Rencontres</span>
                <h2 id="titre-evenements">Prochains Événements</h2>
              </div>
              <Link href="/evenements" className="btn btn-outline" aria-label="Consulter l'agenda complet des événements">
                <span>Tout l'agenda</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="cards-grid">
              {upcomingEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Section Activités & Cours */}
      <section className="section section-beige" aria-labelledby="titre-activites">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Pôles &amp; Apprentissage</span>
              <h2 id="titre-activites">Activités &amp; Enseignements</h2>
            </div>
            <Link href="/activites" className="btn btn-outline" aria-label="Découvrir toutes les activités proposées">
              <span>Toutes les activités</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="cards-grid">
            {activities.map((act) => (
              <div key={act.id} className="card">
                <div className="card-img-wrap">
                  <img
                    src={act.imageUrl || '/images/provisoires/actu-cours.jpg'}
                    alt={act.imageAlt || act.title}
                    className="card-img"
                    loading="lazy"
                  />
                </div>
                <div className="card-body">
                  <h3 className="card-title">{act.title}</h3>
                  <p className="card-excerpt">{act.description}</p>
                  <div className="card-footer" style={{ borderTop: 'none', paddingLeft: 0, paddingRight: 0 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--color-primary-blue)'
                      }}
                    >
                      <Clock size={16} color="var(--color-gold)" aria-hidden="true" />
                      <span>{act.schedule}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Présentation courte & Intérieur de la Mosquée */}
      <section className="section section-cream" aria-labelledby="titre-presentation">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="section-subtitle">Notre mission</span>
              <h2 id="titre-presentation" className="section-title-nowrap">
                Un lieu d'échange, de paix et de transmission
              </h2>
              <p>
                La <strong>Mosquée d'Etampes Centre</strong> est attachée à favoriser le dialogue, la fraternité et le vivre-ensemble au sein de la cité.
              </p>
              <p>
                Nos portes sont ouvertes aux fidèles pour l'accomplissement des prières rituelles, ainsi qu'aux familles et jeunes générations à travers nos cours de soutien et nos actions humanitaires et caritatives.
              </p>
              <div style={{ marginTop: '1.75rem' }}>
                <Link href="/la-mosquee" className="btn btn-primary">
                  <span>Découvrir l'histoire de la mosquée</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '2px solid var(--color-border)' }}>
              <img
                src={settings?.interiorPhotoUrl || '/images/provisoires/interieur-mosquee.jpg'}
                alt="Salle de prière épurée et lumineuse de la mosquée"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Informations Pratiques & Venir à la mosquée */}
      <section className="section section-white" aria-labelledby="titre-acces-rapide">
        <div className="container">
          <div className="mawaqit-card" style={{ backgroundColor: 'var(--color-bg-cream)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center', alignItems: 'center', padding: '1rem 0' }}>
              <span className="section-subtitle">Nous trouver facilement</span>
              <h2 id="titre-acces-rapide" className="section-title-nowrap" style={{ marginBottom: 0 }}>
                Venir à la Mosquée d'Etampes Centre
              </h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
                Située au <strong>{address}</strong>, accessible facilement en transports en commun (RER C / TER) et en voiture avec stationnement à proximité.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '0.75rem' }}>
                <Link href="/informations-pratiques" className="btn btn-primary">
                  <MapPin size={18} aria-hidden="true" />
                  <span>Détails d'accès &amp; Transports</span>
                </Link>
                <Link href="/contact" className="btn btn-gold">
                  <span>Page Contact &amp; WhatsApp</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
