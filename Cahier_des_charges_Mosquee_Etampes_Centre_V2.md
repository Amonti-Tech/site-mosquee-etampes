# Cahier des charges technique V2

## Site web — Mosquée d'Etampes Centre

**Statut :** document de référence à transmettre à Antigravity (Gemini).
**Nom officiel à utiliser partout :** Mosquée d'Etampes Centre.
**Commanditaire :** un bénévole non développeur, mais à l'aise avec le « vibe coding » et capable de poser des questions à l'agent. Comptes rendus **concis et en français** ; le vocabulaire technique est accepté s'il est expliqué en une phrase à sa première apparition.

**Décisions déjà validées par le commanditaire :**
- Le nom « Mosquée d'Etampes Centre » est conservé.
- **Logo officiel fourni** (PNG et SVG à la racine du projet, §3). Photos officielles de la façade et de l'intérieur indisponibles pour l'instant : utiliser des **images libres de droits provisoires**, remplacées avant la mise en ligne publique (§3).
- Hébergement en deux temps : d'abord sur un **NAS**, puis mise en ligne sur un **domaine privé** (§11). Le moyen technique de déploiement est libre et Docker n'est pas requis : l'essentiel est que le site puisse être déployé, par le moyen le plus simple qui fonctionne.
- Toutes les fonctionnalités décrites dans ce document sont conservées, y compris le bandeau d'annonce et le guide bénévoles.

---

## 0. Règles de travail pour l'agent (non négociables)

