'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { savePageAction } from '@/app/admin/pages/actions';
import { Save, ArrowLeft, AlertCircle, CheckCircle2, Eye } from 'lucide-react';

interface PageEditFormProps {
  page: {
    key: string;
    title: string;
    content: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
}

export default function PageEditForm({ page }: PageEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [metaTitle, setMetaTitle] = useState(page.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(page.metaDescription || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim() || !content.trim()) {
      setErrorMessage('Le titre et le contenu de la page sont obligatoires.');
      return;
    }

    const formData = new FormData();
    formData.append('key', page.key);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('metaTitle', metaTitle);
    formData.append('metaDescription', metaDescription);

    startTransition(async () => {
      const res = await savePageAction(null, formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage('Page mise à jour avec succès.');
        setTimeout(() => {
          router.push('/admin/pages');
          router.refresh();
        }, 1200);
      }
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          href="/admin/pages"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary-blue)', fontWeight: 600, textDecoration: 'none' }}
        >
          <ArrowLeft size={16} />
          <span>Retour aux pages</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href={`/${page.key}`}
            target="_blank"
            className="btn-outline"
            style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', minHeight: 'auto' }}
          >
            <Eye size={16} />
            <span>Voir sur le site</span>
          </Link>

          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', minHeight: 'auto' }}
          >
            <Save size={16} />
            <span>{isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div role="alert" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid #f5c6cb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div role="status" style={{ backgroundColor: '#d4edda', color: '#155724', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid #c3e6cb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="page-title" style={{ display: 'block', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Titre principal de la page *
          </label>
          <input
            id="page-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontSize: '1.05rem',
              fontFamily: 'inherit'
            }}
          />
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            Ce titre apparaît en en-tête de la page.
          </span>
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="page-content" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Texte de la page *
          </label>
          <textarea
            id="page-content"
            rows={14}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontSize: '1rem',
              lineHeight: '1.7',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            Pour faire des paragraphes, sautez une ligne. Les puces commençant par « - » s'afficheront sous forme de liste.
          </span>
        </div>

        <details style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
          <summary style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            Options de référencement (SEO facultatif)
          </summary>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label htmlFor="metaTitle" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                Titre pour les moteurs de recherche
              </label>
              <input
                id="metaTitle"
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Ex : Histoire & Présentation — Mosquée d'Etampes Centre"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label htmlFor="metaDesc" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                Description dans Google
              </label>
              <input
                id="metaDesc"
                type="text"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Description courte de la page..."
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </details>
      </form>
    </div>
  );
}
