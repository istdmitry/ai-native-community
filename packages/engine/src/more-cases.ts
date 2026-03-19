/**
 * More cases selection algorithm
 *
 * Selects next cases to improve scoring confidence by targeting
 * least confident pillars
 */

import type { PillarScore, MoreCasesSelection, PillarPool } from './types';

/**
 * Selects two least confident pillars
 *
 * Priority:
 * 1. Lowest evidence count
 * 2. Highest dispersion (as tiebreaker)
 *
 * @param pillarScores - All pillar scores
 * @returns Array of 2 pillar IDs (or fewer if < 2 pillars)
 */
function selectLeastConfidentPillars(
  pillarScores: Record<string, PillarScore>
): string[] {
  const scores = Object.values(pillarScores);

  // Sort by evidence count (asc), then dispersion (desc)
  const sorted = [...scores].sort((a, b) => {
    if (a.evidence_count !== b.evidence_count) {
      return a.evidence_count - b.evidence_count; // Fewer evidence = less confident
    }
    return b.dispersion - a.dispersion; // Higher dispersion = less confident
  });

  // Return top 2
  return sorted.slice(0, 2).map((s) => s.pillar);
}

/**
 * Selects next cases for "more cases" round
 *
 * Algorithm:
 * 1. Find 2 least confident pillars
 * 2. Pull unseen cases from those pillar pools
 * 3. Fill remaining slots from public pillars
 * 4. Never select L7 horizon cases
 *
 * @param pillarScores - Current pillar scores
 * @param pillarPools - Available cases by pillar
 * @param seenCaseIds - Set of already-answered case IDs
 * @param maxCases - Maximum cases to select (default: 6)
 * @returns Selected case IDs with selection reason
 *
 * @example
 * ```ts
 * const selection = selectMoreCases(
 *   pillarScores,
 *   {
 *     context_system: ['case.3A', 'case.3C'],
 *     orchestration_load: ['case.4B'],
 *     ...
 *   },
 *   new Set(['case.2C', 'case.3B']),
 *   6
 * );
 * // { case_ids: ['case.3A', 'case.4B', ...], reason: 'Targeting...' }
 * ```
 */
export function selectMoreCases(
  pillarScores: Record<string, PillarScore>,
  pillarPools: Record<string, string[]>,
  seenCaseIds: Set<string>,
  maxCases = 6
): MoreCasesSelection {
  const selected: string[] = [];

  // Step 1: Find 2 least confident pillars
  const targetPillars = selectLeastConfidentPillars(pillarScores);

  // Step 2: Pull unseen cases from target pillars
  for (const pillar of targetPillars) {
    const pool = pillarPools[pillar] || [];
    const unseen = pool.filter((caseId) => !seenCaseIds.has(caseId));

    // Take up to 3 cases per target pillar
    const toAdd = unseen.slice(0, 3);
    selected.push(...toAdd);

    if (selected.length >= maxCases) break;
  }

  // Step 3: Fill remaining slots from public pillars
  if (selected.length < maxCases) {
    const publicPillars = Object.keys(pillarScores);

    for (const pillar of publicPillars) {
      if (targetPillars.includes(pillar)) continue; // Skip already-targeted

      const pool = pillarPools[pillar] || [];
      const unseen = pool.filter((caseId) => !seenCaseIds.has(caseId));

      const needed = maxCases - selected.length;
      selected.push(...unseen.slice(0, needed));

      if (selected.length >= maxCases) break;
    }
  }

  // Limit to maxCases
  const finalSelection = selected.slice(0, maxCases);

  return {
    case_ids: finalSelection,
    reason: `Targeting least confident pillars: ${targetPillars.join(', ')}`,
  };
}
