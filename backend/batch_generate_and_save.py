#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SmartHome TechHub - 批量文章生成并保存为文件
不发布到API，直接保存为Markdown文件

更新日志：
- 2026-05-13: 修复每批次生成完文章后更新JSON文件
- 2026-05-13: 添加实时进度显示
"""

import os
import sys
import json
import requests
import feedparser
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI

# 设置Windows控制台UTF-8编码（重要：防止中文乱码）
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', line_buffering=True)

# 加载环境变量
load_dotenv()

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(__file__))

from smart_image_finder import SmartImageFinder


class BatchArticleSaver:
    """批量文章生成器 - 保存为文件"""

    def __init__(self):
        """初始化配置"""
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        self.api_base = os.getenv('DEEPSEEK_API_BASE', 'https://api.deepseek.com')

        # 初始化DeepSeek客户端
        self.client = OpenAI(api_key=self.api_key, base_url=self.api_base)

        # 初始化XAI客户端（如果配置了）
        self.xai_api_key = os.getenv('XAI_API_KEY')
        if self.xai_api_key:
            self.xai_client = OpenAI(
                api_key=self.xai_api_key,
                base_url='https://api.x.ai/v1'
            )
        else:
            self.xai_client = None

        # 初始化图片查找器
        self.image_finder = SmartImageFinder()

        # 分类配置
        self.categories = [
            {
                'slug': 'smart-toilets',
                'name': 'Smart Toilets',
                'keywords': ['smart toilet', 'bidet seat', 'intelligent bathroom', 'japanese toilet', 'smart bathroom fixtures', 'electronic toilet', 'automated toilet']
            },
            {
                'slug': 'robot-vacuums',
                'name': 'Robot Vacuums',
                'keywords': ['robot vacuum cleaner', 'robot mop']
            },
            {
                'slug': 'smart-lawn-mowers',
                'name': 'Smart Lawn Mowers',
                'keywords': ['robot lawn mower', 'automatic mower', 'smart grass cutter', 'lawn care robot', 'intelligent mower', 'robotic lawn care', 'auto grass mower']
            },
            {
                'slug': 'smart-kitchen',
                'name': 'Smart Kitchen',
                'keywords': ['smart kitchen appliances', 'intelligent oven']
            },
            {
                'slug': 'air-quality',
                'name': 'Air Quality',
                'keywords': ['air purifier', 'smart air quality monitor', 'home air filtration', 'clean air system', 'air quality sensor', 'HEPA purifier', 'smart air cleaner']
            },
            {
                'slug': 'home-security',
                'name': 'Home Security',
                'keywords': ['smart security camera', 'home alarm system', 'video doorbell', 'intelligent surveillance', 'smart home security', 'wireless security camera', 'home monitoring system']
            },
            {
                'slug': 'smart-lighting',
                'name': 'Smart Lighting',
                'keywords': ['smart light bulb', 'intelligent lighting system', 'automated lights', 'smart home lighting', 'LED smart bulbs', 'color changing lights', 'wireless lighting control']
            },
            {
                'slug': 'smart-kitchen',
                'name': 'Smart Kitchen',
                'keywords': ['smart kitchen appliances', 'intelligent oven', 'smart refrigerator', 'kitchen technology', 'smart cooking devices', 'automated kitchen', 'smart kitchen gadgets']
            },
            {
                'slug': 'robot-vacuums',
                'name': 'Robot Vacuums',
                'keywords': ['robot vacuum cleaner', 'robot mop', 'automatic vacuum', 'smart cleaning robot', 'robotic floor cleaner', 'smart vacuum', 'auto cleaning robot']
            }
        ]

        # 内容目录
        self.content_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'articles')

        # 跟踪已使用的图片URL，避免重复
        self.used_images = set()

        # RSS源配置（备选文章来源）
        self.rss_sources = [
            'https://www.theverge.com/rss/index.xml',
            'https://www.wired.com/feed/rss',
            'https://techcrunch.com/feed/',
            'https://www.cnet.com/rss/news/',
            'https://www.engadget.com/rss.xml'
        ]

    def generate_article_with_ai(self, category, keywords):
        """使用AI生成文章，并返回文章内容和图片搜索关键词"""
        try:
            prompt = f"""You are a professional smart home technology reviewer. Write a comprehensive, original product review article.

