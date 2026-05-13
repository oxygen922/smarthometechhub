#!/bin/bash

# 文章批量导入脚本
# 使用方法: ./batch-import.sh

echo "=== SmartHome TechHub 文章批量导入工具 ==="

# 定义文章目录
ARTICLES_DIR="../frontend/content/articles"
CATEGORIES=("smart-toilets" "robot-vacuums" "smart-lawn-mowers" "smart-kitchen" "air-quality" "home-security" "smart-lighting")

# 检查文章目录是否存在
if [ ! -d "$ARTICLES_DIR" ]; then
    echo "错误: 文章目录不存在: $ARTICLES_DIR"
    exit 1
fi

echo "文章目录: $ARTICLES_DIR"
echo "可用分类:"
for category in "${CATEGORIES[@]}"; do
    echo "  - $category"
done

echo ""
echo "使用说明:"
echo "1. 将文章 Markdown 文件放入对应分类目录"
echo "2. 文件名格式: YYYY-MM-DD-文章标题.md"
echo "3. 运行 ./validate-articles.sh 验证文章格式"
echo "4. 重新部署前端项目"

echo ""
echo "示例文件结构:"
echo "$ARTICLES_DIR/robot-vacuums/2026-05-13-best-robot-vacuum.md"
echo "$ARTICLES_DIR/smart-kitchen/2026-05-13-smart-fridge-review.md"

echo ""
echo "是否需要创建示例文章模板？(y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    ./create-template.sh
fi