/**
 * Community Storage Layer (Supabase)
 *
 * Stripped-down version of ai-native-app storage.
 * Drops: partner logic, analytics_events, auth (magic links, user sessions, dashboard)
 * Keeps: session CRUD, answers, results
 * Adds: agent session support (TTL check, agent_id)
 */

import { v4 as uuidv4 } from 'uuid';
import { createServiceRoleClient } from '@/lib/supabase/server';
import type { Answer, AssessmentResult, SnapshotType } from '@community/engine';

// ==================== Types ====================

export interface CommunitySession {
  id: string;
  locale: string;
  assessmentType: 'human' | 'agent';
  agentId: string | null;
  createdAt: Date;
  expiresAt: Date;
  currentQuestionIndex: number;
  answeredQuestions: Record<string, unknown>[] | null;
  completedDecks: string[];
  email: string | null;
  emailState: 'none' | 'requested' | 'verified';
}

export interface CreateSessionParams {
  assessmentType: 'human' | 'agent';
  agentId?: string | null;
  locale?: string;
}

export interface SaveAnswerParams {
  sessionId: string;
  answer: Answer & { follow_up_answer?: string };
  cardType: string;
  isFollowUp?: boolean;
  responseTimeMs?: number;
}

export interface SaveResultParams {
  sessionId: string;
  snapshotType: SnapshotType;
  result: AssessmentResult;
}

export interface StoredAnswer {
  item_id: string;
  answer_id: string;
  follow_up_answer?: string;
  follow_up_type?: string;
  response_time_ms?: number;
}

// ==================== Session Management ====================

export async function createSession(params: CreateSessionParams): Promise<CommunitySession> {
  const supabase = createServiceRoleClient();
  const sessionId = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h TTL

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      id: sessionId,
      locale: params.locale || 'en',
      assessment_type: params.assessmentType,
      agent_id: params.agentId || null,
      completed_decks: [],
      current_question_index: 0,
      answered_questions: null,
      email: null,
      email_state: 'none',
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return mapSession(data);
}

export async function getSession(sessionId: string): Promise<CommunitySession | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error || !data) return null;

  // Check TTL
  const session = mapSession(data);
  if (new Date() > session.expiresAt) {
    return null; // Expired
  }

  return session;
}

export async function updateSessionEmail(sessionId: string, email: string): Promise<void> {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('sessions')
    .update({ email, email_state: 'requested' })
    .eq('id', sessionId);

  if (error) {
    throw new Error(`Failed to update session email: ${error.message}`);
  }
}

export async function updateSessionProgress(
  sessionId: string,
  questionIndex: number,
  answeredQuestions: Record<string, unknown>[]
): Promise<void> {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('sessions')
    .update({
      current_question_index: questionIndex,
      answered_questions: answeredQuestions,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) {
    throw new Error(`Failed to update session progress: ${error.message}`);
  }
}

// ==================== Answer Management ====================

export async function saveAnswer(params: SaveAnswerParams): Promise<void> {
  const supabase = createServiceRoleClient();

  if (params.isFollowUp) {
    // Update existing answer row with follow-up data
    const baseItemId = params.answer.item_id.replace('_followup', '');
    const { error } = await supabase
      .from('answers')
      .update({
        answer_id: params.answer.answer_id,
        response_time_ms: params.responseTimeMs || null,
      })
      .eq('session_id', params.sessionId)
      .eq('card_id', baseItemId);

    if (error) {
      throw new Error(`Failed to save follow-up answer: ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from('answers')
      .insert({
        session_id: params.sessionId,
        card_id: params.answer.item_id,
        answer_id: params.answer.answer_id,
        response_time_ms: params.responseTimeMs || null,
      });

    if (error) {
      throw new Error(`Failed to save answer: ${error.message}`);
    }
  }
}

export async function getAnswers(sessionId: string): Promise<StoredAnswer[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to get answers: ${error.message}`);
  }

  return (data || []).map((row: any) => ({
    item_id: row.card_id,
    answer_id: row.answer_id,
    response_time_ms: row.response_time_ms,
  }));
}

// ==================== Result Management ====================

export async function saveResult(params: SaveResultParams): Promise<void> {
  const supabase = createServiceRoleClient();

  const resultData: Record<string, unknown> = {
    overall_level: params.result.overall_level,
    public_pillars: params.result.public_pillars,
    gated_pillars: params.result.gated_pillars,
    high_baseline: params.result.high_baseline,
    provisional_conflict: params.result.provisional_conflict,
    horizon_yes: params.result.horizon_yes,
  };

  const { error } = await supabase
    .from('result_snapshots')
    .insert({
      session_id: params.sessionId,
      snapshot_type: params.snapshotType,
      result_data: resultData,
    });

  if (error) {
    throw new Error(`Failed to save result: ${error.message}`);
  }
}

export async function getLatestResult(sessionId: string): Promise<AssessmentResult | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('result_snapshots')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;

  const rd = data.result_data as Record<string, any>;
  return {
    overall_level: rd.overall_level,
    public_pillars: rd.public_pillars,
    gated_pillars: rd.gated_pillars,
    high_baseline: rd.high_baseline,
    provisional_conflict: rd.provisional_conflict,
    horizon_yes: rd.horizon_yes,
  };
}

// ==================== Helpers ====================

function mapSession(data: any): CommunitySession {
  return {
    id: data.id,
    locale: data.locale,
    assessmentType: data.assessment_type,
    agentId: data.agent_id,
    createdAt: new Date(data.created_at),
    expiresAt: new Date(data.expires_at),
    currentQuestionIndex: data.current_question_index,
    answeredQuestions: data.answered_questions,
    completedDecks: data.completed_decks || [],
    email: data.email,
    emailState: data.email_state,
  };
}
