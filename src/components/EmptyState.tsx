import React from 'react';
import { Search, Filter, Database, AlertCircle, MapPin, RefreshCw, X } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  variant: 'no-search' | 'no-filters' | 'no-projects' | 'error' | 'no-location';
  searchQuery?: string;
  activeFiltersCount?: number;
  onClearSearch?: () => void;
  onClearFilters?: () => void;
  onRetry?: () => void;
  className?: string;
}

/**
 * EmptyState Component
 * 
 * Displays helpful messages and actions when there are no results to show.
 * Provides context-specific guidance based on the situation.
 */
export function EmptyState({
  variant,
  searchQuery = '',
  activeFiltersCount = 0,
  onClearSearch,
  onClearFilters,
  onRetry,
  className = '',
}: EmptyStateProps) {
  const getContent = () => {
    switch (variant) {
      case 'no-search':
        return {
          icon: Search,
          iconColor: 'text-blue-400',
          iconBgColor: 'bg-blue-50',
          title: 'No se encontraron proyectos',
          description: searchQuery
            ? `No encontramos proyectos que coincidan con "${searchQuery}"`
            : 'No encontramos proyectos con esos criterios de búsqueda',
          suggestions: [
            'Verifica la ortografía de los términos de búsqueda',
            'Intenta con palabras clave diferentes o más generales',
            'Reduce el número de filtros aplicados',
            'Busca por ubicación, organización o tema',
          ],
          actions: (
            <div className="flex flex-wrap gap-3 justify-center">
              {onClearSearch && searchQuery && (
                <Button
                  onClick={onClearSearch}
                  variant="default"
                  className="bg-[#0c4159] hover:bg-[#0a3547] text-white font-['Arvo',_serif]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpiar búsqueda
                </Button>
              )}
              {onClearFilters && activeFiltersCount > 0 && (
                <Button
                  onClick={onClearFilters}
                  variant="outline"
                  className="font-['Arvo',_serif]"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Quitar filtros ({activeFiltersCount})
                </Button>
              )}
            </div>
          ),
        };

      case 'no-filters':
        return {
          icon: Filter,
          iconColor: 'text-amber-500',
          iconBgColor: 'bg-amber-50',
          title: 'Sin resultados con estos filtros',
          description: activeFiltersCount > 1
            ? `Los ${activeFiltersCount} filtros activos están excluyendo todos los proyectos`
            : 'El filtro activo está excluyendo todos los proyectos',
          suggestions: [
            'Intenta remover algunos filtros para ver más resultados',
            'Combina menos criterios de filtrado',
            'Prueba con otras categorías o áreas temáticas',
          ],
          actions: (
            <div className="flex flex-wrap gap-3 justify-center">
              {onClearFilters && (
                <Button
                  onClick={onClearFilters}
                  variant="default"
                  className="bg-[#0c4159] hover:bg-[#0a3547] text-white font-['Arvo',_serif]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Quitar todos los filtros
                </Button>
              )}
            </div>
          ),
        };

      case 'no-projects':
        return {
          icon: Database,
          iconColor: 'text-gray-400',
          iconBgColor: 'bg-gray-50',
          title: 'No hay proyectos disponibles',
          description: 'Aún no se han agregado proyectos al mapa',
          suggestions: [
            'Los proyectos aparecerán aquí cuando se agreguen a la base de datos',
            'Contacta al administrador para más información',
          ],
          actions: null,
        };

      case 'error':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-500',
          iconBgColor: 'bg-red-50',
          title: 'Error al cargar los proyectos',
          description: 'Hubo un problema al cargar la información de los proyectos',
          suggestions: [
            'Verifica tu conexión a internet',
            'Intenta recargar la página',
            'Si el problema persiste, contacta al soporte',
          ],
          actions: onRetry && (
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={onRetry}
                variant="default"
                className="bg-[#0c4159] hover:bg-[#0a3547] text-white font-['Arvo',_serif]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </Button>
            </div>
          ),
        };

      case 'no-location':
        return {
          icon: MapPin,
          iconColor: 'text-purple-500',
          iconBgColor: 'bg-purple-50',
          title: 'No hay proyectos en esta zona',
          description: 'No encontramos proyectos en el área visible del mapa',
          suggestions: [
            'Intenta hacer zoom out para ver más proyectos',
            'Mueve el mapa a otras regiones de México',
            'Reduce los filtros activos para ver más opciones',
          ],
          actions: (
            <div className="flex flex-wrap gap-3 justify-center">
              {onClearFilters && activeFiltersCount > 0 && (
                <Button
                  onClick={onClearFilters}
                  variant="outline"
                  className="font-['Arvo',_serif]"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Quitar filtros
                </Button>
              )}
            </div>
          ),
        };

      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  const Icon = content.icon;

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center">
          <div className={`${content.iconBgColor} rounded-full p-4 inline-flex`}>
            <Icon className={`w-12 h-12 ${content.iconColor}`} />
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="text-gray-900 font-['Arvo',_serif]">
            {content.title}
          </h3>
          <p className="text-gray-600 font-['Arvo',_serif] text-sm">
            {content.description}
          </p>
        </div>

        {/* Suggestions */}
        {content.suggestions && content.suggestions.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-700 font-['Arvo',_serif] mb-2">
              Sugerencias:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600 font-['Arvo',_serif]">
              {content.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#0c4159] mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        {content.actions && (
          <div className="pt-2">
            {content.actions}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact empty state for smaller areas (like dropdowns or panels)
 */
export function CompactEmptyState({
  icon: Icon = Search,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
      <Icon className="w-8 h-8 text-gray-400" />
      <div className="space-y-1">
        <p className="text-sm text-gray-900 font-['Arvo',_serif]">
          {title}
        </p>
        {description && (
          <p className="text-xs text-gray-500 font-['Arvo',_serif]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
