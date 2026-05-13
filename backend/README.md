# Backend 文章管理系统

为 SmartHome TechHub 网站提供文章管理功能，部署在 Hostinger 上。

## 📁 目录结构

```
backend/
├── admin/              # 管理界面文件
├── api/                # API接口
├── articles/           # 文章存储和管理
├── scripts/            # 管理脚本
└── README.md           # 本文件
```

## 🚀 使用方法

### 1. 手动添加文章（推荐）

在 `frontend/content/articles/{分类}/` 目录下创建 Markdown 文件：

```markdown
---
title: "文章标题"
slug: "article-slug"
excerpt: "文章摘要"
category: "robot-vacuums"
author: "作者名"
date: "2026-05-13"
tags: ["标签1", "标签2"]
featuredImage: "图片URL"
rating: 4.5
---

# 文章内容

这里是文章的正文内容...
```

### 2. 批量管理文章

使用 `scripts/` 目录下的管理脚本：

- `batch-import.sh` - 批量导入文章
- `update-articles.sh` - 更新现有文章
- `validate-articles.sh` - 验证文章格式

### 3. 自动化部署

配置 Hostinger 的 Git 部署，当推送文章时自动更新网站。

## 📝 文章分类

- `smart-toilets/` - 智能马桶
- `robot-vacuums/` - 扫地机器人
- `smart-lawn-mowers/` - 智能割草机
- `smart-kitchen/` - 智能厨房
- `air-quality/` - 空气质量
- `home-security/` - 家庭安防
- `smart-lighting/` - 智能照明

## 🔧 配置说明

### Hostinger 部署

1. 将项目推送到 Git 仓库
2. 在 Hostinger 配置 Git 部署
3. 设置自动构建和部署

### 文件路径

- Frontend: `frontend/` - Next.js 网站
- Content: `frontend/content/articles/` - 文章内容
- Backend: `backend/` - 管理工具（本目录）

## 📧 联系方式

如有问题，联系网站管理员。