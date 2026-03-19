/**
 * Content validator
 *
 * Validates assessment content for:
 * - Schema completeness (all required fields present)
 * - i18n coverage (all translatable fields have values)
 * - Data consistency (IDs, references, pillar/level references)
 */

import type { AssessmentContent, Case, QuickQuestion, MicroScenario } from '../types/assessment';

export interface ValidationError {
  type: 'schema' | 'i18n' | 'reference';
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate assessment content
 *
 * @param content - Assessment content to validate
 * @returns Validation result
 */
export function validateContent(content: AssessmentContent): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate meta
  if (!content.meta || !content.meta.id || !content.meta.version) {
    errors.push({
      type: 'schema',
      path: 'meta',
      message: 'Meta is missing required fields (id, version)',
    });
  }

  // Validate pillars
  if (!content.pillars || content.pillars.length === 0) {
    errors.push({
      type: 'schema',
      path: 'pillars',
      message: 'Pillars array is empty or missing',
    });
  } else {
    const pillarIds = new Set<string>();
    content.pillars.forEach((pillar, index) => {
      if (!pillar.id || !pillar.name) {
        errors.push({
          type: 'schema',
          path: `pillars[${index}]`,
          message: 'Pillar missing required fields (id, name)',
        });
      }
      if (pillar.id && pillarIds.has(pillar.id)) {
        errors.push({
          type: 'schema',
          path: `pillars[${index}]`,
          message: `Duplicate pillar ID: ${pillar.id}`,
        });
      }
      pillarIds.add(pillar.id);
    });
  }

  // Validate levels
  if (!content.levels || content.levels.length === 0) {
    errors.push({
      type: 'schema',
      path: 'levels',
      message: 'Levels array is empty or missing',
    });
  } else {
    const expectedLevels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
    const levelIds = content.levels.map((l) => l.id);
    const missing = expectedLevels.filter((id) => !levelIds.includes(id));
    if (missing.length > 0) {
      warnings.push({
        type: 'schema',
        path: 'levels',
        message: `Missing expected levels: ${missing.join(', ')}`,
      });
    }
  }

  // Validate cases
  if (!content.cases || content.cases.length === 0) {
    errors.push({
      type: 'schema',
      path: 'cases',
      message: 'Cases array is empty or missing',
    });
  } else {
    const caseIds = new Set<string>();
    content.cases.forEach((caseItem, index) => {
      validateCase(caseItem, index, errors, warnings);
      if (caseItem.id && caseIds.has(caseItem.id)) {
        errors.push({
          type: 'schema',
          path: `cases[${index}]`,
          message: `Duplicate case ID: ${caseItem.id}`,
        });
      }
      caseIds.add(caseItem.id);
    });
  }

  // Validate quick_questions
  if (content.quick_questions && content.quick_questions.length > 0) {
    const qqIds = new Set<string>();
    content.quick_questions.forEach((qq, index) => {
      validateQuickQuestion(qq, index, errors, warnings);
      if (qq.id && qqIds.has(qq.id)) {
        errors.push({
          type: 'schema',
          path: `quick_questions[${index}]`,
          message: `Duplicate quick_question ID: ${qq.id}`,
        });
      }
      qqIds.add(qq.id);
    });
  }

  // Validate micro_scenarios
  if (content.micro_scenarios && content.micro_scenarios.length > 0) {
    const msIds = new Set<string>();
    content.micro_scenarios.forEach((ms, index) => {
      validateMicroScenario(ms, index, errors, warnings);
      if (ms.id && msIds.has(ms.id)) {
        errors.push({
          type: 'schema',
          path: `micro_scenarios[${index}]`,
          message: `Duplicate micro_scenario ID: ${ms.id}`,
        });
      }
      msIds.add(ms.id);
    });
  }

  // Validate result_blocks
  if (!content.result_blocks || content.result_blocks.length === 0) {
    errors.push({
      type: 'schema',
      path: 'result_blocks',
      message: 'Result blocks array is empty or missing',
    });
  } else {
    const expectedResults = ['result.L1', 'result.L2', 'result.L3', 'result.L4', 'result.L5', 'result.L6', 'result.L7'];
    const resultIds = content.result_blocks.map((r) => r.id);
    const missing = expectedResults.filter((id) => !resultIds.includes(id));
    if (missing.length > 0) {
      errors.push({
        type: 'schema',
        path: 'result_blocks',
        message: `Missing expected result blocks: ${missing.join(', ')}`,
      });
    }
  }

