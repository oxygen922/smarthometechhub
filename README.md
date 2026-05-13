# 通用网站模板 - Next.js + Cloudflare Workers

这是一个现代化的、生产就绪的网站模板，基于 Next.js 15 和 Cloudflare Workers 构建。

**✨ 特点：**
- 🚀 开箱即用，无需复杂配置
- ⚡️ Cloudflare Workers 高性能部署
- 📱 完整的 SEO 优化
- 🎨 响应式设计
- 🔧 企业级配置

---

## 🚀 快速开始

### 第一步：重命名项目

修改以下文件中的项目名称：

1. **`frontend/package.json`**
   ```json
   "name": "your-website-name"
   ```

2. **`frontend/wrangler.toml`**
   ```toml
   name = "your-project-name"
   ```

3. **`frontend/config/site.config.ts`**
   ```typescript
   name: 'Your Website Name',
   url: 'https://your-domain.com',
   ```

### 第二步：安装依赖

```bash
cd frontend
npm install
```

### 第三步：本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 第四步：部署到 Cloudflare Workers

```bash
# 构建
npm run cf:build

# 部署
npm run cf:deploy
```

---

## 📝 配置指南

### 网站信息配置

编辑 `frontend/config/site.config.ts`：

```typescript
export const siteConfig: SiteConfig = {
  name: 'Your Website Name',        // 网站名称
  description: 'Website description', // SEO 描述
  url: 'https://your-domain.com',    // 网站域名
  categories: [
    // 你的导航分类...
  ],
};
```

### 导航分类配置

在 `site.config.ts` 中修改 `categories` 数组：

```typescript
categories: [
  {
    id: 'unique-id',           // 唯一标识符
    name: 'Display Name',      // 显示名称
    slug: 'url-slug',          // URL 友好名称
    icon: '🎯',               // 图标 emoji
    description: 'Description' // 分类描述
  },
  // 添加更多分类...
]
```

### 色彩配置

编辑 `frontend/tailwind.config.ts` 中的 `brand` 颜色：

```typescript
brand: {
  primary: '#YOUR_COLOR',    // 主色调
  secondary: '#YOUR_COLOR',  // 辅助色
  accent: '#YOUR_COLOR',     // 强调色
  dark: '#YOUR_COLOR',       // 深色背景
  light: '#YOUR_COLOR',      // 浅色背景
  bg: '#YOUR_COLOR',         // 主背景
}
```

---

## 🎯 项目结构

```
logicloop-template/
├── frontend/                    # Next.js 项目
│   ├── app/                    # 页面路由
│   │   ├── page.tsx           # 首页
│   │   ├── layout.tsx         # 布局（包含 SEO）
│   │   └── globals.css        # 全局样式
│   ├── components/            # React 组件
│   │   ├── SiteHeader.tsx     # 导航栏
│   │   └── SiteFooter.tsx     # 页脚
│   ├── config/                # 配置文件
│   │   └── site.config.ts     # 网站配置 ⭐
│   ├── content/               # 文章内容
│   │   └── articles/          # Markdown 文章
│   ├── lib/                   # 工具库
│   ├── public/                # 静态资源
│   │   ├── favicon.svg       # 网站图标
│   │   └── manifest.json     # PWA 配置
│   ├── wrangler.toml         # Cloudflare 配置 ⭐
│   ├── package.json          # 依赖管理
│   ├── next.config.ts        # Next.js 配置
│   └── tailwind.config.ts    # Tailwind 配置
└── README.md                  # 本文件
```

---

## 🎨 自定义功能

### 添加新页面

1. 在 `frontend/app/` 创建新目录
2. 添加 `page.tsx` 文件

例如：`frontend/app/about/page.tsx`

### 添加文章

在 `frontend/content/articles/` 添加 Markdown 文件：

```markdown
---
title: "文章标题"
date: "2026-05-07"
category: "CATEGORY_ID"
excerpt: "文章摘要"
featuredImage: "https://example.com/image.jpg"
---

# 文章内容

这里是文章正文...
```

### 修改网站图标

1. 访问 https://favicon.io/favicon-generator/
2. 生成图标并下载
3. 复制到 `frontend/public/` 目录

详细说明：查看 `frontend/public/README.md`

---

## 📊 SEO 配置

模板已包含完整的 SEO 优化：

✅ **自动生成的 SEO 端点：**
- `/sitemap.xml` - 搜索引擎站点地图
- `/robots.txt` - 爬虫规则
- `/manifest.json` - PWA 配置

✅ **社交媒体优化：**
- Open Graph (Facebook, LinkedIn)
- Twitter Cards

✅ **部署后记得：**
1. 更新 `site.config.ts` 中的域名
2. 生成网站图标
3. 提交 sitemap 到搜索引擎

---

## ⚙️ Cloudflare Workers 部署

### 方式一：直接部署（推荐）

```bash
cd frontend
npm run cf:deploy
```

### 方式二：Cloudflare 仪表板

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 创建新 Worker
4. 连接 GitHub 仓库
5. 配置构建设置：
   - **根目录**: `frontend`
   - **构建命令**: `npm install && npx opennextjs-cloudflare build`
   - **Node.js 版本**: 20

---

## 🛠️ 技术栈

- **框架**: Next.js 15
- **UI**: React 18
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **部署**: Cloudflare Workers + OpenNext
- **包管理**: npm

---

## 📚 功能特性

### 已包含的功能

- ✅ 响应式设计
- ✅ SEO 优化（完整元标签）
- ✅ 社交媒体分享优化
- ✅ PWA 支持
- ✅ 自动生成 Sitemap
- ✅ 动态 Robots.txt
- ✅ 图片优化
- ✅ 代码分割
- ✅ 性能优化

### 可选功能

- 📝 博客系统
- 🔍 搜索功能
- 💬 评论区
- 📧 邮件订阅
- 🌐 多语言支持

---

## 🐛 常见问题

### Q: 如何修改网站颜色？

A: 编辑 `frontend/tailwind.config.ts` 中的 `brand` 配置。

### Q: 如何添加新的导航分类？

A: 在 `frontend/config/site.config.ts` 的 `categories` 数组中添加。

### Q: 本地开发报错怎么办？

A: 确保 Node.js 版本 >= 20，然后重新运行 `npm install`。

### Q: 部署后页面 404？

A: 检查 `wrangler.toml` 中的 `name` 是否与你的 Cloudflare Workers 名称一致。

---

## 📄 许可证

MIT License - 可自由使用和修改

---

## 🎉 开始使用

现在你已经准备好开始构建你的网站了！

1. ✏️ 修改配置文件
2. 🎨 定制颜色和样式
3. 📝 添加你的内容
4. 🚀 部署到 Cloudflare Workers

祝你好运！🚀
