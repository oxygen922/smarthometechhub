/**
 * Site Header - Smart Home TechHub
 * 参考现代化设计，优化导航栏体验
 */

'use client';

import { SiteConfig } from '@/types/article';
import Link from 'next/link';
import { Search, Menu, X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SiteHeaderProps {
  site: SiteConfig;
}

export function SiteHeader({ site }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'bg-brand-dark/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-brand-dark'
    }`}>
      <div className="container mx-auto px-4">
        {/* Main Nav Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg bg-brand-primary flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-brand-primary/20 transition-shadow shrink-0">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-black text-white leading-none tracking-tight uppercase">
                SmartHome<span className="text-brand-primary">Tech</span>Hub
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <ul className="flex items-center gap-1">
              {site.categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="px-3 py-2 text-[12px] font-medium text-slate-400 hover:text-white rounded-md transition-all whitespace-nowrap"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center bg-brand-surface/60 border border-slate-700/40 rounded-lg px-3 py-1.5 focus-within:border-brand-primary/40 transition-colors">
              <Search className="h-3.5 w-3.5 text-slate-500 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-slate-300 placeholder:text-slate-600 outline-none w-36"
              />
            </div>
            <div className="hidden xl:flex items-center gap-1.5 pl-2 text-xs text-slate-500">
              <Zap className="h-3 w-3 text-brand-primary" />
              <span className="font-medium">New Weekly</span>
            </div>
            <button
              className="md:hidden flex items-center justify-center p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-dark/98 backdrop-blur-md border-t border-slate-800/40 animate-slide-down">
          <nav className="container mx-auto px-4 py-3">
            <div className="space-y-0.5">
              {site.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">{category.name}</span>
                    <svg className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
