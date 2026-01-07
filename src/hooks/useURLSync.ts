import { useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext';

/**
 * Custom hook to initialize filters from URL on mount
 * Enables shareable links and browser back/forward navigation
 */
export function useURLSync() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setFilters } = useProjects();

  // Parse URL parameters and update app state ONLY on initial mount
  useEffect(() => {
    const categoriesParam = searchParams.get('categorias');
    const areasParam = searchParams.get('areas');
    const locationsParam = searchParams.get('ubicaciones');
    const searchParam = searchParams.get('busqueda');

    // Only update if URL has parameters
    const hasParams = categoriesParam || areasParam || locationsParam || searchParam;
    
    if (hasParams) {
      setFilters({
        selectedCategories: categoriesParam ? categoriesParam.split(',').filter(Boolean) : [],
        selectedThematicAreas: areasParam ? areasParam.split(',').filter(Boolean) : [],
        selectedLocations: locationsParam ? locationsParam.split(',').filter(Boolean) : [],
        searchQuery: searchParam || ''
      });
    }
  }, []); // Only run once on mount

  // Navigate to project detail page
  const navigateToProject = useCallback((projectId: string) => {
    navigate(`/proyecto/${projectId}`);
  }, [navigate]);

  // Navigate back to map
  const navigateToMap = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Navigate to admin panel
  const navigateToAdmin = useCallback(() => {
    navigate('/admin');
  }, [navigate]);

  return {
    navigateToProject,
    navigateToMap,
    navigateToAdmin
  };
}
