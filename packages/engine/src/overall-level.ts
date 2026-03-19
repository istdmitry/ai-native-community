/**
 * Overall level computation
 *
 * Overall level = MIN(all 5 pillars, L1-L6 only)
 * L7 is a horizon marker and never drives overall level
 */

import type { PillarScore } from './types';

const MAX_LEVEL = 6; // L7 is horizon only

/**
 * Computes overall level from pillar scores
 *
 * Rules:
 * - Takes minimum level across all pillars
 * - Caps at L6 (L7 is horizon only)
 * - If any pillar is L1, overall is L1
 *
 * @param pillarScores - Scores for all pillars (public + gated)
 * @returns Overall level (1-6)
 *
 * @example
 * ```ts
 * const overall = computeOverallLevel({
 *   context_system: { level: 3, ... },
 *   orchestration_load: { level: 2, ... },
 *   verification_control: { level: 4, ... },
 *   codification_reuse: { level: 5, ... },
 *   personal_fit: { level: 4, ... },
 * });
 * // Returns 2 (minimum)
 * ```
 */
export function computeOverallLevel(
  pillarScores: Record<string, PillarScore>
): number {
  const levels = Object.values(pillarScores).map((score) => score.level);

  if (levels.length === 0) {
    return 1; // Default to L1 if no pillars
  }

  // Find minimum, capped at L6
  const minLevel = Math.min(...levels);
  return Math.min(minLevel, MAX_LEVEL);
}

/**
 * Checks if the weakest pillar (overall level) is gated
 *
 * Used to determine if UI should show:
 * "Your overall constraint sits in an advanced pillar covered in the full report."
 *
 * @param overallLevel - Computed overall level
 * @param gatedPillars - Gated pillar scores
 * @returns True if any gated pillar is at overall level
 */
export function isWeakestPillarGated(
  overallLevel: number,
  gatedPillars: Record<string, PillarScore>
): boolean {
  return Object.values(gatedPillars).some(
    (score) => score.level === overallLevel
  );
}
