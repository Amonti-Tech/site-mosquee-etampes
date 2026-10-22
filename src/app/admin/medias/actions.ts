'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

/**
 * Supprime un média (ADMIN UNIQUEMENT, §8)
 */
export async function deleteMediaAction(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { success: false, error: 'La suppression de médias est réservée aux administrateurs.' };
  }

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return { success: false, error: 'Média introuvable' };
    }

    // Supprimer le fichier sur le disque
    const filePath = path.join(process.cwd(), 'public', 'uploads', media.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Impossible de supprimer le fichier disque:', err);
      }
    }

    await prisma.media.delete({ where: { id } });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_MEDIA',
      entity: 'Media',
      entityId: id,
      details: `Suppression du média "${media.originalName}" (${media.filename})`
    });

    revalidatePath('/admin/medias');
    return { success: true };
  } catch (err) {
    console.error('Erreur suppression média:', err);
    return { success: false, error: 'Erreur lors de la suppression du média' };
  }
}
