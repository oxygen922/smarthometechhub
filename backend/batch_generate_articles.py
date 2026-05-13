#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SmartHome TechHub - 批量文章生成脚本
为每个分类生成指定数量的文章
"""

import os
import sys
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from smart_image_finder import SmartImageFinder

# 设置Windows控制台UTF-8编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', line_buffering=True)

# 加载环境变量
load_dotenv()


class BatchArticleGenerator:
    """批量文章生成器"""

    def __init__(self):
        """初始化配置"""
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        self.api_base = os.getenv('DEEPSEEK_API_BASE', 'https://api.deepseek.com')
        self.frontend_api_url = f"http://localhost:{os.getenv('API_PORT', '3003')}/api/articles"

        # 初始化DeepSeek客户端
        self.client = OpenAI(
            api_key=self.api_key,
            base_url=self.api_base
        )

        # 初始化图片查找器
        self.image_finder = SmartImageFinder()

        # 分类配置
        self.categories = [
            {
                'slug': 'smart-toilets',
                'name': 'Smart Toilets',
                'keywords': ['smart toilet', 'bidet seat', 'intelligent bathroom', ' japanese toilet']
            },
            {
                'slug': 'robot-vacuums',
                'name': 'Robot Vacuums',
                'keywords': ['robot vacuum cleaner', 'robot mop', 'automatic vacuum', 'smart cleaning robot']
            },
            {
                'slug': 'smart-lawn-mowers',
                'name': 'Smart Lawn Mowers',
                'keywords': ['robot lawn mower', 'automatic mower', 'smart grass cutter', 'lawn care robot']
            },
            {
                'slug': 'smart-kitchen',
                'name': 'Smart Kitchen',
                'keywords': ['smart kitchen appliances', 'intelligent oven', 'smart refrigerator', 'kitchen technology']
            },
            {
                'slug': 'air-quality',
                'name': 'Air Quality',
                'keywords': ['air purifier', 'smart air quality monitor', 'home air filtration', 'clean air system']
            },
            {
                'slug': 'home-security',
                'name': 'Home Security',
                'keywords': ['smart security camera', 'home alarm system', 'video doorbell', 'intelligent surveillance']
            },
            {
                'slug': 'smart-lighting',
                'name': 'Smart Lighting',
                'keywords': ['smart light bulb', 'intelligent lighting system', 'automated lights', 'smart home lighting']
            }
        ]

    def generate_article_with_ai(self, category, keywords, index):
        """使用AI生成文章"""
        try:
            # 构建AI提示词
            prompt = f"""You are a professional smart home technology reviewer. Write a comprehensive, original product review article.

Category: {category['name']}
Topic: {keywords[index % len(keywords)]}
Year: 2026

Requirements:
1. Create a 1500-2000 word in-depth review
2. Use professional yet accessible English
3. Include these sections:
   - Introduction (150 words)
   - Top 3 Product Recommendations with detailed reviews
   - Key Features to Consider (with comparison table)
   - Buying Guide (who should buy, budget considerations)
   - Installation & Smart Home Integration
   - Conclusion & Final Verdict
4. Include a technical specifications table using Markdown
5. Target US audience
6. Use current 2026 pricing estimates
7. Format in clean Markdown
8. Make it SEO-friendly with natural keyword usage

