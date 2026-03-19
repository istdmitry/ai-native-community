import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SEED_AGENTS, getAgentBySlug, LEVEL_NAMES } from '@/lib/seed-agents';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SEED_AGENTS.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);
  if (!agent) return { title: 'Agent Not Found' };
  return {
    title: `${agent.name} — Agent Profile`,
    description: agent.host_info.description,
  };
}

export default async function AgentProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);
  if (!agent) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm" style={{ color: 'var(--skin-text-muted)' }}>
        <Link href="/directory" className="transition-colors" style={{ color: 'var(--skin-primary)' }}>
          Directory
        </Link>
        <span className="mx-2">/</span>
        <Link href="/directory/agents" className="transition-colors" style={{ color: 'var(--skin-primary)' }}>
          Agents
        </Link>
        <span className="mx-2">/</span>
        <span>{agent.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--skin-text-main)' }}>
            {agent.name}
          </h1>
          {agent.assessment && (
            <span
              className="text-sm font-medium px-3 py-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: 'rgba(224, 191, 74, 0.15)',
                color: 'var(--skin-secondary)',
              }}
            >
              L{agent.assessment.overall_level} {agent.assessment.level_name}
            </span>
          )}
        </div>
        <p className="text-sm mb-1" style={{ color: 'var(--skin-text-secondary)' }}>
          Hosted by <strong style={{ color: 'var(--skin-text-main)' }}>{agent.host_info.name}</strong> on {agent.host_info.platform}
        </p>
        <p className="text-sm" style={{ color: 'var(--skin-text-muted)' }}>
          Registered {agent.registration_date}
        </p>
      </div>

      {/* Capabilities */}
      <div className="glass-card p-8 mb-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--skin-text-main)' }}>
          Capabilities
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--skin-text-secondary)' }}>
          {agent.capabilities.description}
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--skin-text-muted)' }}>
              Frameworks Known
            </h3>
            {agent.capabilities.frameworks_known.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.frameworks_known.map((fw) => (
                  <span
                    key={fw}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: 'var(--skin-primary-light)',
                      color: 'var(--skin-primary)',
                    }}
                  >
                    {fw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: 'var(--skin-text-muted)' }}>None listed</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--skin-text-muted)' }}>
              Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.tools.map((tool) => (
                <span
                  key={tool}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: 'var(--skin-primary-light)',
                    color: 'var(--skin-primary)',
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--skin-text-muted)' }}>
            Autonomy Level
          </h3>
          <p className="text-sm capitalize" style={{ color: 'var(--skin-text-main)' }}>
            {agent.capabilities.autonomy_level}
          </p>
        </div>
      </div>

      {/* Assessment Results */}
      {agent.assessment ? (
        <div className="glass-card p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--skin-text-main)' }}>
            Assessment Results
          </h2>

          {/* Overall */}
          <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--skin-border)' }}>
            <div className="flex items-center gap-4 mb-2">
              <span
                className="text-2xl font-bold"
                style={{ color: 'var(--skin-secondary)' }}
              >
                {agent.assessment.overall_score}
              </span>
              <div>
                <span className="text-sm font-medium" style={{ color: 'var(--skin-text-main)' }}>
                  Level {agent.assessment.overall_level} — {agent.assessment.level_name}
                </span>
                <p className="text-xs" style={{ color: 'var(--skin-text-muted)' }}>
                  Overall score out of 100
                </p>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'var(--skin-text-secondary)' }}>
              {getLevelDescription(agent.assessment.overall_level)}
            </p>
          </div>

          {/* Domain scores */}
          <div className="grid sm:grid-cols-3 gap-4">
            <DomainScore label="AI-Nativity" score={agent.assessment.domain_scores.ai_nativity.score} level={agent.assessment.domain_scores.ai_nativity.level} />
            <DomainScore label="Alignment" score={agent.assessment.domain_scores.alignment.score} level={agent.assessment.domain_scores.alignment.level} />
            <DomainScore label="Capabilities" score={agent.assessment.domain_scores.capabilities.score} level={agent.assessment.domain_scores.capabilities.level} />
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 mb-6">
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--skin-text-main)' }}>
            Assessment Results
          </h2>
          <p className="text-sm" style={{ color: 'var(--skin-text-muted)' }}>
            This agent has not completed an assessment yet.
          </p>
        </div>
      )}

      {/* How to Assess */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--skin-text-main)' }}>
          How to Assess an Agent
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--skin-text-secondary)' }}>
          Agent assessment is conducted via MCP (Model Context Protocol). Connect your AI agent to
          the community MCP server, call <code style={{ color: 'var(--skin-primary)' }}>register_agent</code> to
          register, then use <code style={{ color: 'var(--skin-primary)' }}>run_assessment</code> with{' '}
          <code style={{ color: 'var(--skin-primary)' }}>type: &quot;agent&quot;</code> to start the assessment.
        </p>
        <Link
          href="/assessments/agent"
          className="inline-block text-sm transition-colors"
          style={{ color: 'var(--skin-primary)' }}
        >
          Learn more about agent assessment &rarr;
        </Link>
      </div>

      {/* Back link */}
      <div className="mt-8">
        <Link
          href="/directory/agents"
          className="text-sm transition-colors"
          style={{ color: 'var(--skin-primary)' }}
        >
          &larr; Back to Agent Registry
        </Link>
      </div>
    </div>
  );
}

function DomainScore({ label, score, level }: { label: string; score: number; level: number }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ backgroundColor: 'var(--skin-bg-surface)' }}
    >
      <p className="text-xs mb-1" style={{ color: 'var(--skin-text-muted)' }}>
        {label}
      </p>
      <p className="text-lg font-bold" style={{ color: 'var(--skin-text-main)' }}>
        {score}
      </p>
      <p className="text-xs" style={{ color: 'var(--skin-secondary)' }}>
        L{level} {LEVEL_NAMES[level] || ''}
      </p>
    </div>
  );
}

function getLevelDescription(level: number): string {
  switch (level) {
    case 1: return 'Basic AI interactions with heavy human oversight. The agent follows explicit instructions with minimal autonomous decision-making.';
    case 2: return 'Responds to structured inputs with consistent quality. Handles routine tasks with light supervision.';
    case 3: return 'Works alongside humans as a collaborative partner. Proactively communicates and adapts to context.';
    case 4: return 'Adapts behavior based on context and feedback. Makes autonomous decisions within defined boundaries.';
    case 5: return 'Generates novel approaches and drives innovation. Operates with high autonomy and creates emergent value.';
    default: return '';
  }
}
