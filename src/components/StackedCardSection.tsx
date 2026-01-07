import React, { ReactNode, useEffect, useRef, useState, memo } from 'react';
import { 
  FileText, 
  Users, 
  AlertTriangle, 
  Wrench, 
  TrendingUp, 
  Award, 
  Info 
} from 'lucide-react';

interface StackedCardSectionProps {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
  bgColor?: string;
  'aria-label': string;
  polished?: boolean; // Feature flag for premium polish
  fullBleed?: boolean; // Allow content to extend to card edges
}

// Icon mapping for each section
const sectionIcons: Record<string, React.ReactNode> = {
  'objective': <FileText className="card-tab-icon" />,
  'beneficiaries': <Users className="card-tab-icon" />,
  'risk-factors': <AlertTriangle className="card-tab-icon" />,
  'methodology': <Wrench className="card-tab-icon" />,
  'results': <TrendingUp className="card-tab-icon" />,
  'evaluation': <Award className="card-tab-icon" />,
  'footer': <Info className="card-tab-icon" />,
};

// Gradient mapping for sections
const gradientMap: Record<string, string> = {
  'bg-white': 'var(--gradient-white)',
  'bg-[#fafafa]': 'var(--gradient-gray)',
  'bg-[#f5f5f5]': 'var(--gradient-soft)',
};

// Tab label mapping
const tabLabels: Record<string, string> = {
  'objective': 'Objetivo',
  'beneficiaries': 'Beneficiarios',
  'risk-factors': 'Riesgos',
  'methodology': 'Metodología',
  'results': 'Resultados',
  'evaluation': 'Evaluación',
  'footer': 'Contacto',
};

/**
 * Premium stacked card section component
 * Features: refined styling, tab labels, parallax, optimized performance
 * Memoized to prevent unnecessary re-renders
 */
