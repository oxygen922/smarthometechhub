/**
 * Hero Banner Component - SmartHome TechHub
 * Standard hero section with parallax scroll effect
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ImageScrollHeroProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function ImageScrollHero({
  title, subtitle, description, backgroundImage,
  ctaText = 'Explore More', ctaLink = '#',
}: ImageScrollHeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-brand-dark">
      <div
        className="absolute inset-0 transform scale-110"
        style={{ transform: `translateY(${scrollY * 0.5}px) scale(1.1)`, transition: 'transform 0.1s ease-out' }}
      >
        {backgroundImage && (
          <>
            <Image src={backgroundImage} alt={title} fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/85 via-brand-dark/50 to-brand-bg" />
          </>
        )}
        {!backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/85 via-brand-dark/50 to-brand-bg" />
        )}
      </div>

      {/* Decorative gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-brand-secondary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative h-full flex items-center justify-center text-white px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 backdrop-blur-sm">
            <span className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-pulse" />
            <p className="text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-brand-primary">{subtitle}</p>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[72px] font-bold leading-[1.1] tracking-tight">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">{description}</p>
          {ctaText && ctaLink && (
            <Link href={ctaLink} className="inline-flex items-center gap-2 mt-8 px-8 py-4 md:px-10 md:py-4.5 bg-gradient-to-r from-brand-primary to-orange-500 hover:from-brand-primary/90 hover:to-orange-500/90 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-glow-orange uppercase tracking-wider text-sm md:text-base">
              {ctaText}
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-brand-primary/60 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
