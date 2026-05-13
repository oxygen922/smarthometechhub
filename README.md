# SmartHome TechHub - 自动化内容生产系统

一个基于 Next.js 的智能家居评测网站，配备完整的自动化内容生产系统：**RSS采集 → AI改写 → 智能配图 → R2存储 → 自动发布**。

---

## 🎯 系统概述

### 核心功能
- 🤖 **自动化内容生产** - DeepSeek AI驱动的文章改写系统
- 🖼️ **智能配图系统** - Pexels + Pixabay双源图片搜索
- 📦 **R2永久存储** - Cloudflare R2 CDN图片托管
- 📝 **Markdown管理** - 基于Markdown的文章内容管理
- 🚀 **自动发布API** - 一键发布并更新前端数据

### 技术栈
- **前端**: Next.js 15 + React 18 + Tailwind CSS
- **后端**: Express.js API服务器
- **AI引擎**: DeepSeek API
- **图片源**: Pexels API + Pixabay API
- **存储**: Cloudflare R2 (S3兼容API)
- **语言**: TypeScript + Python 3

---

## 📁 项目架构

```
smarthometechhub/
├── backend/                         # 后端服务和自动化脚本
│   ├── api-server.js               # Express API服务器 ⭐
│   ├── update-frontend.js          # 手动更新前端数据脚本
│   ├── smart_image_finder.py       # 智能图片查找和R2上传 ⭐
│   ├── auto_content_workflow.py    # 完整的自动化工作流 ⭐
│   └── .env                        # 环境变量配置 ⭐
├── content/                        # 文章内容存储
│   └── articles/                   # Markdown文章源文件
│       ├── robot-vacuums/          # 按分类组织的文章
│       ├── smart-speakers/
│       └── [category-slug]/
├── lib/                            # 前端数据文件
│   ├── articles-data.json          # 前端文章数据源 ⭐
│   ├── content.ts                  # 文章内容解析库
│   └── cf-image-loader.ts          # Cloudflare图片加载器
├── app/                            # Next.js App Router
│   ├── page.tsx                    # 首页
│   ├── article/[slug]/page.tsx     # 文章详情页
│   ├── category/[slug]/page.tsx    # 分类页
│   └── layout.tsx                  # 根布局
├── components/                     # React组件
│   ├── ArticleContent.tsx          # Markdown内容渲染
│   └── [other components]
├── config/                         # 配置文件
│   └── site.config.ts              # 网站配置
├── public/                         # 静态资源
├── next.config.ts                  # Next.js配置 ⭐
├── package.json                    # 依赖管理
└── README.md                       # 本文件
```

---

## 🔄 文章生产流程

### 方式一：自动化工作流（推荐）

#### 流程图
```
RSS源采集 → DeepSeek AI改写 → Pexels/Pixabay配图 → R2上传 → API发布 → 前端更新
```

#### 详细步骤

**1. RSS源采集**
- 脚本: `backend/auto_content_workflow.py`
- 从配置的RSS源获取最新文章
- 支持多个RSS源并发采集

**2. AI智能改写**
- 使用DeepSeek API重写内容
- 保持原意但完全原创的表达
- 生成SEO友好的英文内容
- 自动添加产品评测的专业结构

**3. 智能配图**
- 脚本: `backend/smart_image_finder.py`
- 根据文章关键词搜索图片
- Pexels和Pixabay双源查询
- 基于内容hash生成唯一文件名（确保每篇文章图片不同）
- 自动下载高质量图片

**4. R2存储上传**
- 使用boto3 S3兼容API
- 上传到Cloudflare R2
- 生成永久CDN链接
- 自动组织到分类目录

**5. 自动发布**
- 调用API创建文章
- 生成Markdown文件（包含Front Matter）
- 自动更新`lib/articles-data.json`
- 前端立即显示新文章

#### 使用方法

```bash
# 进入后端目录
cd backend

# 运行完整的自动化工作流
python auto_content_workflow.py
```

**配置文件** - `backend/.env`:
```env
# DeepSeek AI配置
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_BASE=https://api.deepseek.com

# 图片API配置
PEXELS_API_KEY=your_pexels_api_key
PIXABAY_API_KEY=your_pixabay_api_key

# Cloudflare R2配置
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=smarthometechhub
R2_PUBLIC_URL=https://pub-a6a4ae7f5151464cb2be257af37faafe.r2.dev

# API服务器配置
API_PORT=3003
```

