'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { setSessionCookie, clearSessionCookie, verifyPassword, getCurrentUser } from '@/lib/auth';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rate-limiter';
import { logAudit } from '@/lib/audit';

export interface ActionState {
  error?: string | null;
  success?: boolean;
}

/**
 * Action serveur de connexion à l'administration
 * Protégée par limitation de débit et journalisation d'audit (§8)
 */
export async function loginAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || '127.0.0.1';

  if (!email || !password) {
    return { error: 'Veuillez renseigner votre e-mail et votre mot de passe.' };
  }

  // 1. Vérification du Rate Limiting (par IP et par e-mail)
  const rateLimitIp = checkRateLimit(`ip:${ip}`);
  const rateLimitEmail = checkRateLimit(`email:${email}`);

  if (!rateLimitIp.allowed || !rateLimitEmail.allowed) {
    const retryAfter = Math.max(rateLimitIp.retryAfterSeconds || 0, rateLimitEmail.retryAfterSeconds || 0);
    return {
      error: `Trop de tentatives de connexion échouées. Par mesure de sécurité, votre accès est temporairement suspendu pour ${Math.ceil(retryAfter / 60)} minute(s).`
    };
  }

  // 2. Recherche du compte en base
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.isActive) {
    recordFailedAttempt(`ip:${ip}`);
    recordFailedAttempt(`email:${email}`);

    await logAudit({
      userEmail: email,
      action: 'LOGIN_FAILED',
      entity: 'User',
      details: 'Tentative avec e-mail inexistant ou compte inactif',
      ipAddress: ip
    });

    // Message générique pour éviter l'énumération des comptes (§8)
    return { error: 'Identifiants de connexion incorrects.' };
  }

  // 3. Vérification du mot de passe
  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    const attemptStatus = recordFailedAttempt(`email:${email}`);
    recordFailedAttempt(`ip:${ip}`);

    await logAudit({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'LOGIN_FAILED',
      entity: 'User',
      entityId: user.id,
      details: `Mot de passe erroné (restant : ${attemptStatus.remainingAttempts})`,
      ipAddress: ip
    });

    return { error: 'Identifiants de connexion incorrects.' };
  }

  // 4. Succès de connexion
  resetRateLimit(`ip:${ip}`);
  resetRateLimit(`email:${email}`);

  // Mise à jour de la dernière connexion
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  // Création du cookie de session sécurisé
  await setSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as 'ADMIN' | 'EDITOR'
  });

  await logAudit({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    action: 'LOGIN_SUCCESS',
    entity: 'User',
    entityId: user.id,
    details: `Connexion réussie (Rôle : ${user.role})`,
    ipAddress: ip
  });

  redirect('/admin');
}

/**
 * Action serveur de déconnexion
 */
export async function logoutAction(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'LOGOUT',
      entity: 'User',
      entityId: user.userId,
      details: 'Déconnexion volontaire'
    });
  }

  await clearSessionCookie();
  redirect('/admin/login');
}
