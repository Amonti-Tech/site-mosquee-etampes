'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

export default function MediaUploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [isDecorative, setIsDecorative] = useState(false);
  const [author, setAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setErrorMessage(null);
      setLastUploadedUrl(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLastUploadedUrl(null);

    if (!file) {
      setErrorMessage('Veuillez sélectionner un fichier image.');
      return;
    }

    if (!isDecorative && !altText.trim()) {
      setErrorMessage('Le texte alternatif est obligatoire pour décrire l’image (accessibilité), ou cochez "Image décorative".');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', altText);
    formData.append('isDecorative', isDecorative ? 'true' : 'false');
    if (author.trim()) formData.append('author', author.trim());

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Erreur lors du téléversement.');
      } else {
        setLastUploadedUrl(data.url);
        setFile(null);
        setAltText('');
        setIsDecorative(false);
        setAuthor('');
        router.refresh();
      }
    } catch {
      setErrorMessage('Impossible de joindre le serveur pour le téléversement.');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--color-primary-blue)' }}>
        Ajouter une photo à la médiathèque
      </h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Les images sont automatiquement sécurisées, optimisées et nettoyées de toutes métadonnées confidentielles (GPS).
      </p>

      {errorMessage && (
        <div role="alert" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #f5c6cb', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <AlertCircle size={17} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {lastUploadedUrl && (
        <div role="status" style={{ backgroundColor: '#d4edda', color: '#155724', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #c3e6cb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '0.9rem' }}>Image téléversée avec succès : <strong>{lastUploadedUrl}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(lastUploadedUrl)}
            className="btn-outline"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', minHeight: 'auto', backgroundColor: '#fff' }}
          >
            {copied ? <Check size={14} color="#2e7d32" /> : <Copy size={14} />}
            <span>{copied ? 'Copié !' : 'Copier l’adresse'}</span>
          </button>
        </div>
      )}

      <form onSubmit={handleUpload}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {/* Sélection de fichier */}
          <div>
            <label htmlFor="media-file" style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Fichier image (JPG, PNG ou WebP, max 5 Mo) *
            </label>
            <input
              id="media-file"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              required
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '0.55rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                backgroundColor: '#fff'
              }}
            />
          </div>

          {/* Description / Alt text */}
          <div>
            <label htmlFor="media-alt" style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem', color: 'var(--color-primary-blue)' }}>
              Description de l'image (texte alternatif) *
            </label>
            <input
              id="media-alt"
              type="text"
              disabled={isDecorative}
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder={isDecorative ? 'Image déclarée purement décorative' : 'Ex : Rassemblement des fidèles pour la prière'}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                backgroundColor: isDecorative ? '#f0eff4' : '#fff'
              }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isDecorative}
                onChange={(e) => setIsDecorative(e.target.checked)}
              />
              <span>Image purement décorative (sans information pour les lecteurs d'écran)</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
          <div style={{ maxWidth: '340px' }}>
            <label htmlFor="media-author" style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.2rem', color: 'var(--color-text-muted)' }}>
              Crédit photo / Auteur (facultatif)
            </label>
            <input
              id="media-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex : Mosquée d'Etampes Centre ou nom du photographe"
              style={{ width: '100%', padding: '0.45rem 0.7rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', minHeight: 'auto', opacity: isUploading || !file ? 0.6 : 1 }}
          >
            <UploadCloud size={18} />
            <span>{isUploading ? 'Sécurisation et téléversement...' : 'Téléverser l’image'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
