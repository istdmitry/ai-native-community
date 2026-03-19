/**
 * TypeScript types for AI Native Levels Assessment content structure
 * Based on assessment.core.v5.yml schema
 * Updated for Blueprint v2: Pre-screener, Track Routing, Tone Modifiers
 */

// ==================== Track Types (Blueprint v2) ====================

export type TrackId = 'beginner' | 'advanced';
export type ToneType = 'encouraging' | 'challenge';

// ==================== Meta ====================

export interface Meta {
  id: string;
  version: string;
  locale: string;
  title: string;
  short_title?: string;
  description: string;
}

// ==================== Pillars & Levels ====================

export type PillarVisibility = 'public' | 'gated';

export interface Pillar {
  id: string;
  name: string;
  description: string;
  visibility: PillarVisibility;
}

export interface Level {
  id: string;
  name: string;
  mode_name: string;
}

// ==================== UI Strings ====================

/**
 * Legacy v5.0 answer labels (strings only)
 * @deprecated Use CaseAnswersV2 for new content
 */
export interface Answers {
  yes: string;
  not_yet: string;
}

/**
 * Blueprint v2 case answer format with label + subtext
 */
export interface CaseAnswerConfig {
  label: string;
  subtext: string;
}

/**
 * Blueprint v2 case answers (yes/no with label+subtext)
 */
export interface CaseAnswersV2 {
  yes: CaseAnswerConfig;
  no: CaseAnswerConfig;
}

/**
 * Union type for case answers - supports both v5.0 and v2 formats
 */
export type CaseAnswers = Answers | CaseAnswersV2;

export interface AccuracyTiers {
  low: string;
  medium: string;
  high: string;
}

export interface Progress {
  starter_in_progress: string;
  starter_complete: string;
  accuracy_prompt: string;
}

export interface MicroFeedback {
  low_levels: Answers;
  level5: Answers;
  level6: Answers;
  level7: Answers;
}

export interface UIStrings {
  answers: Answers;
  accuracy_tiers: AccuracyTiers;
  progress: Progress;
  micro_feedback: MicroFeedback;
}

// ==================== Pre-screener (Blueprint v2) ====================

export interface PrescreenerAnswerOption {
  id: string;
  label: string;
  subtext?: string;
  points: number; // 0, 1, or 2
}

export interface PrescreenerQuestion {
  id: string;
  prompt: string;
  answers: PrescreenerAnswerOption[];
}

export interface PrescreenerIntro {
  title: string;
  subtitle: string;
  cta: string;
}

export interface PrescreenerRouting {
  threshold: number; // Points threshold (default: 3)
  tracks: {
    id: TrackId;
    condition: string;
  }[];
}

export interface Prescreener {
  intro: PrescreenerIntro;
  questions: PrescreenerQuestion[];
  routing: PrescreenerRouting;
}

// ==================== Track Configuration (Blueprint v2) ====================

export interface TrackResultFraming {
  intro: string;
  encouragement: string;
}

export interface Track {
  id: TrackId;
  name: string;
  target_levels: number[];
  language_mode?: string;
  tone: ToneType;
  high_baseline_gate: boolean;
  starter_6: string[];
  skip_cases: string[];
  result_framing: TrackResultFraming;
}

// ==================== Tone Modifiers (Blueprint v2) ====================

export interface LevelWrapper {
  opener: string;
  next_move_prefix: string;
  encouragement?: string;
}

export interface ReframeConfig {
  prefix: string;
}

export interface ToneModifier {
  result_prefix: string | null;
  result_suffix: string | null;
  level_wrappers: Record<string, LevelWrapper>;
  breaks_reframe: ReframeConfig;
}

export type ToneModifiers = Record<ToneType, ToneModifier>;

// ==================== Default Answers (Blueprint v2) ====================

export interface DefaultAnswerConfig {
  label: string;
  subtext: string;
}

export interface DefaultAnswers {
  yes: DefaultAnswerConfig;
  no: DefaultAnswerConfig;
}

// ==================== Cards ====================

export interface Card {
  title: string;
  body: string;
  cta_start?: string;
  cta_advanced?: string;
  cta_provisional?: string;
  intro?: string;
  cta_accept?: string;
  cta_skip?: string;
  options?: AccuracyOption[];
  by_pillar?: Record<string, { text: string }>;
  bullets?: string[];
  note?: string;
}

export interface AccuracyOption {
  id: string;
  label: string;
}

export interface Cards {
  step0_reality_check: Card;
  high_baseline_gate: Card;
  accuracy_choice: Card;
  habit_checkpoint: Card;
  compare_yourself: Card;
}

// ==================== Evidence & Signals ====================

export type SignalScope = 'gated_only';

export interface Signal {
  pillar: string;
  level: number;
  weight: number;
  scope?: SignalScope;
}

export interface FollowUp {
  title: string;
  recap: string;
  prompt: string;
  answers: Answers;
  signals: Signal[];
}

// ==================== Follow-up NO (Blueprint v2) ====================

export interface FollowUpNoAnswers {
  yes: DefaultAnswerConfig;
  no: DefaultAnswerConfig;
}

export interface FollowUpNoSignals {
  yes: Signal[];
  no: Signal[];
}

