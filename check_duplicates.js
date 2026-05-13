const data = require('./lib/articles-data.json');
const imgs = {};

data.forEach(a => {
  const url = a.featuredImage;
  imgs[url] = (imgs[url] || 0) + 1;
});

const dup = Object.entries(imgs).filter(([k, v]) => v > 1);

console.log('重复图片数量:', dup.length);
if (dup.length > 0) {
  console.log('\n重复图片详情（前10个）:');
  dup.slice(0, 10).forEach(([url, count]) => {
    console.log(`  ${count}次: ${url.substring(0, 70)}...`);
  });
}

// 检查有多少文章使用R2
const r2Count = data.filter(a => a.featuredImage && a.featuredImage.includes('r2.dev')).length;
console.log(`\nR2图片文章数: ${r2Count}/${data.length}`);
