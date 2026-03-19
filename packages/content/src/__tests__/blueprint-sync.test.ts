/**
 * Blueprint ↔ v5 Content Synchronization Test
 *
 * This test ensures the v5 YAML content stays synchronized with the blueprint.
 * The blueprint is the single source of truth (updated by partners),
 * and v5 content must match it.
 *
 * These tests catch content drift between:
 * - packages/content/data/assessment.core.v5.yml (what the website uses)
 * - blueprint/content/assessment.core.yml (source of truth)
 *
 * Note: blueprint/ is a symlink to the external ai-native-product repo.
 * Tests are skipped when the symlink is not set up (e.g., in CI).
 */

import { describe, it, expect } from 'vitest';
import { loadCoreContent } from '../loaders/yaml-loader';
import * as yaml from 'js-yaml';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Type definitions for blueprint content
interface Answer {
  id: string;
  label: string;
  subtext?: string;
  points?: number;
}

interface Question {
  id: string;
  prompt: string;
  answers: Answer[];
}

interface PrescreenerIntro {
  title: string;
  subtitle: string;
  cta: string;
}

interface Prescreener {
  intro: PrescreenerIntro;
  questions: Question[];
}

interface CaseAnswers {
  yes?: { label: string; subtext?: string };
  no?: { label: string; subtext?: string };
}

interface FollowUp {
  prompt: string;
  answers?: {
    yes?: { label: string; subtext?: string };
    no?: { label: string; subtext?: string };
  };
}

interface Case {
  id: string;
  title: string;
  body: string;
  level: number;
  pillar: string;
  answers?: CaseAnswers;
  follow_up_yes?: FollowUp;
  follow_up_no?: FollowUp;
}

interface DefaultAnswers {
  yes: { label: string; subtext: string };
  no: { label: string; subtext: string };
}

interface BlueprintContent {
  prescreener: Prescreener;
  cases: Case[];
  default_answers: DefaultAnswers;
  cards: Record<string, unknown>;
}

const blueprintPath = resolve(__dirname, '../../../../blueprint/content/assessment.core.yml');
const blueprintExists = existsSync(blueprintPath);

