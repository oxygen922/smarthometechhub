/**
 * {{SITE_NAME}} Site Configuration
 * Customize this file for each new site
 */

import { SiteConfig } from '@/types/article';

export const siteConfig: SiteConfig = {
  name: 'SmartHome TechHub',
  description: 'Your trusted source for smart home appliance reviews, comparisons, and buying guides. Expert insights on smart toilets, robot vacuums, lawn mowers, and more.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://smarthometechhub.com',
  categories: [
    {
      id: 'smart-toilets',
      name: 'Smart Toilets',
      slug: 'smart-toilets',
      icon: '🚽',
      description: 'Advanced bidet toilets, smart bathroom fixtures, and high-tech bathroom innovations'
    },
    {
      id: 'robot-vacuums',
      name: 'Robot Vacuums',
      slug: 'robot-vacuums',
      icon: '🤖',
      description: 'Automated cleaning robots, smart vacuums, and intelligent floor care solutions'
    },
    {
      id: 'lawn-mowers',
      name: 'Smart Lawn Mowers',
      slug: 'lawn-mowers',
      icon: '🌱',
      description: 'Robotic lawn mowers and intelligent garden maintenance equipment'
    },
    {
      id: 'kitchen-appliances',
      name: 'Smart Kitchen',
      slug: 'kitchen-appliances',
      icon: '🍳',
      description: 'Intelligent kitchen appliances, smart refrigerators, and automated cooking devices'
    },
    {
      id: 'air-purifiers',
      name: 'Air Quality',
      slug: 'air-purifiers',
      icon: '💨',
      description: 'Smart air purifiers, climate control, and home air quality monitoring systems'
    },
    {
      id: 'security',
      name: 'Home Security',
      slug: 'security',
      icon: '🔒',
      description: 'Smart locks, cameras, and intelligent home security systems'
    },
    {
      id: 'lighting',
      name: 'Smart Lighting',
      slug: 'lighting',
      icon: '💡',
      description: 'Smart lighting systems, automated controls, and intelligent light solutions'
    }
  ],
};
