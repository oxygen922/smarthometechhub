/**
 * 首页数据处理工具
 * 保健品博客 - 自动根据文章分类和发布时间组织首页内容
 */

import { homepageConfig } from '@/config/homepage.config';

export interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  author: string;
  featuredImage: string;
  excerpt: string;
  content: string;
}

/**
 * 根据分类列表筛选文章
 */
export function getArticlesByCategories(
  articles: Article[],
  categories: string[]
): Article[] {
  return articles.filter((article) => {
    const articleCategory = article.category.toUpperCase();
    return categories.some((cat) =>
      articleCategory.includes(cat.toUpperCase())
    );
  });
}

/**
 * 获取精选文章（最新发布的前N篇）
 */
export function getFeaturedArticles(
  articles: Article[],
  count: number = 3
): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/**
 * 获取保健品推荐文章
 */
export function getProductArticles(
  articles: Article[],
  categories: string[] = homepageConfig.categoryMapping.products,
  count: number = 6
): Article[] {
  return getArticlesByCategories(articles, categories)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/**
 * 获取指南类文章
 */
export function getGuideArticles(
  articles: Article[],
  count: number = 4
): Article[] {
  return getArticlesByCategories(articles, homepageConfig.categoryMapping.guides)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/**
 * 获取首页各模块的文章（智能版本，跨区块去重）
 */
export function getHomepageArticles(articles: Article[], excludeSlugs: string[] = []) {
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const usedSlugs = new Set<string>(excludeSlugs);

  const pickUnique = (candidates: Article[], count: number): Article[] => {
    const picked = candidates
      .filter((a) => !usedSlugs.has(a.slug))
      .slice(0, count);
    picked.forEach((a) => usedSlugs.add(a.slug));
    return picked;
  };

  // 1. 精选区
  const hero = pickUnique(
    [...sortedArticles].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    homepageConfig.limits.hero
  );

  // 2. 保健品推荐（复用 destinations 字段名以保持与组件兼容）
  const productCandidates = getProductArticles(sortedArticles, homepageConfig.categoryMapping.products, sortedArticles.length);
  const destinations = pickUnique(productCandidates, homepageConfig.limits.products);

  // 3. 健康指南
  const guideCandidates = getGuideArticles(sortedArticles, sortedArticles.length);
  const guides = pickUnique(guideCandidates, homepageConfig.limits.guides);

  // 4. 最新文章
  const latest = pickUnique(sortedArticles, homepageConfig.limits.latest);

  return {
    hero,
    latest,
    destinations, // 保健品推荐（字段名保持兼容）
    guides,
    all: sortedArticles,
  };
}

/**
 * 检查是否应该显示某个模块
 */
export function shouldShowModule(moduleName: keyof typeof homepageConfig.modules): boolean {
  return homepageConfig.modules[moduleName] !== false;
}
