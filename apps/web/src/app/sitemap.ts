import type { MetadataRoute } from 'next';

// Required by `output: 'export'` — tells Next.js this route is fully static.
export const dynamic = 'force-static';

const SITE_URL = 'https://florify.pages.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/gallery/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/settings/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
