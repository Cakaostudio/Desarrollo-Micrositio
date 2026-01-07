import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface MapTitleProps {
  isMapInteracting: boolean;
}

export function MapTitle({ isMapInteracting }: MapTitleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const restoreTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle map interaction state with delayed restore
  useEffect(() => {
    if (isMapInteracting) {
      setIsCompact(true);
      // Clear any pending restore timeout
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current);
      }
    } else {
      // Restore after 1.5s of being idle
      restoreTimeoutRef.current = setTimeout(() => {
        setIsCompact(false);
      }, 1500);
    }

    return () => {
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current);
      }
    };
  }, [isMapInteracting]);

  // Handle ESC key to close popover
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPopover) {
        setShowPopover(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showPopover]);

  if (isHidden) {
    return null;
  }

  return (
    <div
      className="absolute top-4 left-4 z-30 pointer-events-auto"
      style={{
        maxWidth: isCompact ? '160px' : 'min(520px, calc(100vw - 100px))',
        transition: 'max-width 0.3s ease-out',
      }}
      role="banner"
      aria-label="Título del mapa: Propuestas de buenas prácticas de seguridad ciudadana en México"
    >
      <div
        className={`
          relative flex items-start gap-2.5 transition-all duration-300 ease-out
          ${isCompact ? 'opacity-60' : 'opacity-100'}
        `}
        style={{
          transform: isCompact ? 'scale(0.85)' : 'scale(1)',
          transformOrigin: 'top left',
        }}
      >
        {/* Main title container */}
        <div
          className="flex-1 min-w-0"
          onMouseEnter={() => !isCompact && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => !isCompact && setIsHovered(true)}
          onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
        >
          <div
            className={`
              bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2.5
              border border-white/50 shadow-md
              transition-all duration-300 ease-out
              ${isHovered && !isCompact ? 'shadow-lg bg-white/95' : ''}
            `}
          >
            {/* Title text */}
            <h1
              className="text-sm leading-relaxed text-gray-800 transition-colors duration-300"
              style={{
                opacity: isCompact ? 0.7 : 1,
                fontSize: isCompact ? '12px' : '14px',
                lineHeight: isCompact ? '1.4' : '1.5',
                fontWeight: 500,
              }}
            >
              {isCompact ? (
                <span className="line-clamp-1">Propuestas — Primera Convocatoria...</span>
              ) : (
                <>
                  Propuestas — Primera Convocatoria de Reconocimiento a las Buenas Prácticas de
                  Seguridad Ciudadana en México 2024–2025
                </>
              )}
            </h1>

            {/* Subtitle - shown on hover/tap */}
            <div
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{
                maxHeight: isHovered && !isCompact ? '50px' : '0px',
                opacity: isHovered && !isCompact ? 1 : 0,
                marginTop: isHovered && !isCompact ? '6px' : '0px',
              }}
            >
              <p className="text-xs leading-relaxed text-gray-700 italic">
                Explora propuestas por categoría, ámbito y ubicación.
              </p>
            </div>
          </div>
        </div>

        {/* Info button with popover */}
        {!isCompact && (
          <Popover open={showPopover} onOpenChange={setShowPopover}>
            <PopoverTrigger asChild>
              <button
                className="
                  flex-shrink-0 w-8 h-8 rounded-md
                  bg-white/90 backdrop-blur-sm border border-white/50
                  flex items-center justify-center
                  hover:bg-white/95 hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                  transition-all duration-200
                  group
                  shadow-md
                "
                aria-label="Información sobre el mapa"
                title="Más información"
              >
                <Info className="w-4 h-4 text-gray-700 group-hover:text-blue-600 transition-colors" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4 bg-white shadow-xl border border-gray-200"
              align="start"
              sideOffset={8}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm text-gray-900">
                    Acerca de este mapa
                  </h3>
                  <button
                    onClick={() => setShowPopover(false)}
                    className="
                      flex-shrink-0 w-5 h-5 rounded
                      flex items-center justify-center
                      hover:bg-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-400
                      transition-colors
                    "
                    aria-label="Cerrar"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-2 text-xs text-gray-700 leading-relaxed">
                  <p>
                    Este mapa interactivo presenta las propuestas participantes en la Primera
                    Convocatoria de Reconocimiento a las Buenas Prácticas de Seguridad Ciudadana
                    en México 2024–2025.
                  </p>
                  <p>
                    Explora proyectos de diferentes estados, categorías y ámbitos de participación.
                    Utiliza los filtros para encontrar propuestas específicas o haz clic en los
                    marcadores del mapa para ver detalles completos.
                  </p>
                  <p className="text-gray-600 italic">
                    El mapa se actualiza dinámicamente según tus filtros de búsqueda.
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsHidden(true);
                      setShowPopover(false);
                    }}
                    className="
                      text-xs text-gray-600 hover:text-gray-900
                      underline underline-offset-2
                      transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:rounded
                    "
                  >
                    Ocultar título permanentemente
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
