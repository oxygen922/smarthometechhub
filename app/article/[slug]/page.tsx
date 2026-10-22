/**
 * 文章详情页
 */

// 强制静态输出
export const dynamic = 'force-static';

// 未预渲染的 slug 在首次请求时按需生成静态页并缓存（ISR），避免构建期全量预渲染
export const dynamicParams = true;

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllArticles } from '@/lib/content';
import { siteConfig } from '@/config/site.config';
import { ArticleContent } from '@/components/ArticleContent';

// 构建期仅预渲染最新 N 篇（ARTICLE_PRERENDER_LIMIT，默认 100；设为 0 表示全部按需生成）
const PRERENDER_LIMIT = Number.parseInt(
  process.env.ARTICLE_PRERENDER_LIMIT ?? '100',
  10
);

export async function generateStaticParams() {
  if (!Number.isFinite(PRERENDER_LIMIT) || PRERENDER_LIMIT <= 0) {
    return [];
  }
  const articles = await getAllArticles();
  return articles
    .slice(0, PRERENDER_LIMIT)
    .map((article) => ({
      slug: article.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {article.featuredImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${article.featuredImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold bg-brand-accent rounded-full">
                {article.category}
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <span>By {article.author}</span>
                <span>•</span>
                <span>{new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <ArticleContent content={article.content} />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="font-semibold mb-4 text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-900 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Author Info */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-light rounded-xl p-8">
            <h3 className="font-serif text-2xl font-bold mb-2">About the Author</h3>
            <p className="text-muted-foreground mb-4">{article.author}</p>
            <p className="text-sm text-muted-foreground">
              Professional travel writer and destination expert. Passionate about discovering hidden gems and sharing authentic travel experiences from around the world.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
