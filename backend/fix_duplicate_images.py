#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量修复重复封面图
"""

import os
import sys
import re
import json
from datetime import datetime

# 设置Windows控制台UTF-8编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', line_buffering=True)

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
from smart_image_finder import SmartImageFinder

load_dotenv()


class DuplicateImageFixer:
    """重复图片修复器"""

    def __init__(self):
        self.image_finder = SmartImageFinder()
        self.content_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'articles')

        # 每个分类的独特关键词库
        self.category_keywords = {
            'smart-toilets': [
                'japanese smart toilet',
                'electronic bidet toilet',
                'intelligent bathroom fixture',
                'automated toilet seat',
                'smart washlet',
                'high-tech bathroom',
                'smart commode'
            ],
            'robot-vacuums': [
                'robot vacuum cleaner',
                'robotic floor cleaner',
                'smart cleaning robot',
                'automatic vacuum',
                'robot mop',
                'smart sweeper',
                'AI cleaning robot'
            ],
            'smart-lawn-mowers': [
                'robot grass cutter',
                'auto lawn mower',
                'smart mower technology',
                'robotic grass cutting',
                'lawn automation',
                'electric lawn mower',
                'robot grass maintenance'
            ],
            'smart-kitchen': [
                'smart kitchen appliances',
                'intelligent oven',
                'smart refrigerator',
                'kitchen technology',
                'smart cooking devices',
                'automated kitchen',
                'modern kitchen gadgets'
            ],
            'air-quality': [
                'air purifier',
                'smart air quality monitor',
                'HEPA air cleaner',
                'home air filtration',
                'clean air system',
                'air quality sensor',
                'smart air purifier'
            ],
            'home-security': [
                'smart security camera',
                'home alarm system',
                'video doorbell',
                'intelligent surveillance',
                'smart home security',
                'wireless security camera',
                'home monitoring system'
            ],
            'smart-lighting': [
                'smart light bulb',
                'intelligent lighting system',
                'automated lights',
                'smart home lighting',
                'LED smart bulbs',
                'color changing lights',
                'wireless lighting control'
            ]
        }

    def find_duplicate_articles(self, category):
        """找出有重复图片的文章"""
        category_dir = os.path.join(self.content_dir, category)
        md_files = sorted([f for f in os.listdir(category_dir) if f.endswith('.md')])

        articles = []
        for filename in md_files:
            filepath = os.path.join(category_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            match = re.match(r'^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)', content)
            if match:
                front_matter = match.group(1)
                # 提取featuredImage
                for line in front_matter.split('\n'):
                    if line.startswith('featuredImage:'):
                        image_url = line.split(':', 1)[1].strip().strip('"')
                        # 提取图片ID
                        if '/photo-' in image_url:
                            img_id = image_url.split('/photo-')[1].split('?')[0]
                        else:
                            img_id = image_url
                        articles.append({
                            'filename': filename,
                            'filepath': filepath,
                            'img_id': img_id,
                            'image_url': image_url
                        })
                        break

        # 找出重复的
        seen = {}
        duplicates = []
        for article in articles:
            if article['img_id'] in seen:
                duplicates.append(article)
            else:
                seen[article['img_id']] = article

        return duplicates

    def update_article_image(self, article, category, index):
        """更新单篇文章的封面图"""
        try:
            print(f"\n处理: {article['filename']}")
            print(f"  当前图片: {article['img_id'][:30]}...")

            # 获取该分类的关键词列表
            keywords_list = self.category_keywords.get(category, [])
            if not keywords_list:
                print(f"  ⚠️  没有找到分类的关键词")
                return False

            # 使用索引选择不同的关键词
            keyword = keywords_list[index % len(keywords_list)]
            print(f"  新关键词: {keyword}")

            # 搜索图片
            images = self.image_finder.search_unsplash_image(keyword, per_page=30)
            if not images or len(images) == 0:
                print(f"  ⚠️  未找到图片")
                return False

            # 选择不同的图片（使用索引+5来避免总是选第一张）
            img_index = (index + 5) % min(len(images), 15)
            best_image = images[img_index]

            new_image_url = best_image['urls']['regular']
            photographer = best_image['user']['name']

            # 提取新图片ID
            if '/photo-' in new_image_url:
                new_img_id = new_image_url.split('/photo-')[1].split('?')[0]
            else:
                new_img_id = new_image_url

            print(f"  ✓ 新图片: {new_img_id[:30]}... (摄影师: {photographer})")

            # 更新文件
            with open(article['filepath'], 'r', encoding='utf-8') as f:
                content = f.read()

            match = re.match(r'^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)', content)
            if match:
                front_matter = match.group(1)
                article_content = match.group(2)

                new_front_matter = re.sub(
                    r'featuredImage:.*',
                    f'featuredImage: "{new_image_url}"',
                    front_matter
                )

                new_content = f"---\n{new_front_matter}\n---\n{article_content}"

                with open(article['filepath'], 'w', encoding='utf-8') as f:
                    f.write(new_content)

                print(f"  ✓ 文件已更新")
                return True

        except Exception as e:
            print(f"  ✗ 更新失败: {str(e)}")
            return False

    def fix_category(self, category):
        """修复指定分类的重复图片"""
        print(f"\n{'=' * 70}")
        print(f"📁 修复分类: {category}")
        print(f"{'=' * 70}")

        duplicates = self.find_duplicate_articles(category)

        if not duplicates:
            print("✓ 该分类无重复图片")
            return 0

        print(f"发现 {len(duplicates)} 篇文章有重复图片")

        fixed_count = 0
        for index, article in enumerate(duplicates):
            if self.update_article_image(article, category, index):
                fixed_count += 1

        print(f"\n✨ 成功修复 {fixed_count}/{len(duplicates)} 篇文章")
        return fixed_count

    def fix_all_categories(self):
        """修复所有分类的重复图片"""
        print("=" * 70)
        print("🔧 批量修复重复封面图")
        print("=" * 70)

        # 获取所有分类
        categories = []
        for item in os.listdir(self.content_dir):
            item_path = os.path.join(self.content_dir, item)
            if os.path.isdir(item_path):
                categories.append(item)

        total_fixed = 0
        for category in categories:
            fixed = self.fix_category(category)
            total_fixed += fixed

        print("\n" + "=" * 70)
        print(f"🎉 修复完成！总共修复了 {total_fixed} 篇文章的重复封面图")
        print("=" * 70)
        print("\n💡 提示：运行 node manual-update-json.js 更新前端数据")


def main():
    """主函数"""
    try:
        fixer = DuplicateImageFixer()
        fixer.fix_all_categories()

    except KeyboardInterrupt:
        print("\n\n⚠️  修复过程被用户中断")
    except Exception as e:
        print(f"\n\n✗ 修复失败: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
