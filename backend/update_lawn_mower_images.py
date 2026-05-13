#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为两篇smart-lawn-mowers文章搜索并上传新图片到R2
"""

import os
import sys

# 设置Windows控制台UTF-8编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', line_buffering=True)

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
from smart_image_finder import SmartImageFinder

load_dotenv()


def update_lawn_mower_images():
    """为两篇割草机文章更新配图"""
    print("=" * 70)
    print("🚀 开始为两篇割草机文章搜索并上传新配图")
    print("=" * 70)

    try:
        # 初始化SmartImageFinder
        print("\n1️⃣ 初始化图片查找器...")
        finder = SmartImageFinder()

        # 两篇文章的关键词配置
        articles = [
            {
                "file": "../content/articles/smart-lawn-mowers/2026-05-13-smart-lawn-mowers-20260513223811.md",
                "keywords": "robot lawn mower 2026 autonomous smart",
                "category": "smart-lawn-mowers",
                "title": "Ultimate Guide to Robot Lawn Mowers 2026"
            },
            {
                "file": "../content/articles/smart-lawn-mowers/2026-05-13-smart-lawn-mowers-20260513223855.md",
                "keywords": "smart lawn mower AI technology GPS",
                "category": "smart-lawn-mowers",
                "title": "2026 Smart Lawn Mower Revolution"
            }
        ]

        updated_count = 0

        for i, article in enumerate(articles, 1):
            print(f"\n{'=' * 70}")
            print(f"📝 文章 {i}/{len(articles)}: {article['title']}")
            print(f"{'=' * 70}")

            # 搜索并上传图片
            print(f"\n2️⃣ 搜索关键词: {article['keywords']}")
            r2_url = finder.find_and_upload(article['keywords'], article['category'])

            if not r2_url:
                print(f"❌ 图片搜索上传失败，跳过这篇文章")
                continue

            print(f"\n3️⃣ 更新文章文件...")

            # 读取文章内容
            article_path = os.path.join(os.path.dirname(__file__), article['file'])
            with open(article_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 替换featuredImage
            import re
            pattern = r'^featuredImage:.*$'
            new_line = f'featuredImage: "{r2_url}"'

            new_content = re.sub(pattern, new_line, content, flags=re.MULTILINE)

            # 写回文件
            with open(article_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"✅ 文章 {i} 更新完成！")
            print(f"   新配图: {r2_url}")
            updated_count += 1

        print(f"\n{'=' * 70}")
        print(f"🎉 全部完成！成功更新 {updated_count}/{len(articles)} 篇文章")
        print(f"{'=' * 70}")
        return updated_count > 0

    except Exception as e:
        print(f"\n❌ 处理失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = update_lawn_mower_images()
    sys.exit(0 if success else 1)
