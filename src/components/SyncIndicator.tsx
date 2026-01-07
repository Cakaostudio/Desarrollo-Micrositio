import React from 'react';
import { Cloud, CloudOff } from 'lucide-react';

interface SyncIndicatorProps {
  isSyncing: boolean;
}

/**
 * Shows cloud sync status indicator
 */
export function SyncIndicator({ isSyncing }: SyncIndicatorProps) {
  if (!isSyncing) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 animate-slide-in-down">
      <Cloud className="w-4 h-4 text-blue-500 animate-pulse" />
      <span className="text-sm font-['Arvo',_serif] text-gray-700">
        Sincronizando...
      </span>
    </div>
  );
}
