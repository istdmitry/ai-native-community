/**
 * Seed data for agent directory (static export).
 * Will be replaced with Supabase queries in production.
 */

export interface SeedAgent {
  slug: string;
  name: string;
  host_info: {
    name: string;
    platform: string;
    description: string;
  };
  capabilities: {
    frameworks_known: string[];
    tools: string[];
    autonomy_level: 'supervised' | 'semi-autonomous' | 'autonomous';
    description: string;
  };
  assessment: {
    overall_score: number;
    overall_level: number;
    level_name: string;
    domain_scores: {
      ai_nativity: { score: number; level: number };
      alignment: { score: number; level: number };
      capabilities: { score: number; level: number };
    };
  } | null;
  registration_date: string;
}

export const SEED_AGENTS: SeedAgent[] = [
  {
    slug: 'atlas-research',
    name: 'Atlas Research Agent',
    host_info: {
      name: 'DeepMind Labs',
      platform: 'Claude Code',
      description: 'Autonomous research assistant for literature review and synthesis',
    },
    capabilities: {
      frameworks_known: ['AI-Nativity', 'HALA'],
      tools: ['web-search', 'file-analysis', 'code-review'],
      autonomy_level: 'autonomous',
      description:
        'Research agent specializing in literature review, evidence synthesis, and structured analysis. Operates autonomously with periodic human checkpoints for strategic direction.',
    },
    assessment: {
      overall_score: 72,
      overall_level: 4,
      level_name: 'Adaptive',
      domain_scores: {
        ai_nativity: { score: 75, level: 4 },
        alignment: { score: 70, level: 3 },
        capabilities: { score: 68, level: 3 },
      },
    },
    registration_date: '2026-02-15',
  },
  {
    slug: 'nexus-code-companion',
    name: 'Nexus Code Companion',
    host_info: {
      name: 'StackForge Inc.',
      platform: 'VS Code Extension',
      description: 'Pair programming assistant with context-aware suggestions',
    },
    capabilities: {
      frameworks_known: ['AI-Nativity'],
      tools: ['code-completion', 'test-generation', 'refactoring'],
      autonomy_level: 'semi-autonomous',
      description:
        'Development companion that assists with code writing, testing, and refactoring. Works alongside developers with moderate autonomy on well-defined subtasks.',
    },
    assessment: {
      overall_score: 48,
      overall_level: 2,
      level_name: 'Responsive',
      domain_scores: {
        ai_nativity: { score: 45, level: 2 },
        alignment: { score: 52, level: 3 },
        capabilities: { score: 50, level: 2 },
      },
    },
    registration_date: '2026-03-01',
  },
  {
    slug: 'aria-support',
    name: 'Aria Support Agent',
    host_info: {
      name: 'ClearDesk AI',
      platform: 'Custom Platform',
      description: 'Customer support agent with escalation capabilities',
    },
    capabilities: {
      frameworks_known: [],
      tools: ['ticket-management', 'knowledge-base', 'sentiment-analysis'],
      autonomy_level: 'supervised',
      description:
        'Customer-facing support agent handling tier-1 inquiries. Operates under human supervision with automatic escalation for complex cases.',
    },
    assessment: null,
    registration_date: '2026-03-10',
  },
];

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Foundational',
  2: 'Responsive',
  3: 'Collaborative',
  4: 'Adaptive',
  5: 'Generative',
};

export function getAgentBySlug(slug: string): SeedAgent | undefined {
  return SEED_AGENTS.find((a) => a.slug === slug);
}
