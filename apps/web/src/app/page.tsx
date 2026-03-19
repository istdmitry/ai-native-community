import Link from 'next/link';

const journeySteps = [
  {
    number: 1,
    title: 'Understand',
    href: '/manifesto',
    description: 'Read the vision: what AI-Nativity means for people, teams, organizations, and agents',
  },
  {
    number: 2,
    title: 'Assess',
    href: '/assessments',
    description: 'Find out where you are on the journey (human or agent)',
  },
  {
    number: 3,
    title: 'Learn',
    href: '/frameworks',
    description: 'Go deeper into the AI-Nativity levels and HALA framework',
  },
  {
    number: 4,
    title: 'Connect',
    href: '/directory',
    description: 'Find providers who can help. Join the community.',
  },
  {
    number: 5,
    title: 'Build',
    href: '/open-source',
    description: 'Use and contribute to open-source AI-Native tools',
  },
  {
    number: 6,
    title: 'Explore',
    href: '/research',
    description: 'Read the latest thinking on human-agent collaboration',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        {/* Subtle gradient background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(13, 158, 143, 0.08) 0%, transparent 70%)',
          }}
        />

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-4xl leading-tight mb-6"
          style={{ color: 'var(--skin-text-main)' }}
        >
          AI-Nativity is how humans and AI learn to work together
        </h1>

        <p
          className="text-lg sm:text-xl max-w-2xl mb-10"
          style={{ color: 'var(--skin-text-secondary)' }}
        >
          As individuals, teams, and organizations &mdash; discover where you are on the path, explore the frameworks, and connect with practitioners.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/manifesto" className="btn-primary text-center">
            Read the Manifesto
          </Link>
          <Link href="/assessments" className="btn-secondary text-center">
            Take the Assessment
          </Link>
        </div>
      </section>

      {/* Journey Map */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-center mb-4"
          style={{ color: 'var(--skin-text-main)' }}
        >
          Your journey starts here
        </h2>
        <p
          className="text-center max-w-xl mx-auto mb-16"
          style={{ color: 'var(--skin-text-muted)' }}
        >
          Six steps from understanding to practice. Start anywhere &mdash; but we recommend beginning with the manifesto.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeySteps.map((step) => (
            <Link
              key={step.number}
              href={step.href}
              className="glass-card p-6 group transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold shrink-0"
                  style={{
                    backgroundColor: 'var(--skin-primary-light)',
                    color: 'var(--skin-primary)',
                  }}
                >
                  {step.number}
                </span>
                <div>
                  <h3
                    className="text-lg font-medium mb-1 group-hover:underline"
                    style={{ color: 'var(--skin-text-main)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--skin-text-muted)' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="text-center py-16 px-4">
        <p className="text-sm" style={{ color: 'var(--skin-text-muted)' }}>
          Independent. Open. Community-driven.
        </p>
      </section>
    </div>
  );
}
