/**
 * 首页 Banner 轮播组件
 * 多篇文章自动轮播展示，支持指示器、左右切换与悬停暂停
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  ctaText: string;
  ctaLink: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  interval?: number;
}

export function HeroCarousel({ slides, interval = 6000 }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [paused, count, next, interval]);

  if (count === 0) return null;

  return (
    <section
      className="relative h-[60vh] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 背景幻灯片 - 淡入淡出 */}
      {slides.map((slide, index) => (
        <div
          key={slide.ctaLink}
          className="absolute inset-0 transition-opacity duration-1000 ease-out"
          style={{ opacity: index === active ? 1 : 0 }}
          aria-hidden={index !== active}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary">
            {slide.image && (
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>
        </div>
      ))}

      {/* 内容 */}
      <div className="relative h-full flex items-center justify-center text-white px-4">
        {slides.map((slide, index) => (
          <div
            key={`content-${slide.ctaLink}`}
            className="absolute inset-0 flex items-center justify-center px-4 transition-all duration-700"
            style={{
              opacity: index === active ? 1 : 0,
              transform: index === active ? 'translateY(0)' : 'translateY(12px)',
              pointerEvents: index === active ? 'auto' : 'none',
            }}
            aria-hidden={index !== active}
          >
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-brand-accent">
                {slide.subtitle}
              </p>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold leading-tight line-clamp-3">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                {slide.description}
              </p>
              <Link
                href={slide.ctaLink}
                className="inline-block mt-6 px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
              >
                {slide.ctaText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 左右箭头 */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 指示器 */}
      {count > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={`dot-${slide.ctaLink}`}
              onClick={() => setActive(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === active ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
