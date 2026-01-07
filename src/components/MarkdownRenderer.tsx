import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let listItems: string[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let listCounter = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const content = currentParagraph.join(' ').trim();
        if (content) {
          elements.push(
            <p key={`p-${elements.length}`} className="mb-4 last:mb-0 leading-relaxed">
              {parseInline(content)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        const ListTag = listType === 'ol' ? 'ol' : 'ul';
        const listClass = listType === 'ol' 
          ? 'list-decimal list-outside ml-6 mb-4 space-y-2' 
          : 'list-disc list-outside ml-6 mb-4 space-y-2';
        
        elements.push(
          <ListTag key={`list-${elements.length}`} className={listClass}>
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed pl-1">
                {parseInline(item)}
              </li>
            ))}
          </ListTag>
        );
        listItems = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Empty line
      if (!trimmedLine) {
        flushParagraph();
        flushList();
        return;
      }

      // Headings
      if (trimmedLine.startsWith('### ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-bold mb-3 mt-4 first:mt-0 text-[#0c4159]">
            {parseInline(trimmedLine.slice(4))}
          </h3>
        );
        return;
      }

      if (trimmedLine.startsWith('## ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h2 key={`h2-${index}`} className="text-2xl font-bold mb-3 mt-5 first:mt-0 text-[#ff8012]">
            {parseInline(trimmedLine.slice(3))}
          </h2>
        );
        return;
      }

      if (trimmedLine.startsWith('# ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h1 key={`h1-${index}`} className="text-3xl font-bold mb-4 mt-6 first:mt-0 text-[#ff8012]">
            {parseInline(trimmedLine.slice(2))}
          </h1>
        );
        return;
      }

      // Horizontal rule
      if (trimmedLine === '---' || trimmedLine === '***') {
        flushParagraph();
        flushList();
        elements.push(<hr key={`hr-${index}`} className="my-6 border-t-2 border-gray-200" />);
        return;
      }

      // Blockquote
      if (trimmedLine.startsWith('> ')) {
        flushParagraph();
        flushList();
        elements.push(
          <blockquote key={`bq-${index}`} className="border-l-4 border-[#ff8012] pl-4 py-2 my-4 italic text-gray-700 bg-gray-50">
            {parseInline(trimmedLine.slice(2))}
          </blockquote>
        );
        return;
      }

      // Unordered list
      const ulMatch = trimmedLine.match(/^[-*+]\s+(.+)$/);
      if (ulMatch) {
        flushParagraph();
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        listItems.push(ulMatch[1]);
        return;
      }

      // Ordered list
      const olMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
      if (olMatch) {
        flushParagraph();
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
          listCounter = parseInt(olMatch[1]);
        }
        listItems.push(olMatch[2]);
        return;
      }

      // Regular paragraph
      flushList();
      currentParagraph.push(trimmedLine);
    });

    // Flush remaining content
    flushParagraph();
    flushList();

    return elements;
  };

  const parseInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold: **text**
      const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
      if (boldMatch) {
        parts.push(
          <strong key={`bold-${key++}`} className="font-bold text-[#0c4159]">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic: *text*
      const italicMatch = remaining.match(/^\*(.+?)\*/);
      if (italicMatch) {
        parts.push(
          <em key={`italic-${key++}`} className="italic text-gray-700">
            {italicMatch[1]}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Code: `text`
      const codeMatch = remaining.match(/^`(.+?)`/);
      if (codeMatch) {
        parts.push(
          <code key={`code-${key++}`} className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-[#ff8012]">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Link: [text](url)
      const linkMatch = remaining.match(/^\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={`link-${key++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff8012] underline hover:text-[#0c4159] transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Regular text
      const nextSpecialChar = remaining.search(/[\*`\[]/);
      if (nextSpecialChar === -1) {
        parts.push(remaining);
        break;
      } else {
        parts.push(remaining.slice(0, nextSpecialChar));
        remaining = remaining.slice(nextSpecialChar);
      }
    }

    return parts;
  };

  return (
    <div className={`markdown-content ${className}`}>
      {parseMarkdown(content)}
    </div>
  );
}
