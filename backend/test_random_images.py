#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试随机图片选择策略
验证新的随机性是否工作正常
"""

import os
import sys

# 设置Windows控制台UTF-8编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', line_buffering=True)

from dotenv import load_dotenv
load_dotenv()

from smart_image_finder import SmartImageFinder


def test_random_selection():
    """测试随机选择策略"""
    print("=" * 70)
    print("🧪 测试随机图片选择策略")
    print("=" * 70)

    finder = SmartImageFinder()

    keywords = "robot vacuum cleaner"
    category = "robot-vacuums"

    print(f"\n🔍 测试关键词: {keywords}")
    print(f"📂 分类: {category}")
    print()

    # 进行5次测试，看看每次选择的图片是否不同
    test_results = []

    for i in range(5):
        print(f"\n{'='*70}")
        print(f"🧪 测试 #{i+1}")
        print('='*70)

        # 搜索图片
        images = finder.search_all_sources(keywords, per_page=20, shuffle=True)

        if images and len(images) > 0:
            # 模拟智能随机选择
            import random

            # 过滤高质量图片
            high_quality = [img for img in images if img.get('width', 0) >= 1000 and img.get('height', 0) >= 600]

            if not high_quality:
                high_quality = images[:int(len(images) * 0.8)]

            selected = random.choice(high_quality)

            print(f"✓ 选择了图片:")
            print(f"  来源: {selected.get('source', 'unknown')}")
            print(f"  摄影师: {selected['user']['name']}")
            print(f"  分辨率: {selected.get('width', 0)}x{selected.get('height', 0)}")
            print(f"  URL: {selected['urls']['regular'][:80]}...")

            test_results.append({
                'source': selected.get('source', 'unknown'),
                'photographer': selected['user']['name'],
                'resolution': f"{selected.get('width', 0)}x{selected.get('height', 0)}",
                'url': selected['urls']['regular']
            })
        else:
            print(f"✗ 搜索失败")

    # 统计结果
    print("\n" + "=" * 70)
    print("📊 测试结果汇总")
    print("=" * 70)

    unique_images = len(set(r['url'] for r in test_results))
    print(f"\n✓ 总测试次数: 5")
    print(f"✓ 唯一图片数量: {unique_images}")
    print(f"✓ 随机性: {'✅ 很好' if unique_images >= 4 else '⚠️ 需要改进'}")

    sources = {}
    for r in test_results:
        source = r['source']
        sources[source] = sources.get(source, 0) + 1

    print(f"\n📈 来源分布:")
    for source, count in sources.items():
        print(f"  {source}: {count}次")

    print("\n" + "=" * 70)


if __name__ == "__main__":
    try:
        test_random_selection()
    except KeyboardInterrupt:
        print("\n\n⚠️  测试被用户中断")
    except Exception as e:
        print(f"\n\n✗ 测试失败: {str(e)}")
        import traceback
        traceback.print_exc()
