#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试脚本 - 生成单篇文章
"""

import sys
import os

# 设置Windows控制台UTF-8编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 添加backend目录到Python路径
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
from openai import OpenAI
import requests
from datetime import datetime

# 加载环境变量
load_dotenv()

print("开始测试单篇文章生成...")

# 初始化DeepSeek客户端
api_key = os.getenv('DEEPSEEK_API_KEY')
api_base = os.getenv('DEEPSEEK_API_BASE', 'https://api.deepseek.com')

print(f"API Base: {api_base}")
print(f"API Key存在: {bool(api_key)}")

client = OpenAI(api_key=api_key, base_url=api_base)

# 简单测试：生成一篇短文章
print("\n正在调用AI生成内容...")

try:
    response = client.chat.completions.create(
        model='deepseek-chat',
        messages=[
            {'role': 'system', 'content': 'You are an expert smart home technology reviewer.'},
            {'role': 'user', 'content': 'Write a 500 word review about smart toilets in 2026.'}
        ],
        temperature=0.7,
        max_tokens=1000
    )

    if response.choices:
        content = response.choices[0].message.content
        print("\n=== AI生成内容 ===")
        print(content[:500])  # 只打印前500字符
        print("\n✓ AI测试成功！")
    else:
        print("✗ AI返回空内容")

except Exception as e:
    print(f"✗ AI调用失败: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n测试完成！")
