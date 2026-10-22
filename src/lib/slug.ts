/**
 * Génère un slug URL propre, sans accents ni caractères spéciaux
 */
export function generateSlug(text: string): string {
  return text
    .normalize('NFD') // Sépare les accents des lettres
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères non alphanumériques
    .replace(/[\s_-]+/g, '-') // Remplace les espaces et tirets multiples par un seul tiret
    .replace(/^-+|-+$/g, ''); // Supprime les tirets de début et fin
}
