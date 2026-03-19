/**
 * Deck resolver
 *
 * Resolves deck configurations by variant (A or B) and provides
 * utilities for working with deck cards.
 */

import type { DeckConfig, AssessmentContent } from '../types/assessment';
import { loadDeckConfig } from './yaml-loader';

/**
 * Deck card type identifier
 */
export type CardType = 'case' | 'qq' | 'ms';

/**
 * Parsed deck card reference
 */
export interface DeckCard {
  cardId: string;
  cardType: CardType;
  index: number;
}

/**
 * Parse card ID to extract type
 *
 * @param cardId - Card ID (e.g., 'case.1A', 'qq.1', 'ms.2')
 * @returns Card type
 */
export function parseCardType(cardId: string): CardType {
  if (cardId.startsWith('case.')) return 'case';
  if (cardId.startsWith('qq.')) return 'qq';
  if (cardId.startsWith('ms.')) return 'ms';
  throw new Error(`Unknown card type for ID: ${cardId}`);
}

/**
 * Resolve deck configuration by variant
 *
 * @param variant - 'A' or 'B'
 * @returns Deck configuration
 */
export function resolveDeckConfig(variant: 'A' | 'B'): DeckConfig {
  return loadDeckConfig(variant);
}

/**
 * Get deck items as parsed card references
 *
 * @param deckConfig - Deck configuration
 * @param deckName - Name of deck (e.g., 'starter_6', 'quick_questions_3')
 * @returns Array of parsed deck cards
 */
export function getDeckCards(deckConfig: DeckConfig, deckName: string): DeckCard[] {
  const deck = deckConfig.decks[deckName as keyof typeof deckConfig.decks];

  if (!deck) {
    throw new Error(`Deck not found: ${deckName}`);
  }

  // Handle more_cases_pool separately (it has different structure)
  if (deckName === 'more_cases_pool') {
    throw new Error('more_cases_pool requires special handling (not a simple items list)');
  }

  const items = (deck as { items: string[] }).items;

  if (!items || !Array.isArray(items)) {
    throw new Error(`Invalid deck structure for: ${deckName}`);
  }

  return items.map((cardId, index) => ({
    cardId,
    cardType: parseCardType(cardId),
    index,
  }));
}

/**
 * Validate that all deck card references exist in content
 *
 * @param deckConfig - Deck configuration
 * @param content - Assessment content
 * @returns Validation result with errors array
 */
export function validateDeckReferences(
  deckConfig: DeckConfig,
  content: AssessmentContent
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Build lookup maps
  const caseIds = new Set(content.cases.map((c) => c.id));
  const qqIds = new Set(content.quick_questions.map((q) => q.id));
  const msIds = new Set(content.micro_scenarios.map((s) => s.id));

  // Check all decks except more_cases_pool
  const deckNames = ['starter_6', 'quick_questions_3', 'micro_scenarios_3', 'advanced_calibration', 'explore_all'];

  for (const deckName of deckNames) {
    try {
      const cards = getDeckCards(deckConfig, deckName);

      for (const card of cards) {
        let exists = false;

        if (card.cardType === 'case') {
          exists = caseIds.has(card.cardId);
        } else if (card.cardType === 'qq') {
          exists = qqIds.has(card.cardId);
        } else if (card.cardType === 'ms') {
          exists = msIds.has(card.cardId);
        }

        if (!exists) {
          errors.push(`Deck "${deckName}" references missing card: ${card.cardId}`);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        errors.push(`Error validating deck "${deckName}": ${error.message}`);
      }
    }
  }

  // Validate more_cases_pool separately
  const moreCases = deckConfig.decks.more_cases_pool;
  if (moreCases) {
    // Check by_pillar
    for (const [pillar, cardIds] of Object.entries(moreCases.by_pillar)) {
      for (const cardId of cardIds) {
        if (!caseIds.has(cardId)) {
          errors.push(`more_cases_pool.by_pillar.${pillar} references missing card: ${cardId}`);
        }
      }
    }

    // Check exclude
    for (const cardId of moreCases.exclude) {
      if (!caseIds.has(cardId)) {
        errors.push(`more_cases_pool.exclude references missing card: ${cardId}`);
      }
    }

    // Check horizon_cases
    for (const cardId of moreCases.horizon_cases) {
      if (!caseIds.has(cardId)) {
        errors.push(`more_cases_pool.horizon_cases references missing card: ${cardId}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get accuracy choice order for variant
 *
 * @param deckConfig - Deck configuration
 * @returns Array of accuracy choice IDs in order
 */
export function getAccuracyChoiceOrder(deckConfig: DeckConfig): string[] {
  return deckConfig.accuracy_choice_order || [];
}
