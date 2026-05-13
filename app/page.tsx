/**
 * SmartHome TechHub - Homepage
 * Smart appliance reviews, guides, and comparisons
 */

import { siteConfig } from '@/config/site.config';
import { getAllArticles } from '@/lib/content';
import { getHomepageArticles } from '@/lib/homepage';
import { ArticleCard } from '@/components/ArticleCard';
import { HeroGrid } from '@/components/HeroGrid';
import { ImageScrollHero } from '@/components/ImageScrollHero';
import { NewsletterSubscribe } from '@/components/NewsletterSubscribe';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: siteConfig.name,
    description: siteConfig.description,
  };
}

export default async function HomePage() {
  const articles = await getAllArticles();

  const heroBannerSlug = articles.length > 0 ? [articles[0].slug] : [];
  const homepageArticles = getHomepageArticles(articles, heroBannerSlug);

  const hasProducts = homepageArticles.destinations.length > 0;
  const hasGuides = homepageArticles.guides.length > 0;

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* 1. Hero Banner */}
      <ImageScrollHero
        title={articles.length > 0 ? articles[0].title : 'Smart Living, Simplified'}
        subtitle="Intelligent Home Technology"
        description={
          articles.length > 0
            ? articles[0].excerpt || 'Expert reviews and guides for smart home appliances. Discover the best intelligent toilets, robot vacuums, lawn mowers, and more.'
            : 'Expert reviews and guides for smart home appliances. Discover the best intelligent toilets, robot vacuums, lawn mowers, and more.'
        }
        backgroundImage={articles.length > 0 ? articles[0].featuredImage : ''}
        ctaText="Read Full Review"
        ctaLink={articles.length > 0 ? `/article/${articles[0].slug}` : `/`}
      />

      {/* 2. Featured This Week */}
      {homepageArticles.hero.length > 0 && (
        <section className="py-16 bg-brand-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-brand-primary mb-4">What&apos;s Hot</p>
              <h2 className="text-headline md:text-display text-slate-900">
                Featured This Week
              </h2>
            </div>
            <HeroGrid featuredArticles={homepageArticles.hero} />
          </div>
        </section>
      )}

      {/* 3. Product Spotlight */}
      {hasProducts && homepageArticles.destinations.length > 0 && (
        <section className="py-16 bg-brand-surface border-y border-slate-700/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-brand-accent mb-4">In-Depth Reviews</p>
              <h2 className="text-headline md:text-display text-slate-900">
                Featured Appliances
              </h2>
              <p className="text-subtitle text-slate-400 max-w-2xl mx-auto mt-4">
                Comprehensive reviews of the latest smart home technology and intelligent appliances
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homepageArticles.destinations.slice(0, 6).map((article) => (
                <div key={article.slug}>
                  <ArticleCard article={article} showExcerpt={true} showReadingTime={true} showAuthor={false} />
                </div>
              ))}
            </div>
            {homepageArticles.destinations.length > 6 && (
              <div className="text-center mt-10">
                <Link
                  href="/category/smart-toilets"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary/90 transition-all uppercase tracking-wider text-sm"
                >
                  View All Reviews
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Smart Home Guides */}
      {hasGuides && homepageArticles.guides.length > 0 && (
        <section className="py-16 bg-brand-bg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-brand-secondary mb-2">Learn</p>
                <h2 className="text-h2 md:text-headline text-slate-900">
                  Smart Home Guides
                </h2>
              </div>
              <Link href="/" className="text-sm text-brand-primary hover:text-brand-accent font-bold transition-colors uppercase tracking-wider">
                All Guides →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {homepageArticles.guides.map((article) => (
                <div key={article.slug}>
                  <ArticleCard article={article} showExcerpt={true} showReadingTime={false} showAuthor={false} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Latest Articles */}
      {homepageArticles.latest.length > 0 && (
        <section className="py-16 bg-brand-surface border-y border-slate-700/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-brand-primary mb-2">Fresh</p>
                <h2 className="text-h2 md:text-headline text-slate-900">
                  Latest Articles
                </h2>
              </div>
              <Link href="/" className="text-sm text-brand-primary hover:text-brand-accent font-bold transition-colors uppercase tracking-wider">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homepageArticles.latest.map((article, index) => (
                <div key={article.slug} className={index === 0 ? 'md:col-span-2' : ''}>
                  <ArticleCard article={article} showExcerpt={true} showReadingTime={true} showAuthor={true} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Empty State */}
      {articles.length === 0 && (
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🏠</div>
              <h2 className="text-h2 mb-4 text-slate-900">
                Coming Soon
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                We&apos;re preparing comprehensive smart home appliance reviews and guides. Stay tuned for expert insights on intelligent toilets, robot vacuums, lawn mowers, and more.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Weekly Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Expert Testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Unbiased Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Newsletter */}
      <NewsletterSubscribe
        title="Stay Ahead of Smart Home Tech"
        description="Weekly smart home appliance reviews, buying guides, and exclusive deals delivered to your inbox"
      />
    </div>
  );
}
