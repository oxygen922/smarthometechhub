/**
 * 文章内容工具函数
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

// 内容目录 - 智能家电文章
// 尝试多个可能的路径位置（兼容本地开发和Vercel部署）
function getContentDir(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'content/articles'),
    path.join(process.cwd(), '../content/articles'),
    path.join(process.cwd(), '../../content/articles'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // 如果都不存在，返回默认路径（构建时可能会失败，但至少有个fallback）
  return possiblePaths[0];
}

const CONTENT_DIR = getContentDir();

/**
 * 清理YAML中的特殊字符（智能引号等）
 */
function sanitizeYAML(content: string): string {
  return content
    // 替换智能引号为普通引号
    .replace(/[‘’]/g, "'")  // 左单引号、右单引号
    .replace(/[“”]/g, '"')  // 左双引号、右双引号
    // 替换其他特殊字符
    .replace(/[–—]/g, '-')   // en-dash、em-dash
    .replace(/[…]/g, '...')       // 省略号
    // 移除其他不可打印字符（保留换行符和制表符）
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * 递归获取目录下所有markdown文件
 */
function getAllMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * 获取所有文章
 */
export async function getAllArticles(): Promise<Article[]> {
  try {
    console.log('[DEBUG] CONTENT_DIR:', CONTENT_DIR);
    console.log('[DEBUG] process.cwd():', process.cwd());

    const allFiles = getAllMarkdownFiles(CONTENT_DIR);
    console.log('[DEBUG] Found', allFiles.length, 'markdown files');
    const articles = allFiles.map(filePath => {
      try {
        let fileContent = fs.readFileSync(filePath, 'utf-8');
        // 清理YAML中的特殊字符
        fileContent = sanitizeYAML(fileContent);
        const { data, content } = matter(fileContent);

        const slug = data.slug || path.basename(filePath, '.md');

        return {
          slug,
          title: data.title || '',
          date: data.date || '',
          category: data.category || '',
          tags: data.tags || [],
          author: data.author || 'SmartHome TechHub Editorial Team',
          featuredImage: data.featuredImage || '',
          excerpt: data.excerpt || '',
          content,
        };
      } catch (error) {
        console.error(`Error parsing file ${filePath}:`, error);
        // 返回null，稍后过滤掉
        return null;
      }
    }).filter(article => article !== null);

    return articles
      .filter(article => article.date && article.date !== '')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

/**
 * 根据 slug 获取单篇文章（优先按 frontmatter slug 匹配，回退到文件名）
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    console.log('[DEBUG] Looking for slug:', slug, 'encodeURIComponent:', encodeURIComponent(slug));
    const allFiles = getAllMarkdownFiles(CONTENT_DIR);

    for (const filePath of allFiles) {
      let fileContent = fs.readFileSync(filePath, 'utf-8');
      // 清理YAML中的特殊字符
      fileContent = sanitizeYAML(fileContent);
      const { data, content } = matter(fileContent);
      const fileSlug = data.slug || path.basename(filePath, '.md');

      // 尝试多种匹配方式（处理URL编码问题）
      if (fileSlug === slug || fileSlug === decodeURIComponent(slug) || encodeURIComponent(fileSlug) === encodeURIComponent(slug)) {
        return {
          slug: fileSlug,
          title: data.title || '',
          date: data.date || '',
          category: data.category || '',
          tags: data.tags || [],
          author: data.author || 'SmartHome TechHub Editorial Team',
          featuredImage: data.featuredImage || '',
          excerpt: data.excerpt || '',
          content,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error reading article:', error);
    return null;
  }
}

/**
 * 根据分类获取文章
 */
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const allArticles = await getAllArticles();
  console.log('[DEBUG] getArticlesByCategory called with:', category);
  console.log('[DEBUG] Available article categories:', [...new Set(allArticles.map(a => a.category))]);
  const categoryLower = category.toLowerCase();
  const filtered = allArticles.filter(article =>
    article.category.toLowerCase() === categoryLower
  );
  console.log('[DEBUG] Filtered articles count:', filtered.length);
  return filtered;
}

/**
 * 获取所有分类
 */
export async function getCategories(): Promise<string[]> {
  const allArticles = await getAllArticles();
  const categories = new Set(allArticles.map(article => article.category));
  return Array.from(categories);
}
