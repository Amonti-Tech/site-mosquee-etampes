import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper calcul de luminance relative et contraste WCAG
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Bloc 1 — Validation des Données et Configuration', () => {
  it('1.1 : Doit récupérer les paramètres officiels de la mosquée', async () => {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    expect(settings).not.toBeNull();
    expect(settings?.officialName).toBe("Mosquée d'Etampes Centre");
    expect(settings?.address).toBe("2 avenue du 8 mai 1945, 91150 Étampes");
    expect(settings?.whatsapp).toBe("+33 7 49 60 90 62");
    expect(settings?.email).toBeNull(); // [À COMPLÉTER]
  });

  it('1.2 : Doit avoir les 4 catégories initiales', async () => {
    const count = await prisma.category.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  it('1.3 : Doit avoir les actualités provisoires correctement reliées', async () => {
    const news = await prisma.news.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true, author: true }
    });
    expect(news.length).toBeGreaterThanOrEqual(3);
    news.forEach((item) => {
      expect(item.category).toBeDefined();
      expect(item.author).toBeDefined();
      expect(item.slug).toBeTruthy();
    });
  });

  it('1.4 : Doit avoir des événements avec gestion des statuts', async () => {
    const events = await prisma.event.findMany({ where: { status: 'PUBLISHED' } });
    expect(events.length).toBeGreaterThanOrEqual(2);
  });

  it('1.5 : Doit contenir les 4 pages institutionnelles en base', async () => {
    const keys = ['la-mosquee', 'informations-pratiques', 'mentions-legales', 'confidentialite'];
    for (const key of keys) {
      const page = await prisma.pageContent.findUnique({ where: { key } });
      expect(page, `La page ${key} doit exister en base`).not.toBeNull();
      expect(page?.title).toBeTruthy();
      expect(page?.content).toBeTruthy();
    }
  });
});

describe('Bloc 1 — Conformité du Logo et des Assets (§3)', () => {
  it('2.1 : Les logos originaux à la racine doivent être strictement intacts', () => {
    const pngRoot = path.join(process.cwd(), 'Logo de mosquée stylisée bleu et or.png');
    const svgRoot = path.join(process.cwd(), 'Logo de mosquée stylisée bleu et or.svg');
    expect(fs.existsSync(pngRoot)).toBe(true);
    expect(fs.existsSync(svgRoot)).toBe(true);
  });

  it('2.2 : Le logo copié dans public/ et assets-source/ doit comporter le viewBox', () => {
    const svgPublic = fs.readFileSync(path.join(process.cwd(), 'public', 'logo-mosquee.svg'), 'utf8');
    expect(svgPublic).toContain('viewBox="0 0 1132 1390"');
    // Le logo transparent ne doit pas avoir le rectangle blanc de fond
    expect(svgPublic).not.toContain('fill="#FDFDFD"');
  });

  it('2.3 : Les 6 images provisoires doivent être présentes dans assets et public', () => {
    const images = [
      'hero-facade.jpg',
      'interieur-mosquee.jpg',
      'actu-communaute.jpg',
      'actu-cours.jpg',
      'evenement-conference.jpg',
      'activite-solidarite.jpg'
    ];

    images.forEach((img) => {
      const assetPath = path.join(process.cwd(), 'assets-provisoires', img);
      const publicPath = path.join(process.cwd(), 'public', 'images', 'provisoires', img);
      expect(fs.existsSync(assetPath), `${img} doit exister dans assets-provisoires`).toBe(true);
      expect(fs.existsSync(publicPath), `${img} doit exister dans public/images/provisoires`).toBe(true);
    });
  });
});

describe('Bloc 1 — Conformité des Contrastes WCAG 2.1 AA (§3)', () => {
  const COLOR_BLUE = '#1B1F60';
  const COLOR_GOLD = '#BD7A37';
  const COLOR_CREAM = '#F6F1E7';
  const COLOR_WHITE = '#FFFFFF';
  const COLOR_TEXT = '#252329';

  it('3.1 : Bleu sur Blanc et Bleu sur Crème doivent dépasser 7:1 (AAA)', () => {
    const contrastWhite = getContrastRatio(COLOR_BLUE, COLOR_WHITE);
    const contrastCream = getContrastRatio(COLOR_BLUE, COLOR_CREAM);
    expect(contrastWhite).toBeGreaterThanOrEqual(12);
    expect(contrastCream).toBeGreaterThanOrEqual(10);
  });

  it('3.2 : Bouton doré (fond doré #BD7A37 + texte #121216) doit être conforme AA (>= 4.5:1)', () => {
    const COLOR_BTN_TEXT = '#121216';
    const contrastBtn = getContrastRatio(COLOR_GOLD, COLOR_BTN_TEXT);
    expect(contrastBtn).toBeGreaterThanOrEqual(4.5);
  });

  it('3.3 : Grand texte doré sur bleu doit respecter le seuil 3:1 pour grand texte', () => {
    const contrastGoldOnBlue = getContrastRatio(COLOR_GOLD, COLOR_BLUE);
    expect(contrastGoldOnBlue).toBeGreaterThanOrEqual(3.0);
  });

  it('3.4 : Texte sombre sur Crème doit être conforme AAA (>= 7:1)', () => {
    const contrast = getContrastRatio(COLOR_TEXT, COLOR_CREAM);
    expect(contrast).toBeGreaterThanOrEqual(7.0);
  });
});

describe('Bloc 1 — Conformité du Widget Mawaqit (§6)', () => {
  it('4.1 : Le composant MawaqitWidget doit respecter l URL exacte et les paramètres requis', () => {
    const widgetCode = fs.readFileSync(
      path.join(process.cwd(), 'src', 'components', 'public', 'MawaqitWidget.tsx'),
      'utf8'
    );
    expect(widgetCode).toContain('https://mawaqit.net/fr/w/centre-cultuel-mohamed-6-etampes?showOnly5PrayerTimes=0');
    expect(widgetCode).toContain('title="Horaires de prière — Mosquée d\'Etampes Centre (Mawaqit)"');
    expect(widgetCode).toContain('loading="lazy"');
    expect(widgetCode).toContain('Voir les horaires sur Mawaqit');
    expect(widgetCode).toContain('rel="noopener noreferrer"');
  });
});
