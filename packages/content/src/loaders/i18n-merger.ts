/**
 * i18n content merger
 *
 * Deep merges locale overlay into core content while preserving structure.
 * Overlays only text fields, does not alter IDs, signals, or structural data.
 */

import type { AssessmentContent } from '../types/assessment';

/**
 * Check if value is a plain object (not array, not null)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Deep merge two objects
 *
 * - Recursively merges nested objects
 * - Arrays are replaced (not merged)
 * - Primitive values from overlay take precedence
 *
 * @param target - Base object
 * @param overlay - Overlay object
 * @returns Merged object (mutates target)
 */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  overlay: Partial<T>
): T {
  for (const key in overlay) {
    const overlayValue = overlay[key];
    const targetValue = target[key];

    if (overlayValue === undefined) {
      continue;
    }

    // If both are plain objects, merge recursively
    if (isPlainObject(overlayValue) && isPlainObject(targetValue)) {
      target[key] = deepMerge(
        targetValue as Record<string, unknown>,
        overlayValue as Record<string, unknown>
      ) as T[Extract<keyof T, string>];
    } else {
      // Replace with overlay value (handles primitives and arrays)
      target[key] = overlayValue as T[Extract<keyof T, string>];
    }
  }

  return target;
}

/**
 * Merge locale overlay into core assessment content
 *
 * Strategy:
 * - Meta, pillars, levels: Replace text fields (name, title, description)
 * - UI strings: Deep merge all text
 * - Cards: Deep merge text fields
 * - Cases/questions/scenarios: Match by ID, merge text fields (title, body, prompt, answers)
 * - Result blocks: Match by ID, merge text fields
 * - Preserve: IDs, signals, weights, structural data
 *
 * @param core - Core assessment content (English)
 * @param overlay - Locale overlay (partial content)
 * @returns Merged content with locale text applied
 */
export function mergeLocaleContent(
  core: AssessmentContent,
  overlay: Partial<AssessmentContent>
): AssessmentContent {
  // Clone core to avoid mutation
  const merged = JSON.parse(JSON.stringify(core)) as AssessmentContent;

  // Merge meta (title, description)
  if (overlay.meta) {
    merged.meta = { ...merged.meta, ...overlay.meta };
  }

  // Merge pillars (name, description)
  if (overlay.pillars && Array.isArray(overlay.pillars)) {
    merged.pillars = merged.pillars.map((corePillar) => {
      const overlayPillar = overlay.pillars!.find((p) => p.id === corePillar.id);
      return overlayPillar ? { ...corePillar, ...overlayPillar } : corePillar;
    });
  }

  // Merge levels (name, mode_name)
  if (overlay.levels && Array.isArray(overlay.levels)) {
    merged.levels = merged.levels.map((coreLevel) => {
      const overlayLevel = overlay.levels!.find((l) => l.id === coreLevel.id);
      return overlayLevel ? { ...coreLevel, ...overlayLevel } : coreLevel;
    });
  }

  // Merge ui_strings (deep merge)
  if (overlay.ui_strings) {
    merged.ui_strings = deepMerge(
      merged.ui_strings as any,
      overlay.ui_strings as any
    ) as typeof merged.ui_strings;
  }

  // Merge cards (deep merge)
  if (overlay.cards) {
    merged.cards = deepMerge(
      merged.cards as any,
      overlay.cards as any
    ) as typeof merged.cards;
  }

  // Merge cases (match by ID)
  if (overlay.cases && Array.isArray(overlay.cases)) {
    merged.cases = merged.cases.map((coreCase) => {
      const overlayCase = overlay.cases!.find((c) => c.id === coreCase.id);
      if (!overlayCase) return coreCase;

      // Deep merge case, including follow_up if present
      return deepMerge({ ...coreCase }, overlayCase);
    });
  }

  // Merge micro_scenarios (match by ID)
  if (overlay.micro_scenarios && Array.isArray(overlay.micro_scenarios)) {
    merged.micro_scenarios = merged.micro_scenarios.map((coreScenario) => {
      const overlayScenario = overlay.micro_scenarios!.find((s) => s.id === coreScenario.id);
      if (!overlayScenario) return coreScenario;

      // Merge scenario and options
      return deepMerge({ ...coreScenario }, overlayScenario);
    });
  }

  // Merge quick_questions (match by ID)
  if (overlay.quick_questions && Array.isArray(overlay.quick_questions)) {
    merged.quick_questions = merged.quick_questions.map((coreQuestion) => {
      const overlayQuestion = overlay.quick_questions!.find((q) => q.id === coreQuestion.id);
      if (!overlayQuestion) return coreQuestion;

      // Merge question and options
      return deepMerge({ ...coreQuestion }, overlayQuestion);
    });
  }

  // Merge result_blocks (match by ID)
  if (overlay.result_blocks && Array.isArray(overlay.result_blocks)) {
    merged.result_blocks = merged.result_blocks.map((coreBlock) => {
      const overlayBlock = overlay.result_blocks!.find((b) => b.id === coreBlock.id);
      return overlayBlock ? { ...coreBlock, ...overlayBlock } : coreBlock;
    });
  }

  // Merge result_explanation
  if (overlay.result_explanation) {
    merged.result_explanation = {
      ...merged.result_explanation,
      ...overlay.result_explanation,
    };
  }

  // Weights are not translated (preserve core)

  return merged;
}
