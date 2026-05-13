# 智能家居科技中心 - 自动化部署方案

## 🚀 自动化工作流说明

### 方案一：GitHub Actions 自动采集（推荐）

**优点：**
- ✅ 完全免费
- ✅ 稳定可靠
- ✅ 自动提交到GitHub
- ✅ Hostinger自动部署更新
- ✅ 有日志记录

**工作流程：**
```
1. GitHub Actions 定时触发（每天9点和17点）
   ↓
2. 运行文章采集脚本
   ↓
3. 生成新的Markdown文章
   ↓
4. 更新 lib/articles-data.json
   ↓
5. 自动提交到GitHub
   ↓
6. Hostinger检测到更新
   ↓
7. 自动重新部署网站
```

**配置步骤：**

1. **GitHub Actions工作流已创建**
   - 文件：`.github/workflows/daily-article-update.yml`
   - 定时：每天北京时间9点和17点自动运行

2. **手动触发采集**
   - 访问：https://github.com/oxygen922/smarthometechhub/actions
   - 点击"每日文章采集和自动部署"
   - 点击"Run workflow"手动触发

3. **查看采集结果**
   - 在Actions页面查看运行日志
   - 检查是否有新文章提交
   - 2-5分钟后Hostinger会自动部署

---

### 方案二：Hostinger Cron Job（备选）

如果你想在Hostinger服务器上直接运行：

**优点：**
- ✅ 直接在服务器上运行
- ✅ 可以访问Hostinger特定功能

**缺点：**
- ❌ 需要在Hostinger上安装Python环境
- ❌ 需要手动配置
- ❌ 没有GitHub Actions稳定

**配置步骤：**

1. **SSH连接到Hostinger**
2. **设置Cron Job**
   ```bash
   # 编辑crontab
   crontab -e
   
   # 添加定时任务（每天9点和17点）
   0 9 * * * cd /home/u124544055/domains/orange-tapir-495028.hostingersite.com && python3 scripts/github-actions-collector.py
   0 17 * * * cd /home/u124544055/domains/orange-tapir-495028.hostingersite.com && python3 scripts/github-actions-collector.py
   ```

3. **手动触发**
   ```bash
   cd /home/u124544055/domains/orange-tapir-495028.hostingersite.com
   python3 scripts/github-actions-collector.py
   ```

---

## 🎯 推荐的完整工作流

### 日常自动化（推荐）
```
GitHub Actions (每天9:00, 17:00)
    ↓ 采集新文章
    ↓ 自动提交到GitHub
    ↓ Hostinger自动部署
    ↓ 用户看到新文章
```

### 手动更新文章
```bash
# 方法1：在GitHub上手动触发Actions
# 访问 Actions → 点击 "Run workflow"

# 方法2：本地采集后推送
cd backend/采集器
python daily_workflow.py  # 运行采集器
git add .                    # 添加新文章
git commit -m "新增文章"    # 提交
git push origin main        # 推送（自动触发部署）
```

---

## 📊 监控和维护

### 查看采集状态
1. **GitHub Actions页面**
   - https://github.com/oxygen922/smarthometechhub/actions
   - 可以看到每次运行的成功/失败状态

2. **网站文章更新**
   - https://smarthometechhub.online
   - 检查首页是否有新文章显示

### 故障排除
**如果GitHub Actions失败：**
1. 检查采集脚本是否有Python语法错误
2. 查看Actions日志了解具体错误
3. 确保`lib/articles-data.json`格式正确

**如果Hostinger没有自动部署：**
1. 检查GitHub是否有新的提交
2. 在Hostinger控制面板手动触发部署
3. 检查部署日志了解错误

---

## ⚡ 立即开始使用

### 第一步：测试GitHub Actions
1. 访问：https://github.com/oxygen922/smarthometechhub/actions
2. 找到"每日文章采集和自动部署"工作流
3. 点击"Run workflow"按钮测试

### 第二步：验证自动部署
1. 等待2-5分钟让Actions完成
2. 检查GitHub是否有新提交
3. 访问网站查看新文章

### 第三步：享受自动化
- 现在每天会自动采集两次文章
- 无需任何手动操作
- 网站会自动更新内容

---

## 🔧 自定义配置

### 修改采集时间
编辑 `.github/workflows/daily-article-update.yml`:
```yaml
schedule:
  - cron: '0 1 * * *'  # 修改这里来改变时间
  - cron: '5 9 * * *'  # 添加更多时间点
```

### 修改采集逻辑
编辑 `scripts/github-actions-collector.py` 或调用你的 `backend/采集器/` 中的脚本

---

需要老王我帮你配置其他的自动化方案吗？
