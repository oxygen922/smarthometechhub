const data = require('./lib/articles-data.json');
const imgs = {};

data.forEach(a => {
  const url = a.featuredImage;
  if (!imgs[url]) {
    imgs[url] = [];
  }
  imgs[url].push(a.slug);
});

const shared = Object.entries(imgs).filter(([k, v]) => v.length > 1);

console.log('共享图片的文章数量:', shared.length);
console.log('总文章数:', data.length);

if (shared.length > 0) {
  console.log('\n共享图片详情（前10个）:');
  shared.slice(0, 10).forEach(([url, slugs]) => {
    console.log(`\n图片: ${url.substring(0, 60)}...`);
    console.log(`被 ${slugs.length} 篇文章使用:`);
    slugs.forEach(s => console.log(`  - ${s}`));
  });
}
