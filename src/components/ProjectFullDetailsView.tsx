import React from 'react';
import { Project } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TypewriterText } from './TypewriterText';
import { HighlightNumbers } from './HighlightNumbers';
import { HighlightPhrases } from './HighlightPhrases';
import { MarkdownRenderer } from './MarkdownRenderer';
import { GlobalFooter } from './GlobalFooter';
import { ShareButton } from './ShareButton';
import { thematicAreaOptions } from '../data/projects';

interface ProjectFullDetailsViewProps {
  project: Project;
  onClose: () => void;
}

function Group44({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute h-[10px] left-[29px] top-[26px] w-[8px] cursor-pointer z-50 group"
      aria-label="Volver al mapa"
    >
      <div className="absolute bottom-0 left-[-8.84%] right-[-7.81%] top-[-7.07%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 11">
          <g id="Group 44">
            <line 
              id="Line 19" 
              stroke="#0C4159" 
              className="group-hover:stroke-[#ff8012] transition-colors" 
              transform="matrix(0.82137 -0.570396 0.707107 0.707107 1 6.55554)" 
              x2="9.73983" 
              y1="-0.5" 
              y2="-0.5" 
            />
            <line 
              id="Line 20" 
              stroke="#0C4159" 
              className="group-hover:stroke-[#ff8012] transition-colors" 
              transform="matrix(0.874157 0.485643 -0.624695 0.780869 1 6.55554)" 
              x2="9.15167" 
              y1="-0.5" 
              y2="-0.5" 
            />
          </g>
        </svg>
      </div>
    </button>
  );
}

