'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { loginAction, ActionState } from '@/app/admin/actions';
import { Lock, Mail, ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(loginAction, {
    error: null
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--color-white)',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/logo-mosquee.svg"
            alt="Logo de la Mosquée d'Etampes Centre"
            style={{ height: '64px', margin: '0 auto 1rem', display: 'block' }}
          />
          <h1 style={{ fontSize: '1.6rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
            Espace Bénévoles
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Administration — Mosquée d'Etampes Centre
          </p>
        </div>

        {state?.error && (
          <div
            role="alert"
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              border: '1px solid #f5c6cb',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction}>
          {/* Champ E-mail */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--color-primary-blue)' }}
            >
              Adresse e-mail
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="nom@exemple.fr"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              <Mail
                size={18}
                color="var(--color-text-light)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                aria-hidden="true"
              />
            </div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              L'adresse transmise lors de la création de votre compte bénévole.
            </span>
          </div>

          {/* Champ Mot de passe */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--color-primary-blue)' }}
            >
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              <Lock
                size={18}
                color="var(--color-text-light)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                aria-hidden="true"
              />
            </div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              12 caractères minimum requis par mesure de sécurité.
            </span>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', opacity: isPending ? 0.7 : 1 }}
          >
            <LogIn size={18} aria-hidden="true" />
            <span>{isPending ? 'Connexion en cours...' : 'Se connecter'}</span>
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Retour au site public</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
