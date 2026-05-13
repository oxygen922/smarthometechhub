/**
 * 高级文章卡片组件 - 基于Taste Skill优化
 * 现代化设计，流畅交互，视觉深度
 */

import { Article } from '@/types/article';
import Link from 'next/link';
import { Clock, User, Calendar } from 'lucide-react';

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
  const readingTime = Math.ceil(article.content.length / 400);

  return (
    <Link
      href={`/article/${article.slug}`}
      className={`block group ${className}`}
    >
      <article className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1 border border-slate-700">
        {/* 图片容器 - 深色背景 */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {article.featuredImage && !article.featuredImage.includes('/images/') ? (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* 分类标签 - 现代化设计 */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-3 py-1.5 bg-slate-900/95 backdrop-blur-md rounded-lg text-xs font-semibold text-slate-100 shadow-lg border border-slate-700/50">
              {article.category}
            </span>
          </div>

          {/* 日期标签 */}
          {(article.publishedAt || article.date) && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-primary/95 backdrop-blur-md rounded-lg text-xs font-medium text-white shadow-lg">
                <Calendar className="h-3 w-3" />
                <span>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                </span>
              </span>
            </div>
          )}
        </div>

        {/* 内容区域 - 优化间距和层次 */}
        <div className="p-6">
          {/* 标题 - 高对比度白色 */}
          <h3 className="font-sans text-xl font-bold text-white leading-tight mb-3 group-hover:text-brand-primary transition-colors duration-200 line-clamp-2 tracking-tight">
            {article.title}
          </h3>

          {/* 摘要 - 更亮的颜色提高可读性 */}
          {showExcerpt && article.excerpt && (
            <p className="text-sm text-slate-200 mb-4 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* 元信息 - 提高对比度 */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
            <div className="flex items-center gap-4 text-xs text-slate-200">
              {showAuthor && article.author && (
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="h-3.5 w-3.5" />
                  <span>{article.author}</span>
                </div>
              )}
              {showReadingTime && (
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{readingTime} min</span>
                </div>
              )}
            </div>

            {/* 标签 - 明亮色彩 */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-brand-accent">{article.tags[0]}</span>
                {article.tags.length > 1 && (
                  <span className="text-xs text-slate-300">+{article.tags.length - 1}</span>
                )}
              </div>
            )}
          </div>

          {/* 价格/评分信息 */}
          {article.price && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary">
                <span className="text-base">💰</span>
                <span>{article.price}</span>
              </span>
            </div>
          )}

          {article.rating && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">评分</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.floor(article.rating!) ? 'text-amber-400' : 'text-slate-200'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-300 font-medium">({article.rating})</span>
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

/**
 * 紧凑型文章卡片 - 优化版本
 */
export function ArticleCardCompact({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="block group"
    >
      <article className="flex gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors duration-200">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {article.featuredImage ? (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-sans text-sm font-bold text-white leading-tight mb-1.5 group-hover:text-brand-primary transition-colors duration-200 line-clamp-2">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-200">
            <span className="font-medium">{article.category}</span>
            <span className="text-slate-300">•</span>
            <span className="font-medium">{Math.ceil(article.content.length / 400)} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