1. **Ne rien inventer.** Toute information absente de ce document (e-mail, horaires d'ouverture, histoire de la mosquée, éditeur légal, SIRET/RNA, réseaux sociaux…) reste un **marqueur visible `[À COMPLÉTER]`** dans le site, et est listée dans un fichier `A_COMPLETER.md`. Les horaires de prière ne sont **jamais** saisis à la main (voir §6).
2. **Aucun contenu religieux rédigé par l'agent** (versets, hadiths, avis, textes de cours, communiqués). Seule la mosquée fournit et valide ce type de contenu. Les textes provisoires restent neutres et clairement marqués comme provisoires.
3. **Travailler par blocs.** Le travail est découpé en 5 blocs (§13). À l'intérieur d'un bloc, **enchaîner toutes les étapes sans demander d'accord intermédiaire**. À la fin de chaque bloc : s'arrêter, faire un compte rendu concis et **attendre l'accord explicite de l'utilisateur** avant de passer au bloc suivant. Les cas d'arrêt anticipé sont listés au §13.
4. **Plan avant le code.** Avant d'écrire du code, produire un plan d'implémentation (pile technique, arborescence, modèle de données, étapes) et le soumettre à validation.
5. **Honnêteté sur les tests.** Ne jamais affirmer qu'une fonctionnalité ou une configuration fonctionne sans l'avoir vérifiée (commande exécutée, capture d'écran navigateur, test automatisé). Exécuter les tests à chaque étape interne d'un bloc, pas seulement à la fin, et lister dans chaque compte rendu : ce qui a été testé et comment, ce qui n'a **pas** été testé.
6. **Sobriété.** Pas de dépendance inutile, pas de fonctionnalité hors périmètre (§2), pas de sur-ingénierie. Un petit site associatif doit rester maintenable par une personne.
7. **Secrets.** Jamais de mot de passe, clé ou jeton dans le code, le dépôt ou le frontend. Fournir un `.env.example` sans valeur réelle.
8. **Langue.** Site et administration entièrement en français. Identifiants de code en anglais, commentaires rares et utiles.
9. **Ne pas supposer** qu'un nom de domaine, une base de données ou des comptes externes existent déjà. Seul l'hébergement est connu : un NAS d'abord, puis une mise en ligne sur un domaine privé (§11). Ce que le NAS permet ou non est une information à relever au bloc 0, pas une contrainte bloquante.

---

## 1. Objectif

Créer un site web réel, sécurisé, responsive et administrable pour la Mosquée d'Etampes Centre. L'administration doit être utilisable par des bénévoles sans compétences informatiques.

**Principe central : l'administrateur gère le contenu, pas la mise en page.** Pour publier une actualité, il renseigne le titre, le texte, une image facultative, la catégorie et le statut. Le site gère automatiquement la présentation, le responsive et le SEO de base.

**Objectif d'usage mesurable :** un bénévole formé uniquement par le guide d'une page (§14) publie une actualité avec image en **moins de 5 minutes**, sur ordinateur comme sur mobile.

## 2. Périmètre

**Inclus en V1 :** pages publiques (§5), widget Mawaqit (§6), administration (§7), comptes et sécurité (§8), contact et confidentialité (§9).

**Hors périmètre V1** (ne pas développer, ne pas préparer au-delà d'une structure extensible) :
paiement ou dons en ligne, boutique, espace membres / inscriptions publiques, newsletter, commentaires, calendrier de prières personnalisé, événements récurrents automatiques, application mobile, traduction du contenu (voir §10 pour la préparation multilingue), carte intégrée (iframe).

## 3. Identité visuelle validée

- Style élégant, moderne, chaleureux, avec motifs géométriques islamiques **discrets** (SVG décoratifs, `aria-hidden`).
- **Logo officiel : fourni**, à la racine du projet : `Logo de mosquée stylisée bleu et or.png` (1132 × 1390 px) et `Logo de mosquée stylisée bleu et or.svg`. Les copier dans `assets-source/logo/` sous des noms simples (`logo-mosquee.png`, `logo-mosquee.svg`), **sans jamais modifier les originaux ni redessiner le logo**. Particularités relevées :
    - **Composition verticale** : arche, trois minarets, calligraphie arabe en style coufique et mention « Mosquée d'Etampes » en doré. Cette mention devient illisible à petite taille et **ne comporte pas le mot « Centre »**. Ne pas modifier le logo pour l'ajouter : le signaler à l'utilisateur, qui décidera.
    - **En-tête** : logo à hauteur modérée (environ 64 à 80 px), **accompagné du nom officiel en texte HTML « Mosquée d'Etampes Centre »**. Le logo en grand sert sur l'accueil, la page La mosquée et le pied de page.
    - **Fond opaque** : le fichier a un fond blanc cassé (rectangle `#FDFDFD` dans le SVG, fond blanc dans le PNG). L'utiliser sur fond blanc, ou produire une **copie** du SVG à fond transparent (en retirant ce rectangle) pour l'afficher sur crème ou sur bleu.
    - **Le SVG n'a pas de `viewBox`** : en ajouter un (`0 0 1132 1390`) dans la copie utilisée sur le site, pour qu'il s'adapte à toutes les tailles.
    - Affichage via `<img>` (pas de SVG inséré en ligne), avec le texte alternatif « Logo de la Mosquée d'Etampes Centre ».
    - **Couleurs relevées dans le SVG** : bleu ≈ `#1B1F60` et doré ≈ `#BD7A37`, proches de la palette ci-dessous sans être identiques. Au bloc 0, proposer un léger alignement de la palette sur ces valeurs si l'écart est visible, puis recalculer les contrastes.
    - Favicon et image de partage (Open Graph) dérivées du logo (recadrage de l'arche si besoin), à faire valider.
    - Le logo reste remplaçable depuis l'administration (PNG, WebP ou JPG ; l'import SVG reste refusé, §8). Le SVG fourni est un fichier statique du dépôt, pas un import.
- **Images provisoires pendant le développement.** Les photos de la mosquée (façade, intérieur) ne sont pas disponibles pour l'instant. Utiliser à la place des **images libres de droits** cohérentes avec le projet, **remplacées par les photos officielles avant la mise en ligne publique** :
    - Sources acceptées : domaine public / CC0, licences Unsplash ou Pexels, Wikimedia Commons (CC0, CC BY, CC BY-SA, avec attribution). **Vérifier la licence de chaque image** avant usage.
    - Sujets adaptés : motifs géométriques et ornements, détails d'architecture, lumière sur un intérieur sobre, ciel et lignes d'un bâtiment.
    - Interdits : personnes identifiables, enfants, image d'une autre mosquée précise présentée comme la façade ou l'intérieur de celle d'Étampes, logos ou marques de tiers, tout texte religieux ou calligraphie.
    - Tenir un fichier `CREDITS_IMAGES.md` : fichier, source (URL), auteur, licence, statut (« provisoire » ou « officiel »). Chaque image provisoire est aussi signalée comme telle dans la médiathèque de l'administration.
    - Ranger les visuels provisoires dans `assets-provisoires/`. Les visuels officiels, à leur arrivée, se déposent dans `assets-source/` et se changent **depuis l'administration (§7), sans toucher au code**.
    - Si l'agent ne peut pas récupérer d'images en ligne, il génère des visuels neutres (motifs géométriques SVG et dégradés aux couleurs de la palette) plutôt que d'en inventer l'origine.
- Structure de maquette validée : en-tête, bandeau façade, **Mawaqit juste en dessous**, puis actualités, événements, activités, présentation, informations pratiques.
- Polices : 2 familles maximum, **auto-hébergées** (pas de CDN de polices tiers).
- Animations sobres ; respecter `prefers-reduced-motion`.

### Palette et règles d'usage (contrastes calculés selon WCAG)

| Rôle | Couleur |
|---|---|
| Bleu (titres, boutons, en-tête) | `#282260` |
| Doré (accent) | `#B88550` |
| Crème (fond principal) | `#F6F1E7` |
| Beige (fonds secondaires) | `#E7D8C5` |
| Terracotta (accent secondaire) | `#A96042` |
| Texte courant | `#252329` |
| Blanc | `#FFFFFF` |

Règles imposées par les contrastes (seuil texte normal : 4,5:1) :

- Texte courant `#252329` sur crème / beige / blanc : OK (≥ 11:1). Titres en bleu sur ces fonds : OK (≥ 10:1).
- Blanc ou crème sur bleu : OK (≈ 14:1 et 12,5:1).
- **Doré sur crème (≈ 2,9:1), sur blanc (≈ 3,2:1) ou sur beige (≈ 2,3:1) : décoratif uniquement** (filets, motifs, icônes sans rôle d'information). Jamais pour du texte ni pour un lien.
- Doré sur bleu (≈ 4,4:1) : grand texte seulement (≥ 24 px, ou ≥ 19 px en gras).
- Bouton doré : fond doré + texte `#252329` (≈ 4,8:1).
- Terracotta : texte sur blanc OK (≈ 4,7:1) ; sur crème (≈ 4,2:1) réservé au grand texte ; bouton terracotta = texte blanc.
- Ces règles s'appliquent aussi à l'état `:hover`, `:focus` et `:disabled`.

## 4. Informations officielles

- Nom : **Mosquée d'Etampes Centre**
- Adresse : **2 avenue du 8 mai 1945, 91150 Étampes**
- WhatsApp : **+33 7 49 60 90 62**
- E-mail officiel : `[À COMPLÉTER]`
- Horaires d'ouverture : `[À COMPLÉTER]` (à confirmer par la mosquée)

Centraliser ces informations dans les **paramètres du site** : une modification se répercute partout (pages, pied de page, SEO, données structurées). Ne jamais raccourcir le nom en « Mosquée d'Etampes ».

## 5. Pages publiques

| Page | Contenu |
|---|---|
| **Accueil** | En-tête, bandeau façade, **widget Mawaqit**, bandeau d'annonce éventuel, 3 dernières actualités, 3 prochains événements, activités, présentation courte, informations pratiques, pied de page |
| **La mosquée** | Histoire, mission, présentation — textes modifiables depuis l'administration |
| **Actualités** | Liste paginée + pages de détail (image, date, catégorie, texte) |
| **Événements** | À venir (dates/heures, lieu, description, image facultative) ; événements passés archivés automatiquement |
| **Activités** | Activités définies par la mosquée (ex. cours de Coran, enseignement, jeunesse, solidarité) avec jours/horaires en texte libre |
| **Informations pratiques** | Adresse, contact, accès, horaires d'ouverture confirmés, lien d'itinéraire (simple lien, pas de carte intégrée) |
| **Contact** | Coordonnées, bouton WhatsApp, formulaire facultatif (§9) |
| **Mentions légales / Confidentialité** | Gabarits structurés à compléter avec les informations réelles (§9) |

Navigation : Accueil, La mosquée, Actualités, Événements, Activités, Informations pratiques, Contact. Mobile : menu compact, accessible au clavier et au lecteur d'écran.

Pages d'erreur 404 et 500 propres, en français, avec lien de retour.

## 6. Widget Mawaqit — à conserver

À insérer sur l'accueil, **immédiatement sous le bandeau principal**. Ne pas recréer ni saisir les horaires de prière. Le widget est **codé en dur dans un composant** : l'administrateur ne peut pas modifier ce HTML.

Code d'origine fourni par la mosquée :

```html
<iframe
  src="//mawaqit.net/fr/w/centre-cultuel-mohamed-6-etampes?showOnly5PrayerTimes=0"
  frameborder="0"
  scrolling="no"
  class="widget">
</iframe>
```

Code final attendu (ce qui est **exact et inchangé** : le chemin `/fr/w/centre-cultuel-mohamed-6-etampes` et le paramètre `showOnly5PrayerTimes=0`) :

```html
<iframe
  src="https://mawaqit.net/fr/w/centre-cultuel-mohamed-6-etampes?showOnly5PrayerTimes=0"
  title="Horaires de prière — Mosquée d'Etampes Centre (Mawaqit)"
  frameborder="0"
  scrolling="no"
  loading="lazy"
  class="widget">
</iframe>
```

Adaptations autorisées : URL en HTTPS explicite ; ajout de `title` (accessibilité) et `loading="lazy"` ; CSS pour la classe `widget` (largeur 100 %, pas de débordement horizontal, hauteur minimale **mesurée par test réel**, pas devinée). Toute autre modification est interdite.

Exigences :
- Politique de sécurité (CSP) : autoriser `frame-src https://mawaqit.net` uniquement.
- Sous le widget, toujours afficher un lien « Voir les horaires sur Mawaqit » (nouvel onglet, `rel="noopener noreferrer"`) en solution de repli.
- Tester sur ordinateur, tablette et smartphone (largeurs en §10) ; documenter toute limite d'affichage imputable au contenu tiers.
- Observer et documenter les requêtes et cookies émis par le widget tiers ; les mentionner dans la politique de confidentialité. Si des cookies non essentiels sont déposés, le signaler à l'utilisateur pour décision.

## 7. Administration

Espace distinct (`/admin`), protégé, non indexé, utilisable sur ordinateur et mobile. Interface en français, avec un **texte d'aide court sous chaque champ**.

- **Tableau de bord** : raccourcis « Nouvelle actualité », « Nouvel événement », « Modifier une page » ; liste des brouillons et des contenus publiés récemment.
- **Actualités** : titre, texte, image facultative (+ texte alternatif), catégorie, date affichée, statut brouillon / publié, option « mettre en avant ».
- **Événements** : titre, description, début, fin facultative, lieu, image, statut, option « afficher sur l'accueil ».
- **Pages et activités** : formulaires simples, **sans constructeur de page**.
- **Médias** : import sécurisé (§8), texte alternatif obligatoire (ou case « image décorative »), bibliothèque simple.
- **Paramètres** : nom officiel, adresse, WhatsApp, e-mail, logo, image d'en-tête de l'accueil (façade), photo intérieure, description, liens sociaux éventuels, **bandeau d'annonce** (texte court, lien facultatif, actif/inactif, date de fin — ex. horaire exceptionnel de l'Aïd).
- **Journal d'activité** (administrateur uniquement) : qui a fait quoi et quand.

Règles ergonomiques pour des bénévoles :
- **Bouton « Aperçu »** avant publication.
- **Éditeur de texte enrichi limité** : intertitres, gras, italique, listes, liens. Pas de HTML libre, pas de script. Le contenu est nettoyé côté serveur.
- **« Dépublier / Archiver » plutôt que supprimer** ; suppression définitive réservée à l'administrateur, avec confirmation explicite.
- Messages d'erreur compréhensibles (« Le titre est obligatoire », jamais de message technique).
- SEO automatique (titre, description, URL lisible, image de partage générés depuis le contenu) ; surcharge possible dans un bloc « Options avancées » replié par défaut.

## 8. Utilisateurs et sécurité

**Rôles V1 :**
- **Administrateur** : comptes, paramètres, journal, tous les contenus, suppression définitive.
- **Éditeur** : crée, modifie, publie et dépublie les contenus ; **ne gère ni comptes, ni paramètres**.
- Un rôle « Contributeur » (brouillons uniquement) n'est pas livré en V1, mais le rôle est stocké de façon extensible.

**Authentification et accès**
- Bibliothèque d'authentification éprouvée plutôt que du code maison ; mots de passe hachés (argon2id ou bcrypt) ; longueur minimale 12 caractères.
- Aucun compte par défaut. Le premier administrateur est créé via un script ou une variable d'environnement à usage unique, documenté.
- Cookies de session `HttpOnly`, `SameSite` et `Secure` (obligatoire dès que le site est servi en HTTPS, donc en production publique) ; protection CSRF sur toute action modifiant des données.
- Limitation des tentatives de connexion (par IP et par compte) ; messages d'erreur de connexion génériques.
- Réinitialisation de mot de passe : jeton à usage unique, haché en base, durée de vie courte. Tant qu'aucun e-mail d'envoi n'est configuré, la réinitialisation est faite par l'administrateur.
- Double authentification (TOTP) pour les administrateurs : recommandée, non bloquante en V1.
- **Contrôle d'accès côté serveur** sur chaque route et action (refus par défaut) ; ne jamais se fier au frontend. Vérifier l'accès aux objets (un éditeur ne peut atteindre ni comptes ni paramètres, même en forçant une URL ou un identifiant).

**Données et fichiers**
- Validation de toutes les entrées côté serveur (schémas) ; requêtes paramétrées via l'ORM ; nettoyage du texte enrichi.
- Import d'images : JPG / PNG / WebP uniquement ; type réel vérifié (pas seulement l'extension) ; taille maximale (5 Mo par défaut) ; **ré-encodage, redimensionnement et suppression des métadonnées EXIF (dont GPS)** ; noms de fichiers aléatoires ; SVG refusé à l'import.
- En-têtes HTTP : CSP stricte, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`, `Permissions-Policy`. **HTTPS obligatoire et HSTS dès la mise en ligne publique** ; pas de HSTS tant que le site n'est servi qu'en réseau local ou en HTTP.
- Dépendances : fichier de verrouillage, audit des vulnérabilités avant livraison.

**Journalisation, sauvegarde**
- Journaliser connexions (réussies/échouées) et actions importantes (création, modification, publication, suppression, changement de rôle). Ne jamais journaliser mots de passe ni jetons. Conservation limitée (12 mois par défaut).
- Sauvegarde **de la base et des médias** : au moins quotidienne, rétention définie (ex. 14 quotidiennes + 3 mensuelles), **copie hors du serveur principal**.
- Sur NAS : le RAID et les instantanés (snapshots) du NAS **ne remplacent pas une sauvegarde**. Prévoir une copie sur un autre support ou un autre lieu (disque externe, autre site ou stockage distant chiffré).
- Procédure de restauration écrite **et testée au moins une fois** avant la mise en ligne.

## 9. Contact, confidentialité et conformité

- **Formulaire de contact : désactivé par défaut** tant qu'aucun e-mail de réception n'est fourni (activable par réglage). Tant qu'il est désactivé, la page Contact propose WhatsApp et les coordonnées.
- Si activé : champs nom, moyen de réponse, message ; case d'information sur l'usage des données ; envoi par e-mail **sans stockage en base** (limitation des données) ; en cas d'échec d'envoi, message clair invitant à écrire sur WhatsApp.
- Antispam sans service tiers : champ piège (honeypot), délai minimal de remplissage, limitation de débit par IP. Pas de CAPTCHA tiers sans décision explicite.
- Aucun cookie non essentiel, aucun outil d'analyse d'audience par défaut. Si une mesure d'audience est souhaitée plus tard : solution sans cookie, après décision et configuration.
- Mentions légales et confidentialité : gabarits prêts avec champs `[À COMPLÉTER]` (éditeur, responsable de publication, hébergeur, contact). Ne jamais inventer de SIRET, RNA ou identité. Préciser que ces textes doivent être **validés par la mosquée** avant mise en ligne.

## 10. Qualité : accessibilité, SEO, performances

**Accessibilité (cible WCAG 2.1 AA)** : HTML sémantique, un seul `h1` par page, navigation clavier complète, focus visible, lien d'évitement « Aller au contenu », libellés explicites, contrastes conformes (§3), texte alternatif pour les images informatives, cibles tactiles confortables sur mobile.

**SEO** : balises `title` et description par page, URLs lisibles, `sitemap.xml`, `robots.txt`, Open Graph (image par défaut : la façade), données structurées schema.org (`Mosque` / `PlaceOfWorship`) alimentées par les paramètres. L'administration n'est **jamais indexée** ; le site reste en `noindex` tant que la recette finale (bloc 4) n'est pas validée.

**Performances** : images en formats modernes avec `srcset`, dimensions déclarées (pas de décalage de mise en page), chargement différé sauf image principale, polices auto-hébergées, peu de JavaScript côté public.

**Responsive** : tester au minimum 360×800, 390×844, 768×1024, 1280×800 et 1920×1080, sans défilement horizontal.

**Préparation multilingue** (sans traduire en V1) : textes d'interface hors des composants, attribut `lang` géré, mise en page compatible avec une future écriture de droite à gauche. Site en français uniquement en V1.

## 11. Architecture et pile technique

### Hébergement en deux temps

1. **Développement et recette : sur le NAS si possible**, accessible depuis le réseau local uniquement. Au bloc 0, relever rapidement ce qu'il permet (système, Node, Docker…) pour choisir le moyen de déploiement le plus simple. S'il ne convient pas, ne pas insister : développer et tester sur le poste local, et déployer directement sur l'hébergement final.
2. **Mise en ligne publique : sur un domaine privé** appartenant à la mosquée (nom à communiquer). Le lieu d'hébergement final (NAS exposé sur Internet ou serveur distant de type VPS) reste à décider ; l'architecture doit donc être **portable**.

Exigences :
- **Déployer par le moyen le plus simple qui fonctionne**, sans en faire un sujet. Par ordre de préférence : Docker si le NAS le gère ; sinon exécution directe de l'application Node sur le NAS (démarrage automatique par script ou planificateur du NAS) ; sinon recette sur le poste local, puis déploiement direct sur l'hébergement final. Aucun de ces choix ne doit imposer de modifier le code.
- L'application se configure uniquement par variables d'environnement et garde ses données (base, médias) dans des dossiers explicites, pour pouvoir se déplacer facilement. Consommation raisonnable de processeur et de mémoire.
- SQLite : fichier placé sur un **disque local** du NAS ou du serveur, **jamais sur un partage réseau** (SMB/NFS), faute de quoi la base risque d'être corrompue.
- Aucun accès depuis Internet avant la fin du bloc 3 (audit de sécurité et recette inclus). Au bloc 4, comparer en **10 lignes maximum** les modes d'exposition possibles (redirection de ports avec reverse proxy HTTPS et certificat Let's Encrypt ; tunnel sécurisé ; migration vers un serveur distant), avec leurs risques (adresse IP dynamique, exposition du NAS, mises à jour), puis recommander. L'utilisateur valide.
- Documenter dans le README comment déployer le site (sur le NAS, puis en ligne), quel que soit le moyen retenu.

### Pile technique

**Pile proposée par défaut** (à confirmer ou à remplacer après l'audit du bloc 0) :
Next.js (App Router) + TypeScript, Prisma, SQLite, authentification via bibliothèque éprouvée, médias dans un dossier persistant, déployable avec ou sans Docker.

- Les capacités du NAS ne conditionnent pas la pile. Si une autre pile est plus adaptée au besoin (ex. PostgreSQL, ou CMS existant), proposer une alternative en **10 lignes maximum** : critères, avantages, risques, recommandation.
- Ne pas changer de pile sans validation de l'utilisateur.
- Présenter l'arborescence du projet avant de la créer.

**Modèle de données minimal** (tous les contenus : statut + dates de création/modification) :

| Entité | Champs principaux |
|---|---|
| Utilisateur | e-mail, nom, rôle, mot de passe haché, actif, dernière connexion |
| Actualité | titre, slug, extrait, contenu, image, catégorie, statut, mise en avant, date affichée, auteur |
| Catégorie | nom, slug (liste modifiable ; 3-4 catégories provisoires proposées) |
| Événement | titre, slug, description, début, fin facultative, lieu, image, statut, affichage accueil |
| Page | clé, titre, contenu, SEO |
| Activité | titre, description, jours/horaires (texte libre), image, ordre, actif |
| Média | fichier + variantes, texte alternatif, décoratif oui/non, type, taille, auteur |
| Paramètre | nom officiel, adresse, WhatsApp, e-mail, logo, image d'en-tête, photo intérieure, description, réseaux sociaux, bandeau d'annonce |
| Journal | utilisateur, action, entité, date |

## 12. Contenu provisoire

Pour que le site soit présentable pendant le développement : contenus d'exemple neutres, courts, **tous marqués** « Contenu provisoire » dans l'administration et listés dans `A_COMPLETER.md`. Aucune fausse actualité datée, aucun faux événement, aucun faux horaire. Avant la mise en ligne publique, aucun marqueur `[À COMPLÉTER]`, aucun contenu provisoire et aucune image provisoire (§3) ne doit subsister (vérification dans la checklist, §14).

## 13. Blocs de développement

Le travail est découpé en **5 blocs**. À l'intérieur d'un bloc, l'agent **enchaîne toutes les étapes sans demander d'accord intermédiaire** et exécute les tests à chaque étape interne. Il s'arrête à la fin du bloc pour un compte rendu et une validation.

**Arrêt anticipé, uniquement dans ces cas :**
- une information indispensable manque et ne peut pas être remplacée par un marqueur `[À COMPLÉTER]` ;
- une décision lourde ou difficile à défaire se présente : changement de la pile validée, ouverture du site vers Internet, création d'un compte ou dépense externe, suppression de données ;
- un test échoue et ne peut pas être corrigé après des essais raisonnables.

Pour tout autre doute, l'agent choisit l'option la plus simple et la plus sûre, la consigne dans `DECISIONS.md` et la signale dans le compte rendu.

**Compte rendu de fin de bloc** (concis) : ce qui a été fait, principaux fichiers touchés, tests exécutés et résultats, ce qui n'a **pas** été testé, décisions prises sans l'utilisateur, captures d'écran (mobile et ordinateur) pour l'interface, points à valider.

| Bloc | Contenu | Validation attendue |
|---|---|---|
| **0 — Cadrage** | Audit de l'environnement ; relevé rapide de ce que permet le NAS (information, non bloquant) ; sélection des images libres de droits provisoires avec leurs licences ; plan d'implémentation (pile, arborescence, modèle de données) | Pile, plan et images validés. **Seul arrêt obligatoire avant d'écrire du code.** |
| **1 — Site public** | Squelette du projet, design (couleurs, typographies, composants responsive), base de données, migrations et contenu provisoire, puis toutes les pages publiques alimentées par la base : accueil (images provisoires et widget Mawaqit), La mosquée, Actualités, Événements, Activités, Informations pratiques. Tests aux 5 largeurs d'écran | Parcours visuel du site complet |
| **2 — Administration** | Dans cet ordre : authentification, rôles et limitation des tentatives ; tableau de bord ; actualités et événements (aperçu, publication, dépublication) ; pages et activités ; médias avec import sécurisé ; paramètres, bandeau d'annonce, journal d'activité ; tests d'accès automatisés | Parcours complet d'un bénévole : se connecter, publier une actualité avec image, créer un événement |
| **3 — Finitions et déploiement de recette** | Contact (désactivé par défaut), mentions légales et confidentialité ; audit de sécurité, accessibilité, SEO et performances puis corrections ; tests finaux ; README, guide bénévoles et checklist ; sauvegarde et restauration testées ; déploiement de recette sur le NAS en réseau local, ou sur le poste local si le NAS ne convient pas (§11) | Rapport d'audit et recette |
| **4 — Mise en ligne publique** | Nom de domaine, HTTPS, mode d'exposition validé (§11), durcissement, remplacement des visuels provisoires par les officiels, nouveaux tests, retrait du `noindex` | Autorisation explicite de mise en ligne |

## 14. Livrables

- Code source avec lockfile et `.env.example`, plus un `Dockerfile` seulement si Docker est utilisé, sinon un script de démarrage simple.
- `README.md` : installation locale, déploiement (NAS, puis mise en ligne publique), configuration, sauvegarde et restauration.
- `CREDITS_IMAGES.md` : source, auteur et licence de chaque image, avec son statut (provisoire ou officiel).
- `GUIDE_ADMIN.md` : guide **d'une à deux pages pour les bénévoles** (se connecter, publier une actualité, créer un événement, ajouter une image, dépublier), avec captures d'écran.
- `DECISIONS.md` : choix techniques et raisons, en langage simple.
- `A_COMPLETER.md` : tout ce que la mosquée doit encore fournir ou décider.
- `CHECKLIST_MISE_EN_LIGNE.md`.
- Tests automatisés, dont des tests de non-régression d'accès (un éditeur ne peut pas atteindre comptes et paramètres ; un visiteur ne peut pas atteindre l'administration).

## 15. Critères d'acceptation

**Fonctionnel**
- « Mosquée d'Etampes Centre » apparaît partout, sans abréviation.
- Pendant le développement : images libres de droits, licence vérifiée et tracée dans `CREDITS_IMAGES.md`, signalées comme provisoires. Pour la mise en ligne publique : photos officielles en place (voir « Mise en ligne »). Le logo officiel est intégré dès le départ.
- Widget Mawaqit conforme au §6, placé sous le bandeau principal, fonctionnel sur ordinateur, tablette et mobile.
- Création, modification, aperçu, publication et dépublication d'une actualité ; gestion des événements ; archivage automatique des événements passés.
- Coordonnées centralisées : une modification dans les paramètres se répercute partout.
- Test d'usage : un bénévole publie une actualité avec image en moins de 5 minutes à l'aide du guide.

**Sécurité**
- Connexion d'administration sécurisée avec limitation des tentatives.
- Contrôles d'accès et validations côté serveur, vérifiés par tests automatisés.
- Import d'images refusant les fichiers non conformes et supprimant les métadonnées.
- Aucun secret dans le dépôt ni dans le frontend.
- Restauration d'une sauvegarde testée et documentée.

**Qualité** (sur mobile, pour les pages publiques ; l'écart éventuel dû au widget tiers est documenté)
- Lighthouse : accessibilité ≥ 95, bonnes pratiques ≥ 95, SEO ≥ 95, performance ≥ 90.
- Aucun défilement horizontal aux 5 largeurs de test.
- Navigation entièrement utilisable au clavier.

**Mise en ligne**
- Aucun `[À COMPLÉTER]`, contenu provisoire ni image provisoire restant ; photos officielles en place ; logo et photos remplaçables depuis l'administration.
- Mentions légales et confidentialité validées par la mosquée.
- Site fonctionnel en recette (sur le NAS si possible, sinon en local) avant toute ouverture vers Internet ; ensuite, accessible en HTTPS sur le domaine privé, avec HSTS activé et mode d'exposition validé par l'utilisateur.
- Procédure de déploiement et de mise en ligne documentée.
- Instructions d'installation, de sauvegarde et de déploiement documentées.

## 16. Décisions à prendre avant la mise en ligne

Ne pas inventer ces informations. En attendant, appliquer le comportement provisoire indiqué.

| Décision | Impact | Comportement provisoire |
|---|---|---|
| Hébergement : NAS puis mise en ligne (**décidé**). Reste à trancher : lieu d'hébergement final (NAS exposé ou serveur distant) | Exposition à Internet, sauvegardes | Pile par défaut du §11, déployée par le moyen le plus simple disponible ; choix final au bloc 4 |
| Nom de domaine privé (nom à communiquer) | URLs, SEO, HTTPS, e-mails | Site non indexé, accessible en réseau local |
| Photos officielles (façade, intérieur) | Identité visuelle | Images libres de droits provisoires (§3) |
| Logo avec la mention « Centre » (le logo fourni indique « Mosquée d'Etampes ») | Identité visuelle | Logo fourni utilisé tel quel ; nom complet affiché en texte à côté |
| Éditeur légal du site | Mentions légales | `[À COMPLÉTER]` |
| Hébergeur à citer dans les mentions légales (la mosquée si auto-hébergé sur NAS) | Mentions légales | `[À COMPLÉTER]` |
| E-mail officiel | Formulaire de contact, réinitialisation de mot de passe | Formulaire désactivé ; réinitialisation par l'administrateur |
| Horaires d'ouverture | Informations pratiques | `[À COMPLÉTER]` |
| Réseaux sociaux | Pied de page | Masqués |
| Langues supplémentaires | Structure du site | Français seul ; structure préparée |
| Formulaire de contact ou WhatsApp seul | Page Contact | WhatsApp seul |
| Responsable des sauvegardes et de l'administration | Exploitation | `[À COMPLÉTER]` |
| Identifiant Mawaqit `centre-cultuel-mohamed-6-etampes` : confirmer qu'il correspond bien à la mosquée | Widget | Conserver tel quel |
| Lien de don externe (si la mosquée en a un) | Accueil / pied de page | Absent |
| Catégories d'actualités | Classement | 3-4 catégories neutres modifiables |
| Mesure d'audience | RGPD | Aucune |
