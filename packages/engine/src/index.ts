/**
 * AI Native Assessment Scoring Engine
 *
 * Deterministic scoring algorithm for:
 * - Evidence collection from user answers
 * - Pillar scoring via weighted median
 * - Overall level computation
 * - High-baseline and conflict triggers
 * - More cases selection
 *
 * Blueprint v2 additions:
 * - Pre-screener and track routing
 * - Advancement score for high-baseline
 * - Tone modifiers for results
 *
 * @packageDocumentation
 */

// ==================== Types ====================
export type {
  Evidence,
  EvidenceScope,
  Answer,
  PillarScore,
  Confidence,
  AssessmentResult,
  PreviewResult,
  HighBaselineConfig,
  MoreCasesSelection,
  PillarPool,
  ResultSnapshot,
  SnapshotType,
  // Blueprint v2 types
  TrackId,
  ToneType,
  AnswerWithFollowUp,
  PrescreenerAnswer,
  AdvancementScoreResult,
  AdvancementScoreConfig,
} from './types';

export {
  DEFAULT_HIGH_BASELINE_CONFIG,
  DEFAULT_ADVANCEMENT_CONFIG,
} from './types';

// ==================== Evidence Collection ====================
export {
  collectEvidence,
  filterByPillar,
  filterByScope,
  hasHorizonYes,
} from './evidence';

// ==================== Weighted Median ====================
export { computeWeightedMedian, computeDispersion } from './weighted-median';

// ==================== Pillar Scoring ====================
export { computePillarScore, computeAllPillarScores } from './pillar-scoring';

// ==================== Overall Level ====================
export { computeOverallLevel, isWeakestPillarGated } from './overall-level';

// ==================== Triggers ====================
export {
  checkHighBaseline,
  checkHighBaselineV2,
  detectConflict,
  recommendConflictResolution,
} from './triggers';

// ==================== More Cases Selection ====================
export { selectMoreCases } from './more-cases';

// ==================== Main Scoring ====================
export { computeCanonicalResult, computePreviewResult } from './scoring';

// ==================== Blueprint v2: Advancement Score ====================
export {
  calculateAdvancementScore,
  shouldShowHighBaselineGate,
  getSolvedProblems,
  calculatePrescreenerScore,
} from './advancement-score';

// ==================== Blueprint v2: Tone Modifiers ====================
export {
  applyToneModifiers,
  getToneForTrack,
  getResultFraming,
  DEFAULT_TONE_MODIFIERS,
} from './tone-modifiers';

export type {
  ToneModifierConfig,
  LevelWrapper,
  ReframeConfig,
  ResultBlock,
  TonedResultBlock,
} from './tone-modifiers';

// ==================== Agent Assessment ====================
export {
  computeAgentResult,
} from './agent-scoring';

export type {
  AgentAnswer,
  DomainScore,
  AgentAssessmentResult,
} from './agent-scoring';
