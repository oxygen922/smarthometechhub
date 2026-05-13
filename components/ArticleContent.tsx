'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ArticleContentProps {
  content: string;
}

/**
 * 自定义图片组件
 */
function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;

  // 确保图片URL包含必要的参数
  const imgUrl = src.includes('?') ? src : `${src}?w=1200&h=800&fit=crop`;

  return (
    <div className="my-8 rounded-lg overflow-hidden shadow-md">
      <img
        src={imgUrl}
        alt={alt || ''}
        className="w-full h-auto"
        loading="lazy"
      />
    </div>
  );
}

/**
 * 文章内容渲染组件
 */
export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose prose-lg max-w-none article-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => <MarkdownImage src={src} alt={alt} />,
          h1: ({ children }) => <h1 className="font-serif text-4xl font-bold text-brand-dark mt-12 mb-6">{children}</h1>,
          h2: ({ children }) => <h2 className="font-serif text-3xl font-bold text-brand-dark mt-12 mb-6">{children}</h2>,
          h3: ({ children }) => <h3 className="font-serif text-2xl font-bold text-brand-dark mt-12 mb-6">{children}</h3>,
          p: ({ children }) => <p className="mb-4 text-brand-dark leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-brand-dark">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a href={href} className="text-brand-primary hover:underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc list-inside ml-6 my-3">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside ml-6 my-3">{children}</ol>,
          li: ({ children }) => <li className="text-brand-dark">{children}</li>,
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
          tbody: ({ children }) => <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">{children}</th>,
          td: ({ children }) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
