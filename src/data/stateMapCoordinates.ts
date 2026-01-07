/**
 * State coordinates mapped directly to percentage positions on the SVG map
 * These are visual coordinates on the map itself (not geographic lat/lng)
 * Format: { x: horizontal %, y: vertical % }
 * x: 0% = left edge, 100% = right edge
 * y: 0% = top edge, 100% = bottom edge
 */

/**
 * Mapping from state names to SVG path IDs
 */
export const STATE_SVG_IDS: Record<string, string> = {
  'Aguascalientes': 'MXAGU',
  'Baja California': 'MXBCN',
  'Baja California Sur': 'MXBCS',
  'Campeche': 'MXCAM',
  'Chiapas': 'MXCHP',
  'Chihuahua': 'MXCHH',
  'Ciudad de México': 'MXCMX',
  'Coahuila': 'MXCOA',
  'Colima': 'MXCOL',
  'Durango': 'MXDUR',
  'Estado de México': 'MXMEX',
  'Guanajuato': 'MXGUA',
  'Guerrero': 'MXGRO',
  'Hidalgo': 'MXHID',
  'Jalisco': 'MXJAL',
  'Michoacán': 'MXMIC',
  'Morelos': 'MXMOR',
  'Nayarit': 'MXNAY',
  'Nuevo León': 'MXNLE',
  'Oaxaca': 'MXOAX',
  'Puebla': 'MXPUE',
  'Querétaro': 'MXQUE',
  'Quintana Roo': 'MXROO',
  'San Luis Potosí': 'MXSLP',
  'Sinaloa': 'MXSIN',
  'Sonora': 'MXSON',
  'Tabasco': 'MXTAB',
  'Tamaulipas': 'MXTAM',
  'Tlaxcala': 'MXTLA',
  'Veracruz': 'MXVER',
  'Yucatán': 'MXYUC',
  'Zacatecas': 'MXZAC',
};

export const STATE_MAP_POSITIONS: Record<string, { x: number, y: number }> = {
  // Northern States
  'Baja California': { x: 8, y: 15 },
  'Baja California Sur': { x: 12, y: 35 },
  'Sonora': { x: 18, y: 22 },
  'Chihuahua': { x: 28, y: 25 },
  'Coahuila': { x: 38, y: 28 },
  'Nuevo León': { x: 42, y: 32 },
  'Tamaulipas': { x: 45, y: 35 },
  
  // Northwest States
  'Sinaloa': { x: 25, y: 38 },
  'Durango': { x: 32, y: 38 },
  'Zacatecas': { x: 37, y: 43 },
  'San Luis Potosí': { x: 43, y: 45 },
  
  // Central-West States
  'Nayarit': { x: 30, y: 48 },
  'Aguascalientes': { x: 37, y: 48 },
  'Jalisco': { x: 33, y: 52 },
  'Guanajuato': { x: 40, y: 50 },
  'Querétaro': { x: 43, y: 52 },
  'Colima': { x: 32, y: 56 },
  'Michoacán': { x: 37, y: 56 },
  
  // Central States
  'Hidalgo': { x: 46, y: 52 },
  'Estado de México': { x: 44, y: 56 },
  'Ciudad de México': { x: 44, y: 57 },
  'Morelos': { x: 45, y: 58 },
  'Tlaxcala': { x: 47, y: 55 },
  'Puebla': { x: 48, y: 57 },
  
  // South-Central States  
  'Guerrero': { x: 42, y: 62 },
  'Oaxaca': { x: 50, y: 65 },
  'Veracruz': { x: 50, y: 55 },
  
  // Southern States
  'Chiapas': { x: 58, y: 70 },
  'Tabasco': { x: 58, y: 63 },
  'Campeche': { x: 65, y: 60 },
  'Yucatán': { x: 70, y: 52 },
  'Quintana Roo': { x: 73, y: 57 },
};

/**
 * Geographic coordinates for reference and fallback
 */
