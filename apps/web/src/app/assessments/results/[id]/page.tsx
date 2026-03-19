import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Assessment Results',
    description: 'Your AI-Nativity assessment results.',
  };
}

export default async function ResultsPage({ params }: Props) {
  const sessionId = params.id;

  // TODO: Fetch result from Supabase
  // const result = await getLatestResult(sessionId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--skin-text-main)' }}>
          Your AI-Nativity Results
        </h1>
        <p className="text-sm" style={{ color: 'var(--skin-text-muted)' }}>
          Session: {sessionId.slice(0, 8)}...
        </p>
      </div>

      {/* LevelHero component will display overall level */}
      <div className="glass-card p-8 mb-8 text-center">
        <p className="text-sm mb-2" style={{ color: 'var(--skin-text-muted)' }}>
          Your AI-Nativity Level
        </p>
        <div className="text-6xl font-bold mb-2" style={{ color: 'var(--skin-result-level-color)' }}>
          --
        </div>
        <p className="text-lg" style={{ color: 'var(--skin-text-secondary)' }}>
          Level name placeholder
        </p>
      </div>

      {/* PillarProfile component will show radar chart */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--skin-text-main)' }}>
          Pillar Profile
        </h2>
        <p style={{ color: 'var(--skin-text-muted)' }}>
          Pillar scores and radar chart will be rendered here.
        </p>
      </div>

      {/* Share link */}
      <div className="text-center mt-8">
        <p className="text-sm mb-2" style={{ color: 'var(--skin-text-muted)' }}>
          Share your results
        </p>
        <code
          className="text-xs px-3 py-2 rounded-lg inline-block"
          style={{
            backgroundColor: 'var(--skin-bg-surface)',
            color: 'var(--skin-text-secondary)',
          }}
        >
          {typeof window !== 'undefined' ? window.location.href : `/assessments/results/${sessionId}`}
        </code>
      </div>
    </div>
  );
}
