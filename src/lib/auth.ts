import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

const COOKIE_NAME = 'mosquee_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_fallback_secret_key_32_chars_minimum_2026';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR';
  exp: number;
}

/**
 * Signe un payload de session avec HMAC SHA-256
 */
function signPayload(data: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
}

/**
 * Encode et signe le jeton de session
 */
export function createSessionToken(payload: Omit<SessionPayload, 'exp'>): string {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 // 7 jours
  };
  const jsonStr = JSON.stringify(fullPayload);
  const encoded = Buffer.from(jsonStr).toString('base64url');
  const signature = signPayload(encoded);
  return `${encoded}.${signature}`;
}

/**
 * Vérifie et décode le jeton de session
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encoded, signature] = parts;
    const expectedSig = signPayload(encoded);

    // Comparaison constante pour prévenir les attaques temporelles (timing attacks)
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const jsonStr = Buffer.from(encoded, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr) as SessionPayload;

    // Vérification de l'expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Écrit le cookie de session sécurisé (HttpOnly, SameSite, Secure)
 */
export async function setSessionCookie(payload: Omit<SessionPayload, 'exp'>): Promise<void> {
  const token = createSessionToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 3600 // 7 jours
  });
}

/**
 * Supprime le cookie de session lors de la déconnexion
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
}

/**
 * Récupère l'utilisateur actuellement authentifié depuis le cookie de session
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie?.value) return null;

    const payload = verifySessionToken(sessionCookie.value);
    if (!payload) return null;

    // Vérifier en base que le compte existe et est toujours actif
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) return null;

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'EDITOR',
      exp: payload.exp
    };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
