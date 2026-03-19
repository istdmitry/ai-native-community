/**
 * Blueprint v2 Pre-screener Tests
 *
 * Tests prescreener scoring and track routing logic.
 * Based on tests_v2_additions.yml → prescreener_tests section.
 */

import { describe, it, expect } from 'vitest';
import { calculatePrescreenerScore } from '../advancement-score';

describe('Pre-screener Tests', () => {
  describe('Scoring Tests', () => {
    it('prescreener_score_minimum: All lowest answers give score 0', () => {
      const answers = [
        { question_id: 'ps.1', answer_id: 'ps.1.c', points: 0 },
        { question_id: 'ps.2', answer_id: 'ps.2.c', points: 0 },
        { question_id: 'ps.3', answer_id: 'ps.3.c', points: 0 },
      ];

      const result = calculatePrescreenerScore(answers);

      expect(result.score).toBe(0);
      expect(result.trackId).toBe('beginner');
    });

    it('prescreener_score_maximum: All highest answers give score 6', () => {
      const answers = [
        { question_id: 'ps.1', answer_id: 'ps.1.a', points: 2 },
        { question_id: 'ps.2', answer_id: 'ps.2.a', points: 2 },
        { question_id: 'ps.3', answer_id: 'ps.3.a', points: 2 },
      ];

      const result = calculatePrescreenerScore(answers);

      expect(result.score).toBe(6);
      expect(result.trackId).toBe('advanced');
    });

    it('prescreener_score_mixed: Mixed answers sum correctly', () => {
      const answers = [
        { question_id: 'ps.1', answer_id: 'ps.1.b', points: 1 },
        { question_id: 'ps.2', answer_id: 'ps.2.a', points: 2 },
        { question_id: 'ps.3', answer_id: 'ps.3.c', points: 0 },
      ];

      const result = calculatePrescreenerScore(answers);

      expect(result.score).toBe(3);
      expect(result.trackId).toBe('advanced');
    });
  });

  describe('Threshold Tests', () => {
    it('prescreener_threshold_below: Score 2 routes to beginner', () => {
      const answers = [
        { question_id: 'ps.1', answer_id: 'ps.1.b', points: 1 },
        { question_id: 'ps.2', answer_id: 'ps.2.b', points: 1 },
        { question_id: 'ps.3', answer_id: 'ps.3.c', points: 0 },
      ];

      const result = calculatePrescreenerScore(answers);

      expect(result.score).toBe(2);
      expect(result.trackId).toBe('beginner');
    });

    it('prescreener_threshold_at: Score 3 routes to advanced (threshold)', () => {
      const answers = [
        { question_id: 'ps.1', answer_id: 'ps.1.b', points: 1 },
        { question_id: 'ps.2', answer_id: 'ps.2.b', points: 1 },
        { question_id: 'ps.3', answer_id: 'ps.3.b', points: 1 },
      ];

      const result = calculatePrescreenerScore(answers);

      expect(result.score).toBe(3);
      expect(result.trackId).toBe('advanced');
    });

    it('prescreener_threshold_above: Score 4 routes to advanced', () => {
      const answers = [
        { question_id: 'ps.1', answer_id: 'ps.1.a', points: 2 },
        { question_id: 'ps.2', answer_id: 'ps.2.b', points: 1 },
        { question_id: 'ps.3', answer_id: 'ps.3.b', points: 1 },
      ];

      const result = calculatePrescreenerScore(answers);

      expect(result.score).toBe(4);
      expect(result.trackId).toBe('advanced');
    });
  });

  describe('Edge Cases', () => {
    it('prescreener_all_middle_answers: All middle (1-point) answers', () => {
      const answers = [
        { question_id: 'ps.1', answer_id: 'ps.1.b', points: 1 },
        { question_id: 'ps.2', answer_id: 'ps.2.b', points: 1 },
        { question_id: 'ps.3', answer_id: 'ps.3.b', points: 1 },
      ];

      const result = calculatePrescreenerScore(answers);

      expect(result.score).toBe(3);
      expect(result.trackId).toBe('advanced'); // Just at threshold
    });

    it('should handle custom threshold', () => {
      const answers = [
        { question_id: 'ps.1', answer_id: 'ps.1.a', points: 2 },
        { question_id: 'ps.2', answer_id: 'ps.2.c', points: 0 },
        { question_id: 'ps.3', answer_id: 'ps.3.c', points: 0 },
      ];

      // With default threshold (3), score 2 is beginner
      const resultDefault = calculatePrescreenerScore(answers);
      expect(resultDefault.score).toBe(2);
      expect(resultDefault.trackId).toBe('beginner');

      // With custom threshold (2), score 2 is advanced
      const resultCustom = calculatePrescreenerScore(answers, 2);
      expect(resultCustom.score).toBe(2);
      expect(resultCustom.trackId).toBe('advanced');
    });

    it('should handle empty answers array', () => {
      const answers: { question_id: string; answer_id: string; points: number }[] = [];

      const result = calculatePrescreenerScore(answers);

      expect(result.score).toBe(0);
      expect(result.trackId).toBe('beginner');
    });
  });
});
