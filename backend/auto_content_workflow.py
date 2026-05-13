#!/usr/bin/env python3
"""
SmartHome TechHub - 自动化内容生产工作流

完整流程：
RSS源采集 → DeepSeek AI改写 → Pexels/Pixabay配图 → R2上传 → API发布
"""

import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
from smart_image_finder import SmartImageFinder

# 加载环境变量
load_dotenv()

class AutoContentWorkflow:
    """自动化内容生产工作流"""

    def __init__(self):
        self.api_base = os.getenv('DEEPSEEK_API_BASE', 'https://api.deepseek.com')
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        self.frontend_api_url = f"http://localhost:{os.getenv('API_PORT', '3003')}/api/articles"
        self.image_finder = SmartImageFinder()

        # RSS源配置（示例）
        self.rss_sources = [
            'https://www.theverge.com/rss/index.xml',
            'https://www.wired.com/feed/rss',
            # 添加更多RSS源...
        ]

    def collect_rss_articles(self, limit=5):
        """从RSS源采集最新文章"""
        import feedparser

        collected_articles = []

        for rss_url in self.rss_sources:
            try:
                feed = feedparser.parse(rss_url)
                for entry in feed.entries[:limit]:
                    collected_articles.append({
                        'title': entry.get('title', ''),
                        'link': entry.get('link', ''),
                        'summary': entry.get('summary', ''),
                        'published': entry.get('published', ''),
                        'source': rss_url
                    })
            except Exception as e:
                print(f"RSS采集失败 {rss_url}: {str(e)}")

        return collected_articles

    def rewrite_with_ai(self, original_article):
        """使用DeepSeek AI改写文章"""
        if not self.api_key:
            raise ValueError("DEEPSEEK_API_KEY not configured")

        prompt = f"""You are a professional smart home product reviewer. Rewrite the following article into an original, SEO-optimized English review.

Original Article:
Title: {original_article['title']}
Summary: {original_article['summary']}

Requirements:
1. Create a comprehensive 2000+ word product review
2. Use professional yet accessible language
3. Include technical specifications table
4. Add buying guide section
5. Target US audience
6. Include SEO keywords naturally
7. Format in Markdown

Generate the complete article now."""

        try:
            response = requests.post(
                f"{self.api_base}/v1/chat/completions",
                headers={
                    'Authorization': f'Bearer {self.api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'deepseek-chat',
                    'messages': [
                        {'role': 'system', 'content': 'You are an expert smart home technology reviewer.'},
                        {'role': 'user', 'content': prompt}
                    ],
                    'temperature': 0.7,
                    'max_tokens': 4000
                }
            )

            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                return {
                    'content': content,
                    'original_title': original_article['title']
                }
            else:
                print(f"AI改写失败: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            print(f"AI调用错误: {str(e)}")
            return None

    def generate_article_metadata(self, rewritten_content, original_title):
        """从改写内容中提取元数据"""
        # 这里需要解析AI生成的内容，提取标题、摘要等
        # 简化版：使用默认值
        return {
            'title': f"Comprehensive Smart Home Product Review 2026",
            'slug': f"smart-home-review-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'excerpt': "In-depth analysis of the latest smart home technology, covering features, performance, and value proposition.",
            'category': 'robot-vacuums',  # 默认分类，可以改进为AI识别
            'author': 'SmartHome TechHub Editorial Team',
            'date': datetime.now().strftime('%Y-%m-%d'),
            'tags': ['review', 'smart-home', '2026', 'buying-guide'],
            'rating': 4.5,
            'price': '$999'
        }

    def find_and_upload_image(self, article_title):
        """智能查找并上传图片到R2"""
        try:
            # 提取关键词（简化版）
            keywords = "smart robot vacuum cleaner"

            # 查找并上传图片
            image_url = self.image_finder.find_and_upload(keywords, 'robot-vacuums')

            return image_url
        except Exception as e:
            print(f"图片上传失败: {str(e)}")
            return ''

    def publish_to_frontend(self, article_data):
        """发布文章到前端"""
        try:
            response = requests.post(
                self.frontend_api_url,
                headers={'Content-Type': 'application/json'},
                json=article_data,
                timeout=30
            )

            if response.status_code == 200:
                print(f"✓ 文章发布成功: {article_data['title']}")
                return True
            else:
                print(f"✗ 文章发布失败: {response.status_code} - {response.text}")
                return False

        except Exception as e:
            print(f"发布请求失败: {str(e)}")
            return False

    def run_complete_workflow(self, max_articles=3):
        """运行完整的自动化工作流"""
        print("🚀 SmartHome TechHub 自动化内容生产工作流")
        print("=" * 60)

        # 步骤1: RSS采集
        print("\n📡 步骤1: 从RSS源采集文章...")
        rss_articles = self.collect_rss_articles(limit=max_articles)
        print(f"✓ 采集到 {len(rss_articles)} 篇原始文章")

        if not rss_articles:
            print("✗ 未采集到任何文章，工作流终止")
            return

        # 处理每篇文章
        successful_count = 0

        for i, original_article in enumerate(rss_articles[:max_articles], 1):
            print(f"\n📝 处理第 {i}/{max_articles} 篇文章...")
            print(f"原标题: {original_article['title']}")

            # 步骤2: AI改写
            print("🤖 步骤2: AI改写内容...")
            rewritten = self.rewrite_with_ai(original_article)

            if not rewritten:
                print("✗ AI改写失败，跳过此篇文章")
                continue

            print("✓ AI改写完成")

            # 步骤3: 生成元数据
            metadata = self.generate_article_metadata(
                rewritten['content'],
                original_article['title']
            )

            # 步骤4: 智能配图
            print("🖼️  步骤3: 智能配图和R2上传...")
            image_url = self.find_and_upload_image(metadata['title'])

            if image_url:
                print(f"✓ 图片上传成功: {image_url}")
            else:
                print("⚠️  图片上传失败，使用默认图片")

            # 步骤5: 发布文章
            print("📤 步骤4: 发布到前端...")

            article_data = {
                **metadata,
                'content': rewritten['content'],
                'featuredImage': image_url
            }

            if self.publish_to_frontend(article_data):
                successful_count += 1
            else:
                print("✗ 发布失败")

        # 总结
        print("\n" + "=" * 60)
        print(f"✨ 工作流完成！成功发布 {successful_count}/{max_articles} 篇文章")

        if successful_count > 0:
            print("📊 前端数据已自动更新，刷新网站查看新文章")

        return successful_count


def main():
    """主函数"""
    try:
        workflow = AutoContentWorkflow()
        workflow.run_complete_workflow(max_articles=3)

    except KeyboardInterrupt:
        print("\n\n⚠️  工作流被用户中断")
    except Exception as e:
        print(f"\n\n✗ 工作流执行失败: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
