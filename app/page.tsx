/**
 * SmartHome TechHub 首页
 * 1:1 复刻 smarthometechhub.online 网站结构
 */

// 强制静态输出，Cloudflare Workers 没有 fs，不能动态渲染
export const dynamic = 'force-static';

import { siteConfig } from '@/config/site.config';
import { getAllArticles } from '@/lib/content';
import {
  getHomepageArticles,
  groupArticlesForHomepage,
} from '@/lib/homepage';
import { ArticleCard } from '@/components/ArticleCard';
import { HeroGrid } from '@/components/HeroGrid';
import { ImageScrollHero } from '@/components/ImageScrollHero';
import { NewsletterSubscribe } from '@/components/NewsletterSubscribe';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: siteConfig.name,
    description: siteConfig.description,
  };
}

export default async function HomePage() {
  const articles = await getAllArticles();

  // 智能组织首页内容（排除已被 Hero 横幅使用的文章，确保全页去重）
  const heroBannerSlug = articles.length > 0 ? [articles[0].slug] : [];
  const homepageArticles = getHomepageArticles(articles, heroBannerSlug);
  const groupedCategories = groupArticlesForHomepage(articles);

  // 检查各分类是否有文章
  const hasAnyArticles = articles.length > 0;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* 1. New Weekly Hero Banner */}
      <ImageScrollHero
        title={articles.length > 0 ? articles[0].title : 'New Weekly'}
        subtitle="Intelligent Home Technology"
        description={
          articles.length > 0
            ? articles[0].excerpt || 'Expert reviews and guides for smart home appliances and intelligent living technology.'
            : 'Expert reviews and guides for smart home appliances and intelligent living technology.'
        }
        backgroundImage={articles.length > 0 ? articles[0].featuredImage : ''}
        ctaText="Read Full Review"
        ctaLink={articles.length > 0 ? `/article/${articles[0].slug}` : `/`}
      />

      {/* 2. What's Hot - Featured This Week */}
      {homepageArticles.hero.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="font-bold text-brand-dark mb-4"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em'
                }}
              >
                What's Hot
              </h2>
              <p
                className="text-muted-foreground max-w-2xl mx-auto"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '1.125rem',
                  lineHeight: '1.6'
                }}
              >
                Featured This Week
              </p>
            </div>
            <HeroGrid featuredArticles={homepageArticles.hero} />
          </div>
        </section>
      )}

      {/* 3. In-Depth Reviews - 按分类展示深度评测 */}
      {hasAnyArticles && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="font-bold text-brand-dark mb-4"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em'
                }}
              >
                In-Depth Reviews
              </h2>
              <p
                className="text-muted-foreground max-w-2xl mx-auto"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '1.125rem',
                  lineHeight: '1.6'
                }}
              >
                Featured Appliances
              </p>
            </div>

            {/* 显示各分类最新文章 */}
            {siteConfig.categories.map((category) => {
              const categoryArticles = articles.filter(
                article => article.category === category.slug
              ).slice(0, 3);

              if (categoryArticles.length === 0) return null;

              return (
                <div key={category.id} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </h3>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-brand-primary hover:underline text-sm font-medium"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryArticles.map((article) => (
                      <div key={article.slug}>
                        <ArticleCard
                          article={article}
                          showExcerpt={true}
                          showReadingTime={true}
                          showAuthor={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Learn - Smart Home Guides */}
      {homepageArticles.guides.length > 0 && (
        <section className="py-16 bg-brand-light">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="font-bold text-brand-dark"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em'
                }}
              >
                Learn
              </h2>
              <Link
                href="/"
                className="text-sm text-brand-primary hover:underline font-medium"
              >
                All Guides →
              </Link>
            </div>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Smart Home Guides
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {homepageArticles.guides.map((article) => (
                <div key={article.slug}>
                  <ArticleCard
                    article={article}
                    showExcerpt={true}
                    showReadingTime={false}
                    showAuthor={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Fresh - Latest Articles */}
      {homepageArticles.latest.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="font-bold text-brand-dark"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em'
                }}
              >
                Fresh
              </h2>
              <Link
                href="/"
                className="text-sm text-brand-primary hover:underline font-medium"
              >
                View All →
              </Link>
            </div>
            <p className="text-muted-foreground mb-8">
              Latest Articles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homepageArticles.latest.map((article) => (
                <div key={article.slug}>
                  <ArticleCard
                    article={article}
                    showExcerpt={true}
                    showReadingTime={true}
                    showAuthor={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Empty State - Show when no articles */}
      {articles.length === 0 && (
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🏠</div>
              <h2 className="font-serif text-3xl font-bold text-brand-dark mb-4">
                Welcome to SmartHome TechHub
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We're preparing comprehensive smart home reviews and guides. Stay tuned for expert insights on the latest intelligent home technology.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Weekly Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Expert Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                  <span>Smart Home Tech</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Newsletter Subscription */}
      <NewsletterSubscribe
        title="Stay Ahead of Smart Home Tech"
        description="Weekly smart home appliance reviews, buying guides, and exclusive deals delivered to your inbox"
      />

    </div>
  );
}
