#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试R2上传功能
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


def test_r2_upload():
    """测试R2上传功能"""
    print("=" * 70)
    print("🧪 R2上传功能测试")
    print("=" * 70)

    try:
        # 初始化
        print("\n1️⃣ 初始化SmartImageFinder...")
        finder = SmartImageFinder()

        # 检查R2配置
        print("\n2️⃣ 检查R2配置...")
        if not finder.r2_bucket_name:
            print("  ❌ R2_BUCKET_NAME未配置")
            return False

        if not finder.s3_client:
            print("  ❌ R2 S3客户端未初始化（请检查R2密钥配置）")
            return False

        print(f"  ✓ R2配置正确")
        print(f"    - Bucket: {finder.r2_bucket_name}")
        print(f"    - Public URL: {finder.r2_public_url}")

        # 测试搜索和上传
        print("\n3️⃣ 测试图片搜索和上传...")
        keywords = "robot vacuum cleaner"
        category = "robot-vacuums"

        result = finder.find_and_upload(keywords, category)

        if result:
            print(f"\n✅ 测试成功！")
            print(f"   R2 URL: {result}")
            print(f"\n💡 提示：在浏览器中访问上述URL验证图片可访问")
            return True
        else:
            print(f"\n❌ 测试失败")
            return False

    except Exception as e:
        print(f"\n❌ 测试失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_r2_upload()
    sys.exit(0 if success else 1)
