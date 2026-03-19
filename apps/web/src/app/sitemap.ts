import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://community.ai-native.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    '',
    '/manifesto',
    '/about',
    '/frameworks',
    '/assessments',
    '/directory',
    '/community',
    '/research',
    '/open-source',
  ];

  return staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly' as const,
    priority: path === '' ? 1 : path === '/manifesto' ? 0.9 : 0.7,
  }));
}
