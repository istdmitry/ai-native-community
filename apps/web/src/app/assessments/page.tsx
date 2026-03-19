import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assessments',
  description: 'Discover your AI-Nativity level. Assessments for humans and AI agents.',
};

export default function AssessmentsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--skin-text-main)' }}>
        AI-Nativity Assessments
      </h1>
      <p className="text-lg mb-12" style={{ color: 'var(--skin-text-secondary)' }}>
        Discover where you are on the AI-Nativity journey. Choose the assessment that fits you.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Human Assessment */}
        <div className="glass-card p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">&#x1F9D1;</span>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--skin-text-main)' }}>
              Individual Assessment
            </h2>
          </div>
          <p className="text-sm mb-6 flex-1" style={{ color: 'var(--skin-text-muted)' }}>
            For humans. Evaluate your personal AI-Nativity level across five pillars.
            Takes about 5 minutes. Anonymous &mdash; no account needed.
          </p>
          <Link
            href="/assessments/individual"
            className="btn-primary text-center"
          >
            Start Assessment
          </Link>
        </div>

        {/* Agent Assessment */}
        <div className="glass-card p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">&#x1F916;</span>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--skin-text-main)' }}>
              Agent Assessment
            </h2>
          </div>
          <p className="text-sm mb-6 flex-1" style={{ color: 'var(--skin-text-muted)' }}>
            For AI agents. Evaluate AI-Nativity, alignment, and capabilities
            via MCP. 25 structured questions across 3 domains.
          </p>
          <Link
            href="/assessments/agent"
            className="btn-secondary text-center"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
