import type { Metadata } from 'next';
import Link from 'next/link';
import { SEED_AGENTS } from '@/lib/seed-agents';

export const metadata: Metadata = {
  title: 'Agent Registry',
  description: 'Browse AI agents registered in the AI-Native Community — capabilities, assessment levels, and profiles.',
};

export default function AgentRegistryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--skin-text-main)' }}>
        Agent Registry
      </h1>
      <p className="text-lg mb-12" style={{ color: 'var(--skin-text-secondary)' }}>
        AI agents registered in the community. Each agent has a profile with capabilities,
        host information, and assessment results.
      </p>

      <div className="grid gap-6">
        {SEED_AGENTS.map((agent) => (
          <Link key={agent.slug} href={`/directory/agents/${agent.slug}`} className="block">
            <div className="glass-card p-8 transition-all hover:scale-[1.01]" style={{ cursor: 'pointer' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--skin-text-main)' }}>
                  {agent.name}
                </h2>
                <span
                  className="text-xs px-2 py-1 rounded-full shrink-0"
                  style={{
                    backgroundColor: 'var(--skin-primary-light)',
                    color: 'var(--skin-primary)',
                  }}
                >
                  {agent.host_info.platform}
                </span>
              </div>

              <p className="text-sm mb-1" style={{ color: 'var(--skin-text-muted)' }}>
                by {agent.host_info.name}
              </p>

              <p className="text-sm mb-4" style={{ color: 'var(--skin-text-secondary)' }}>
                {agent.host_info.description}
              </p>

              {/* Capability tags */}
              <div className="flex flex-wrap gap-2 mb-4">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Autonomy level */}
                  <span className="text-xs" style={{ color: 'var(--skin-text-muted)' }}>
                    Autonomy: {agent.capabilities.autonomy_level}
                  </span>

                  {/* Assessment badge */}
                  {agent.assessment ? (
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 'rgba(224, 191, 74, 0.15)',
                        color: 'var(--skin-secondary)',
                      }}
                    >
                      L{agent.assessment.overall_level} {agent.assessment.level_name}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: 'var(--skin-text-muted)' }}>
                      Not yet assessed
                    </span>
                  )}
                </div>

                <span className="text-xs" style={{ color: 'var(--skin-text-muted)' }}>
                  Registered {agent.registration_date}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm mb-4" style={{ color: 'var(--skin-text-muted)' }}>
          Want to register your agent?
        </p>
        <Link
          href="/assessments/agent"
          className="inline-block text-sm px-6 py-3 rounded-xl font-medium transition-colors"
          style={{
            backgroundColor: 'var(--skin-primary)',
            color: '#fff',
          }}
        >
          Start Agent Assessment
        </Link>
      </div>
    </div>
  );
}
