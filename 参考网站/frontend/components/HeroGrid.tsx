/**
 * 英雄网格布局组件 - 运动营养主题
 */

import { Article } from '@/types/article';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame } from 'lucide-react';

interface HeroGridProps {
  featuredArticles: Article[];
}

export function HeroGrid({ featuredArticles }: HeroGridProps) {
  if (!featuredArticles || featuredArticles.length === 0) return null;

  const mainArticle = featuredArticles[0];
  const sideArticles = featuredArticles.slice(1, 3);

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px]">
        {/* Main Article */}
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl group bg-brand-surface border border-slate-700/40 hover:border-brand-primary/30 transition-all duration-300">
          <Link href={`/article/${mainArticle.slug}`} className="block h-full">
            <div className="relative h-full">
              {mainArticle.featuredImage && (
                <Image
                  src={mainArticle.featuredImage}
                  alt={mainArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
              {mainArticle.featuredImage && (
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent z-10" />
              )}
              {!mainArticle.featuredImage && (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-brand-surface z-0" />
              )}
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-full shadow-glow-orange uppercase tracking-wider">
                  <Flame className="h-3 w-3" /> Trending
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-brand-primary font-semibold">{mainArticle.category}</span>
                </div>
                <h2 className="text-h2 md:text-h1 leading-tight mb-3 group-hover:text-brand-primary transition-colors">
                  {mainArticle.title}
                </h2>
                <p className="text-sm text-slate-300 line-clamp-2 mb-3">{mainArticle.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" /><span>{Math.ceil(mainArticle.content.length / 400)} min read</span></div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Side Articles */}
        <div className="md:col-span-2 grid grid-rows-2 gap-4">
          {sideArticles.map((article) => (
            <div key={article.slug} className="relative overflow-hidden rounded-2xl group bg-brand-surface border border-slate-700/40 hover:border-brand-accent/30 transition-all duration-300">
              <Link href={`/article/${article.slug}`} className="block h-full">
                <div className="relative h-full">
                  {article.featuredImage && (
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  )}
                  {article.featuredImage && (
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent z-10" />
                  )}
                  {!article.featuredImage && (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-surface to-brand-dark z-0" />
                  )}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="badge-accent text-xs shadow-md uppercase tracking-wider">Hot</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-brand-accent font-semibold">{article.category}</span>
                    </div>
                    <h3 className="text-title leading-tight mb-2 group-hover:text-brand-accent transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3" /><span>{Math.ceil(article.content.length / 400)} min</span></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
