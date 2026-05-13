/**
 * 文章内容工具函数
 * 从预生成的 JSON 读取文章数据，不依赖 fs 运行时
 */

import articlesData from './articles-data.json';

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
 * 获取所有文章（按日期倒序排列，最新的在前面）
 */
export async function getAllArticles(): Promise<Article[]> {
  const articles = articlesData as Article[];
  // 按日期倒序排列，最新的文章在前面
  return articles.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * 根据 slug 获取单篇文章
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = (articlesData as Article[]).find(a => a.slug === slug);
  return article || null;
}

/**
 * 根据分类获取文章
 */
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const allArticles = articlesData as Article[];
  const categoryLower = category.toLowerCase();
  return allArticles.filter(article =>
    article.category.toLowerCase() === categoryLower
  );
}

/**
 * 获取所有分类
 */
export async function getCategories(): Promise<string[]> {
  const allArticles = articlesData as Article[];
  const categories = new Set(allArticles.map(article => article.category));
  return Array.from(categories);
}

// 保持向后兼容
import { Article as OldArticle } from '@/types/article';

/**
 * 获取所有文章（旧接口兼容）
 */
export async function getAllArticlesOld(): Promise<OldArticle[]> {
  const articles = await getAllArticles();
  return articles.map(article => ({
    ...article,
    publishedAt: new Date(article.date),
    updatedAt: new Date(article.date),
  }));
}

/**
 * 根据 slug 获取文章（旧接口兼容）
 */
export async function getArticleBySlugOld(slug: string): Promise<OldArticle | null> {
  const article = await getArticleBySlug(slug);
  if (!article) return null;

  return {
    ...article,
    publishedAt: new Date(article.date),
    updatedAt: new Date(article.date),
  };
}
