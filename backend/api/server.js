/**
 * SmartHome TechHub API Server
 * 支持动态文章管理，部署在Hostinger上
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.API_PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('admin'));

// 文章目录路径
const ARTICLES_DIR = path.join(__dirname, '../frontend/content/articles');

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
    await fs.writeFile(filePath, content, 'utf8');
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

      // 处理数组字段
      if (key === 'tags') {
        value = value.replace(/[\[\]]/g, '').split(',').map(t => t.trim());
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
      frontMatterText += `${key}: [${value.join(', ')}]\n`;
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

// 获取单篇文章
app.get('/api/article/:category/:slug', async (req, res) => {
  try {
    const { category, slug } = req.params;
    const categoryPath = path.join(ARTICLES_DIR, category);

    // 查找文章文件
    const files = await fs.readdir(categoryPath);
    let articleFile = null;

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(categoryPath, file);
        const content = await readFileContent(filePath);
        const article = parseFrontMatter(content);

        if (article.slug === slug) {
          articleFile = { ...article, filename: file };
          break;
        }
      }
    }

    if (!articleFile) {
      return res.status(404).json({ success: false, error: '文章不存在' });
    }

    res.json({ success: true, article: articleFile });
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

// 更新文章
app.put('/api/articles/:category/:slug', async (req, res) => {
  try {
    const { category, slug } = req.params;
    const updates = req.body;

    const categoryPath = path.join(ARTICLES_DIR, category);

    // 查找现有文章
    const files = await fs.readdir(categoryPath);
    let existingFile = null;
    let existingArticle = null;

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(categoryPath, file);
        const content = await readFileContent(filePath);
        const article = parseFrontMatter(content);

        if (article.slug === slug) {
          existingFile = { filename: file, path: filePath };
          existingArticle = article;
          break;
        }
      }
    }

    if (!existingFile) {
      return res.status(404).json({ success: false, error: '文章不存在' });
    }

    // 合并更新
    const updatedArticle = {
      ...existingArticle,
      ...updates,
      slug: slug, // 保持slug不变
      category: category // 保持分类不变
    };

    const fileContent = stringifyFrontMatter(updatedArticle);
    await writeFileContent(existingFile.path, fileContent);

    res.json({
      success: true,
      message: '文章更新成功',
      article: updatedArticle
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

// 触发前端重新构建
app.post('/api/rebuild', async (req, res) => {
  try {
    // 这里可以添加触发前端重新构建的逻辑
    // 比如调用webhook或执行构建脚本

    res.json({
      success: true,
      message: '重新构建请求已发送',
      note: '请手动部署前端项目以查看更新'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: '服务器错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 SmartHome TechHub API Server running on port ${PORT}`);
  console.log(`📝 Admin interface: http://localhost:${PORT}/admin`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
});

module.exports = app;