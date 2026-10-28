/**
 * 文章内容工具函数
 * 运行时通过 fs 读取预生成的 JSON，避免 38MB 数据被内联进每个路由的 server bundle
 * 每个进程只读取并解析一次，后续全部走内存缓存
 */

import { readFile } from 'fs/promises';
import path from 'path';
import { Article as OldArticle } from '@/types/article';

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
  pinned?: boolean;
}

/**
 * 文章排序比较器：置顶文章（pinned: true）优先，其余按日期倒序
 */
function compareArticles(a: Article, b: Article): number {
  const aPinned = a.pinned === true ? 1 : 0;
  const bPinned = b.pinned === true ? 1 : 0;
  if (aPinned !== bPinned) return bPinned - aPinned;
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

const DATA_FILE = path.join(process.cwd(), 'lib', 'articles-data.json');

let dataPromise: Promise<Article[]> | null = null;

function loadArticles(): Promise<Article[]> {
  // 生产环境（含 next build / next start）进程内只读一次
  if (process.env.NODE_ENV === 'production' && dataPromise) {
    return dataPromise;
  }

  const read = readFile(DATA_FILE, 'utf-8')
    .then((raw) => JSON.parse(raw) as Article[])
    .catch((error) => {
      console.error('Failed to load articles-data.json:', error);
      return [] as Article[];
    });

  if (process.env.NODE_ENV === 'production') {
    dataPromise = read;
  }
  return read;
}

let sortedArticles: Article[] | null = null;
let slugIndex: Map<string, Article> | null = null;

/**
 * 获取所有文章（按日期倒序排列，最新的在前面）
 */
export async function getAllArticles(): Promise<Article[]> {
  if (process.env.NODE_ENV === 'production' && sortedArticles) {
    return sortedArticles;
  }
  const articles = await loadArticles();
  const sorted = [...articles].sort(compareArticles);
  if (process.env.NODE_ENV === 'production') {
    sortedArticles = sorted;
  }
  return sorted;
}

/**
 * 根据 slug 获取单篇文章（Map 索引，O(1)）
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  let index = slugIndex;
  if (!index) {
    const articles = await loadArticles();
    index = new Map(articles.map((article) => [article.slug, article]));
    if (process.env.NODE_ENV === 'production') {
      slugIndex = index;
    }
  }
  return index.get(slug) || null;
}

/**
 * 根据分类获取文章（按日期倒序）
 */
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const allArticles = await getAllArticles();
  const categoryLower = category.toLowerCase();
  return allArticles.filter(article =>
    article.category.toLowerCase() === categoryLower
  );
}

/**
 * 获取所有分类
 */
export async function getCategories(): Promise<string[]> {
  const allArticles = await loadArticles();
  const categories = new Set(allArticles.map(article => article.category));
  return Array.from(categories);
}

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
