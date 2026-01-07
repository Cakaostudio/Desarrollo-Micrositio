import React, { useEffect, useRef, useState, memo } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
}

export const TypewriterText = memo(function TypewriterText({ text, className = '' }: TypewriterTextProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const element = containerRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the element is in view
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const elementCenter = elementTop + (elementHeight / 2);
      const startPoint = windowHeight * 0.7;
      const endPoint = windowHeight * 0.3;
      
      let newProgress = 0;
      if (elementCenter > startPoint) {
        newProgress = 0;
      } else if (elementCenter < endPoint) {
        newProgress = 1;
      } else {
        newProgress = (startPoint - elementCenter) / (startPoint - endPoint);
      }
      
      // Only update if changed significantly (reduce re-renders)
      if (Math.abs(newProgress - scrollProgress) > 0.01) {
        setScrollProgress(newProgress);
      }
    };

    // Throttled scroll handler
    const throttledScroll = () => {
      if (rafRef.current) return; // Already scheduled
      
      rafRef.current = requestAnimationFrame(() => {
        handleScroll();
        rafRef.current = null;
      });
    };

    // Initial check
    handleScroll();

    // Listen to scroll on parent container
    const scrollContainer = containerRef.current?.closest('.overflow-y-auto, .stacked-cards-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', throttledScroll, { passive: true });
    }
    
    // Fallback for window scroll
    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', throttledScroll);
      }
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [scrollProgress]); // Include scrollProgress in deps for comparison

  const characters = text.split('');
  const totalChars = characters.length;

  return (
    <div ref={containerRef} className={className}>
      {characters.map((char, index) => {
        const charProgress = index / totalChars;
        const isOrange = scrollProgress > charProgress;
        
        return (
          <span
            key={index}
            className={`transition-colors duration-300 ease-out ${
              isOrange ? 'text-[#ff8012]' : 'text-[#0c4159]'
            }`}
            style={{
              transitionDelay: `${(index % 15) * 3}ms`, // Reduced for smoother performance
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
});
