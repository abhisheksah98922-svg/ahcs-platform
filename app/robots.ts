import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/officer', '/officer/', '/provider/portal', '/security'],
      },
    ],
    sitemap: 'https://ahcs.in/sitemap.xml',
  };
}
