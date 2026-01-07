import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InteractiveMap } from '../components/InteractiveMap';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { MapTitle } from '../components/MapTitle';
import { useProjects } from '../contexts/ProjectContext';
import { useURLSync } from '../hooks/useURLSync';

/**
 * Main map view - shows interactive Mexico map with project markers
 * Syncs filters with URL for shareable links
 */
export function MapView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { filters, isLoading } = useProjects();
  const isFirstRender = useRef(true);
  const [isMapInteracting, setIsMapInteracting] = useState(false);
  
  // Initialize filters from URL on mount
  useURLSync();

  // Sync filters to URL whenever they change (but not on first render)
  useEffect(() => {
    // Skip on first render to avoid conflicts with URL reading
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();
    
    if (filters.selectedCategories.length > 0) {
      params.set('categorias', filters.selectedCategories.join(','));
    }
    
    if (filters.selectedThematicAreas.length > 0) {
      params.set('areas', filters.selectedThematicAreas.join(','));
    }
    
    if (filters.selectedLocations.length > 0) {
      params.set('ubicaciones', filters.selectedLocations.join(','));
    }
    
    if (filters.searchQuery) {
      params.set('busqueda', filters.searchQuery);
    }

    const newSearch = params.toString();
    const currentSearch = location.search.slice(1);

    // Only update if changed
    if (newSearch !== currentSearch) {
      navigate({
        pathname: '/',
        search: newSearch ? `?${newSearch}` : ''
      }, { replace: true });
    }
  }, [filters, navigate, location.search]);

  return (
    <div className="h-full w-full bg-[#0c4159]">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#0c4159] z-50 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-['Arvo',_serif] text-lg">
              Cargando proyectos...
            </p>
          </div>
        </div>
      )}
      
      {/* Map container - takes full height minus search bar */}
      <div className="h-full pb-28 sm:pb-24">
        <InteractiveMap onInteractionChange={setIsMapInteracting} />
        <MapTitle isMapInteracting={isMapInteracting} />
      </div>
      
      {/* Search and filter bar */}
      <SearchFilterBar />
    </div>
  );
}
