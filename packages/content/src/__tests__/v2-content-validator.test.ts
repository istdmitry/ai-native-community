/**
 * Blueprint v2 Content Validator Tests
 *
 * Tests that the content YAML contains all required Blueprint v2 structures.
 * Based on tests_v2_additions.yml requirements.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { loadCoreContent } from '../loaders/yaml-loader';
import type { AssessmentContent, Track, ToneModifiers } from '../types/assessment';

describe('Blueprint v2 Content Validator', () => {
  let content: AssessmentContent;

  beforeAll(() => {
    content = loadCoreContent();
  });

  describe('Pre-screener Structure', () => {
    it('should have prescreener section', () => {
      expect(content.prescreener).toBeDefined();
    });

    it('should have prescreener intro', () => {
      expect(content.prescreener?.intro).toBeDefined();
      expect(content.prescreener?.intro?.title).toBeDefined();
      expect(content.prescreener?.intro?.subtitle).toBeDefined();
      expect(content.prescreener?.intro?.cta).toBeDefined();
    });

    it('should have exactly 3 prescreener questions', () => {
      expect(content.prescreener?.questions).toBeDefined();
      expect(content.prescreener?.questions?.length).toBe(3);
    });

    it('should have prescreener questions with correct structure', () => {
      const questions = content.prescreener?.questions || [];
      for (const q of questions) {
        expect(q.id).toBeDefined();
        expect(q.prompt).toBeDefined();
        expect(q.answers).toBeDefined();
        expect(q.answers.length).toBeGreaterThan(0);

        // Each answer should have id, label, and points
        for (const a of q.answers) {
          expect(a.id).toBeDefined();
          expect(a.label).toBeDefined();
          expect(typeof a.points).toBe('number');
          expect(a.points).toBeGreaterThanOrEqual(0);
          expect(a.points).toBeLessThanOrEqual(2);
        }
      }
    });

    it('should have prescreener routing configuration', () => {
      expect(content.prescreener?.routing).toBeDefined();
      expect(content.prescreener?.routing?.threshold).toBe(3);
      expect(content.prescreener?.routing?.tracks).toBeDefined();
      expect(content.prescreener?.routing?.tracks?.length).toBe(2);
    });

    it('should have valid question IDs (ps.1, ps.2, ps.3)', () => {
      const questionIds = content.prescreener?.questions?.map((q) => q.id) || [];
      expect(questionIds).toContain('ps.1');
      expect(questionIds).toContain('ps.2');
      expect(questionIds).toContain('ps.3');
    });
  });

  describe('Track Configuration', () => {
    it('should have tracks array', () => {
      expect(content.tracks).toBeDefined();
      expect(Array.isArray(content.tracks)).toBe(true);
    });

    it('should have exactly 2 tracks (beginner, advanced)', () => {
      expect(content.tracks?.length).toBe(2);
      const trackIds = content.tracks?.map((t) => t.id) || [];
      expect(trackIds).toContain('beginner');
      expect(trackIds).toContain('advanced');
    });

    it('should have beginner track with correct configuration', () => {
      const beginner = content.tracks?.find((t) => t.id === 'beginner');
      expect(beginner).toBeDefined();
      expect(beginner?.name).toBeDefined();
      expect(beginner?.tone).toBe('encouraging');
      expect(beginner?.high_baseline_gate).toBe(false);
      expect(beginner?.starter_6).toBeDefined();
      expect(beginner?.starter_6.length).toBe(6);
      expect(beginner?.skip_cases).toBeDefined();
      expect(beginner?.result_framing).toBeDefined();
    });

    it('should have advanced track with correct configuration', () => {
      const advanced = content.tracks?.find((t) => t.id === 'advanced');
      expect(advanced).toBeDefined();
      expect(advanced?.name).toBeDefined();
      expect(advanced?.tone).toBe('challenge');
      expect(advanced?.high_baseline_gate).toBe(true);
      expect(advanced?.starter_6).toBeDefined();
      expect(advanced?.starter_6.length).toBe(6);
      expect(advanced?.skip_cases).toBeDefined();
      expect(advanced?.result_framing).toBeDefined();
    });

    it('should have beginner starter_6 with L1-L3 cases', () => {
      const beginner = content.tracks?.find((t) => t.id === 'beginner');
      const expectedCases = ['case.1A', 'case.1B', 'case.2A', 'case.2B', 'case.2C', 'case.3A'];
      expect(beginner?.starter_6).toEqual(expectedCases);
    });

    it('should have advanced starter_6 with L3-L6 cases', () => {
      const advanced = content.tracks?.find((t) => t.id === 'advanced');
      const expectedCases = ['case.3B', 'case.4A', 'case.4B', 'case.5A', 'case.5B', 'case.6C'];
      expect(advanced?.starter_6).toEqual(expectedCases);
    });

    it('should have result_framing for each track', () => {
      for (const track of content.tracks || []) {
        expect(track.result_framing).toBeDefined();
        expect(track.result_framing.intro).toBeDefined();
        expect(track.result_framing.encouragement).toBeDefined();
      }
    });
  });

  describe('Tone Modifiers Configuration', () => {
    it('should have tone_modifiers section', () => {
      expect(content.tone_modifiers).toBeDefined();
    });

    it('should have encouraging and challenge tones', () => {
      expect(content.tone_modifiers?.encouraging).toBeDefined();
      expect(content.tone_modifiers?.challenge).toBeDefined();
    });

    it('should have encouraging tone with L1-L2 level_wrappers', () => {
      const encouraging = content.tone_modifiers?.encouraging;
      expect(encouraging?.level_wrappers).toBeDefined();
      expect(encouraging?.level_wrappers?.L1).toBeDefined();
      expect(encouraging?.level_wrappers?.L2).toBeDefined();
      expect(encouraging?.level_wrappers?.L1?.opener).toBeDefined();
      expect(encouraging?.level_wrappers?.L1?.next_move_prefix).toBeDefined();
    });

    it('should have challenge tone with L3-L7 level_wrappers', () => {
      const challenge = content.tone_modifiers?.challenge;
      expect(challenge?.level_wrappers).toBeDefined();
      expect(challenge?.level_wrappers?.L3).toBeDefined();
      expect(challenge?.level_wrappers?.L4).toBeDefined();
      expect(challenge?.level_wrappers?.L5).toBeDefined();
      expect(challenge?.level_wrappers?.L6).toBeDefined();
      expect(challenge?.level_wrappers?.L7).toBeDefined();
    });

    it('should have breaks_reframe for each tone', () => {
      expect(content.tone_modifiers?.encouraging?.breaks_reframe?.prefix).toBeDefined();
      expect(content.tone_modifiers?.challenge?.breaks_reframe?.prefix).toBeDefined();
    });
  });

  describe('Default Answers Configuration', () => {
    it('should have default_answers section', () => {
      expect(content.default_answers).toBeDefined();
    });

    it('should have yes and no default answers', () => {
      expect(content.default_answers?.yes).toBeDefined();
      expect(content.default_answers?.no).toBeDefined();
    });

    it('should have label and subtext for each default answer', () => {
      expect(content.default_answers?.yes?.label).toBeDefined();
      expect(content.default_answers?.yes?.subtext).toBeDefined();
      expect(content.default_answers?.no?.label).toBeDefined();
      expect(content.default_answers?.no?.subtext).toBeDefined();
    });
  });

  describe('Cases with Follow-up NO', () => {
    // TODO: Enable when follow_up_no is added to content YAML
    // This validates Blueprint v2 feature that needs to be implemented
    it.skip('should have at least some cases with follow_up_no', () => {
      const casesWithFollowUpNo = content.cases.filter((c) => c.follow_up_no);
      expect(casesWithFollowUpNo.length).toBeGreaterThan(0);
    });

    it.skip('should have follow_up_no with correct structure', () => {
      const casesWithFollowUpNo = content.cases.filter((c) => c.follow_up_no);

      for (const c of casesWithFollowUpNo) {
        const followUpNo = c.follow_up_no;
        expect(followUpNo?.prompt).toBeDefined();
        expect(followUpNo?.answers).toBeDefined();
        expect(followUpNo?.answers?.yes).toBeDefined();
        expect(followUpNo?.answers?.no).toBeDefined();
        expect(followUpNo?.signals).toBeDefined();
        expect(followUpNo?.signals?.yes).toBeDefined();
        expect(followUpNo?.signals?.no).toBeDefined();
      }
    });
  });

  describe('Track-specific Cases Existence', () => {
    it('should have all beginner starter_6 cases in content', () => {
      const beginner = content.tracks?.find((t) => t.id === 'beginner');
      const caseIds = content.cases.map((c) => c.id);

      for (const caseId of beginner?.starter_6 || []) {
        expect(caseIds).toContain(caseId);
      }
    });

    it('should have all advanced starter_6 cases in content', () => {
      const advanced = content.tracks?.find((t) => t.id === 'advanced');
      const caseIds = content.cases.map((c) => c.id);

      for (const caseId of advanced?.starter_6 || []) {
        expect(caseIds).toContain(caseId);
      }
    });
  });
});
