import React from 'react';
import { Skeleton } from './ui/skeleton';

/**
 * Loading skeleton for search suggestions
 * Shows while search results are being computed
 */
export function SearchSuggestionSkeleton() {
  return (
    <div className="px-3 py-2 flex items-start gap-3">
      <Skeleton className="w-5 h-5 rounded flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/**
 * Multiple search suggestion skeletons
 */
export function SearchSuggestionsLoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="py-2">
      <div className="px-3 py-2">
        <Skeleton className="h-3 w-32 mb-3" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <SearchSuggestionSkeleton key={i} />
      ))}
    </div>
  );
}
