/**
 * 文章类型定义 - 保健品博客
 */

export interface Article {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  date: string;
  publishedAt?: Date;
  updatedAt?: Date;
  author: string;
  tags: string[];
  featuredImage: string;
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  readingTime?: string;
  price?: string;
  rating?: number;
}

export interface ArticleMetadata {
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  excerpt: string;
  featuredImage: string;
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  categories: Category[];
}
