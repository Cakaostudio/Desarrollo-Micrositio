import React, { memo } from 'react';
import { Cluster, getDominantCategory } from '../utils/markerClustering';
import { getCategoryColor } from '../utils/categoryColors';

interface ClusterMarkerProps {
  cluster: Cluster;
  scale: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isHovered: boolean;
}

/**
 * Cluster marker component - shows multiple projects grouped together
 * Displays count badge and uses dominant category color
 */
// Memoize cluster markers for better performance with many markers
export const ClusterMarker = memo(function ClusterMarker({
  cluster,
  scale,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isHovered
}: ClusterMarkerProps) {
  const projectCount = cluster.projects.length;
  const dominantCategory = getDominantCategory(cluster.projects);
  const categoryColor = getCategoryColor(dominantCategory);

  // Single project - not a cluster
  if (projectCount === 1) {
    return null;
  }

  // Calculate size based on project count
  const baseSize = 32;
  const sizeMultiplier = Math.min(1 + (projectCount / 20), 2); // Max 2x size
  const size = baseSize * sizeMultiplier;

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 animate-marker-appear"
      style={{ 
        left: `${cluster.x}px`, 
        top: `${cluster.y}px`,
      }}
    >
      {/* Hover glow effect */}
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-full opacity-60 animate-pulse-glow"
          style={{
            transform: `translate(-50%, -50%) scale(${1 / scale})`,
            backgroundColor: categoryColor.glow,
            boxShadow: `0 0 30px ${categoryColor.glow}`,
            width: `${size + 20}px`,
            height: `${size + 20}px`,
          }}
        />
      )}

      {/* Main cluster circle */}
      <div
        className="relative transition-all duration-300 ease-out hover:scale-110 active:scale-95 touch-feedback touch-smooth mobile-tap-target"
        style={{
          transform: `scale(${1 / scale}) ${isHovered ? 'translateY(-2px)' : 'translateY(0)'}`,
          transformOrigin: 'center',
          filter: isHovered 
            ? `drop-shadow(0 8px 16px ${categoryColor.glow}80) drop-shadow(0 0 12px ${categoryColor.glow})` 
            : 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Outer ring */}
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: isHovered ? categoryColor.hover : categoryColor.primary,
            border: '3px solid white',
            boxShadow: isHovered 
              ? `0 8px 20px rgba(0,0,0,0.25), 0 0 0 4px ${categoryColor.glow}30`
              : '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Count badge */}
          <span 
            className="font-['Arvo',_serif] text-white select-none transition-all duration-300"
            style={{
              fontSize: `${Math.min(14 + (sizeMultiplier * 2), 20)}px`,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {projectCount}
          </span>
        </div>

        {/* Pulse ring animation */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-full border-2 animate-ping"
            style={{
              borderColor: categoryColor.primary,
              opacity: 0.5,
              animationDuration: '1.5s'
            }}
          />
        )}
      </div>
    </div>
  );
});
