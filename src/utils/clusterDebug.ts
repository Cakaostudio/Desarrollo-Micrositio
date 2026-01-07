/**
 * Cluster debugging and visualization utilities
 * Helps diagnose clustering behavior and performance
 */

import { Cluster } from './markerClustering';
import { Project } from '../types';

export interface ClusterStats {
  totalClusters: number;
  singleProjectClusters: number;
  multiProjectClusters: number;
  largestCluster: number;
  averageClusterSize: number;
  categoriesRepresented: number;
  clustersBySize: {
    size: number;
    count: number;
  }[];
}

/**
 * Calculate statistics about current clustering state
 * Useful for understanding clustering behavior
 */
export function getClusterStats(clusters: Cluster[]): ClusterStats {
  const singleProjectClusters = clusters.filter(c => c.projects.length === 1).length;
  const multiProjectClusters = clusters.filter(c => c.projects.length > 1).length;
  
  const clusterSizes = clusters.map(c => c.projects.length);
  const largestCluster = Math.max(...clusterSizes, 0);
  const averageClusterSize = clusterSizes.length > 0 
    ? clusterSizes.reduce((a, b) => a + b, 0) / clusterSizes.length 
    : 0;

  // Count unique categories
  const allCategories = new Set<string>();
  clusters.forEach(cluster => {
    cluster.projects.forEach(project => {
      allCategories.add(project.category);
    });
  });

  // Group clusters by size
  const sizeCounts: Record<number, number> = {};
  clusterSizes.forEach(size => {
    sizeCounts[size] = (sizeCounts[size] || 0) + 1;
  });
  
  const clustersBySize = Object.entries(sizeCounts)
    .map(([size, count]) => ({ size: parseInt(size), count }))
    .sort((a, b) => a.size - b.size);

  return {
    totalClusters: clusters.length,
    singleProjectClusters,
    multiProjectClusters,
    largestCluster,
    averageClusterSize,
    categoriesRepresented: allCategories.size,
    clustersBySize
  };
}

/**
 * Generate a human-readable report of cluster statistics
 * Perfect for console logging or debugging
 */
export function generateClusterReport(clusters: Cluster[], scale: number): string {
  const stats = getClusterStats(clusters);
  
  const report = `
╔═══════════════════════════════════════════════════════╗
║           CLUSTER ANALYSIS REPORT                     ║
╠═══════════════════════════════════════════════════════╣
║ Zoom Scale: ${scale.toFixed(2)}x                                    ║
║ Total Clusters: ${stats.totalClusters.toString().padEnd(35)}║
║ - Single project: ${stats.singleProjectClusters.toString().padEnd(32)}║
║ - Multi project: ${stats.multiProjectClusters.toString().padEnd(33)}║
║                                                       ║
║ Largest Cluster: ${stats.largestCluster.toString().padEnd(28)} projects║
║ Average Size: ${stats.averageClusterSize.toFixed(1).padEnd(29)} projects║
║ Categories: ${stats.categoriesRepresented.toString().padEnd(37)}║
╠═══════════════════════════════════════════════════════╣
║ CLUSTER SIZE DISTRIBUTION:                           ║
${stats.clustersBySize.map(({ size, count }) => 
  `║ Size ${size.toString().padStart(2)}: ${count.toString().padEnd(3)} cluster${count === 1 ? ' ' : 's'}                           ║`
).join('\n')}
╚═══════════════════════════════════════════════════════╝
  `.trim();
  
  return report;
}

/**
 * Log cluster information to console
 * Call this from InteractiveMap during development
 */
export function debugClusters(clusters: Cluster[], scale: number): void {
  console.group('🎯 Cluster Debug Info');
  console.log(generateClusterReport(clusters, scale));
  
  console.log('\n📊 Detailed Cluster Breakdown:');
  clusters.forEach((cluster, index) => {
    if (cluster.projects.length > 1) {
      console.log(`\nCluster #${index + 1} (${cluster.projects.length} projects):`);
      console.log('  Position:', { x: cluster.x.toFixed(0), y: cluster.y.toFixed(0) });
      console.log('  Projects:', cluster.projects.map(p => p.name).join(', '));
      console.log('  Categories:', [...new Set(cluster.projects.map(p => p.category))].join(', '));
    }
  });
  
  console.groupEnd();
}

