import { useEffect, useRef, useState } from 'react';
import { Award, TrendingUp, Target, Star } from 'lucide-react';
import { Project } from '../types';
import { HighlightPhrases } from './HighlightPhrases';

interface EvaluationCardProps {
  project: Project;
}

/**
 * Enhanced Evaluation Card Component
 * Features: Animated counter, gradient cards, visual hierarchy
 */
export function EvaluationCard({ project }: EvaluationCardProps) {
  const [totalScore, setTotalScore] = useState(0);
  const [rankingPosition, setRankingPosition] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Animate total score
          const targetScore = project.totalScore;
          const scoreDuration = 2000; // 2 seconds
          const scoreSteps = 60;
          const scoreIncrement = targetScore / scoreSteps;
          let currentScore = 0;

          const scoreTimer = setInterval(() => {
            currentScore += scoreIncrement;
            if (currentScore >= targetScore) {
              setTotalScore(targetScore);
              clearInterval(scoreTimer);
            } else {
              setTotalScore(Math.floor(currentScore));
            }
          }, scoreDuration / scoreSteps);

          // Animate ranking position if exists
          if (project.finalRankingPosition) {
            const targetRank = project.finalRankingPosition;
            const rankDuration = 1500; // 1.5 seconds
            const rankSteps = 30;
            const rankIncrement = targetRank / rankSteps;
            let currentRank = 0;

            setTimeout(() => {
              const rankTimer = setInterval(() => {
                currentRank += rankIncrement;
                if (currentRank >= targetRank) {
                  setRankingPosition(targetRank);
                  clearInterval(rankTimer);
                } else {
                  setRankingPosition(Math.floor(currentRank));
                }
              }, rankDuration / rankSteps);
            }, 500); // Start after 500ms delay
          }
        }
      },
      { 
        threshold: 0.2, // Single threshold for better performance
        rootMargin: '50px 0px' // Start animating slightly before entering viewport
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, project.totalScore, project.finalRankingPosition]);

  // Format ranking position with proper suffix
  const formatRanking = (position: number) => {
    if (position === 0) return '—';
    if (position === 1) return '1er';
    if (position === 2) return '2do';
    if (position === 3) return '3er';
    return `${position}°`;
  };

  return (
    <div ref={sectionRef} className="px-8 md:px-12 py-8 md:py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Desktop title - Hidden on mobile (mobile gets title from StackedCardSection) */}
        <div className="hidden lg:block font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-8 font-bold">
          Evaluación
        </div>
        
        {/* Evaluation Criteria Section */}
        {project.evaluationCriteriaHighlights && (
          <div className="mb-12">
            <HighlightPhrases 
              text={project.evaluationCriteriaHighlights} 
              title="Criterios de evaluación destacados"
            />
          </div>
        )}

        {/* Decorative divider */}
        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#0c4159]/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#f5f5f5] px-4 text-xs text-[#0c4159]/40 uppercase tracking-wider">
              Resultados
            </span>
          </div>
        </div>

        {/* Scores Grid - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Total Score Card - Primary Focus */}
          <div 
            className="
              relative overflow-hidden
              bg-gradient-to-br from-[#ff8012]/5 via-white to-[#ff8012]/10
              rounded-2xl p-8 md:p-10
              border-2 border-[#ff8012]/20
              shadow-lg shadow-[#ff8012]/5
              group
              transition-all duration-500
              hover:shadow-xl hover:shadow-[#ff8012]/10
              hover:border-[#ff8012]/30
            "
            style={{
              animation: hasAnimated ? 'score-card-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
            }}
          >
            {/* Background decoration */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#ff8012]/5 rounded-full blur-2xl group-hover:bg-[#ff8012]/10 transition-all duration-500"></div>
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[#0c4159]/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              {/* Icon and Label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#ff8012]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-5 h-5 text-[#ff8012]" />
                </div>
                <div>
                  <div className="text-xs text-[#0c4159]/50 uppercase tracking-wider font-['Arvo',_serif]">
                    Puntaje Total
                  </div>
                  <div className="text-xs text-[#0c4159]/40 font-['Arvo',_serif]">
                    Evaluaciones Acumuladas
                  </div>
                </div>
              </div>

              {/* Animated Score */}
              <div className="mt-6 mb-2">
                <div 
                  className="
                    text-6xl md:text-7xl
                    font-['Arvo',_serif]
                    bg-gradient-to-br from-[#ff8012] to-[#ff8012]/70
                    bg-clip-text text-transparent
                    leading-none
                    transition-all duration-300
                    group-hover:scale-105
                  "
                  style={{
                    textShadow: '0 0 40px rgba(255, 128, 18, 0.1)'
                  }}
                >
                  {totalScore.toLocaleString()}
                </div>
                <div className="text-sm text-[#0c4159]/40 mt-2 font-['Arvo',_serif]">
                  puntos
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6 h-2 bg-[#0c4159]/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ff8012] to-[#ff8012]/60 rounded-full transition-all duration-2000 ease-out"
                  style={{
                    width: hasAnimated ? '100%' : '0%',
                    boxShadow: '0 0 10px rgba(255, 128, 18, 0.3)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Ranking Position Card - Secondary */}
          {project.finalRankingPosition && (
            <div 
              className="
                relative overflow-hidden
                bg-gradient-to-br from-[#0c4159]/5 via-white to-[#0c4159]/10
                rounded-2xl p-8 md:p-10
                border-2 border-[#0c4159]/20
                shadow-lg shadow-[#0c4159]/5
                group
                transition-all duration-500
                hover:shadow-xl hover:shadow-[#0c4159]/10
                hover:border-[#0c4159]/30
              "
              style={{
                animation: hasAnimated ? 'score-card-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both' : 'none'
              }}
            >
              {/* Background decoration */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#0c4159]/5 rounded-full blur-2xl group-hover:bg-[#0c4159]/10 transition-all duration-500"></div>
              <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[#ff8012]/5 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                {/* Icon and Label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0c4159]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-5 h-5 text-[#0c4159]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#0c4159]/50 uppercase tracking-wider font-['Arvo',_serif]">
                      Posición Final
                    </div>
                    <div className="text-xs text-[#0c4159]/40 font-['Arvo',_serif]">
                      Resultados Finales
                    </div>
                  </div>
                </div>

                {/* Animated Ranking */}
                <div className="mt-6 mb-2">
                  <div 
                    className="
                      text-6xl md:text-7xl
                      font-['Arvo',_serif]
                      text-[#0c4159]
                      leading-none
                      transition-all duration-300
                      group-hover:scale-105
                    "
                  >
                    {formatRanking(rankingPosition)}
                  </div>
                  <div className="text-sm text-[#0c4159]/40 mt-2 font-['Arvo',_serif]">
                    lugar
                  </div>
                </div>

                {/* Achievement badge for top 3 */}
                {project.finalRankingPosition <= 3 && hasAnimated && (
                  <div className="mt-6 flex items-center gap-2 text-[#ff8012]">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-sm font-['Arvo',_serif]">
                      Proyecto Destacado
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Metrics - Optional Enhancement */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#0c4159]/10">
          <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
            <Target className="w-5 h-5 text-[#0c4159]/40 mx-auto mb-2" />
            <div className="text-xs text-[#0c4159]/50 uppercase tracking-wide mb-1">Categoría</div>
            <div className="text-sm text-[#0c4159] font-['Arvo',_serif] line-clamp-1">
              {project.category.replace(/[-/]/g, ' ').charAt(0).toUpperCase() + project.category.replace(/[-/]/g, ' ').slice(1)}
            </div>
          </div>

          <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs text-[#0c4159]/50 uppercase tracking-wide mb-1">Evaluado</div>
            <div className="text-sm text-[#0c4159] font-['Arvo',_serif]">
              {hasAnimated ? '✓' : '—'}
            </div>
          </div>

          <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs text-[#0c4159]/50 uppercase tracking-wide mb-1">Criterios</div>
            <div className="text-sm text-[#0c4159] font-['Arvo',_serif]">
              Múltiples
            </div>
          </div>

          <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xs text-[#0c4159]/50 uppercase tracking-wide mb-1">Impacto</div>
            <div className="text-sm text-[#0c4159] font-['Arvo',_serif]">
              {project.finalRankingPosition && project.finalRankingPosition <= 10 ? 'Alto' : 'Notable'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}