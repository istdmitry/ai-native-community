/**
 * Blueprint Compliance Tests
 *
 * Golden tests that verify deployed content matches Blueprint requirements.
 * These tests prevent drift between blueprint specification and implementation.
 */

import { describe, it, expect } from 'vitest';
import { loadContent } from '@community/content';

describe('Blueprint Compliance', () => {
  const content = loadContent('en');

  describe('Version and Structure', () => {
    it('content version is v2 format', () => {
      expect(content.meta.version).toMatch(/^v2/);
    });

    it('tracks array exists with beginner and advanced', () => {
      expect(content.tracks).toBeDefined();
      expect(content.tracks?.length).toBe(2);
      const trackIds = content.tracks?.map((t: any) => t.id) || [];
      expect(trackIds).toContain('beginner');
      expect(trackIds).toContain('advanced');
    });

    it('prescreener is configured with questions', () => {
      expect(content.prescreener).toBeDefined();
      expect(content.prescreener?.questions?.length).toBeGreaterThan(0);
    });
  });

  describe('Default Answers', () => {
    it('default_answers has correct labels: YES and NOPE', () => {
      expect(content.default_answers).toBeDefined();
      expect(content.default_answers?.yes?.label).toBe('YES');
      expect(content.default_answers?.no?.label).toBe('NOPE');
    });

    it('default_answers has subtexts', () => {
      expect(content.default_answers?.yes?.subtext).toBeDefined();
      expect(content.default_answers?.no?.subtext).toBeDefined();
    });
  });

  describe('Case Answer Format', () => {
    it('cases use v2 answer format (object with label/subtext)', () => {
      for (const c of content.cases) {
        if (c.answers) {
          const yesAnswer = (c.answers as any).yes;
          // v2 format: answers.yes should be object or undefined (uses default_answers)
          if (yesAnswer !== undefined) {
            expect(typeof yesAnswer).toBe('object');
            expect(yesAnswer).toHaveProperty('label');
          }
        }
      }
    });

    it('answer IDs are "yes" and "no", never "not_yet"', () => {
      for (const c of content.cases) {
        if (c.answers) {
          const answerKeys = Object.keys(c.answers);
          expect(answerKeys).not.toContain('not_yet');
          // v2 format uses 'yes' and 'no' keys
          if (answerKeys.length > 0) {
            expect(answerKeys).toContain('yes');
            expect(answerKeys).toContain('no');
          }
        }
      }
    });
  });

  describe('Case Signal Format', () => {
    it('cases use v2 signal format (yes/no objects)', () => {
      for (const c of content.cases) {
        expect(c.signals).toBeDefined();
        // v2 format: signals is object with yes and no keys
        expect(Array.isArray(c.signals)).toBe(false);
        expect((c.signals as any).yes).toBeDefined();
        expect((c.signals as any).no).toBeDefined();
      }
    });
  });

  describe('Follow-up Configurations', () => {
    it('beginner-relevant cases have follow_up_no where expected', () => {
      // Based on Blueprint, these cases should have follow_up_no
      const casesExpectedToHaveFollowUpNo = [
        'case.1B', 'case.2A', 'case.2B', 'case.2C',
        'case.3A', 'case.3B', 'case.3C', 'case.4A', 'case.4B',
      ];

      for (const caseId of casesExpectedToHaveFollowUpNo) {
        const c = content.cases.find((x: any) => x.id === caseId);
        if (c) {
          expect((c as any).follow_up_no).toBeDefined();
        }
      }
    });
  });

  describe('Content Quality', () => {
    it('case bodies have no time-bound language', () => {
      const timePatterns = [
        /In the last \d+/i,
        /last month/i,
        /last week/i,
        /last \d+-\d+ weeks/i,
        /In the past \d+/i,
        /\d+-\d+ weeks ago/i,
      ];

      for (const c of content.cases) {
        for (const pattern of timePatterns) {
          expect(c.body).not.toMatch(pattern);
        }
      }
    });

    it('all cases have required fields', () => {
      for (const c of content.cases) {
        expect(c.id).toBeDefined();
        expect(c.title).toBeDefined();
        expect(c.body).toBeDefined();
        expect(c.level).toBeGreaterThanOrEqual(1);
        expect(c.level).toBeLessThanOrEqual(7);
        expect(c.pillar).toBeDefined();
      }
    });
  });

  describe('Track Configuration', () => {
    it('beginner track skips high-baseline gate', () => {
      const beginnerTrack = content.tracks?.find((t: any) => t.id === 'beginner');
      expect(beginnerTrack).toBeDefined();
      expect(beginnerTrack?.high_baseline_gate).toBe(false);
    });

    it('advanced track enables high-baseline gate', () => {
      const advancedTrack = content.tracks?.find((t: any) => t.id === 'advanced');
      expect(advancedTrack).toBeDefined();
      expect(advancedTrack?.high_baseline_gate).toBe(true);
    });
  });

  describe('Content Counts', () => {
    it('has expected number of cases (19 in v2)', () => {
      expect(content.cases.length).toBe(19);
    });

    it('has expected number of quick questions (3 in v2)', () => {
      expect(content.quick_questions.length).toBe(3);
    });

    it('has result blocks for all 7 levels', () => {
      const resultIds = content.result_blocks.map((r: any) => r.id);
      for (let i = 1; i <= 7; i++) {
        expect(resultIds).toContain(`result.L${i}`);
      }
    });
  });
});
