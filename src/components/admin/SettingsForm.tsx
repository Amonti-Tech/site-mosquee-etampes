'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateSettingsAction } from '@/app/admin/parametres/actions';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Bell,
  Building,
  Image as ImageIcon,
  Info
} from 'lucide-react';

interface SettingsData {
  officialName: string;
  address: string;
  whatsapp: string;
  email: string | null;
  description: string;
  heroBannerUrl: string;
  interiorPhotoUrl: string;
  announcementActive: boolean;
  announcementText: string | null;
  announcementLink: string | null;
  announcementEndDate: Date | string | null;
}

interface SettingsFormProps {
  settings: SettingsData;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // States
  const [officialName, setOfficialName] = useState(settings.officialName);
  const [address, setAddress] = useState(settings.address);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email || '');
  const [description, setDescription] = useState(settings.description);
  const [heroBannerUrl, setHeroBannerUrl] = useState(settings.heroBannerUrl);
  const [interiorPhotoUrl, setInteriorPhotoUrl] = useState(settings.interiorPhotoUrl);

  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText || '');
  const [announcementLink, setAnnouncementLink] = useState(settings.announcementLink || '');
  const [announcementEndDate, setAnnouncementEndDate] = useState(
    settings.announcementEndDate
      ? new Date(settings.announcementEndDate).toISOString().slice(0, 16)
      : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('officialName', officialName);
    formData.append('address', address);
    formData.append('whatsapp', whatsapp);
    formData.append('email', email);
    formData.append('description', description);
    formData.append('heroBannerUrl', heroBannerUrl);
    formData.append('interiorPhotoUrl', interiorPhotoUrl);

    formData.append('announcementActive', announcementActive ? 'true' : 'false');
    formData.append('announcementText', announcementText);
    formData.append('announcementLink', announcementLink);
    formData.append('announcementEndDate', announcementEndDate);

    startTransition(async () => {
      const res = await updateSettingsAction(null, formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage('Paramètres et bandeau d’annonce mis à jour avec succès.');
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Messages */}
      {errorMessage && (
        <div role="alert" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f5c6cb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div role="status" style={{ backgroundColor: '#d4edda', color: '#155724', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #c3e6cb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. Bandeau d'annonce d'urgence ou exceptionnelle (§7) */}
      <div className="card" style={{ padding: '2rem', borderLeft: '4px solid var(--color-gold)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--color-primary-blue)' }}>
          <Bell size={22} color="var(--color-gold)" />
          <h2 style={{ fontSize: '1.3rem', marginBottom: 0 }}>Bandeau d'annonce (Accueil)</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Affichez un message prioritaire visible tout en haut du site (ex : horaire de la prière de l'Aïd, annonce de travaux, etc.).
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem 1rem', backgroundColor: announcementActive ? '#fef8f2' : '#faf9fc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
            <input
              type="checkbox"
              checked={announcementActive}
              onChange={(e) => setAnnouncementActive(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <div>
              <strong style={{ color: 'var(--color-primary-blue)' }}>Activer le bandeau d'annonce sur l'accueil</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Lorsqu'il est activé, il apparaît en haut de la page au-dessus du bandeau principal.
              </div>
            </div>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', opacity: announcementActive ? 1 : 0.6 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="announcementText" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Texte de l'annonce *
            </label>
            <input
              id="announcementText"
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Ex : Prière de l'Aïd Al-Fitr : 1re prière à 07h30, 2e prière à 08h45"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label htmlFor="announcementLink" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              Lien de destination (facultatif)
            </label>
            <input
              id="announcementLink"
              type="text"
              value={announcementLink}
              onChange={(e) => setAnnouncementLink(e.target.value)}
              placeholder="/actualites/horaires-priere-aid ou /evenements"
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label htmlFor="announcementEndDate" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              Date d'expiration automatique (facultatif)
            </label>
            <input
              id="announcementEndDate"
              type="datetime-local"
              value={announcementEndDate}
              onChange={(e) => setAnnouncementEndDate(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
            />
          </div>
        </div>
      </div>

      {/* 2. Coordonnées officielles (§4) */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--color-primary-blue)' }}>
          <Building size={22} />
          <h2 style={{ fontSize: '1.3rem', marginBottom: 0 }}>Coordonnées officielles de la mosquée</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Ces informations sont répercutées automatiquement sur tout le site (en-tête, pied de page, données structurées SEO).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label htmlFor="officialName" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Nom officiel du lieu de culte *
            </label>
            <input
              id="officialName"
              type="text"
              required
              value={officialName}
              onChange={(e) => setOfficialName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
            />
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Le nom validé est « Mosquée d'Etampes Centre », à ne pas raccourcir.
            </span>
          </div>

          <div>
            <label htmlFor="address" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Adresse postale *
            </label>
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label htmlFor="whatsapp" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Numéro WhatsApp officiel *
            </label>
            <input
              id="whatsapp"
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
            />
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Sert pour le bouton d'accès rapide WhatsApp.
            </span>
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              E-mail officiel de contact
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="[À COMPLÉTER]"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
            />
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Tant que ce champ est vide, le formulaire de contact reste désactivé (§9).
            </span>
          </div>
        </div>
      </div>

      {/* 3. Visuels principaux (§3) */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--color-primary-blue)' }}>
          <ImageIcon size={22} />
          <h2 style={{ fontSize: '1.3rem', marginBottom: 0 }}>Visuels de référence</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Remplacez les visuels provisoires par les photos officielles de la mosquée dès qu'elles sont disponibles.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label htmlFor="heroBannerUrl" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              Photo d'en-tête (façade extérieure)
            </label>
            <input
              id="heroBannerUrl"
              type="text"
              value={heroBannerUrl}
              onChange={(e) => setHeroBannerUrl(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label htmlFor="interiorPhotoUrl" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              Photo de l'intérieur (salle de prière)
            </label>
            <input
              id="interiorPhotoUrl"
              type="text"
              value={interiorPhotoUrl}
              onChange={(e) => setInteriorPhotoUrl(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
            />
          </div>
        </div>
      </div>

      {/* Bouton d'enregistrement général */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary"
          style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
        >
          <Save size={18} />
          <span>{isPending ? 'Enregistrement en cours...' : 'Enregistrer tous les paramètres'}</span>
        </button>
      </div>
    </form>
  );
}
