/**
 * SmartHome TechHub API Server
 * 支持动态文章管理，同时更新前端数据文件
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.API_PORT || 3003;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('admin'));

// 文章目录路径和前端数据文件路径
const ARTICLES_DIR = path.join(__dirname, '../content/articles');
const FRONTEND_DATA_FILE = path.join(__dirname, '../lib/articles-data.json');

console.log('文章目录:', ARTICLES_DIR);
console.log('前端数据文件:', FRONTEND_DATA_FILE);

// 工具函数
const readFileContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    throw new Error(`读取文件失败: ${error.message}`);
  }
};

const writeFileContent = async (filePath, content) => {
  try {
    // 确保以UTF-8编码写入
    await fs.writeFile(filePath, content, { encoding: 'utf8' });
    return { success: true };
  } catch (error) {
    throw new Error(`写入文件失败: ${error.message}`);
  }
};

const parseFrontMatter = (content) => {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    throw new Error('无效的文章格式');
  }

  const frontMatterText = match[1];
  const articleContent = match[2];

  const frontMatter = {};
  frontMatterText.split('\n').forEach(line => {
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      // 处理特殊格式
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if (!isNaN(value)) {
        value = Number(value);
      }

      // 处理数组字段 - 使用JSON解析确保格式正确
      if (key === 'tags') {
        if (value.startsWith('[')) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // 如果JSON解析失败，回退到简单的分割方法
            value = value.replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(t => t);
          }
        } else {
          value = value.split(',').map(t => t.trim()).filter(t => t);
        }
      }

      frontMatter[key] = value;
    }
  });

  return {
    ...frontMatter,
    content: articleContent.trim()
  };
};

const stringifyFrontMatter = (article) => {
  const { content, ...frontMatter } = article;

  let frontMatterText = '---\n';
  for (const [key, value] of Object.entries(frontMatter)) {
    if (Array.isArray(value)) {
      // 使用JSON序列化确保标准数组格式
      frontMatterText += `${key}: ${JSON.stringify(value)}\n`;
    } else if (typeof value === 'boolean') {
      frontMatterText += `${key}: ${value}\n`;
    } else if (typeof value === 'number') {
      frontMatterText += `${key}: ${value}\n`;
    } else if (typeof value === 'string') {
      frontMatterText += `${key}: "${value}"\n`;
    }
  }
  frontMatterText += '---\n';

  return frontMatterText + '\n' + content;
};

// 更新前端articles-data.json文件
async function updateFrontendData() {
  try {
    console.log('[前端数据] 开始更新 articles-data.json...');

    const categories = [];
    const allArticles = [];

    // 读取所有分类目录
    const dirs = await fs.readdir(ARTICLES_DIR);

    for (const dir of dirs) {
      const dirPath = path.join(ARTICLES_DIR, dir);
      const stat = await fs.stat(dirPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(dirPath);
        const mdFiles = files.filter(f => f.endsWith('.md'));

        for (const file of mdFiles) {
          try {
            const filePath = path.join(dirPath, file);
            const content = await readFileContent(filePath);
            const article = parseFrontMatter(content);

            allArticles.push({
              slug: article.slug || file.replace('.md', ''),
              title: article.title || 'No Title',
              date: article.date || new Date().toISOString().split('T')[0],
              category: article.category || dir,
              tags: article.tags || [],
              author: article.author || 'SmartHome TechHub',
              featuredImage: article.featuredImage || '',
              excerpt: article.excerpt || article.content.substring(0, 150) + '...',
              content: article.content || ''
            });
          } catch (error) {
            console.error(`  [错误] 解析文章失败 ${file}: ${error.message}`);
          }
        }

        categories.push({
          id: dir,
          name: dir.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          slug: dir,
          count: mdFiles.length
        });
      }
    }

    // 按日期排序
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 写入前端数据文件
    await writeFileContent(FRONTEND_DATA_FILE, JSON.stringify(allArticles, null, 2));

    console.log(`[前端数据] ✓ 更新成功！总计 ${allArticles.length} 篇文章`);

    return { success: true, total: allArticles.length };
  } catch (error) {
    console.error('[前端数据] ✗ 更新失败:', error.message);
    return { success: false, error: error.message };
  }
}

// API路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartHome TechHub API is running' });
});

// 获取所有分类
app.get('/api/categories', async (req, res) => {
  try {
    const categories = [];
    const dirs = await fs.readdir(ARTICLES_DIR);

    for (const dir of dirs) {
      const dirPath = path.join(ARTICLES_DIR, dir);
      const stat = await fs.stat(dirPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(dirPath);
        const articles = files.filter(f => f.endsWith('.md'));

        categories.push({
          id: dir,
          name: dir.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          slug: dir,
          count: articles.length,
          articles: articles
        });
      }
    }

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取指定分类的文章列表
app.get('/api/articles/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const categoryPath = path.join(ARTICLES_DIR, category);

    // 检查分类目录是否存在
    try {
      await fs.access(categoryPath);
    } catch {
      return res.status(404).json({ success: false, error: '分类不存在' });
    }

    const files = await fs.readdir(categoryPath);
    const articles = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(categoryPath, file);
        const content = await readFileContent(filePath);
        const article = parseFrontMatter(content);

        articles.push({
          ...article,
          filename: file,
          category: category
        });
      }
    }

    // 按日期排序
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创建新文章
app.post('/api/articles', async (req, res) => {
  try {
    const article = req.body;

    // 验证必需字段
    const requiredFields = ['title', 'slug', 'category', 'author', 'content'];
    const missingFields = requiredFields.filter(field => !article[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `缺少必需字段: ${missingFields.join(', ')}`
      });
    }

    // 检查分类目录
    const categoryPath = path.join(ARTICLES_DIR, article.category);
    try {
      await fs.access(categoryPath);
    } catch {
      await fs.mkdir(categoryPath, { recursive: true });
    }

    // 生成文件名
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}-${article.slug}.md`;
    const filePath = path.join(categoryPath, filename);

    // 检查文件是否已存在
    try {
      await fs.access(filePath);
      return res.status(400).json({ success: false, error: '文章已存在' });
    } catch {
      // 文件不存在，可以创建
    }

    // 添加默认值
    const completeArticle = {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || article.content.substring(0, 150) + '...',
      category: article.category,
      author: article.author,
      date: article.date || new Date().toISOString().split('T')[0],
      tags: article.tags || [],
      featuredImage: article.featuredImage || '',
      rating: article.rating || 0,
      price: article.price || '',
      content: article.content
    };

    const fileContent = stringifyFrontMatter(completeArticle);
    await writeFileContent(filePath, fileContent);

    // 更新前端数据文件
    await updateFrontendData();

    res.json({
      success: true,
      message: '文章创建成功',
      article: {
        ...completeArticle,
        filename: filename,
        path: filePath
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除文章
app.delete('/api/articles/:category/:slug', async (req, res) => {
  try {
    const { category, slug } = req.params;
    const categoryPath = path.join(ARTICLES_DIR, category);

    // 查找并删除文章
    const files = await fs.readdir(categoryPath);

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(categoryPath, file);
        const content = await readFileContent(filePath);
        const article = parseFrontMatter(content);

        if (article.slug === slug) {
          await fs.unlink(filePath);

          // 更新前端数据文件
          await updateFrontendData();

          return res.json({
            success: true,
            message: '文章删除成功',
            deletedFile: file
          });
        }
      }
    }

    res.status(404).json({ success: false, error: '文章不存在' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 手动触发前端数据更新
app.post('/api/update-frontend', async (req, res) => {
  const result = await updateFrontendData();
  res.json(result);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 SmartHome TechHub API Server running on port ${PORT}`);
  console.log(`📝 Articles dir: ${ARTICLES_DIR}`);
  console.log(`📊 Frontend data: ${FRONTEND_DATA_FILE}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
});

module.exports = app;
