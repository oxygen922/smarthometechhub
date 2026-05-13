/**
 * Newsletter Subscribe Component - Smart Home TechHub
 */

'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';

interface NewsletterSubscribeProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

export function NewsletterSubscribe({
  title = 'Stay Smart',
  description = 'Weekly smart home reviews, buying guides, and exclusive tech deals',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe Now',
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-20 bg-brand-dark relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-primary/20">
              <Zap className="h-8 w-8 text-brand-primary" />
            </div>
          </div>
          <h2 className="text-h1 md:text-display text-white mb-4">{title}</h2>
          <p className="text-subtitle md:text-body text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">{description}</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              className="flex-1 px-6 py-4 rounded-full bg-brand-surface border border-slate-700/50 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/20 transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-brand-primary to-orange-500 hover:from-brand-primary/90 hover:to-orange-500/90 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-glow-orange uppercase tracking-wider text-sm whitespace-nowrap"
            >
              {buttonText}
            </button>
          </form>
          {isSubscribed && (
            <div className="mt-6 p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-xl inline-block">
              <p className="font-semibold text-brand-accent">You&apos;re in! Get ready for smart home insights.</p>
            </div>
          )}
          <p className="mt-6 text-xs text-slate-400">No spam. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
}