Generate the complete article now."""

            response = self.client.chat.completions.create(
                model='deepseek-chat',
                messages=[
                    {'role': 'system', 'content': 'You are an expert smart home technology reviewer with 10 years of experience.'},
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.8,
                max_tokens=3500
            )

            if response.choices:
                content = response.choices[0].message.content
                return content
            else:
                return None

        except Exception as e:
            print(f"✗ AI生成失败: {str(e)}")
            return None

    def extract_title_from_content(self, content):
        """从AI生成的内容中提取标题"""
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('# ') and not line.startswith('##'):
                title = line.replace('# ', '').strip()
                return title
        return "Comprehensive Smart Home Product Review 2026"

    def generate_article_metadata(self, category, content, index):
        """生成文章元数据"""
        title = self.extract_title_from_content(content)

        # 生成slug
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        slug = f"{category['slug']}-{timestamp}-{index}"

        # 生成摘要（取前150字符）
        excerpt_lines = [line.strip() for line in content.split('\n') if line.strip() and not line.startswith('#')]
        excerpt = excerpt_lines[0] if excerpt_lines else "In-depth analysis of the latest smart home technology."
        if len(excerpt) > 150:
            excerpt = excerpt[:147] + '...'

        return {
            'title': title,
            'slug': slug,
            'excerpt': excerpt,
            'category': category['slug'],
            'author': 'SmartHome TechHub Editorial Team',
            'date': datetime.now().strftime('%Y-%m-%d'),
            'tags': [category['slug'], 'review', '2026', 'buying-guide', 'smart-home'],
            'rating': 4.5,
            'price': '$999'
        }

    def find_and_upload_image(self, keywords, category_slug):
        """为文章查找图片（直接使用Unsplash URL）"""
        try:
            # 直接搜索Unsplash获取图片URL
            images = self.image_finder.search_unsplash_image(keywords)

            if images:
                # 选择最高分辨率的图片
                best_image = max(images, key=lambda img: img.get('width', 0) * img.get('height', 0))
                image_url = best_image['urls']['regular']
                photographer = best_image['user']['name']
                print(f"✓ 找到图片 (摄影师: {photographer}, 尺寸: {best_image['width']}x{best_image['height']})")
                return image_url
            else:
                # 备用：使用source.unsplash.com
                fallback_url = f"https://source.unsplash.com/1200x630/?{keywords.replace(' ', ',')}"
                print(f"⚠️  使用备用图片源")
                return fallback_url

        except Exception as e:
            print(f"⚠️  图片获取失败: {str(e)}")
            # 返回占位图片URL
            return f"https://source.unsplash.com/1200x630/?{keywords.replace(' ', ',')}"

    def publish_article(self, metadata, content, image_url):
        """发布文章到前端"""
        try:
            article_data = {
                **metadata,
                'content': content,
                'featuredImage': image_url
            }

            response = requests.post(
                self.frontend_api_url,
                headers={'Content-Type': 'application/json'},
                json=article_data,
                timeout=60
            )

            if response.status_code == 200:
                print(f"✓ 文章发布成功: {metadata['title']}")
                return True
            else:
                print(f"✗ 文章发布失败: {response.status_code} - {response.text}")
                return False

        except Exception as e:
            print(f"✗ 发布请求失败: {str(e)}")
            return False

    def generate_for_category(self, category, num_articles=2):
        """为指定分类生成多篇文章"""
        print(f"\n{'=' * 70}")
        print(f"📁 开始处理分类: {category['name']} ({category['slug']})")
        print(f"{'=' * 70}")

        successful = 0

        for i in range(num_articles):
            print(f"\n📝 生成第 {i+1}/{num_articles} 篇文章...")

            # 步骤1: AI生成内容
            keywords = category['keywords']
            print("🤖 正在使用AI生成内容...")
            content = self.generate_article_with_ai(category, keywords, i)

            if not content:
                print("✗ AI生成失败，跳过此篇文章")
                continue

            print("✓ AI内容生成完成")

            # 步骤2: 生成元数据
            metadata = self.generate_article_metadata(category, content, i)

            # 步骤3: 查找和上传图片
            search_keywords = keywords[i % len(keywords)]
            print(f"🖼️  正在搜索图片: {search_keywords}...")
            image_url = self.find_and_upload_image(search_keywords, category['slug'])

            if image_url:
                print(f"✓ 图片获取成功")
            else:
                print("⚠️  图片获取失败，使用占位图片")

            # 步骤4: 发布文章
            print("📤 正在发布文章...")
            if self.publish_article(metadata, content, image_url):
                successful += 1
            else:
                print("✗ 发布失败")

        print(f"\n✨ 分类 {category['name']} 完成！成功发布 {successful}/{num_articles} 篇文章")
        return successful

    def run_batch_generation(self, articles_per_category=2):
        """运行批量生成流程"""
        sys.stdout.flush()  # 确保输出立即显示

        print("=" * 70)
        print("🚀 SmartHome TechHub 批量文章生成系统")
        print("=" * 70)
        print(f"📊 计划生成: {len(self.categories)} 个分类 × {articles_per_category} 篇 = {len(self.categories) * articles_per_category} 篇文章")
        print("=" * 70)
        sys.stdout.flush()

        total_successful = 0

        for idx, category in enumerate(self.categories):
            print(f"\n进度: {idx + 1}/{len(self.categories)}")
            sys.stdout.flush()

            successful = self.generate_for_category(category, articles_per_category)
            total_successful += successful

        # 总结
        print("\n" + "=" * 70)
        print(f"🎉 批量生成完成！")
        print(f"📊 成功发布: {total_successful}/{len(self.categories) * articles_per_category} 篇文章")
        print("=" * 70)

        if total_successful > 0:
            print("\n✨ 前端数据已自动更新，刷新网站查看新文章！")
        sys.stdout.flush()


def main():
    """主函数"""
    try:
        generator = BatchArticleGenerator()

        # 检查现有文章数量
        print("⚠️  注意：robot-vacuums分类已有1篇文章，将再生成1篇")
        print("⚠️  其他分类将各生成2篇文章\n")

        # 运行批量生成
        generator.run_batch_generation(articles_per_category=2)

    except KeyboardInterrupt:
        print("\n\n⚠️  生成过程被用户中断")
    except Exception as e:
        print(f"\n\n✗ 批量生成失败: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
