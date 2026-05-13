/**
 * 站点头部组件 - 简洁版，参考原版网站设计
 */

'use client';

import { SiteConfig } from '@/types/article';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SiteHeaderProps {
  site: SiteConfig;
}

export function SiteHeader({ site }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 border-b border-slate-700">
      {/* 单行导航栏 - Taste Skill优化 */}
      <div className="bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">{site.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="font-sans text-xl font-bold text-white leading-none tracking-tight">
                  {site.name}
                </h1>
              </div>
            </Link>

            {/* 导航链接 - Desktop 居中 */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex items-center justify-center">
                {site.categories.map((category, index) => (
                  <li key={category.id} className="flex items-center">
                    {index > 0 && <span className="mx-4 text-slate-600 text-xs">/</span>}
                    <Link
                      href={`/category/${category.slug}`}
                      className="nav-link text-slate-300 hover:text-brand-accent transition-colors duration-200 relative group px-2 py-1"
                    >
                      {category.name}
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden flex items-center justify-center p-2 text-slate-100 rounded-md flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700">
          <nav className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {site.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <p className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                        {category.name}
                      </p>
                    </div>
                    <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
