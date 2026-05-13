#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复重复封面图 - 确保每篇文章都有独特的图片
"""

import os
import sys
import re
import tempfile
import requests
import hashlib
from collections import defaultdict

# 设置Windows控制台UTF-8编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', line_buffering=True)

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
from smart_image_finder import SmartImageFinder

load_dotenv()


def get_image_hash(image_url):
    """下载图片并计算MD5 hash"""
    try:
        response = requests.get(image_url, timeout=30, stream=True)
        if response.status_code != 200:
            return None
        return hashlib.md5(response.content).hexdigest()
    except:
        return None


def find_duplicate_images():
    """找出所有使用相同图片的文章"""
    content_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'articles')

    # hash -> [articles]
    hash_to_articles = defaultdict(list)

    for category in os.listdir(content_dir):
        category_dir = os.path.join(content_dir, category)
        if not os.path.isdir(category_dir):
            continue

        for filename in os.listdir(category_dir):
            if not filename.endswith('.md'):
                continue

            filepath = os.path.join(category_dir, filename)

            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            match = re.search(r'featuredImage:\s*"([^"]+)"', content)
            if match:
                image_url = match.group(1)

                # 只检查R2图片
                if 'r2.dev' not in image_url:
                    continue

                # 获取图片hash
                img_hash = get_image_hash(image_url)
                if img_hash:
                    hash_to_articles[img_hash].append({
                        'filepath': filepath,
                        'filename': filename,
                        'category': category,
                        'image_url': image_url
                    })

    # 找出有重复的hash
    duplicates = {h: articles for h, articles in hash_to_articles.items() if len(articles) > 1}
    return duplicates


def search_new_image(category):
    """为文章搜索新的独特图片"""
    image_finder = SmartImageFinder()

    # 使用分类的不同关键词
    keywords_list = [
        f'{category.replace("-", " ")} review',
        f'smart {category.replace("-", " ")}',
        f'{category.replace("-", " ")} 2026',
        f'modern {category.replace("-", " ")}'
    ]

    for keywords in keywords_list:
        images = image_finder.search_all_sources(keywords, per_page=20)
        if images and len(images) > 0:
            # 选择一张不同于之前的图片
            import random
            best_image = random.choice(images[:10])
            return best_image['urls']['regular']

    return None


def fix_duplicate_articles(duplicates):
    """修复重复图片的文章"""
    print("=" * 70)
    print("🔧 修复重复封面图")
    print("=" * 70)

    total_to_fix = sum(len(articles) for articles in duplicates.values())
    print(f"\n找到 {len(duplicates)} 组重复图片，涉及 {total_to_fix} 篇文章\n")

    fixed_count = 0

    for img_hash, articles in duplicates.items():
        if len(articles) <= 1:
            continue

        print(f"\n处理图片组 (涉及 {len(articles)} 篇文章):")

        # 第一篇文章保持原样
        articles_to_fix = articles[1:]

        for article in articles_to_fix:
            print(f"\n  文章: {article['filename']}")
            print(f"    当前图片: {article['image_url'][:60]}...")

            try:
                # 搜索新图片
                print(f"    🔍 搜索新图片...")
                new_image_url = search_new_image(article['category'])

                if not new_image_url:
                    print(f"    ⚠️  搜索失败，跳过")
                    continue

                # 上传到R2
                image_finder = SmartImageFinder()

                # 下载新图片
                response = requests.get(new_image_url, timeout=30, stream=True)
                if response.status_code != 200:
                    print(f"    ⚠️  下载失败")
                    continue

                # 生成唯一文件名
                content_hash = hashlib.md5(response.content).hexdigest()[:12]
                filename = f"{article['category']}_{content_hash}.jpg"
                r2_key = f"articles/{article['category']}/{filename}"

                # 保存到临时文件
                with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                    temp_file.write(response.content)
                    temp_path = temp_file.name

                # 上传到R2
                print(f"    ☁️  上传到R2...")
                r2_url = image_finder.upload_to_r2(temp_path, r2_key)

                # 清理临时文件
                try:
                    os.remove(temp_path)
                except:
                    pass

                if not r2_url:
                    print(f"    ⚠️  R2上传失败")
                    continue

                # 更新文章
                with open(article['filepath'], 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = re.sub(
                    r'featuredImage:\s*"[^"]*"',
                    f'featuredImage: "{r2_url}"',
                    content
                )

                with open(article['filepath'], 'w', encoding='utf-8') as f:
                    f.write(new_content)

                print(f"    ✓ 已更新为新图片")
                fixed_count += 1

            except Exception as e:
                print(f"    ✗ 处理失败: {str(e)}")

    print("\n" + "=" * 70)
    print(f"🎉 修复完成！")
    print(f"✅ 成功修复: {fixed_count} 篇文章")
    print("=" * 70)
    print("\n💡 运行 node backend/manual-update-json.js 更新前端数据")


def main():
    """主函数"""
    try:
        duplicates = find_duplicate_images()

        if not duplicates:
            print("✅ 没有发现重复图片！")
            return

        fix_duplicate_articles(duplicates)

    except KeyboardInterrupt:
        print("\n\n⚠️  修复过程被用户中断")
    except Exception as e:
        print(f"\n\n✗ 修复失败: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
