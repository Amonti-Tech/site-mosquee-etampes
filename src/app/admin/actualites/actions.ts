'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { generateSlug } from '@/lib/slug';

export interface NewsActionState {
  error?: string | null;
  success?: boolean;
  newsId?: string;
}

/**
 * Enregistre (création ou mise à jour) une actualité
 */
export async function saveNewsAction(
  prevState: NewsActionState | null,
  formData: FormData
): Promise<NewsActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Vous devez être connecté pour effectuer cette action.' };
  }

  const id = (formData.get('id') as string)?.trim() || null;
  const title = (formData.get('title') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const categoryId = (formData.get('categoryId') as string)?.trim();
  const excerpt = (formData.get('excerpt') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const imageUrl = (formData.get('imageUrl') as string)?.trim() || null;
  const imageAlt = (formData.get('imageAlt') as string)?.trim() || null;
  const status = (formData.get('status') as string) || 'DRAFT';
  const isFeatured = formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true';
  const publishedAtStr = formData.get('publishedAt') as string;

  if (!title) {
    return { error: 'Le titre de l’actualité est obligatoire.' };
  }
  if (!categoryId) {
    return { error: 'Veuillez sélectionner une catégorie.' };
  }
  if (!excerpt) {
    return { error: 'Le résumé court (chapô) est obligatoire.' };
  }
  if (!content) {
    return { error: 'Le contenu de l’actualité est obligatoire.' };
  }

  // Si l'image est fournie, vérifier la présence du texte alternatif
  if (imageUrl && !imageAlt) {
    return { error: 'Veuillez renseigner un texte alternatif décrivant l’image pour l’accessibilité.' };
  }

  if (!slug) {
    slug = generateSlug(title);
  } else {
    slug = generateSlug(slug);
  }

  // Vérification de collision de slug
  const existingSlug = await prisma.news.findFirst({
    where: {
      slug,
      ...(id ? { NOT: { id } } : {})
    }
  });

  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const publishedAt = publishedAtStr ? new Date(publishedAtStr) : new Date();

  try {
    let news;
    if (id) {
      news = await prisma.news.update({
        where: { id },
        data: {
          title,
          slug,
          excerpt,
          content,
          imageUrl,
          imageAlt,
          categoryId,
          status,
          isFeatured,
          publishedAt
        }
      });

      await logAudit({
        userId: user.userId,
        userName: user.name,
        userEmail: user.email,
        action: 'UPDATE_NEWS',
        entity: 'News',
        entityId: news.id,
        details: `Modification de l'actualité: "${title}" (statut: ${status})`
      });
    } else {
      news = await prisma.news.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          imageUrl,
          imageAlt,
          categoryId,
          status,
          isFeatured,
          publishedAt,
          authorId: user.userId
        }
      });

      await logAudit({
        userId: user.userId,
        userName: user.name,
        userEmail: user.email,
        action: 'CREATE_NEWS',
        entity: 'News',
        entityId: news.id,
        details: `Création de l'actualité: "${title}" (statut: ${status})`
      });
    }

    revalidatePath('/actualites');
    revalidatePath(`/actualites/${news.slug}`);
    revalidatePath('/');
    revalidatePath('/admin/actualites');
    revalidatePath('/admin');

    return { success: true, newsId: news.id };
  } catch (err: unknown) {
    console.error('Erreur enregistrement actualité:', err);
    return { error: 'Une erreur est survenue lors de l’enregistrement de l’actualité.' };
  }
}

/**
 * Dépublie une actualité (la repasse en brouillon)
 */
export async function unpublishNewsAction(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Non autorisé' };
  }

  try {
    const news = await prisma.news.update({
      where: { id },
      data: { status: 'DRAFT' }
    });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'UNPUBLISH_NEWS',
      entity: 'News',
      entityId: news.id,
      details: `Dépublication (remise en brouillon) de "${news.title}"`
    });

    revalidatePath('/actualites');
    revalidatePath(`/actualites/${news.slug}`);
    revalidatePath('/');
    revalidatePath('/admin/actualites');
    return { success: true };
  } catch {
    return { success: false, error: 'Erreur lors de la dépublication' };
  }
}

/**
 * Archive une actualité
 */
export async function archiveNewsAction(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Non autorisé' };
  }

  try {
    const news = await prisma.news.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'ARCHIVE_NEWS',
      entity: 'News',
      entityId: news.id,
      details: `Archivage de "${news.title}"`
    });

    revalidatePath('/actualites');
    revalidatePath(`/actualites/${news.slug}`);
    revalidatePath('/');
    revalidatePath('/admin/actualites');
    return { success: true };
  } catch {
    return { success: false, error: 'Erreur lors de l’archivage' };
  }
}

/**
 * Supprime définitivement une actualité (ADMIN UNIQUEMENT, §7 et §8)
 */
export async function deleteNewsAction(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { success: false, error: 'La suppression définitive est strictement réservée à l’administrateur.' };
  }

  try {
    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Actualité introuvable' };
    }

    await prisma.news.delete({ where: { id } });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_NEWS',
      entity: 'News',
      entityId: id,
      details: `Suppression définitive de "${existing.title}"`
    });

    revalidatePath('/actualites');
    revalidatePath('/');
    revalidatePath('/admin/actualites');
    return { success: true };
  } catch {
    return { success: false, error: 'Erreur lors de la suppression' };
  }
}
