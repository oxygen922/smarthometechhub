# 📋 模板配置检查清单

使用这个模板前，请按照以下清单进行配置：

---

## 🔧 必须修改的文件

### 1. 项目配置文件

- [ ] **`frontend/package.json`**
  - 修改 `"name": "your-website-frontend"` 为你的项目名称
  
- [ ] **`frontend/wrangler.toml`**
  - 修改 `name = "your-project-name"` 为你的 Workers 名称
  - 修改 `service = "your-project-name"` 为相同的名称

### 2. 网站信息配置

- [ ] **`frontend/config/site.config.ts`**
  ```typescript
  name: 'Your Website Name',              // 网站名称
  description: 'Your website description',  // 网站描述
  url: 'https://your-domain.com',         // 你的域名
  ```
  - 修改 `categories` 数组为你的导航分类

### 3. 环境变量（可选）

- [ ] **创建 `.env.local` 文件**
  ```bash
  NEXT_PUBLIC_SITE_URL=https://your-domain.com
  ```

---

## 🎨 推荐修改的文件

### 设计相关

- [ ] **`frontend/tailwind.config.ts`**
  - 修改 `brand` 颜色配置为你的品牌色
  
- [ ] **`frontend/app/layout.tsx`**
  - 检查 SEO 元标签
  - 修改 `verification` 字段添加搜索引擎验证码

### 图标相关

- [ ] **网站图标**
  - 生成并添加 `favicon.ico`
  - 生成并添加 `apple-touch-icon.png`
  - 生成并添加 `og-image.png`
  
  详细步骤：查看 `frontend/public/README.md`

---

## 🚀 部署前检查

### 本地测试

- [ ] 运行 `npm install` 安装依赖
- [ ] 运行 `npm run dev` 测试本地开发
- [ ] 运行 `npm run build` 测试构建
- [ ] 检查所有页面是否正常显示

### 内容检查

- [ ] 替换所有示例内容
- [ ] 更新首页文案
- [ ] 添加实际的分类和文章
- [ ] 测试所有链接是否有效

### SEO 检查

- [ ] 确认域名已正确设置
- [ ] 测试 `/sitemap.xml` 是否可访问
- [ ] 测试 `/robots.txt` 是否可访问
- [ ] 检查页面标题和描述

---

## 📱 Cloudflare Workers 部署

### 首次部署

- [ ] 安装 Wrangler CLI: `npm install -g wrangler`
- [ ] 登录 Cloudflare: `wrangler login`
- [ ] 运行构建: `npm run cf:build`
- [ ] 部署: `npm run cf:deploy`

### 部署后验证

- [ ] 访问部署的 URL 测试
- [ ] 检查所有页面是否正常
- [ ] 测试移动端显示
- [ ] 验证 SEO 标签

---

## 🔐 搜索引擎提交（可选）

- [ ] Google Search Console
  - 提交 sitemap: `https://your-domain.com/sitemap.xml`
  - 验证网站所有权
  
- [ ] Bing Webmaster Tools
  - 提交 sitemap
  - 验证网站

---

## 📊 性能优化（可选）

- [ ] 启用 Cloudflare Analytics
- [ ] 配置 CDN 缓存规则
- [ ] 设置图片优化
- [ ] 启用压缩

---

## ✅ 完成状态

完成以上检查后，你的网站就可以正常运行了！

**估计配置时间：** 30-60 分钟

**遇到问题？**
- 查看 README.md 获取详细说明
- 检查 Cloudflare Workers 部署日志
- 确保所有配置文件正确修改

---

祝你的新网站运行顺利！🎉
