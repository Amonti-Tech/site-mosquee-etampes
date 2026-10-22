'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { generateSlug } from '@/lib/slug';

export interface EventActionState {
  error?: string | null;
  success?: boolean;
  eventId?: string;
}

/**
 * Enregistre (création ou mise à jour) un événement
 */
export async function saveEventAction(
  prevState: EventActionState | null,
  formData: FormData
): Promise<EventActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Vous devez être connecté pour effectuer cette action.' };
  }

  const id = (formData.get('id') as string)?.trim() || null;
  const title = (formData.get('title') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const startDateStr = formData.get('startDate') as string;
  const endDateStr = (formData.get('endDate') as string)?.trim() || null;
  const location = (formData.get('location') as string)?.trim() || "Mosquée d'Etampes Centre";
  const description = (formData.get('description') as string)?.trim();
  const imageUrl = (formData.get('imageUrl') as string)?.trim() || null;
  const imageAlt = (formData.get('imageAlt') as string)?.trim() || null;
  const status = (formData.get('status') as string) || 'PUBLISHED';
  const showOnHome = formData.get('showOnHome') === 'on' || formData.get('showOnHome') === 'true';

  if (!title) {
    return { error: 'Le titre de l’événement est obligatoire.' };
  }
  if (!startDateStr) {
    return { error: 'La date et l’heure de début sont obligatoires.' };
  }
  if (!description) {
    return { error: 'La description de l’événement est obligatoire.' };
  }
  if (imageUrl && !imageAlt) {
    return { error: 'Veuillez renseigner un texte alternatif décrivant l’image pour l’accessibilité.' };
  }

  if (!slug) {
    slug = generateSlug(title);
  } else {
    slug = generateSlug(slug);
  }

  // Vérification de collision de slug
  const existingSlug = await prisma.event.findFirst({
    where: {
      slug,
      ...(id ? { NOT: { id } } : {})
    }
  });

  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) {
    return { error: 'La date de début est invalide.' };
  }
  const endDate = endDateStr ? new Date(endDateStr) : null;
  if (endDate && isNaN(endDate.getTime())) {
    return { error: 'La date de fin est invalide.' };
  }

  try {
    let event;
    if (id) {
      event = await prisma.event.update({
        where: { id },
        data: {
          title,
          slug,
          startDate,
          endDate,
          location,
          description,
          imageUrl,
          imageAlt,
          status,
          showOnHome
        }
      });

      await logAudit({
        userId: user.userId,
        userName: user.name,
        userEmail: user.email,
        action: 'UPDATE_EVENT',
        entity: 'Event',
        entityId: event.id,
        details: `Modification de l'événement: "${title}"`
      });
    } else {
      event = await prisma.event.create({
        data: {
          title,
          slug,
          startDate,
          endDate,
          location,
          description,
          imageUrl,
          imageAlt,
          status,
          showOnHome
        }
      });

      await logAudit({
        userId: user.userId,
        userName: user.name,
        userEmail: user.email,
        action: 'CREATE_EVENT',
        entity: 'Event',
        entityId: event.id,
        details: `Création de l'événement: "${title}"`
      });
    }

    revalidatePath('/evenements');
    revalidatePath('/');
    revalidatePath('/admin/evenements');
    revalidatePath('/admin');

    return { success: true, eventId: event.id };
  } catch (err: unknown) {
    console.error('Erreur enregistrement événement:', err);
    return { error: 'Une erreur est survenue lors de l’enregistrement de l’événement.' };
  }
}

/**
 * Dépublie un événement (le repasse en brouillon)
 */
export async function unpublishEventAction(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Non autorisé' };
  }

  try {
    const event = await prisma.event.update({
      where: { id },
      data: { status: 'DRAFT' }
    });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'UNPUBLISH_EVENT',
      entity: 'Event',
      entityId: event.id,
      details: `Remise en brouillon de l'événement "${event.title}"`
    });

    revalidatePath('/evenements');
    revalidatePath('/');
    revalidatePath('/admin/evenements');
    return { success: true };
  } catch {
    return { success: false, error: 'Erreur lors de la modification' };
  }
}

/**
 * Supprime définitivement un événement (ADMIN UNIQUEMENT, §7 et §8)
 */
export async function deleteEventAction(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { success: false, error: 'La suppression définitive est réservée aux administrateurs.' };
  }

  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Événement introuvable' };
    }

    await prisma.event.delete({ where: { id } });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_EVENT',
      entity: 'Event',
      entityId: id,
      details: `Suppression définitive de l'événement "${existing.title}"`
    });

    revalidatePath('/evenements');
    revalidatePath('/');
    revalidatePath('/admin/evenements');
    return { success: true };
  } catch {
    return { success: false, error: 'Erreur lors de la suppression' };
  }
}
