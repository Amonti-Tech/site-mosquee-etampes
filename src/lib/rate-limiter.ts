/**
 * Module de limitation des tentatives de connexion (Rate Limiting)
 * Protection anti-brute-force par IP et par identifiant de compte (§8)
 */

interface RateLimitRecord {
  attempts: number;
  blockedUntil: number | null;
  firstAttemptAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5; // 5 tentatives échouées max
const WINDOW_MS = 15 * 60 * 1000; // Fenêtre de 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // Blocage pendant 15 minutes

export function checkRateLimit(key: string): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Vérifier si le compte/IP est actuellement bloqué
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // Si la fenêtre de 15 minutes est expirée, réinitialiser
  if (now - record.firstAttemptAt > WINDOW_MS) {
    memoryStore.delete(key);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

export function recordFailedAttempt(key: string): { blocked: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = memoryStore.get(key) || {
    attempts: 0,
    blockedUntil: null,
    firstAttemptAt: now
  };

  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    memoryStore.set(key, record);
    return { blocked: true, remainingAttempts: 0, retryAfterSeconds: Math.ceil(BLOCK_DURATION_MS / 1000) };
  }

  memoryStore.set(key, record);
  return { blocked: false, remainingAttempts: MAX_ATTEMPTS - record.attempts };
}

export function resetRateLimit(key: string): void {
  memoryStore.delete(key);
}

// Fonction de nettoyage régulier des clés expirées
export function cleanupRateLimiter(): void {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (record.blockedUntil && record.blockedUntil <= now && now - record.firstAttemptAt > WINDOW_MS) {
      memoryStore.delete(key);
    } else if (!record.blockedUntil && now - record.firstAttemptAt > WINDOW_MS) {
      memoryStore.delete(key);
    }
  }
}
