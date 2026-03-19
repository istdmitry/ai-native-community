/**
 * Tests for content validator
 */

import { describe, it, expect } from 'vitest';
import { loadCoreContent } from '../loaders/yaml-loader';
import { validateContent } from '../validators/content-validator';

describe('Content Validator', () => {
  it('should validate core content without errors', () => {
    const content = loadCoreContent();
    const result = validateContent(content);

    expect(result).toBeDefined();
    expect(result.valid).toBeDefined();
    expect(result.errors).toBeDefined();
    expect(result.warnings).toBeDefined();

    // Core content should be valid
    expect(result.valid).toBe(true);

    // Log errors if any (for debugging)
    if (result.errors.length > 0) {
      console.error('Validation errors:', result.errors);
    }

    expect(result.errors.length).toBe(0);
  });

  it('should detect missing required fields', () => {
    const invalidContent = {
      meta: { id: '', version: '', locale: '', title: '', description: '' },
      pillars: [],
      levels: [],
      ui_strings: {} as any,
      cards: {} as any,
      cases: [],
      micro_scenarios: [],
      quick_questions: [],
      result_blocks: [],
      result_explanation: { lines: [] },
      weights: {} as any,
    };

    const result = validateContent(invalidContent);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);

    // Should detect empty pillars
    const pillarError = result.errors.find((e) => e.path === 'pillars');
    expect(pillarError).toBeDefined();
  });

  it('should validate pillar structure', () => {
    const content = loadCoreContent();
    const result = validateContent(content);

    expect(result.valid).toBe(true);

    // All pillars should have required fields
    content.pillars.forEach((pillar) => {
      expect(pillar.id).toBeDefined();
      expect(pillar.name).toBeDefined();
      expect(pillar.description).toBeDefined();
      expect(pillar.visibility).toBeDefined();
    });
  });

  it('should validate case structure', () => {
    const content = loadCoreContent();
    const result = validateContent(content);

    expect(result.valid).toBe(true);

    // All cases should have required fields
    content.cases.forEach((caseItem) => {
      expect(caseItem.id).toBeDefined();
      expect(caseItem.title).toBeDefined();
      expect(caseItem.body).toBeDefined();
      expect(caseItem.level).toBeGreaterThanOrEqual(1);
      expect(caseItem.level).toBeLessThanOrEqual(7);
      expect(caseItem.pillar).toBeDefined();
      expect(caseItem.signals).toBeDefined();
      // v2 format: signals is object with yes/no keys
      const signals = caseItem.signals as any;
      if (Array.isArray(signals)) {
        // v5.0 format - array of signals
        expect(signals.length).toBeGreaterThan(0);
      } else {
        // v2 format - object with yes/no arrays
        expect(signals.yes).toBeDefined();
        expect(signals.no).toBeDefined();
      }
    });
  });

  it('should validate result blocks', () => {
    const content = loadCoreContent();
    const result = validateContent(content);

    expect(result.valid).toBe(true);
    expect(content.result_blocks.length).toBe(7);

    // Should have result blocks for all levels
    const resultIds = content.result_blocks.map((r) => r.id);
    expect(resultIds).toContain('result.L1');
    expect(resultIds).toContain('result.L7');
  });
});