describe.skipIf(!blueprintExists)('Blueprint ↔ v5 Content Sync', () => {
  // Load v5 content (what the website uses)
  const v5Content = loadCoreContent();

  // Load blueprint content (source of truth)
  const blueprintContent = blueprintExists
    ? yaml.load(readFileSync(blueprintPath, 'utf8')) as BlueprintContent
    : {} as BlueprintContent;

  describe('step0_reality_check (Before You Start screen)', () => {
    const v5Card = v5Content.cards.step0_reality_check;
    const blueprintCard = (blueprintContent.cards as Record<string, unknown>)?.step0_reality_check as {
      title: string;
      body: string;
      cta_start: string;
    };

    it('should have matching title', () => {
      expect(v5Card.title).toBe(blueprintCard.title);
    });

    it('should have matching body content', () => {
      // Normalize whitespace for comparison (trim trailing whitespace from each line)
      const normalizeBody = (text: string) =>
        text
          .split('\n')
          .map((line) => line.trimEnd())
          .join('\n')
          .trim();

      expect(normalizeBody(v5Card.body)).toBe(normalizeBody(blueprintCard.body));
    });

    it('should have matching CTA button text', () => {
      expect(v5Card.cta_start).toBe(blueprintCard.cta_start);
    });
  });

  describe('high_baseline_gate (Advanced calibration prompt)', () => {
    const v5Card = v5Content.cards.high_baseline_gate;
    const blueprintCard = (blueprintContent.cards as Record<string, unknown>)?.high_baseline_gate as {
      title: string;
      body: string;
      cta_advanced: string;
      cta_skip: string;
    };

    it('should have matching title', () => {
      expect(v5Card.title).toBe(blueprintCard.title);
    });

    it('should have matching body content', () => {
      const normalizeBody = (text: string) =>
        text
          .split('\n')
          .map((line) => line.trimEnd())
          .join('\n')
          .trim();

      expect(normalizeBody(v5Card.body)).toBe(normalizeBody(blueprintCard.body));
    });

    it('should have matching CTA button text', () => {
      expect(v5Card.cta_advanced).toBe(blueprintCard.cta_advanced);
      expect(v5Card.cta_skip).toBe(blueprintCard.cta_skip);
    });
  });

  // ============================================================================
  // PRESCREENER CONTENT SYNC
  // ============================================================================
  // These tests catch drift in prescreener text content (subtitles, prompts, labels)

  describe('Prescreener text content sync', () => {
    const v5Prescreener = v5Content.prescreener as Prescreener;
    const bpPrescreener = blueprintContent.prescreener;

    describe('intro section', () => {
      it('should have matching title', () => {
        expect(v5Prescreener.intro.title).toBe(bpPrescreener.intro.title);
      });

      it('should have matching subtitle', () => {
        expect(v5Prescreener.intro.subtitle).toBe(bpPrescreener.intro.subtitle);
      });

      it('should have matching CTA text', () => {
        expect(v5Prescreener.intro.cta).toBe(bpPrescreener.intro.cta);
      });
    });

    describe('questions', () => {
      it('should have same number of questions', () => {
        expect(v5Prescreener.questions.length).toBe(bpPrescreener.questions.length);
      });

      // Test each question
      (bpPrescreener?.questions ?? []).forEach((bpQ, idx) => {
        describe(`question ${bpQ.id}`, () => {
          it('should have matching prompt text', () => {
            const v5Q = v5Prescreener.questions.find((q) => q.id === bpQ.id);
            expect(v5Q).toBeDefined();
            expect(v5Q?.prompt).toBe(bpQ.prompt);
          });

          // Test each answer in the question
          bpQ.answers.forEach((bpA) => {
            it(`answer ${bpA.id} should have matching label`, () => {
              const v5Q = v5Prescreener.questions.find((q) => q.id === bpQ.id);
              const v5A = v5Q?.answers.find((a) => a.id === bpA.id);
              expect(v5A).toBeDefined();
              expect(v5A?.label).toBe(bpA.label);
            });

            if (bpA.subtext) {
              it(`answer ${bpA.id} should have matching subtext`, () => {
                const v5Q = v5Prescreener.questions.find((q) => q.id === bpQ.id);
                const v5A = v5Q?.answers.find((a) => a.id === bpA.id);
                expect(v5A?.subtext).toBe(bpA.subtext);
              });
            }
          });
        });
      });
    });
  });

  // ============================================================================
  // CASE CONTENT SYNC
  // ============================================================================
  // These tests catch drift in case text content (titles, bodies, subtexts, follow-ups)

  describe('Case text content sync', () => {
    const v5Cases = v5Content.cases as Case[];
    const bpCases = blueprintContent.cases;

    it('should have same number of cases', () => {
      expect(v5Cases.length).toBe(bpCases.length);
    });

    // Test first 10 cases (starter cases that are most likely to drift)
    const starterCaseIds = [
      'case.1A',
      'case.1B',
      'case.2A',
      'case.2B',
      'case.3A',
      'case.3B',
      'case.4A',
      'case.4B',
      'case.5A',
      'case.5B',
    ];

    starterCaseIds.forEach((caseId) => {
      describe(`case ${caseId}`, () => {
        const bpCase = bpCases?.find((c) => c.id === caseId);
        if (!bpCase) return; // Skip if not in blueprint

        it('should have matching title', () => {
          const v5Case = v5Cases.find((c) => c.id === caseId);
          expect(v5Case).toBeDefined();
          expect(v5Case?.title).toBe(bpCase.title);
        });

        it('should have matching body', () => {
          const v5Case = v5Cases.find((c) => c.id === caseId);
          expect(v5Case?.body).toBe(bpCase.body);
        });

        // Check custom answer subtexts if they exist
        if (bpCase.answers?.yes?.subtext) {
          it('should have matching YES answer subtext', () => {
            const v5Case = v5Cases.find((c) => c.id === caseId);
            expect(v5Case?.answers?.yes?.subtext).toBe(bpCase.answers?.yes?.subtext);
          });
        }

        if (bpCase.answers?.no?.subtext) {
          it('should have matching NO answer subtext', () => {
            const v5Case = v5Cases.find((c) => c.id === caseId);
            expect(v5Case?.answers?.no?.subtext).toBe(bpCase.answers?.no?.subtext);
          });
        }

        // Check follow-up prompts if they exist
        if (bpCase.follow_up_yes?.prompt) {
          it('should have matching follow_up_yes prompt', () => {
            const v5Case = v5Cases.find((c) => c.id === caseId);
            expect(v5Case?.follow_up_yes?.prompt).toBe(bpCase.follow_up_yes?.prompt);
          });
        }

        if (bpCase.follow_up_no?.prompt) {
          it('should have matching follow_up_no prompt', () => {
            const v5Case = v5Cases.find((c) => c.id === caseId);
            expect(v5Case?.follow_up_no?.prompt).toBe(bpCase.follow_up_no?.prompt);
          });
        }
      });
    });
  });

  // ============================================================================
  // DEFAULT ANSWERS SYNC
  // ============================================================================

  describe('Default answers sync', () => {
    const v5Defaults = v5Content.default_answers as DefaultAnswers;
    const bpDefaults = blueprintContent.default_answers;

    it('YES label should match', () => {
      expect(v5Defaults.yes.label).toBe(bpDefaults.yes.label);
    });

    it('YES subtext should match', () => {
      expect(v5Defaults.yes.subtext).toBe(bpDefaults.yes.subtext);
    });

    it('NO label should match', () => {
      expect(v5Defaults.no.label).toBe(bpDefaults.no.label);
    });

    it('NO subtext should match', () => {
      expect(v5Defaults.no.subtext).toBe(bpDefaults.no.subtext);
    });
  });
});
