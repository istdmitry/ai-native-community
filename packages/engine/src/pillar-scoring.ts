/**
 * Pillar scoring algorithm
 *
 * For each pillar:
 * 1. Collect evidence (excluding horizon_only)
 * 2. Compute weighted median level
 * 3. Assign confidence based on count and dispersion
 */

import type { Evidence, PillarScore, Confidence } from './types';
import { computeWeightedMedian, computeDispersion } from './weighted-median';

/**
 * Computes confidence level based on evidence count and dispersion
 *
 * Rules:
 * - High: evidence_count >= 3 AND dispersion <= 1
 * - Medium: evidence_count == 2
 * - Low: evidence_count < 2
 */
function computeConfidence(evidenceCount: number, dispersion: number): Confidence {
  if (evidenceCount >= 3 && dispersion <= 1) {
    return 'high';
  }
  if (evidenceCount === 2) {
    return 'medium';
  }
  return 'low';
}

/**
 * Computes score for a single pillar
 *
 * @param pillar - Pillar ID
 * @param evidence - All evidence points (will be filtered to this pillar)
 * @returns Pillar score with level, confidence, count, dispersion
 *
 * @example
 * ```ts
 * const score = computePillarScore('context_system', evidence);
 * // { pillar: 'context_system', level: 3, confidence: 'high', ... }
 * ```
 */
export function computePillarScore(
  pillar: string,
  evidence: Evidence[]
): PillarScore {
  // Filter to this pillar and exclude horizon_only
  const pillarEvidence = evidence.filter(
    (e) => e.pillar === pillar && e.scope !== 'horizon_only'
  );

  // No evidence → default to L1, low confidence
  if (pillarEvidence.length === 0) {
    return {
      pillar,
      level: 1,
      confidence: 'low',
      evidence_count: 0,
      dispersion: 0,
    };
  }

  // Compute level via weighted median
  const level = computeWeightedMedian(pillarEvidence);

  // Compute dispersion
  const dispersion = computeDispersion(pillarEvidence);

  // Compute confidence
  const confidence = computeConfidence(pillarEvidence.length, dispersion);

  return {
    pillar,
    level,
    confidence,
    evidence_count: pillarEvidence.length,
    dispersion,
  };
}

/**
 * Computes scores for all pillars
 *
 * @param pillarIds - Array of pillar IDs to score
 * @param evidence - All evidence points
 * @returns Record of pillar scores by pillar ID
 */
export function computeAllPillarScores(
  pillarIds: string[],
  evidence: Evidence[]
): Record<string, PillarScore> {
  const scores: Record<string, PillarScore> = {};

  for (const pillar of pillarIds) {
    scores[pillar] = computePillarScore(pillar, evidence);
  }

  return scores;
}
