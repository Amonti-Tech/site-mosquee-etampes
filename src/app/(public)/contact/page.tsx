import React from 'react';
import type { Metadata } from 'next';
import { MapPin, Phone, MessageSquare, Mail, AlertCircle, Clock } from 'lucide-react';
import { getPublicSettings } from '@/lib/public-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Contact & WhatsApp — Mosquée d'Etampes Centre",
  description: "Contactez la Mosquée d'Etampes Centre via WhatsApp ou retrouvez nos coordonnées officielles."
};

export default async function ContactPage() {
  const settings = await getPublicSettings();

  const officialName = settings?.officialName || "Mosquée d'Etampes Centre";
  const address = settings?.address || "2 avenue du 8 mai 1945, 91150 Étampes";
  const whatsapp = settings?.whatsapp || "+33 7 49 60 90 62";
  const email = settings?.email; // null par défaut [À COMPLÉTER]
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <div className="section section-cream">
      <div className="container" style={{ maxWidth: '860px' }}>
        <header className="page-header">
          <span className="section-subtitle">Nous joindre</span>
          <h1 className="page-title">Contactez la Mosquée</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem' }}>
            Vous avez une question sur les prières, les cours ou les activités de la communauté ? Notre équipe de bénévoles est à votre écoute.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Option 1 : WhatsApp Direct (Prioritaire) */}
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderColor: '#25D366' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(37, 211, 102, 0.15)',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                color: '#25D366'
              }}
            >
              <MessageSquare size={32} aria-hidden="true" />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>WhatsApp Officiel</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              Le moyen le plus rapide d'échanger avec les responsables associatifs de la mosquée pour toute information courante.
            </p>

            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary-blue)', marginBottom: '1.5rem' }}>
              {whatsapp}
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ width: '100%', fontSize: '1rem' }}
              aria-label="Envoyer un message sur WhatsApp (ouvre WhatsApp dans un nouvel onglet)"
            >
              <MessageSquare size={18} aria-hidden="true" />
              <span>Ouvrir la conversation WhatsApp</span>
            </a>
          </div>

          {/* Option 2 : Sur Place */}
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(27, 31, 96, 0.1)',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                color: 'var(--color-primary-blue)'
              }}
            >
              <MapPin size={32} aria-hidden="true" />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Venir sur place</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              Nos bénévoles sont présents lors de chaque prière quotidienne et des cours du week-end pour vous renseigner.
            </p>

            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-primary-blue)', marginBottom: '1.5rem' }}>
              {address}
            </p>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '1rem' }}
            >
              <MapPin size={18} aria-hidden="true" />
              <span>Voir le plan d'accès</span>
            </a>
          </div>
        </div>

        {/* Note sur le formulaire de contact par courriel (Désactivé par défaut selon §9) */}
        <div
          style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <AlertCircle size={24} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Formulaire de contact par courriel
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: 0 }}>
              {email ? (
                <>Pour nous écrire par e-mail : <a href={`mailto:${email}`}>{email}</a>.</>
              ) : (
                <>
                  Le formulaire de contact par courriel est actuellement <strong>désactivé</strong> en attendant la configuration de l'adresse e-mail officielle de l'association. Merci de privilégier le contact direct via notre <strong>numéro WhatsApp officiel ({whatsapp})</strong> ou de venir à notre rencontre sur place.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
