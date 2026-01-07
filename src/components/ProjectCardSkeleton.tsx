import React from 'react';
import { Skeleton } from './ui/skeleton';

/**
 * Loading skeleton for project preview cards
 * Used in the ProjectPreviewPanel while projects are loading
 */
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="w-full h-32 sm:h-40 rounded-none" />
      
      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Organization */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Category badge */}
        <Skeleton className="h-5 w-24 rounded-full" />
        
        {/* Description lines */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        
        {/* Footer with state */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Compact skeleton for list view in preview panel
 */
export function ProjectListItemSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 border-b border-gray-100 last:border-0">
      {/* Small image */}
      <Skeleton className="w-16 h-16 rounded flex-shrink-0" />
      
      {/* Content */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Multiple skeletons for grid layout
 */
export function ProjectGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Multiple skeletons for list layout
 */
export function ProjectListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectListItemSkeleton key={i} />
      ))}
    </div>
  );
}
