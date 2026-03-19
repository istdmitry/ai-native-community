/**
 * Tests for YAML loader
 */

import { describe, it, expect } from 'vitest';
import { loadCoreContent, loadLocaleContent, loadDeckConfig, loadTestVectors } from '../loaders/yaml-loader';

describe('YAML Loader', () => {
  describe('loadCoreContent', () => {
    it('should load core assessment content', () => {
      const content = loadCoreContent();

      expect(content).toBeDefined();
      expect(content.meta).toBeDefined();
      expect(content.meta.id).toBe('ai_native_levels_assessment');
      expect(content.meta.version).toBe('v2');
      expect(content.meta.locale).toBe('en');
    });

    it('should have all required sections', () => {
      const content = loadCoreContent();

      expect(content.pillars).toBeDefined();
      expect(Array.isArray(content.pillars)).toBe(true);
      expect(content.pillars.length).toBeGreaterThan(0);

      expect(content.levels).toBeDefined();
      expect(Array.isArray(content.levels)).toBe(true);
      expect(content.levels.length).toBe(7);

      expect(content.cases).toBeDefined();
      expect(Array.isArray(content.cases)).toBe(true);
      expect(content.cases.length).toBeGreaterThan(0);

      expect(content.result_blocks).toBeDefined();
      expect(Array.isArray(content.result_blocks)).toBe(true);
      expect(content.result_blocks.length).toBe(7);
    });
  });

  describe('loadLocaleContent', () => {
    it('should load Russian locale overlay', () => {
      const content = loadLocaleContent('ru');

      expect(content).toBeDefined();
      expect(content.meta).toBeDefined();
      expect(content.meta?.locale).toBe('ru');
    });
  });

  describe('loadDeckConfig', () => {
    it('should load variant A deck config', () => {
      const config = loadDeckConfig('A');

      expect(config).toBeDefined();
      expect(config.meta).toBeDefined();
      expect(config.meta.variant).toBe('A');
      expect(config.decks).toBeDefined();
      expect(config.decks.starter_6).toBeDefined();
    });

    it('should load variant B deck config', () => {
      const config = loadDeckConfig('B');

      expect(config).toBeDefined();
      expect(config.meta).toBeDefined();
      expect(config.meta.variant).toBe('B');
      expect(config.decks).toBeDefined();
      expect(config.decks.starter_6).toBeDefined();
    });

    it('variant A and B should have different accuracy_choice_order', () => {
      const configA = loadDeckConfig('A');
      const configB = loadDeckConfig('B');

      expect(configA.accuracy_choice_order).toBeDefined();
      expect(configB.accuracy_choice_order).toBeDefined();

      // Variants should differ in order
      expect(configA.accuracy_choice_order[0]).not.toBe(configB.accuracy_choice_order[0]);
    });
  });

  describe('loadTestVectors', () => {
    // TODO: Enable when test vectors file is added to content package
    // The tests.v5.yml file is in docs/ but not in packages/content/
    it.skip('should load test vectors', () => {
      const tests = loadTestVectors();

      expect(tests).toBeDefined();
      expect(tests.meta).toBeDefined();
      expect(tests.test_vectors).toBeDefined();
      expect(Array.isArray(tests.test_vectors)).toBe(true);
      expect(tests.test_vectors.length).toBeGreaterThan(0);
    });
  });
});
