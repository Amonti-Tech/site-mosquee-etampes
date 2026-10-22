import prisma from '@/lib/prisma';

// Données par défaut fiables servant de repli si la base SQLite est indisponible ou en froid
export const DEFAULT_SITE_SETTINGS = {
  id: 1,
  officialName: "Mosquée d'Etampes Centre",
  address: "2 avenue du 8 mai 1945, 91150 Étampes",
  whatsapp: "+33 7 49 60 90 62",
  email: null,
  logoUrl: "/logo-mosquee.svg",
  heroBannerUrl: "/images/provisoires/hero-facade.jpg",
  interiorPhotoUrl: "/images/provisoires/interieur-mosquee.jpg",
  description: "Site officiel de la Mosquée d'Etampes Centre. Horaires de prière, vie de la communauté, cours et informations pratiques.",
  announcementActive: false,
  announcementText: null,
  announcementLink: null,
  announcementEndDate: null,
  updatedAt: new Date()
};

export const DEFAULT_CATEGORIES = [
  { id: 'cat-vie', name: 'Vie de la mosquée', slug: 'vie-de-la-mosquee', order: 1 },
  { id: 'cat-events', name: 'Événements & Conférences', slug: 'evenements-conferences', order: 2 },
  { id: 'cat-solidarite', name: 'Solidarité & Entraide', slug: 'solidarite-entraide', order: 3 },
  { id: 'cat-enseignement', name: 'Enseignement & Jeunesse', slug: 'enseignement-jeunesse', order: 4 }
];

export const DEFAULT_NEWS = [
  {
    id: 'news-1',
    title: "Bienvenue sur le site de la Mosquée d'Etampes Centre",
    slug: 'bienvenue-sur-le-site-de-la-mosquee-d-etampes-centre',
    excerpt: "[Contenu provisoire] La Mosquée d'Etampes Centre met à disposition ce nouvel espace pour consulter les horaires de prière et suivre la vie de l'association.",
    content: `<p><strong>[Contenu provisoire]</strong></p><p>Chers fidèles, chers concitoyens d'Étampes et des environs,</p><p>Nous sommes heureux de vous accueillir sur l'espace d'information numérique de la <strong>Mosquée d'Etampes Centre</strong>.</p><p>Cet outil a été conçu pour permettre à chacun de consulter simplement les horaires de prière en temps réel, de rester informé des cours et conférences, et de prendre part aux actions solidaires organisées tout au long de l'année.</p><p><em>Les textes définitifs de présentation de notre communauté seront validés et mis à jour très prochainement.</em></p>`,
    imageUrl: '/images/provisoires/actu-communaute.jpg',
    imageAlt: "Accueil et convivialité au sein de la mosquée",
    categoryId: 'cat-vie',
    category: { name: 'Vie de la mosquée', slug: 'vie-de-la-mosquee' },
    status: 'PUBLISHED',
    isFeatured: true,
    publishedAt: new Date(),
    author: { name: 'Administrateur Bénévoles' }
  },
  {
    id: 'news-2',
    title: "Reprise des cours et ateliers d'apprentissage",
    slug: 'reprise-des-cours-et-ateliers-d-apprentissage',
    excerpt: "[Contenu provisoire] Informations concernant le calendrier des inscriptions aux cours pour enfants et adultes.",
    content: `<p><strong>[Contenu provisoire]</strong></p><p>Les ateliers d'apprentissage et cours de langue arabe et de mémorisation reprennent leurs activités.</p><p>Les inscriptions se font auprès de l'équipe pédagogique après les prières ou en contactant les référents via WhatsApp.</p>`,
    imageUrl: '/images/provisoires/actu-cours.jpg',
    imageAlt: "Support de lecture et espace d'étude",
    categoryId: 'cat-enseignement',
    category: { name: 'Enseignement & Jeunesse', slug: 'enseignement-jeunesse' },
    status: 'PUBLISHED',
    isFeatured: false,
    publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    author: { name: 'Administrateur Bénévoles' }
  },
  {
    id: 'news-3',
    title: "Action solidarité et soutien aux familles",
    slug: 'action-solidarite-et-soutien-aux-familles',
    excerpt: "[Contenu provisoire] Collecte et distribution de colis de première nécessité pour les familles dans le besoin à Étampes.",
    content: `<p><strong>[Contenu provisoire]</strong></p><p>L'équipe solidaire de la Mosquée d'Etampes Centre organise une collecte de denrées non périssables et de produits d'hygiène.</p><p>Merci à tous les donateurs et bénévoles pour leur dévouement et leur générosité constante au service de tous.</p>`,
    imageUrl: '/images/provisoires/activite-solidarite.jpg',
    imageAlt: "Partage de denrées et solidarité",
    categoryId: 'cat-solidarite',
    category: { name: 'Solidarité & Entraide', slug: 'solidarite-entraide' },
    status: 'PUBLISHED',
    isFeatured: false,
    publishedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
    author: { name: 'Administrateur Bénévoles' }
  }
];

