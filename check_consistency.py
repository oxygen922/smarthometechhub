import os
import re
import json

# 读取JSON
with open('lib/articles-data.json', 'r', encoding='utf-8') as f:
    json_data = json.load(f)

# 检查5篇随机文章
import random
sample_articles = random.sample(json_data, 5)

mismatch_count = 0

for article in sample_articles:
    slug = article['slug']
    json_image = article['featuredImage']

    # 找到对应的markdown文件
    md_file = None
    for root, dirs, files in os.walk('content/articles'):
        for file in files:
            if file.endswith('.md') and slug in file:
                md_file = os.path.join(root, file)
                break
        if md_file:
            break

    if md_file:
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r'featuredImage:\s*"([^"]+)"', content)
            if match:
                md_image = match.group(1)
                is_match = (md_image == json_image)

                if not is_match:
                    print(f'{slug}: MISMATCH')
                    print(f'  MD:  {md_image}')
                    print(f'  JSON: {json_image}')
                    print()
                    mismatch_count += 1

if mismatch_count == 0:
    print('All checked articles match!')
else:
    print(f'Found {mismatch_count} mismatches out of 5')
