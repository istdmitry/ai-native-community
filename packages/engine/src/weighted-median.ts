/**
 * Weighted median calculation for pillar scoring
 *
 * Algorithm:
 * 1. Sort evidence points by level
 * 2. Compute cumulative weights
 * 3. Find level where cumulative weight reaches 50% of total
 */

import type { Evidence } from './types';

/**
 * Computes weighted median level from evidence points
 *
 * @param evidence - Array of evidence points
 * @returns Weighted median level (rounded to integer)
 *
 * @example
 * ```ts
 * const evidence = [
 *   { pillar: 'context_system', level: 2, weight: 1.0, scope: 'public' },
 *   { pillar: 'context_system', level: 3, weight: 0.7, scope: 'public' },
 *   { pillar: 'context_system', level: 3, weight: 1.5, scope: 'public' },
 * ];
 * const median = computeWeightedMedian(evidence); // Returns 3
 * ```
 */
export function computeWeightedMedian(evidence: Evidence[]): number {
  if (evidence.length === 0) {
    return 1; // Default to L1 if no evidence
  }

  // Single evidence point
  if (evidence.length === 1) {
    return evidence[0].level;
  }

  // Sort by level (ascending)
  const sorted = [...evidence].sort((a, b) => a.level - b.level);

  // Compute total weight
  const totalWeight = sorted.reduce((sum, e) => sum + e.weight, 0);
  const halfWeight = totalWeight / 2;

  // Find median by cumulative weight
  let cumulativeWeight = 0;
  for (const point of sorted) {
    cumulativeWeight += point.weight;
    if (cumulativeWeight >= halfWeight) {
      return point.level;
    }
  }

  // Fallback (should never happen)
  return sorted[Math.floor(sorted.length / 2)].level;
}

/**
 * Computes dispersion (range) of evidence levels
 *
 * @param evidence - Array of evidence points
 * @returns max_level - min_level
 */
export function computeDispersion(evidence: Evidence[]): number {
  if (evidence.length === 0) return 0;

  const levels = evidence.map((e) => e.level);
  return Math.max(...levels) - Math.min(...levels);
}
