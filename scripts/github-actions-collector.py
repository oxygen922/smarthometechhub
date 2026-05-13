#!/usr/bin/env python3
"""
GitHub Actions 文章采集脚本
简化版，适合在CI/CD环境中运行
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

# 添加采集器路径
sys.path.append('backend/采集器')

def generate_sample_articles():
    """生成示例文章（用于测试）"""
    sample_articles = [
        {
            "title": "Latest Smart Home Trends for 2026",
            "slug": "latest-smart-home-trends-2026",
            "category": "smart-kitchen",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "excerpt": "Discover the newest innovations in smart home technology...",
            "featuredImage": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
            "content": "# Latest Smart Home Trends for 2026\n\nThe smart home industry continues to evolve..."
        }
    ]
    return sample_articles

def update_articles_json(articles):
    """更新 articles-data.json 文件"""
    json_path = Path("lib/articles-data.json")

    # 读取现有文章
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            existing_articles = json.load(f)
    except FileNotFoundError:
        existing_articles = []

    # 合并新文章
    all_articles = articles + existing_articles

    # 按日期排序
    all_articles.sort(key=lambda x: x.get('date', ''), reverse=True)

    # 去重
    seen = set()
    unique_articles = []
    for article in all_articles:
        if article['slug'] not in seen:
            seen.add(article['slug'])
            unique_articles.append(article)

    # 保存回文件
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(unique_articles, f, ensure_ascii=False, indent=2)

    print(f"更新完成！总文章数: {len(unique_articles)}")

def main():
    """主函数"""
    print("🤖 开始文章采集工作流...")
    print(f"⏰ 采集时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # 这里可以调用你的实际采集逻辑
    # 如果你的采集器在 backend/采集器/ 目录下
    try:
        # 尝试导入采集器模块
        import subprocess
        result = subprocess.run(
            ['python', 'backend/采集器/daily_workflow.py'],
            capture_output=True,
            text=True,
            timeout=300  # 5分钟超时
        )
        if result.returncode == 0:
            print("✅ 采集器运行成功")
            print(result.stdout)
        else:
            print("⚠️ 采集器运行失败，使用示例文章")
            generate_sample_articles()
    except Exception as e:
        print(f"⚠️ 采集器运行出错: {e}")
        print("🔄 使用示例文章进行测试")
        articles = generate_sample_articles()
        update_articles_json(articles)

    print("🎉 文章采集完成！")

if __name__ == "__main__":
    main()
