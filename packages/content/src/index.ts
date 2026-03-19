/**
 * @community/content - Assessment content package
 *
 * Provides YAML content loading, i18n merging, deck resolution, and validation
 * for AI Native Levels Assessment.
 */

// ==================== Type Exports ====================

export type {
  Meta,
  Pillar,
  PillarVisibility,
  Level,
  UIStrings,
  Answers,
  AccuracyTiers,
  Progress,
  MicroFeedback,
  Card,
  AccuracyOption,
  Cards,
  Signal,
  SignalScope,
  FollowUp,
  Case,
  QuickQuestion,
  QuickQuestionOption,
  MicroScenario,
  MicroScenarioOption,
  ResultBlock,
  ResultExplanation,
  Weights,
  AssessmentContent,
  DeckMeta,
  DeckItems,
  DeckByPillar,
  MoreCasesPool,
  Decks,
  DeckConfig,
  TestAnswer,
  TestPillarExpectation,
  TestVector,
  TestVectors,
  // Blueprint v2 types
  TrackId,
  ToneType,
  Track,
  ToneModifiers,
  ToneModifier,
  Prescreener,
  PrescreenerQuestion,
  DefaultAnswers,
  // Blueprint v2 case types
  CaseAnswerConfig,
  CaseAnswersV2,
  CaseAnswers,
  CaseSignalsV2,
  CaseSignals,
  FollowUpYes,
  FollowUpNo,
} from './types/assessment';

// Report content types
export type {
  I18nString,
  I18nStringArray,
  HabitsContent,
  HabitsTransition,
  HabitsMicroTask,
  ConstraintsContent,
  ConstraintPillar,
  ConstraintLevel,
  L4PlusContent,
  L4PlusPillarContent,
  GlobalContent,
  GlobalCTA,
  GlobalFeedback,
  PillarId,
  // Dashboard and UI types
  DashboardStrings,
  DashboardHeroStrings,
  DashboardClosestUpgradeStrings,
  DashboardHistoryStrings,
  DashboardEmptyStateStrings,
  ReportStrings,
  SidebarStrings,
} from './types/report';

export { PILLAR_IDS } from './types/report';

// ==================== Loader Exports ====================

export {
  loadCoreContent,
  loadLocaleContent,
  loadDeckConfig,
  loadTestVectors,
} from './loaders/yaml-loader';

// Report content loaders
export {
  loadHabitsContent,
  loadConstraintsContent,
  loadL4PlusContent,
  loadGlobalContent,
  clearReportContentCache,
  getHabitsForTransition,
  getConstraintForLevel,
  getPillarName,
  getL4PlusForPillar,
  getLevelMeaning,
  getNextTransitionOneLiner,
  getConstraintExplanation,
  getCTAConfig,
  buildWhatsAppUrl,
  getFeedbackLabels,
  // i18n helpers
  getLevelName,
  getLocalizedPillarName,
  getDashboardHeroStrings,
  getDashboardUpgradeStrings,
  getDashboardHistoryStrings,
  getDashboardEmptyStateStrings,
  getSidebarStrings,
  getReportStrings,
} from './loaders/report-loader';

export { mergeLocaleContent } from './loaders/i18n-merger';

export {
  resolveDeckConfig,
  getDeckCards,
  parseCardType,
  validateDeckReferences,
  getAccuracyChoiceOrder,
} from './loaders/deck-resolver';

export type { CardType, DeckCard } from './loaders/deck-resolver';

// ==================== Validator Exports ====================

export {
  validateContent,
} from './validators/content-validator';

export type {
  ValidationError,
  ValidationResult,
} from './validators/content-validator';

// ==================== Main Content API ====================

import { loadCoreContent, loadLocaleContent } from './loaders/yaml-loader';
import { mergeLocaleContent } from './loaders/i18n-merger';
import type { AssessmentContent } from './types/assessment';

/**
 * Load assessment content for a specific locale
 *
 * Loads core English content and merges locale overlay if locale is not 'en'.
 *
 * @param locale - Locale code ('en', 'ru', etc.)
 * @returns Merged assessment content
 *
 * @example
 * ```typescript
 * import { loadContent } from '@community/content';
 *
 * // Load English content
 * const enContent = loadContent('en');
 *
 * // Load Russian content (core + ru overlay)
 * const ruContent = loadContent('ru');
 * ```
 */
export function loadContent(locale: string = 'en'): AssessmentContent {
  const core = loadCoreContent();

  if (locale === 'en') {
    return core;
  }

  try {
    const overlay = loadLocaleContent(locale);
    return mergeLocaleContent(core, overlay);
  } catch (error) {
    console.warn(`Failed to load locale overlay for "${locale}", falling back to core content:`, error);
    return core;
  }
}

/**
 * Load deck configuration for a specific variant
 *
 * @param variant - 'A' or 'B'
 * @returns Deck configuration
 *
 * @example
 * ```typescript
 * import { loadDeck } from '@community/content';
 *
 * // Load variant A deck (Quick Questions first)
 * const deckA = loadDeck('A');
 *
 * // Load variant B deck (Micro-Scenarios first)
 * const deckB = loadDeck('B');
 * ```
 */
export { resolveDeckConfig as loadDeck } from './loaders/deck-resolver';
