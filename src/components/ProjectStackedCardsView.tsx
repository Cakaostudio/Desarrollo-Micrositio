import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Project } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TypewriterText } from './TypewriterText';
import { HighlightNumbers } from './HighlightNumbers';
import { HighlightPhrases } from './HighlightPhrases';
import { GlobalFooter } from './GlobalFooter';
import { ShareButton } from './ShareButton';
import { StackedCardSection } from './StackedCardSection';
import { ProgressRail } from './ProgressRail';
import { BreakoutImageSection } from './BreakoutImageSection';
import { ProjectHeroSection } from './ProjectHeroSection';
import { EvaluationCard } from './EvaluationCard';
import { categoryOptions, thematicAreaOptions } from '../data/projects';

interface ProjectStackedCardsViewProps {
  project: Project;
  onClose: () => void;
}

/**
 * Stacked card view for project details
 * Cards physically stack on top of each other with slide-up animations
 * Optimized for smooth 60fps scrolling performance
 * 
 * SCROLL SYNC (Mobile vs Desktop):
 * - Mobile: Progress rail/buttons sync when card TITLE appears at viewport top
 *   → Navigation scrolls to (N+1)*100vh + 48px (accounting for card padding)
 *   → Detection triggers when title reaches top (perfect sync)
 * - Desktop: Early detection at ~20% visibility for smoother UX (unchanged)
 */
