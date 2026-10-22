import { redirect } from 'next/navigation';
import { getCurrentUser, SessionPayload } from '@/lib/auth';

/**
 * Exige une authentification valide côté serveur.
 * Redirige vers /admin/login si non authentifié.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }
  return user;
}

/**
 * Exige le rôle ADMINISTRATEUR côté serveur (§8).
 * Les éditeurs ne peuvent accéder ni aux comptes, ni aux paramètres, ni au journal.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') {
    redirect('/admin?erreur=acces_refuse');
  }
  return user;
}

export function isAdmin(user: SessionPayload | null): boolean {
  return user?.role === 'ADMIN';
}

export function isEditor(user: SessionPayload | null): boolean {
  return user?.role === 'EDITOR' || user?.role === 'ADMIN';
}
