import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';

  const staticRoutes = [
    '',
    '/la-mosquee',
    '/actualites',
    '/evenements',
    '/activites',
    '/informations-pratiques',
    '/contact',
    '/mentions-legales',
    '/confidentialite'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8
  }));

  const news = await prisma.news.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true }
  });

  const newsRoutes = news.map((item) => ({
    url: `${baseUrl}/actualites/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  return [...staticRoutes, ...newsRoutes];
}
