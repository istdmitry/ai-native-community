/**
 * Supabase database types for AI-Native Community
 *
 * Single-tenant schema (no partner_id, no multi-tenant).
 * Forked tables: sessions, answers, result_snapshots
 * New tables: frameworks, assessment_types, agents, providers, articles, events, open_source_projects
 */

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: Session;
        Insert: SessionInsert;
        Update: SessionUpdate;
      };
      answers: {
        Row: Answer;
        Insert: AnswerInsert;
        Update: AnswerUpdate;
      };
      result_snapshots: {
        Row: ResultSnapshot;
        Insert: ResultSnapshotInsert;
        Update: ResultSnapshotUpdate;
      };
      frameworks: {
        Row: Framework;
        Insert: FrameworkInsert;
        Update: FrameworkUpdate;
      };
      assessment_types: {
        Row: AssessmentType;
        Insert: AssessmentTypeInsert;
        Update: AssessmentTypeUpdate;
      };
      agents: {
        Row: Agent;
        Insert: AgentInsert;
        Update: AgentUpdate;
      };
      providers: {
        Row: Provider;
        Insert: ProviderInsert;
        Update: ProviderUpdate;
      };
      articles: {
        Row: Article;
        Insert: ArticleInsert;
        Update: ArticleUpdate;
      };
      events: {
        Row: Event;
        Insert: EventInsert;
        Update: EventUpdate;
      };
      open_source_projects: {
        Row: OpenSourceProject;
        Insert: OpenSourceProjectInsert;
        Update: OpenSourceProjectUpdate;
      };
    };
  };
}

// ==================== Sessions (forked, no partner_id) ====================

export interface Session {
  id: string;
  created_at: string;
  updated_at: string;
  locale: string;
  assessment_type: 'human' | 'agent';
  agent_id: string | null;
  completed_decks: string[];
  current_question_index: number;
  answered_questions: Record<string, unknown>[] | null;
  email: string | null;
  email_state: 'none' | 'requested' | 'verified';
  expires_at: string;
}

export interface SessionInsert {
  id?: string;
  created_at?: string;
  updated_at?: string;
  locale?: string;
  assessment_type: 'human' | 'agent';
  agent_id?: string | null;
  completed_decks?: string[];
  current_question_index?: number;
  answered_questions?: Record<string, unknown>[] | null;
  email?: string | null;
  email_state?: 'none' | 'requested' | 'verified';
  expires_at?: string;
}

export interface SessionUpdate {
  updated_at?: string;
  locale?: string;
  completed_decks?: string[];
  current_question_index?: number;
  answered_questions?: Record<string, unknown>[] | null;
  email?: string | null;
  email_state?: 'none' | 'requested' | 'verified';
}

// ==================== Answers (forked, no partner_id) ====================

export interface Answer {
  id: string;
  session_id: string;
  card_id: string;
  answer_id: string;
  response_time_ms: number | null;
  created_at: string;
}

export interface AnswerInsert {
  id?: string;
  session_id: string;
  card_id: string;
  answer_id: string;
  response_time_ms?: number | null;
  created_at?: string;
}

export interface AnswerUpdate {
  answer_id?: string;
  response_time_ms?: number | null;
}

// ==================== Result Snapshots (forked, JSONB payload) ====================

export interface ResultSnapshot {
  id: string;
  session_id: string;
  snapshot_type: string;
  result_data: Record<string, unknown>;
  created_at: string;
}

export interface ResultSnapshotInsert {
  id?: string;
  session_id: string;
  snapshot_type: string;
  result_data: Record<string, unknown>;
  created_at?: string;
}

export interface ResultSnapshotUpdate {
  result_data?: Record<string, unknown>;
}

// ==================== Frameworks (new) ====================

