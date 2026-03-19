/**
 * Advancement Score Calculator (Blueprint v2)
 *
 * Calculates advancement score for high-baseline trigger.
 * Replaces the simple yes_count >= 4 rule from v1.
 *
 * Sources:
 * - +1 for each YES to L5+ cases
 * - +1 for each "solved" L2-L3 problem (NO → YES on follow_up_no)
 * - +2 for each "solved" L4+ problem (NO → YES on follow_up_no)
 *
 * Threshold: advancement_score >= 3 triggers high-baseline gate
 * Note: Only applies to Advanced track; Beginner track skips high-baseline entirely.
 */

import type {
  AnswerWithFollowUp,
  AdvancementScoreResult,
  AdvancementScoreConfig,
  TrackId,
} from './types';
import { DEFAULT_ADVANCEMENT_CONFIG } from './types';

/**
 * Calculates the advancement score from user answers
 *
 * @param answers - Array of answers with follow-up information
 * @param config - Advancement score configuration (optional)
 * @returns AdvancementScoreResult with score breakdown
 *
 * @example
 * ```ts
 * const answers = [
 *   { item_id: 'case.5A', answer_id: 'yes', main_answer: 'yes' },
 *   { item_id: 'case.2A', answer_id: 'no', main_answer: 'no', follow_up_answer: 'yes', follow_up_type: 'no' },
 * ];
 * const result = calculateAdvancementScore(answers);
 * // result.score = 2 (1 for 5A YES + 1 for solved 2A)
 * ```
 */
export function calculateAdvancementScore(
  answers: AnswerWithFollowUp[],
  config: AdvancementScoreConfig = DEFAULT_ADVANCEMENT_CONFIG
): AdvancementScoreResult {
  let score = 0;
  let yesToAdvancedCount = 0;
  let solvedFollowUpCount = 0;
  const solvedProblems: string[] = [];

  for (const answer of answers) {
    // Source 1: YES to advanced case (L5+)
    if (
      config.advanced_cases.includes(answer.item_id) &&
      answer.main_answer === 'yes'
    ) {
      score += 1;
      yesToAdvancedCount += 1;
    }

    // Source 2: "Solved it" follow-up (NO on main, YES on follow_up_no)
    if (
      answer.main_answer === 'no' &&
      answer.follow_up_type === 'no' &&
      answer.follow_up_answer === 'yes' &&
      answer.item_id in config.solved_follow_up_points
    ) {
      const points = config.solved_follow_up_points[answer.item_id];
      score += points;
      solvedFollowUpCount += 1;
      solvedProblems.push(answer.item_id);
    }
  }

  return {
    score,
    yes_to_advanced_count: yesToAdvancedCount,
    solved_follow_up_count: solvedFollowUpCount,
    solved_problems: solvedProblems,
    triggers_high_baseline: score >= config.threshold,
  };
}

/**
 * Determines if high-baseline gate should be shown (Blueprint v2)
 *
 * Rules:
 * - Beginner track: NEVER show high-baseline gate (return false)
 * - Advanced track: Show if advancement_score >= threshold (default 3)
 *
 * @param trackId - User's assigned track
 * @param advancementScore - Calculated advancement score
 * @param threshold - Score threshold (default: 3)
 * @returns True if high-baseline gate should be shown
 */
export function shouldShowHighBaselineGate(
  trackId: TrackId,
  advancementScore: number,
  threshold: number = DEFAULT_ADVANCEMENT_CONFIG.threshold
): boolean {
  // Beginner track NEVER sees high-baseline gate
  if (trackId === 'beginner') {
    return false;
  }

  // Advanced track: check threshold
  return advancementScore >= threshold;
}

/**
 * Extracts "solved problems" from answers
 *
 * A problem is "solved" when:
 * - User answered NO to main question (doesn't have this problem)
 * - User answered YES to follow_up_no (because they solved it, not because they never tried)
 *
 * @param answers - Array of answers with follow-up information
 * @returns Array of case IDs that represent solved problems
 */
export function getSolvedProblems(answers: AnswerWithFollowUp[]): string[] {
  return answers
    .filter(
      (a) =>
        a.main_answer === 'no' &&
        a.follow_up_type === 'no' &&
        a.follow_up_answer === 'yes'
    )
    .map((a) => a.item_id);
}

/**
 * Calculates pre-screener score and determines track
 *
 * @param answers - Array of pre-screener answers with points
 * @param threshold - Points threshold for advanced track (default: 3)
 * @returns Object with total score and assigned track
 */
export function calculatePrescreenerScore(
  answers: { question_id: string; answer_id: string; points: number }[],
  threshold: number = 3
): { score: number; trackId: TrackId } {
  const score = answers.reduce((sum, a) => sum + a.points, 0);
  const trackId: TrackId = score >= threshold ? 'advanced' : 'beginner';

  return { score, trackId };
}
