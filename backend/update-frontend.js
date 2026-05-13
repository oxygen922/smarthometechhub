/**
 * 手动更新前端数据文件脚本
 */
const fs = require('fs').promises;
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');
const FRONTEND_DATA_FILE = path.join(__dirname, '../lib/articles-data.json');

async function updateFrontendData() {
  try {
    console.log('开始更新前端数据文件...');
    console.log('文章目录:', ARTICLES_DIR);
    console.log('前端数据文件:', FRONTEND_DATA_FILE);

    const allArticles = [];

    // 读取所有分类目录
    const dirs = await fs.readdir(ARTICLES_DIR);
    console.log('找到分类:', dirs);

    for (const dir of dirs) {
      const dirPath = path.join(ARTICLES_DIR, dir);
      const stat = await fs.stat(dirPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(dirPath);
        const mdFiles = files.filter(f => f.endsWith('.md'));
        console.log(`\n分类 ${dir}: ${mdFiles.length} 篇文章`);

        for (const file of mdFiles) {
          try {
            const filePath = path.join(dirPath, file);
            const content = await fs.readFile(filePath, 'utf8');

            // 解析Front Matter
            const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
            const match = content.match(frontMatterRegex);

            if (match) {
              const frontMatterText = match[1];
              const articleContent = match[2];

              const frontMatter = {};
              frontMatterText.split('\n').forEach(line => {
                const match = line.match(/^([^:]+):\s*(.+)$/);
                if (match) {
                  const key = match[1].trim();
                  let value = match[2].trim();

                  if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                  } else if (value === 'true') {
                    value = true;
                  } else if (value === 'false') {
                    value = false;
                  } else if (!isNaN(value)) {
                    value = Number(value);
                  }

                  if (key === 'tags') {
                    value = value.replace(/[\[\]]/g, '').split(',').map(t => t.trim());
                  }

                  frontMatter[key] = value;
                }
              });

              const article = {
                slug: frontMatter.slug || file.replace('.md', ''),
                title: frontMatter.title || 'No Title',
                date: frontMatter.date || new Date().toISOString().split('T')[0],
                category: frontMatter.category || dir,
                tags: frontMatter.tags || [],
                author: frontMatter.author || 'SmartHome TechHub',
                featuredImage: frontMatter.featuredImage || '',
                excerpt: frontMatter.excerpt || articleContent.substring(0, 150) + '...',
                content: articleContent || ''
              };

              allArticles.push(article);
              console.log(`  ✓ ${article.title.substring(0, 40)}...`);
            }
          } catch (error) {
            console.error(`  ✗ 解析失败 ${file}: ${error.message}`);
          }
        }
      }
    }

    // 按日期排序（最新的在前面）
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 写入前端数据文件
    await fs.writeFile(FRONTEND_DATA_FILE, JSON.stringify(allArticles, null, 2));

    console.log(`\n✓ 更新成功！总计 ${allArticles.length} 篇文章`);
    console.log(`✓ 文件保存位置: ${FRONTEND_DATA_FILE}`);
    console.log(`\n前端现在应该能看到这些文章了！`);

  } catch (error) {
    console.error('更新失败:', error);
    process.exit(1);
  }
}

updateFrontendData();
