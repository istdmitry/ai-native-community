/**
 * Trigger logic for high-baseline and conflict detection
 *
 * Blueprint v2 adds:
 * - Track-aware high-baseline (Beginner skips, Advanced uses advancement score)
 * - Advancement score calculation (replaces simple yes_count)
 */

import type {
  Answer,
  AnswerWithFollowUp,
  HighBaselineConfig,
  PillarScore,
  TrackId,
} from './types';
import { DEFAULT_HIGH_BASELINE_CONFIG, DEFAULT_ADVANCEMENT_CONFIG } from './types';
import {
  calculateAdvancementScore,
  shouldShowHighBaselineGate,
} from './advancement-score';

/**
 * @deprecated Use checkHighBaselineV2 with track awareness instead
 *
 * Checks if high-baseline trigger should activate (v1 logic)
 *
 * Default rule:
 * - yes_count >= 4 in Starter 6, AND
 * - At least one YES in {case.5B, case.6C, case.6A, case.6B}
 *
 * @param answers - User answers
 * @param starter6CaseIds - Case IDs in Starter 6 deck
 * @param config - High-baseline configuration (optional)
 * @returns True if high-baseline triggered
 */
export function checkHighBaseline(
  answers: Answer[],
  starter6CaseIds: string[],
  config: HighBaselineConfig = DEFAULT_HIGH_BASELINE_CONFIG
): boolean {
  // Count YES answers in Starter 6
  const starter6Answers = answers.filter((a) =>
    starter6CaseIds.includes(a.item_id)
  );
  const yesCount = starter6Answers.filter((a) => a.answer_id === 'yes').length;

  // Check minimum YES count
  if (yesCount < config.min_yes_count) {
    return false;
  }

  // Check if at least one required case has YES
  const hasRequiredYes = answers.some(
    (a) => config.required_cases.includes(a.item_id) && a.answer_id === 'yes'
  );

  return hasRequiredYes;
}

/**
 * Blueprint v2: Track-aware high-baseline trigger
 *
 * Rules:
 * - Beginner track: NEVER triggers (always returns false)
 * - Advanced track: Triggers if advancement_score >= 3
 *
 * Advancement score sources:
 * - +1 for each YES to L5+ cases (5A, 5B, 5C, 6A, 6B, 6C, 7A)
 * - +1 for each "solved" L2-L3 problem (NO → YES follow-up)
 * - +2 for each "solved" L4+ problem (NO → YES follow-up)
 *
 * @param trackId - User's assigned track
 * @param answers - User answers with follow-up information
 * @returns Object with triggered status and score details
 *
 * @example
 * ```ts
 * const result = checkHighBaselineV2('advanced', answers);
 * if (result.triggered) {
 *   // Show high-baseline gate
 * }
 * ```
 */
export function checkHighBaselineV2(
  trackId: TrackId,
  answers: AnswerWithFollowUp[]
): {
  triggered: boolean;
  advancementScore: number;
  solvedProblems: string[];
} {
  // Beginner track NEVER triggers high-baseline
  if (trackId === 'beginner') {
    return {
      triggered: false,
      advancementScore: 0,
      solvedProblems: [],
    };
  }

  // Advanced track: calculate advancement score
  const result = calculateAdvancementScore(answers);

  return {
    triggered: result.triggers_high_baseline,
    advancementScore: result.score,
    solvedProblems: result.solved_problems,
  };
}

/**
 * Detects conflict in public pillars
 *
 * Conflict = two or more public pillars have dispersion >= 2 levels
 *
 * @param publicPillars - Public pillar scores
 * @returns True if conflict detected
 *
 * @example
 * ```ts
 * const conflict = detectConflict({
 *   context_system: { dispersion: 3, ... },
 *   orchestration_load: { dispersion: 2, ... },
 *   verification_control: { dispersion: 0, ... },
 * });
 * // Returns true (2 pillars with dispersion >= 2)
 * ```
 */
export function detectConflict(
  publicPillars: Record<string, PillarScore>
): boolean {
  const highDispersionCount = Object.values(publicPillars).filter(
    (score) => score.dispersion >= 2
  ).length;

  return highDispersionCount >= 2;
}

/**
 * Recommends next activity to resolve conflict
 *
 * Priority order:
 * 1. Quick questions (if not completed)
 * 2. Micro-scenarios (if not completed)
 * 3. One round of more cases
 *
 * @param completedDecks - Set of completed deck IDs
 * @returns Recommended deck ID
 */
export function recommendConflictResolution(
  completedDecks: Set<string>
): string {
  if (!completedDecks.has('quick_questions_3')) {
    return 'quick_questions_3';
  }
  if (!completedDecks.has('micro_scenarios_3')) {
    return 'micro_scenarios_3';
  }
  return 'more_cases';
}
