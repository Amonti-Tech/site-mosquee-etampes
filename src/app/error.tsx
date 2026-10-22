'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(169, 96, 66, 0.1)', borderRadius: '50%', marginBottom: '1.25rem' }}>
          <AlertTriangle size={42} color="var(--color-terracotta)" aria-hidden="true" />
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--color-primary-blue)' }}>
          Une erreur inattendue est survenue
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
          Nous nous excusons pour ce désagrément temporaire. Vous pouvez réessayer de charger la page ou revenir à l'accueil.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => reset()} className="btn btn-primary">
            <RefreshCw size={18} aria-hidden="true" />
            <span>Réessayer</span>
          </button>
          <Link href="/" className="btn btn-outline">
            <Home size={18} aria-hidden="true" />
            <span>Accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
