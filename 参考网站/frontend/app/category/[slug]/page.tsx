/**
 * Category Page - Smart Home TechHub
 */

import { notFound } from 'next/navigation';
import { getArticlesByCategory } from '@/lib/content';
import { siteConfig } from '@/config/site.config';
import { ArticleCard } from '@/components/ArticleCard';

export async function generateStaticParams() {
  return siteConfig.categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = siteConfig.categories.find((cat) => cat.slug === slug);
  if (!category) return { title: 'Category Not Found' };
  return { title: `${category.name} - ${siteConfig.name}`, description: category.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = siteConfig.categories.find((cat) => cat.slug === slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(category.name);

  return (
    <div className="min-h-screen bg-brand-bg py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {category.icon && <div className="text-5xl mb-4">{category.icon}</div>}
          <h1 className="text-h1 md:text-display text-slate-900 mb-4">
            {category.name}
          </h1>
          <p className="text-subtitle text-slate-600 max-w-2xl mx-auto">{category.description}</p>
          <p className="text-caption text-brand-primary mt-4 font-semibold">{articles.length} articles</p>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} showExcerpt={true} showReadingTime={true} showAuthor={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-slate-500 text-body">No articles in this category yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
