import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '2rem 1rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-cream)'
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          backgroundColor: 'var(--color-white)',
          padding: '3rem 2rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div
          style={{
            fontSize: '5rem',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-gold)',
            lineHeight: 1,
            marginBottom: '1rem'
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--color-primary-blue)' }}>
          Page introuvable
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            <Home size={18} aria-hidden="true" />
            <span>Retour à l'accueil</span>
          </Link>
          <Link href="/actualites" className="btn btn-outline">
            <span>Voir les actualités</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
