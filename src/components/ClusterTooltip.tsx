import React from 'react';
import { Cluster, getDominantCategory } from '../utils/markerClustering';
import { getCategoryColor } from '../utils/categoryColors';

interface ClusterTooltipProps {
  cluster: Cluster;
  position: { x: number; y: number };
  scale: number;
}

/**
 * Enhanced tooltip shown when hovering over a cluster
 * Displays project count with smooth animations and modern styling
 */
export function ClusterTooltip({ cluster, position, scale }: ClusterTooltipProps) {
  const dominantCategory = getDominantCategory(cluster.projects);
  const categoryColor = getCategoryColor(dominantCategory);
  
  // Count projects by category
  const categoryCounts: Record<string, number> = {};
  cluster.projects.forEach(project => {
    categoryCounts[project.category] = (categoryCounts[project.category] || 0) + 1;
  });

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%) translateY(-100%)',
        transformOrigin: 'bottom center',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'tooltipAppear 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      }}
    >
      {/* Glow effect behind tooltip */}
      <div 
        className="absolute inset-0 rounded-lg opacity-40 blur-xl"
        style={{ 
          background: `radial-gradient(circle at center, ${categoryColor.glow}, transparent 70%)`,
          transform: `scale(${1 / scale})`,
          transformOrigin: 'bottom center',
          transition: 'all 0.3s ease-out'
        }}
      />
      
      {/* Main tooltip content */}
      <div 
        className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border-2 px-5 py-3 mb-3 overflow-hidden"
        style={{ 
          borderColor: categoryColor.primary,
          transform: `scale(${1 / scale})`,
          transformOrigin: 'bottom center',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px ${categoryColor.primary}20`
        }}
      >
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(135deg, ${categoryColor.primary}, transparent)`
          }}
        />
        
        {/* Content */}
        <div className="relative">
          {/* Header with count */}
          <div className="flex items-center gap-2.5 mb-2">
            {/* Animated dot with pulse */}
            <div className="relative flex items-center justify-center">
              <div
                className="w-3 h-3 rounded-full relative z-10"
                style={{ 
                  backgroundColor: categoryColor.primary,
                  boxShadow: `0 0 8px ${categoryColor.primary}60`
                }}
              />
              {/* Pulse ring */}
              <div
                className="absolute inset-0 w-3 h-3 rounded-full opacity-75"
                style={{ 
                  backgroundColor: categoryColor.primary,
                  animation: 'tooltipPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
            </div>
            
            <p className="font-['Arvo',_serif] text-gray-900 whitespace-nowrap">
              <span className="font-bold">{cluster.projects.length}</span> proyectos
            </p>
          </div>
          
          {/* Instruction text */}
          <div className="flex items-center gap-1.5">
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-gray-500 flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <p className="font-['Arvo',_serif] text-xs text-gray-600">
              Click para explorar
            </p>
          </div>
        </div>
      </div>
      
      {/* Enhanced arrow pointing down */}
      <div 
        className="relative mx-auto"
        style={{
          width: 0,
          height: 0,
          transform: `scale(${1 / scale})`,
          transformOrigin: 'top center',
          transition: 'all 0.2s ease-out'
        }}
      >
        {/* Arrow shadow */}
        <div 
          className="absolute"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid rgba(0, 0, 0, 0.1)',
            filter: 'blur(2px)',
            top: '2px'
          }}
        />
        {/* Main arrow */}
        <div 
          style={{
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `10px solid ${categoryColor.primary}`
          }}
        />
      </div>
    </div>
  );
}
