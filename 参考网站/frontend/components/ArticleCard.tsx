/**
 * Article Card Component - Smart Home TechHub
 */

'use client';

import { Article } from '@/types/article';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Calendar, Flame } from 'lucide-react';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
  showExcerpt?: boolean;
  showReadingTime?: boolean;
  showAuthor?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  showExcerpt = true,
  showReadingTime = true,
  showAuthor = true,
  className = '',
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const readingTime = Math.ceil(article.content.length / 400);
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      'Smart Toilets': '🚽',
      'Robot Vacuums': '🤖',
      'Lawn Mowers': '🌿',
      'Smart Kitchen': '🍳',
      'Air Purifiers': '💨',
      'Home Security': '🔒',
      'Smart Lighting': '💡',
      'Product Review': '⭐',
      'Buying Guide': '📋',
    };
    return iconMap[category] || '🏠';
  };

  return (
    <Link href={`/article/${article.slug}`} className={`block group ${className}`}>
      <article className="bg-brand-surface rounded-2xl overflow-hidden border border-slate-700/40 hover:border-brand-primary/40 transition-all duration-300 hover:shadow-glow-orange">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-light">
          {article.featuredImage && !imageError && (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          )}
          {/* Category Badge - Only show icon to avoid visual clutter */}
          {article.category && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-dark/90 backdrop-blur-sm rounded-full text-sm border border-slate-600/30 shadow-lg">
                {getCategoryIcon(article.category)}
              </span>
            </div>
          )}
          {/* Date Badge */}
          {(article.publishedAt || article.date) && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand-accent/90 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                <Calendar className="h-3 w-3" />
                <span>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString('en-US')
                    : new Date(article.date).toLocaleDateString('en-US')
                  }
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-title text-slate-900 leading-tight mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
            {article.title}
          </h3>

          {showExcerpt && article.excerpt && (
            <p className="text-body-small text-slate-600 mb-4 line-clamp-2">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              {showAuthor && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{article.author}</span>
                </div>
              )}
              {showReadingTime && (
                <div className="flex items-center gap-1 text-brand-primary/70">
                  <Flame className="h-3 w-3" />
                  <span>{readingTime} min</span>
                </div>
              )}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-brand-secondary font-medium">{article.tags[0]}</span>
                {article.tags.length > 1 && (
                  <span className="text-slate-600">+{article.tags.length - 1}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
