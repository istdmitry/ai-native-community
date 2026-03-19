/**
 * Report content loaders
 *
 * Loads and provides access to report-specific content:
 * - habits.yml - Keystone habits and micro-tasks for L1-L3 transitions
 * - constraints.yml - Pillar-level constraints, strengths, and anti-patterns
 * - l4plus.yml - L4+ specific maintenance content
 * - global.yml - Global report content (CTAs, labels, positioning)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as yaml from 'js-yaml';
import type {
  HabitsContent,
  ConstraintsContent,
  L4PlusContent,
  GlobalContent,
  PillarId,
  HabitsTransition,
  ConstraintLevel,
  L4PlusPillarContent,
} from '../types/report';

/**
 * Base path to report content data directory
 */
const REPORT_DATA_DIR = process.env.CONTENT_DATA_DIR
  ? resolve(process.env.CONTENT_DATA_DIR, 'report')
  : resolve(process.cwd(), '../../packages/content/data/report');

/**
 * Load and parse a YAML file with error handling
 */
function loadYAML<T>(filePath: string): T {
  try {
    const fileContent = readFileSync(filePath, 'utf8');
    const parsed = yaml.load(fileContent);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error(`Invalid YAML structure in ${filePath}`);
    }

    return parsed as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load YAML from ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

// ==================== Content Caching ====================

let cachedHabits: HabitsContent | null = null;
let cachedConstraints: ConstraintsContent | null = null;
let cachedL4Plus: L4PlusContent | null = null;
let cachedGlobal: GlobalContent | null = null;

/**
 * Clear all cached content (useful for testing)
 */
export function clearReportContentCache(): void {
  cachedHabits = null;
  cachedConstraints = null;
  cachedL4Plus = null;
  cachedGlobal = null;
}

// ==================== Raw Content Loaders ====================

/**
 * Load habits content
 */
export function loadHabitsContent(): HabitsContent {
  if (cachedHabits) return cachedHabits;
  const filePath = resolve(REPORT_DATA_DIR, 'habits.yml');
  cachedHabits = loadYAML<HabitsContent>(filePath);
  return cachedHabits;
}

/**
 * Load constraints content
 */
export function loadConstraintsContent(): ConstraintsContent {
  if (cachedConstraints) return cachedConstraints;
  const filePath = resolve(REPORT_DATA_DIR, 'constraints.yml');
  cachedConstraints = loadYAML<ConstraintsContent>(filePath);
  return cachedConstraints;
}

/**
 * Load L4+ content
 */
export function loadL4PlusContent(): L4PlusContent {
  if (cachedL4Plus) return cachedL4Plus;
  const filePath = resolve(REPORT_DATA_DIR, 'l4plus.yml');
  cachedL4Plus = loadYAML<L4PlusContent>(filePath);
  return cachedL4Plus;
}

/**
 * Load global report content
 */
export function loadGlobalContent(): GlobalContent {
  if (cachedGlobal) return cachedGlobal;
  const filePath = resolve(REPORT_DATA_DIR, 'global.yml');
  cachedGlobal = loadYAML<GlobalContent>(filePath);
  return cachedGlobal;
}

// ==================== Helper Functions ====================

/**
 * Get habits for a specific pillar and transition
 *
 * @param pillarId - Pillar identifier
 * @param fromLevel - Current level (1-3)
 * @returns Transition habits or null if not found
 *
 * @example
 * ```typescript
 * const habits = getHabitsForTransition('context_system', 2);
 * // Returns habits for transitioning from L2 to L3 in context_system
 * ```
 */
export function getHabitsForTransition(
  pillarId: PillarId,
  fromLevel: number
): HabitsTransition | null {
  const content = loadHabitsContent();
  const pillarTransitions = content.transitions[pillarId];

  if (!pillarTransitions) return null;

  const transitionKey = `${fromLevel}->${fromLevel + 1}`;
  return pillarTransitions[transitionKey] || null;
}

/**
 * Get constraint info for a specific pillar and level
 *
 * @param pillarId - Pillar identifier
 * @param level - Level (1-6)
 * @returns Constraint level info or null if not found
 */
export function getConstraintForLevel(
  pillarId: PillarId,
  level: number
): ConstraintLevel | null {
  const content = loadConstraintsContent();
  const pillar = content.pillars[pillarId];

  if (!pillar) return null;

  return pillar.levels[level.toString()] || null;
}

/**
 * Get pillar display name
 *
 * @param pillarId - Pillar identifier
 * @returns Display name
 */
export function getPillarName(pillarId: PillarId): string {
  const content = loadConstraintsContent();
  return content.pillars[pillarId]?.name || pillarId;
}

/**
 * Get L4+ content for a specific pillar
 *
 * @param pillarId - Pillar identifier
 * @returns L4+ pillar content (maintenance risks, diagnostics)
 */
export function getL4PlusForPillar(pillarId: PillarId): L4PlusPillarContent | null {
  const content = loadL4PlusContent();
  return content.pillars[pillarId] || null;
}

/**
 * Get overall level meaning for a specific level
 *
 * @param level - Level (1-6)
 * @param locale - Locale ('en' or 'ru')
 * @returns Array of meaning strings
 */
export function getLevelMeaning(level: number, locale: 'en' | 'ru' = 'en'): string[] {
  const content = loadGlobalContent();
  const levelContent = content.overall_level_meaning[level.toString()];

  if (!levelContent) return [];

  return levelContent[locale] || levelContent.en;
}

/**
 * Get next transition one-liner
 *
 * @param level - Current level (1-3)
 * @param locale - Locale ('en' or 'ru')
 * @returns One-liner string or empty string if not found
 */
export function getNextTransitionOneLiner(level: number, locale: 'en' | 'ru' = 'en'): string {
  const content = loadGlobalContent();
  const oneLiner = content.next_transition_one_liners[level.toString()];

  if (!oneLiner) return '';

  return oneLiner[locale] || oneLiner.en;
}

/**
 * Get constraint explanation text
 *
 * @param locale - Locale ('en' or 'ru')
 * @returns Constraint explanation string
 */
export function getConstraintExplanation(locale: 'en' | 'ru' = 'en'): string {
  const content = loadGlobalContent();
  return content.constraint_explanation[locale] || content.constraint_explanation.en;
}

/**
 * Get CTA URLs
 *
 * @returns Object with workshop URL and WhatsApp config
 */
export function getCTAConfig(): {
  workshopUrl: string;
  whatsappPhone: string;
  whatsappUrlTemplate: string;
} {
  const content = loadGlobalContent();
  return {
    workshopUrl: content.cta.workshop.url,
    whatsappPhone: content.cta.whatsapp.phone,
    whatsappUrlTemplate: content.cta.whatsapp.url_template,
  };
}

/**
 * Build WhatsApp URL for a specific level and locale
 *
 * @param level - User level
 * @param locale - Locale ('en' or 'ru')
 * @param isL4Plus - Whether user is L4+
 * @returns Full WhatsApp URL
 */
export function buildWhatsAppUrl(
  level: number,
  locale: 'en' | 'ru' = 'en',
  isL4Plus: boolean = false
): string {
  const content = loadGlobalContent();
  const config = content.cta.whatsapp;

  const messageKey = isL4Plus ? 'l4_plus' : 'l1_l3';
  const messageTemplate = config.messages[messageKey][locale] || config.messages[messageKey].en;
  const message = messageTemplate.replace('{{level}}', level.toString());

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${config.phone}?text=${encodedMessage}`;
}

/**
 * Get feedback form labels
 *
 * @param locale - Locale ('en' or 'ru')
 * @returns Object with all feedback form labels
 */
export function getFeedbackLabels(locale: 'en' | 'ru' = 'en'): {
  buttonLabel: string;
  formTitle: string;
  nameLabel: string;
  contactMethod: string;
  contactOptions: { email: string; phone: string; whatsapp: string };
  emailLabel: string;
  phoneLabel: string;
  messageLabel: string;
  cancelButton: string;
  submitButton: string;
  successMessage: string;
} {
  const content = loadGlobalContent();
  const fb = content.feedback;

  return {
    buttonLabel: fb.button_label[locale] || fb.button_label.en,
    formTitle: fb.form_title[locale] || fb.form_title.en,
    nameLabel: fb.name_label[locale] || fb.name_label.en,
    contactMethod: fb.contact_method[locale] || fb.contact_method.en,
    contactOptions: {
      email: fb.contact_options.email[locale] || fb.contact_options.email.en,
      phone: fb.contact_options.phone[locale] || fb.contact_options.phone.en,
      whatsapp: fb.contact_options.whatsapp[locale] || fb.contact_options.whatsapp.en,
    },
    emailLabel: fb.email_label[locale] || fb.email_label.en,
    phoneLabel: fb.phone_label[locale] || fb.phone_label.en,
    messageLabel: fb.message_label[locale] || fb.message_label.en,
    cancelButton: fb.cancel_button[locale] || fb.cancel_button.en,
    submitButton: fb.submit_button[locale] || fb.submit_button.en,
    successMessage: fb.success_message[locale] || fb.success_message.en,
  };
}

/**
 * Get level name for a specific level and locale
 *
 * @param level - Level (1-7)
 * @param locale - Locale ('en' or 'ru')
 * @returns Level name string
 */
export function getLevelName(level: number, locale: 'en' | 'ru' = 'en'): string {
  const content = loadGlobalContent();
  const levelNames = content.level_names;
  if (!levelNames) {
    // Fallback to hardcoded names
    const fallback: Record<number, string> = {
      1: 'Ad Hoc Executor',
      2: 'Repeatable Operator',
      3: 'Manual Orchestrator',
      4: 'Process Orchestrator',
      5: 'Personalized Delegator',
      6: 'Decision Compounder',
      7: 'Institutional Standard',
    };
    return fallback[level] || `Level ${level}`;
  }
  const name = levelNames[level.toString()];
  return name?.[locale] || name?.en || `Level ${level}`;
}

/**
 * Get localized pillar name
 *
 * @param pillarId - Pillar identifier
 * @param locale - Locale ('en' or 'ru')
 * @returns Localized pillar name
 */
export function getLocalizedPillarName(pillarId: PillarId, locale: 'en' | 'ru' = 'en'): string {
  const content = loadGlobalContent();
  const pillarNames = content.pillar_names;
  if (!pillarNames) {
    // Fallback to constraints content
    return getPillarName(pillarId);
  }
  const name = pillarNames[pillarId];
  return name?.[locale] || name?.en || getPillarName(pillarId);
}

/**
 * Get dashboard hero strings
 */
export function getDashboardHeroStrings(locale: 'en' | 'ru' = 'en'): {
  myDetails: string;
  currentLevel: string;
  since: string;
  notAssessed: string;
  takeAssessment: string;
} {
  const content = loadGlobalContent();
  const hero = content.dashboard?.hero;

  return {
    myDetails: hero?.my_details?.[locale] || hero?.my_details?.en || 'My details',
    currentLevel: hero?.current_level?.[locale] || hero?.current_level?.en || 'Current Level',
    since: hero?.since?.[locale] || hero?.since?.en || 'Since',
    notAssessed: hero?.not_assessed?.[locale] || hero?.not_assessed?.en || 'Not yet assessed',
    takeAssessment: hero?.take_assessment?.[locale] || hero?.take_assessment?.en || 'Take Assessment',
  };
}

/**
 * Get dashboard closest upgrade strings
 */
export function getDashboardUpgradeStrings(locale: 'en' | 'ru' = 'en'): {
  titleTemplate: string;
  maintenanceTitle: string;
  maintenanceDescription: string;
  habitsToTrain: string;
  joinWorkshop: string;
  viewReport: string;
  retakeAssessment: string;
} {
  const content = loadGlobalContent();
  const cu = content.dashboard?.closest_upgrade;

  return {
    titleTemplate: cu?.title_template?.[locale] || cu?.title_template?.en || 'Path to Level {{level}}',
    maintenanceTitle: cu?.maintenance_title?.[locale] || cu?.maintenance_title?.en || 'Maintenance Mode',
    maintenanceDescription: cu?.maintenance_description?.[locale] || cu?.maintenance_description?.en || "You're operating at a high level.",
    habitsToTrain: cu?.habits_to_train?.[locale] || cu?.habits_to_train?.en || 'Habits to train',
    joinWorkshop: cu?.join_workshop?.[locale] || cu?.join_workshop?.en || 'Join Workshop',
    viewReport: cu?.view_report?.[locale] || cu?.view_report?.en || 'View full report',
    retakeAssessment: cu?.retake_assessment?.[locale] || cu?.retake_assessment?.en || 'Retake Assessment',
  };
}

/**
 * Get dashboard history strings
 */
export function getDashboardHistoryStrings(locale: 'en' | 'ru' = 'en'): {
  title: string;
  seeAll: string;
  view: string;
  completed: string;
  inProgress: string;
  noHistory: string;
} {
  const content = loadGlobalContent();
  const hist = content.dashboard?.history;

  return {
    title: hist?.title?.[locale] || hist?.title?.en || 'History',
    seeAll: hist?.see_all?.[locale] || hist?.see_all?.en || 'See all history',
    view: hist?.view?.[locale] || hist?.view?.en || 'View',
    completed: hist?.completed?.[locale] || hist?.completed?.en || 'Completed',
    inProgress: hist?.in_progress?.[locale] || hist?.in_progress?.en || 'In Progress',
    noHistory: hist?.no_history?.[locale] || hist?.no_history?.en || 'No assessment history yet',
  };
}

/**
 * Get dashboard empty state strings
 */
export function getDashboardEmptyStateStrings(locale: 'en' | 'ru' = 'en'): {
  title: string;
  benefits: string[];
  cta: string;
} {
  const content = loadGlobalContent();
  const empty = content.dashboard?.empty_state;

  return {
    title: empty?.title?.[locale] || empty?.title?.en || 'Discover your AI readiness level',
    benefits: empty?.benefits?.[locale] || empty?.benefits?.en || [],
    cta: empty?.cta?.[locale] || empty?.cta?.en || 'Take Assessment',
  };
}

/**
 * Get sidebar strings
 */
export function getSidebarStrings(locale: 'en' | 'ru' = 'en'): {
  brand: { eyebrow: string; title: string };
  menu: Record<string, string>;
  sections: { growth: string; myDigitalTeam: string };
  user: { myDetails: string; logout: string };
  localeSelector: string;
} {
  const content = loadGlobalContent();
  const sb = content.sidebar;

  return {
    brand: {
      eyebrow: sb?.brand?.eyebrow?.[locale] || sb?.brand?.eyebrow?.en || 'Reliable AI',
      title: sb?.brand?.title?.[locale] || sb?.brand?.title?.en || '8Hats Lab',
    },
    menu: {
      myAiReadiness: sb?.menu?.my_ai_readiness?.[locale] || sb?.menu?.my_ai_readiness?.en || 'My AI Readiness',
      community: sb?.menu?.community?.[locale] || sb?.menu?.community?.en || 'Community',
      labNotes: sb?.menu?.lab_notes?.[locale] || sb?.menu?.lab_notes?.en || 'Lab Notes',
      workshops: sb?.menu?.workshops?.[locale] || sb?.menu?.workshops?.en || 'Workshops',
      sprints: sb?.menu?.sprints?.[locale] || sb?.menu?.sprints?.en || 'Sprints',
      consultations: sb?.menu?.consultations?.[locale] || sb?.menu?.consultations?.en || 'Consultations',
      agents: sb?.menu?.agents?.[locale] || sb?.menu?.agents?.en || 'Agents',
      skills: sb?.menu?.skills?.[locale] || sb?.menu?.skills?.en || 'Skills',
    },
    sections: {
      growth: sb?.sections?.growth?.[locale] || sb?.sections?.growth?.en || 'Growth',
      myDigitalTeam: sb?.sections?.my_digital_team?.[locale] || sb?.sections?.my_digital_team?.en || 'My Digital Team',
    },
    user: {
      myDetails: sb?.user?.my_details?.[locale] || sb?.user?.my_details?.en || 'My details',
      logout: sb?.user?.logout?.[locale] || sb?.user?.logout?.en || 'Log out',
    },
    localeSelector: sb?.locale_selector?.[locale] || locale.toUpperCase(),
  };
}

/**
 * Get report page strings
 */
export function getReportStrings(locale: 'en' | 'ru' = 'en'): {
  backToDashboard: string;
  share: string;
  downloadPdf: string;
  fullReportTitle: string;
  recipient: string;
  email: string;
  session: string;
  overallLevel: string;
  peerBenchmark: string;
  keyInsight: { title: string; constraintText: string; maintenanceText: string };
  nextMove: { title: string };
  pillarProfile: { title: string; constraint: string };
  constraintsSection: { title: string };
  habitsSection: { title: string; effortQuickWin: string; effortMedium: string; effortStrategic: string };
  maintenanceAudit: { title: string; statusHealthy: string; statusMonitor: string; statusAttention: string; limitingPillar: string };
  evidenceSummary: { title: string };
  ctaSection: { consultation: string };
  footer: { available: string; rights: string };
} {
  const content = loadGlobalContent();
  const rp = content.report;

  return {
    backToDashboard: rp?.back_to_dashboard?.[locale] || rp?.back_to_dashboard?.en || 'Back to Dashboard',
    share: rp?.share?.[locale] || rp?.share?.en || 'Share',
    downloadPdf: rp?.download_pdf?.[locale] || rp?.download_pdf?.en || 'Download PDF',
    fullReportTitle: rp?.full_report_title?.[locale] || rp?.full_report_title?.en || 'Full Report for',
    recipient: rp?.recipient?.[locale] || rp?.recipient?.en || 'Recipient',
    email: rp?.email?.[locale] || rp?.email?.en || 'Email',
    session: rp?.session?.[locale] || rp?.session?.en || 'Session',
    overallLevel: rp?.overall_level?.[locale] || rp?.overall_level?.en || 'Overall Level',
    peerBenchmark: rp?.peer_benchmark?.[locale] || rp?.peer_benchmark?.en || 'Peer Benchmark',
    keyInsight: {
      title: rp?.key_insight?.title?.[locale] || rp?.key_insight?.title?.en || 'Key Insight',
      constraintText: rp?.key_insight?.constraint_text?.[locale] || rp?.key_insight?.constraint_text?.en || 'Your {{pillar}} at L{{level}} is the constraint.',
      maintenanceText: rp?.key_insight?.maintenance_text?.[locale] || rp?.key_insight?.maintenance_text?.en || "You're operating at L{{level}}.",
    },
    nextMove: {
      title: rp?.next_move?.title?.[locale] || rp?.next_move?.title?.en || 'Next Move',
    },
    pillarProfile: {
      title: rp?.pillar_profile?.title?.[locale] || rp?.pillar_profile?.title?.en || 'Five-Pillar Profile',
      constraint: rp?.pillar_profile?.constraint?.[locale] || rp?.pillar_profile?.constraint?.en || 'Constraint',
    },
    constraintsSection: {
      title: rp?.constraints_section?.title?.[locale] || rp?.constraints_section?.title?.en || "What's Holding You Back",
    },
    habitsSection: {
      title: rp?.habits_section?.title?.[locale] || rp?.habits_section?.title?.en || 'Build These Habits',
      effortQuickWin: rp?.habits_section?.effort_quick_win?.[locale] || rp?.habits_section?.effort_quick_win?.en || 'Quick Win',
      effortMedium: rp?.habits_section?.effort_medium?.[locale] || rp?.habits_section?.effort_medium?.en || 'Medium',
      effortStrategic: rp?.habits_section?.effort_strategic?.[locale] || rp?.habits_section?.effort_strategic?.en || 'Strategic',
    },
    maintenanceAudit: {
      title: rp?.maintenance_audit?.title?.[locale] || rp?.maintenance_audit?.title?.en || 'System Health Audit',
      statusHealthy: rp?.maintenance_audit?.status_healthy?.[locale] || rp?.maintenance_audit?.status_healthy?.en || 'Healthy',
      statusMonitor: rp?.maintenance_audit?.status_monitor?.[locale] || rp?.maintenance_audit?.status_monitor?.en || 'Monitor',
      statusAttention: rp?.maintenance_audit?.status_attention?.[locale] || rp?.maintenance_audit?.status_attention?.en || 'Attention',
      limitingPillar: rp?.maintenance_audit?.limiting_pillar?.[locale] || rp?.maintenance_audit?.limiting_pillar?.en || 'Limiting',
    },
    evidenceSummary: {
      title: rp?.evidence_summary?.title?.[locale] || rp?.evidence_summary?.title?.en || 'Evidence Summary',
    },
    ctaSection: {
      consultation: rp?.cta_section?.consultation?.[locale] || rp?.cta_section?.consultation?.en || 'Need help building your habit training plan?',
    },
    footer: {
      available: rp?.footer?.available?.[locale] || rp?.footer?.available?.en || 'Singapore-based team available for in-person sessions',
      rights: rp?.footer?.rights?.[locale] || rp?.footer?.rights?.en || 'All rights reserved.',
    },
  };
}