export const STATE_GEO_COORDS: Record<string, { lat: number, lng: number }> = {
  'Aguascalientes': { lat: 21.8853, lng: -102.2916 },
  'Baja California': { lat: 30.8406, lng: -115.2838 },
  'Baja California Sur': { lat: 26.0444, lng: -111.6661 },
  'Campeche': { lat: 19.8301, lng: -90.5349 },
  'Chiapas': { lat: 16.7569, lng: -93.1292 },
  'Chihuahua': { lat: 28.6330, lng: -106.0691 },
  'Ciudad de México': { lat: 19.4326, lng: -99.1332 },
  'Coahuila': { lat: 27.0587, lng: -101.7068 },
  'Colima': { lat: 19.2452, lng: -103.7241 },
  'Durango': { lat: 24.5593, lng: -104.6591 },
  'Estado de México': { lat: 19.2826, lng: -99.6559 },
  'Guanajuato': { lat: 21.0190, lng: -101.2574 },
  'Guerrero': { lat: 17.4392, lng: -99.5451 },
  'Hidalgo': { lat: 20.0911, lng: -98.7624 },
  'Jalisco': { lat: 20.6595, lng: -103.3494 },
  'Michoacán': { lat: 19.5665, lng: -101.7068 },
  'Morelos': { lat: 18.6813, lng: -99.1013 },
  'Nayarit': { lat: 21.7514, lng: -104.8455 },
  'Nuevo León': { lat: 25.5922, lng: -99.9962 },
  'Oaxaca': { lat: 17.0732, lng: -96.7266 },
  'Puebla': { lat: 19.0414, lng: -98.2063 },
  'Querétaro': { lat: 20.5888, lng: -100.3899 },
  'Quintana Roo': { lat: 19.1817, lng: -88.4791 },
  'San Luis Potosí': { lat: 22.1565, lng: -100.9855 },
  'Sinaloa': { lat: 25.0000, lng: -107.5000 },
  'Sonora': { lat: 29.2972, lng: -110.3309 },
  'Tabasco': { lat: 17.8409, lng: -92.6189 },
  'Tamaulipas': { lat: 24.2669, lng: -98.8363 },
  'Tlaxcala': { lat: 19.3139, lng: -98.2404 },
  'Veracruz': { lat: 19.1738, lng: -96.1342 },
  'Yucatán': { lat: 20.7099, lng: -89.0943 },
  'Zacatecas': { lat: 22.7709, lng: -102.5832 },
};

// SVG viewBox dimensions
export const SVG_WIDTH = 2400;
export const SVG_HEIGHT = 1658;

/**
 * Convert percentage coordinates to SVG coordinates
 */
export function percentToSVG(percentX: number, percentY: number): { x: number, y: number } {
  return {
    x: (percentX / 100) * SVG_WIDTH,
    y: (percentY / 100) * SVG_HEIGHT
  };
}

/**
 * Convert SVG coordinates to percentage coordinates
 */
export function svgToPercent(svgX: number, svgY: number): { x: number, y: number } {
  return {
    x: (svgX / SVG_WIDTH) * 100,
    y: (svgY / SVG_HEIGHT) * 100
  };
}

/**
 * Get SVG coordinates for a state
 */
export function getStateSVGCoords(state: string): { x: number, y: number } {
  const percentCoords = STATE_MAP_POSITIONS[state];
  if (!percentCoords) {
    return { x: SVG_WIDTH / 2, y: SVG_HEIGHT / 2 }; // Default to center
  }
  return percentToSVG(percentCoords.x, percentCoords.y);
}

/**
 * Generate random offset within state boundaries for multiple projects
 */
export function generateStateOffset(basePosition: { x: number, y: number }, index: number = 0): { x: number, y: number } {
  // Create slight variations so multiple pins in same state don't overlap
  const offsetRange = 2; // +/- 2% variation
  const angle = (index * 137.5) % 360; // Golden angle for even distribution
  const distance = (Math.random() * offsetRange);
  
  const offsetX = Math.cos(angle * Math.PI / 180) * distance;
  const offsetY = Math.sin(angle * Math.PI / 180) * distance;
  
  return {
    x: Math.min(Math.max(basePosition.x + offsetX, 0), 100),
    y: Math.min(Math.max(basePosition.y + offsetY, 0), 100)
  };
}
