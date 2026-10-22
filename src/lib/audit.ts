import prisma from '@/lib/prisma';

export interface AuditLogInput {
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
}

/**
 * Journalise une action administrative ou de sécurité en base (§8)
 * Règle stricte : JAMAIS de mot de passe, de clé ou de jeton dans les détails.
 */
export async function logAudit(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId || null,
        userName: input.userName || null,
        userEmail: input.userEmail || null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId || null,
        details: input.details ? input.details.substring(0, 500) : null,
        ipAddress: input.ipAddress || null
      }
    });
  } catch (error) {
    console.error('Erreur journalisation audit:', error);
  }
}