---

### 方式二：手动发布流程

#### 1. 准备文章内容

创建Markdown文件，路径：`content/articles/[category-slug]/YYYY-MM-DD-[article-slug].md`

**Front Matter格式**:
```markdown
---
title: "Article Title in English"
slug: "article-slug"
excerpt: "A brief summary of the article content..."
category: "robot-vacuums"
author: "SmartHome TechHub Editorial Team"
date: "2026-05-13"
tags: ["review", "robot-vacuum", "2026", "smart-home"]
featuredImage: "https://pub-xxx.r2.dev/articles/robot-vacuums/image.jpg"
rating: 4.8
price: "$1,299"
---

# Article Title

Article content in Markdown format...

## Technical Specifications

| Parameter | 2026 Model | Industry Average |
|-----------|------------|------------------|
| Suction | 6500Pa | 4000Pa |
```

#### 2. 上传图片到R2（可选）

如果使用外部图片，可以跳过此步。要上传到R2：

```bash
cd backend

# 使用智能图片查找脚本
python smart_image_finder.py "robot vacuum cleaner" "robot-vacuums"
```

脚本会：
1. 搜索相关图片
2. 下载最佳匹配
3. 上传到R2
4. 返回CDN链接

#### 3. 发布文章

**方法A: 直接创建Markdown文件**
- 将文件放到`content/articles/[category]/`目录
- 运行更新脚本：`node backend/update-frontend.js`

**方法B: 使用API发布**

```bash
# 启动API服务器
cd backend
node api-server.js

# 发布文章
curl -X POST http://localhost:3003/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Article Title",
    "slug": "article-slug",
    "category": "robot-vacuums",
    "author": "SmartHome TechHub Editorial Team",
    "content": "# Article Content\n\n...",
    "excerpt": "Brief summary...",
    "tags": ["review", "robot-vacuum"],
    "featuredImage": "https://pub-xxx.r2.dev/image.jpg",
    "rating": 4.8,
    "price": "$1,299"
  }'
```

#### 4. 验证发布

```bash
# 手动触发前端数据更新
curl -X POST http://localhost:3003/api/update-frontend

# 检查前端数据
cat lib/articles-data.json
```

---

## 🔧 关键文件说明

### 核心文件

| 文件路径 | 作用 | 维护频率 |
|---------|------|----------|
| `backend/api-server.js` | Express API服务器，处理文章CRUD | 核心服务，很少修改 |
| `backend/auto_content_workflow.py` | 完整自动化工作流 | 根据需求调整 |
| `backend/smart_image_finder.py` | 智能图片查找和R2上传 | 功能完善，很少修改 |
| `lib/articles-data.json` | 前端文章数据源（自动生成） | 每次发布时更新 |
| `content/articles/**/*.md` | Markdown文章源文件 | 每篇新文章创建一个 |
| `next.config.ts` | Next.js配置（包含R2域名） | 部署前确认 |

### 数据流

```
[Markdown文件] → [API服务器] → [articles-data.json] → [Next.js前端] → [用户界面]
     ↓
[content/articles/**/*.md]
     ↓
[parseFrontMatter()] → 提取元数据和内容
     ↓
[updateFrontendData()] → 生成JSON数组
     ↓
[lib/articles-data.json] → 前端读取
     ↓
[getArticleBySlug()] → 路由获取文章
     ↓
[ArticleContent组件] → 渲染Markdown
```

---

## 🚀 开发和部署

### 本地开发

**1. 安装依赖**
```bash
# 安装前端依赖
npm install

# 安装Python依赖
cd backend
pip install -r requirements.txt
```

**2. 配置环境变量**
```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑配置，填入你的API密钥
nano backend/.env
```

**3. 启动服务**
```bash
# 启动API服务器
cd backend
node api-server.js &

# 启动Next.js开发服务器
cd ..
npm run dev
```

**4. 访问网站**
- 前端: http://localhost:3000
- API: http://localhost:3003/api

### 生产部署

**1. 构建前端**
```bash
npm run build
```

**2. 部署到Vercel/Cloudflare Pages**
```bash
# Vercel
vercel deploy

# Cloudflare Pages
npm run cf:deploy
```

**3. 启动生产API服务器**
```bash
cd backend
NODE_ENV=production node api-server.js
```

