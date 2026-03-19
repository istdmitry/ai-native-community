/**
 * Blueprint v2 Tone Modifiers Tests
 *
 * Tests tone modifier application and result framing.
 * Based on tests_v2_additions.yml → result_contract_tests section.
 */

import { describe, it, expect } from 'vitest';
import {
  getToneForTrack,
  applyToneModifiers,
  getResultFraming,
  DEFAULT_TONE_MODIFIERS,
  type ResultBlock,
} from '../tone-modifiers';

describe('Tone Modifiers Tests', () => {
  describe('getToneForTrack', () => {
    it('should return encouraging for beginner track', () => {
      expect(getToneForTrack('beginner')).toBe('encouraging');
    });

    it('should return challenge for advanced track', () => {
      expect(getToneForTrack('advanced')).toBe('challenge');
    });
  });

  describe('getResultFraming', () => {
    it('result_framing_beginner: Beginner gets encouraging framing', () => {
      const framing = getResultFraming('beginner');

      expect(framing.intro).toBe("Here's where you are on your AI journey");
      expect(framing.encouragement).toContain("You're not alone");
    });

    it('result_framing_advanced: Advanced gets challenge framing', () => {
      const framing = getResultFraming('advanced');

      expect(framing.intro).toBe("Here's your advanced AI working mode");
      expect(framing.encouragement).toContain("You're ahead of most");
    });
  });

  describe('applyToneModifiers', () => {
    const baseResultBlock: ResultBlock = {
      level: 1,
      title: 'Level 1',
      you_are: 'An ad hoc executor',
      breaks: 'Context is lost between sessions',
      cost: 'Repeated setup time',
      next_move: 'Start documenting your prompts',
    };

    describe('Beginner Track (Encouraging Tone)', () => {
      it('tone_modifier_beginner_l1: Beginner L1 gets encouraging tone modifiers', () => {
        const result = applyToneModifiers(baseResultBlock, 'beginner');

        expect(result.tone_applied).toBe('encouraging');
        expect(result.opener).toBe("You're at the beginning of your AI journey.");
        expect(result.breaks).toContain('Where things get tricky:');
        expect(result.cost).toContain("What's holding you back:");
        expect(result.next_move).toContain('Your next small step:');
        expect(result.encouragement).toContain('Most professionals are exactly where you are');
        expect(result.result_prefix).toContain("You're getting started");
        expect(result.result_suffix).toBe('Small steps lead to big changes.');
      });

      it('tone_modifier_beginner_l2: Beginner L2 gets encouraging tone modifiers', () => {
        const l2Block: ResultBlock = { ...baseResultBlock, level: 2 };
        const result = applyToneModifiers(l2Block, 'beginner');

        expect(result.tone_applied).toBe('encouraging');
        expect(result.opener).toBe("You've started building habits — that's real progress.");
        expect(result.next_move).toContain('To keep growing:');
        expect(result.encouragement).toContain("You're no longer just experimenting");
      });
    });

    describe('Advanced Track (Challenge Tone)', () => {
      it('tone_modifier_advanced_l3: Advanced L3 gets challenge tone modifiers', () => {
        const l3Block: ResultBlock = { ...baseResultBlock, level: 3 };
        const result = applyToneModifiers(l3Block, 'advanced');

        expect(result.tone_applied).toBe('challenge');
        expect(result.opener).toBe("You're coordinating multiple AI tools — that's non-trivial.");
        expect(result.breaks).toContain('What breaks under load:');
        expect(result.cost).toContain('The bottleneck:');
        expect(result.next_move).toContain('Your edge to sharpen:');
        expect(result.encouragement).toBeNull();
        expect(result.result_prefix).toBeNull();
        expect(result.result_suffix).toBeNull();
      });

      it('tone_modifier_advanced_l4: Advanced L4 gets challenge tone modifiers', () => {
        const l4Block: ResultBlock = { ...baseResultBlock, level: 4 };
        const result = applyToneModifiers(l4Block, 'advanced');

        expect(result.tone_applied).toBe('challenge');
        expect(result.opener).toBe("You've built processes. Now they need to run without you.");
        expect(result.next_move).toContain('Your next optimization:');
        expect(result.encouragement).toBeNull();
      });

      it('tone_modifier_advanced_l5: Advanced L5 gets challenge tone with encouragement', () => {
        const l5Block: ResultBlock = { ...baseResultBlock, level: 5 };
        const result = applyToneModifiers(l5Block, 'advanced');

        expect(result.tone_applied).toBe('challenge');
        expect(result.opener).toBe("You've personalized your setup. Few people get here.");
        expect(result.next_move).toContain('Your refinement:');
        expect(result.encouragement).toBe("You're ahead of most. Let's find what's still manual.");
      });

      it('tone_modifier_advanced_l6: Advanced L6 gets rare territory messaging', () => {
        const l6Block: ResultBlock = { ...baseResultBlock, level: 6 };
        const result = applyToneModifiers(l6Block, 'advanced');

        expect(result.tone_applied).toBe('challenge');
        expect(result.opener).toBe("You're operating with a digital team. This is rare.");
        expect(result.next_move).toContain('Your governance challenge:');
        expect(result.encouragement).toBe("We'd love to learn how you got here.");
      });

      it('tone_modifier_advanced_l7: Advanced L7 gets frontier messaging', () => {
        const l7Block: ResultBlock = { ...baseResultBlock, level: 7 };
        const result = applyToneModifiers(l7Block, 'advanced');

        expect(result.tone_applied).toBe('challenge');
        expect(result.opener).toContain('Frontier territory');
        expect(result.next_move).toContain('The horizon:');
        expect(result.encouragement).toContain("You're defining what's possible");
      });
    });

    describe('Edge Cases', () => {
      it('should handle level without specific wrapper (use null)', () => {
        // Beginner track has wrappers only for L1-L2
        // L3 should not have a wrapper in encouraging tone
        const l3Block: ResultBlock = { ...baseResultBlock, level: 3 };
        const result = applyToneModifiers(l3Block, 'beginner');

        expect(result.opener).toBeNull();
        // But should still apply reframes
        expect(result.breaks).toContain('Where things get tricky:');
        expect(result.cost).toContain("What's holding you back:");
      });

      it('should preserve original fields', () => {
        const result = applyToneModifiers(baseResultBlock, 'beginner');

        expect(result.level).toBe(baseResultBlock.level);
        expect(result.title).toBe(baseResultBlock.title);
        expect(result.you_are).toBe(baseResultBlock.you_are);
      });

      it('should handle result block with note', () => {
        const blockWithNote: ResultBlock = {
          ...baseResultBlock,
          note: 'This is a note',
        };
        const result = applyToneModifiers(blockWithNote, 'beginner');

        expect(result.note).toBe('This is a note');
      });
    });
  });

  describe('DEFAULT_TONE_MODIFIERS configuration', () => {
    it('should have encouraging tone with L1 and L2 wrappers', () => {
      const encouraging = DEFAULT_TONE_MODIFIERS.encouraging;

      expect(encouraging.level_wrappers).toHaveProperty('L1');
      expect(encouraging.level_wrappers).toHaveProperty('L2');
      expect(encouraging.result_prefix).toBeDefined();
      expect(encouraging.result_suffix).toBeDefined();
    });

    it('should have challenge tone with L3-L7 wrappers', () => {
      const challenge = DEFAULT_TONE_MODIFIERS.challenge;

      expect(challenge.level_wrappers).toHaveProperty('L3');
      expect(challenge.level_wrappers).toHaveProperty('L4');
      expect(challenge.level_wrappers).toHaveProperty('L5');
      expect(challenge.level_wrappers).toHaveProperty('L6');
      expect(challenge.level_wrappers).toHaveProperty('L7');
      expect(challenge.result_prefix).toBeNull();
      expect(challenge.result_suffix).toBeNull();
    });

    it('should have different breaks_reframe prefixes for each tone', () => {
      expect(DEFAULT_TONE_MODIFIERS.encouraging.breaks_reframe.prefix).toBe(
        'Where things get tricky: '
      );
      expect(DEFAULT_TONE_MODIFIERS.challenge.breaks_reframe.prefix).toBe(
        'What breaks under load: '
      );
    });

    it('should have different cost_reframe prefixes for each tone', () => {
      expect(DEFAULT_TONE_MODIFIERS.encouraging.cost_reframe.prefix).toBe(
        "What's holding you back: "
      );
      expect(DEFAULT_TONE_MODIFIERS.challenge.cost_reframe.prefix).toBe('The bottleneck: ');
    });
  });
});
