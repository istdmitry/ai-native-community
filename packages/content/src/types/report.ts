/**
 * Report content types
 *
 * Types for habits, constraints, L4+ content, and global report content.
 */

// ==================== Common Types ====================

export interface I18nString {
  en: string;
  ru: string;
}

export interface I18nStringArray {
  en: string[];
  ru: string[];
}

// ==================== Habits Types ====================

export interface HabitsMicroTask {
  keystone: string[];
  micro_tasks: string[];
  proof_of_completion: string;
}

export interface HabitsTransition {
  level_from: number;
  level_to: number;
  level_plus_one: string[];
  habits: HabitsMicroTask;
}

export interface HabitsTransitions {
  [key: string]: HabitsTransition; // e.g., "1->2", "2->3", "3->4"
}

export interface HabitsWhatsApp {
  phone: string;
  message: I18nString;
}

export interface HabitsCTA {
  en: string;
  ru: string;
  button_text: I18nString;
  whatsapp: HabitsWhatsApp;
}

export interface HabitsReportSection {
  cta: HabitsCTA;
}

export interface HabitsPolicy {
  l4plus_no_habits: boolean;
  tool_agnostic: boolean;
}

export interface HabitsContent {
  version: string;
  policy: HabitsPolicy;
  report_section: HabitsReportSection;
  transitions: {
    context_system: HabitsTransitions;
    orchestration_load: HabitsTransitions;
    verification_control: HabitsTransitions;
    codification_reuse: HabitsTransitions;
    personal_fit_adaptation: HabitsTransitions;
  };
}

// ==================== Constraints Types ====================

export interface ConstraintLevel {
  constraint_one_liner: string;
  constraints: string[];
  strengths: string[];
  anti_patterns: string[];
}

export interface ConstraintPillar {
  name: string;
  levels: {
    [level: string]: ConstraintLevel; // "1", "2", "3", etc.
  };
}

export interface ConstraintsContent {
  version: string;
  pillars: {
    context_system: ConstraintPillar;
    orchestration_load: ConstraintPillar;
    verification_control: ConstraintPillar;
    codification_reuse: ConstraintPillar;
    personal_fit_adaptation: ConstraintPillar;
  };
}

// ==================== L4+ Types ====================

export interface L4PlusPillarContent {
  maintenance_risks: string[];
  diagnostics: string[];
}

export interface L4PlusWhatsApp {
  phone: string;
  message: I18nString;
}

export interface L4PlusCTA {
  en: string;
  ru: string;
  button_text: I18nString;
  whatsapp: L4PlusWhatsApp;
}

export interface L4PlusReportSection {
  title: string;
  intro: I18nString;
  explanation: I18nString;
  cta: L4PlusCTA;
}

export interface L4PlusPolicy {
  no_prescriptive_habits: boolean;
  consultation_recommended: boolean;
}

export interface L4PlusContent {
  version: string;
  policy: L4PlusPolicy;
  pillars: {
    context_system: L4PlusPillarContent;
    orchestration_load: L4PlusPillarContent;
    verification_control: L4PlusPillarContent;
    codification_reuse: L4PlusPillarContent;
    personal_fit_adaptation: L4PlusPillarContent;
  };
  report_section: L4PlusReportSection;
}

// ==================== Global Types ====================

export interface GlobalMeta {
  pillars_order: string[];
}

export interface GlobalConfidenceLabels {
  high: I18nString;
  medium: I18nString;
  low: I18nString;
}

export interface GlobalLevelMeaning {
  en: string[];
  ru: string[];
}

export interface GlobalCTAConsultation {
  label: I18nString;
  whatsapp_phone: string;
  whatsapp_message: I18nString;
}

export interface GlobalCTAWorkshop {
  label: I18nString;
  url: string;
}

export interface GlobalCTAWhatsApp {
  phone: string;
  label: I18nString;
  url_template: string;
  messages: {
    default: I18nString;
    with_level: I18nString;
    l1_l3: I18nString;
    l4_plus: I18nString;
  };
}

export interface GlobalCTA {
  consultation: GlobalCTAConsultation;
  workshop: GlobalCTAWorkshop;
  whatsapp: GlobalCTAWhatsApp;
}

export interface GlobalReportPositioning {
  tool_agnostic_hook: {
    title: I18nString;
    bullets: I18nStringArray;
  };
  what_this_means: {
    title: I18nString;
    content: I18nStringArray;
  };
}

export interface GlobalFeedback {
  button_label: I18nString;
  form_title: I18nString;
  name_label: I18nString;
  contact_method: I18nString;
  contact_options: {
    email: I18nString;
    phone: I18nString;
    whatsapp: I18nString;
  };
  email_label: I18nString;
  phone_label: I18nString;
  message_label: I18nString;
  cancel_button: I18nString;
  submit_button: I18nString;
  success_message: I18nString;
}

export interface GlobalEmailConfirmation {
  success: I18nString;
  spam_hint: I18nString;
  discuss_prompt: I18nString;
}

