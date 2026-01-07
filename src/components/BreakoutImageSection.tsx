import React, { ReactNode, useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BreakoutImageSectionProps {
  imageUrl: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  imageSide?: 'left' | 'right'; // Alias for imagePosition
  children: ReactNode;
  className?: string;
  mobileTitle?: string; // Optional title to show on mobile only
  title?: string; // Title to show on both desktop and mobile
}

/**
 * Breakout image section with edge-to-edge image layout
 * Images extend from center content area to the card edge
 */
export function BreakoutImageSection({
  imageUrl,
  imageAlt,
  imagePosition,
  imageSide,
  children,
  className = '',
  mobileTitle,
  title,
}: BreakoutImageSectionProps) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  
  // Support both imagePosition and imageSide props
  const position = imagePosition || imageSide || 'left';

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Passive event listener for better scroll performance
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`breakout-section ${isDesktop ? 'h-full flex flex-row' : 'h-full flex flex-col'} w-full ${className}`}>
      {position === 'left' ? (
        // Left-side image layout
        <>
          {isDesktop ? (
            // Desktop layout - side by side
            <>
              {/* Image container - half width */}
              <div className="relative w-1/2 h-full overflow-hidden flex-shrink-0">
                <div 
                  className="breakout-image-mask absolute inset-0 bg-[#3d3d3d]"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)',
                  }}
                >
                  <div className="breakout-image-hover w-full h-full">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content container */}
              <div className="breakout-content-scroll relative w-1/2 flex items-start overflow-y-auto bg-transparent min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="w-full pl-16 pr-8 py-16 xl:py-20">
                  {/* Desktop title */}
                  {title && (
                    <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-8 font-bold">
                      {title}
                    </div>
                  )}
                  {children}
                </div>
              </div>
            </>
          ) : (
            // Mobile layout - stacked, image fills to bottom
            <>
              {/* Mobile title (optional) */}
              {mobileTitle && (
                <div className="w-full px-5 pt-6 pb-2 flex-shrink-0">
                  <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] leading-none font-bold">
                    {mobileTitle}
                  </div>
                </div>
              )}
              
              {/* Content container - balanced spacing */}
              <div className={`w-full px-5 ${mobileTitle ? 'pt-3 pb-5' : 'pt-6 pb-5'} bg-white flex-shrink-0`}>
                {children}
              </div>

              {/* Image container - FILLS ALL REMAINING SPACE TO BOTTOM */}
              <div className="w-full flex-1 min-h-0 relative">
                <ImageWithFallback
                  src={imageUrl}
                  alt={imageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </>
          )}
        </>
      ) : (
        // Right-side image layout
        <>
          {isDesktop ? (
            // Desktop layout - side by side
            <>
              {/* Content container */}
              <div className="breakout-content-scroll relative w-1/2 flex items-start overflow-y-auto bg-transparent min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="w-full pr-16 pl-8 py-16 xl:py-20">
                  {/* Desktop title */}
                  {title && (
                    <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-8 font-bold">
                      {title}
                    </div>
                  )}
                  {children}
                </div>
              </div>

              {/* Image container - half width */}
              <div className="relative w-1/2 h-full overflow-hidden flex-shrink-0">
                <div 
                  className="breakout-image-mask absolute inset-0 bg-[#3d3d3d]"
                  style={{
                    clipPath: 'polygon(40px 0, 100% 0, 100% 100%, 0 100%)',
                  }}
                >
                  <div className="breakout-image-hover w-full h-full">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Mobile layout - stacked, image fills to bottom
            <>
              {/* Mobile title (optional) */}
              {mobileTitle && (
                <div className="w-full px-5 pt-6 pb-2 flex-shrink-0">
                  <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] leading-none font-bold">
                    {mobileTitle}
                  </div>
                </div>
              )}
              
              {/* Content container - balanced spacing */}
              <div className={`w-full px-5 ${mobileTitle ? 'pt-3 pb-5' : 'pt-6 pb-5'} bg-white flex-shrink-0`}>
                {children}
              </div>

              {/* Image container - FILLS ALL REMAINING SPACE TO BOTTOM */}
              <div className="w-full flex-1 min-h-0 relative">
                <ImageWithFallback
                  src={imageUrl}
                  alt={imageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}