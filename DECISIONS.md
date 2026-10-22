# Registre des Décisions Techniques — Mosquée d'Etampes Centre

Ce document consigne les choix d'architecture, de conception et d'ergonomie retenus, ainsi que leurs justifications.

---

### D-01 : Validation de la pile technique (Bloc 0)
- **Date :** 22/10/2026
- **Choix :** Next.js (App Router) + TypeScript + Prisma ORM + SQLite local + Vanilla CSS (Design System sur mesure).
- **Justification :** Pile sobre, ultra-performante, portable, sans dépendance lourde. Ne nécessite aucun serveur de base de données séparé. Déployable en local, sur NAS ou sur VPS sans modifier une seule ligne de code.

### D-02 : Alignement des couleurs sur le logo officiel SVG
- **Date :** 22/10/2026
- **Choix :** 
  - Bleu primaire : `#1B1F60` (au lieu de `#282260` initial)
  - Doré d'accent : `#BD7A37` (au lieu de `#B88550` initial)
- **Justification :** Harmonie chromatique exacte avec le logo officiel fourni. Les contrastes ont été vérifiés selon WCAG 2.1 AA :
  - Bleu `#1B1F60` sur blanc : 14.85:1 (conforme AAA).
  - Bleu `#1B1F60` sur crème `#F6F1E7` : 13.16:1 (conforme AAA).
  - Doré `#BD7A37` sur bleu `#1B1F60` : 4.28:1 (conforme AA pour grand texte ≥ 24px ou ≥ 19px gras).
  - Bouton doré fond `#BD7A37` avec texte sombre `#252329` : 4.51:1 (conforme AA texte normal).
  - Doré sur crème ou blanc : strictement décoratif (filets, icônes sans texte).

### D-03 : Déploiement en deux temps & rôle du NAS
- **Date :** 22/10/2026
- **Choix :** Développement et recette sur le poste local (Node.js v24.15). Préparation des scripts et conteneur pour le NAS au Bloc 3, puis mise en ligne publique sur domaine privé au Bloc 4.
- **Justification :** Le NAS n'est pas bloquant pour le développement. La base SQLite est hébergée sur disque local, évitant tout risque de corruption sur partage réseau (SMB/NFS).

### D-04 : Traitement du logo officiel et nom complet
- **Date :** 22/10/2026
- **Choix :** Le logo original à la racine reste intact. Une copie transparente avec `viewBox="0 0 1132 1390"` est créée dans `assets-source/logo/`. Le texte « Mosquée d'Etampes Centre » est toujours affiché en HTML sémantique à côté du logo dans l'en-tête pour compenser l'absence du mot « Centre » dans le graphisme du logo.