export interface Framework {
  slug: string;
  title: string;
  description: string;
  version: string;
  author_team: string;
  status: 'draft' | 'published';
  content_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface FrameworkInsert {
  slug: string;
  title: string;
  description: string;
  version?: string;
  author_team?: string;
  status?: 'draft' | 'published';
  content_path?: string | null;
}

export interface FrameworkUpdate {
  title?: string;
  description?: string;
  version?: string;
  author_team?: string;
  status?: 'draft' | 'published';
  content_path?: string | null;
}

// ==================== Assessment Types (new) ====================

export interface AssessmentType {
  slug: string;
  title: string;
  type: 'individual' | 'agent' | 'team';
  framework_ref: string | null;
  status: 'draft' | 'published';
  created_at: string;
}

export interface AssessmentTypeInsert {
  slug: string;
  title: string;
  type: 'individual' | 'agent' | 'team';
  framework_ref?: string | null;
  status?: 'draft' | 'published';
}

export interface AssessmentTypeUpdate {
  title?: string;
  type?: 'individual' | 'agent' | 'team';
  framework_ref?: string | null;
  status?: 'draft' | 'published';
}

// ==================== Agents (new) ====================

export interface AgentHostInfo {
  name?: string;
  platform?: string;
  description?: string;
}

export interface AgentCapabilities {
  frameworks_known: string[];
  tools: string[];
  autonomy_level: 'supervised' | 'semi-autonomous' | 'autonomous';
  description?: string;
}

export interface Agent {
  agent_id: string;
  name: string;
  host_info: AgentHostInfo;
  capabilities: AgentCapabilities;
  registration_date: string;
  latest_assessment_id: string | null;
}

export interface AgentInsert {
  agent_id?: string;
  name: string;
  host_info: AgentHostInfo;
  capabilities: AgentCapabilities;
  registration_date?: string;
  latest_assessment_id?: string | null;
}

export interface AgentUpdate {
  name?: string;
  host_info?: AgentHostInfo;
  capabilities?: AgentCapabilities;
  latest_assessment_id?: string | null;
}

// ==================== Providers (new) ====================

export interface ProviderContacts {
  email?: string;
  phone?: string;
  social?: Record<string, string>;
}

export interface Provider {
  slug: string;
  name: string;
  description: string;
  services: string[];
  certification_level: string | null;
  website: string | null;
  contacts: ProviderContacts | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderInsert {
  slug: string;
  name: string;
  description: string;
  services?: string[];
  certification_level?: string | null;
  website?: string | null;
  contacts?: ProviderContacts | null;
}

export interface ProviderUpdate {
  name?: string;
  description?: string;
  services?: string[];
  certification_level?: string | null;
  website?: string | null;
  contacts?: ProviderContacts | null;
}

// ==================== Articles (new) ====================

export interface Article {
  slug: string;
  title: string;
  body: string;
  category: 'community' | 'research';
  tags: string[];
  authors: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleInsert {
  slug: string;
  title: string;
  body: string;
  category: 'community' | 'research';
  tags?: string[];
  authors?: string;
  published_at?: string;
}

export interface ArticleUpdate {
  title?: string;
  body?: string;
  category?: 'community' | 'research';
  tags?: string[];
  authors?: string;
  published_at?: string;
}

// ==================== Events (new) ====================

export interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string | null;
  link: string | null;
  created_at: string;
}

export interface EventInsert {
  id?: string;
  title: string;
  date: string;
  type: string;
  description?: string | null;
  link?: string | null;
}

export interface EventUpdate {
  title?: string;
  date?: string;
  type?: string;
  description?: string | null;
  link?: string | null;
}

// ==================== Open Source Projects (new) ====================

export interface OpenSourceProject {
  slug: string;
  name: string;
  description: string;
  github_url: string;
  docs_url: string | null;
  blog_url: string | null;
  icon: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface OpenSourceProjectInsert {
  slug: string;
  name: string;
  description: string;
  github_url: string;
  docs_url?: string | null;
  blog_url?: string | null;
  icon?: string | null;
  tags?: string[];
}

export interface OpenSourceProjectUpdate {
  name?: string;
  description?: string;
  github_url?: string;
  docs_url?: string | null;
  blog_url?: string | null;
  icon?: string | null;
  tags?: string[];
}
