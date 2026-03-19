/**
 * Tone Modifiers (Blueprint v2)
 *
 * Applies track-specific language adjustments to result blocks.
 *
 * Tone Types:
 * - `encouraging` (Beginner track, L1-L2): Softer language, validation, small-step framing
 * - `challenge` (Advanced track, L3-L7): Direct language, optimization framing
 */

import type { ToneType, TrackId } from './types';

// ==================== Tone Configuration Types ====================

export interface LevelWrapper {
  /** Opening statement for this level */
  opener: string;
  /** Prefix for next_move field */
  next_move_prefix: string;
  /** Optional encouragement message */
  encouragement?: string | null;
}

export interface ReframeConfig {
  /** Prefix to add before field content */
  prefix: string;
}

export interface ToneModifierConfig {
  /** Prefix to add before entire result */
  result_prefix: string | null;
  /** Suffix to add after entire result */
  result_suffix: string | null;
  /** Level-specific wrappers */
  level_wrappers: Record<string, LevelWrapper>;
  /** Cost field reframe */
  cost_reframe: ReframeConfig;
  /** Breaks field reframe */
  breaks_reframe: ReframeConfig;
}

// ==================== Result Block Types ====================

export interface ResultBlock {
  /** Level ID (L1-L7) */
  level: number;
  /** Title */
  title: string;
  /** "You are..." description */
  you_are: string;
  /** What breaks under load */
  breaks: string;
  /** The cost/bottleneck */
  cost: string;
  /** Next move recommendation */
  next_move: string;
  /** Optional note */
  note?: string;
}

export interface TonedResultBlock extends ResultBlock {
  /** Opening statement from tone modifier */
  opener?: string | null;
  /** Result prefix from tone modifier */
  result_prefix?: string | null;
  /** Result suffix from tone modifier */
  result_suffix?: string | null;
  /** Encouragement message from tone modifier */
  encouragement?: string | null;
  /** Whether tone modifiers were applied */
  tone_applied: ToneType;
}

// ==================== Default Tone Configurations ====================

export const DEFAULT_TONE_MODIFIERS: Record<ToneType, ToneModifierConfig> = {
  encouraging: {
    result_prefix: "You're getting started \u2014 that's the important part.",
    result_suffix: 'Small steps lead to big changes.',
    level_wrappers: {
      L1: {
        opener: "You're at the beginning of your AI journey.",
        next_move_prefix: 'Your next small step: ',
        encouragement:
          "Most professionals are exactly where you are. The fact that you're assessing yourself puts you ahead.",
      },
      L2: {
        opener: "You've started building habits \u2014 that's real progress.",
        next_move_prefix: 'To keep growing: ',
        encouragement:
          "You're no longer just experimenting. You're building something.",
      },
    },
    cost_reframe: {
      prefix: "What's holding you back: ",
    },
    breaks_reframe: {
      prefix: 'Where things get tricky: ',
    },
  },
  challenge: {
    result_prefix: null,
    result_suffix: null,
    level_wrappers: {
      L3: {
        opener:
          "You're coordinating multiple AI tools \u2014 that's non-trivial.",
        next_move_prefix: 'Your edge to sharpen: ',
        encouragement: null,
      },
      L4: {
        opener:
          "You've built processes. Now they need to run without you.",
        next_move_prefix: 'Your next optimization: ',
        encouragement: null,
      },
      L5: {
        opener: "You've personalized your setup. Few people get here.",
        next_move_prefix: 'Your refinement: ',
        encouragement:
          "You're ahead of most. Let's find what's still manual.",
      },
      L6: {
        opener: "You're operating with a digital team. This is rare.",
        next_move_prefix: 'Your governance challenge: ',
        encouragement: "We'd love to learn how you got here.",
      },
      L7: {
        opener:
          "You're building systems that work across people. Frontier territory.",
        next_move_prefix: 'The horizon: ',
        encouragement: "You're defining what's possible. Let's talk.",
      },
    },
    cost_reframe: {
      prefix: 'The bottleneck: ',
    },
    breaks_reframe: {
      prefix: 'What breaks under load: ',
    },
  },
};

// ==================== Tone Application Functions ====================

/**
 * Gets the tone type for a track
 *
 * @param trackId - User's track ID
 * @returns Tone type (encouraging or challenge)
 */
export function getToneForTrack(trackId: TrackId): ToneType {
  return trackId === 'beginner' ? 'encouraging' : 'challenge';
}

/**
 * Applies tone modifiers to a result block
 *
 * @param resultBlock - Original result block
 * @param trackId - User's track ID
 * @param toneConfig - Optional custom tone configuration
 * @returns Result block with tone modifiers applied
 *
 * @example
 * ```ts
 * const tonedResult = applyToneModifiers(resultBlock, 'beginner');
 * console.log(tonedResult.opener); // "You're at the beginning..."
 * console.log(tonedResult.breaks); // "Where things get tricky: ..."
 * ```
 */
export function applyToneModifiers(
  resultBlock: ResultBlock,
  trackId: TrackId,
  toneConfig: Record<ToneType, ToneModifierConfig> = DEFAULT_TONE_MODIFIERS
): TonedResultBlock {
  const toneType = getToneForTrack(trackId);
  const tone = toneConfig[toneType];
  const levelKey = `L${resultBlock.level}`;
  const levelWrapper = tone.level_wrappers[levelKey];

  return {
    ...resultBlock,
    // Apply level-specific opener
    opener: levelWrapper?.opener || null,
    // Apply reframed fields
    breaks: tone.breaks_reframe.prefix + resultBlock.breaks,
    cost: tone.cost_reframe.prefix + resultBlock.cost,
    // Apply prefixed next_move
    next_move: (levelWrapper?.next_move_prefix || '') + resultBlock.next_move,
    // Add encouragement
    encouragement: levelWrapper?.encouragement || null,
    // Add result prefix/suffix
    result_prefix: tone.result_prefix,
    result_suffix: tone.result_suffix,
    // Mark that tone was applied
    tone_applied: toneType,
  };
}

/**
 * Gets the result framing for a track (intro and encouragement)
 *
 * @param trackId - User's track ID
 * @returns Object with intro and encouragement strings
 */
export function getResultFraming(trackId: TrackId): {
  intro: string;
  encouragement: string;
} {
  if (trackId === 'beginner') {
    return {
      intro: "Here's where you are on your AI journey",
      encouragement:
        "You're not alone \u2014 most professionals are at this stage.",
    };
  }

  return {
    intro: "Here's your advanced AI working mode",
    encouragement: "You're ahead of most \u2014 let's find your edge cases.",
  };
}
