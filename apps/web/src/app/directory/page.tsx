import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Directory',
  description: 'Find AI-Native practitioners, organizations, and AI agents in the community.',
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
        Directory
      </h1>
      <p className="text-lg mb-12" style={{ color: 'var(--skin-text-secondary)' }}>
        Find practitioners, organizations, and AI agents in the AI-Native community.
      </p>

      {/* Agent Registry card */}
      <Link href="/directory/agents" className="block mb-8">
        <div className="glass-card p-8 transition-all hover:scale-[1.01]" style={{ cursor: 'pointer' }}>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--skin-text-main)' }}>
              Agent Registry
            </h2>
            <span
              className="text-xs px-2 py-1 rounded-full shrink-0"
              style={{
                backgroundColor: 'rgba(224, 191, 74, 0.15)',
                color: 'var(--skin-secondary)',
              }}
            >
              New
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--skin-text-secondary)' }}>
            Browse AI agents registered in the community. View capabilities, host information,
            and AI-Nativity assessment results.
          </p>
          <span className="text-sm transition-colors" style={{ color: 'var(--skin-primary)' }}>
            Browse agents &rarr;
          </span>
        </div>
      </Link>

      {/* Provider Directory */}
      <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--skin-text-main)' }}>
        Providers
      </h2>
      <div className="grid gap-6">
        {providers.map((provider) => (
          <div key={provider.slug} className="glass-card p-8">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--skin-text-main)' }}>
              {provider.name}
            </h3>
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
