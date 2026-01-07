/**
 * Category color mapping for project markers
 * Each category gets a distinct, vibrant color for easy visual identification
 */

export interface CategoryColor {
  primary: string;      // Main marker color
  hover: string;        // Hover state color
  glow: string;         // Glow/shadow effect
  label: string;        // Display label
}

export const categoryColors: Record<string, CategoryColor> = {
  'participacion-ciudadana': {
    primary: '#3b82f6',      // Blue
    hover: '#2563eb',
    glow: 'rgba(59, 130, 246, 0.4)',
    label: 'Participación Ciudadana'
  },
  'educacion-para-la-paz': {
    primary: '#22c55e',      // Green
    hover: '#16a34a',
    glow: 'rgba(34, 197, 94, 0.4)',
    label: 'Educación para la Paz'
  },
  'transparencia': {
    primary: '#eab308',      // Yellow
    hover: '#ca8a04',
    glow: 'rgba(234, 179, 8, 0.4)',
    label: 'Transparencia'
  },
  'rendicion-de-cuentas': {
    primary: '#a855f7',      // Purple
    hover: '#9333ea',
    glow: 'rgba(168, 85, 247, 0.4)',
    label: 'Rendición de Cuentas'
  },
  'derechos-humanos': {
    primary: '#ef4444',      // Red
    hover: '#dc2626',
    glow: 'rgba(239, 68, 68, 0.4)',
    label: 'Derechos Humanos'
  },
  'justicia-social': {
    primary: '#f97316',      // Orange
    hover: '#ea580c',
    glow: 'rgba(249, 115, 22, 0.4)',
    label: 'Justicia Social'
  },
  'medio-ambiente': {
    primary: '#10b981',      // Emerald
    hover: '#059669',
    glow: 'rgba(16, 185, 129, 0.4)',
    label: 'Medio Ambiente'
  },
  'desarrollo-comunitario': {
    primary: '#06b6d4',      // Cyan
    hover: '#0891b2',
    glow: 'rgba(6, 182, 212, 0.4)',
    label: 'Desarrollo Comunitario'
  },
  'default': {
    primary: '#6366f1',      // Indigo (fallback)
    hover: '#4f46e5',
    glow: 'rgba(99, 102, 241, 0.4)',
    label: 'Otro'
  }
};

/**
 * Get color configuration for a category
 * Returns default color if category not found
 */
export function getCategoryColor(category: string): CategoryColor {
  return categoryColors[category] || categoryColors['default'];
}

/**
 * Get all unique categories with their colors
 * Useful for building the legend
 */
export function getAllCategoryColors(): Array<{ category: string; color: CategoryColor }> {
  return Object.entries(categoryColors)
    .filter(([key]) => key !== 'default')
    .map(([category, color]) => ({ category, color }));
}
