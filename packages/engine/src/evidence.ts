/**
 * Evidence collection from user answers
 *
 * Blueprint v2: Supports both v5.0 and v2 signal formats
 *
 * Extracts evidence points from:
 * - Case YES answers (signals.yes or signals[] for v5.0)
 * - Case NO answers (signals.no for v2 only)
 * - Case follow-up YES/NO answers (follow_up_yes, follow_up_no)
 * - Quick question options (signals from selected option)
 * - Micro-scenario options (signals from selected option)
 */

import type { Evidence, Answer } from './types';
import type {
  AssessmentContent,
  Case,
  QuickQuestion,
  MicroScenario,
  Signal,
  CaseSignalsV2,
} from '@community/content';

/**
 * Converts Signal to Evidence (adds default scope)
 */
function signalToEvidence(signal: Signal): Evidence {
  return {
    pillar: signal.pillar,
    level: signal.level,
    weight: signal.weight,
    scope: signal.scope === 'gated_only' ? 'gated_only' : 'public',
  };
}

/**
 * Type guard: checks if signals is v2 format (object with yes/no)
 */
function isSignalsV2(signals: Signal[] | CaseSignalsV2): signals is CaseSignalsV2 {
  return !Array.isArray(signals) && 'yes' in signals && 'no' in signals;
}

/**
 * Gets signals for a specific answer type (yes/no) from case signals
 * Handles both v5.0 (array) and v2 (object) formats
 */
function getCaseSignals(signals: Signal[] | CaseSignalsV2, answerType: 'yes' | 'no'): Signal[] {
  if (isSignalsV2(signals)) {
    // v2 format: { yes: Signal[], no: Signal[] }
    return signals[answerType] || [];
  } else {
    // v5.0 format: Signal[] (only for YES answers)
    return answerType === 'yes' ? signals : [];
  }
}

/**
 * Extracts evidence from a Case answer
 * Blueprint v2: Supports both v5.0 and v2 formats, including follow_up_no
 */
function extractCaseEvidence(
  caseItem: Case,
  answer: Answer,
  followUpAnswer?: Answer
): Evidence[] {
  const evidence: Evidence[] = [];
  const answerType = answer.answer_id as 'yes' | 'no';

  // Get signals based on answer type (v5.0: only YES has signals, v2: both have signals)
  const signals = getCaseSignals(caseItem.signals, answerType);
  evidence.push(...signals.map(signalToEvidence));

  // Handle follow-ups based on answer type
  if (answerType === 'yes') {
    // YES answer: check for follow_up_yes or legacy follow_up
    const followUp = caseItem.follow_up_yes || caseItem.follow_up;
    if (followUp && followUpAnswer?.answer_id) {
      // v2 follow_up_yes has signals: { yes: Signal[], no: Signal[] }
      if ('signals' in followUp && !Array.isArray(followUp.signals)) {
        const fuSignals = followUp.signals as CaseSignalsV2;
        const fuAnswer = followUpAnswer.answer_id as 'yes' | 'no';
        evidence.push(...(fuSignals[fuAnswer] || []).map(signalToEvidence));
      } else if ('signals' in followUp && followUpAnswer.answer_id === 'yes') {
        // Legacy v5.0 follow_up: only has signals array (for YES only)
        evidence.push(...(followUp.signals as Signal[]).map(signalToEvidence));
      }
    }
  } else if (answerType === 'no') {
    // NO answer: check for follow_up_no (Blueprint v2 only)
    if (caseItem.follow_up_no && followUpAnswer?.answer_id) {
      const fuSignals = caseItem.follow_up_no.signals;
      const fuAnswer = followUpAnswer.answer_id as 'yes' | 'no';
      evidence.push(...(fuSignals[fuAnswer] || []).map(signalToEvidence));
    }
  }

  return evidence;
}

/**
 * Extracts evidence from a Quick Question answer
 */
function extractQuickQuestionEvidence(
  qq: QuickQuestion,
  answer: Answer
): Evidence[] {
  const option = qq.options.find((opt: any) => opt.id === answer.answer_id);
  if (!option) return [];

  return option.signals.map(signalToEvidence);
}

/**
 * Extracts evidence from a Micro Scenario answer
 */
function extractMicroScenarioEvidence(
  ms: MicroScenario,
  answer: Answer
): Evidence[] {
  const option = ms.options.find((opt: any) => opt.id === answer.answer_id);
  if (!option) return [];

  return option.signals.map(signalToEvidence);
}

/**
 * Collects all evidence from user answers
 *
 * @param answers - User answers
 * @param content - Assessment content (cases, questions, scenarios)
 * @returns Array of evidence points
 *
 * @example
 * ```ts
 * const evidence = collectEvidence(answers, content);
 * // Evidence points for scoring
 * ```
 */
export function collectEvidence(
  answers: Answer[],
  content: AssessmentContent
): Evidence[] {
  const evidence: Evidence[] = [];

  // Build lookup maps
  const casesById = new Map(content.cases.map((c: Case) => [c.id, c]));
  const qqById = new Map(content.quick_questions.map((qq: QuickQuestion) => [qq.id, qq]));
  const msById = new Map(content.micro_scenarios.map((ms: MicroScenario) => [ms.id, ms]));

  // Group answers by item_id for follow-up handling
  const answersByItem = new Map<string, Answer>();
  const followUpAnswers = new Map<string, Answer>();

  for (const answer of answers) {
    // Check if this is a follow-up answer (format: "case.XY_followup")
    if (answer.item_id.includes('_followup')) {
      const caseId = answer.item_id.replace('_followup', '');
      followUpAnswers.set(caseId, answer);
    } else {
      answersByItem.set(answer.item_id, answer);
    }
  }

  // Extract evidence from each answer
  for (const [itemId, answer] of answersByItem) {
    // Try Case
    const caseItem = casesById.get(itemId);
    if (caseItem) {
      const followUp = followUpAnswers.get(itemId);
      evidence.push(...extractCaseEvidence(caseItem, answer, followUp));
      continue;
    }

    // Try Quick Question
    const qq = qqById.get(itemId);
    if (qq) {
      evidence.push(...extractQuickQuestionEvidence(qq, answer));
      continue;
    }

    // Try Micro Scenario
    const ms = msById.get(itemId);
    if (ms) {
      evidence.push(...extractMicroScenarioEvidence(ms, answer));
      continue;
    }

    // Unknown item_id - skip
  }

  return evidence;
}

/**
 * Filters evidence by pillar
 */
export function filterByPillar(
  evidence: Evidence[],
  pillar: string
): Evidence[] {
  return evidence.filter((e) => e.pillar === pillar);
}

/**
 * Filters evidence by scope (excludes horizon_only for scoring)
 */
export function filterByScope(
  evidence: Evidence[],
  includeGated: boolean
): Evidence[] {
  return evidence.filter((e) => {
    // Always exclude horizon
    if (e.scope === 'horizon_only') return false;

    // Include public always
    if (e.scope === 'public') return true;

    // Include gated only if flag is set
    if (e.scope === 'gated_only') return includeGated;

    return true;
  });
}

/**
 * Checks if any L7 horizon case was answered YES
 */
export function hasHorizonYes(
  answers: Answer[],
  content: AssessmentContent
): boolean {
  const horizonCases = content.cases.filter((c: Case) => c.level === 7);
  const horizonCaseIds = new Set(horizonCases.map((c: Case) => c.id));

  return answers.some(
    (a) => horizonCaseIds.has(a.item_id) && a.answer_id === 'yes'
  );
}
