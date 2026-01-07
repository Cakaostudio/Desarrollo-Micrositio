import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Tag, Target } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { CompactEmptyState } from './EmptyState';
import { Project } from '../types';

interface SearchSuggestionsProps {
  searchQuery: string;
  onProjectSelect: (project: Project) => void;
  onSearchQueryChange: (query: string) => void;
  isVisible: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

interface ProjectScore {
  project: Project;
  score: number;
  matchType: 'name' | 'description' | 'location' | 'category' | 'thematic';
}

export function SearchSuggestions({ 
  searchQuery, 
  onProjectSelect, 
  onSearchQueryChange, 
  isVisible,
  onKeyDown
}: SearchSuggestionsProps) {
  const { projects } = useProjects();
  const [suggestions, setSuggestions] = useState<ProjectScore[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Calculate similarity score for a project based on search query
  const calculateScore = (project: Project, query: string): ProjectScore | null => {
    if (!query.trim()) return null;
    
    const queryLower = query.toLowerCase().trim();
    let score = 0;
    let matchType: ProjectScore['matchType'] = 'name';

    // Name match (highest priority)
    const nameLower = project.name.toLowerCase();
    if (nameLower.includes(queryLower)) {
      if (nameLower.startsWith(queryLower)) {
        score += 100; // Starts with query
      } else {
        score += 80; // Contains query
      }
      matchType = 'name';
    }

    // Description match
    const descriptionLower = (project.description || '').toLowerCase();
    if (descriptionLower.includes(queryLower)) {
      score += 60;
      if (matchType === 'name' && score < 80) {
        matchType = 'description';
      }
    }

    // Objective match
    const objectiveLower = (project.objective || '').toLowerCase();
    if (objectiveLower.includes(queryLower)) {
      score += 50;
      if (matchType === 'name' && score < 80) {
        matchType = 'description';
      }
    }

    // Location match
    const locationCity = project.municipality || '';
    const locationState = project.state || '';
    const fullLocation = `${locationCity} ${locationState}`.toLowerCase();
    if (fullLocation.includes(queryLower)) {
      score += 70;
      if (score < 80) {
        matchType = 'location';
      }
    }

    // Category match
    const categoryLower = project.category.toLowerCase();
    if (categoryLower.includes(queryLower)) {
      score += 40;
      if (score < 80) {
        matchType = 'category';
      }
    }

    // Thematic area match
    const thematicLower = project.thematicArea.toLowerCase();
    if (thematicLower.includes(queryLower)) {
      score += 40;
      if (score < 80) {
        matchType = 'thematic';
      }
    }

    // Boost score based on project ranking
    if (project.finalRankingPosition && project.finalRankingPosition <= 10) {
      score += 20; // Top 10 projects get a boost
    }

    return score > 0 ? { project, score, matchType } : null;
  };

  // Update suggestions when search query changes
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const projectScores: ProjectScore[] = [];
    
    projects.forEach(project => {
      const result = calculateScore(project, searchQuery);
      if (result) {
        projectScores.push(result);
      }
    });

    // Sort by score (descending) and limit to top 8 results
    const sortedSuggestions = projectScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    setSuggestions(sortedSuggestions);
    setSelectedIndex(-1);
  }, [searchQuery, projects]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            const selectedProject = suggestions[selectedIndex].project;
            onProjectSelect(selectedProject);
          }
          break;
        case 'Escape':
          setSelectedIndex(-1);
          break;
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, suggestions, selectedIndex, onProjectSelect]);

  // Get icon based on match type
  const getMatchIcon = (matchType: ProjectScore['matchType']) => {
    switch (matchType) {
      case 'location':
        return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'category':
        return <Tag className="w-4 h-4 text-orange-500" />;
      case 'thematic':
        return <Target className="w-4 h-4 text-green-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get match type label
  const getMatchLabel = (matchType: ProjectScore['matchType']) => {
    switch (matchType) {
      case 'name':
        return 'Nombre';
      case 'description':
        return 'Descripción';
      case 'location':
        return 'Ubicación';
      case 'category':
        return 'Categoría';
      case 'thematic':
        return 'Ámbito';
      default:
        return '';
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string | undefined, query: string, maxLength: number = 100) => {
    // Handle undefined or empty text
    if (!text) return '';
    if (!query.trim()) return text.substring(0, maxLength);
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);
    
    if (index === -1) {
      return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
    }
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);
    
    const truncated = (before + match + after).substring(0, maxLength);
    const truncatedAfter = truncated.substring(before.length + match.length);
    
    return (
      <>
        {before}
        <span className="bg-yellow-200 bg-opacity-60 font-medium text-gray-900">
          {match}
        </span>
        {truncatedAfter}
        {text.length > maxLength && '...'}
      </>
    );
  };

  if (!isVisible) {
    return null;
  }

  // Show empty state when there's a search query but no results
  if (searchQuery.trim().length > 0 && suggestions.length === 0) {
    return (
      <div 
        ref={suggestionsRef}
        className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-t-lg shadow-xl z-[60] animate-slide-in-down"
      >
        <CompactEmptyState
          icon={Search}
          title="No se encontraron coincidencias"
          description={`Sin resultados para "${searchQuery.substring(0, 30)}${searchQuery.length > 30 ? '...' : ''}"`}
        />
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div 
      ref={suggestionsRef}
      className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-t-lg shadow-xl z-[60] max-h-96 overflow-y-auto animate-slide-in-down"
    >
      <div className="p-2 border-b border-gray-100 bg-gray-50">
        <p className="text-sm text-gray-600">
          {suggestions.length} sugerencia{suggestions.length !== 1 ? 's' : ''} encontrada{suggestions.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {suggestions.map(({ project, matchType }, index) => (
          <div
            key={project.id}
            onClick={() => {
              onProjectSelect(project);
              onSearchQueryChange('');
            }}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`p-3 cursor-pointer transition-colors duration-200 group ${
              index === selectedIndex 
                ? 'bg-orange-50 border-l-4 border-orange-400' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getMatchIcon(matchType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                    {highlightMatch(project.name, searchQuery, 60)}
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                    {getMatchLabel(matchType)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {highlightMatch(project.description, searchQuery, 120)}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{project.municipality}, {project.state}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{project.category}</span>
                  </div>
                  {project.finalRankingPosition && (
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full text-[10px] flex items-center justify-center text-white">
                        #
                      </span>
                      <span>Posición {project.finalRankingPosition}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-2 bg-gray-50 text-center">
        <p className="text-xs text-gray-500">
          Haz clic en un proyecto para abrir la vista previa
        </p>
      </div>
    </div>
  );
}