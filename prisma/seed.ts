import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Démarrage du seed de la base de données ---');

  // 1. Paramètres du site (singleton)
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      officialName: "Mosquée d'Etampes Centre",
      address: "2 avenue du 8 mai 1945, 91150 Étampes",
      whatsapp: "+33 7 49 60 90 62",
      email: null, // [À COMPLÉTER]
      logoUrl: "/logo-mosquee.svg",
      heroBannerUrl: "/images/provisoires/hero-facade.jpg",
      interiorPhotoUrl: "/images/provisoires/interieur-mosquee.jpg",
      description: "Site officiel de la Mosquée d'Etampes Centre. Horaires de prière, vie de la communauté, cours et informations pratiques.",
      announcementActive: false,
      announcementText: "[Contenu provisoire] Annonce exceptionnelle : réunion d'information samedi prochain.",
      announcementLink: "/actualites"
    }
  });

  // 2. Administrateur initial (mot de passe temporaire pour le développement local)
  const passwordHash = await bcrypt.hash('AdminEtampes2026!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mosquee-etampes-centre.fr' },
    update: {},
    create: {
      email: 'admin@mosquee-etampes-centre.fr',
      name: 'Administrateur Bénévoles',
      role: 'ADMIN',
      passwordHash: passwordHash,
      isActive: true
    }
  });

  // 3. Catégories initiales
  const catVie = await prisma.category.upsert({
    where: { slug: 'vie-de-la-mosquee' },
    update: {},
    create: { name: 'Vie de la mosquée', slug: 'vie-de-la-mosquee', order: 1 }
  });

  const catEvents = await prisma.category.upsert({
    where: { slug: 'evenements-conferences' },
    update: {},
    create: { name: 'Événements & Conférences', slug: 'evenements-conferences', order: 2 }
  });

  const catSolidarite = await prisma.category.upsert({
    where: { slug: 'solidarite-entraide' },
    update: {},
    create: { name: 'Solidarité & Entraide', slug: 'solidarite-entraide', order: 3 }
  });

  const catEnseignement = await prisma.category.upsert({
    where: { slug: 'enseignement-jeunesse' },
    update: {},
    create: { name: 'Enseignement & Jeunesse', slug: 'enseignement-jeunesse', order: 4 }
  });

  // 4. Actualités provisoires (neutres et clairement marquées)
  await prisma.news.upsert({
    where: { slug: 'bienvenue-sur-le-site-de-la-mosquee-d-etampes-centre' },
    update: {},
    create: {
      title: "Bienvenue sur le site de la Mosquée d'Etampes Centre",
      slug: 'bienvenue-sur-le-site-de-la-mosquee-d-etampes-centre',
      excerpt: "[Contenu provisoire] La Mosquée d'Etampes Centre met à disposition ce nouvel espace pour consulter les horaires de prière et suivre la vie de l'association.",
      content: `<p><strong>[Contenu provisoire]</strong></p><p>Chers fidèles, chers concitoyens d'Étampes et des environs,</p><p>Nous sommes heureux de vous accueillir sur l'espace d'information numérique de la <strong>Mosquée d'Etampes Centre</strong>.</p><p>Cet outil a été conçu pour permettre à chacun de consulter simplement les horaires de prière en temps réel, de rester informé des cours et conférences, et de prendre part aux actions solidaires organisées tout au long de l'année.</p><p><em>Les textes définitifs de présentation de notre communauté seront validés et mis à jour très prochainement.</em></p>`,
      imageUrl: '/images/provisoires/actu-communaute.jpg',
      imageAlt: "Accueil et convivialité au sein de la mosquée",
      categoryId: catVie.id,
      status: 'PUBLISHED',
      isFeatured: true,
      publishedAt: new Date(),
      authorId: admin.id
    }
  });

  await prisma.news.upsert({
    where: { slug: 'reprise-des-cours-et-ateliers-d-apprentissage' },
    update: {},
    create: {
      title: "Reprise des cours et ateliers d'apprentissage",
      slug: 'reprise-des-cours-et-ateliers-d-apprentissage',
      excerpt: "[Contenu provisoire] Informations concernant le calendrier des inscriptions aux cours pour enfants et adultes.",
      content: `<p><strong>[Contenu provisoire]</strong></p><p>Les ateliers d'apprentissage et cours de langue arabe et de mémorisation reprennent leurs activités.</p><p>Les inscriptions se font auprès de l'équipe pédagogique après les prières ou en contactant les référents via WhatsApp.</p>`,
      imageUrl: '/images/provisoires/actu-cours.jpg',
      imageAlt: "Support de lecture et espace d'étude",
      categoryId: catEnseignement.id,
      status: 'PUBLISHED',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      authorId: admin.id
    }
  });

  await prisma.news.upsert({
    where: { slug: 'action-solidarite-et-soutien-aux-familles' },
    update: {},
    create: {
      title: "Action solidarité et soutien aux familles",
      slug: 'action-solidarite-et-soutien-aux-familles',
      excerpt: "[Contenu provisoire] Collecte et distribution de colis de première nécessité pour les familles dans le besoin à Étampes.",
      content: `<p><strong>[Contenu provisoire]</strong></p><p>L'équipe solidaire de la Mosquée d'Etampes Centre organise une collecte de denrées non périssables et de produits d'hygiène.</p><p>Merci à tous les donateurs et bénévoles pour leur dévouement et leur générosité constante au service de tous.</p>`,
      imageUrl: '/images/provisoires/activite-solidarite.jpg',
      imageAlt: "Partage de denrées et solidarité",
      categoryId: catSolidarite.id,
      status: 'PUBLISHED',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      authorId: admin.id
    }
  });

  // 5. Événements (un futur et un passé pour tester l'archivage automatique)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 10);
  futureDate.setHours(15, 0, 0, 0);

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 15);
  pastDate.setHours(14, 0, 0, 0);

  await prisma.event.upsert({
    where: { slug: 'rencontre-communautaire-et-echange' },
    update: {},
    create: {
      title: "Rencontre communautaire et échange fraternel",
      slug: 'rencontre-communautaire-et-echange',
      description: "[Contenu provisoire] Une après-midi d'échange et de convivialité ouverte à tous les membres de la communauté.",
      startDate: futureDate,
      location: "Grande salle de la Mosquée d'Etampes Centre",
      imageUrl: '/images/provisoires/evenement-conference.jpg',
      imageAlt: "Salle de conférence et rencontre",
      status: 'PUBLISHED',
      showOnHome: true
    }
  });

  await prisma.event.upsert({
    where: { slug: 'conference-inaugurale-annee-ecoulee' },
    update: {},
    create: {
      title: "Conférence inaugurale de la saison passée",
      slug: 'conference-inaugurale-annee-ecoulee',
      description: "[Contenu provisoire] Conférence thématique organisée le mois dernier (archivée automatiquement).",
      startDate: pastDate,
      location: "Mosquée d'Etampes Centre",
      imageUrl: '/images/provisoires/evenement-conference.jpg',
      imageAlt: "Salle de conférence",
      status: 'PUBLISHED',
      showOnHome: false
    }
  });

  // 6. Activités régulières
  await prisma.activity.upsert({
    where: { id: 'act-cours-enfants' },
    update: {},
    create: {
      id: 'act-cours-enfants',
      title: "Enseignement et cours pour enfants",
      description: "[Contenu provisoire] Apprentissage des bases de la lecture, de la langue arabe et des valeurs civiques et spirituelles.",
      schedule: "Samedis et dimanches de 10h00 à 12h30",
      imageUrl: '/images/provisoires/actu-cours.jpg',
      imageAlt: "Salle d'apprentissage pour les jeunes",
      order: 1,
      isActive: true
    }
  });

  await prisma.activity.upsert({
    where: { id: 'act-solidarite' },
    update: {},
    create: {
      id: 'act-solidarite',
      title: "Pôle Solidarité et Entraide",
      description: "[Contenu provisoire] Organisation des distributions alimentaires, vestimentaires et accompagnement social des personnes isolées.",
      schedule: "Permanence le premier dimanche de chaque mois de 14h00 à 17h00",
      imageUrl: '/images/provisoires/activite-solidarite.jpg',
      imageAlt: "Pôle d'entraide et de solidarité",
      order: 2,
      isActive: true
    }
  });

  await prisma.activity.upsert({
    where: { id: 'act-cours-adultes' },
    update: {},
    create: {
      id: 'act-cours-adultes',
      title: "Conférences et cercles d'études pour adultes",
      description: "[Contenu provisoire] Rencontres hebdomadaires consacrées à la compréhension des textes, à l'éthique et au vivre-ensemble.",
      schedule: "Tous les vendredis soir après la prière d'Al-Icha",
      imageUrl: '/images/provisoires/interieur-mosquee.jpg',
      imageAlt: "Salle de prière et de recueillement",
      order: 3,
      isActive: true
    }
  });

  // 7. Pages institutionnelles (Pages Content)
  await prisma.pageContent.upsert({
    where: { key: 'la-mosquee' },
    update: {},
    create: {
      key: 'la-mosquee',
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
    }
  });

  await prisma.pageContent.upsert({
    where: { key: 'informations-pratiques' },
    update: {},
    create: {
      key: 'informations-pratiques',
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
  <li><strong>En voiture :</strong> Accès facile depuis la RN20. Stationnement disponible aux abords du site dans le respect des riverains.</li>
</ul>`,
      metaTitle: "Informations pratiques — Mosquée d'Etampes Centre",
      metaDescription: "Adresse, plan d'accès, transports et horaires d'ouverture de la Mosquée d'Etampes Centre au 2 avenue du 8 mai 1945, Étampes."
    }
  });

  await prisma.pageContent.upsert({
    where: { key: 'mentions-legales' },
    update: {},
    create: {
      key: 'mentions-legales',
      title: "Mentions légales",
      content: `<p><em>Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique (LCEN).</em></p>

<h2>1. Éditeur du site</h2>
<p>Le présent site est édité par l'association gestionnaire de la <strong>Mosquée d'Etampes Centre</strong>.<br/>
Nom officiel de l'association : <strong>[À COMPLÉTER - ex. Association Cultuelle des Musulmans d'Étampes]</strong><br/>
Numéro RNA : <strong>[À COMPLÉTER]</strong><br/>
Numéro SIRET : <strong>[À COMPLÉTER]</strong><br/>
Siège social : 2 avenue du 8 mai 1945, 91150 Étampes<br/>
Directeur de la publication : <strong>[À COMPLÉTER - Nom du Président]</strong><br/>
Contact : +33 7 49 60 90 62 / E-mail : <strong>[À COMPLÉTER]</strong></p>

<h2>2. Hébergement</h2>
<p>Le site est actuellement hébergé à titre de recette sur infrastructure locale privée, en attente de sa mise en ligne publique définitive.<br/>
Hébergeur final : <strong>[À COMPLÉTER lors du Bloc 4]</strong></p>

<h2>3. Propriété intellectuelle</h2>
<p>Le logo officiel, les photographies et les textes publiés sur ce site sont la propriété exclusive de la Mosquée d'Etampes Centre ou de leurs auteurs respectifs (visuels provisoires documentés dans CREDITS_IMAGES.md). Toute reproduction ou représentation, intégrale ou partielle, sans l'accord préalable écrit de l'association est interdite.</p>`,
      metaTitle: "Mentions légales — Mosquée d'Etampes Centre",
      metaDescription: "Mentions légales officielles du site de la Mosquée d'Etampes Centre."
    }
  });

  await prisma.pageContent.upsert({
    where: { key: 'confidentialite' },
    update: {},
    create: {
      key: 'confidentialite',
      title: "Politique de confidentialité & Données personnelles",
      content: `<h2>1. Respect de la vie privée</h2>
<p>La Mosquée d'Etampes Centre s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.</p>

<h2>2. Données collectées</h2>
<p>Le site public ne dépose <strong>aucun cookie publicitaire ni traceur de profilage</strong>. Aucun outil d'analyse d'audience tiers n'est activé en V1.</p>
<p>Le formulaire de contact par courriel est <strong>désactivé par défaut</strong> tant que l'adresse de réception officielle n'est pas renseignée. Le bouton WhatsApp permet un échange direct de messagerie chiffrée selon les conditions d'utilisation de WhatsApp/Meta.</p>

<h2>3. Widget tiers (Horaires Mawaqit)</h2>
<p>L'affichage des horaires de prière en direct est assuré via l'intégration d'un widget fourni par la plateforme Mawaqit (https://mawaqit.net). Ce widget est isolé dans un cadre sécurisé (iframe) et ne transmet aucune donnée personnelle issue de notre site. Pour toute information sur les cookies éventuellement déposés par Mawaqit, nous vous invitons à consulter leur politique de confidentialité.</p>

<h2>4. Vos droits</h2>
<p>Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et d'effacement de vos données en contactant l'association à l'adresse postale indiquée ou via WhatsApp au +33 7 49 60 90 62.</p>`,
      metaTitle: "Politique de confidentialité — Mosquée d'Etampes Centre",
      metaDescription: "Politique de confidentialité et protection des données personnelles de la Mosquée d'Etampes Centre."
    }
  });

  console.log('--- Seed terminé avec succès ! ---');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
