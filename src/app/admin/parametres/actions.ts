'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export interface SettingsActionState {
  error?: string | null;
  success?: boolean;
}

/**
 * Met à jour les paramètres généraux et le bandeau d'annonce du site (§7)
 * STRICTEMENT RÉSERVÉ AUX ADMINISTRATEURS (§8)
 */
export async function updateSettingsAction(
  prevState: SettingsActionState | null,
  formData: FormData
): Promise<SettingsActionState> {
  const user = await requireAdmin();

  const officialName = (formData.get('officialName') as string)?.trim() || "Mosquée d'Etampes Centre";
  const address = (formData.get('address') as string)?.trim() || "2 avenue du 8 mai 1945, 91150 Étampes";
  const whatsapp = (formData.get('whatsapp') as string)?.trim() || "+33 7 49 60 90 62";
  const email = (formData.get('email') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim() || '';
  const heroBannerUrl = (formData.get('heroBannerUrl') as string)?.trim() || '/images/provisoires/hero-facade.jpg';
  const interiorPhotoUrl = (formData.get('interiorPhotoUrl') as string)?.trim() || '/images/provisoires/interieur-mosquee.jpg';

  // Bandeau d'annonce
  const announcementActive = formData.get('announcementActive') === 'on' || formData.get('announcementActive') === 'true';
  const announcementText = (formData.get('announcementText') as string)?.trim() || null;
  const announcementLink = (formData.get('announcementLink') as string)?.trim() || null;
  const announcementEndDateStr = (formData.get('announcementEndDate') as string)?.trim() || null;
  const announcementEndDate = announcementEndDateStr ? new Date(announcementEndDateStr) : null;

  if (announcementActive && !announcementText) {
    return { error: 'Veuillez saisir un texte pour le bandeau d’annonce actif.' };
  }

  try {
    const updated = await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: {
        officialName,
        address,
        whatsapp,
        email,
        description,
        heroBannerUrl,
        interiorPhotoUrl,
        announcementActive,
        announcementText,
        announcementLink,
        announcementEndDate
      },
      create: {
        id: 1,
        officialName,
        address,
        whatsapp,
        email,
        description,
        heroBannerUrl,
        interiorPhotoUrl,
        announcementActive,
        announcementText,
        announcementLink,
        announcementEndDate
      }
    });

    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'UPDATE_SETTING',
      entity: 'SiteSetting',
      entityId: '1',
      details: `Mise à jour des paramètres du site. Bandeau annonce actif : ${announcementActive ? 'OUI' : 'NON'}`
    });

    revalidatePath('/');
    revalidatePath('/informations-pratiques');
    revalidatePath('/contact');
    revalidatePath('/admin/parametres');
    revalidatePath('/admin');

    return { success: true };
  } catch (err) {
    console.error('Erreur mise à jour paramètres:', err);
    return { error: 'Une erreur est survenue lors de l’enregistrement des paramètres.' };
  }
}