export interface FollowUpNo {
  prompt: string;
  answers: FollowUpNoAnswers;
  signals: FollowUpNoSignals;
}

// ==================== Case ====================

/**
 * Blueprint v2 signals format: object with yes/no arrays
 */
export interface CaseSignalsV2 {
  yes: Signal[];
  no: Signal[];
}

/**
 * Union type for case signals - supports both v5.0 (array) and v2 (object) formats
 */
export type CaseSignals = Signal[] | CaseSignalsV2;

/**
 * Blueprint v2 follow-up for YES answers
 */
export interface FollowUpYes {
  prompt: string;
  answers: CaseAnswersV2;
  signals: CaseSignalsV2;
}

/**
 * Case definition supporting both v5.0 and Blueprint v2 formats
 *
 * v5.0 format:
 * - answers: { yes: "string", not_yet: "string" }
 * - signals: Signal[] (for YES only)
 *
 * v2 format:
 * - answers: { yes: { label, subtext }, no: { label, subtext } }
 * - signals: { yes: Signal[], no: Signal[] }
 */
export interface Case {
  id: string;
  title: string;
  body: string;
  level: number;
  pillar: string;
  /** Supports both v5.0 (Answers) and v2 (CaseAnswersV2) formats */
  answers: CaseAnswers;
  /** Supports both v5.0 (Signal[]) and v2 (CaseSignalsV2) formats */
  signals: CaseSignals;
  /** Blueprint v2: Follow-up shown after YES answer */
  follow_up_yes?: FollowUpYes | FollowUp | null;
  /** Blueprint v2: Follow-up shown after NO answer */
  follow_up_no?: FollowUpNo | null;
  image_prompt?: string;
  /** @deprecated Legacy follow_up field, use follow_up_yes instead */
  follow_up?: FollowUp;
}

// ==================== Quick Question ====================

export interface QuickQuestionOption {
  id: string;
  text: string;
  signals: Signal[];
}

export interface QuickQuestion {
  id: string;
  title: string;
  prompt: string;
  options: QuickQuestionOption[];
}

// ==================== Micro Scenario ====================

export interface MicroScenarioOption {
  id: string;
  text: string;
  signals: Signal[];
}

export interface MicroScenario {
  id: string;
  title: string;
  prompt: string;
  options: MicroScenarioOption[];
}

// ==================== Result Blocks ====================

export interface ResultBlock {
  id: string;
  level: number;
  title: string;
  you_are: string;
  breaks: string;
  cost: string;
  next_move: string;
  note?: string;
  image_prompt?: string;
}

// ==================== Result Explanation ====================

export interface ResultExplanation {
  lines: string[];
}

// ==================== Weights ====================

export interface Weights {
  case_yes: number;
  follow_up_yes: number;
  micro_scenario: number;
  quick_question: number;
}

// ==================== Main Assessment Content ====================

export interface AssessmentContent {
  meta: Meta;
  pillars: Pillar[];
  levels: Level[];
  ui_strings: UIStrings;
  cards: Cards;
  cases: Case[];
  micro_scenarios: MicroScenario[];
  quick_questions: QuickQuestion[];
  result_blocks: ResultBlock[];
  result_explanation: ResultExplanation;
  weights: Weights;
  // Blueprint v2 additions
  prescreener?: Prescreener;
  tracks?: Track[];
  tone_modifiers?: ToneModifiers;
  default_answers?: DefaultAnswers;
}

// ==================== Deck Configuration ====================

export interface DeckMeta {
  id: string;
  version: string;
  variant: 'A' | 'B';
  description: string;
}

export interface DeckItems {
  items: string[];
}

export interface DeckByPillar {
  [pillar: string]: string[];
}

export interface MoreCasesPool {
  by_pillar: DeckByPillar;
  exclude: string[];
  horizon_cases: string[];
}

export interface Decks {
  starter_6: DeckItems;
  // Blueprint v2: track-specific starter_6
  starter_6_beginner?: DeckItems;
  starter_6_advanced?: DeckItems;
  quick_questions_3: DeckItems;
  micro_scenarios_3: DeckItems;
  advanced_calibration: DeckItems;
  explore_all: DeckItems;
  more_cases_pool: MoreCasesPool;
}

export interface DeckConfig {
  meta: DeckMeta;
  accuracy_choice_order: string[];
  decks: Decks;
}

// ==================== Test Vectors ====================

export interface TestAnswer {
  card_id: string;
  card_type: string;
  answer_id: string;
}

export interface TestPillarExpectation {
  pillar: string;
  level: number;
  confidence: number;
  tolerance?: number;
}

export interface TestVector {
  id: string;
  description: string;
  answers: TestAnswer[];
  expectations: {
    overall_level: number;
    high_baseline: boolean;
    provisional_conflict?: boolean;
    pillars: TestPillarExpectation[];
    // Blueprint v2 additions
    track_id?: TrackId;
    advancement_score?: number;
  };
  // Blueprint v2: pre-screener answers for track assignment
  prescreener_answers?: {
    question_id: string;
    answer_id: string;
    points: number;
  }[];
}

export interface TestVectors {
  meta: Meta;
  test_vectors: TestVector[];
}
