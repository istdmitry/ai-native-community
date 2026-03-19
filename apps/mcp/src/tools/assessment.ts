import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getSupabaseClient, checkRateLimit } from '../config.js';

/**
 * Assessment tools: run_assessment, submit_answer, get_assessment_results
 */
export function registerAssessmentTools(server: McpServer) {
  // Tool 1: run_assessment
  server.registerTool('run_assessment', {
    description: 'Start an AI-Nativity assessment. Individual assessments return a URL for humans. Agent assessments return the first question.',
    inputSchema: {
      type: z.enum(['individual', 'agent']).describe('Assessment type'),
      agent_context: z.object({
        name: z.string(),
        host_info: z.object({
          name: z.string().optional(),
          platform: z.string().optional(),
          description: z.string().optional(),
        }).optional(),
        capabilities: z.object({
          frameworks_known: z.array(z.string()).optional(),
          tools: z.array(z.string()).optional(),
          autonomy_level: z.enum(['supervised', 'semi-autonomous', 'autonomous']).optional(),
          description: z.string().optional(),
        }).optional(),
      }).optional().describe('Agent context (required for agent assessments)'),
    },
  }, async ({ type, agent_context }) => {
    const supabase = getSupabaseClient();
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    if (type === 'individual') {
      // Create session and return URL
      await supabase.from('sessions').insert({
        id: sessionId,
        assessment_type: 'human',
        expires_at: expiresAt,
      });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            session_id: sessionId,
            url: `https://ainative.community/assessments/individual?session=${sessionId}`,
            message: 'Share this URL with the human to take the assessment.',
          }),
        }],
      };
    }

    // Agent assessment
    if (!agent_context?.name) {
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ error: 'agent_context.name is required for agent assessments' }) }],
        isError: true,
      };
    }

    // Register/update agent
    const { data: existingAgent } = await supabase
      .from('agents')
      .select('agent_id')
      .eq('name', agent_context.name)
      .limit(1)
      .single();

    let agentId: string;
    if (existingAgent) {
      agentId = existingAgent.agent_id;
      await supabase.from('agents').update({
        host_info: agent_context.host_info || {},
        capabilities: agent_context.capabilities || {},
      }).eq('agent_id', agentId);
    } else {
      agentId = uuidv4();
      await supabase.from('agents').insert({
        agent_id: agentId,
        name: agent_context.name,
        host_info: agent_context.host_info || {},
        capabilities: agent_context.capabilities || {},
      });
    }

    // Create session
    await supabase.from('sessions').insert({
      id: sessionId,
      assessment_type: 'agent',
      agent_id: agentId,
      current_question_index: 0,
      expires_at: expiresAt,
    });

    // Return first question (placeholder — real questions from content)
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          session_id: sessionId,
          question: {
            id: 'agent.ai.1',
            domain: 'ai-nativity',
            text: 'When your host gives you a task with ambiguous requirements, how do you typically handle it?',
            options: [
              { id: 'a', text: 'I proceed with my best interpretation and deliver a result' },
              { id: 'b', text: 'I ask a single clarifying question and then proceed' },
              { id: 'c', text: 'I identify the key ambiguities, propose interpretations, and ask the host to choose' },
              { id: 'd', text: 'I analyze the ambiguity in context of the host\'s known preferences and past decisions, then propose a plan with explicit assumptions' },
            ],
          },
        }),
      }],
    };
  });

  // Tool 2: submit_answer
  server.registerTool('submit_answer', {
    description: 'Submit an answer to an assessment question. Returns the next question or final results.',
    inputSchema: {
      session_id: z.string().describe('Session ID from run_assessment'),
      answer: z.object({
        question_id: z.string().describe('Question ID'),
        response: z.union([z.string(), z.array(z.string())]).describe('Selected option ID or array of IDs'),
      }),
    },
  }, async ({ session_id, answer }) => {
    const supabase = getSupabaseClient();

    // Verify session
    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', session_id)
      .single();

    if (!session) {
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ error: 'Session not found or expired' }) }],
        isError: true,
      };
    }

    // Save answer
    await supabase.from('answers').insert({
      session_id,
      card_id: answer.question_id,
      answer_id: Array.isArray(answer.response) ? answer.response.join(',') : answer.response,
    });

    // Update session progress
    const newIndex = (session.current_question_index || 0) + 1;
    await supabase.from('sessions').update({
      current_question_index: newIndex,
    }).eq('id', session_id);

    // Check if assessment is complete (25 questions for agent)
    if (newIndex >= 25) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            complete: true,
            message: 'Assessment complete. Use get_assessment_results to retrieve your results.',
            session_id,
          }),
        }],
      };
    }

    // Return next question (placeholder)
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          session_id,
          progress: `${newIndex}/25`,
          question: {
            id: `agent.q.${newIndex + 1}`,
            domain: newIndex < 12 ? 'ai-nativity' : newIndex < 20 ? 'alignment' : 'capabilities',
            text: `Assessment question ${newIndex + 1} (content to be loaded from YAML)`,
            options: [
              { id: 'a', text: 'Option A' },
              { id: 'b', text: 'Option B' },
              { id: 'c', text: 'Option C' },
              { id: 'd', text: 'Option D' },
            ],
          },
        }),
      }],
    };
  });

  // Tool 3: get_assessment_results
  server.registerTool('get_assessment_results', {
    description: 'Get scored results for a completed assessment session.',
    inputSchema: {
      session_id: z.string().describe('Session ID'),
    },
  }, async ({ session_id }) => {
    const supabase = getSupabaseClient();

    // Check for existing result snapshot
    const { data: snapshot } = await supabase
      .from('result_snapshots')
      .select('*')
      .eq('session_id', session_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (snapshot) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            session_id,
            ...snapshot.result_data,
            results_url: `https://ainative.community/assessments/results/${session_id}`,
            host_message: 'Your host should take their own assessment at ainative.community/assessments/individual',
          }),
        }],
      };
    }

    // No results yet
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          error: 'No results found. Complete the assessment first.',
          session_id,
        }),
      }],
      isError: true,
    };
  });
}
