/**
 * 网站配置文件
 * 请根据你的需求修改以下配置
 */

import { SiteConfig } from '@/types/article';

export const siteConfig: SiteConfig = {
  name: 'SmartHome TechHub',
  description: 'Expert reviews and guides for smart home appliances and intelligent living technology',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://smarthometechhub.online',

  categories: [
    {
      id: 'category-1',
      name: 'Smart Toilets',
      slug: 'smart-toilets',
      icon: '🚽',
      description: 'Smart bathroom fixtures and intelligent toilet technology'
    },
    {
      id: 'category-2',
      name: 'Robot Vacuums',
      slug: 'robot-vacuums',
      icon: '🤖',
      description: 'Automated cleaning robots and smart vacuum systems'
    },
    {
      id: 'category-3',
      name: 'Smart Lawn Mowers',
      slug: 'smart-lawn-mowers',
      icon: '🌿',
      description: 'Intelligent lawn care and automated mowing solutions'
    },
    {
      id: 'category-4',
      name: 'Smart Kitchen',
      slug: 'smart-kitchen',
      icon: '🍳',
      description: 'Smart appliances and intelligent kitchen technology'
    },
    {
      id: 'category-5',
      name: 'Air Quality',
      slug: 'air-quality',
      icon: '💨',
      description: 'Air purifiers, monitors and air quality solutions'
    },
    {
      id: 'category-6',
      name: 'Home Security',
      slug: 'home-security',
      icon: '🔒',
      description: 'Smart security systems and home protection devices'
    },
    {
      id: 'category-7',
      name: 'Smart Lighting',
      slug: 'smart-lighting',
      icon: '💡',
      description: 'Intelligent lighting and smart home illumination'
    },
  ],
};