export const DEFAULT_EVENTS = [
  {
    id: 'ev-1',
    title: "Rencontre communautaire et échange fraternel",
    slug: 'rencontre-communautaire-et-echange',
    description: "[Contenu provisoire] Une après-midi d'échange et de convivialité ouverte à tous les membres de la communauté.",
    startDate: new Date(Date.now() + 10 * 24 * 3600 * 1000),
    location: "Grande salle de la Mosquée d'Etampes Centre",
    imageUrl: '/images/provisoires/evenement-conference.jpg',
    imageAlt: "Salle de conférence et rencontre",
    status: 'PUBLISHED',
    showOnHome: true
  }
];

export const DEFAULT_ACTIVITIES = [
  {
    id: 'act-cours-enfants',
    title: "Enseignement et cours pour enfants",
    description: "[Contenu provisoire] Apprentissage des bases de la lecture, de la langue arabe et des valeurs civiques et spirituelles.",
    schedule: "Samedis et dimanches de 10h00 à 12h30",
    imageUrl: '/images/provisoires/actu-cours.jpg',
    imageAlt: "Salle d'apprentissage pour les jeunes",
    order: 1,
    isActive: true
  },
  {
    id: 'act-solidarite',
    title: "Pôle Solidarité et Entraide",
    description: "[Contenu provisoire] Organisation des distributions alimentaires, vestimentaires et accompagnement social des personnes isolées.",
    schedule: "Permanence le premier dimanche de chaque mois de 14h00 à 17h00",
    imageUrl: '/images/provisoires/activite-solidarite.jpg',
    imageAlt: "Pôle d'entraide et de solidarité",
    order: 2,
    isActive: true
  },
  {
    id: 'act-cours-adultes',
    title: "Conférences et cercles d'études pour adultes",
    description: "[Contenu provisoire] Rencontres hebdomadaires consacrées à la compréhension des textes, à l'éthique et au vivre-ensemble.",
    schedule: "Tous les vendredis soir après la prière d'Al-Icha",
    imageUrl: '/images/provisoires/interieur-mosquee.jpg',
    imageAlt: "Salle de prière et de recueillement",
    order: 3,
    isActive: true
  }
];

export const DEFAULT_PAGE_CONTENTS: Record<string, { title: string; content: string; metaTitle?: string; metaDescription?: string }> = {
  'la-mosquee': {
    title: "La Mosquée d'Etampes Centre",
    content: `<p><strong>[Contenu provisoire - En attente des textes officiels de la mosquée]</strong></p>
<h2>Notre Histoire</h2>
<p>Implantée au cœur d'Étampes, au 2 avenue du 8 mai 1945, la Mosquée d'Etampes Centre est un lieu de culte, de paix, de rencontre et d'entraide pour l'ensemble de la communauté musulmane étampoise et des communes environnantes.</p>
<h2>Notre Mission</h2>
<p>L'association a pour vocation de permettre l'exercice du culte dans un cadre digne, serein et conforme aux lois républicaines. Elle s'attache également à développer des actions éducatives, culturelles et caritatives favorisant le dialogue, la solidarité et l'épanouissement de la jeunesse.</p>
<h2>Un lieu ouvert et fraternel</h2>
<p>Fidèle aux valeurs de fraternité et d'ouverture, notre mosquée accueille les fidèles pour les cinq prières quotidiennes ainsi que pour la grande prière du vendredi (Jumu'a).</p>`,
    metaTitle: "La Mosquée d'Etampes Centre — Histoire et Mission",
    metaDescription: "Présentation de la Mosquée d'Etampes Centre : histoire, mission cultuelle, éducative et sociale au service des fidèles d'Étampes."
  },
  'informations-pratiques': {
    title: "Informations pratiques & Accès",
    content: `<h2>Adresse & Coordonnées</h2>
<p><strong>Mosquée d'Etampes Centre</strong><br/>
2 avenue du 8 mai 1945<br/>
91150 Étampes, France</p>
<p>WhatsApp officiel : <strong>+33 7 49 60 90 62</strong><br/>
E-mail officiel : <em>[À COMPLÉTER par la mosquée]</em></p>

<h2>Horaires d'ouverture</h2>
<p>La mosquée est ouverte pour l'ensemble des prières quotidiennes selon le calendrier Mawaqit affiché en page d'accueil.<br/>
<em>[Horaires détaillés d'ouverture des locaux à compléter par la mosquée]</em></p>

<h2>Accès et Transports</h2>
<p>La mosquée est accessible :</p>
<ul>
  <li><strong>En train / RER :</strong> RER C et Ligne TER Paris-Austerlitz, gare d'Étampes (puis bus ou marche à pied).</li>
  <li><strong>En bus :</strong> Réseau de bus local d'Étampes, arrêts à proximité de l'avenue du 8 mai 1945.</li>
  <li><strong>En voiture :</strong> Accès direct via RN20. Stationnement dans les voies environnantes.</li>
</ul>`,
    metaTitle: "Informations pratiques & Accès — Mosquée d'Etampes Centre",
    metaDescription: "Coordonnées, horaires d'ouverture et itinéraires d'accès à la Mosquée d'Etampes Centre."
  },
  'mentions-legales': {
    title: "Mentions Légales",
    content: `<h2>1. Éditeur du site</h2>
<p>Le présent site est édité par l'association gestionnaire de la <strong>Mosquée d'Etampes Centre</strong>.<br/>
Adresse : 2 avenue du 8 mai 1945, 91150 Étampes.<br/>
Contact : Via WhatsApp au +33 7 49 60 90 62.</p>
<h2>2. Hébergement</h2>
<p>Ce site est hébergé sur une infrastructure sécurisée et performante (Netlify Inc., San Francisco, CA).</p>
<h2>3. Propriété intellectuelle</h2>
<p>L'ensemble des contenus (textes, logos, photographies provisoires et éléments graphiques) est protégé par le droit d'auteur. Toute reproduction sans autorisation préalable est interdite.</p>`
  },
  'confidentialite': {
    title: "Politique de Confidentialité",
    content: `<h2>Protection des données personnelles</h2>
<p>Le site de la Mosquée d'Etampes Centre applique les principes de minimisation des données (RGPD).</p>
<h2>Cookies et traceurs</h2>
<p>Ce site ne dépose aucun cookie publicitaire ni traceur tiers intrusif. Le widget Mawaqit intégré fonctionne de manière autonome pour la diffusion des horaires rituels.</p>
<h2>Vos droits</h2>
<p>Pour toute question relative à la protection de vos données, vous pouvez contacter les responsables via notre numéro WhatsApp officiel.</p>`
  }
};

