import React from 'react';
import { Skeleton } from './ui/skeleton';

/**
 * Loading skeleton for project detail page
 * Shows while project data is loading for better perceived performance
 */
export function ProjectDetailSkeleton() {
  return (
    <div className="bg-white w-full min-h-screen">
      {/* Header section with image placeholder */}
      <div className="relative w-full">
        {/* Top navigation bar placeholder */}
        <div className="absolute top-3 sm:top-[21px] left-0 right-0 z-50 px-3 sm:px-[20px] flex justify-end items-center">
          <Skeleton className="h-7 w-20 rounded-md" />
        </div>

        {/* Header content */}
        <div className="flex flex-col">
          {/* Spacer for top nav */}
          <div className="h-20 sm:h-[155px]" />

          {/* Project title skeleton */}
          <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-6 sm:py-8 space-y-4">
            <Skeleton className="h-10 sm:h-12 w-3/4 max-w-2xl" />
            <Skeleton className="h-6 w-1/2 max-w-md" />
          </div>

          {/* Hero image placeholder */}
          <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-4">
            <Skeleton className="w-full h-64 sm:h-80 md:h-96 rounded-lg" />
          </div>

          {/* Metadata bar */}
          <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12 space-y-12">
        {/* Key Metrics Section */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          
          {/* Three column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-56" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Problem Statement */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* Proposed Solution */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-56" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Objectives and Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-52" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Additional sections */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>

      {/* Footer placeholder */}
      <div className="border-t border-gray-200 mt-12">
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-8">
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
