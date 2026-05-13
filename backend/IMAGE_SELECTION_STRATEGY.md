# 图片选择策略优化说明

## 问题
之前的图片选择逻辑总是选择最高分辨率的图片（第一张），导致：
1. 每篇文章的封面图风格相似
2. 缺乏视觉多样性
3. 用户体验单调

## 新的智能随机策略

### 1. 图片搜索阶段（smart_image_finder.py）
- ✅ **打乱搜索结果顺序**：`search_all_sources(keywords, per_page=20, shuffle=True)`
- ✅ 确保每次搜索的图片顺序不同

### 2. 图片选择阶段（batch_generate_and_save.py）
采用**智能随机策略**，综合质量和随机性：

```python
# 第一步：过滤高质量图片
high_quality_images = [
    img for img in images
    if img.get('width', 0) >= 1000 and img.get('height', 0) >= 600
]

# 第二步：从高质量图片中随机选择
import random
selected_image = random.choice(high_quality_images)
```

### 3. 策略特点

**✅ 保证质量**
- 只选择分辨率 >= 1000x600 的图片
- 确保图片清晰度足够

**✅ 增加随机性**
- 从高质量图片池中随机选择
- 每次选择的图片可能不同

**✅ 来源多样性**
- 综合Unsplash、Pexels、Pixabay等多个来源
- 避免总是使用同一个平台

**✅ 去重机制**
- 记录已使用的图片URL
- 避免重复使用同一张图片

### 4. 备选方案

如果所有高质量图片都已使用过：
- 从高质量图片池中重新随机选择
- 允许重复使用（但概率较低）

## 测试方法

运行测试脚本验证随机性：

```bash
cd backend
python test_random_images.py
```

预期结果：
- 5次测试中至少4次选择不同的图片
- 来源分布相对均匀

## 配置建议

### 调整质量阈值
如果觉得图片质量太高导致选择范围太小，可以调整阈值：

```python
# 当前设置（严格）
if img.get('width', 0) >= 1000 and img.get('height', 0) >= 600:

# 放宽设置（推荐）
if img.get('width', 0) >= 800 and img.get('height', 0) >= 500:

# 更宽松（最大随机性）
if img.get('width', 0) >= 600 and img.get('height', 0) >= 400:
```

### 调整搜索数量
增加搜索结果数量可以提高随机性：

```python
# 当前设置
images = self.image_finder.search_all_sources(keywords, per_page=20, shuffle=True)

# 增加到30张
images = self.image_finder.search_all_sources(keywords, per_page=30, shuffle=True)
```

## 效果对比

### 优化前
- ❌ 总是选择最高分辨率图片
- ❌ 同一关键词多篇文章经常使用相同封面
- ❌ 视觉单调

### 优化后
- ✅ 从高质量图片中随机选择
- ✅ 同一关键词多篇文章封面各不相同
- ✅ 视觉丰富多样

## 维护建议

1. **定期检查**：每月运行一次 `test_random_images.py` 验证随机性
2. **监控重复**：使用 `check_shared_images.js` 检查是否有过多重复图片
3. **调整参数**：根据实际情况调整质量阈值和搜索数量

## 回滚方案

如果新策略有问题，可以回滚到旧的确定性策略：

```python
# 回滚到按分辨率排序
sorted_images = sorted(images, key=lambda img: img.get('width', 0) * img.get('height', 0), reverse=True)
selected_image = sorted_images[0]  # 总是选择最高分辨率
```

但不建议回滚，因为新策略明显更好！

---

**更新时间**：2026-05-14
**维护者**：老王
