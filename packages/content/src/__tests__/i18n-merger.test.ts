/**
 * Tests for i18n merger
 */

import { describe, it, expect } from 'vitest';
import { loadCoreContent, loadLocaleContent } from '../loaders/yaml-loader';
import { mergeLocaleContent } from '../loaders/i18n-merger';

describe('i18n Merger', () => {
  it('should merge Russian overlay into core content', () => {
    const core = loadCoreContent();
    const overlay = loadLocaleContent('ru');
    const merged = mergeLocaleContent(core, overlay);

    expect(merged).toBeDefined();
    expect(merged.meta.locale).toBe('ru');
    expect(merged.meta.id).toBe(core.meta.id); // ID should not change
  });

  it('should preserve core structure', () => {
    const core = loadCoreContent();
    const overlay = loadLocaleContent('ru');
    const merged = mergeLocaleContent(core, overlay);

    // Same number of items
    expect(merged.pillars.length).toBe(core.pillars.length);
    expect(merged.levels.length).toBe(core.levels.length);
    expect(merged.cases.length).toBe(core.cases.length);
    expect(merged.result_blocks.length).toBe(core.result_blocks.length);

    // Same IDs
    expect(merged.pillars.map((p) => p.id)).toEqual(core.pillars.map((p) => p.id));
    expect(merged.cases.map((c) => c.id)).toEqual(core.cases.map((c) => c.id));
  });

  // TODO: Enable when Russian i18n translations are properly configured
  // The ru.yml file currently has same content as en.yml
  it.skip('should merge pillar names', () => {
    const core = loadCoreContent();
    const overlay = loadLocaleContent('ru');
    const merged = mergeLocaleContent(core, overlay);

    const corePillar = core.pillars.find((p) => p.id === 'context_system');
    const mergedPillar = merged.pillars.find((p) => p.id === 'context_system');

    expect(corePillar).toBeDefined();
    expect(mergedPillar).toBeDefined();
    expect(mergedPillar!.name).not.toBe(corePillar!.name); // Should be Russian
  });

  // TODO: Enable when Russian i18n translations are properly configured
  it.skip('should merge case text fields', () => {
    const core = loadCoreContent();
    const overlay = loadLocaleContent('ru');
    const merged = mergeLocaleContent(core, overlay);

    const coreCase = core.cases[0];
    const mergedCase = merged.cases[0];

    expect(coreCase).toBeDefined();
    expect(mergedCase).toBeDefined();
    expect(mergedCase.id).toBe(coreCase.id); // ID unchanged
    expect(mergedCase.title).not.toBe(coreCase.title); // Title should be Russian
  });

  it('should preserve signals', () => {
    const core = loadCoreContent();
    const overlay = loadLocaleContent('ru');
    const merged = mergeLocaleContent(core, overlay);

    const coreCase = core.cases[0];
    const mergedCase = merged.cases[0];

    // Signals should be unchanged
    expect(mergedCase.signals).toEqual(coreCase.signals);
  });

  it('should not mutate core content', () => {
    const core = loadCoreContent();
    const overlay = loadLocaleContent('ru');
    const originalCoreTitle = core.meta.title;

    mergeLocaleContent(core, overlay);

    // Core should remain unchanged
    expect(core.meta.title).toBe(originalCoreTitle);
  });
});
