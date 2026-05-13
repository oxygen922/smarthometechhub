#!/usr/bin/env node
/**
 * 预构建脚本 - 保留现有的 articles-data.json
 * 自动化工作流模式：直接使用 JSON 文件，不覆盖
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'lib', 'articles-data.json');

function generate() {
  console.log('[prebuild] Checking articles-data.json...');

  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const data = fs.readFileSync(OUTPUT_FILE, 'utf-8');
      const articles = JSON.parse(data);
      
      if (Array.isArray(articles) && articles.length > 0) {
        console.log(`[prebuild] Preserving existing articles-data.json with ${articles.length} articles`);
        console.log('[prebuild] Auto-updater mode: using JSON directly');
        return;
      }
    } catch (e) {
      console.log('[prebuild] Invalid JSON, creating empty array');
    }
  }

  // 创建空数组
  console.log('[prebuild] Creating empty articles array');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
}

generate();
