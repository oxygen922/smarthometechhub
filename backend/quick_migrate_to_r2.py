#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
快速批量迁移：直接搜索并替换所有Unsplash URL
"""

import os
import sys
import re
import subprocess

# 设置Windows控制台UTF-8编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', line_buffering=True)

# 添加backend目录到路径
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
from smart_image_finder import SmartImageFinder

load_dotenv()


def migrate_all_unsplash():
    """迁移所有Unsplash图片到R2"""
    content_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'articles')
    image_finder = SmartImageFinder()

    # 找出所有需要迁移的Markdown文件
    articles_migrated = 0
    articles_failed = 0

    for category in os.listdir(content_dir):
        category_dir = os.path.join(content_dir, category)
        if not os.path.isdir(category_dir):
            continue

        for filename in os.listdir(category_dir):
            if not filename.endswith('.md'):
                continue

            filepath = os.path.join(category_dir, filename)

            # 读取文件
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # 提取featuredImage
            match = re.search(r'featuredImage:\s*"([^"]+)"', content)
            if not match:
                continue

            image_url = match.group(1)

            # 如果已经是R2 URL，跳过
            if 'r2.dev' in image_url:
                continue

            # 如果不是Unsplash URL，跳过
            if 'unsplash.com' not in image_url.lower():
                continue

            print(f"\n处理: {filename}")
            print(f"  旧URL: {image_url[:80]}...")

            # 从文件名提取关键词
            keywords = category.replace('-', ' ')
            print(f"  搜索关键词: {keywords}")

            # 搜索新图片
            try:
                images = image_finder.search_all_sources(keywords, per_page=20)
                if not images or len(images) == 0:
                    print(f"  ✗ 搜索失败")
                    articles_failed += 1
                    continue

                # 选择第一张
                best_image = images[0]
                new_image_url = best_image['urls']['regular']

                # 上传到R2
                import hashlib
                from datetime import datetime
                content_hash = hashlib.md5(
                    f"{new_image_url}_{datetime.now().timestamp()}".encode()
                ).hexdigest()[:12]
                r2_filename = f"{category}_{content_hash}.jpg"
                r2_key = f"articles/{category}/{r2_filename}"

                # 下载图片
                import requests
                import tempfile
                response = requests.get(new_image_url, timeout=30, stream=True)
                if response.status_code != 200:
                    print(f"  ✗ 下载失败")
                    articles_failed += 1
                    continue

                # 保存到临时文件
                with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                    for chunk in response.iter_content(chunk_size=8192):
                        temp_file.write(chunk)
                    temp_path = temp_file.name

                # 上传到R2
                print(f"  上传到R2...")
                r2_url = image_finder.upload_to_r2(temp_path, r2_key)

                # 清理临时文件
                try:
                    os.remove(temp_path)
                except:
                    pass

                if not r2_url:
                    print(f"  ✗ R2上传失败")
                    articles_failed += 1
                    continue

                # 更新文件
                new_content = re.sub(
                    r'featuredImage:\s*"[^"]*"',
                    f'featuredImage: "{r2_url}"',
                    content
                )

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)

                print(f"  ✓ 迁移成功")
                articles_migrated += 1

            except Exception as e:
                print(f"  ✗ 处理失败: {str(e)}")
                articles_failed += 1

    print("\n" + "=" * 70)
    print(f"🎉 迁移完成！")
    print(f"✅ 成功: {articles_migrated}篇")
    print(f"❌ 失败: {articles_failed}篇")
    print("=" * 70)


if __name__ == "__main__":
    try:
        migrate_all_unsplash()
    except Exception as e:
        print(f"\n✗ 迁移失败: {str(e)}")
        import traceback
        traceback.print_exc()
