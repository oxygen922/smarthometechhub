#!/bin/bash

# 文章格式验证脚本
# 使用方法: ./validate-articles.sh

echo "=== 文章格式验证 ==="

ARTICLES_DIR="../frontend/content/articles"
ERROR_COUNT=0
WARNING_COUNT=0

# 检查目录是否存在
if [ ! -d "$ARTICLES_DIR" ]; then
    echo "错误: 文章目录不存在: $ARTICLES_DIR"
    exit 1
fi

# 查找所有markdown文件
echo "扫描文章文件..."
ARTICLE_FILES=$(find "$ARTICLES_DIR" -name "*.md" -type f)

if [ -z "$ARTICLE_FILES" ]; then
    echo "警告: 没有找到任何文章文件"
    exit 0
fi

TOTAL_FILES=0
echo ""

# 验证每个文件
while IFS= read -r file; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    echo "检查: $(basename "$file")"

    # 检查必需的frontmatter字段
    required_fields=("title" "slug" "category" "author" "date")
    missing_fields=()

    for field in "${required_fields[@]}"; do
        if ! grep -q "^$field:" "$file"; then
            missing_fields+=("$field")
        fi
    done

    if [ ${#missing_fields[@]} -gt 0 ]; then
        echo "  ❌ 缺少字段: ${missing_fields[*]}"
        ERROR_COUNT=$((ERROR_COUNT + 1))
    fi

    # 检查分类是否存在
    category=$(grep "^category:" "$file" | cut -d':' -f2 | xargs)
    if [ ! -d "$ARTICLES_DIR/$category" ]; then
        echo "  ⚠️  警告: 分类目录不存在: $category"
        WARNING_COUNT=$((WARNING_COUNT + 1))
    fi

    # 检查slug格式
    slug=$(grep "^slug:" "$file" | cut -d':' -f2 | xargs)
    if [[ ! "$slug" =~ ^[a-z0-9-]+$ ]]; then
        echo "  ⚠️  警告: slug格式不规范（只允许小写字母、数字、连字符）"
        WARNING_COUNT=$((WARNING_COUNT + 1))
    fi

    # 检查图片URL
    image_url=$(grep "^featuredImage:" "$file" | cut -d':' -f2 | xargs)
    if [ -n "$image_url" ] && [[ ! "$image_url" =~ ^https?:// ]]; then
        echo "  ⚠️  警告: 图片URL可能无效"
        WARNING_COUNT=$((WARNING_COUNT + 1))
    fi

    echo ""
done <<< "$ARTICLE_FILES"

# 输出统计
echo "=== 验证结果 ==="
echo "总文件数: $TOTAL_FILES"
echo "错误数: $ERROR_COUNT"
echo "警告数: $WARNING_COUNT"

if [ $ERROR_COUNT -eq 0 ]; then
    echo "✅ 所有文章格式正确！"
    exit 0
else
    echo "❌ 发现 $ERROR_COUNT 个错误，请修复后重试"
    exit 1
fi