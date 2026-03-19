import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research',
  description: 'Research articles and papers on AI-Nativity, human-AI collaboration, and organizational transformation.',
};

// Seed data for MVP
const articles = [
  {
    slug: 'ai-nativity-levels-explained',
    title: 'AI-Nativity Levels Explained',
    summary: 'A deep dive into the six levels of AI-Nativity and what each level means for individuals and organizations.',
    authors: 'AI-Native Community Research',
    published_at: '2026-03-19',
    category: 'framework',
    tags: ['levels', 'framework', 'assessment'],
  },
  {
    slug: 'measuring-human-ai-collaboration',
    title: 'Measuring Human-AI Collaboration Quality',
    summary: 'How do you know if human-AI collaboration is actually working? Exploring metrics and assessment approaches.',
    authors: 'AI-Native Community Research',
    published_at: '2026-03-19',
    category: 'methodology',
    tags: ['measurement', 'collaboration', 'methodology'],
  },
];

export default function ResearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--skin-text-main)' }}>
        Research
      </h1>
      <p className="text-lg mb-12" style={{ color: 'var(--skin-text-secondary)' }}>
        Research articles and papers exploring AI-Nativity, human-AI collaboration, and organizational transformation.
      </p>

      <div className="grid gap-6">
        {articles.map((article) => (
          <div key={article.slug} className="glass-card p-6">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-lg font-medium" style={{ color: 'var(--skin-text-main)' }}>
                {article.title}
              </h2>
              <span className="text-xs px-2 py-1 rounded-full shrink-0 ml-4" style={{
                backgroundColor: 'var(--skin-primary-light)',
                color: 'var(--skin-primary)',
              }}>
                {article.category}
              </span>
            </div>
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
    </div>
  );
}