或使用PM2：
```bash
pm2 start backend/api-server.js --name smarthometech-api
pm2 startup
pm2 save
```

---

## 🎨 内容创作指南

### 文章结构要求

每篇英文文章应包含：

1. **SEO优化的标题**
   - 包含产品名称和年份
   - 突出核心卖点（Review, Ultimate Guide, Comparison）

2. **吸引人的摘要**
   - 150-200字符
   - 概述文章价值

3. **专业内容结构**
   - 产品简介
   - 主要功能详解
   - 技术规格对比（使用表格）
   - 性能测试数据
   - 购买建议（适合/不适合人群）
   - 价格分析
   - 总结和评分

4. **富媒体元素**
   - 高质量产品图片（R2托管）
   - 技术规格表格
   - 性能对比图表
   - 产品截图

### Front Matter必填字段

```yaml
---
title: "Must be in English, SEO friendly"
slug: "unique-url-friendly-identifier"
excerpt: "150-200 character summary"
category: "must match site.config.ts categories"
author: "SmartHome TechHub Editorial Team"
date: "YYYY-MM-DD"
tags: ["keyword1", "keyword2", "keyword3"]
featuredImage: "https://r2-cdn-url/image.jpg"
rating: 0-5  # 可选
price: "$XXX"  # 可选
---
```

---

## 🔍 故障排查

### 问题1: 前端不显示新文章

**原因**: `articles-data.json`未更新

**解决**:
```bash
curl -X POST http://localhost:3003/api/update-frontend
```

### 问题2: 图片加载失败

**原因**: R2域名未在`next.config.ts`中配置

**解决**:
在`next.config.ts`的`images.remotePatterns`中添加：
```typescript
{
  protocol: 'https',
  hostname: 'pub-xxx.r2.dev',
}
```

### 问题3: API返回404

**原因**: API服务器未启动或端口冲突

**解决**:
```bash
# 检查端口占用
netstat -ano | findstr :3003

# 重启API服务器
cd backend
node api-server.js
```

### 问题4: 中文内容显示为乱码

**原因**: Markdown文件编码不是UTF-8

**解决**:
确保文件以UTF-8编码保存：
```bash
# 检查编码
file -i content/articles/**/*.md

# 转换为UTF-8
iconv -f GBK -t UTF-8 input.md > output.md
```

---

## 📊 监控和维护

### 定期任务

**每日**:
- 运行自动化工作流发布新文章
- 检查API服务器状态

**每周**:
- 分析网站流量和热门文章
- 更新产品信息和价格
- 检查死链和图片

**每月**:
- 审核和优化SEO策略
- 更新竞品对比数据
- 清理R2存储中的无用图片

### 性能优化

1. **图片优化**: 使用R2 CDN自动压缩和转换格式
2. **代码分割**: Next.js自动进行
3. **预加载**: 关键CSS和字体预加载
4. **缓存策略**: 静态资源长期缓存

---

## 🛡️ 安全注意事项

### 环境变量保护
- ❌ 永远不要提交`.env`文件到Git
- ✅ 使用`.env.example`作为模板
- ✅ 生产环境使用环境变量管理服务

### API密钥轮换
- 每90天更换API密钥
- 使用不同的密钥用于开发和生产
- 监控API使用量和异常调用

---

## 📈 扩展功能

### 待实现功能

- [ ] 搜索功能
- [ ] 文章评论系统
- [ ] 邮件订阅
- [ ] 社交媒体分享按钮
- [ ] 相关文章推荐
- [ ] 产品价格追踪
- [ ] 多语言支持
- [ ] 管理后台界面

---

## 📞 支持和联系

- **项目维护**: SmartHome TechHub Team
- **技术栈**: Next.js 15 + Express + Python
- **部署**: Vercel / Cloudflare Pages
- **API服务器**: Node.js + Express

---

## 📄 许可证

MIT License - 可自由使用和修改

---

## 🎉 快速开始

1. **克隆项目**: `git clone [repo-url]`
2. **安装依赖**: `npm install` 和 `pip install -r backend/requirements.txt`
3. **配置环境**: 复制并编辑`backend/.env`
4. **启动服务**: `node backend/api-server.js` 和 `npm run dev`
5. **发布文章**: 运行`python backend/auto_content_workflow.py`

开始自动化生产高质量内容！🚀
