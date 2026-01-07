import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={`markdown-content ${className}`}
      components={{
        // Paragraphs
        p: ({ children }) => (
          <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
        ),
        // Headings
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mb-4 mt-6 first:mt-0 text-[#ff8012]">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mb-3 mt-5 first:mt-0 text-[#ff8012]">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold mb-3 mt-4 first:mt-0 text-[#0c4159]">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-bold mb-2 mt-3 first:mt-0 text-[#0c4159]">{children}</h4>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-6 mb-4 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-6 mb-4 space-y-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed pl-1">{children}</li>
        ),
        // Emphasis
        strong: ({ children }) => (
          <strong className="font-bold text-[#0c4159]">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-700">{children}</em>
        ),
        // Code
        code: ({ children }) => (
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-[#ff8012]">
            {children}
          </code>
        ),
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-[#ff8012] pl-4 py-2 my-4 italic text-gray-700 bg-gray-50">
            {children}
          </blockquote>
        ),
        // Horizontal rule
        hr: () => (
          <hr className="my-6 border-t-2 border-gray-200" />
        ),
        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff8012] underline hover:text-[#0c4159] transition-colors"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
