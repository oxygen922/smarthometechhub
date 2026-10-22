import { getAllArticles } from '@/lib/content';
import { siteConfig } from '@/config/site.config';

// 每小时重新生成一次，结果进入全路由缓存
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(
  loc: string,
  lastModified: string,
  changeFrequency: string,
  priority: string
): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const articles = await getAllArticles();
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const now = new Date().toISOString();

  const staticPages: Array<[string, string, string]> = [
    ['/', 'daily', '1.0'],
    ['/about', 'monthly', '0.8'],
    ['/contact', 'monthly', '0.7'],
    ['/reviews', 'weekly', '0.9'],
  ];

  const entries: string[] = [];

  for (const [path, changeFrequency, priority] of staticPages) {
    entries.push(urlEntry(`${baseUrl}${path}`, now, changeFrequency, priority));
  }

  for (const category of siteConfig.categories) {
    entries.push(
      urlEntry(`${baseUrl}/category/${category.slug}`, now, 'daily', '0.8')
    );
  }

  for (const article of articles) {
    entries.push(
      urlEntry(
        `${baseUrl}/article/${article.slug}`,
        article.date ? new Date(article.date).toISOString() : now,
        'weekly',
        '0.6'
      )
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
