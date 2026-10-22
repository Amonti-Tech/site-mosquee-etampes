'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveEventAction } from '@/app/admin/evenements/actions';
import {
  Eye,
  Save,
  Send,
  ArrowLeft,
  Calendar,
  MapPin,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

interface EventData {
  id?: string;
  title?: string;
  slug?: string;
  startDate?: Date | string;
  endDate?: Date | string | null;
  location?: string;
  description?: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  status?: string;
  showOnHome?: boolean;
}

interface EventFormProps {
  initialData?: EventData;
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');

  // Format date helper: YYYY-MM-DDTHH:mm
  const formatForInput = (d?: Date | string | null) => {
    if (!d) return '';
    const date = new Date(d);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const [startDate, setStartDate] = useState(
    initialData?.startDate ? formatForInput(initialData.startDate) : ''
  );
  const [endDate, setEndDate] = useState(
    initialData?.endDate ? formatForInput(initialData.endDate) : ''
  );
  const [location, setLocation] = useState(initialData?.location || "Mosquée d'Etampes Centre");
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '');
  const [status, setStatus] = useState(initialData?.status || 'PUBLISHED');
  const [showOnHome, setShowOnHome] = useState(initialData?.showOnHome ?? true);

  // Aperçu
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (targetStatus?: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const activeStatus = targetStatus || status;

    if (!title.trim()) {
      setErrorMessage('Le titre de l’événement est obligatoire.');
      return;
    }
    if (!startDate) {
      setErrorMessage('La date et l’heure de début sont obligatoires.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('La description de l’événement est obligatoire.');
      return;
    }
    if (imageUrl.trim() && !imageAlt.trim()) {
      setErrorMessage('Veuillez renseigner un texte alternatif décrivant l’image pour l’accessibilité.');
      return;
    }

    const formData = new FormData();
    if (initialData?.id) formData.append('id', initialData.id);
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('startDate', startDate);
    if (endDate) formData.append('endDate', endDate);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('imageUrl', imageUrl);
    formData.append('imageAlt', imageAlt);
    formData.append('status', activeStatus);
    formData.append('showOnHome', showOnHome ? 'true' : 'false');

    startTransition(async () => {
      const res = await saveEventAction(null, formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.success) {
        setSuccessMessage(
          activeStatus === 'PUBLISHED'
            ? 'Événement publié avec succès !'
            : 'Événement enregistré avec succès.'
        );
        setTimeout(() => {
          router.push('/admin/evenements');
          router.refresh();
        }, 1200);
      }
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Barre de navigation et actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          href="/admin/evenements"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary-blue)', fontWeight: 600, textDecoration: 'none' }}
        >
          <ArrowLeft size={16} />
          <span>Retour aux événements</span>
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

      {/* Messages */}
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

      {/* Formulaire */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Titre */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="title" style={{ display: 'block', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Titre de l'événement *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Grande conférence : Comprendre le mois de Ramadan"
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
            Indiquez le nom officiel de la rencontre ou de la célébration.
          </span>
        </div>

        {/* Date début & fin */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
          <div>
            <label htmlFor="startDate" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Date et heure de début *
            </label>
            <input
              id="startDate"
              type="datetime-local"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              Moment où débute le rassemblement.
            </span>
          </div>

          <div>
            <label htmlFor="endDate" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Date et heure de fin (facultative)
            </label>
            <input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
              Laisser vide si la durée n'est pas fixe.
            </span>
          </div>
        </div>

        {/* Lieu */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="location" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Lieu de l'événement
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Mosquée d'Etampes Centre ou salle extérieure"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.4rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
            <MapPin size={17} color="var(--color-text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            Par défaut : Mosquée d'Etampes Centre.
          </span>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="description" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Description de l'événement *
          </label>
          <textarea
            id="description"
            rows={6}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Intervenant, programme, public concerné, informations pratiques..."
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            Détaillez le programme pour les fidèles.
          </span>
        </div>

        {/* Image */}
        <div style={{ backgroundColor: '#faf9fc', border: '1px solid var(--color-border-light)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
            <ImageIcon size={18} />
            <span>Affiche ou illustration (facultative)</span>
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
                placeholder="/images/provisoires/evenement-conference.jpg"
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
                placeholder="Ex : Affiche de la conférence du 15 mai"
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
        </div>

        {/* Statut & Accueil */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-primary-blue)' }}>
              Statut
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="eventStatus"
                  value="PUBLISHED"
                  checked={status === 'PUBLISHED'}
                  onChange={() => setStatus('PUBLISHED')}
                />
                <span><strong>Publié</strong> (visible sur la page Événements)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="eventStatus"
                  value="DRAFT"
                  checked={status === 'DRAFT'}
                  onChange={() => setStatus('DRAFT')}
                />
                <span><strong>Brouillon</strong> (en attente de confirmation)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="eventStatus"
                  value="ARCHIVED"
                  checked={status === 'ARCHIVED'}
                  onChange={() => setStatus('ARCHIVED')}
                />
                <span><strong>Archivé</strong></span>
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-primary-blue)' }}>
              Visibilité sur la page d'accueil
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showOnHome}
                onChange={(e) => setShowOnHome(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <div>
                <strong>Afficher parmi les 3 prochains événements</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Visible directement dès la page d'accueil.
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Modale d'aperçu de l'événement */}
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
          aria-label="Aperçu de l'événement"
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-cream)',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid var(--color-gold)'
            }}
          >
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
                <strong>Aperçu public de l'événement</strong>
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

            <div style={{ padding: '2rem' }}>
              <div className="card" style={{ maxWidth: '700px', margin: '0 auto', overflow: 'hidden' }}>
                {imageUrl && (
                  <div style={{ width: '100%', maxHeight: '300px', overflow: 'hidden', backgroundColor: '#eee' }}>
                    <img src={imageUrl} alt={imageAlt || title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-gold">Événement</span>
                    {showOnHome && <span className="badge badge-blue">Accueil</span>}
                  </div>

                  <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-primary-blue)' }}>
                    {title || 'Titre de l’événement'}
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} color="var(--color-primary-blue)" />
                      <strong>
                        {startDate
                          ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(startDate))
                          : 'Date non définie'}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} color="var(--color-primary-blue)" />
                      <span>{location}</span>
                    </div>
                  </div>

                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'var(--color-text-main)' }}>
                    {description || 'Description complète de la rencontre...'}
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
                  Fermer l'aperçu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