/**
 * Find clusters that might be too large or need manual review
 * Returns clusters that exceed threshold size
 */
export function findLargeClusters(clusters: Cluster[], threshold: number = 10): Cluster[] {
  return clusters
    .filter(c => c.projects.length >= threshold)
    .sort((a, b) => b.projects.length - a.projects.length);
}

/**
 * Analyze geographic distribution of clusters
 * Helps identify dense areas that might need attention
 */
export function analyzeClusterDensity(clusters: Cluster[]): {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
  center: number;
} {
  const mapWidth = 2638;
  const mapHeight = 1822;
  
  const quadrants = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
    center: 0
  };

  clusters.forEach(cluster => {
    const x = cluster.x;
    const y = cluster.y;
    
    // Determine quadrant
    const isLeft = x < mapWidth / 3;
    const isRight = x > (mapWidth * 2) / 3;
    const isTop = y < mapHeight / 3;
    const isBottom = y > (mapHeight * 2) / 3;
    
    if (isLeft && isTop) {
      quadrants.topLeft++;
    } else if (isRight && isTop) {
      quadrants.topRight++;
    } else if (isLeft && isBottom) {
      quadrants.bottomLeft++;
    } else if (isRight && isBottom) {
      quadrants.bottomRight++;
    } else {
      quadrants.center++;
    }
  });

  return quadrants;
}

/**
 * Validate cluster integrity
 * Ensures no projects are lost during clustering
 */
export function validateClusters(clusters: Cluster[], originalProjects: Project[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Count total projects in clusters
  const clusteredProjectCount = clusters.reduce(
    (sum, cluster) => sum + cluster.projects.length,
    0
  );
  
  if (clusteredProjectCount !== originalProjects.length) {
    errors.push(
      `Project count mismatch: ${originalProjects.length} original, ${clusteredProjectCount} in clusters`
    );
  }
  
  // Check for duplicate projects
  const projectIds = new Set<string>();
  clusters.forEach(cluster => {
    cluster.projects.forEach(project => {
      if (projectIds.has(project.id)) {
        errors.push(`Duplicate project in clusters: ${project.id}`);
      }
      projectIds.add(project.id);
    });
  });
  
  // Check for missing projects
  originalProjects.forEach(project => {
    if (!projectIds.has(project.id)) {
      errors.push(`Missing project: ${project.id} - ${project.name}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Performance monitoring for clustering
 * Measures how long clustering takes
 */
export function measureClusteringPerformance<T>(
  fn: () => T,
  label: string = 'Clustering'
): { result: T; duration: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;
  
  console.log(`⚡ ${label} took ${duration.toFixed(2)}ms`);
  
  return { result, duration };
}

/**
 * Export cluster data for analysis in external tools
 * Returns JSON-formatted cluster information
 */
export function exportClusterData(clusters: Cluster[]): string {
  const exportData = clusters.map(cluster => ({
    id: cluster.id,
    position: { x: cluster.x, y: cluster.y },
    projectCount: cluster.projects.length,
    projects: cluster.projects.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      state: p.state
    })),
    bounds: cluster.bounds,
    categories: [...new Set(cluster.projects.map(p => p.category))]
  }));

  return JSON.stringify(exportData, null, 2);
}

/**
 * Compare two clustering states
 * Useful for debugging filter changes
 */
export function compareClusters(
  before: Cluster[],
  after: Cluster[]
): {
  added: number;
  removed: number;
  changed: number;
  stable: number;
} {
  const beforeIds = new Set(before.map(c => c.id));
  const afterIds = new Set(after.map(c => c.id));
  
  const added = after.filter(c => !beforeIds.has(c.id)).length;
  const removed = before.filter(c => !afterIds.has(c.id)).length;
  
  // Find clusters that exist in both but changed size
  const changed = after.filter(afterCluster => {
    const beforeCluster = before.find(b => b.id === afterCluster.id);
    return beforeCluster && beforeCluster.projects.length !== afterCluster.projects.length;
  }).length;
  
  const stable = after.length - added - changed;

  return { added, removed, changed, stable };
}
