import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community',
  description: 'AI-Native Community articles, events, and updates.',
};

// Seed data for MVP
const articles = [
  {
    slug: 'welcome-to-ai-native-community',
    title: 'Welcome to AI-Native Community',
    summary: 'Introducing the independent platform for AI-Native methodology. Why we built it and where we are going.',
    authors: 'AI-Native Community',
    published_at: '2026-03-19',
    tags: ['announcement'],
  },
];

const events = [
  {
    title: 'AI-Native Community Launch',
    date: '2026-03-19',
    type: 'launch',
    description: 'The AI-Native Community platform goes live.',
  },
];

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--skin-text-main)' }}>
        Community
      </h1>
      <p className="text-lg mb-12" style={{ color: 'var(--skin-text-secondary)' }}>
        Articles, events, and updates from the AI-Native Community.
      </p>

      {/* Articles */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--skin-text-main)' }}>
          Articles
        </h2>
        <div className="grid gap-6">
          {articles.map((article) => (
            <div key={article.slug} className="glass-card p-6">
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--skin-text-main)' }}>
                {article.title}
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--skin-text-muted)' }}>
                {article.summary}
              </p>
              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--skin-text-light)' }}>
                <span>{article.authors}</span>
                <span>{article.published_at}</span>
                <div className="flex gap-1">
                  {article.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full" style={{
                      backgroundColor: 'var(--skin-bg-surface)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--skin-text-main)' }}>
          Events
        </h2>
        <div className="grid gap-4">
          {events.map((event, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{
              backgroundColor: 'var(--skin-bg-alt)',
            }}>
              <div className="text-center shrink-0 w-16">
                <div className="text-xs font-medium" style={{ color: 'var(--skin-primary)' }}>
                  {event.type}
                </div>
                <div className="text-sm" style={{ color: 'var(--skin-text-muted)' }}>
                  {event.date}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium" style={{ color: 'var(--skin-text-main)' }}>
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-xs mt-1" style={{ color: 'var(--skin-text-muted)' }}>
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
