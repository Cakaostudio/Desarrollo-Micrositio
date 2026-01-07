import React, { memo, useMemo } from 'react';

interface HighlightPhrasesProps {
  text: string;
  className?: string;
  secondaryText?: string;
  secondaryClassName?: string;
  title?: string;
}

export const HighlightPhrases = memo(function HighlightPhrases({ 
  text, 
  className = '', 
  secondaryText,
  secondaryClassName = '',
  title
}: HighlightPhrasesProps) {
  // Mexican states for location detection (memoized constant)
  const mexicanStates = useMemo(() => [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 
    'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato', 
    'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos', 
    'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 
    'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 
    'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas', 'Ciudad de México', 'CDMX'
  ], []);

  // Memoize the text processing function
  const processText = useMemo(() => {
    return (inputText: string) => {
      // First, handle manual [highlight] markers
      let processedText = inputText;
      const manualHighlights: Array<{ start: number; end: number; text: string }> = [];
      
      const manualRegex = /\[highlight\](.*?)\[\/highlight\]/g;
      let match;
      while ((match = manualRegex.exec(inputText)) !== null) {
        manualHighlights.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[1]
        });
      }

      // Remove manual markers but remember positions
      processedText = processedText.replace(/\[highlight\]|\[\/highlight\]/g, '');

      // Create segments for highlighting
      const segments: Array<{ text: string; highlight: boolean }> = [];
      let currentIndex = 0;

      // Auto-detect patterns (numbers, percentages, locations)
      const patterns = [
        /\b\d{1,3}(,\d{3})*(\.\d+)?\b/g,
        /\b\d+(\.\d+)?%/g,
        new RegExp(`\\b(${mexicanStates.join('|')})\\b`, 'gi'),
        /\b(municipio|estado|ciudad|zona|región|localidad|comunidad)\s+de\s+\w+/gi,
        /\b(municipios?|ciudades?|estados?|zonas?|regiones?)\s+\w+/gi
      ];

      // Combine all matches
      const allMatches: Array<{ start: number; end: number; text: string }> = [];

      patterns.forEach(pattern => {
        let match;
        const regex = new RegExp(pattern);
        const text = processedText;
        
        while ((match = regex.exec(text)) !== null) {
          allMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0]
          });
        }
      });

      // Add manual highlights (adjust positions after removing markers)
      let offset = 0;
      manualHighlights.forEach(highlight => {
        const adjustedStart = highlight.start - offset;
        allMatches.push({
          start: adjustedStart,
          end: adjustedStart + highlight.text.length,
          text: highlight.text
        });
        offset += '[highlight]'.length + '[/highlight]'.length;
      });

      // Sort matches by start position and remove overlaps
      allMatches.sort((a, b) => a.start - b.start);
      const uniqueMatches: Array<{ start: number; end: number; text: string }> = [];
      
      allMatches.forEach(match => {
        if (uniqueMatches.length === 0 || match.start >= uniqueMatches[uniqueMatches.length - 1].end) {
          uniqueMatches.push(match);
        }
      });

      // Build segments
      currentIndex = 0;
      uniqueMatches.forEach(match => {
        if (match.start > currentIndex) {
          segments.push({
            text: processedText.substring(currentIndex, match.start),
            highlight: false
          });
        }
        segments.push({
          text: match.text,
          highlight: true
        });
        currentIndex = match.end;
      });

      if (currentIndex < processedText.length) {
        segments.push({
          text: processedText.substring(currentIndex),
          highlight: false
        });
      }

      return segments;
    };
  }, [mexicanStates]);

  // Memoize list detection and parsing
  const { isBulletList, isNumberedList, items } = useMemo(() => {
    const isBullet = /^[\s]*[-*]\s+/m.test(text);
    const isNumbered = /^[\s]*\d+\.\s+/m.test(text);
    
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
  
  // Function to render highlighted segments
  const renderSegments = (segments: Array<{ text: string; highlight: boolean }>) => {
    return segments.map((segment, index) => (
      segment.highlight ? (
        <span key={index} className="text-[#ff8012]">
          {segment.text}
        </span>
      ) : (
        <span key={index}>{segment.text}</span>
      )
    ));
  };
  
  // If text contains lists, render as list
  if ((isBulletList || isNumberedList) && items.length > 0) {
    const ListTag = isBulletList ? 'ul' : 'ol';
    
    return (
      <div>
        {title && (
          <h3 className="text-[#0c4159] mb-6 font-['Arvo',_serif] tracking-wide">
            {title}
          </h3>
        )}

        <ListTag className={`space-y-4 ${className}`}>
          {items.map((item, index) => {
            const itemSegments = processText(item);
            return (
              <li key={index} className="flex items-start">
                <span className="mr-4 flex-shrink-0 mt-1">
                  {isBulletList ? '•' : `${index + 1}.`}
                </span>
                <span className="flex-1 leading-relaxed">
                  {renderSegments(itemSegments)}
                </span>
              </li>
            );
          })}
        </ListTag>
        
        {secondaryText && (
          <p className={`mt-[30px] ${secondaryClassName}`}>
            {secondaryText}
          </p>
        )}
      </div>
    );
  }
  
  // Default rendering for non-list text
  const segments = processText(text);
  
  return (
    <div>
      {title && (
        <h3 className="text-[#0c4159] mb-6 font-['Arvo',_serif] tracking-wide">
          {title}
        </h3>
      )}
      <p className={`leading-relaxed ${className}`}>
        {renderSegments(segments)}
      </p>
      
      {secondaryText && (
        <p className={`mt-[30px] leading-relaxed ${secondaryClassName}`}>
          {secondaryText}
        </p>
      )}
    </div>
  );
});
