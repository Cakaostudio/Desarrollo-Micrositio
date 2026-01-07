import React from 'react';

interface FormattedTextContentProps {
  text: string;
  className?: string;
}

export function FormattedTextContent({ text, className = '' }: FormattedTextContentProps) {
  // Detect if text contains list formatting
  const isBulletList = /^[\s]*[-*]\s+/m.test(text);
  const isNumberedList = /^[\s]*\d+\.\s+/m.test(text);
  
  if (!isBulletList && !isNumberedList) {
    // No list formatting detected - render as normal text
    return <p className={className}>{text}</p>;
  }

  // Split text into lines and process lists
  const lines = text.split('\n');
  const items: string[] = [];
  let currentItem = '';
  
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // Check if line starts a new list item
    const isBulletItem = /^[-*]\s+/.test(trimmedLine);
    const isNumberItem = /^\d+\.\s+/.test(trimmedLine);
    
    if (isBulletItem || isNumberItem) {
      // Save previous item if exists
      if (currentItem) {
        items.push(currentItem.trim());
      }
      // Start new item (remove bullet/number marker)
      currentItem = trimmedLine.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
    } else if (trimmedLine) {
      // Continuation of current item
      currentItem += (currentItem ? ' ' : '') + trimmedLine;
    }
  });
  
  // Add the last item
  if (currentItem) {
    items.push(currentItem.trim());
  }

  if (items.length === 0) {
    // Fallback to normal text if parsing failed
    return <p className={className}>{text}</p>;
  }

  // Render as list
  if (isBulletList) {
    return (
      <ul className={`space-y-4 ${className}`}>
        {items.map((item, index) => (
          <li key={index} className="flex">
            <span className="mr-4 flex-shrink-0">•</span>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    );
  } else {
    // Numbered list
    return (
      <ol className={`space-y-4 ${className}`}>
        {items.map((item, index) => (
          <li key={index} className="flex">
            <span className="mr-4 flex-shrink-0">{index + 1}.</span>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ol>
    );
  }
}
