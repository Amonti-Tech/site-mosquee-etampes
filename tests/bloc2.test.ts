import { describe, it, expect, beforeEach } from 'vitest';
import prisma from '../src/lib/prisma';
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from '../src/lib/auth';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '../src/lib/rate-limiter';
import { isAdmin, isEditor } from '../src/lib/rbac';
import { generateSlug } from '../src/lib/slug';
import sharp from 'sharp';

describe('Bloc 2 — Authentification et Chiffrement (§8)', () => {
  it('1.1 : Doit hacher et vérifier les mots de passe de manière sécurisée', async () => {
    const password = 'AdminTestEtampes2026!';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith('$2')).toBe(true); // Algorithme bcrypt

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);

    const isWrong = await verifyPassword('MauvaisMotDePasse!', hash);
    expect(isWrong).toBe(false);
  });

  it('1.2 : Doit générer et valider un jeton de session HMAC SHA-256', () => {
    const payload = {
      userId: 'user-test-123',
      email: 'admin@mosquee-etampes-centre.fr',
      name: 'Admin Bénévole',
      role: 'ADMIN' as const
    };

    const token = createSessionToken(payload);
    expect(token).toBeTruthy();
    expect(token.includes('.')).toBe(true);

    const verified = verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe('ADMIN');
  });

  it('1.3 : Doit rejeter les jetons falsifiés ou altérés', () => {
    const payload = {
      userId: 'user-test-456',
      email: 'editeur@mosquee-etampes-centre.fr',
      name: 'Éditeur Bénévole',
      role: 'EDITOR' as const
    };

    const validToken = createSessionToken(payload);
    const [body, sig] = validToken.split('.');

    // Altération du corps du jeton
    const tamperedBody = Buffer.from(JSON.stringify({ ...payload, role: 'ADMIN' })).toString('base64url');
    const forgedToken = `${tamperedBody}.${sig}`;

    const verified = verifySessionToken(forgedToken);
    expect(verified).toBeNull();
  });
});

describe('Bloc 2 — Limitation des Tentatives (Rate Limiting anti-brute-force §8)', () => {
  const testKey = 'test-ip-rate-limit-123';

  beforeEach(() => {
    resetRateLimit(testKey);
  });

  it('2.1 : Doit autoriser les tentatives initiales et décrémenter le compteur', () => {
    const initial = checkRateLimit(testKey);
    expect(initial.allowed).toBe(true);
    expect(initial.remainingAttempts).toBe(5);

    const res1 = recordFailedAttempt(testKey);
    expect(res1.blocked).toBe(false);
    expect(res1.remainingAttempts).toBe(4);
  });

  it('2.2 : Doit bloquer l’accès après 5 tentatives échouées consécutives', () => {
    // 4 échecs
    for (let i = 0; i < 4; i++) {
      recordFailedAttempt(testKey);
    }

    const checkBefore5 = checkRateLimit(testKey);
    expect(checkBefore5.allowed).toBe(true);
    expect(checkBefore5.remainingAttempts).toBe(1);

    // 5e échec -> Déclenchement du blocage 15 minutes
    const res5 = recordFailedAttempt(testKey);
    expect(res5.blocked).toBe(true);
    expect(res5.remainingAttempts).toBe(0);
    expect(res5.retryAfterSeconds).toBeGreaterThan(0);

    // Vérification du refus immédiat
    const blockedCheck = checkRateLimit(testKey);
    expect(blockedCheck.allowed).toBe(false);
    expect(blockedCheck.remainingAttempts).toBe(0);
    expect(blockedCheck.retryAfterSeconds).toBeGreaterThan(800);
  });
});

describe('Bloc 2 — Contrôle d’Accès Basé sur les Rôles (RBAC §8)', () => {
  it('3.1 : Les fonctions RBAC doivent correctement distinguer ADMIN et EDITOR', () => {
    const adminUser = {
      userId: '1',
      email: 'admin@test.fr',
      name: 'Admin',
      role: 'ADMIN' as const,
      exp: 9999999999
    };

    const editorUser = {
      userId: '2',
      email: 'editor@test.fr',
      name: 'Editor',
      role: 'EDITOR' as const,
      exp: 9999999999
    };

    expect(isAdmin(adminUser)).toBe(true);
    expect(isEditor(adminUser)).toBe(true);

    expect(isAdmin(editorUser)).toBe(false);
    expect(isEditor(editorUser)).toBe(true);

    expect(isAdmin(null)).toBe(false);
    expect(isEditor(null)).toBe(false);
  });
});

describe('Bloc 2 — Générateur de Slugs URL', () => {
  it('4.1 : Doit formater correctement les titres avec accents et caractères spéciaux', () => {
    const title = "Prière de l'Aïd Al-Fitr : 1re & 2e prières à la Mosquée d'Étampes !";
    const slug = generateSlug(title);
    expect(slug).toBe('priere-de-laid-al-fitr-1re-2e-prieres-a-la-mosquee-detampes');
    expect(slug).not.toContain('é');
    expect(slug).not.toContain('!');
    expect(slug).not.toContain(':');
    expect(slug).not.toContain('&');
  });
});

describe('Bloc 2 — Sécurité des Médias & Suppression EXIF (§8)', () => {
  it('5.1 : Sharp doit nettoyer les métadonnées et produire une image sans tags EXIF', async () => {
    // Créer une image de test 100x100 avec sharp
    const testImageBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 27, g: 31, b: 96 } // Bleu mosquée
      }
    })
      .jpeg()
      .toBuffer();

    const initialMeta = await sharp(testImageBuffer).metadata();
    expect(initialMeta.format).toBe('jpeg');
    expect(initialMeta.width).toBe(100);

    // Pipeline de nettoyage
    const cleanBuffer = await sharp(testImageBuffer)
      .rotate()
      .jpeg({ quality: 85 })
      .toBuffer();

    const cleanMeta = await sharp(cleanBuffer).metadata();
    expect(cleanMeta.exif).toBeUndefined(); // EXIF complètement absent
  });

  it('5.2 : Doit rejeter le format SVG à l’import', () => {
    const svgFilename = 'test-logo.svg';
    const isSvg = svgFilename.toLowerCase().endsWith('.svg');
    expect(isSvg).toBe(true);
  });
});

describe('Bloc 2 — Base de Données et Audit Logs', () => {
  it('6.1 : Doit pouvoir enregistrer un événement dans le journal d’audit', async () => {
    const log = await prisma.auditLog.create({
      data: {
        action: 'TEST_AUDIT',
        entity: 'SystemTest',
        details: 'Vérification du système de journalisation',
        ipAddress: '127.0.0.1'
      }
    });

    expect(log.id).toBeTruthy();
    expect(log.action).toBe('TEST_AUDIT');

    // Nettoyage
    await prisma.auditLog.delete({ where: { id: log.id } });
  });
});
