export interface DotPosition {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  color: string; // hex color for the dot
  clusterId: number; // which cluster this dot belongs to
}

export interface DotCluster {
  id: number;
  color: string;
  positions: DotPosition[];
  shape: 'triangle' | 'rectangle' | 'single';
}

// Color palette for clusters - high contrast and accessible
const CLUSTER_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#FFB347', // Orange
  '#98D8C8', // Mint
];

export const generateClusteredDotPattern = (count: number): DotPosition[] => {
  const clusters = createClusters(count);
  const allPositions: DotPosition[] = [];
  
  clusters.forEach(cluster => {
    const clusterPositions = generateClusterPositions(cluster);
    allPositions.push(...clusterPositions);
  });
  
  return allPositions;
};

const createClusters = (totalDots: number): DotCluster[] => {
  const clusters: DotCluster[] = [];
  let remainingDots = totalDots;
  let clusterId = 0;
  
  // Strategy: Create clusters of 3 or 4 dots when possible, singles for remainder
  while (remainingDots > 0) {
    let clusterSize: number;
    let shape: 'triangle' | 'rectangle' | 'single';
    
    if (remainingDots >= 4 && Math.random() > 0.3) {
      // 70% chance to create rectangle cluster if 4+ dots remain
      clusterSize = 4;
      shape = 'rectangle';
    } else if (remainingDots >= 3 && Math.random() > 0.4) {
      // 60% chance to create triangle cluster if 3+ dots remain
      clusterSize = 3;
      shape = 'triangle';
    } else {
      // Create single dots for remainder or by chance
      clusterSize = Math.min(remainingDots, 2);
      shape = 'single';
    }
    
    clusters.push({
      id: clusterId,
      color: CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length],
      positions: [],
      shape
    });
    
    remainingDots -= clusterSize;
    clusterId++;
  }
  
  return clusters;
};

const generateClusterPositions = (cluster: DotCluster): DotPosition[] => {
  const positions: DotPosition[] = [];
  const centerX = 20 + Math.random() * 60; // Keep clusters away from edges
  const centerY = 20 + Math.random() * 60;
  const clusterSize = getClusterSize(cluster.shape);
  
  if (cluster.shape === 'triangle') {
    // Generate triangle formation (3 dots)
    const radius = 8; // Distance from center
    const angles = [0, 120, 240]; // 120 degrees apart
    
    angles.forEach(angle => {
      const radian = (angle * Math.PI) / 180;
      positions.push({
        x: centerX + Math.cos(radian) * radius,
        y: centerY + Math.sin(radian) * radius,
        color: cluster.color,
        clusterId: cluster.id
      });
    });
    
  } else if (cluster.shape === 'rectangle') {
    // Generate rectangle formation (4 dots)
    const width = 12;
    const height = 8;
    
    const rectPositions = [
      { x: centerX - width/2, y: centerY - height/2 }, // Top-left
      { x: centerX + width/2, y: centerY - height/2 }, // Top-right
      { x: centerX - width/2, y: centerY + height/2 }, // Bottom-left
      { x: centerX + width/2, y: centerY + height/2 }  // Bottom-right
    ];
    
    rectPositions.forEach(pos => {
      positions.push({
        x: pos.x,
        y: pos.y,
        color: cluster.color,
        clusterId: cluster.id
      });
    });
    
  } else {
    // Single dots or pairs - spread them out
    const dotsInCluster = clusterSize;
    for (let i = 0; i < dotsInCluster; i++) {
      positions.push({
        x: centerX + (Math.random() - 0.5) * 15,
        y: centerY + (Math.random() - 0.5) * 15,
        color: cluster.color,
        clusterId: cluster.id
      });
    }
  }
  
  return positions;
};

const getClusterSize = (shape: 'triangle' | 'rectangle' | 'single'): number => {
  switch (shape) {
    case 'triangle': return 3;
    case 'rectangle': return 4;
    case 'single': return 1;
  }
};

// Ensure clusters don't overlap by checking minimum distances
const ensureClusterSeparation = (clusters: DotPosition[][]): DotPosition[][] => {
  const minClusterDistance = 25;
  const adjustedClusters: DotPosition[][] = [];
  
  clusters.forEach((cluster, index) => {
    let attempts = 0;
    let validPlacement = false;
    let adjustedCluster = [...cluster];
    
    while (!validPlacement && attempts < 20) {
      validPlacement = true;
      
      // Check against all previously placed clusters
      for (let i = 0; i < adjustedClusters.length; i++) {
        const existingCluster = adjustedClusters[i];
        
        // Check if any dot in current cluster is too close to existing cluster
        for (const dot1 of adjustedCluster) {
          for (const dot2 of existingCluster) {
            const distance = Math.sqrt(
              Math.pow(dot1.x - dot2.x, 2) + Math.pow(dot1.y - dot2.y, 2)
            );
            
            if (distance < minClusterDistance) {
              validPlacement = false;
              break;
            }
          }
          if (!validPlacement) break;
        }
        if (!validPlacement) break;
      }
      
      if (!validPlacement) {
        // Regenerate cluster position
        const newCenter = {
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60
        };
        
        // Adjust all dots in cluster relative to new center
        const oldCenter = {
          x: adjustedCluster.reduce((sum, dot) => sum + dot.x, 0) / adjustedCluster.length,
          y: adjustedCluster.reduce((sum, dot) => sum + dot.y, 0) / adjustedCluster.length
        };
        
        adjustedCluster = adjustedCluster.map(dot => ({
          ...dot,
          x: dot.x - oldCenter.x + newCenter.x,
          y: dot.y - oldCenter.y + newCenter.y
        }));
      }
      
      attempts++;
    }
    
    adjustedClusters.push(adjustedCluster);
  });
  
  return adjustedClusters;
};

// Main function that replaces the original generateDotPattern
export const generateDotPattern = (count: number): DotPosition[] => {
  return generateClusteredDotPattern(count);
};

// Alternative patterns for specific numbers to provide variety
export const generateAlternativeClusteredPattern = (count: number): DotPosition[] => {
  // For educational variety, sometimes use different clustering strategies
  const useAlternative = Math.random() > 0.7; // 30% chance for alternative
  
  if (!useAlternative) {
    return generateClusteredDotPattern(count);
  }
  
  // Alternative clustering strategies
  const clusters = createAlternativeClusters(count);
  const allPositions: DotPosition[] = [];
  
  clusters.forEach(cluster => {
    const clusterPositions = generateClusterPositions(cluster);
    allPositions.push(...clusterPositions);
  });
  
  return allPositions;
};

const createAlternativeClusters = (totalDots: number): DotCluster[] => {
  const clusters: DotCluster[] = [];
  let remainingDots = totalDots;
  let clusterId = 0;
  
  // Alternative strategy: Prefer triangles over rectangles
  while (remainingDots > 0) {
    let clusterSize: number;
    let shape: 'triangle' | 'rectangle' | 'single';
    
    if (remainingDots >= 3 && Math.random() > 0.2) {
      // 80% chance to create triangle cluster if 3+ dots remain
      clusterSize = 3;
      shape = 'triangle';
    } else if (remainingDots >= 4 && Math.random() > 0.5) {
      // 50% chance to create rectangle cluster if 4+ dots remain
      clusterSize = 4;
      shape = 'rectangle';
    } else {
      clusterSize = Math.min(remainingDots, 2);
      shape = 'single';
    }
    
    clusters.push({
      id: clusterId,
      color: CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length],
      positions: [],
      shape
    });
    
    remainingDots -= clusterSize;
    clusterId++;
  }
  
  return clusters;
};