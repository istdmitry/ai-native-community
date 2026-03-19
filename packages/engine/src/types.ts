/**
 * TypeScript types for AI Native Assessment scoring engine
 */

// ==================== Evidence Model ====================

/**
 * Evidence scope determines visibility in scoring
 */
export type EvidenceScope = 'public' | 'gated_only' | 'horizon_only';

/**
 * Evidence point from a user answer
 * Contributes to pillar scoring with weighted impact
 */
export interface Evidence {
  /** Pillar this evidence contributes to */
  pillar: string;
  /** Level boundary this evidence indicates (1-7) */
  level: number;
  /** Weight of this evidence point (higher = more impact) */
  weight: number;
  /** Visibility scope for IP protection */
  scope: EvidenceScope;
}

/**
 * User answer that generates evidence
 */
export interface Answer {
  /** ID of the item (case, quick_question, micro_scenario) */
  item_id: string;
  /** ID of the selected answer/option */
  answer_id: string;
}

// ==================== Pillar Scoring ====================

/**
 * Confidence level for pillar score
 */
export type Confidence = 'high' | 'medium' | 'low';

/**
 * Pillar scoring result
 */
export interface PillarScore {
  /** Pillar ID */
  pillar: string;
  /** Computed level (1-7) via weighted median */
  level: number;
  /** Confidence in this score */
  confidence: Confidence;
  /** Number of evidence points */
  evidence_count: number;
  /** Dispersion (max - min levels) */
  dispersion: number;
}

// ==================== Overall Result ====================

/**
 * Overall assessment result
 */
export interface AssessmentResult {
  /** Overall level = min(public + gated pillars, L1-L6 only) */
  overall_level: number;
  /** Public pillar scores (visible before email) */
  public_pillars: Record<string, PillarScore>;
  /** Gated pillar scores (visible after email) */
  gated_pillars: Record<string, PillarScore>;
  /** Whether high-baseline was triggered */
  high_baseline: boolean;
  /** Whether conflict detected in public pillars */
  provisional_conflict?: boolean;
  /** Whether user answered YES to any L7 case */
  horizon_yes?: boolean;
}

/**
 * Preview result (IP-protected, public pillars only)
 */
export interface PreviewResult {
  /** Estimated overall level (from public pillars only) */
  level_estimate: number;
  /** Optional range if confidence is low */
  level_range?: [number, number];
  /** Public pillar scores only */
  public_pillars: Record<string, PillarScore>;
  /** True if any public pillar has low confidence */
  low_confidence: boolean;
}

// ==================== Blueprint v2: Track Types ====================

/**
 * Track ID for routing users based on pre-screener
 */
export type TrackId = 'beginner' | 'advanced';

/**
 * Tone type for result modifiers
 */
export type ToneType = 'encouraging' | 'challenge';

/**
 * Extended answer with follow-up information
 */
export interface AnswerWithFollowUp extends Answer {
  /** Main answer (yes/no) */
  main_answer: 'yes' | 'no';
  /** Follow-up answer if present */
  follow_up_answer?: 'yes' | 'no';
  /** Follow-up type (yes = after YES answer, no = after NO answer) */
  follow_up_type?: 'yes' | 'no';
}

/**
 * Pre-screener answer
 */
export interface PrescreenerAnswer {
  /** Question ID (ps.1, ps.2, ps.3) */
  question_id: string;
  /** Answer ID (ps.1.a, ps.1.b, etc.) */
  answer_id: string;
  /** Points for this answer (0-2) */
  points: number;
}

/**
 * Advancement score result (Blueprint v2)
 */
export interface AdvancementScoreResult {
  /** Total advancement score */
  score: number;
  /** Count of YES answers to L5+ cases */
  yes_to_advanced_count: number;
  /** Count of "solved" follow-ups (NO → YES on follow_up_no) */
  solved_follow_up_count: number;
  /** Array of case IDs that were "solved" */
  solved_problems: string[];
  /** Whether high-baseline threshold was met */
  triggers_high_baseline: boolean;
}

// ==================== Triggers ====================

/**
 * High-baseline trigger configuration (v1 - deprecated)
 */
export interface HighBaselineConfig {
  /** Minimum YES count in Starter 6 */
  min_yes_count: number;
  /** Required case IDs where at least one YES is needed */
  required_cases: string[];
}

/**
 * Default high-baseline configuration (v1 - deprecated)
 */
export const DEFAULT_HIGH_BASELINE_CONFIG: HighBaselineConfig = {
  min_yes_count: 4,
  required_cases: ['case.5B', 'case.6C', 'case.6A', 'case.6B'],
};

/**
 * Blueprint v2: Advancement score configuration
 */
export interface AdvancementScoreConfig {
  /** Threshold for triggering high-baseline gate */
  threshold: number;
  /** Cases where YES indicates advanced problems (L5+) */
  advanced_cases: string[];
  /** Points for "solved" follow-ups by case */
  solved_follow_up_points: Record<string, number>;
}

/**
 * Default advancement score configuration (Blueprint v2)
 */
export const DEFAULT_ADVANCEMENT_CONFIG: AdvancementScoreConfig = {
  threshold: 3,
  advanced_cases: [
    'case.5A',
    'case.5B',
    'case.5C',
    'case.6A',
    'case.6B',
    'case.6C',
    'case.7A',
  ],
  solved_follow_up_points: {
    // L2-L3 problems solved = +1
    'case.1B': 1,
    'case.2A': 1,
    'case.2B': 1,
    'case.2C': 1,
    'case.3A': 1,
    'case.3B': 1,
    'case.3D': 1,
    'case.3E': 1,
    // L4+ problems solved = +2
    'case.4A': 2,
    'case.4B': 2,
    'case.5A': 2,
    'case.5B': 2,
    'case.5C': 2,
  },
};

// ==================== More Cases Selection ====================

/**
 * Pillar pool for more cases selection
 */
export interface PillarPool {
  pillar: string;
  unseen_cases: string[];
}

/**
 * More cases selection result
 */
export interface MoreCasesSelection {
  /** Selected case IDs */
  case_ids: string[];
  /** Reason for selection (debugging) */
  reason: string;
}

// ==================== Result Snapshot ====================

/**
 * Snapshot type for persistence
 */
export type SnapshotType =
  | 'starter_6'
  | 'after_deck'
  | 'advanced_calibration'
  | 'email_capture'
  | 'canonical';

/**
 * Result snapshot for persistence
 */
export interface ResultSnapshot {
  /** Snapshot type */
  type: SnapshotType;
  /** Session ID */
  session_id: string;
  /** Timestamp */
  timestamp: Date;
  /** Full assessment result */
  result: AssessmentResult;
  /** All answers at this point */
  answers: Answer[];
}
