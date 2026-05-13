/**
 * Article Content Component - SmartHome TechHub
 * Standardized Typography - All Inter Font Family
 */

'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ArticleContentProps {
  content: string;
}

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    <figure className="my-8">
      <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
        <Image src={src} alt={alt || ''} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
      </div>
      {alt && <figcaption className="text-center text-sm text-slate-500 mt-3">{alt}</figcaption>}
    </figure>
  );
}

export function ArticleContent({ content }: ArticleContentProps) {
  const components = {
    img: MarkdownImage as any,
    h1: ({ children }: any) => (
      <h1 className="text-h1 mb-5">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-h2 mt-10 mb-5 border-b border-slate-200 pb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-h3 mt-8 mb-4">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-h4 mt-6 mb-3">{children}</h4>
    ),
    h5: ({ children }: any) => (
      <h5 className="text-h5 mt-5 mb-3">{children}</h5>
    ),
    h6: ({ children }: any) => (
      <h6 className="text-h6 mt-4 mb-2">{children}</h6>
    ),
    p: ({ children }: any) => (
      <p className="text-body">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-brand-primary pl-6 py-2 my-8 bg-blue-50 rounded-r-xl">
        {children}
      </blockquote>
    ),
    a: ({ href, children }: any) => (
      <a href={href} className="text-brand-primary hover:text-brand-accent underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>
    ),
    ul: ({ children }: any) => <ul className="list-disc list-inside my-6 space-y-2 ml-6 text-body">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside my-6 space-y-2 ml-6 text-body">{children}</ol>,
    li: ({ children }: any) => <li className="mb-2">{children}</li>,
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-brand-accent">{children}</em>,
    code: ({ children }: any) => <code className="bg-slate-100 text-brand-accent px-2 py-0.5 rounded text-sm font-mono">{children}</code>,
    pre: ({ children }: any) => <pre className="bg-slate-100 border border-slate-200 rounded-xl p-6 my-6 overflow-x-auto text-sm font-mono">{children}</pre>,
    hr: () => <hr className="my-10 border-slate-200" />,
    table: ({ children }: any) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-body">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-blue-50 text-brand-primary text-xs uppercase tracking-wider">{children}</thead>,
    th: ({ children }: any) => <th className="px-4 py-3 text-left font-semibold">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-3 border-t border-slate-200">{children}</td>,
  };

  return (
    <div className="markdown-content article-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{content}</ReactMarkdown>
    </div>
  );
}
