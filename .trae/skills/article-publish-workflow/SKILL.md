---
name: "article-publish-workflow"
description: "Publishes/unpublishes SmartHomeTechHub articles (md + articles-data.json + R2 images + build + push). Invoke when user asks to 发布/上架/下架/删除 an article, update the banner, or swap article images."
---

# SmartHomeTechHub Article Publish / Unpublish Workflow

本项目的文章发布与下架流程。**运行时真相源是 `lib/articles-data.json`**，不是 `content/articles/` 下的 md —— 只改 md 不改 JSON，线上不会变。

## 项目关键事实

- 仓库：`oxygen922/smarthometechhub`，分支 `main`，Hostinger 自动部署（push 后几分钟生效，部署期间站点可能 503）。
- 运行时数据源：`lib/articles-data.json`（约 1580 篇，20+MB）。`lib/content.ts` 的 `getAllArticles()` 读它。
- md 源文件：`content/articles/<category>/YYYY-MM-DD-<slug>.md`，仅作存档/生成源。
- 分类配置：`config/site.config.ts` 的 `categories` 数组（`/category/[slug]` 的 SSG 依赖它，不在列表里的分类页会 404）。
- 首页 Banner：`app/page.tsx` 取所有 `pinned: true` 的文章传给 `components/HeroCarousel.tsx` 轮播；Banner 文章会从下方列表区去重。
- 图片：`next/image` 白名单在 `next.config.ts` 的 `images.remotePatterns`。R2 域名需加入，否则首页图报错。

## R2 凭证（图片上传用）

```
R2_ACCOUNT_ID=5b2ba233065565c01aeed77808c349e2
R2_ACCESS_KEY_ID=a73577e36706086be5e9b6b14dd82d2e
R2_SECRET_ACCESS_KEY=14f833e032d41361a8a8bf99ae61a9521cd42b8493cd043b38b81670e7fa5152
R2_BUCKET_NAME=img
R2_PUBLIC_URL=https://pub-72fc2c7201a645ffa1e5b65b44be1573.r2.dev
R2_ENDPOINT=5b2ba233065565c01aeed77808c349e2.us.r2.cloudflarestorage.com
```

图片 key 命名：`articles/<category>/<slug>/<name>.jpg`。

---

## 一、发布新文章

### 1. 采集配图
- 优先亚马逊产品页：`curl -A <Chrome-UA> https://www.amazon.com/dp/<ASIN> -o x.html`（注意返回是 gzip，需 `gunzip` 解压；页面含 `"hiRes":"https://m.media-amazon.com/images/I/..."`）。
- 亚马逊搜索页易 503，带 `-e https://www.amazon.com/` 重试。
- 官网 og:image：`grep og:image` 产品页（Hisense 等 Wix 站返回 JS 壳，但 `<meta og:image>` 在壳里）。
- 下载候选后用 `browser_use` 子代理做视觉评估（本模型无法读图）：本地 `python3 -m http.server <port>` 起选图页，让子代理按"封面要实景/场景、内文要白底产品图"挑选。
- 上传：先 `pip install boto3`（沙箱每会话会清空），用 boto3 `upload_file` 到 `img` 桶，`ContentType=image/jpeg`、`CacheControl=public, max-age=31536000, immutable`。上传后 `curl` 公网 URL 验证 200。

### 2. 写 md
`content/articles/<category>/YYYY-MM-DD-<slug>.md`，frontmatter 字段：
```
---
title: "..."
slug: "..."
excerpt: "..."
category: "..."
author: "SmartHome TechHub Editorial Team"
date: "YYYY-MM-DD"
tags: ["..."]
rating: "4.8"
price: "..."
pinned: true        # 仅要上首页 Banner 轮播时加
featuredImage: "https://pub-72fc2c7201a645ffa1e5b65b44be1573.r2.dev/articles/<category>/<slug>/hero.jpg"
---
```
正文用标准 Markdown，图片用 `![alt](R2_URL)`。

### 3. 同步到 articles-data.json（最关键）
**必须用 Python 脚本做 JSON 级操作，不要字符串替换**（20MB 文件，易损坏）：
```python
import json
d = json.load(open('lib/articles-data.json', encoding='utf-8'))
# 新文章插到 della BF（或 index 0 的 pinned 文章）之后；普通文章按 date 排序
idx = next(i for i,a in enumerate(d) if a['slug']=='della-black-friday-2026-deals') + 1
d[idx:idx] = [new_article_dict]
assert len(d) == old + 1
open('lib/articles-data.json','w',encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
```
若要上 Banner：`pinned: true`。

### 4. 若涉及新分类
在 `config/site.config.ts` 的 `categories` 追加 `{ id, name, slug, icon, description }`，确保 `/category/<slug>` 能生成。

### 5. 构建验证
```bash
npm ci   # 沙箱每会话 node_modules 会丢失，必须先装
npm run build
```
- `next/font/google` 偶发拉取失败（网络），重试 `npm run build` 即可。
- 验证：`grep <slug> .next/server/app/index.html`；新分类页 `ls .next/server/app/category/`。

### 6. 提交 & 推送
```bash
git add -A
git -c user.name="oxygen922" -c user.email="oxygen922@users.noreply.github.com" commit -m "..."
git push origin HEAD:main
```

---

## 二、下架文章

1. 从 `lib/articles-data.json` 过滤掉目标 slug（Python `[a for a in d if a['slug'] not in remove]`），`assert` 数量正确后写回。
2. 删除 `content/articles/<category>/<file>.md`（用 DeleteFile 工具）。
3. 若该分类因此变空，从 `config/site.config.ts` 的 `categories` 移除该分类（避免空分类页出现在导航）。
4. `npm ci && npm run build`，验证 `grep <slug> .next/server/app/index.html` 为 0、对应 category 页不再生成。
5. 提交推送。R2 图片可保留（以后恢复可复用）。

---

## 三、推送必遇：GitHub Action 重置 main（孤儿历史）

每日 `daily-article-generation` 工作流会把 `main` 强制重置成**单个孤儿提交**（包含全量内容 + 当日新文章），导致本地历史与远端无共同祖先，`git push` 报 `refusing to merge unrelated histories`。

处理：
```bash
git fetch origin main
git merge origin/main --allow-unrelated-histories
# 通常冲突在 lib/articles-data.json（远端多了每日文章）和 md 文件
# 解决：代码冲突保留 ours；articles-data.json 以远端为基底，重放你的改动（插入/过滤文章）
git add -A && git commit
git push origin HEAD:main
```
合并 articles-data.json 冲突的安全做法：`git show origin/main:lib/articles-data.json > base.json`，在 base 上用 Python 重放你的增删，`json.loads` 校验后写回。**不要手工解决 JSON 冲突标记**。

---

## 四、常见陷阱

- **只改 md 不改 JSON** → 线上不变。永远同步两者。
- **R2 缓存 immutable** → 换图必须用新文件名（如 `hero2.jpg`），否则浏览器/CDN 命中旧缓存。
- **`next: not found`** → `npm ci` 重装依赖（沙箱每会话清空 node_modules）。
- **构建报 `next/font` 错误** → 重试一次，网络抖动。
- **JSON 字符串替换** → 禁止，20MB 文件极易损坏；一律 Python 解析→操作→`json.loads` 校验→写回。
- **编辑锚点不唯一** → 参考经验：用可唯一匹配的闭环锚点 + 小块编辑，大块改动拆成多次，每次保持结构闭合。
- **Hostinger 503** → push 后自动重建期间正常，等几分钟；持续 503 去 hPanel 重启 Node 应用。
