/**
 * Tests for deck resolver
 */

import { describe, it, expect } from 'vitest';
import { loadCoreContent, loadDeckConfig } from '../loaders/yaml-loader';
import { resolveDeckConfig, getDeckCards, parseCardType, validateDeckReferences } from '../loaders/deck-resolver';

describe('Deck Resolver', () => {
  describe('parseCardType', () => {
    it('should parse case card type', () => {
      expect(parseCardType('case.1A')).toBe('case');
      expect(parseCardType('case.2B')).toBe('case');
    });

    it('should parse quick question card type', () => {
      expect(parseCardType('qq.1')).toBe('qq');
      expect(parseCardType('qq.2')).toBe('qq');
    });

    it('should parse micro scenario card type', () => {
      expect(parseCardType('ms.1')).toBe('ms');
      expect(parseCardType('ms.3')).toBe('ms');
    });

    it('should throw for unknown card type', () => {
      expect(() => parseCardType('unknown.1')).toThrow();
    });
  });

  describe('resolveDeckConfig', () => {
    it('should resolve variant A config', () => {
      const config = resolveDeckConfig('A');
      expect(config.meta.variant).toBe('A');
    });

    it('should resolve variant B config', () => {
      const config = resolveDeckConfig('B');
      expect(config.meta.variant).toBe('B');
    });
  });

  describe('getDeckCards', () => {
    it('should get starter_6 deck cards', () => {
      const config = loadDeckConfig('A');
      const cards = getDeckCards(config, 'starter_6');

      expect(cards).toBeDefined();
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(6);
      expect(cards[0].cardId).toBeDefined();
      expect(cards[0].cardType).toBe('case');
      expect(cards[0].index).toBe(0);
    });

    it('should get quick_questions_3 deck cards', () => {
      const config = loadDeckConfig('A');
      const cards = getDeckCards(config, 'quick_questions_3');

      expect(cards.length).toBe(3);
      expect(cards[0].cardType).toBe('qq');
    });

    it('should throw for invalid deck name', () => {
      const config = loadDeckConfig('A');
      expect(() => getDeckCards(config, 'invalid_deck')).toThrow();
    });

    it('should throw for more_cases_pool (special handling)', () => {
      const config = loadDeckConfig('A');
      expect(() => getDeckCards(config, 'more_cases_pool')).toThrow();
    });
  });

  describe('validateDeckReferences', () => {
    it('should validate deck references against content', () => {
      const config = loadDeckConfig('A');
      const content = loadCoreContent();

      const result = validateDeckReferences(config, content);

      expect(result).toBeDefined();
      expect(result.valid).toBeDefined();
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);

      // Should be valid (all references exist)
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });
});
