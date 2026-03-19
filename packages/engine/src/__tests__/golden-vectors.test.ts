/**
 * Golden vector tests for scoring engine
 *
 * Validates scoring algorithm against predefined test cases from tests.v5.yml
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';
import type { AssessmentContent } from '@community/content';
import type { Answer } from '../types';
import { computeCanonicalResult } from '../scoring';

interface TestVector {
  id: string;
  description: string;
  answers: Array<{
    item_id: string;
    answer_id: string;
  }>;
  expected: {
    overall_level: number;
    public_pillars?: Record<string, number>;
    gated_pillars?: Record<string, number>;
    high_baseline?: boolean;
    horizon_yes?: boolean;
  };
}

interface TestData {
  tests: TestVector[];
}

describe('Golden Vector Tests', () => {
  let content: AssessmentContent;
  let testVectors: TestVector[];
  let starter6CaseIds: string[];

  beforeAll(() => {
    // Load assessment content
    const contentPath = join(
      __dirname,
      '../../../content/data/assessment.core.v5.yml'
    );
    const contentYaml = readFileSync(contentPath, 'utf-8');
    content = yaml.parse(contentYaml) as AssessmentContent;

    // Load test vectors
    const testsPath = join(__dirname, '../../../content/data/tests.v5.yml');
    const testsYaml = readFileSync(testsPath, 'utf-8');
    const testData = yaml.parse(testsYaml) as TestData;
    testVectors = testData.tests;

    // Get Starter 6 case IDs (hardcoded from spec)
    starter6CaseIds = [
      'case.2C',
      'case.3B',
      'case.4A',
      'case.5A',
      'case.5B',
      'case.6C',
    ];
  });

  it('should load test vectors', () => {
    expect(testVectors).toBeDefined();
    expect(testVectors.length).toBeGreaterThan(0);
  });

  it('starter6_all_yes_high_baseline', () => {
    const vector = testVectors.find((v) => v.id === 'starter6_all_yes_high_baseline');
    expect(vector).toBeDefined();
    if (!vector) return;

    const answers: Answer[] = vector.answers.map((a) => ({
      item_id: a.item_id,
      answer_id: a.answer_id,
    }));

    const result = computeCanonicalResult(answers, content, starter6CaseIds);

    expect(result.overall_level).toBe(2);
    expect(result.public_pillars.context_system?.level).toBe(2);
    expect(result.public_pillars.orchestration_load?.level).toBe(3);
    expect(result.public_pillars.verification_control?.level).toBe(4);
    expect(result.gated_pillars.codification_reuse?.level).toBe(4);
    expect(result.gated_pillars.personal_fit?.level).toBe(5);
    expect(result.high_baseline).toBe(true);
  });

  it('starter6_only_one_yes', () => {
    const vector = testVectors.find((v) => v.id === 'starter6_only_one_yes');
    expect(vector).toBeDefined();
    if (!vector) return;

    const answers: Answer[] = vector.answers.map((a) => ({
      item_id: a.item_id,
      answer_id: a.answer_id,
    }));

    const result = computeCanonicalResult(answers, content, starter6CaseIds);

    expect(result.overall_level).toBe(1);
    expect(result.public_pillars.context_system?.level).toBe(2);
    expect(result.public_pillars.orchestration_load?.level).toBe(1);
    expect(result.public_pillars.verification_control?.level).toBe(1);
    expect(result.high_baseline).toBe(false);
  });

  it('calibrated_level4_profile', () => {
    const vector = testVectors.find((v) => v.id === 'calibrated_level4_profile');
    expect(vector).toBeDefined();
    if (!vector) return;

    const answers: Answer[] = vector.answers.map((a) => ({
      item_id: a.item_id,
      answer_id: a.answer_id,
    }));

    const result = computeCanonicalResult(answers, content, starter6CaseIds);

    expect(result.overall_level).toBe(4);
    expect(result.public_pillars.context_system?.level).toBe(4);
    expect(result.public_pillars.orchestration_load?.level).toBe(4);
    expect(result.public_pillars.verification_control?.level).toBe(4);
    expect(result.gated_pillars.codification_reuse?.level).toBe(4);
    expect(result.gated_pillars.personal_fit?.level).toBe(5);
    expect(result.high_baseline).toBe(false);
  });

  it('horizon_case_does_not_affect_level', () => {
    const vector = testVectors.find((v) => v.id === 'horizon_case_does_not_affect_level');
    expect(vector).toBeDefined();
    if (!vector) return;

    const answers: Answer[] = vector.answers.map((a) => ({
      item_id: a.item_id,
      answer_id: a.answer_id,
    }));

    const result = computeCanonicalResult(answers, content, starter6CaseIds);

    expect(result.overall_level).toBe(1);
    expect(result.horizon_yes).toBe(true);
  });
});
