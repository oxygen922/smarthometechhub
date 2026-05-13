#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SmartHome TechHub - 智能图片查找和R2上传系统
从Unsplash搜索高质量图片并上传到Cloudflare R2
"""

import os
import boto3
import requests
import hashlib
import random
from datetime import datetime
from dotenv import load_dotenv
from botocore.exceptions import NoCredentialsError, ClientError

# 加载环境变量
load_dotenv()


class SmartImageFinder:
    """智能图片查找器和R2上传器 - 支持多图片源"""

    def __init__(self):
        """初始化配置"""
        self.unsplash_access_key = os.getenv('UNSPLASH_ACCESS_KEY')
        self.pexels_api_key = os.getenv('PEXELS_API_KEY')
        self.pixabay_api_key = os.getenv('PIXABAY_API_KEY')

        self.r2_account_id = os.getenv('R2_ACCOUNT_ID')
        self.r2_access_key_id = os.getenv('R2_ACCESS_KEY_ID')
        self.r2_secret_access_key = os.getenv('R2_SECRET_ACCESS_KEY')
        self.r2_bucket_name = os.getenv('R2_BUCKET_NAME')
        self.r2_public_url = os.getenv('R2_PUBLIC_URL')

        # 初始化R2 S3客户端
        if self.r2_access_key_id and self.r2_secret_access_key:
            self.s3_client = boto3.client(
                's3',
                endpoint_url=f'https://{self.r2_account_id}.r2.cloudflarestorage.com',
                aws_access_key_id=self.r2_access_key_id,
                aws_secret_access_key=self.r2_secret_access_key,
                region_name='auto'
            )
        else:
            self.s3_client = None

        # 验证配置
        sources = []
        if self.unsplash_access_key:
            sources.append('Unsplash')
        if self.pexels_api_key:
            sources.append('Pexels')
        if self.pixabay_api_key:
            sources.append('Pixabay')

        if not sources:
            raise ValueError("至少需要配置一个图片API密钥 (UNSPLASH_ACCESS_KEY, PEXELS_API_KEY, 或 PIXABAY_API_KEY)")

        print(f"✓ 图片源: {', '.join(sources)}")
        if not self.r2_bucket_name:
            print("⚠️  未配置R2，将使用图片URL而非上传")

    def search_unsplash_image(self, keywords, per_page=10):
        """从Unsplash搜索图片"""
        if not self.unsplash_access_key:
            return []

        try:
            url = "https://api.unsplash.com/search/photos"
            params = {
                'query': keywords,
                'per_page': per_page,
                'orientation': 'landscape',
                'order_by': 'relevant'
            }
            headers = {
                'Authorization': f'Client-ID {self.unsplash_access_key}'
            }

            response = requests.get(url, params=params, headers=headers, timeout=10)

            if response.status_code == 200:
                data = response.json()
                if data.get('results'):
                    # 格式化为统一格式
                    return [{
                        'urls': {'regular': img['urls']['regular']},
                        'width': img.get('width', 0),
                        'height': img.get('height', 0),
                        'user': {'name': img['user'].get('name', 'Unknown')},
                        'source': 'unsplash'
                    } for img in data['results']]
            else:
                print(f"✗ Unsplash API错误: {response.status_code}")

        except Exception as e:
            print(f"✗ Unsplash搜索失败: {str(e)}")

        return []

    def search_pexels_image(self, keywords, per_page=10):
        """从Pexels搜索图片"""
        if not self.pexels_api_key:
            return []

        try:
            url = "https://api.pexels.com/v1/search"
            params = {
                'query': keywords,
                'per_page': per_page,
                'orientation': 'landscape'
            }
            headers = {
                'Authorization': self.pexels_api_key
            }

            response = requests.get(url, params=params, headers=headers, timeout=10)

            if response.status_code == 200:
                data = response.json()
                if data.get('photos'):
                    # 格式化为统一格式
                    return [{
                        'urls': {'regular': photo['src']['large']},
                        'width': photo.get('width', 0),
                        'height': photo.get('height', 0),
                        'user': {'name': photo.get('photographer', 'Unknown')},
                        'source': 'pexels'
                    } for photo in data['photos']]
            else:
                print(f"✗ Pexels API错误: {response.status_code}")

        except Exception as e:
            print(f"✗ Pexels搜索失败: {str(e)}")

        return []

    def search_pixabay_image(self, keywords, per_page=10):
        """从Pixabay搜索图片"""
        if not self.pixabay_api_key:
            return []

        try:
            url = "https://pixabay.com/api/"
            params = {
                'key': self.pixabay_api_key,
                'q': keywords,
                'per_page': per_page,
                'image_type': 'photo',
                'orientation': 'horizontal',
                'safesearch': 'true'
            }

            response = requests.get(url, params=params, timeout=10)

            if response.status_code == 200:
                data = response.json()
                if data.get('hits'):
                    # 格式化为统一格式
                    return [{
                        'urls': {'regular': hit['webformatURL']},
                        'width': hit.get('imageWidth', 0),
                        'height': hit.get('imageHeight', 0),
                        'user': {'name': hit.get('user', 'Unknown')},
                        'source': 'pixabay'
                    } for hit in data['hits']]
            else:
                print(f"✗ Pixabay API错误: {response.status_code}")

        except Exception as e:
            print(f"✗ Pixabay搜索失败: {str(e)}")

        return []

    def search_all_sources(self, keywords, per_page=10, shuffle=True):
        """从所有配置的来源搜索图片"""
        all_images = []

        print(f"  📸 搜索所有图片源...")

        # 从Unsplash搜索
        if self.unsplash_access_key:
            print(f"    Unsplash... ", end='', flush=True)
            unsplash_images = self.search_unsplash_image(keywords, per_page)
            all_images.extend(unsplash_images or [])
            print(f"✓ {len(unsplash_images or [])}张")

        # 从Pexels搜索
        if self.pexels_api_key:
            print(f"    Pexels... ", end='', flush=True)
            pexels_images = self.search_pexels_image(keywords, per_page)
            all_images.extend(pexels_images or [])
            print(f"✓ {len(pexels_images or [])}张")

        # 从Pixabay搜索
        if self.pixabay_api_key:
            print(f"    Pixabay... ", end='', flush=True)
            pixabay_images = self.search_pixabay_image(keywords, per_page)
            all_images.extend(pixabay_images or [])
            print(f"✓ {len(pixabay_images or [])}张")

        print(f"  📊 总共找到 {len(all_images)} 张图片")

        if all_images and shuffle:
            # 打乱顺序增加随机性
            random.shuffle(all_images)
            print(f"  🎲 已打乱图片顺序")

        return all_images if all_images else None

    def download_image(self, image_url, local_path):
        """下载图片到本地"""
        try:
            # 确保使用系统临时目录
            import tempfile
            temp_dir = tempfile.gettempdir()
            full_path = os.path.join(temp_dir, os.path.basename(local_path))

            response = requests.get(image_url, timeout=30, stream=True)

            if response.status_code == 200:
                with open(full_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                return True, full_path
            else:
                print(f"✗ 图片下载失败: HTTP {response.status_code}")
                return False, None

        except Exception as e:
            print(f"✗ 图片下载错误: {str(e)}")
            return False, None

    def generate_unique_filename(self, keywords, category):
        """基于关键词和分类生成唯一文件名"""
        # 创建基于内容的hash（确保唯一性）
        content_hash = hashlib.md5(
            f"{keywords}_{category}_{datetime.now().timestamp()}".encode()
        ).hexdigest()[:12]

        return f"{category}_{content_hash}.jpg"

    def upload_to_r2(self, local_path, r2_key):
        """上传图片到Cloudflare R2"""
        try:
            # 上传文件
            self.s3_client.upload_file(
                local_path,
                self.r2_bucket_name,
                r2_key,
                ExtraArgs={'ContentType': 'image/jpeg'}
            )

            # 生成公开URL
            public_url = f"{self.r2_public_url}/{r2_key}"
            return public_url

        except NoCredentialsError:
            print("✗ R2认证失败：请检查ACCESS_KEY_ID和SECRET_ACCESS_KEY")
            return None
        except ClientError as e:
            print(f"✗ R2上传失败: {str(e)}")
            return None
        except Exception as e:
            print(f"✗ R2上传错误: {str(e)}")
            return None

    def find_and_upload(self, keywords, category):
        """完整的查找和上传流程"""
        try:
            print(f"🔍 正在搜索关键词: {keywords}")

            # 步骤1: 从Unsplash搜索
            images = self.search_unsplash_image(keywords)

            if not images:
                return None

            # 选择最佳图片（选择最高分辨率）
            best_image = max(images, key=lambda img: img.get('width', 0) * img.get('height', 0))

            image_url = best_image['urls']['regular']  # 高质量版本
            photographer = best_image['user']['name']
            print(f"✓ 找到最佳图片 (摄影师: {photographer}, 尺寸: {best_image['width']}x{best_image['height']})")

            # 步骤2: 生成唯一文件名
            filename = self.generate_unique_filename(keywords, category)
            r2_key = f"articles/{category}/{filename}"

            # 步骤3: 下载到临时文件
            print("⬇️  下载图片中...")
            success, temp_path = self.download_image(image_url, filename)
            if not success:
                return None
            print("✓ 下载完成")

            # 步骤4: 上传到R2
            print("☁️  上传到R2...")
            public_url = self.upload_to_r2(temp_path, r2_key)

            # 清理临时文件
            try:
                if temp_path and os.path.exists(temp_path):
                    os.remove(temp_path)
            except:
                pass

            if public_url:
                print(f"✓ 上传成功: {public_url}")
                return public_url
            else:
                return None

        except Exception as e:
            print(f"✗ find_and_upload流程失败: {str(e)}")
            import traceback
            traceback.print_exc()
            return None


def main():
    """测试函数"""
    try:
        finder = SmartImageFinder()

        # 测试搜索和上传
        keywords = "robot vacuum cleaner"
        category = "robot-vacuums"

        print("=" * 60)
        print("🧪 Smart Image Finder 测试")
        print("=" * 60)

        result = finder.find_and_upload(keywords, category)

        if result:
            print(f"\n✨ 成功！图片URL: {result}")
        else:
            print("\n✗ 失败")

    except Exception as e:
        print(f"✗ 测试失败: {str(e)}")


if __name__ == "__main__":
    main()
