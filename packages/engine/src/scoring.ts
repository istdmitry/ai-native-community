/**
 * Main scoring engine
 *
 * Provides canonical (server) and preview (client) result computation
 */

import type {
  Answer,
  AssessmentResult,
  PreviewResult,
  HighBaselineConfig,
} from './types';
import type { AssessmentContent, Pillar } from '@community/content';
import { collectEvidence, filterByScope, hasHorizonYes } from './evidence';
import { computeAllPillarScores } from './pillar-scoring';
import { computeOverallLevel } from './overall-level';
import { checkHighBaseline, detectConflict } from './triggers';

/**
 * Computes canonical assessment result
 *
 * Uses all 5 pillars (public + gated)
 * Server-only for IP protection
 *
 * @param answers - All user answers
 * @param content - Assessment content
 * @param starter6CaseIds - Case IDs in Starter 6 deck
 * @param highBaselineConfig - High-baseline configuration (optional)
 * @returns Full assessment result with all pillars
 *
 * @example
 * ```ts
 * const result = computeCanonicalResult(
 *   answers,
 *   content,
 *   ['case.2C', 'case.3B', 'case.4A', 'case.5A', 'case.5B', 'case.6C']
 * );
 * ```
 */
export function computeCanonicalResult(
  answers: Answer[],
  content: AssessmentContent,
  starter6CaseIds: string[],
  highBaselineConfig?: HighBaselineConfig
): AssessmentResult {
  // Collect all evidence (public + gated)
  const allEvidence = collectEvidence(answers, content);

  // Separate public and gated pillars
  const publicPillars = content.pillars.filter((p: Pillar) => p.visibility === 'public');
  const gatedPillars = content.pillars.filter((p: Pillar) => p.visibility === 'gated');

  const publicPillarIds = publicPillars.map((p: Pillar) => p.id);
  const gatedPillarIds = gatedPillars.map((p: Pillar) => p.id);

  // Compute public pillar scores (exclude gated evidence)
  const publicEvidence = filterByScope(allEvidence, false);
  const publicScores = computeAllPillarScores(publicPillarIds, publicEvidence);

  // Compute gated pillar scores (include gated evidence)
  const allNonHorizonEvidence = filterByScope(allEvidence, true);
  const gatedScores = computeAllPillarScores(
    gatedPillarIds,
    allNonHorizonEvidence
  );

  // Compute overall level (min across all 5 pillars)
  const allScores = { ...publicScores, ...gatedScores };
  const overall_level = computeOverallLevel(allScores);

  // Check high-baseline trigger
  const high_baseline = checkHighBaseline(
    answers,
    starter6CaseIds,
    highBaselineConfig
  );

  // Check conflict in public pillars
  const provisional_conflict = detectConflict(publicScores);

  // Check horizon YES
  const horizon_yes = hasHorizonYes(answers, content);

  return {
    overall_level,
    public_pillars: publicScores,
    gated_pillars: gatedScores,
    high_baseline,
    provisional_conflict: provisional_conflict || undefined,
    horizon_yes: horizon_yes || undefined,
  };
}

/**
 * Computes preview result (IP-protected)
 *
 * Uses only public pillars
 * Client-safe computation
 * Returns level estimate with optional range if low confidence
 *
 * @param answers - All user answers
 * @param content - Assessment content
 * @returns Preview result with public pillars only
 *
 * @example
 * ```ts
 * const preview = computePreviewResult(answers, content);
 * // { level_estimate: 3, public_pillars: {...}, low_confidence: false }
 * ```
 */
export function computePreviewResult(
  answers: Answer[],
  content: AssessmentContent
): PreviewResult {
  // Collect evidence (public only, no gated)
  const allEvidence = collectEvidence(answers, content);
  const publicEvidence = filterByScope(allEvidence, false);

  // Get public pillars
  const publicPillars = content.pillars.filter((p: Pillar) => p.visibility === 'public');
  const publicPillarIds = publicPillars.map((p: Pillar) => p.id);

  // Compute public pillar scores
  const publicScores = computeAllPillarScores(publicPillarIds, publicEvidence);

  // Compute level estimate (min of public pillars)
  const level_estimate = computeOverallLevel(publicScores);

  // Check if any pillar has low confidence
  const low_confidence = Object.values(publicScores).some(
    (score) => score.confidence === 'low'
  );

  // Compute level range if low confidence
  let level_range: [number, number] | undefined;
  if (low_confidence) {
    const min = level_estimate;
    const max = Math.min(level_estimate + 1, 6); // Cap at L6
    level_range = [min, max];
  }

  return {
    level_estimate,
    level_range,
    public_pillars: publicScores,
    low_confidence,
  };
}