export const StackedCardSection = memo(function StackedCardSection({ 
  id, 
  index, 
  title, 
  children, 
  bgColor = 'bg-white',
  'aria-label': ariaLabel,
  polished = true, // Enable premium features by default
  fullBleed = false, // Allow edge-to-edge content
}: StackedCardSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [cardState, setCardState] = useState<'inactive' | 'near' | 'active' | 'hovered' | 'leaving'>('inactive');
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // For mobile scroll animation
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };
    
    checkMobile();
    // Passive event listener for better performance
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Mobile scroll-triggered animation with Intersection Observer
  useEffect(() => {
    if (!isMobile || !sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Card becomes visible when 20% is in viewport
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            setIsVisible(true);
            // Once visible, stop observing to keep it visible
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: [0, 0.2, 0.5],
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before reaching viewport
      }
    );
    
    observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, [isMobile]);
  
  // Calculate safe top position
  const safeTop = isMobile ? 56 : 60;
  
  // Get gradient for this section
  const gradient = gradientMap[bgColor] || gradientMap['bg-white'];
  
  // Tab color based on background
  const tabBgColor = bgColor === 'bg-white' 
    ? 'rgba(250, 250, 252, 0.95)' 
    : bgColor === 'bg-[#fafafa]'
    ? 'rgba(245, 245, 247, 0.95)'
    : 'rgba(240, 240, 242, 0.95)';
  
  const tabTextColor = 'oklch(0.35 0.05 250)';
  
  useEffect(() => {
    if (!polished || !sectionRef.current) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0, 0.5, 1], // Reduced thresholds for better performance
    };
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ratio = entry.intersectionRatio;
          
          if (ratio > 0.7) {
            setCardState('active');
          } else if (ratio > 0.3) {
            setCardState('near');
          } else {
            setCardState('inactive');
          }
          
          // Simplified parallax for better performance
          if (polished && ratio > 0.2) {
            const scrollProgress = entry.intersectionRatio;
            const maxParallax = 2; // Reduced for smoother performance
            const offset = (scrollProgress - 0.5) * maxParallax * 2;
            setParallaxOffset(Math.max(-maxParallax, Math.min(maxParallax, offset)));
          }
        } else {
          setCardState('leaving');
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, [polished]);
  
  // Hover detection
  const handleMouseEnter = () => {
    if (polished && cardState !== 'active') {
      setCardState('hovered');
    }
  };
  
  const handleMouseLeave = () => {
    if (polished && cardState === 'hovered') {
      setCardState('near');
    }
  };
  
  const handleTabClick = () => {
    // Calculate the target scroll position for this section
    // Based on the new stacking system where scroll drives card visibility
    const container = document.querySelector('.overflow-y-auto');
    if (container && container.scrollHeight) {
      const scrollHeight = container.scrollHeight - container.clientHeight;
      // Each section occupies an equal portion of scroll space
      const targetScroll = (index / 7) * scrollHeight; // 7 total sections
      
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section
      ref={sectionRef}
      id={id}
      data-card={id}
      data-index={index}
      data-state={cardState}
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`stacked-card ${isMobile && isVisible ? 'card-visible' : ''} w-full ${fullBleed && isMobile ? 'h-full' : 'h-auto lg:h-full'} ${polished ? '' : bgColor}`}
      style={{
        borderRadius: 'var(--radius-card)',
        background: polished ? gradient : undefined,
        // @ts-ignore
        '--parallax-offset': `${parallaxOffset}px`,
        // On mobile fullBleed, FORCE full height (100% of parent h-screen container)
        height: isMobile && fullBleed ? '100%' : undefined,
        minHeight: isMobile && !fullBleed ? 'auto' : '100%',
        // Clip content to card border radius
        overflow: 'hidden',
        // Ensure flex display for fullBleed mobile
        display: fullBleed && isMobile ? 'flex' : undefined,
        flexDirection: fullBleed && isMobile ? 'column' : undefined,
      }}
    >
      {/* Parallax background layer */}
      {polished && (
        <div 
          className="card-bg-parallax"
          style={{
            // @ts-ignore
            '--card-gradient': gradient,
          }}
        />
      )}
      
      {/* Inner stroke for premium feel */}
      {polished && (
        <div className="card-inner-stroke" />
      )}
      
      {/* Premium tab with label and icon - stacked horizontally - Hidden on small mobile */}
      {polished && !isSmallMobile && (
        <div 
          className="card-tab"
          data-active={cardState === 'active'}
          data-index={index}
          onClick={handleTabClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTabClick();
            }
          }}
          aria-label={`Ir a sección: ${tabLabels[id] || title}`}
          style={{
            background: tabBgColor,
            color: tabTextColor,
            // Stack tabs horizontally - position depends on screen size
            left: isMobile
              ? `calc(72px + ${index * 110}px)` // Mobile: start at 72px (well after close button)
              : `calc(80px + ${index * 170}px)`, // Desktop: start at 80px
            zIndex: 100 + index, // Higher z-index for later tabs
            // @ts-ignore
            '--data-index': index, // For responsive CSS
          }}
        >
          {sectionIcons[id]}
          <span className="flex-shrink-0">{tabLabels[id] || title}</span>
        </div>
      )}
      
      {/* Card content with optimized rhythm - Mobile responsive */}
      <div 
        className={`${fullBleed && isMobile ? 'h-full flex flex-col' : isMobile ? 'h-auto' : 'h-full'} relative z-10 ${fullBleed ? '' : isMobile ? '' : 'overflow-y-auto'}`}
        style={{
          // Use individual padding properties to avoid mixing shorthand and non-shorthand
          paddingTop: fullBleed
            ? '0'
            : polished && !isMobile
            ? 'calc(var(--grid-unit) * 10)' // Desktop: larger top padding
            : polished && isMobile
            ? 'calc(var(--grid-unit) * 6)' // Mobile: smaller top padding
            : 'calc(var(--grid-unit) * 8)', // Non-polished default
          paddingBottom: fullBleed
            ? '0'
            : polished
            ? isMobile
              ? 'calc(var(--grid-unit) * 6)' // Mobile: tighter padding
              : 'calc(var(--grid-unit) * 8)' // Desktop: normal padding
            : 'calc(var(--grid-unit) * 8)', // Non-polished default
          paddingLeft: fullBleed
            ? '0'
            : polished && !isMobile
            ? 'calc(var(--grid-unit) * 6)' // Desktop: larger side padding
            : polished && isMobile
            ? 'calc(var(--grid-unit) * 2)' // Mobile: minimal side padding
            : 'calc(var(--grid-unit) * 3)', // Non-polished default
          paddingRight: fullBleed
            ? '0'
            : polished && !isMobile
            ? 'calc(var(--grid-unit) * 6)' // Desktop: larger side padding
            : polished && isMobile
            ? 'calc(var(--grid-unit) * 2)' // Mobile: minimal side padding
            : 'calc(var(--grid-unit) * 3)', // Non-polished default
          // Enable smooth scrolling on the content
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Section heading - show on mobile when polished, always hide on desktop with tabs */}
        {(isMobile && polished && !fullBleed) || (!polished && !fullBleed) ? (
          <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] leading-none font-bold mb-4 sm:mb-6">
            {title}
          </div>
        ) : null}
        
        {/* Section content with max line-length */}
        <div 
          className={fullBleed ? (isMobile ? "w-full h-full flex flex-col" : "w-full h-full relative") : polished ? "mx-auto w-full" : "max-w-[980px] mx-auto"}
          style={{
            marginTop: polished && !fullBleed ? 'calc(var(--grid-unit) * 2)' : fullBleed ? 0 : undefined,
            marginBottom: fullBleed ? 0 : undefined,
            maxWidth: !fullBleed && polished ? '980px' : undefined,
            minHeight: fullBleed && isMobile ? 0 : undefined, // Prevent flex overflow
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
});