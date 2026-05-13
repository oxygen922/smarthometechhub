/**
 * 手动更新前端JSON文件
 */

const fs = require('fs').promises;
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');
const FRONTEND_DATA_FILE = path.join(__dirname, '../lib/articles-data.json');

function parseFrontMatter(content) {
    const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
        throw new Error('无效的文章格式');
    }

    const frontMatterText = match[1];
    const articleContent = match[2];

    const frontMatter = {};
    const lines = frontMatterText.split(/\r?\n/);

    lines.forEach((line, index) => {
        const lineMatch = line.match(/^([^:]+):\s*(.+)$/);
        if (lineMatch) {
            const key = lineMatch[1].trim();
            let value = lineMatch[2].trim();

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
                if (value.startsWith('[')) {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        value = value.replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(t => t);
                    }
                } else {
                    value = value.split(',').map(t => t.trim()).filter(t => t);
                }
            }

            frontMatter[key] = value;
        }
    });

    return Object.assign({}, frontMatter, { content: articleContent.trim() });
}

async function updateFrontendData() {
    try {
        console.log('开始更新 articles-data.json...');

        const categories = [];
        const allArticles = [];

        const dirs = await fs.readdir(ARTICLES_DIR);

        for (const dir of dirs) {
            const dirPath = path.join(ARTICLES_DIR, dir);
            const stat = await fs.stat(dirPath);

            if (stat.isDirectory()) {
                const files = await fs.readdir(dirPath);
                const mdFiles = files.filter(f => f.endsWith('.md'));

                console.log(`处理分类: ${dir}, 文章数: ${mdFiles.length}`);

                for (const file of mdFiles) {
                    try {
                        const filePath = path.join(dirPath, file);
                        const content = await fs.readFile(filePath, 'utf8');
                        const article = parseFrontMatter(content);

                        // 安全地生成excerpt
                        let excerpt = article.excerpt || '';
                        if (!excerpt && article.content) {
                            excerpt = article.content.substring(0, 150) + '...';
                        } else if (!excerpt) {
                            excerpt = 'No excerpt available.';
                        }

                        allArticles.push({
                            slug: article.slug || file.replace('.md', ''),
                            title: article.title || 'No Title',
                            date: article.date || new Date().toISOString().split('T')[0],
                            category: article.category || dir,
                            tags: article.tags || [],
                            author: article.author || 'SmartHome TechHub',
                            featuredImage: article.featuredImage || '',
                            excerpt: excerpt,
                            content: article.content || ''
                        });
                    } catch (error) {
                        console.error(`  解析文章失败 ${file}: ${error.message}`);
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

        // 按日期排序（最新的在前）
        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 写入JSON文件
        await fs.writeFile(FRONTEND_DATA_FILE, JSON.stringify(allArticles, null, 2), 'utf8');

        console.log(`✓ 更新完成！总共 ${allArticles.length} 篇文章`);
        console.log(`✓ 文件已保存: ${FRONTEND_DATA_FILE}`);

        return {
            success: true,
            total: allArticles.length,
            categories: categories.length
        };

    } catch (error) {
        console.error('更新失败:', error);
        throw error;
    }
}

updateFrontendData().then(result => {
    console.log('\n更新结果:', result);
}).catch(error => {
    console.error('\n更新出错:', error);
    process.exit(1);
});
