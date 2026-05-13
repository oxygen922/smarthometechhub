#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成简单的PNG图标文件 - SmartHome TechHub
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """创建指定尺寸的图标 - 简单的S字母"""
    # 创建图像 - 青色背景
    img = Image.new('RGB', (size, size), color='#0891B2')
    draw = ImageDraw.Draw(img)

    # 绘制圆角矩形背景（稍微浅一点的青色）
    corner_radius = size // 5
    draw.rounded_rectangle(
        [(0, 0), (size, size)],
        radius=corner_radius,
        fill='#06B6D4'
    )

    # 绘制"S"字母
    try:
        # 尝试使用系统字体
        font = ImageFont.truetype("arial.ttf", size // 2)
    except:
        # 如果找不到字体，使用默认字体
        font = ImageFont.load_default()

    # 计算文字位置（居中）
    text = "S"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (size - text_width) // 2
    y = (size - text_height) // 2 - size // 20

    # 绘制白色S字母
    draw.text((x, y), text, fill='white', font=font)

    # 保存图像
    img.save(output_path, 'PNG')
    print(f"Created icon: {output_path} ({size}x{size})")

def main():
    """生成所有需要的图标尺寸"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(script_dir, '..', 'public')

    sizes = [192, 512]
    for size in sizes:
        output_path = os.path.join(public_dir, f'icon-{size}.png')
        create_icon(size, output_path)

    print("\nAll icons generated successfully!")

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("Error: Pillow library required. Install: pip install Pillow")
    except Exception as e:
        print(f"Error: {str(e)}")
