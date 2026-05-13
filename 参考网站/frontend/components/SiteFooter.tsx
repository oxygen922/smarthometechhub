/**
 * Site Footer - Smart Home TechHub
 */

import { SiteConfig } from '@/types/article';
import Link from 'next/link';
import { X, Rss } from 'lucide-react';

interface SiteFooterProps {
  site: SiteConfig;
}

export function SiteFooter({ site }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark border-t border-slate-800/40">
      <div className="container mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-brand-primary flex items-center justify-center">
                <span className="text-white font-black text-base">S</span>
              </div>
              <span className="font-black text-base text-white tracking-tight uppercase">
                SmartHome<span className="text-brand-primary">Tech</span>Hub
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Expert reviews and guides for smart home appliances and intelligent living technology.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a href="#" className="flex items-center justify-center h-8 w-8 rounded-md bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-colors" aria-label="X">
                <X className="h-3.5 w-3.5" />
              </a>
              <a href="/rss.xml" className="flex items-center justify-center h-8 w-8 rounded-md bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-colors" aria-label="RSS">
                <Rss className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-xs uppercase tracking-widest text-slate-400">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {site.categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`} className="text-slate-500 hover:text-white transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-xs uppercase tracking-widest text-slate-400">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-slate-500 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-slate-500 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-500 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/sitemap.xml" className="text-slate-500 hover:text-white transition-colors">Sitemap</Link></li>
            </ul>
          </div>

          {/* Popular Guides */}
          <div>
            <h3 className="font-semibold mb-4 text-xs uppercase tracking-widest text-slate-400">
              Popular Guides
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#" className="text-slate-500 hover:text-white transition-colors">Best Smart Toilets 2026</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-white transition-colors">Robot Vacuum Buying Guide</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-white transition-colors">Smart Lawn Mower Comparison</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-white transition-colors">Home Automation Setup</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-slate-400">
              &copy; {currentYear} {site.name}. All rights reserved.
            </p>
            <div className="flex gap-5">
              <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