/**
 * Récupère les paramètres du site de manière tolérante aux pannes
 */
export async function getPublicSettings() {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 1 }
    });
    return settings || DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.warn('[public-data] Fallback paramètres site actif suite à une exception:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Récupère toutes les catégories actives
 */
export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' }
    });
    return categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  } catch (error) {
    console.warn('[public-data] Fallback catégories actif:', error);
    return DEFAULT_CATEGORIES;
  }
}

/**
 * Récupère les actualités publiées
 */
export async function getLatestNews(take = 3, categorySlug?: string) {
  try {
    const whereClause: { status: string; category?: { slug: string } } = {
      status: 'PUBLISHED'
    };
    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    const news = await prisma.news.findMany({
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
      take: take,
      include: { category: true, author: true }
    });

    if (news.length > 0) return news;
  } catch (error) {
    console.warn('[public-data] Fallback actualités actif:', error);
  }

  // Filtrage du fallback si slug fourni
  if (categorySlug) {
    return DEFAULT_NEWS.filter(n => n.category?.slug === categorySlug).slice(0, take);
  }
  return DEFAULT_NEWS.slice(0, take);
}

/**
 * Récupère un article par son slug
 */
export async function getNewsBySlug(slug: string) {
  try {
    const news = await prisma.news.findUnique({
      where: { slug },
      include: { category: true, author: true }
    });
    if (news && news.status === 'PUBLISHED') return news;
  } catch (error) {
    console.warn('[public-data] Fallback article individuel actif:', error);
  }

  const fallback = DEFAULT_NEWS.find(n => n.slug === slug);
  return fallback || null;
}

/**
 * Récupère les événements futurs
 */
export async function getPublicEvents(take?: number) {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        startDate: { gte: new Date() }
      },
      orderBy: { startDate: 'asc' },
      ...(take ? { take } : {})
    });
    if (events.length > 0) return events;
  } catch (error) {
    console.warn('[public-data] Fallback événements à venir actif:', error);
  }

  return take ? DEFAULT_EVENTS.slice(0, take) : DEFAULT_EVENTS;
}

/**
 * Récupère les événements passés
 */
export async function getPastEvents(take = 6) {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        startDate: { lt: new Date() }
      },
      orderBy: { startDate: 'desc' },
      take
    });
    return events;
  } catch (error) {
    console.warn('[public-data] Fallback événements passés actif:', error);
    return [];
  }
}

/**
 * Récupère les activités régulières
 */
export async function getPublicActivities(take?: number) {
  try {
    const activities = await prisma.activity.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      ...(take ? { take } : {})
    });
    if (activities.length > 0) return activities;
  } catch (error) {
    console.warn('[public-data] Fallback activités actif:', error);
  }

  return take ? DEFAULT_ACTIVITIES.slice(0, take) : DEFAULT_ACTIVITIES;
}

/**
 * Récupère le contenu d'une page institutionnelle
 */
export async function getPublicPageContent(key: string) {
  try {
    const page = await prisma.pageContent.findUnique({
      where: { key }
    });
    if (page) return page;
  } catch (error) {
    console.warn(`[public-data] Fallback page ${key} actif:`, error);
  }

  const fallback = DEFAULT_PAGE_CONTENTS[key];
  if (fallback) {
    return {
      id: `fallback-${key}`,
      key,
      title: fallback.title,
      content: fallback.content,
      metaTitle: fallback.metaTitle || null,
      metaDescription: fallback.metaDescription || null,
      updatedAt: new Date()
    };
  }
  return null;
}
