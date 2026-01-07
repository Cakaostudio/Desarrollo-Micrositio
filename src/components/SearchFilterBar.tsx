import React, { useState, useRef, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FilterDropdown } from './FilterDropdown';
import { SearchSuggestions } from './SearchSuggestions';
import { useProjects } from '../contexts/ProjectContext';
import { categoryOptions, thematicAreaOptions, locationOptions } from '../data/projects';
import { Project } from '../types';

export const SearchFilterBar = memo(function SearchFilterBar() {
  const navigate = useNavigate();
  const { filters, setFilters, resetFilters, filteredProjects, setSelectedProject } = useProjects();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle clearing all filters
  const handleClearFilters = () => {
    resetFilters();
    // Clear URL parameters
    navigate('/', { replace: true });
  };

  const hasActiveFilters = filters.searchQuery || 
    filters.selectedCategories.length > 0 || 
    filters.selectedThematicAreas.length > 0 || 
    filters.selectedLocations.length > 0;

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSearchInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setFilters({ searchQuery: value });
    setShowSuggestions(value.length >= 2);
  };

  // Handle project selection from suggestions
  const handleProjectSelect = (project: Project) => {
    // Open the project preview panel
    setSelectedProject(project);
    setShowSuggestions(false);
    setSearchInputFocused(false);
    // Clear search to show all projects on map
    setFilters({ searchQuery: '' });
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setSearchInputFocused(true);
    if (filters.searchQuery.length >= 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 shadow-lg z-30">
      {/* Active filters summary - Mobile optimized */}
      {hasActiveFilters && (
        <div className="bg-black bg-opacity-20 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center gap-2 text-white text-xs sm:text-sm animate-fade-in">
          <span className="truncate">Mostrando {filteredProjects.length} propuesta{filteredProjects.length !== 1 ? 's' : ''}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-white hover:bg-white hover:bg-opacity-20 text-xs h-6 px-2 transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            <X className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline">Limpiar filtros</span>
          </Button>
        </div>
      )}

      <div className="flex flex-col">
        {/* Search Bar - Top Row - Mobile optimized */}
        <div 
          ref={searchContainerRef}
          className="relative bg-gradient-to-r from-orange-400 to-yellow-400 h-11 sm:h-12 flex items-center px-3 sm:px-4"
        >
          <Search className="text-white w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar proyecto"
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={handleSearchFocus}
            className="bg-transparent border-none shadow-none text-white placeholder:text-white placeholder:text-opacity-90 h-full focus:ring-0 focus:outline-none p-0 flex-1 transition-all duration-300 text-sm sm:text-base"
          />
          
          {/* Search Suggestions */}
          <SearchSuggestions
            searchQuery={filters.searchQuery}
            onProjectSelect={handleProjectSelect}
            onSearchQueryChange={(query) => setFilters({ searchQuery: query })}
            isVisible={showSuggestions && searchInputFocused}
          />
        </div>

        {/* Filter Tabs - Bottom Row - Mobile optimized with responsive heights */}
        <div className="flex items-stretch h-14 sm:h-12">
          {/* Categoría de postulación - Yellow */}
          <div className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500">
            <FilterDropdown
              title="Categoría de postulación"
              shortTitle="Categoría"
              options={categoryOptions}
              selectedValues={filters.selectedCategories}
              onSelectionChange={(values) => setFilters({ selectedCategories: values })}
              bgColor="bg-transparent"
              hoverColor="hover:bg-black hover:bg-opacity-10"
              isActive={filters.selectedCategories.length > 0}
              menuTitle="Proyecto"
              menuBgGradient="bg-gradient-to-b from-yellow-300 to-yellow-400"
              menuHeaderBg="bg-yellow-400"
            />
          </div>

          {/* Ámbito temático - Orange/Red */}
          <div className="flex-1 bg-gradient-to-r from-orange-500 to-red-500">
            <FilterDropdown
              title="Ámbito temático"
              shortTitle="Ámbito"
              options={thematicAreaOptions}
              selectedValues={filters.selectedThematicAreas}
              onSelectionChange={(values) => setFilters({ selectedThematicAreas: values })}
              bgColor="bg-transparent"
              hoverColor="hover:bg-black hover:bg-opacity-10"
              isActive={filters.selectedThematicAreas.length > 0}
              menuTitle="Ámbito Temático"
              menuBgGradient="bg-gradient-to-b from-orange-400 to-red-500"
              menuHeaderBg="bg-red-500"
            />
          </div>

          {/* Ciudad / Estado - Dark Blue/Teal */}
          <div className="flex-1 bg-gradient-to-r from-teal-600 to-blue-700">
            <FilterDropdown
              title="Ubicación"
              shortTitle="Ubicación"
              options={locationOptions}
              selectedValues={filters.selectedLocations}
              onSelectionChange={(values) => setFilters({ selectedLocations: values })}
              bgColor="bg-transparent"
              hoverColor="hover:bg-black hover:bg-opacity-10"
              isActive={filters.selectedLocations.length > 0}
              menuTitle="Ubicación"
              menuBgGradient="bg-gradient-to-b from-teal-500 to-blue-600"
              menuHeaderBg="bg-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
});