export function ProjectStackedCardsView({ project, onClose }: ProjectStackedCardsViewProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(-1); // -1 means hero section
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showButtons, setShowButtons] = useState(true); // Control close/share button visibility
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastScrollTop = useRef(0);
  const lastScrollDirection = useRef<'up' | 'down' | null>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize sections to prevent recreation on every render
  const sections = useMemo(() => [
    { id: 'objective', label: 'Objetivo' },
    { id: 'beneficiaries', label: 'Beneficiarios' },
    { id: 'risk-factors', label: 'Factores de Riesgo' },
    { id: 'methodology', label: 'Metodología' },
    { id: 'results', label: 'Resultados' },
    { id: 'evaluation', label: 'Evaluación' },
    { id: 'footer', label: 'Información' },
  ], []);

  // Memoize formatted category and thematic area
  const formattedCategory = useMemo(() => {
    return categoryOptions.find(c => c.value === project.category)?.label || project.category;
  }, [project.category]);

  const formattedThematicArea = useMemo(() => {
    return thematicAreaOptions.find(t => t.value === project.thematicArea)?.label || project.thematicArea;
  }, [project.thematicArea]);

  // Optimized scroll handler using RAF for 60fps performance
  // SCROLL SYNC LOGIC:
  // - Hero: 0-100vh
  // - Card N boundary: (N+1)*100vh, but title is +48px lower on mobile
  // - Mobile: Progress rail syncs when card TITLE is at top of viewport
  // - Desktop: Early detection at ~20% visibility for smooth transitions (unchanged)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      // Cancel previous RAF if it exists
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Schedule update for next frame
      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        
        const container = containerRef.current;
        const scrollTop = container.scrollTop;
        
        // Detect scroll direction for button visibility (mobile and desktop optimized)
        const scrollDelta = scrollTop - lastScrollTop.current;
        const scrollingDown = scrollDelta > 3; // Small threshold for scroll down
        const scrollingUp = scrollDelta < -3; // Small threshold for scroll up  
        const atTop = scrollTop < 80; // Show buttons when near top (reduced threshold)
        
        // Update button visibility based on scroll direction
        if (atTop) {
          // Always show when at top
          if (!showButtons) setShowButtons(true);
          lastScrollDirection.current = null; // Reset direction at top
        } else if (scrollingDown) {
          // Scrolling down - hide buttons
          if (showButtons) setShowButtons(false);
          lastScrollDirection.current = 'down';
        } else if (scrollingUp) {
          // Scrolling up - show buttons  
          if (!showButtons) setShowButtons(true);
          lastScrollDirection.current = 'up';
        }
        
        // Always update lastScrollTop for next comparison
        lastScrollTop.current = scrollTop;
        
        const scrollHeight = container.scrollHeight - container.clientHeight;
        const viewportHeight = container.clientHeight;
        
        // Calculate overall scroll progress (0 to 1)
        const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
        setScrollProgress(progress);
        
        // Determine which card is visible based on scroll position
        // MOBILE FIX: Sync to exact START of each card
        // Hero is 100vh, Card 0 starts at 100vh, Card 1 at 200vh, etc.
        // Desktop remains unchanged with smooth early detection
        
        if (isMobile) {
          // MOBILE: Sync when card TITLE is at top of viewport
          // Cards have 48px top padding before title on mobile
          // Navigation: Scrolls to (index+1)*100vh + 48px  
          // Detection: Finds which card title is currently at top
          const titlePadding = 48; // Mobile card top padding
          
          if (scrollTop < viewportHeight) {
            // Still in hero section
            if (currentSectionIndex !== -1) {
              setCurrentSectionIndex(-1);
            }
          } else {
            // Which card has its title at the top?
            // Card 0 title at top: scrollTop = 100vh + 48px
            // Card 1 title at top: scrollTop = 200vh + 48px
            // Card N title at top: scrollTop = (N+1)*100vh + 48px
            // Solve for N: (scrollTop - 48px)/100vh - 1 = N
            const cardIndex = Math.floor((scrollTop - titlePadding) / viewportHeight) - 1;
            const newIndex = Math.max(0, Math.min(cardIndex, sections.length - 1));
            
            if (newIndex !== currentSectionIndex) {
              setCurrentSectionIndex(newIndex);
            }
          }
        } else {
          // DESKTOP: Keep existing smooth early detection (unchanged)
          if (scrollTop < viewportHeight * 0.5) {
            // Still in hero section
            if (currentSectionIndex !== -1) {
              setCurrentSectionIndex(-1);
            }
          } else {
            // In cards section - calculate which card is entering
            // Offset by 0.2vh so label changes when card is ~20% visible
            const scrollPastHero = scrollTop - (viewportHeight * 0.8);
            const cardIndex = Math.floor(scrollPastHero / viewportHeight);
            const newIndex = Math.max(0, Math.min(cardIndex, sections.length - 1));
            
            if (newIndex !== currentSectionIndex) {
              setCurrentSectionIndex(newIndex);
            }
          }
        }
      });
    };

    const container = containerRef.current;
    if (container) {
      // Use passive listener for better scroll performance
      container.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial call
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [currentSectionIndex, sections.length, showButtons, isMobile]);

  // Navigate to specific section - memoized
  const handleNavigate = useCallback((index: number) => {
    if (!containerRef.current) return;
    
    // Immediately update the current section for instant UI feedback
    setCurrentSectionIndex(index);
    
    const container = containerRef.current;
    const viewportHeight = container.clientHeight;
    
    // Calculate target scroll position
    // MOBILE FIX: Scroll so card TITLE is at top (account for padding)
    // Desktop: Small offset for better visibility (unchanged)
    // Hero is 100vh, Card 0 starts at 100vh, Card 1 at 200vh, etc.
    const titlePadding = isMobile ? 48 : 0; // Mobile has 48px top padding before title
    const targetScroll = isMobile 
      ? viewportHeight * (index + 1) + titlePadding  // Mobile: scroll past padding (100vh + 48px, 200vh + 48px...)
      : viewportHeight * (index + 1.05);             // Desktop: slight offset (105vh, 205vh, 305vh...)
    
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }, [isMobile]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Only allow keyboard navigation when in cards section (not hero)
      if (currentSectionIndex < 0) return;
      
      if (e.key === 'PageDown' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentSectionIndex < sections.length - 1) {
          handleNavigate(currentSectionIndex + 1);
        }
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentSectionIndex > 0) {
          handleNavigate(currentSectionIndex - 1);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleNavigate(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        handleNavigate(sections.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, sections.length, handleNavigate]);

  // Memoized card style calculation for performance
  const getCardStyle = useCallback((index: number) => {
    const sectionProgress = scrollProgress * sections.length;
    const cardProgress = sectionProgress - index;
    
    // Card is visible when its progress is between 0 and 1
    const isVisible = cardProgress >= 0;
    const isActive = index === currentSectionIndex;
    
    // Slide up from bottom (starts at 100% translateY, ends at 0%)
    const translateY = isVisible 
      ? Math.max(0, (1 - cardProgress) * 100) 
      : 100;
    
    // Opacity fades in as card slides up
    const opacity = isVisible 
      ? Math.min(1, cardProgress * 2) 
      : 0;
    
    // Scale slightly for depth effect
    const scale = isVisible 
      ? 0.95 + (Math.min(1, cardProgress) * 0.05)
      : 0.95;

    return {
      transform: `translate3d(0, ${translateY}%, 0) scale(${scale})`,
      opacity,
      zIndex: 10 + index,
      pointerEvents: isActive ? ('auto' as const) : ('none' as const),
      willChange: isVisible && Math.abs(cardProgress) < 2 ? 'transform, opacity' : 'auto',
    };
  }, [scrollProgress, sections.length, currentSectionIndex]);

  return (
    <div className="h-full relative bg-[#0c4159]">
      {/* Fixed UI elements - outside scroll container */}
      
      {/* Screen reader live region */}
      <div 
        id="section-live-region"
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {currentSectionIndex >= 0 
          ? `Sección activa: ${sections[currentSectionIndex].label}`
          : 'Viendo portada del proyecto'
        }
      </div>
      
      {/* Navigation buttons - Desktop only - hidden on mobile */}
      {currentSectionIndex >= 0 && !isMobile && (
        <div className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 z-50 flex gap-1 sm:gap-2 pointer-events-auto">
          <button
            onClick={() => {
              if (currentSectionIndex > 0) {
                handleNavigate(currentSectionIndex - 1);
              }
            }}
            disabled={currentSectionIndex === 0}
            className="
              px-2 py-2 sm:px-3 sm:py-2 rounded-lg
              min-w-[44px] min-h-[44px]
              bg-white/90 backdrop-blur-sm
              text-[#0c4159] text-xs font-['Arvo',_serif]
              border border-[#0c4159]/20
              hover:bg-white hover:border-[#0c4159]/40
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              shadow-sm hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-[#ff8012] focus:ring-offset-2
            "
            aria-label="Ir a la sección anterior"
          >
            <span className="hidden sm:inline">←</span> <span className="hidden xs:inline">Anterior</span>
            <span className="sm:hidden">←</span>
          </button>
          <button
            onClick={() => {
              if (currentSectionIndex < sections.length - 1) {
                handleNavigate(currentSectionIndex + 1);
              }
            }}
            disabled={currentSectionIndex === sections.length - 1}
            className="
              px-2 py-2 sm:px-3 sm:py-2 rounded-lg
              min-w-[44px] min-h-[44px]
              bg-white/90 backdrop-blur-sm
              text-[#0c4159] text-xs font-['Arvo',_serif]
              border border-[#0c4159]/20
              hover:bg-white hover:border-[#0c4159]/40
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              shadow-sm hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-[#ff8012] focus:ring-offset-2
            "
            aria-label="Ir a la sección siguiente"
          >
            <span className="hidden xs:inline">Siguiente</span> <span className="hidden sm:inline">→</span>
            <span className="sm:hidden">→</span>
          </button>
        </div>
      )}

      {/* Progress rail - Desktop only (mobile uses horizontal breadcrumb in ProgressRail component) */}
      {currentSectionIndex >= 0 && !isMobile && (
        <ProgressRail
          sections={sections}
          currentIndex={currentSectionIndex}
          onNavigate={handleNavigate}
        />
      )}

      {/* Close button - Fades on scroll - Mobile optimized - Top Left */}
      <button
        onClick={onClose}
        className={`
          fixed top-2 left-2 sm:top-4 sm:left-4 md:top-6 md:left-6 z-50 
          w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 
          rounded-full bg-white/90 backdrop-blur-sm text-[#0c4159] 
          hover:bg-white active:scale-95 
          transition-all duration-300 ease-in-out
          shadow-lg hover:shadow-xl 
          flex items-center justify-center group pointer-events-auto
          ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}
        aria-label="Cerrar vista de proyecto"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:scale-110"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Share button - Fades on scroll - Mobile optimized - Top Right */}
      <div className={`
        fixed top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-50
        transition-all duration-300 ease-in-out
        ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
      `}>
        <ShareButton project={project} variant="hero" />
      </div>

      {/* Scrolling container */}
      <div 
        ref={containerRef}
        className={`h-full overflow-y-auto ${isMobile ? 'stacked-cards-container-mobile' : 'stacked-cards-container'}`}
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Hero Section - Full viewport height */}
        <ProjectHeroSection project={project} onClose={onClose} />

        {/* MOBILE: Render cards as normal scrolling flow (no sticky/absolute positioning) */}
        {/* DESKTOP: Use scroll spacer with sticky/absolute positioning */}
        {isMobile ? (
          <div className="bg-[#0c4159]">
            {/* Mobile: Cards stack naturally with consistent spacing */}
            
            {/* Card 0: Objective */}
            <StackedCardSection
              id="objective"
              index={0}
              title="Objetivo Principal"
              bgColor="bg-white"
              aria-label="Objetivo principal del proyecto"
              polished={true}
            >
              <div className="px-8 md:px-12 py-8" style={{ '--card-index': 0 } as React.CSSProperties}>
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Desktop title - Hidden on mobile (mobile gets title from StackedCardSection) */}
                  <div className="hidden lg:block font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-8 font-bold">
                    Objetivo
                  </div>
                  
                  <TypewriterText text={project.objective} className="text-xl md:text-2xl lg:text-3xl" />
                  
                  {/* Project metadata grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-[#0c4159]/10">
                    <div>
                      <div className="text-xs text-[#0c4159]/60 mb-1 uppercase tracking-wide">Categoría</div>
                      <div className="text-[#0c4159] font-['Arvo',_serif]">
                        {formattedCategory}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#0c4159]/60 mb-1 uppercase tracking-wide">Ámbito Temático</div>
                      <div className="text-[#0c4159] font-['Arvo',_serif]">
                        {formattedThematicArea}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#0c4159]/60 mb-1 uppercase tracking-wide">Ubicación</div>
                      <div className="text-[#0c4159] font-['Arvo',_serif]">
                        {project.isNationalProject ? '🇲🇽 Impacto Nacional' : project.municipality}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#0c4159]/60 mb-1 uppercase tracking-wide">Organización</div>
                      <div className="text-[#0c4159] font-['Arvo',_serif]">{project.organization}</div>
                    </div>
                  </div>
                </div>
              </div>
            </StackedCardSection>

            {/* Card 1: Beneficiaries */}
            <div style={{ '--card-index': 1 } as React.CSSProperties}>
              <StackedCardSection
                id="beneficiaries"
                index={1}
                title="Beneficiarios"
                bgColor="bg-[#fafafa]"
                aria-label="Beneficiarios y participantes del proyecto"
                polished={true}
                fullBleed={true}
              >
                <BreakoutImageSection
                  imageUrl={project.beneficiariesImageUrl || project.imageUrl}
                  imageAlt="Beneficiarios del proyecto"
                  imagePosition="right"
                  mobileTitle="Beneficiarios"
                  title="Beneficiarios"
                >
                  <HighlightNumbers text={project.beneficiaries} />
                </BreakoutImageSection>
              </StackedCardSection>
            </div>

            {/* Card 2: Risk Factors */}
            {project.riskFactors && (
              <div style={{ '--card-index': 2 } as React.CSSProperties}>
                <StackedCardSection
                  id="risk-factors"
                  index={2}
                  title="Factores de Riesgo"
                  bgColor="bg-white"
                  aria-label="Factores de riesgo identificados"
                  polished={true}
                  fullBleed={true}
                >
                  <BreakoutImageSection
                    imageUrl={project.riskFactorsImageUrl || project.imageUrl}
                    imageAlt="Factores de riesgo"
                    imageSide="right"
                    mobileTitle="Factores de Riesgo"
                    title="Factores de Riesgo"
                  >
                    <HighlightPhrases text={project.riskFactors} />
                  </BreakoutImageSection>
                </StackedCardSection>
              </div>
            )}

            {/* Card 3: Methodology */}
            {project.methodology && (
              <div style={{ '--card-index': 3 } as React.CSSProperties}>
                <StackedCardSection
                  id="methodology"
                  index={3}
                  title="Metodología"
                  bgColor="bg-[#fafafa]"
                  aria-label="Metodología del proyecto"
                  polished={true}
                  fullBleed={true}
                >
                  <BreakoutImageSection
                    imageUrl={project.methodologyImageUrl || project.imageUrl}
                    imageAlt="Metodología del proyecto"
                    imageSide="left"
                    mobileTitle="Metodología"
                    title="Metodología"
                  >
                    <HighlightPhrases text={project.methodology} />
                  </BreakoutImageSection>
                </StackedCardSection>
              </div>
            )}

            {/* Card 4: Results */}
            <div style={{ '--card-index': 4 } as React.CSSProperties}>
              <StackedCardSection
                id="results"
                index={4}
                title="Resultados Principales"
                bgColor="bg-white"
                aria-label="Resultados principales del proyecto"
                polished={true}
                fullBleed={true}
              >
                <BreakoutImageSection
                  imageUrl={project.resultsImageUrl || project.imageUrl}
                  imageAlt="Resultados del proyecto"
                  imageSide="right"
                  mobileTitle="Resultados Principales"
                  title="Resultados"
                >
                  <HighlightNumbers text={project.results} />
                </BreakoutImageSection>
              </StackedCardSection>
            </div>

            {/* Card 5: Evaluation */}
            {project.evaluationCriteriaHighlights && (
              <div style={{ '--card-index': 5 } as React.CSSProperties}>
                <StackedCardSection
                  id="evaluation"
                  index={5}
                  title="Evaluación"
                  bgColor="bg-[#f5f5f5]"
                  aria-label="Criterios de evaluación del proyecto"
                  polished={true}
                >
                  <EvaluationCard project={project} />
                </StackedCardSection>
              </div>
            )}

            {/* Card 6: Footer/Contact */}
            <div style={{ '--card-index': 6 } as React.CSSProperties} className="pb-16 lg:pb-0">
              <StackedCardSection
                id="footer"
                index={6}
                title="Información de Contacto"
                bgColor="bg-white"
                aria-label="Información de contacto del proyecto"
                polished={true}
              >
                <GlobalFooter project={project} />
              </StackedCardSection>
            </div>
          </div>
        ) : (
          // Desktop: Original scroll spacer with sticky/absolute positioning
          <>
        {/* Scroll spacer to enable scroll-driven animation */}
        <div style={{ height: `${sections.length * 100}vh` }}>
        {/* Stacked cards container - all cards positioned absolutely */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* All cards render in the same position, stacking on top of each other */}
          
          {/* Card 0: Objective */}
          <div
            className="absolute inset-0 w-full h-full"
            style={getCardStyle(0)}
          >
            <StackedCardSection
              id="objective"
              index={0}
              title="Objetivo Principal"
              bgColor="bg-white"
              aria-label="Objetivo principal del proyecto"
              polished={true}
            >
              <div className="px-8 md:px-12 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Desktop title - Hidden on mobile (mobile gets title from StackedCardSection) */}
                  <div className="hidden lg:block font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-8 font-bold">
                    Objetivo
                  </div>
                  
                  <TypewriterText text={project.objective} className="text-xl md:text-2xl lg:text-3xl" />
                  
                  {/* Project metadata grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-[#0c4159]/10">
                    <div>
                      <div className="text-xs text-[#0c4159]/60 mb-1 uppercase tracking-wide">Categoría</div>
                      <div className="text-[#0c4159] font-['Arvo',_serif]">
                        {formattedCategory}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#0c4159]/60 mb-1 uppercase tracking-wide">Ámbito Temático</div>
                      <div className="text-[#0c4159] font-['Arvo',_serif]">
                        {formattedThematicArea}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#0c4159]/60 mb-1 uppercase tracking-wide">Ubicación</div>
                      <div className="text-[#0c4159] font-['Arvo',_serif]">
                        {project.isNationalProject ? '🇲🇽 Impacto Nacional' : project.municipality}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#0c4159]/60 mb-1 uppercase tracking-wide">Organización</div>
                      <div className="text-[#0c4159] font-['Arvo',_serif]">{project.organization}</div>
                    </div>
                  </div>
                </div>
              </div>
            </StackedCardSection>
          </div>

          {/* Card 1: Beneficiaries */}
          <div
            className="absolute inset-0 w-full h-full"
            style={getCardStyle(1)}
          >
            <StackedCardSection
              id="beneficiaries"
              index={1}
              title="Beneficiarios"
              bgColor="bg-[#fafafa]"
              aria-label="Beneficiarios y participantes del proyecto"
              polished={true}
              fullBleed={true}
            >
              <BreakoutImageSection
                imageUrl={project.beneficiariesImageUrl || project.imageUrl}
                imageAlt="Beneficiarios del proyecto"
                imagePosition="right"
                mobileTitle="Beneficiarios"
                title="Beneficiarios"
              >
                <HighlightNumbers text={project.beneficiaries} />
              </BreakoutImageSection>
            </StackedCardSection>
          </div>

          {/* Card 2: Risk Factors */}
          {project.riskFactors && (
            <div
              className="absolute inset-0 w-full h-full"
              style={getCardStyle(2)}
            >
              <StackedCardSection
                id="risk-factors"
                index={2}
                title="Factores de Riesgo"
                bgColor="bg-white"
                aria-label="Factores de riesgo identificados"
                polished={true}
                fullBleed={true}
              >
                <BreakoutImageSection
                  imageUrl={project.riskFactorsImageUrl || project.imageUrl}
                  imageAlt="Factores de riesgo"
                  imageSide="right"
                  mobileTitle="Factores de Riesgo"
                  title="Factores de Riesgo"
                >
                  <HighlightPhrases text={project.riskFactors} />
                </BreakoutImageSection>
              </StackedCardSection>
            </div>
          )}

          {/* Card 3: Methodology */}
          {project.methodology && (
            <div
              className="absolute inset-0 w-full h-full"
              style={getCardStyle(3)}
            >
              <StackedCardSection
                id="methodology"
                index={3}
                title="Metodología"
                bgColor="bg-[#fafafa]"
                aria-label="Metodología del proyecto"
                polished={true}
                fullBleed={true}
              >
                <BreakoutImageSection
                  imageUrl={project.methodologyImageUrl || project.imageUrl}
                  imageAlt="Metodología del proyecto"
                  imageSide="left"
                  mobileTitle="Metodología"
                  title="Metodología"
                >
                  <HighlightPhrases text={project.methodology} />
                </BreakoutImageSection>
              </StackedCardSection>
            </div>
          )}

          {/* Card 4: Results */}
          <div
            className="absolute inset-0 w-full h-full"
            style={getCardStyle(4)}
          >
            <StackedCardSection
              id="results"
              index={4}
              title="Resultados Principales"
              bgColor="bg-white"
              aria-label="Resultados principales del proyecto"
              polished={true}
              fullBleed={true}
            >
              <BreakoutImageSection
                imageUrl={project.resultsImageUrl || project.imageUrl}
                imageAlt="Resultados del proyecto"
                imageSide="right"
                mobileTitle="Resultados Principales"
                title="Resultados"
              >
                <HighlightNumbers text={project.results} />
              </BreakoutImageSection>
            </StackedCardSection>
          </div>

          {/* Card 5: Evaluation */}
          {project.evaluationCriteriaHighlights && (
            <div
              className="absolute inset-0 w-full h-full"
              style={getCardStyle(5)}
            >
              <StackedCardSection
                id="evaluation"
                index={5}
                title="Evaluación"
                bgColor="bg-[#f5f5f5]"
                aria-label="Criterios de evaluación del proyecto"
                polished={true}
              >
                <EvaluationCard project={project} />
              </StackedCardSection>
            </div>
          )}

          {/* Card 6: Footer/Contact */}
          <div
            className="absolute inset-0 w-full h-full"
            style={getCardStyle(6)}
          >
            <StackedCardSection
              id="footer"
              index={6}
              title="Información de Contacto"
              bgColor="bg-white"
              aria-label="Información de contacto del proyecto"
              polished={true}
            >
              <GlobalFooter project={project} />
            </StackedCardSection>
          </div>
          
        </div>
        </div>
          </>
        )}
      </div>
      {/* End scrolling container */}
      
    </div>
  );
}