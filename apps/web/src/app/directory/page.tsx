import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Provider Directory',
  description: 'Find AI-Native practitioners and organizations that can help you on your journey.',
};

// Seed data for MVP (will come from Supabase in production)
const providers = [
  {
    slug: '8hats-lab',
    name: '8Hats Lab',
    description: 'Founding provider. AI maturity assessment, consulting, and coaching for organizations adopting AI-Native principles.',
    services: ['Assessment', 'Consulting', 'Coaching'],
    website: 'https://8hats.io',
  },
];

export default function DirectoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--skin-text-main)' }}>
        Provider Directory
      </h1>
      <p className="text-lg mb-12" style={{ color: 'var(--skin-text-secondary)' }}>
        Find practitioners and organizations that can help you develop AI-Native capabilities.
      </p>

      <div className="grid gap-6">
        {providers.map((provider) => (
          <div key={provider.slug} className="glass-card p-8">
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--skin-text-main)' }}>
              {provider.name}
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--skin-text-secondary)' }}>
              {provider.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {provider.services.map((service) => (
                <span key={service} className="text-xs px-2 py-1 rounded-full" style={{
                  backgroundColor: 'var(--skin-primary-light)',
                  color: 'var(--skin-primary)',
                }}>
                  {service}
                </span>
              ))}
            </div>
            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors"
                style={{ color: 'var(--skin-primary)' }}
              >
                {provider.website} &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
