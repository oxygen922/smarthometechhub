#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
更新现有文章的封面图
解决图片重复问题
"""

import os
import sys
import json
import re
from datetime import datetime

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


class ArticleImageUpdater:
    """文章图片更新器"""

    def __init__(self):
        self.image_finder = SmartImageFinder()
        self.content_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'articles')

        # 每个分类的扩展关键词
        self.category_keywords = {
            'smart-toilets': ['japanese toilet', 'smart bathroom fixtures', 'electronic toilet', 'bidet toilet'],
            'robot-vacuums': ['robotic floor cleaner', 'smart vacuum', 'auto cleaning robot', 'robot sweeper'],
            'smart-lawn-mowers': ['smart grass cutter', 'lawn care robot', 'intelligent mower', 'robotic lawn care'],
            'smart-kitchen': ['kitchen technology', 'smart cooking devices', 'automated kitchen', 'smart kitchen gadgets'],
            'air-quality': ['home air filtration', 'clean air system', 'air quality sensor', 'HEPA purifier', 'smart air cleaner'],
            'home-security': ['video doorbell', 'intelligent surveillance', 'smart home security', 'wireless security camera'],
            'smart-lighting': ['automated lights', 'smart home lighting', 'LED smart bulbs', 'color changing lights']
        }

    def read_markdown_file(self, filepath):
        """读取Markdown文件"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"✗ 读取文件失败 {filepath}: {str(e)}")
            return None

    def write_markdown_file(self, filepath, content):
        """写入Markdown文件"""
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"✗ 写入文件失败 {filepath}: {str(e)}")
            return False

    def extract_front_matter(self, content):
        """提取Front Matter"""
        match = re.match(r'^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)', content)
        if match:
            return match.group(1), match.group(2)
        return None, content

    def update_featured_image(self, front_matter, category, article_index):
        """更新featuredImage字段"""
        try:
            # 获取当前图片URL
            current_image = None
            for line in front_matter.split('\n'):
                if line.startswith('featuredImage:'):
                    current_image = line.split(':', 1)[1].strip().strip('"')
                    break

            # 获取该分类的扩展关键词
            keywords_list = self.category_keywords.get(category, [])
            if not keywords_list:
                print(f"  ⚠️  没有找到分类的关键词")
                return front_matter, False

            # 使用文章索引来选择不同的关键词，确保每篇不同
            keyword_index = article_index % len(keywords_list)
            keyword = keywords_list[keyword_index]

            print(f"  搜索新图片: {keyword}")

            # 搜索新图片（请求更多图片以增加选择）
            images = self.image_finder.search_unsplash_image(keyword, per_page=20)
            if not images or len(images) == 0:
                print(f"  ⚠️  未找到图片")
                return front_matter, False

            # 选择不同的图片（避免重复）
            best_image = None
            for img in images:
                img_url = img['urls']['regular']
                # 确保不和当前图片相同
                if current_image and img_url != current_image:
                    best_image = img
                    break
                elif not best_image:
                    best_image = img

            if not best_image:
                print(f"  ⚠️  没有找到不同的图片")
                return front_matter, False

            new_image_url = best_image['urls']['regular']
            photographer = best_image['user']['name']
            print(f"  ✓ 新图片 (摄影师: {photographer})")

            # 更新Front Matter中的featuredImage
            new_front_matter = re.sub(
                r'featuredImage:.*',
                f'featuredImage: "{new_image_url}"',
                front_matter
            )

            return new_front_matter, True

        except Exception as e:
            print(f"  ✗ 更新图片失败: {str(e)}")
            return front_matter, False

    def update_category_articles(self, category):
        """更新指定分类的所有文章"""
        print(f"\n{'=' * 70}")
        print(f"📁 更新分类: {category}")
        print(f"{'=' * 70}")

        category_dir = os.path.join(self.content_dir, category)
        if not os.path.exists(category_dir):
            print(f"⚠️  分类目录不存在: {category_dir}")
            return 0

        # 获取所有Markdown文件
        md_files = [f for f in os.listdir(category_dir) if f.endswith('.md') and f.startswith('2026-05-13')]

        if not md_files:
            print(f"⚠️  没有找到文章")
            return 0

        updated_count = 0

        for index, filename in enumerate(md_files):
            filepath = os.path.join(category_dir, filename)
            print(f"\n处理: {filename}")

            # 读取文件
            content = self.read_markdown_file(filepath)
            if not content:
                continue

            # 提取Front Matter
            front_matter, article_content = self.extract_front_matter(content)
            if not front_matter:
                print(f"  ⚠️  Front Matter格式错误")
                continue

            # 更新图片（传入文章索引）
            new_front_matter, success = self.update_featured_image(front_matter, category, index)

            if success:
                # 重新组装文件内容
                new_content = f"---\n{new_front_matter}\n---\n{article_content}"

                # 写回文件
                if self.write_markdown_file(filepath, new_content):
                    updated_count += 1
                    print(f"  ✓ 文章已更新")
                else:
                    print(f"  ✗ 文章写入失败")

        print(f"\n✨ 分类 {category} 完成！更新了 {updated_count}/{len(md_files)} 篇文章")
        return updated_count

    def run_update(self):
        """运行更新流程"""
        print("=" * 70)
        print("🖼️  文章封面图更新工具")
        print("=" * 70)

        # 获取所有分类
        categories = []
        for item in os.listdir(self.content_dir):
            item_path = os.path.join(self.content_dir, item)
            if os.path.isdir(item_path):
                categories.append(item)

        print(f"找到 {len(categories)} 个分类")

        total_updated = 0
        for category in categories:
            updated = self.update_category_articles(category)
            total_updated += updated

        print("\n" + "=" * 70)
        print(f"🎉 更新完成！总共更新了 {total_updated} 篇文章的封面图")
        print("=" * 70)
        print("\n💡 提示：需要运行 node manual-update-json.js 更新前端JSON数据")


def main():
    """主函数"""
    try:
        updater = ArticleImageUpdater()
        updater.run_update()

    except KeyboardInterrupt:
        print("\n\n⚠️  更新过程被用户中断")
    except Exception as e:
        print(f"\n\n✗ 更新失败: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