Category: {category['name']}
Topic: {keywords}
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

After the article, on a separate line, provide an optimal image search keyword for this article.
Format: IMAGE_KEYWORD: [your suggested search phrase]

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

                # 提取图片关键词
                image_keyword = None
                if 'IMAGE_KEYWORD:' in content:
                    parts = content.split('IMAGE_KEYWORD:')
                    content = parts[0].strip()
                    image_keyword = parts[1].strip() if len(parts) > 1 else None

                # 如果AI没有生成关键词，使用默认关键词
                if not image_keyword:
                    image_keyword = keywords

                return {'content': content, 'image_keyword': image_keyword}
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

    def generate_article_with_xai_search(self, category, keywords):
        """使用XAI Web Search搜索素材 + AI生成文章"""
        if not self.xai_client:
            print(f"    ✗ XAI未配置")
            return None

        try:
            print(f"  🔍 使用XAI搜索实时素材...")

            # 使用XAI的web search功能
            search_query = f"{category['name']} {keywords} 2026 reviews comparison best products"
            print(f"    搜索查询: {search_query}")

            prompt = f"""Search the web for the latest information about {search_query} and write a comprehensive, original product review article.

Category: {category['name']}
Topic: {keywords}
Year: 2026

Requirements:
1. Use web search to find the latest product information, reviews, and comparisons
2. Create a 1500-2000 word in-depth review based on search results
3. Use professional yet accessible English
4. Include these sections:
   - Introduction (150 words)
   - Top 3 Product Recommendations with detailed reviews
   - Key Features to Consider (with comparison table)
   - Buying Guide (who should buy, budget considerations)
   - Installation & Smart Home Integration
   - Conclusion & Final Verdict
5. Include a technical specifications table using Markdown
6. Target US audience
7. Use current 2026 pricing estimates
8. Format in clean Markdown
9. Make it SEO-friendly with natural keyword usage
10. Cite recent sources from your web search

After the article, on a separate line, provide an optimal image search keyword for this article.

Generate the complete article now."""

            response = self.xai_client.chat.completions.create(
                model="grok-beta",
                messages=[
                    {'role': 'system', 'content': 'You are an expert smart home technology reviewer with web search capabilities. Create original, well-researched content.'},
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.7,
                max_tokens=4000
            )

            if response.choices:
                content = response.choices[0].message.content

                # 分离内容和图片关键词
                image_keyword = keywords
                if 'IMAGE_KEYWORD:' in content:
                    parts = content.split('IMAGE_KEYWORD:')
                    content = parts[0].strip()
                    image_keyword = parts[1].strip() if len(parts) > 1 else keywords

                print(f"    ✓ XAI搜索+生成完成")
                return {'content': content, 'image_keyword': image_keyword}
            else:
                return None

        except Exception as e:
            print(f"    ✗ XAI搜索失败: {str(e)}")
            return None

    def generate_article_from_rss(self, category, keywords):
        """RSS采集 + AI改写（备选方案）"""
        try:
            print(f"  📰 尝试RSS采集模式...")

            # 从RSS源采集文章
            collected_articles = []
            for rss_url in self.rss_sources[:3]:  # 只用前3个源，避免太慢
                try:
                    feed = feedparser.parse(rss_url)
                    for entry in feed.entries[:2]:  # 每个源取2篇
                        title = entry.get('title', '')
                        summary = entry.get('summary', '')
                        if title and summary:
                            collected_articles.append({
                                'title': title,
                                'summary': summary,
                                'link': entry.get('link', '')
                            })
                except Exception as e:
                    print(f"    ✗ RSS源失败: {rss_url[:50]}...")

            if not collected_articles:
                print(f"    ✗ RSS采集无结果")
                return None

            # 选择最相关的一篇（简单匹配关键词）
            import re
            best_article = None
            best_score = 0

            for article in collected_articles:
                score = 0
                # 检查标题和摘要是否包含关键词
                for keyword in keywords.split()[:3]:  # 只检查前3个词
                    if keyword.lower() in article['title'].lower() or keyword.lower() in article['summary'].lower():
                        score += 1

                if score > best_score:
                    best_score = score
                    best_article = article

            if not best_article:
                best_article = collected_articles[0]  # fallback到第一篇

            print(f"    ✓ 采集到文章: {best_article['title'][:60]}...")

            # 用AI改写这篇文章
            prompt = f"""You are a professional smart home technology reviewer. Rewrite the following article into an original, SEO-optimized product review.

Category: {category['name']}
Topic: {keywords}

Original Article (for reference only - create ORIGINAL content):
Title: {best_article['title']}
Summary: {best_article['summary']}

Requirements:
1. Create a 1500-2000 word ORIGINAL in-depth review (do not copy the original)
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

After the article, on a separate line, provide an optimal image search keyword for this article.

Generate the complete article now."""

            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {'role': 'system', 'content': 'You are an expert smart home technology reviewer. Create ORIGINAL content based on reference material.'},
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.7,
                max_tokens=4000
            )

            if response.choices:
                content = response.choices[0].message.content

                # 分离内容和图片关键词
                image_keyword = keywords
                if 'IMAGE_KEYWORD:' in content:
                    parts = content.split('IMAGE_KEYWORD:')
                    content = parts[0].strip()
                    image_keyword = parts[1].strip() if len(parts) > 1 else keywords

                print(f"    ✓ AI改写完成")
                return {'content': content, 'image_keyword': image_keyword}
            else:
                return None

        except Exception as e:
            print(f"    ✗ RSS+AI改写失败: {str(e)}")
            return None

    def find_unique_image(self, keywords, category_slug):
        """查找并上传图片到R2，返回R2 URL"""
        try:
            print(f"  🔍 搜索图片: {keywords}")

            # 从所有配置的来源搜索图片
            images = self.image_finder.search_all_sources(keywords, per_page=20)

            if not images or len(images) == 0:
                print(f"  ⚠️  使用备用图片源")
                return f"https://source.unsplash.com/1200x630/?{keywords.replace(' ', ',')}"

            # 按分辨率排序（高分辨率优先）
            sorted_images = sorted(images, key=lambda img: img.get('width', 0) * img.get('height', 0), reverse=True)

            # 查找未使用的图片
            for img in sorted_images:
                source_url = img['urls']['regular']

                # 检查是否已使用（基于原始URL）
                if source_url not in self.used_images:
                    # 下载并上传到R2
                    print(f"  ⬇️  下载并上传到R2...")
                    r2_url = self.upload_to_r2_from_url(source_url, keywords, category_slug)

                    if r2_url:
                        # 标记原始URL为已使用
                        self.used_images.add(source_url)
                        photographer = img['user']['name']
                        source = img.get('source', 'unknown')
                        print(f"  ✓ 上传成功 (来源: {source}, 摄影师: {photographer}, 已使用: {len(self.used_images)}张)")
                        return r2_url
                    else:
                        print(f"  ⚠️  R2上传失败，尝试下一张")

            # 如果所有图片都上传失败，使用第一张的原始URL（fallback）
            best_image = sorted_images[0]
            image_url = best_image['urls']['regular']
            photographer = best_image['user']['name']
            print(f"  ⚠️  R2上传全部失败，使用原始URL (摄影师: {photographer})")
            return image_url

        except Exception as e:
            print(f"  ⚠️  图片获取失败: {str(e)}")
            return f"https://source.unsplash.com/1200x630/?{keywords.replace(' ', ',')}"

    def upload_to_r2_from_url(self, image_url, keywords, category_slug):
        """从URL下载图片并上传到R2"""
        try:
            import tempfile
            import requests

            # 下载图片
            response = requests.get(image_url, timeout=30, stream=True)
            if response.status_code != 200:
                print(f"    ✗ 下载失败: HTTP {response.status_code}")
                return None

            # 生成唯一文件名
            import hashlib
            from datetime import datetime
            content_hash = hashlib.md5(
                f"{keywords}_{category_slug}_{datetime.now().timestamp()}".encode()
            ).hexdigest()[:12]
            filename = f"{category_slug}_{content_hash}.jpg"
            r2_key = f"articles/{category_slug}/{filename}"

            # 保存到临时文件
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                for chunk in response.iter_content(chunk_size=8192):
                    temp_file.write(chunk)
                temp_path = temp_file.name

            # 上传到R2
            print(f"    ☁️  上传到R2: {r2_key}")
            r2_url = self.image_finder.upload_to_r2(temp_path, r2_key)

            # 清理临时文件
            try:
                import os
                os.remove(temp_path)
            except:
                pass

            return r2_url

        except Exception as e:
            print(f"    ✗ 上传流程失败: {str(e)}")
            return None

    def save_article_to_file(self, metadata, content):
        """保存文章为Markdown文件"""
        try:
            # 创建分类目录
            category_dir = os.path.join(self.content_dir, metadata['category'])
            os.makedirs(category_dir, exist_ok=True)

            # 生成文件名
            date_str = datetime.now().strftime('%Y-%m-%d')
            filename = f"{date_str}-{metadata['slug']}.md"
            filepath = os.path.join(category_dir, filename)

            # 构建Front Matter
            front_matter = "---\n"
            for key, value in metadata.items():
                if isinstance(value, list):
                    front_matter += f'{key}: {json.dumps(value)}\n'
                elif isinstance(value, (int, float)):
                    front_matter += f'{key}: {value}\n'
                else:
                    front_matter += f'{key}: "{value}"\n'
            front_matter += "---\n"

            # 写入文件
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(front_matter + '\n' + content)

            print(f"✓ 文章已保存: {filepath}")
            return True

        except Exception as e:
            print(f"✗ 保存文件失败: {str(e)}")
            return False

    def update_frontend_json(self):
        """更新前端JSON文件"""
        try:
            print("🔄 正在更新前端数据...")

            # 检测环境：GitHub Actions vs 本地开发
            if os.getenv('GITHUB_ACTIONS'):
                # GitHub Actions环境：直接使用Node.js脚本
                import subprocess
                backend_dir = os.path.dirname(os.path.abspath(__file__))
                script_path = os.path.join(backend_dir, 'manual-update-json.js')

                result = subprocess.run(
                    ['node', script_path],
                    capture_output=True,
                    text=True,
                    timeout=60,
                    cwd=os.path.dirname(backend_dir)
                )

                if result.returncode == 0:
                    print(result.stdout)
                    return True
                else:
                    print(f"⚠️  更新失败: {result.stderr}")
                    return False
            else:
                # 本地开发环境：调用API
                response = requests.post(
                    "http://localhost:3003/api/update-frontend",
                    timeout=30
                )

                if response.status_code == 200:
                    result = response.json()
                    print(f"✓ 前端数据已更新: {result.get('total', 0)} 篇文章")
                    return True
                else:
                    print(f"⚠️  更新失败: {response.status_code}")
                    return False

        except Exception as e:
            print(f"⚠️  更新前端数据出错: {str(e)}")
            return False

    def generate_for_category(self, category, num_articles=2):
        """为指定分类生成多篇文章"""
        print(f"\n{'=' * 70}")
        print(f"📁 处理分类: {category['name']} ({category['slug']})")
        print(f"{'=' * 70}")

        successful = 0

        for i in range(num_articles):
            print(f"\n📝 生成第 {i+1}/{num_articles} 篇文章...")

            # 多层次文章生成策略
            base_keywords = category['keywords'][i % len(category['keywords'])]

            # 方法1：RSS采集 + AI改写（优先，最快）
            print(f"📰 尝试RSS采集模式... (关键词: {base_keywords})")
            ai_result = self.generate_article_from_rss(category, base_keywords)

            # 方法2：XAI Web Search + AI生成（实时素材）
            if not ai_result and self.xai_client:
                print(f"  ⚠️  RSS采集失败，使用XAI搜索模式...")
                ai_result = self.generate_article_with_xai_search(category, base_keywords)

            # 方法3：AI直接生成（最终备选）
            if not ai_result:
                print(f"  ⚠️  XAI搜索失败，使用AI直接生成模式...")
                print(f"🤖 正在使用AI生成内容和图片关键词... (基础关键词: {base_keywords})")
                ai_result = self.generate_article_with_ai(category, base_keywords)

            if not ai_result:
                print("✗ 所有方法都失败，跳过这篇文章")
                continue

            content = ai_result['content']
            image_search_keyword = ai_result['image_keyword']

            print("✓ AI内容生成完成")
            print(f"✓ AI生成的图片关键词: {image_search_keyword}")

            # 提取标题
            title = self.extract_title_from_content(content)

            # 生成元数据
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            slug = f"{category['slug']}-{timestamp}"

            # 生成摘要
            excerpt_lines = [line.strip() for line in content.split('\n') if line.strip() and not line.startswith('#')]
            excerpt = excerpt_lines[0] if excerpt_lines else "In-depth analysis of the latest smart home technology."
            if len(excerpt) > 150:
                excerpt = excerpt[:147] + '...'

            metadata = {
                'title': title,
                'slug': slug,
                'excerpt': excerpt,
                'category': category['slug'],
                'author': 'SmartHome TechHub Editorial Team',
                'date': datetime.now().strftime('%Y-%m-%d'),
                'tags': [category['slug'], 'review', '2026', 'buying-guide'],
                'rating': 4.5,
                'price': '$999'
            }

            # 查找唯一图片（使用AI生成的关键词）
            print(f"🖼️  正在搜索唯一图片... (关键词: {image_search_keyword})")
            image_url = self.find_unique_image(image_search_keyword, category['slug'])
            metadata['featuredImage'] = image_url

            # 保存文件
            print("💾 正在保存文章...")
            if self.save_article_to_file(metadata, content):
                successful += 1

        print(f"\n✨ 分类 {category['name']} 完成！成功保存 {successful}/{num_articles} 篇文章")

        return successful

    def run_batch_generation(self, articles_per_category=2):
        """运行批量生成流程"""
        sys.stdout.flush()

        print("=" * 70)
        print("🚀 SmartHome TechHub 批量文章生成系统")
        print("=" * 70)
        print(f"📊 计划生成: {len(self.categories)} 个分类 × {articles_per_category} 篇")
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
        print(f"📊 成功保存: {total_successful}/{len(self.categories) * articles_per_category} 篇文章")
        print("=" * 70)

        # 所有文章生成完成后，统一更新前端JSON
        if total_successful > 0:
            print("\n🔄 正在更新前端JSON数据...")
            self.update_frontend_json()

        print(f"\n💡 提示：文章已保存到 {self.content_dir}")
        sys.stdout.flush()


def main():
    """主函数"""
    try:
        generator = BatchArticleSaver()
        generator.run_batch_generation(articles_per_category=2)

    except KeyboardInterrupt:
        print("\n\n⚠️  生成过程被用户中断")
    except Exception as e:
        print(f"\n\n✗ 批量生成失败: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
