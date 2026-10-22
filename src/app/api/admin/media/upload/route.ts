import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

// Constantes de sécurité strictes (§8)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo max
const ALLOWED_FORMATS = ['jpeg', 'png', 'webp'];

export async function POST(req: NextRequest) {
  // 1. Contrôle d'accès côté serveur
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Non autorisé. Vous devez être connecté.' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string)?.trim() || '';
    const isDecorative = formData.get('isDecorative') === 'true' || formData.get('isDecorative') === 'on';
    const author = (formData.get('author') as string)?.trim() || null;

    if (!file) {
      return NextResponse.json(
        { error: 'Veuillez sélectionner un fichier à téléverser.' },
        { status: 400 }
      );
    }

    // Validation de l'accessibilité : texte alternatif obligatoire sauf si déclaré décoratif (§7)
    if (!isDecorative && !altText) {
      return NextResponse.json(
        { error: 'Le texte alternatif est obligatoire pour décrire l’image aux malvoyants (ou cochez "Image purement décorative").' },
        { status: 400 }
      );
    }

    // 2. Vérification de la taille maximale (5 Mo)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Le fichier dépasse la taille maximale autorisée de 5 Mo.' },
        { status: 400 }
      );
    }

    // 3. Rejet formel du format SVG à l'import (§8 : "SVG refusé à l'import")
    const originalNameLower = file.name.toLowerCase();
    if (
      originalNameLower.endsWith('.svg') ||
      file.type === 'image/svg+xml'
    ) {
      return NextResponse.json(
        { error: 'Le format vectoriel SVG est formellement refusé à l’import par mesure de sécurité (§8).' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Vérification textuelle additionnelle contre les faux fichiers SVG déguisés
    const bufferHead = buffer.slice(0, 100).toString('utf8').toLowerCase();
    if (bufferHead.includes('<svg') || bufferHead.includes('<?xml')) {
      return NextResponse.json(
        { error: 'Fichier non conforme ou script XML/SVG détecté. Seuls JPG, PNG et WebP sont acceptés.' },
        { status: 400 }
      );
    }

    // 4. Analyse des magic bytes et métadonnées réelles via sharp
    let metadata: sharp.Metadata;
    try {
      metadata = await sharp(buffer).metadata();
    } catch {
      return NextResponse.json(
        { error: 'Le fichier n’est pas une image valide ou est corrompu.' },
        { status: 400 }
      );
    }

    const format = metadata.format?.toLowerCase();
    if (!format || !ALLOWED_FORMATS.includes(format)) {
      return NextResponse.json(
        { error: `Format non supporté (${format || 'inconnu'}). Seuls JPG, PNG et WebP sont acceptés.` },
        { status: 400 }
      );
    }

    // 5. Ré-encodage, suppression intégrale des métadonnées EXIF/GPS (§8) et redimensionnement max
    let pipeline = sharp(buffer)
      .rotate() // Réoriente selon l'EXIF avant de la supprimer
      .resize({
        width: 2048,
        height: 2048,
        fit: 'inside',
        withoutEnlargement: true
      });

    // Suppression explicite de tout tag EXIF ou profil ICC confidentiel
    let extension = 'jpg';
    if (format === 'png') {
      pipeline = pipeline.png({ compressionLevel: 8 });
      extension = 'png';
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality: 85 });
      extension = 'webp';
    } else {
      pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
      extension = 'jpg';
    }

    const cleanBuffer = await pipeline.toBuffer();
    const cleanMeta = await sharp(cleanBuffer).metadata();

    // 6. Nom de fichier aléatoire sécurisé (UUID)
    const randomName = `${crypto.randomUUID()}.${extension}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const targetFilePath = path.join(uploadsDir, randomName);
    fs.writeFileSync(targetFilePath, cleanBuffer);

    const publicUrl = `/uploads/${randomName}`;

    // 7. Enregistrement en base de données
    const media = await prisma.media.create({
      data: {
        filename: randomName,
        originalName: file.name,
        mimeType: `image/${format === 'jpeg' ? 'jpeg' : format}`,
        size: cleanBuffer.length,
        width: cleanMeta.width || null,
        height: cleanMeta.height || null,
        altText: isDecorative ? 'Image décorative' : altText,
        isDecorative,
        author,
        uploadedById: user.userId
      }
    });

    // 8. Journalisation de sécurité
    await logAudit({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      action: 'UPLOAD_MEDIA',
      entity: 'Media',
      entityId: media.id,
      details: `Téléversement sécurisé de "${file.name}" -> ${randomName} (${cleanBuffer.length} octets, EXIF nettoyé)`
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      media
    });
  } catch (err: unknown) {
    console.error('Erreur API Upload média:', err);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors du traitement de l’image.' },
      { status: 500 }
    );
  }
}
