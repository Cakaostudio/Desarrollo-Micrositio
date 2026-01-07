import { Project } from '../types';

export interface ClusterPoint {
  x: number;
  y: number;
  project: Project;
}

export interface Cluster {
  id: string;
  x: number;
  y: number;
  projects: Project[];
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

/**
 * Calculate clusters of nearby markers based on zoom level
 * Uses a simple grid-based clustering algorithm
 */
export function clusterMarkers(
  projects: Project[],
  scale: number,
  mapWidth: number = 2638,
  mapHeight: number = 1822
): Cluster[] {
  // At high zoom levels (scale > 1.5), don't cluster
  if (scale > 1.5) {
    return projects.map(project => {
      const x = project.location?.x ? (project.location.x / 100) * mapWidth : mapWidth / 2;
      const y = project.location?.y ? (project.location.y / 100) * mapHeight : mapHeight / 2;
      
      return {
        id: project.id,
        x,
        y,
        projects: [project],
        bounds: { minX: x, maxX: x, minY: y, maxY: y }
      };
    });
  }

  // Calculate cluster distance based on zoom level
  // Lower zoom = larger clusters
  const clusterDistance = getClusterDistance(scale);

  // Convert projects to points
  const points: ClusterPoint[] = projects.map(project => {
    const x = project.location?.x ? (project.location.x / 100) * mapWidth : mapWidth / 2;
    const y = project.location?.y ? (project.location.y / 100) * mapHeight : mapHeight / 2;
    
    return { x, y, project };
  });

  // Group points into clusters
  const clusters: Cluster[] = [];
  const processed = new Set<string>();

  points.forEach(point => {
    if (processed.has(point.project.id)) return;

    // Find all nearby points
    const nearbyPoints = points.filter(p => {
      if (processed.has(p.project.id)) return false;
      const distance = Math.sqrt(
        Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2)
      );
      return distance <= clusterDistance;
    });

    // Mark all nearby points as processed
    nearbyPoints.forEach(p => processed.add(p.project.id));

    // Calculate cluster center (centroid)
    const centerX = nearbyPoints.reduce((sum, p) => sum + p.x, 0) / nearbyPoints.length;
    const centerY = nearbyPoints.reduce((sum, p) => sum + p.y, 0) / nearbyPoints.length;

    // Calculate bounds
    const xs = nearbyPoints.map(p => p.x);
    const ys = nearbyPoints.map(p => p.y);
    
    clusters.push({
      id: `cluster-${clusters.length}`,
      x: centerX,
      y: centerY,
      projects: nearbyPoints.map(p => p.project),
      bounds: {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys)
      }
    });
  });

  return clusters;
}

/**
 * Get cluster distance threshold based on zoom level
 * Returns distance in pixels at which markers should be clustered
 */
function getClusterDistance(scale: number): number {
  // Scale ranges from ~0.6 (zoomed out) to 3+ (zoomed in)
  if (scale < 0.8) return 200;  // Very zoomed out - large clusters
  if (scale < 1.0) return 150;  // Zoomed out - medium clusters
  if (scale < 1.2) return 100;  // Slightly zoomed - small clusters
  if (scale < 1.5) return 60;   // Normal zoom - tiny clusters
  return 0;                      // Zoomed in - no clustering
}

/**
 * Get the dominant category in a cluster (most common)
 */
export function getDominantCategory(projects: Project[]): string {
  const categoryCounts: Record<string, number> = {};
  
  projects.forEach(project => {
    categoryCounts[project.category] = (categoryCounts[project.category] || 0) + 1;
  });

  let dominantCategory = projects[0]?.category || 'default';
  let maxCount = 0;

  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantCategory = category;
    }
  });

  return dominantCategory;
}

/**
 * Check if a cluster should be expanded (clicked)
 */
export function shouldExpandCluster(cluster: Cluster): boolean {
  return cluster.projects.length > 1;
}