  // Validate weights
  if (!content.weights) {
    warnings.push({
      type: 'schema',
      path: 'weights',
      message: 'Weights configuration is missing',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a single case
 */
function validateCase(
  caseItem: Case,
  index: number,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const path = `cases[${index}]`;

  if (!caseItem.id) {
    errors.push({ type: 'schema', path, message: 'Case missing id' });
  }
  if (!caseItem.title || caseItem.title.trim() === '') {
    errors.push({ type: 'i18n', path, message: 'Case missing title' });
  }
  if (!caseItem.body || caseItem.body.trim() === '') {
    errors.push({ type: 'i18n', path, message: 'Case missing body' });
  }
  if (typeof caseItem.level !== 'number' || caseItem.level < 1 || caseItem.level > 7) {
    errors.push({ type: 'schema', path, message: 'Case has invalid level (must be 1-7)' });
  }
  if (!caseItem.pillar) {
    errors.push({ type: 'schema', path, message: 'Case missing pillar' });
  }
  // Validate signals (supports both v5.0 array and v2 object format)
  if (!caseItem.signals) {
    errors.push({ type: 'schema', path, message: 'Case missing signals' });
  } else if (Array.isArray(caseItem.signals)) {
    // v5.0 format: Signal[]
    if (caseItem.signals.length === 0) {
      errors.push({ type: 'schema', path, message: 'Case missing signals' });
    }
  } else {
    // v2 format: { yes: Signal[], no: Signal[] }
    if (!caseItem.signals.yes || caseItem.signals.yes.length === 0) {
      errors.push({ type: 'schema', path, message: 'Case missing signals.yes' });
    }
  }
  // Validate answers (supports both v5.0 strings and v2 object format)
  if (!caseItem.answers || !caseItem.answers.yes) {
    errors.push({ type: 'i18n', path, message: 'Case missing answer text' });
  } else if (typeof caseItem.answers.yes === 'string') {
    // v5.0 format: { yes: string, not_yet: string }
    if (!(caseItem.answers as any).not_yet) {
      errors.push({ type: 'i18n', path, message: 'Case missing not_yet answer text' });
    }
  } else {
    // v2 format: { yes: { label, subtext }, no: { label, subtext } }
    if (!(caseItem.answers as any).no) {
      errors.push({ type: 'i18n', path, message: 'Case missing no answer text' });
    }
  }

  // Validate follow_up if present
  if (caseItem.follow_up) {
    if (!caseItem.follow_up.title || !caseItem.follow_up.prompt) {
      errors.push({ type: 'i18n', path: `${path}.follow_up`, message: 'Follow-up missing text' });
    }
    if (!caseItem.follow_up.signals || caseItem.follow_up.signals.length === 0) {
      errors.push({ type: 'schema', path: `${path}.follow_up`, message: 'Follow-up missing signals' });
    }
  }
}

/**
 * Validate a quick question
 */
function validateQuickQuestion(
  qq: QuickQuestion,
  index: number,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const path = `quick_questions[${index}]`;

  if (!qq.id) {
    errors.push({ type: 'schema', path, message: 'Quick question missing id' });
  }
  if (!qq.title || qq.title.trim() === '') {
    errors.push({ type: 'i18n', path, message: 'Quick question missing title' });
  }
  if (!qq.prompt || qq.prompt.trim() === '') {
    errors.push({ type: 'i18n', path, message: 'Quick question missing prompt' });
  }
  if (!qq.options || qq.options.length === 0) {
    errors.push({ type: 'schema', path, message: 'Quick question has no options' });
  } else {
    qq.options.forEach((option, optIndex) => {
      if (!option.id || !option.text) {
        errors.push({
          type: 'schema',
          path: `${path}.options[${optIndex}]`,
          message: 'Option missing id or text',
        });
      }
      if (!option.signals || option.signals.length === 0) {
        errors.push({
          type: 'schema',
          path: `${path}.options[${optIndex}]`,
          message: 'Option missing signals',
        });
      }
    });
  }
}

/**
 * Validate a micro scenario
 */
function validateMicroScenario(
  ms: MicroScenario,
  index: number,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const path = `micro_scenarios[${index}]`;

  if (!ms.id) {
    errors.push({ type: 'schema', path, message: 'Micro scenario missing id' });
  }
  if (!ms.title || ms.title.trim() === '') {
    errors.push({ type: 'i18n', path, message: 'Micro scenario missing title' });
  }
  if (!ms.prompt || ms.prompt.trim() === '') {
    errors.push({ type: 'i18n', path, message: 'Micro scenario missing prompt' });
  }
  if (!ms.options || ms.options.length === 0) {
    errors.push({ type: 'schema', path, message: 'Micro scenario has no options' });
  } else {
    ms.options.forEach((option, optIndex) => {
      if (!option.id || !option.text) {
        errors.push({
          type: 'schema',
          path: `${path}.options[${optIndex}]`,
          message: 'Option missing id or text',
        });
      }
      if (!option.signals || option.signals.length === 0) {
        errors.push({
          type: 'schema',
          path: `${path}.options[${optIndex}]`,
          message: 'Option missing signals',
        });
      }
    });
  }
}
