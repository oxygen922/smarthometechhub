/**
 * Homepage Configuration - Smart Home TechHub
 */

export const homepageConfig = {
  // 模块开关
  modules: {
    hero: true,
    featured: true,
    products: true,
    guides: true,
    latest: true,
  },

  // 品类映射
  categoryMapping: {
    // Smart Home category mapping
    products: ['Smart Toilets', 'Robot Vacuums', 'Lawn Mowers'],
    guides: ['Smart Kitchen', 'Air Purifiers', 'Home Security', 'Smart Lighting'],
  },

  // 各模块显示的文章数量限制
  limits: {
    hero: 1,
    products: 6,
    featured: 3,
    guides: 4,
    latest: 3,
  },

  // 首页标语
  tagline: {
    hero: "Smart Living, Simplified",
    subhero: "Expert reviews for your intelligent home",
  },
};

export type HomepageConfig = typeof homepageConfig;
