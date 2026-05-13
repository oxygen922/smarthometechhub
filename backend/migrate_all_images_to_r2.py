#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量将所有Unsplash直链图片迁移到R2
"""

import os
import sys
import re
import tempfile
import requests
from datetime import datetime
from pathlib import Path

# 设置Windows控制台UTF-8编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', line_buffering=True)

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
from smart_image_finder import SmartImageFinder

load_dotenv()


class ImageMigrator:
    """图片迁移器：将Unsplash直链迁移到R2"""

    def __init__(self):
        self.image_finder = SmartImageFinder()
        self.content_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'articles')

    def find_articles_with_unsplash_direct_links(self):
        """找出所有使用Unsplash直链的文章"""
        articles_to_migrate = []

        for category in os.listdir(self.content_dir):
            category_dir = os.path.join(self.content_dir, category)
            if not os.path.isdir(category_dir):
                continue

            for filename in os.listdir(category_dir):
                if not filename.endswith('.md'):
                    continue

            filepath = os.path.join(category_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # 提取featuredImage
            match = re.search(r'featuredImage:\s*"([^"]+)"', content)
            if match:
                image_url = match.group(1)

                # 检查是否使用R2
                if 'r2.dev' in image_url:
                    continue

                # 检查是否是Unsplash（任何形式）
                if 'unsplash.com' in image_url.lower():
                    articles_to_migrate.append({
                        'filepath': filepath,
                        'category': category,
                        'filename': filename,
                        'old_url': image_url
                    })

        return articles_to_migrate

    def download_and_upload_to_r2(self, image_url, category, filename_hint=None):
        """下载图片并上传到R2"""
        try:
            # 如果是source.unsplash.com，使用搜索新图片的方式
            if 'source.unsplash.com' in image_url:
                print(f"    🔍 source.unsplash.com不可用，搜索新图片...")

                # 从文件名或URL提取关键词
                if filename_hint:
                    keywords = filename_hint.replace('-', ' ')
                else:
                    keywords = category.replace('-', ' ')

                # 搜索图片
                images = self.image_finder.search_all_sources(keywords, per_page=20)
                if not images or len(images) == 0:
                    print(f"    ✗ 搜索失败")
                    return None

                # 选择第一张
                best_image = images[0]
                source_url = best_image['urls']['regular']
                print(f"    ✓ 找到新图片")
            else:
                source_url = image_url
                print(f"    ⬇️  下载图片...")

            # 下载图片
            response = requests.get(source_url, timeout=30, stream=True)
            if response.status_code != 200:
                print(f"    ✗ 下载失败: HTTP {response.status_code}")
                return None

            # 生成唯一文件名
            import hashlib
            content_hash = hashlib.md5(
                f"{source_url}_{datetime.now().timestamp()}".encode()
            ).hexdigest()[:12]
            filename = f"{category}_{content_hash}.jpg"

            # 保存到临时文件
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                for chunk in response.iter_content(chunk_size=8192):
                    temp_file.write(chunk)
                temp_path = temp_file.name

            # 上传到R2
            print(f"    ☁️  上传到R2...")
            r2_key = f"articles/{category}/{filename}"
            r2_url = self.image_finder.upload_to_r2(temp_path, r2_key)

            # 清理临时文件
            try:
                os.remove(temp_path)
            except:
                pass

            if r2_url:
                print(f"    ✓ 上传成功")
                return r2_url
            else:
                return None

        except Exception as e:
            print(f"    ✗ 处理失败: {str(e)}")
            return None

    def update_article_image(self, article):
        """更新单篇文章的封面图"""
        try:
            print(f"\n处理: {article['filename']}")
            print(f"  分类: {article['category']}")
            print(f"  旧URL: {article['old_url'][:80]}...")

            # 下载并上传到R2
            new_url = self.download_and_upload_to_r2(article['old_url'], article['category'])

            if not new_url:
                print(f"  ✗ 迁移失败")
                return False

            # 更新文件
            with open(article['filepath'], 'r', encoding='utf-8') as f:
                content = f.read()

            # 替换featuredImage
            content = re.sub(
                r'featuredImage:\s*"[^"]*"',
                f'featuredImage: "{new_url}"',
                content
            )

            with open(article['filepath'], 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"  ✓ 文件已更新")
            return True

        except Exception as e:
            print(f"  ✗ 更新失败: {str(e)}")
            return False

    def migrate_all(self):
        """迁移所有文章的图片到R2"""
        print("=" * 70)
        print("🚀 开始批量迁移图片到R2")
        print("=" * 70)

        articles = self.find_articles_with_unsplash_direct_links()

        if not articles:
            print("\n✅ 所有文章都已使用R2图片！")
            return

        print(f"\n找到 {len(articles)} 篇文章需要迁移")

        success_count = 0
        failed_count = 0

        for index, article in enumerate(articles, 1):
            print(f"\n[{index}/{len(articles)}]", end=" ")
            if self.update_article_image(article):
                success_count += 1
            else:
                failed_count += 1

        print("\n" + "=" * 70)
        print(f"🎉 迁移完成！")
        print(f"✅ 成功: {success_count}篇")
        print(f"❌ 失败: {failed_count}篇")
        print("=" * 70)
        print("\n💡 提示：运行 node backend/manual-update-json.js 更新前端数据")


def main():
    """主函数"""
    try:
        migrator = ImageMigrator()
        migrator.migrate_all()

    except KeyboardInterrupt:
        print("\n\n⚠️  迁移过程被用户中断")
    except Exception as e:
        print(f"\n\n✗ 迁移失败: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
