#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试API POST请求
"""

import sys
import os
import requests
import json

# 设置Windows控制台UTF-8编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 测试数据
test_article = {
    "title": "Test Article for API",
    "slug": "test-article-123",
    "excerpt": "This is a test article to check if API POST is working",
    "category": "robot-vacuums",
    "author": "SmartHome TechHub Editorial Team",
    "date": "2026-05-13",
    "tags": ["test", "api-test"],
    "rating": 4.5,
    "price": "$999",
    "content": "# Test Article\n\nThis is a test article content.\n\n## Features\n\n- Feature 1\n- Feature 2\n\n## Conclusion\n\nTest completed.",
    "featuredImage": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64"
}

print("发送测试POST请求到API服务器...")
print(f"URL: http://localhost:3003/api/articles")
print(f"数据: {json.dumps(test_article, indent=2)}\n")

try:
    response = requests.post(
        "http://localhost:3003/api/articles",
        headers={'Content-Type': 'application/json'},
        json=test_article,
        timeout=30
    )

    print(f"状态码: {response.status_code}")
    print(f"响应头: {dict(response.headers)}")
    print(f"响应内容:\n{response.text}")

    if response.status_code == 200:
        print("\n✓ API测试成功！")
    else:
        print(f"\n✗ API返回错误: {response.status_code}")

except Exception as e:
    print(f"✗ 请求失败: {str(e)}")
    import traceback
    traceback.print_exc()
