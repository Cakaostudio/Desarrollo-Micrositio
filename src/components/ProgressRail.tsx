import React, { useState, useEffect } from 'react';

interface ProgressRailProps {
  sections: { id: string; label: string }[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

/**
 * Vertical progress rail for stacked card navigation
 * Shows current position and allows direct navigation
 */
export function ProgressRail({ sections, currentIndex, onNavigate }: ProgressRailProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    // Mobile: horizontal breadcrumb at top
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#0c4159]/10 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              <button
                onClick={() => onNavigate(index)}
                className={`
                  text-xs whitespace-nowrap px-3 py-1.5 rounded-full transition-all
                  ${currentIndex === index 
                    ? 'bg-[#ff8012] text-white font-bold' 
                    : 'bg-gray-100 text-[#0c4159] hover:bg-gray-200'
                  }
                `}
                aria-label={`Ir a ${section.label}`}
                aria-current={currentIndex === index ? 'true' : undefined}
              >
                {section.label}
              </button>
              {index < sections.length - 1 && (
                <span className="text-gray-300">›</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: vertical rail on right side
  return (
    <nav 
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 animate-fade-in"
      aria-label="Navegación de secciones"
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => onNavigate(index)}
          className={`
            group relative flex items-center gap-3
            transition-all duration-200
            ${currentIndex === index ? 'scale-110' : 'hover:scale-105'}
          `}
          aria-label={`Ir a ${section.label}`}
          aria-current={currentIndex === index ? 'true' : undefined}
        >
          {/* Dot indicator with number */}
          <div 
            className="progress-dot"
            data-number={index + 1}
            data-active={currentIndex === index}
            style={{
              background: currentIndex === index 
                ? 'oklch(0.65 0.25 30)' 
                : 'oklch(0.75 0.01 250)',
              boxShadow: currentIndex === index
                ? '0 0 0 4px oklch(0.65 0.25 30 / 0.15)'
                : 'none',
            }}
          />
          
          {/* Label tooltip */}
          <span 
            className={`
              absolute right-5 whitespace-nowrap px-3 py-1.5 rounded-lg
              text-xs font-['Arvo',_serif] transition-all duration-200
              ${currentIndex === index
                ? 'bg-[#ff8012] text-white opacity-100 translate-x-0'
                : 'bg-white text-[#0c4159] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 shadow-lg border border-gray-200'
              }
            `}
          >
            {section.label}
          </span>
        </button>
      ))}
      
      {/* Connection line */}
      <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-gray-200 -z-10" />
    </nav>
  );
}
