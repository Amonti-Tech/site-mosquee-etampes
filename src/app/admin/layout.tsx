import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { logoutAction } from '@/app/admin/actions';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  FileText,
  Activity,
  Image as ImageIcon,
  Settings,
  Shield,
  LogOut,
  ExternalLink
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Si non connecté, la page de login gère son propre affichage
  if (!user) {
    return <>{children}</>;
  }

  const isAdmin = user.role === 'ADMIN';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f5f8' }}>
      {/* Barre latérale d'administration */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--color-primary-blue)',
          color: 'var(--color-white)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}
        aria-label="Navigation administration"
      >
        {/* En-tête de la barre latérale */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: '#fff' }}>
            <img
              src="/logo-mosquee-blanc-or.svg"
              alt="Logo Mosquée"
              style={{ height: '42px', width: 'auto' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: '1.2' }}>Mosquée d'Etampes</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Administration
              </div>
            </div>
          </Link>
        </div>

        {/* Profil du bénévole connecté */}
        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.15)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
            <span
              className="badge"
              style={{
                backgroundColor: isAdmin ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
                color: isAdmin ? '#121216' : '#fff',
                fontSize: '0.7rem',
                padding: '0.15rem 0.5rem'
              }}
            >
              {isAdmin ? 'Administrateur' : 'Éditeur'}
            </span>
          </div>
        </div>

        {/* Navigation des modules */}
        <nav style={{ padding: '1rem 0.75rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              color: '#e2dfeb',
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.925rem',
              fontWeight: 500
            }}
          >
            <LayoutDashboard size={18} aria-hidden="true" />
            <span>Tableau de bord</span>
          </Link>

          <Link
            href="/admin/actualites"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              color: '#e2dfeb',
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.925rem',
              fontWeight: 500
            }}
          >
            <Newspaper size={18} aria-hidden="true" />
            <span>Actualités</span>
          </Link>

          <Link
            href="/admin/evenements"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              color: '#e2dfeb',
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.925rem',
              fontWeight: 500
            }}
          >
            <Calendar size={18} aria-hidden="true" />
            <span>Événements</span>
          </Link>

          <Link
            href="/admin/pages"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              color: '#e2dfeb',
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.925rem',
              fontWeight: 500
            }}
          >
            <FileText size={18} aria-hidden="true" />
            <span>Pages du site</span>
          </Link>

          <Link
            href="/admin/activites"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              color: '#e2dfeb',
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.925rem',
              fontWeight: 500
            }}
          >
            <Activity size={18} aria-hidden="true" />
            <span>Activités &amp; Cours</span>
          </Link>

          <Link
            href="/admin/medias"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              color: '#e2dfeb',
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.925rem',
              fontWeight: 500
            }}
          >
            <ImageIcon size={18} aria-hidden="true" />
            <span>Médiathèque</span>
          </Link>

          {/* Modules réservés aux Administrateurs (§8) */}
          {isAdmin && (
            <>
              <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '0.75rem 0' }} />
              <div style={{ padding: '0 0.9rem', fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Administration
              </div>

              <Link
                href="/admin/parametres"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 0.9rem',
                  color: '#e2dfeb',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.925rem',
                  fontWeight: 500
                }}
              >
                <Settings size={18} aria-hidden="true" />
                <span>Paramètres &amp; Bandeau</span>
              </Link>

              <Link
                href="/admin/journal"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 0.9rem',
                  color: '#e2dfeb',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.925rem',
                  fontWeight: 500
                }}
              >
                <Shield size={18} aria-hidden="true" />
                <span>Journal d'activité</span>
              </Link>
            </>
          )}
        </nav>

        {/* Pied de la barre latérale */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.6rem 0.8rem',
              color: '#dcd7e6',
              textDecoration: 'none',
              fontSize: '0.85rem'
            }}
          >
            <span>Voir le site public</span>
            <ExternalLink size={14} aria-hidden="true" />
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 0.8rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffcdd2',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <LogOut size={16} aria-hidden="true" />
              <span>Se déconnecter</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Contenu principal de l'administration */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <header
          style={{
            backgroundColor: 'var(--color-white)',
            borderBottom: '1px solid var(--color-border)',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Espace d'administration réservé aux bénévoles autorisés
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Connecté en tant que <strong>{user.email}</strong>
          </div>
        </header>

        <main style={{ padding: '2rem', flexGrow: 1 }}>{children}</main>
      </div>
    </div>
  );
}
