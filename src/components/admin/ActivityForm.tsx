'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveActivityAction } from '@/app/admin/activites/actions';
import { Save, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ActivityData {
  id?: string;
  title?: string;
  description?: string;
  schedule?: string;
  order?: number;
  isActive?: boolean;
  imageUrl?: string | null;
  imageAlt?: string | null;
}

interface ActivityFormProps {
  initialData?: ActivityData;
}

export default function ActivityForm({ initialData }: ActivityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [schedule, setSchedule] = useState(initialData?.schedule || '');
  const [order, setOrder] = useState(initialData?.order?.toString() || '0');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim() || !description.trim() || !schedule.trim()) {
      setErrorMessage('Le titre, la description et les jours/horaires sont obligatoires.');
      return;
    }

    const formData = new FormData();
    if (initialData?.id) formData.append('id', initialData.id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('schedule', schedule);
    formData.append('order', order);
    formData.append('isActive', isActive ? 'true' : 'false');
    formData.append('imageUrl', imageUrl);
    formData.append('imageAlt', imageAlt);

    startTransition(async () => {
      const res = await saveActivityAction(null, formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage('Activité enregistrée avec succès.');
        setTimeout(() => {
          router.push('/admin/activites');
          router.refresh();
        }, 1200);
      }
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link
          href="/admin/activites"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary-blue)', fontWeight: 600, textDecoration: 'none' }}
        >
          <ArrowLeft size={16} />
          <span>Retour aux activités</span>
        </Link>

        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', minHeight: 'auto' }}
        >
          <Save size={16} />
          <span>{isPending ? 'Enregistrement...' : 'Enregistrer'}</span>
        </button>
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
          <label htmlFor="title" style={{ display: 'block', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Intitulé de l'activité ou du cours *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Cours d'apprentissage et de récitation du Saint Coran"
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
          />
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="schedule" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Jours et horaires (texte libre) *
          </label>
          <input
            id="schedule"
            type="text"
            required
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="Ex : Mercredi et Samedi de 14h00 à 16h30"
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
          />
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            Indiquez clairement les créneaux pour les enfants ou adultes.
          </span>
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="desc" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
            Description de l'activité *
          </label>
          <textarea
            id="desc"
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Objectifs, niveau requis, enseignant, matériel nécessaire..."
            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.95rem', lineHeight: '1.6' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
          <div>
            <label htmlFor="order" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              Ordre d'affichage
            </label>
            <input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
            />
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Plus le chiffre est petit, plus l'activité apparaît en haut (ex : 1, 2, 3).
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Statut
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Activité active (affichée sur le site)</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '1.5rem' }}>
          <div>
            <label htmlFor="imgUrl" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              Photo d'illustration (URL facultative)
            </label>
            <input
              id="imgUrl"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/provisoires/activite-solidarite.jpg"
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label htmlFor="imgAlt" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              Texte alternatif
            </label>
            <input
              id="imgAlt"
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Ex : Enfants en séance d'apprentissage"
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
