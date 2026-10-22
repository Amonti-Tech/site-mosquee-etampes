'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export interface ActivityActionState {
  error?: string | null;
  success?: boolean;
}

/**
 * Enregistre (création ou modification) une activité
 */
export async function saveActivityAction(
  prevState: ActivityActionState | null,
  formData: FormData
): Promise<ActivityActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Vous devez être connecté.' };
  }

  const id = (formData.get('id') as string)?.trim() || null;
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const schedule = (formData.get('schedule') as string)?.trim();
  const order = parseInt((formData.get('order') as string) || '0', 10);
  const isActive = formData.get('isActive') === 'on' || formData.get('isActive') === 'true';
  const imageUrl = (formData.get('imageUrl') as string)?.trim() || null;
  const imageAlt = (formData.get('imageAlt') as string)?.trim() || null;

  if (!title) {
    return { error: 'Le titre de l’activité est obligatoire.' };
  }
  if (!description) {
    return { error: 'La description de l’activité est obligatoire.' };
  }
  if (!schedule) {
    return { error: 'Les jours et horaires sont obligatoires.' };
  }

  try {
    let activity;
    if (id) {
      activity = await prisma.activity.update({
        where: { id },
        data: {
          title,
          description,
          schedule,
          order,
          isActive,
          imageUrl,
          imageAlt
        }
      });

      await logAudit({
        userId: user.userId,
        userName: user.name,
        userEmail: user.email,
        action: 'UPDATE_ACTIVITY',
        entity: 'Activity',
        entityId: activity.id,
        details: `Modification de l'activité: "${title}"`
      });
    } else {
      activity = await prisma.activity.create({
        data: {
          title,
          description,
          schedule,
          order,
          isActive,
          imageUrl,
          imageAlt
        }
      });

      await logAudit({
        userId: user.userId,
        userName: user.name,
        userEmail: user.email,
        action: 'CREATE_ACTIVITY',
        entity: 'Activity',
        entityId: activity.id,
        details: `Création de l'activité: "${title}"`
      });
    }

    revalidatePath('/activites');
    revalidatePath('/');
    revalidatePath('/admin/activites');

    return { success: true };
  } catch (err) {
    console.error('Erreur enregistrement activité:', err);
    return { error: 'Une erreur est survenue lors de l’enregistrement de l’activité.' };
  }
}

/**
 * Supprime une activité
 */
export async function deleteActivityAction(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { success: false, error: 'Action réservée aux administrateurs.' };
  }

  try {
    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Activité introuvable' };

    await prisma.activity.delete({ where: { id } });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_ACTIVITY',
      entity: 'Activity',
      entityId: id,
      details: `Suppression de l'activité "${existing.title}"`
    });

    revalidatePath('/activites');
    revalidatePath('/');
    revalidatePath('/admin/activites');
    return { success: true };
  } catch {
    return { success: false, error: 'Erreur lors de la suppression' };
  }
}
