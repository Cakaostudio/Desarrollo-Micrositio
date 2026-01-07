import React, { memo, useMemo } from 'react';

interface HighlightNumbersProps {
  text: string;
  className?: string;
}

export const HighlightNumbers = memo(function HighlightNumbers({ text, className = '' }: HighlightNumbersProps) {
  // Memoize expensive parsing operations
  const { isBulletList, isNumberedList, items } = useMemo(() => {
    const isBullet = /^[\s]*[-*]\s+/m.test(text);
    const isNumbered = /^[\s]*\d+\.\s+/m.test(text);
    
    // Parse list items if needed
    const parsedItems: string[] = [];
    
    if (isBullet || isNumbered) {
      const lines = text.split('\n');
      let currentItem = '';
      
      lines.forEach((line) => {
        const trimmedLine = line.trim();
        const isBulletItem = /^[-*]\s+/.test(trimmedLine);
        const isNumberItem = /^\d+\.\s+/.test(trimmedLine);
        
        if (isBulletItem || isNumberItem) {
          if (currentItem) {
            parsedItems.push(currentItem.trim());
          }
          currentItem = trimmedLine.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
        } else if (trimmedLine) {
          currentItem += (currentItem ? ' ' : '') + trimmedLine;
        }
      });
      
      if (currentItem) {
        parsedItems.push(currentItem.trim());
      }
    }
    
    return {
      isBulletList: isBullet,
      isNumberedList: isNumbered,
      items: parsedItems,
    };
  }, [text]);
  
  // Function to highlight numbers in a text string
  const highlightNumbersInText = useMemo(() => {
    return (inputText: string) => {
      const numberRegex = /(\d+(?:[.,]\d+)*(?:%)?)/g;
      const parts = inputText.split(numberRegex);
      
      return parts.map((part, index) => {
        if (part.match(numberRegex)) {
          return (
            <span key={index} className="text-[#ff8012]">
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      });
    };
  }, []);
  
  // If no list formatting, render as before
  if (!isBulletList && !isNumberedList) {
    return (
      <p className={`leading-relaxed ${className}`}>
        {highlightNumbersInText(text)}
      </p>
    );
  }
  
  if (items.length === 0) {
    return (
      <p className={`leading-relaxed ${className}`}>
        {highlightNumbersInText(text)}
      </p>
    );
  }
  
  // Render as list with number highlighting
  if (isBulletList) {
    return (
      <ul className={`space-y-4 ${className}`}>
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-4 flex-shrink-0 mt-1">•</span>
            <span className="flex-1 leading-relaxed">{highlightNumbersInText(item)}</span>
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <ol className={`space-y-4 ${className}`}>
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-4 flex-shrink-0 mt-1">{index + 1}.</span>
            <span className="flex-1 leading-relaxed">{highlightNumbersInText(item)}</span>
          </li>
        ))}
      </ol>
    );
  }
});
