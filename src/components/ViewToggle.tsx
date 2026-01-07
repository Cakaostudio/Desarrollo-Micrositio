import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Layers, ScrollText } from 'lucide-react';

/**
 * Toggle button to switch between traditional and stacked card views
 * Appears as a floating button on project detail pages
 */
export function ViewToggle() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  
  const isStackedView = searchParams.get('view') === 'stacked';

  const toggleView = () => {
    if (!projectId) return;
    
    const newPath = isStackedView
      ? `/proyecto/${projectId}` // Switch to traditional
      : `/proyecto/${projectId}?view=stacked`; // Switch to stacked
    
    navigate(newPath, { replace: true });
  };

  return (
    <button
      onClick={toggleView}
      className="
        fixed bottom-6 right-6 z-50
        bg-white hover:bg-gray-50
        border-2 border-[#0c4159]
        text-[#0c4159] hover:text-[#ff8012] hover:border-[#ff8012]
        rounded-full
        px-4 py-3
        shadow-lg hover:shadow-xl
        transition-all duration-200
        flex items-center gap-2
        font-['Arvo',_serif]
        group
      "
      aria-label={isStackedView ? 'Cambiar a vista tradicional' : 'Cambiar a vista de tarjetas'}
      title={isStackedView ? 'Vista tradicional' : 'Vista de tarjetas apiladas'}
    >
      {isStackedView ? (
        <>
          <ScrollText className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Vista tradicional</span>
        </>
      ) : (
        <>
          <Layers className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Vista de tarjetas</span>
        </>
      )}
    </button>
  );
}
