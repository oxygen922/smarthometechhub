// 修复剩余的重复封面图
const fs = require('fs');
const path = require('path');

const updates = [
  {
    category: 'robot-vacuums',
    filename: '2026-05-13-robot-vacuums-20260513212544.md',
    newImageUrl: 'https://images.unsplash.com/photo-1588890325840-b4c11d7e8f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80'
  },
  {
    category: 'smart-kitchen',
    filename: '2026-05-13-smart-kitchen-20260513213715.md',
    newImageUrl: 'https://images.unsplash.com/photo-1556911220-bf31c93f8a78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80'
  }
];

updates.forEach((update, index) => {
  const filepath = path.join('./content/articles', update.category, update.filename);

  console.log(`${index + 1}. 修复: ${update.filename}`);

  let content = fs.readFileSync(filepath, 'utf8');

  content = content.replace(
    /featuredImage: "[^"]*"/,
    'featuredImage: "' + update.newImageUrl + '"'
  );

  fs.writeFileSync(filepath, content, 'utf8');
  console.log('✓ 已更新');
});

console.log('\n完成！');
