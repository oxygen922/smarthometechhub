#!/bin/bash

# 创建文章模板
# 使用方法: ./create-template.sh [分类]

CATEGORY=${1:-"robot-vacuums"}
DATE=$(date +%Y-%m-%d)
ARTICLES_DIR="../frontend/content/articles"

echo "创建文章模板..."
echo "分类: $CATEGORY"
echo "日期: $DATE"

# 检查分类目录是否存在
if [ ! -d "$ARTICLES_DIR/$CATEGORY" ]; then
    echo "错误: 分类目录不存在: $CATEGORY"
    echo "可用分类:"
    ls -la "$ARTICLES_DIR"
    exit 1
fi

# 创建模板文件
TEMPLATE_FILE="$ARTICLES_DIR/$CATEGORY/$DATE-article-template.md"

cat > "$TEMPLATE_FILE" << 'EOF'
---
title: "文章标题 - 产品评测"
slug: "article-slug-here"
excerpt: "文章摘要 - 简短描述文章内容，吸引用户阅读"
category: "CATEGORY_PLACEHOLDER"
author: "SmartHome TechHub Editorial Team"
date: "DATE_PLACEHOLDER"
tags: ["review", "CATEGORY_PLACEHOLDER", "2026"]
featuredImage: "https://images.pexels.com/photos/XXXXX/your-image.jpg"
rating: 4.5
price: "$299"
---

# 文章标题

## 简介
这里写文章的简介部分，概述要评测的产品或技术。

## 主要特点

- **特点1**: 详细描述第一个特点
- **特点2**: 详细描述第二个特点
- **特点3**: 详细描述第三个特点

## 深度评测

### 性能测试
这里描述性能测试的结果和过程...

### 使用体验
分享实际使用体验...

### 优缺点分析

**优点:**
- 优点1
- 优点2
- 优点3

**缺点:**
- 缺点1
- 缺点2

## 规格参数

| 参数 | 数值 |
|------|------|
| 尺寸 | XX x XX x XX |
| 重量 | XX kg |
| 电池续航 | XX 小时 |
| 噪音水平 | XX dB |

## 结论

总结产品的整体表现和推荐程度...

## 购买建议

给出购买建议和性价比分析...

---

*免责声明: 本文章包含客观评测内容，部分链接可能包含推广链接。*
EOF

# 替换占位符
sed -i "s/CATEGORY_PLACEHOLDER/$CATEGORY/g" "$TEMPLATE_FILE"
sed -i "s/DATE_PLACEHOLDER/$DATE/g" "$TEMPLATE_FILE"

echo "模板文件创建成功: $TEMPLATE_FILE"
echo ""
echo "下一步:"
echo "1. 编辑模板文件，替换内容"
echo "2. 重命名文件: mv $DATE-article-template.md $DATE-your-article-title.md"
echo "3. 运行验证: ./validate-articles.sh"