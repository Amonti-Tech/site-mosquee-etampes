'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export interface PageActionState {
  error?: string | null;
  success?: boolean;
}

/**
 * Met à jour le contenu d'une page institutionnelle
 */
export async function savePageAction(
  prevState: PageActionState | null,
  formData: FormData
): Promise<PageActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Vous devez être connecté pour effectuer cette action.' };
  }

  const key = (formData.get('key') as string)?.trim();
  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const metaTitle = (formData.get('metaTitle') as string)?.trim() || null;
  const metaDescription = (formData.get('metaDescription') as string)?.trim() || null;

  if (!key || !title || !content) {
    return { error: 'Le titre et le contenu sont obligatoires.' };
  }

  try {
    const page = await prisma.pageContent.upsert({
      where: { key },
      update: {
        title,
        content,
        metaTitle,
        metaDescription
      },
      create: {
        key,
        title,
        content,
        metaTitle,
        metaDescription
      }
    });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'UPDATE_PAGE',
      entity: 'PageContent',
      entityId: page.id,
      details: `Mise à jour du texte de la page "${key}"`
    });

    revalidatePath(`/${key}`);
    revalidatePath('/');
    revalidatePath('/admin/pages');

    return { success: true };
  } catch (err) {
    console.error('Erreur mise à jour page:', err);
    return { error: 'Une erreur est survenue lors de la sauvegarde de la page.' };
  }
}
