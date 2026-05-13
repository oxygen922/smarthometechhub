# API 使用文档

## 🚀 SmartHome TechHub API

### 基础URL
```
http://your-domain.com/api
```

### API 端点

#### 1. 健康检查
```
GET /api/health
```
**响应:**
```json
{
  "status": "ok",
  "message": "SmartHome TechHub API is running"
}
```

#### 2. 获取所有分类
```
GET /api/categories
```
**响应:**
```json
{
  "success": true,
  "categories": [
    {
      "id": "robot-vacuums",
      "name": "Robot Vacuums",
      "slug": "robot-vacuums",
      "count": 5
    }
  ]
}
```

#### 3. 获取分类文章列表
```
GET /api/articles/:category
```
**参数:**
- `category`: 分类slug (如: robot-vacuums)

**响应:**
```json
{
  "success": true,
  "articles": [
    {
      "title": "Best Robot Vacuum 2026",
      "slug": "best-robot-vacuum-2026",
      "category": "robot-vacuums",
      "author": "SmartHome TechHub Editorial Team",
      "date": "2026-05-13",
      "tags": ["review", "robot-vacuum"],
      "excerpt": "In-depth review..."
    }
  ]
}
```

#### 4. 获取单篇文章
```
GET /api/article/:category/:slug
```

#### 5. 创建新文章
```
POST /api/articles
Content-Type: application/json
```
**请求体:**
```json
{
  "title": "文章标题",
  "slug": "article-slug",
  "category": "robot-vacuums",
  "author": "作者名",
  "content": "# 文章内容\n\n这里是正文...",
  "excerpt": "文章摘要",
  "tags": ["review", "2026"],
  "featuredImage": "https://example.com/image.jpg",
  "rating": 4.5,
  "price": "$299"
}
```

**响应:**
```json
{
  "success": true,
  "message": "文章创建成功",
  "article": {
    "title": "文章标题",
    "filename": "2026-05-13-article-slug.md",
    "path": "/path/to/file.md"
  }
}
```

#### 6. 更新文章
```
PUT /api/articles/:category/:slug
Content-Type: application/json
```

#### 7. 删除文章
```
DELETE /api/articles/:category/:slug
```

#### 8. 触发重新构建
```
POST /api/rebuild
```

### 使用示例

#### JavaScript (Fetch API)
```javascript
// 获取文章列表
fetch('/api/articles/robot-vacuums')
  .then(response => response.json())
  .then(data => console.log(data));

// 创建新文章
fetch('/api/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Best Robot Vacuum 2026',
    slug: 'best-robot-vacuum-2026',
    category: 'robot-vacuums',
    author: 'SmartHome TechHub',
    content: '# Introduction\n...',
    tags: ['review']
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

#### cURL
```bash
# 获取文章列表
curl http://localhost:3001/api/articles/robot-vacuums

# 创建新文章
curl -X POST http://localhost:3001/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best Robot Vacuum 2026",
    "slug": "best-robot-vacuum-2026",
    "category": "robot-vacuums",
    "author": "SmartHome TechHub",
    "content": "# Introduction\n..."
  }'
```

### 错误响应
```json
{
  "success": false,
  "error": "错误信息"
}
```

### 部署到 Hostinger

1. **安装依赖**
```bash
cd backend
npm install
```

2. **启动服务**
```bash
npm start
# 或开发模式
npm run dev
```

3. **配置进程管理器**
使用 PM2 保持API持续运行：
```bash
npm install -g pm2
pm2 start api/server.js --name smarthome-api
pm2 startup
pm2 save
```

4. **反向代理配置**
在 Hostinger 配置 Nginx 反向代理：
```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
}
```

### 安全建议

1. **添加API密钥认证**
2. **启用HTTPS**
3. **限制CORS来源**
4. **添加请求频率限制**
5. **输入验证和清理**
