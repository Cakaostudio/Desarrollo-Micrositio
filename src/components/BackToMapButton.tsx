import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

/**
 * Floating "Back to Map" button
 * Appears on project detail pages to provide easy navigation back to map
 * Features smooth animations and responsive design
 */
export function BackToMapButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the previous filters from URL state if available
  const handleBackToMap = () => {
    // Check if there's state with a return path (from URL routing)
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      // Default to map root with any existing query params preserved
      const searchParams = new URLSearchParams(location.search);
      const queryString = searchParams.toString();
      navigate(queryString ? `/?${queryString}` : '/');
    }
  };

  return (
    <Button
      onClick={handleBackToMap}
      className="fixed top-2 left-2 sm:top-4 sm:left-4 z-[60] bg-[#0c4159] hover:bg-[#0a3549] text-white shadow-2xl border-2 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 animate-slide-in-left group"
      size="default"
    >
      <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
      <span className="font-['Arvo',_serif] hidden sm:inline">Volver al Mapa</span>
      <span className="font-['Arvo',_serif] sm:hidden">Mapa</span>
      <MapPin className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:scale-110" />
    </Button>
  );
}
