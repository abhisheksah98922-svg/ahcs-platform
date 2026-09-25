import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/officer', '/officer/*', '/officer/login', '/provider/portal', '/security'],
      },
    ],
    sitemap: 'https://ahcs.in/sitemap.xml',
  };
}
