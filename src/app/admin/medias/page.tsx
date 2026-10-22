import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import MediaUploader from '@/components/admin/MediaUploader';
import { Image as ImageIcon, Trash2, Copy, Info } from 'lucide-react';
import { deleteMediaAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminMediasPage() {
  const user = await requireAuth();
  const isAdmin = user.role === 'ADMIN';

  const mediaList = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    include: { uploadedBy: true }
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-blue)', marginBottom: '0.25rem' }}>
          Médiathèque
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Stockage sécurisé des visuels du site. Les images importées ici sont nettoyées de toute géolocalisation et prêtes à être intégrées dans vos actualités et pages.
        </p>
      </div>

      {/* Formulaire de téléversement sécurisé */}
      <MediaUploader />

      {/* Galerie des images importées */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--color-primary-blue)' }}>
          Images téléversées ({mediaList.length})
        </h2>

        {mediaList.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {mediaList.map((m) => {
              const url = `/uploads/${m.filename}`;
              const sizeKb = Math.round(m.size / 1024);

              return (
                <div
                  key={m.id}
                  style={{
                    border: '1px solid var(--color-border-light)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '160px', backgroundColor: '#eee' }}>
                    <img
                      src={url}
                      alt={m.altText}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary-blue)', wordBreak: 'break-all', marginBottom: '0.35rem' }}>
                      {m.originalName}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      {m.width && m.height ? `${m.width}×${m.height} px • ` : ''}
                      {sizeKb} Ko
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-main)', marginBottom: '1rem', flexGrow: 1 }}>
                      <strong>Alt :</strong> {m.isDecorative ? <em>(Décorative)</em> : m.altText}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                        {url}
                      </span>

                      {isAdmin && (
                        <form action={async () => {
                          'use server';
                          await deleteMediaAction(m.id);
                        }}>
                          <button
                            type="submit"
                            title="Supprimer l'image"
                            style={{ padding: '0.3rem 0.5rem', background: '#fff', border: '1px solid #ffcdd2', borderRadius: '4px', cursor: 'pointer', color: '#d32f2f' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', padding: '1rem 0' }}>
            Aucune image n'a encore été importée par un bénévole.
          </p>
        )}
      </div>

      {/* Rappel des images provisoires du site (§3) */}
      <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fcfbfa', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-primary-blue)' }}>
          <Info size={18} color="var(--color-gold)" />
          <h3 style={{ fontSize: '1.1rem', marginBottom: 0 }}>Images d'illustration provisoires (§3)</h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          Conformément au cahier des charges, 6 visuels libres de droits sont utilisés temporairement pendant le développement (façade, intérieur, cours, conférence, solidarité). Ils devront être remplacés par les photos officielles de la mosquée avant la mise en ligne publique.
        </p>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
          Consultez le fichier <code>CREDITS_IMAGES.md</code> pour le détail des attributions et licences.
        </span>
      </div>
    </div>
  );
}
