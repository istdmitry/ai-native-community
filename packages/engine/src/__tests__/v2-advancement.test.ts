/**
 * Blueprint v2 Advancement Score Tests
 *
 * Tests advancement score calculation and high-baseline trigger logic.
 * Based on tests_v2_additions.yml → advancement_score_tests section.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAdvancementScore,
  shouldShowHighBaselineGate,
  getSolvedProblems,
} from '../advancement-score';
import { checkHighBaselineV2 } from '../triggers';
import type { AnswerWithFollowUp } from '../types';

describe('Advancement Score Tests', () => {
  describe('Score Calculation', () => {
    it('advancement_score_from_advanced_yes: YES to advanced cases adds 1 point each', () => {
      const answers: AnswerWithFollowUp[] = [
        { item_id: 'case.5A', answer_id: 'yes', main_answer: 'yes' },
        { item_id: 'case.5B', answer_id: 'yes', main_answer: 'yes' },
        { item_id: 'case.6C', answer_id: 'yes', main_answer: 'yes' },
      ];

      const result = calculateAdvancementScore(answers);

      expect(result.score).toBe(3);
      expect(result.yes_to_advanced_count).toBe(3);
      expect(result.solved_follow_up_count).toBe(0);
    });

    it('advancement_score_from_solved_l2_l3: Solved L2-L3 problems add 1 point each', () => {
      const answers: AnswerWithFollowUp[] = [
        {
          item_id: 'case.2A',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'yes',
          follow_up_type: 'no',
        },
        {
          item_id: 'case.3B',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'yes',
          follow_up_type: 'no',
        },
      ];

      const result = calculateAdvancementScore(answers);

      expect(result.score).toBe(2);
      expect(result.yes_to_advanced_count).toBe(0);
      expect(result.solved_follow_up_count).toBe(2);
      expect(result.solved_problems).toContain('case.2A');
      expect(result.solved_problems).toContain('case.3B');
    });

    it('advancement_score_from_solved_l4_plus: Solved L4+ problems add 2 points each', () => {
      const answers: AnswerWithFollowUp[] = [
        {
          item_id: 'case.4A',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'yes',
          follow_up_type: 'no',
        },
        {
          item_id: 'case.5A',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'yes',
          follow_up_type: 'no',
        },
      ];

      const result = calculateAdvancementScore(answers);

      expect(result.score).toBe(4); // 2 + 2
      expect(result.yes_to_advanced_count).toBe(0);
      expect(result.solved_follow_up_count).toBe(2);
    });

    it('advancement_score_combined: Combined YES and solved problems', () => {
      const answers: AnswerWithFollowUp[] = [
        { item_id: 'case.5A', answer_id: 'yes', main_answer: 'yes' }, // +1
        { item_id: 'case.5B', answer_id: 'yes', main_answer: 'yes' }, // +1
        {
          item_id: 'case.3B',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'yes',
          follow_up_type: 'no',
        }, // +1 (L3 solved)
        {
          item_id: 'case.4A',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'yes',
          follow_up_type: 'no',
        }, // +2 (L4 solved)
      ];

      const result = calculateAdvancementScore(answers);

      expect(result.score).toBe(5);
      expect(result.yes_to_advanced_count).toBe(2);
      expect(result.solved_follow_up_count).toBe(2);
    });

    it('advancement_score_not_tried_no_points: NO then NO adds no points', () => {
      const answers: AnswerWithFollowUp[] = [
        {
          item_id: 'case.3B',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'no',
          follow_up_type: 'no',
        },
        {
          item_id: 'case.4A',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'no',
          follow_up_type: 'no',
        },
      ];

      const result = calculateAdvancementScore(answers);

      expect(result.score).toBe(0);
    });
  });

  describe('High-Baseline Trigger', () => {
    it('high_baseline_triggered_at_3: Score 3 triggers high-baseline gate', () => {
      const result = shouldShowHighBaselineGate('advanced', 3);

      expect(result).toBe(true);
    });

    it('high_baseline_not_triggered_at_2: Score 2 does not trigger high-baseline gate', () => {
      const result = shouldShowHighBaselineGate('advanced', 2);

      expect(result).toBe(false);
    });

    it('high_baseline_skipped_for_beginner: Beginner track skips high-baseline entirely', () => {
      // Even with high score, beginner track never triggers
      const result = shouldShowHighBaselineGate('beginner', 5);

      expect(result).toBe(false);
    });

    it('should use custom threshold', () => {
      const resultDefault = shouldShowHighBaselineGate('advanced', 2);
      expect(resultDefault).toBe(false);

      const resultCustom = shouldShowHighBaselineGate('advanced', 2, 2);
      expect(resultCustom).toBe(true);
    });
  });

  describe('checkHighBaselineV2', () => {
    it('should return triggered=false for beginner track', () => {
      const answers: AnswerWithFollowUp[] = [
        { item_id: 'case.5A', answer_id: 'yes', main_answer: 'yes' },
        { item_id: 'case.5B', answer_id: 'yes', main_answer: 'yes' },
        { item_id: 'case.6C', answer_id: 'yes', main_answer: 'yes' },
      ];

      const result = checkHighBaselineV2('beginner', answers);

      expect(result.triggered).toBe(false);
      expect(result.advancementScore).toBe(0);
      expect(result.solvedProblems).toEqual([]);
    });

    it('should return triggered=true for advanced track with score >= 3', () => {
      const answers: AnswerWithFollowUp[] = [
        { item_id: 'case.5A', answer_id: 'yes', main_answer: 'yes' },
        { item_id: 'case.5B', answer_id: 'yes', main_answer: 'yes' },
        { item_id: 'case.6C', answer_id: 'yes', main_answer: 'yes' },
      ];

      const result = checkHighBaselineV2('advanced', answers);

      expect(result.triggered).toBe(true);
      expect(result.advancementScore).toBe(3);
    });

    it('should return triggered=false for advanced track with score < 3', () => {
      const answers: AnswerWithFollowUp[] = [
        { item_id: 'case.5A', answer_id: 'yes', main_answer: 'yes' },
        { item_id: 'case.5B', answer_id: 'yes', main_answer: 'yes' },
      ];

      const result = checkHighBaselineV2('advanced', answers);

      expect(result.triggered).toBe(false);
      expect(result.advancementScore).toBe(2);
    });

    it('should track solved problems', () => {
      const answers: AnswerWithFollowUp[] = [
        {
          item_id: 'case.3B',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'yes',
          follow_up_type: 'no',
        },
        {
          item_id: 'case.4A',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'yes',
          follow_up_type: 'no',
        },
      ];

      const result = checkHighBaselineV2('advanced', answers);

      expect(result.solvedProblems).toContain('case.3B');
      expect(result.solvedProblems).toContain('case.4A');
    });
  });

  describe('getSolvedProblems', () => {
    it('should return only solved problems (NO → YES on follow_up_no)', () => {
      const answers: AnswerWithFollowUp[] = [
        // Solved: NO main, YES follow-up
        {
          item_id: 'case.2A',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'yes',
          follow_up_type: 'no',
        },
        // Not solved: NO main, NO follow-up
        {
          item_id: 'case.3B',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'no',
          follow_up_type: 'no',
        },
        // Not solved: YES main
        { item_id: 'case.5A', answer_id: 'yes', main_answer: 'yes' },
        // Not solved: follow_up_type is 'yes' (follow-up after YES answer)
        {
          item_id: 'case.4A',
          answer_id: 'yes',
          main_answer: 'yes',
          follow_up_answer: 'yes',
          follow_up_type: 'yes',
        },
      ];

      const solved = getSolvedProblems(answers);

      expect(solved).toEqual(['case.2A']);
    });

    it('should return empty array when no problems solved', () => {
      const answers: AnswerWithFollowUp[] = [
        { item_id: 'case.5A', answer_id: 'yes', main_answer: 'yes' },
        {
          item_id: 'case.3B',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'no',
          follow_up_type: 'no',
        },
      ];

      const solved = getSolvedProblems(answers);

      expect(solved).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('advanced_high_baseline_edge: Advanced user just at threshold', () => {
      const answers: AnswerWithFollowUp[] = [
        { item_id: 'case.5A', answer_id: 'yes', main_answer: 'yes' }, // +1
        {
          item_id: 'case.5B',
          answer_id: 'no',
          main_answer: 'no',
          follow_up_answer: 'yes',
          follow_up_type: 'no',
        }, // +2 (L5 solved)
      ];

      const result = calculateAdvancementScore(answers);

      expect(result.score).toBe(3);
      expect(result.triggers_high_baseline).toBe(true); // Exactly at threshold
    });

    it('should handle empty answers array', () => {
      const answers: AnswerWithFollowUp[] = [];

      const result = calculateAdvancementScore(answers);

      expect(result.score).toBe(0);
      expect(result.yes_to_advanced_count).toBe(0);
      expect(result.solved_follow_up_count).toBe(0);
      expect(result.solved_problems).toEqual([]);
      expect(result.triggers_high_baseline).toBe(false);
    });

    it('should not double-count case with YES that is also advanced', () => {
      // If someone says YES to an advanced case, they get +1 for the YES
      // Even if the case is configured for solved points, YES doesn't trigger solved
      const answers: AnswerWithFollowUp[] = [
        { item_id: 'case.5A', answer_id: 'yes', main_answer: 'yes' },
      ];

      const result = calculateAdvancementScore(answers);

      expect(result.score).toBe(1); // Only +1 for advanced YES
      expect(result.solved_problems).toEqual([]); // Not in solved
    });
  });
});
