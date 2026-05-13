# Hostinger 部署配置指南

## 🚀 部署 SmartHome TechHub 到 Hostinger

### 1. 准备工作

- Hostinger 账号
- Git 仓库（GitHub/GitLab/Bitbucket）
- 项目文件（当前目录）

### 2. 部署步骤

#### 方法一：通过 Hostinger 控制面板

1. **登录 Hostinger 控制面板**
2. **进入 hPanel**
3. **选择 "Hosting" → "Manage"**
4. **进入 "File Manager"**
5. **上传项目文件**：
   - 将 `frontend/` 目录内容上传到 `public_html/`
   - 或者使用 Git 部署（推荐）

#### 方法二：Git 部署（推荐）

1. **在 Hostinger 启用 Git 部署**
2. **配置 Git 仓库**：
   ```bash
   cd public_html
   git clone https://github.com/your-username/smarthometechhub.git
   ```

3. **设置自动部署**：
   - 在 Hostinger 配置 Git webhook
   - 推送代码时自动更新

### 3. 构建前端项目

```bash
cd frontend
npm install
npm run build
npm run start
```

### 4. 环境变量配置

在 Hostinger 设置环境变量：
```bash
NEXT_PUBLIC_SITE_URL=https://smarthometechhub.online
NODE_ENV=production
```

### 5. 文章管理

#### 添加新文章

1. **编辑文章**：
   ```bash
   cd frontend/content/articles/robot-vacuums/
   vim your-article.md
   ```

2. **验证格式**：
   ```bash
   cd backend/scripts
   ./validate-articles.sh
   ```

3. **重新部署**：
   ```bash
   git add .
   git commit -m "新增文章: xxx"
   git push
   ```

### 6. 域名配置

- 主域名: `smarthometechhub.online`
- 自动HTTPS证书
- DNS解析到Hostinger服务器

### 7. 监控和维护

- **访问统计**: Hostinger Analytics
- **错误日志**: `logs/` 目录
- **备份**: 定期备份数据库和文章

## 📧 技术支持

- Hostinger 支持: 24/7 在线客服
- 文档: https://support.hostinger.com
- 社区论坛: https://community.hostinger.com

## 🔧 故障排除

### 问题1: 网站无法访问

1. 检查域名DNS设置
2. 确认文件上传完成
3. 查看错误日志

### 问题2: 文章不显示

1. 验证frontmatter格式
2. 检查文件路径
3. 重新构建项目

### 问题3: 构建失败

1. 检查Node.js版本
2. 清理缓存: `rm -rf .next node_modules`
3. 重新安装依赖

## 📞 联系方式

- 网站: https://www.smarthometechhub.online
- 邮箱: admin@smarthometechhub.online