export function ProjectFullDetailsView({ project, onClose }: ProjectFullDetailsViewProps) {
  // Parse evaluation criteria
  const evaluationCriteria = project.evaluationCriteriaHighlights
    ? project.evaluationCriteriaHighlights.split(';').map(c => c.trim())
    : [];

  // Get the full label for thematic area
  const thematicAreaLabel = thematicAreaOptions.find(t => t.value === project.thematicArea)?.label || project.thematicArea;

  return (
    <div className="bg-white w-full" data-name="Desktop - 18">
      
      {/* Dynamic Header Section - Hero Image and Metadata Bar - Mobile Optimized */}
      <div className="relative w-full">
        {/* Top Navigation Bar - Fixed Position - Mobile optimized */}
        <div className="absolute top-3 sm:top-[21px] left-0 right-0 z-50 px-3 sm:px-[20px] flex justify-end items-center">
          {/* Share button */}
          <ShareButton 
            title={project.name}
            text={`Mira este proyecto social: ${project.name}`}
            variant="ghost"
            size="sm"
            className="text-[#0c4159] hover:text-[#ff8012] hover:bg-transparent h-7 sm:h-8 px-2 sm:px-3"
          />
        </div>

        {/* Content Flow - Vertical Stack - Mobile optimized */}
        <div className="flex flex-col">
          {/* Spacer for top navigation - Responsive */}
          <div className="h-20 sm:h-[155px]" />

          {/* Project title - Dynamic Height - Mobile responsive */}
          <div className="px-4 sm:px-[20px] mb-8 sm:mb-[58px]">
            <p className="font-['Arvo',_serif] min-h-[40px] leading-tight text-[#0c4159] text-2xl sm:text-3xl md:text-[40px] max-w-[900px]">
              {project.name}
            </p>
          </div>

          {/* Hero Image Container - Mobile optimized height */}
          <div className="w-full">
            {/* Main project image - Responsive height */}
            <div className="bg-neutral-600 h-64 sm:h-96 md:h-[500px] lg:h-[713px] w-full overflow-hidden">
              {project.imageUrl && (
                <ImageWithFallback
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Metadata Bar - Positioned below image - Mobile optimized grid layout */}
          <div className="w-full px-4 sm:px-[20px] py-6 sm:py-[28px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* ÁMBITO TEMÁTICO label */}
              <div className="font-['Arvo',_serif] text-[#0c4159] text-[11px] sm:text-[12px]">
                <span className="block mb-1 font-bold">ÁMBITO TEMÁTICO.</span>
                <span className="block text-sm sm:text-[14px]">{thematicAreaLabel}</span>
              </div>

              {/* ESTADO / MUNICIPIO label */}
              <div className="font-['Arvo',_serif] text-[#0c4159] text-[11px] sm:text-[12px]">
                <span className="block mb-1 font-bold">UBICACIÓN.</span>
                <span className="block text-sm sm:text-[14px]">{project.state}</span>
                <span className="block text-sm sm:text-[14px]">{project.municipality}</span>
                {project.isNationalProject ? (
                  <>
                    <span className="block mt-2 mb-0.5 text-[10px] sm:text-[11px] text-yellow-600 font-bold">ALCANCE:</span>
                    <span className="block text-sm sm:text-[14px] text-yellow-700 font-bold">🇲🇽 Impacto Nacional</span>
                  </>
                ) : project.implementationStates && project.implementationStates.length > 0 ? (
                  <>
                    <span className="block mt-2 mb-0.5 text-[10px] sm:text-[11px] text-yellow-600 font-bold">TAMBIÉN EN:</span>
                    <span className="block text-xs sm:text-[12px] text-yellow-700">{project.implementationStates.join(', ')}</span>
                  </>
                ) : null}
              </div>

              {/* PUNTAJE ACUMULADO label */}
              <div className="font-['Arvo',_serif] text-[#0c4159] text-[11px] sm:text-[12px]">
                <span className="block mb-1 font-bold">PUNTAJE ACUMULADO.</span>
                <span className="block text-sm sm:text-[14px]">{project.totalScore}</span>
              </div>

              {/* LUGAR EN RESULTADOS FINALES label */}
              <div className="font-['Arvo',_serif] text-[#0c4159] text-[11px] sm:text-[12px]">
                <span className="block mb-1 font-bold">LUGAR EN RESULTADOS FINALES.</span>
                <span className="block text-sm sm:text-[14px]">{project.finalRankingPosition || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Content Sections - Vertical Auto Layout Stack - Mobile optimized */}
      <div className="w-full flex flex-col gap-12 sm:gap-16 md:gap-[80px] px-4 sm:px-[20px] pb-16 pt-12 sm:pt-16 md:pt-[80px]">
        
        {/* Objetivo Principal Section - Mobile responsive */}
        <div className="w-full max-w-[980px]">
          {/* Section Title */}
          <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-6 md:mb-8 font-bold">
            Objetivo
          </div>
          
          <TypewriterText
            text={project.objective}
            className="font-['Arvo',_serif] text-xl sm:text-2xl md:text-3xl lg:text-[38px] leading-[1.6]"
            speed={50}
          />
        </div>

        {/* Beneficiarios / Participantes Directos Section - Mobile optimized */}
        {project.beneficiaries && (
          <div className="w-full">
            {/* Section Title - Aligned with content */}
            <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-6 md:mb-8 font-bold">
              Beneficiarios
            </div>
            
            {/* Two Column Layout - Text determines height - Stack on mobile */}
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-[40px] items-start">
              {/* Left Column - Text (flexible height) */}
              <div className="flex-1 min-w-0">
                <MarkdownRenderer 
                  content={project.beneficiaries}
                  className="font-['Arvo',_serif] text-[#0c4159] text-[20px] leading-[1.5]"
                />
              </div>
              
              {/* Right Column - Square Image (fixed size, aligned to top) */}
              <div className="w-[500px] max-w-[40vw] bg-[#3d3d3d] rounded-[20px] overflow-hidden flex-shrink-0 aspect-square">
                {(project.beneficiariesImageUrl || project.imageUrl) && (
                  <ImageWithFallback
                    src={project.beneficiariesImageUrl || project.imageUrl}
                    alt={`${project.name} - Beneficiarios`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Factores de Riesgo Identificados Section */}
        {project.riskFactors && (
          <div className="w-full">
            {/* Section Title */}
            <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-6 md:mb-8 font-bold">
              Factores de Riesgo
            </div>
            
            {/* Two Column Layout - Image left, Text right - Stack on mobile */}
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-[40px] items-start">
              {/* Left Column - Square Image (fixed size, aligned to top) */}
              <div className="w-[500px] max-w-[40vw] bg-[#3d3d3d] rounded-[20px] overflow-hidden flex-shrink-0 aspect-square">
                {(project.riskFactorsImageUrl || project.imageUrl) && (
                  <ImageWithFallback
                    src={project.riskFactorsImageUrl || project.imageUrl}
                    alt={`${project.name} - Factores de Riesgo`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Right Column - Text (flexible height) */}
              <div className="flex-1 min-w-0">
                <MarkdownRenderer 
                  content={project.riskFactors}
                  className="font-['Arvo',_serif] text-[#0c4159] text-[20px] leading-[1.5]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Metodología Section */}
        {project.methodology && (
          <div className="w-full">
            {/* Section Title */}
            <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-6 md:mb-8 font-bold">
              Metodología
            </div>
            
            {/* Two Column Layout - Text determines height - Stack on mobile */}
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-[40px] items-start">
              {/* Left Column - Text (flexible height) */}
              <div className="flex-1 min-w-0">
                <MarkdownRenderer 
                  content={project.methodology}
                  className="font-['Arvo',_serif] text-[#0c4159] text-[20px] leading-[1.5]"
                />
              </div>
              
              {/* Right Column - Square Image (fixed size, aligned to top) */}
              <div className="w-[500px] max-w-[40vw] bg-[#3d3d3d] rounded-[20px] overflow-hidden flex-shrink-0 aspect-square">
                {(project.methodologyImageUrl || project.imageUrl) && (
                  <ImageWithFallback
                    src={project.methodologyImageUrl || project.imageUrl}
                    alt={`${project.name} - Metodología`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resultados Principales Section */}
        {project.results && (
          <div className="w-full">
            {/* Section Title */}
            <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-6 md:mb-8 font-bold">
              Resultados
            </div>
            
            {/* Two Column Layout - Image left, Text right - Stack on mobile */}
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-[40px] items-start">
              {/* Left Column - Square Image (fixed size, aligned to top) */}
              <div className="w-[500px] max-w-[40vw] bg-[#3d3d3d] rounded-[20px] overflow-hidden flex-shrink-0 aspect-square">
                {(project.resultsImageUrl || project.imageUrl) && (
                  <ImageWithFallback
                    src={project.resultsImageUrl || project.imageUrl}
                    alt={`${project.name} - Resultados`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Right Column - Text (flexible height) */}
              <div className="flex-1 min-w-0">
                <MarkdownRenderer 
                  content={project.results}
                  className="font-['Arvo',_serif] text-[#0c4159] text-[20px] leading-[1.5]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Section */}
        <div className="w-full">
          {/* Section Title */}
          <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-6 md:mb-8 font-bold">
            Evaluación
          </div>
          
          {/* Three Column Dashboard on light grey card */}
          <div className="bg-[#f5f5f5] rounded-[20px] px-[60px] py-[60px]">
            <div className="flex gap-[60px] items-start">
              
              {/* Left Column - Evaluation Criteria */}
              <div className="flex-1 flex flex-col">
                <p className="font-['Arvo',_serif] text-[#0c4159] text-[12px] uppercase tracking-wide leading-none mb-6">
                  Criterios de evaluación destacados
                </p>
                <div className="font-['Arvo',_serif] text-[#0c4159] text-[16px] leading-[1.8]">
                  {project.evaluationCriteriaHighlights ? (
                    project.evaluationCriteriaHighlights.split(';').map((criterion, index) => (
                      <div key={index} className="mb-2">
                        • {criterion.trim()}
                      </div>
                    ))
                  ) : (
                    <>
                      <div>• Innovación y Creatividad</div>
                      <div>• Impacto Comunitario</div>
                      <div>• Sostenibilidad del Proyecto</div>
                    </>
                  )}
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-[200px] bg-[#0c4159] opacity-20" />

              {/* Center Column - Total Score (FOCAL POINT) */}
              <div className="flex-1 flex flex-col items-center">
                <p className="font-['Arvo',_serif] text-[#0c4159] text-[12px] uppercase tracking-wide leading-none mb-8 text-center">
                  Puntaje Acumulado total Evaluaciones
                </p>
                <div className="font-['Arvo',_serif] text-[#ff8012] text-[120px] leading-none">
                  {(() => {
                    const [count, setCount] = React.useState(0);
                    const [hasAnimated, setHasAnimated] = React.useState(false);
                    const ref = React.useRef<HTMLDivElement>(null);

                    React.useEffect(() => {
                      const observer = new IntersectionObserver(
                        (entries) => {
                          if (entries[0].isIntersecting && !hasAnimated) {
                            setHasAnimated(true);
                            const target = project.totalScore;
                            const duration = 2000; // 2 seconds
                            const steps = 60;
                            const increment = target / steps;
                            let current = 0;

                            const timer = setInterval(() => {
                              current += increment;
                              if (current >= target) {
                                setCount(target);
                                clearInterval(timer);
                              } else {
                                setCount(Math.floor(current));
                              }
                            }, duration / steps);

                            return () => clearInterval(timer);
                          }
                        },
                        { threshold: 0.5 }
                      );

                      if (ref.current) {
                        observer.observe(ref.current);
                      }

                      return () => observer.disconnect();
                    }, [hasAnimated]);

                    return <span ref={ref}>{count}</span>;
                  })()}
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-[200px] bg-[#0c4159] opacity-20" />

              {/* Right Column - Final Ranking */}
              <div className="flex-1 flex flex-col">
                <p className="font-['Arvo',_serif] text-[#0c4159] text-[12px] uppercase tracking-wide leading-none mb-6">
                  Lugar Ocupado en los Resultados Finales
                </p>
                <div className="font-['Arvo',_serif] text-[#0c4159] text-[48px] leading-none">
                  {project.finalRankingPosition ? (
                    <>
                      {project.finalRankingPosition === 1 && '1er Lugar'}
                      {project.finalRankingPosition === 2 && '2do Lugar'}
                      {project.finalRankingPosition === 3 && '3er Lugar'}
                      {project.finalRankingPosition > 3 && `${project.finalRankingPosition}° Lugar`}
                    </>
                  ) : (
                    'Top 5%'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Footer - Project-specific information */}
      <div className="w-full px-4 sm:px-[20px]">
        {/* Section Title */}
        <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-6 md:mb-8 pt-12 sm:pt-16 md:pt-[80px] font-bold">
          Información
        </div>
      </div>
      
      <div className="w-full">
        <GlobalFooter project={project} />
      </div>
    </div>
  );
}