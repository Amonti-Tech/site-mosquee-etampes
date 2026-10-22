'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveNewsAction, NewsActionState } from '@/app/admin/actualites/actions';
import {
  Eye,
  Save,
  Send,
  ArrowLeft,
  Bold,
  Italic,
  Heading,
  List,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  X
} from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
}

interface NewsData {
  id?: string;
  title?: string;
  slug?: string;
  categoryId?: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  status?: string;
  isFeatured?: boolean;
  publishedAt?: Date | string;
}

interface NewsFormProps {
  initialData?: NewsData;
  categories: CategoryOption[];
}

export default function NewsForm({ initialData, categories }: NewsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0]?.id || ''));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '');
  const [status, setStatus] = useState(initialData?.status || 'DRAFT');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );

  // Modal d'aperçu
  const [showPreview, setShowPreview] = useState(false);

  // Fonction pour insérer du markdown au curseur
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'texte';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  const handleSubmit = (targetStatus?: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const activeStatus = targetStatus || status;

    if (!title.trim()) {
      setErrorMessage('Le titre de l’actualité est obligatoire.');
      return;
    }
    if (!categoryId) {
      setErrorMessage('Veuillez sélectionner une catégorie.');
      return;
    }
    if (!excerpt.trim()) {
      setErrorMessage('Le résumé court (chapô) est obligatoire.');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Le contenu de l’actualité est obligatoire.');
      return;
    }
    if (imageUrl.trim() && !imageAlt.trim()) {
      setErrorMessage('Veuillez renseigner un texte alternatif pour décrire l’image (accessibilité obligatoire).');
      return;
    }

    const formData = new FormData();
    if (initialData?.id) formData.append('id', initialData.id);
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('categoryId', categoryId);
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('imageUrl', imageUrl);
    formData.append('imageAlt', imageAlt);
    formData.append('status', activeStatus);
    formData.append('isFeatured', isFeatured ? 'true' : 'false');
    formData.append('publishedAt', publishedAt);

    startTransition(async () => {
      const res = await saveNewsAction(null, formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.success) {
        setSuccessMessage(
          activeStatus === 'PUBLISHED'
            ? 'Actualité publiée avec succès sur le site !'
            : 'Brouillon enregistré avec succès.'
        );
        setTimeout(() => {
          router.push('/admin/actualites');
          router.refresh();
        }, 1200);
      }
    });
  };

  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name || 'Actualité';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Barre de retour et actions d'en-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          href="/admin/actualites"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary-blue)', fontWeight: 600, textDecoration: 'none' }}
        >
          <ArrowLeft size={16} />
          <span>Retour aux actualités</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="btn btn-outline"
            style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', minHeight: 'auto' }}
          >
            <Eye size={16} />
            <span>Aperçu</span>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit('DRAFT')}
            className="btn"
            style={{
              backgroundColor: '#e7e6ea',
              color: 'var(--color-text-main)',
              padding: '0.6rem 1rem',
              fontSize: '0.9rem',
              minHeight: 'auto'
            }}
          >
            <Save size={16} />
            <span>Enregistrer brouillon</span>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit('PUBLISHED')}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', minHeight: 'auto' }}
          >
            <Send size={16} />
            <span>{isPending ? 'Enregistrement...' : 'Publier'}</span>
          </button>
        </div>
      </div>

      {/* Messages d'alerte */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            border: '1px solid #f5c6cb',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            border: '1px solid #c3e6cb',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Formulaire principal */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Titre */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="title" style={{ display: 'block', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Titre de l'actualité *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Réouverture des cours de langue arabe pour enfants"
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
            Un titre clair et direct, sans abréviation.
          </span>
        </div>

        {/* Ligne : Catégorie & Date */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
          <div>
            <label htmlFor="category" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Catégorie *
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                backgroundColor: '#fff'
              }}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Permet de classer l'annonce pour les visiteurs.
            </span>
          </div>

          <div>
            <label htmlFor="publishedAt" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Date affichée *
            </label>
            <input
              id="publishedAt"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Date visible par les fidèles sur l'article.
            </span>
          </div>
        </div>

        {/* Chapô / Résumé court */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="excerpt" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Résumé court (chapô) *
          </label>
          <textarea
            id="excerpt"
            rows={2}
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Une ou deux phrases résumant l'annonce principale..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            Ce texte apparaît sur la carte d'accueil et dans les résultats de recherche.
          </span>
        </div>

        {/* Éditeur de contenu avec barre d'outils simplifiée (§7) */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="content-textarea" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Contenu de l'article *
          </label>

          {/* Barre d'outils de mise en forme sobre */}
          <div
            style={{
              display: 'flex',
              gap: '0.25rem',
              padding: '0.4rem',
              backgroundColor: '#f1f0f5',
              border: '1px solid var(--color-border)',
              borderBottom: 'none',
              borderTopLeftRadius: 'var(--radius-sm)',
              borderTopRightRadius: 'var(--radius-sm)',
              alignItems: 'center'
            }}
            role="toolbar"
            aria-label="Outils de mise en forme du texte"
          >
            <button
              type="button"
              onClick={() => insertFormatting('**', '**')}
              title="Mettre en gras"
              style={{ padding: '0.35rem 0.6rem', border: 'none', background: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*')}
              title="Mettre en italique"
              style={{ padding: '0.35rem 0.6rem', border: 'none', background: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('### ')}
              title="Sous-titre de section"
              style={{ padding: '0.35rem 0.6rem', border: 'none', background: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Heading size={15} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('- ')}
              title="Liste à puces"
              style={{ padding: '0.35rem 0.6rem', border: 'none', background: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <List size={15} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('[', '](https://...)')}
              title="Ajouter un lien"
              style={{ padding: '0.35rem 0.6rem', border: 'none', background: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <LinkIcon size={15} />
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: 'auto', paddingRight: '0.5rem' }}>
              Mise en page automatique
            </span>
          </div>

          <textarea
            id="content-textarea"
            rows={10}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Rédigez ici le détail de votre actualité..."
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderBottomLeftRadius: 'var(--radius-sm)',
              borderBottomRightRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontSize: '1rem',
              lineHeight: '1.6',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            Vous pouvez créer des paragraphes en sautant simplement une ligne. Pas de code HTML autorisé.
          </span>
        </div>

        {/* Image d'illustration & texte alternatif */}
        <div style={{ backgroundColor: '#faf9fc', border: '1px solid var(--color-border-light)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
            <ImageIcon size={18} />
            <span>Image d'illustration (facultative)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '0.75rem' }}>
            <div>
              <label htmlFor="imageUrl" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--color-text-main)' }}>
                Adresse de l'image (URL)
              </label>
              <input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/provisoires/actu-cours.jpg ou /uploads/..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label htmlFor="imageAlt" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--color-text-main)' }}>
                Description de l'image (texte alternatif)
              </label>
              <input
                id="imageAlt"
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Ex : Salle de cours avec supports d'apprentissage"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Pour importer une nouvelle photo, utilisez la rubrique <strong>Médiathèque</strong> puis copiez le lien ici.
          </span>
        </div>

        {/* Options de visibilité & Statut */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-primary-blue)' }}>
              Statut de publication
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="statusOption"
                  value="DRAFT"
                  checked={status === 'DRAFT'}
                  onChange={() => setStatus('DRAFT')}
                />
                <span><strong>Brouillon</strong> (non visible par les fidèles)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="statusOption"
                  value="PUBLISHED"
                  checked={status === 'PUBLISHED'}
                  onChange={() => setStatus('PUBLISHED')}
                />
                <span><strong>Publié</strong> (en ligne immédiatement)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="statusOption"
                  value="ARCHIVED"
                  checked={status === 'ARCHIVED'}
                  onChange={() => setStatus('ARCHIVED')}
                />
                <span><strong>Archivé</strong> (retiré du site sans suppression)</span>
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-primary-blue)' }}>
              Mise en avant
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <div>
                <strong>Afficher à la une sur l'accueil</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Apparaît en priorité dans le carrousel ou la première carte de l'accueil.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Bloc Options avancées replié (§7) */}
        <details style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
          <summary style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            Options avancées (Identifiant d'adresse URL)
          </summary>
          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="slug" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--color-text-main)' }}>
              Adresse simplifiée (slug)
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="reouverture-cours-arabe-enfants"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontSize: '0.9rem',
                fontFamily: 'inherit'
              }}
            />
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Laisser vide pour générer automatiquement à partir du titre.
            </span>
          </div>
        </details>
      </div>

      {/* Modal d'aperçu fidèle (§7) */}
      {showPreview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu avant publication"
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-cream)',
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid var(--color-gold)'
            }}
          >
            {/* Barre de titre de la modale */}
            <div
              style={{
                padding: '1rem 1.5rem',
                backgroundColor: 'var(--color-primary-blue)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={18} color="var(--color-gold)" />
                <strong>Aperçu : Rendu public de l'actualité</strong>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                aria-label="Fermer l'aperçu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Corps de l'aperçu */}
            <div style={{ padding: '2rem' }}>
              <div className="card" style={{ maxWidth: '750px', margin: '0 auto', overflow: 'hidden' }}>
                {imageUrl && (
                  <div style={{ width: '100%', maxHeight: '350px', overflow: 'hidden', backgroundColor: '#e0dcd5' }}>
                    <img
                      src={imageUrl}
                      alt={imageAlt || 'Illustration actualité'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge badge-gold">{selectedCategoryName}</span>
                    {isFeatured && <span className="badge badge-blue">À la une</span>}
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(publishedAt))}
                    </span>
                  </div>

                  <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title || 'Titre de l’actualité'}</h1>

                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-primary-blue)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                    {excerpt || 'Résumé court de l’actualité...'}
                  </p>

                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: 'var(--color-text-main)' }}>
                    {content || 'Contenu détaillé de l’actualité...'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="btn btn-primary"
                  style={{ minHeight: 'auto', padding: '0.6rem 1.5rem' }}
                >
                  Fermer l'aperçu et continuer la rédaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
