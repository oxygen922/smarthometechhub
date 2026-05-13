/**
 * Article Detail Page - Smart Home TechHub
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllArticles } from '@/lib/content';
import { siteConfig } from '@/config/site.config';
import { ArticleContent } from '@/components/ArticleContent';

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [article.featuredImage], type: 'article' as const },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        {article.featuredImage && (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${article.featuredImage})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-slate-900/40 to-slate-900/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold bg-brand-primary text-white rounded-full uppercase tracking-wider">
                {article.category}
              </span>
              <h1 className="text-h1 md:text-display mb-4 text-white">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <span>By {article.author}</span>
                <span className="text-brand-primary">&bull;</span>
                <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm">
            <ArticleContent content={article.content} />
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-200">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-brand-primary">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-4 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-full border border-slate-200">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Author */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <h3 className="text-h3 mb-2 text-slate-900">About the Author</h3>
            <p className="text-brand-primary mb-4 text-subtitle font-semibold">{article.author}</p>
            <p className="text-body-small text-slate-600">
              Smart home technology expert specializing in comprehensive reviews of intelligent appliances. Passionate about helping consumers make informed decisions for their connected homes.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