export interface GlobalEmailSubmission {
  error: {
    generic: I18nString;
    network: I18nString;
    invalid: I18nString;
    retry_button: I18nString;
    skip_link: I18nString;
  };
}

export interface GlobalAccuracyChoice {
  completed_label: I18nString;
  completed_tooltip: I18nString;
}

export interface GlobalReferral {
  share_message: I18nString;
  share_url: string;
}

// ==================== Dashboard Types ====================

export interface DashboardHeroStrings {
  my_details: I18nString;
  current_level: I18nString;
  since: I18nString;
  not_assessed: I18nString;
  take_assessment: I18nString;
}

export interface DashboardClosestUpgradeStrings {
  title_template: I18nString;
  maintenance_title: I18nString;
  maintenance_description: I18nString;
  habits_to_train: I18nString;
  join_workshop: I18nString;
  view_report: I18nString;
  retake_assessment: I18nString;
}

export interface DashboardHistoryStrings {
  title: I18nString;
  see_all: I18nString;
  view: I18nString;
  completed: I18nString;
  in_progress: I18nString;
  no_history: I18nString;
}

export interface DashboardProgressChartStrings {
  title: I18nString;
  overall: I18nString;
}

export interface DashboardEmptyStateStrings {
  title: I18nString;
  benefits: I18nStringArray;
  cta: I18nString;
}

export interface DashboardStrings {
  hero: DashboardHeroStrings;
  closest_upgrade: DashboardClosestUpgradeStrings;
  history: DashboardHistoryStrings;
  progress_chart: DashboardProgressChartStrings;
  empty_state: DashboardEmptyStateStrings;
}

// ==================== Report Page Types ====================

export interface ReportKeyInsightStrings {
  title: I18nString;
  constraint_text: I18nString;
  maintenance_text: I18nString;
}

export interface ReportHabitsSectionStrings {
  title: I18nString;
  effort_quick_win: I18nString;
  effort_medium: I18nString;
  effort_strategic: I18nString;
}

export interface ReportMaintenanceAuditStrings {
  title: I18nString;
  status_healthy: I18nString;
  status_monitor: I18nString;
  status_attention: I18nString;
  limiting_pillar: I18nString;
}

export interface ReportStrings {
  back_to_dashboard: I18nString;
  share: I18nString;
  download_pdf: I18nString;
  full_report_title: I18nString;
  recipient: I18nString;
  email: I18nString;
  session: I18nString;
  overall_level: I18nString;
  peer_benchmark: I18nString;
  key_insight: ReportKeyInsightStrings;
  next_move: { title: I18nString };
  pillar_profile: { title: I18nString; constraint: I18nString };
  constraints_section: { title: I18nString };
  habits_section: ReportHabitsSectionStrings;
  maintenance_audit: ReportMaintenanceAuditStrings;
  evidence_summary: { title: I18nString };
  cta_section: { consultation: I18nString };
  footer: { available: I18nString; rights: I18nString };
}

// ==================== Sidebar Types ====================

export interface SidebarBrandStrings {
  eyebrow: I18nString;
  title: I18nString;
}

export interface SidebarMenuStrings {
  my_ai_readiness: I18nString;
  community: I18nString;
  lab_notes: I18nString;
  workshops: I18nString;
  sprints: I18nString;
  consultations: I18nString;
  agents: I18nString;
  skills: I18nString;
}

export interface SidebarSectionsStrings {
  growth: I18nString;
  my_digital_team: I18nString;
}

export interface SidebarUserStrings {
  my_details: I18nString;
  logout: I18nString;
}

export interface SidebarStrings {
  brand: SidebarBrandStrings;
  menu: SidebarMenuStrings;
  sections: SidebarSectionsStrings;
  user: SidebarUserStrings;
  locale_selector: I18nString;
}

export interface GlobalContent {
  version: string;
  meta: GlobalMeta;
  confidence_labels: GlobalConfidenceLabels;
  overall_level_meaning: {
    [level: string]: GlobalLevelMeaning; // "1", "2", "3", etc.
  };
  next_transition_one_liners: {
    [level: string]: I18nString; // "1", "2", "3"
  };
  plan_success_criteria: I18nStringArray;
  cta: GlobalCTA;
  report_positioning: GlobalReportPositioning;
  constraint_explanation: I18nString;
  email_confirmation: GlobalEmailConfirmation;
  email_submission: GlobalEmailSubmission;
  feedback: GlobalFeedback;
  accuracy_choice: GlobalAccuracyChoice;
  referral: GlobalReferral;
  dashboard?: DashboardStrings;
  level_names?: { [level: string]: I18nString };
  pillar_names?: { [pillarId: string]: I18nString };
  report?: ReportStrings;
  sidebar?: SidebarStrings;
}

// ==================== Pillar ID Type ====================

export type PillarId =
  | 'context_system'
  | 'orchestration_load'
  | 'verification_control'
  | 'codification_reuse'
  | 'personal_fit_adaptation';

export const PILLAR_IDS: PillarId[] = [
  'context_system',
  'orchestration_load',
  'verification_control',
  'codification_reuse',
  'personal_fit_adaptation',
];
