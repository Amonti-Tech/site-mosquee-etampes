import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function resolveDatabaseUrl(): string {
  // 1. Si une URL distante est définie (ex: PostgreSQL futur), l'utiliser directement
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // 2. Environnement Serverless (Netlify / AWS Lambda)
  // Dans Lambda, le répertoire d'exécution racine (/var/task) est en lecture seule.
  // SQLite a besoin d'écrire des verrous (-journal, -wal). On copie la base dans /tmp.
  const isServerless = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
  if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'mosquee.db');

    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'data', 'mosquee.db'),
        path.join(process.cwd(), 'data', 'mosquee.db'),
        path.resolve(__dirname, '../../../prisma/data/mosquee.db'),
        path.resolve(__dirname, '../../prisma/data/mosquee.db'),
        path.resolve(__dirname, '../prisma/data/mosquee.db'),
        path.resolve(__dirname, 'prisma/data/mosquee.db'),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          } catch (e) {
            console.error('Erreur lors de la copie de SQLite vers /tmp:', e);
          }
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  // 3. Repli local standard
  return process.env.DATABASE_URL || 'file:./data/mosquee.db';
}

const resolvedUrl = resolveDatabaseUrl();
process.env.DATABASE_URL = resolvedUrl;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

