import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Source',
  description: 'Open-source projects advancing AI-Nativity — tools, frameworks, and resources for the community.',
};

// Seed data for MVP
const projects = [
  {
    slug: 'ai-native-community',
    name: 'AI-Native Community',
    description: 'The community platform itself. Built with Next.js, Supabase, and an MCP server for AI agent access.',
    github_url: 'https://github.com/8hats-lab/ai-native-community',
    docs_url: null,
    blog_url: null,
    icon: null,
    tags: ['platform', 'next.js', 'mcp'],
  },
  {
    slug: 'ai-nativity-assessment',
    name: 'AI-Nativity Assessment Engine',
    description: 'Scoring engine for AI-Nativity assessments. Weighted median scoring, pillar analysis, and evidence collection.',
    github_url: 'https://github.com/8hats-lab/ai-nativity-engine',
    docs_url: null,
    blog_url: null,
    icon: null,
    tags: ['engine', 'assessment', 'typescript'],
  },
];

export default function OpenSourcePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--skin-text-main)' }}>
        Open Source
      </h1>
      <p className="text-lg mb-12" style={{ color: 'var(--skin-text-secondary)' }}>
        Open-source projects advancing AI-Nativity. Contribute, fork, or use them in your own work.
      </p>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project.slug} className="glass-card p-8">
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--skin-text-main)' }}>
              {project.name}
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--skin-text-secondary)' }}>
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full" style={{
                  backgroundColor: 'var(--skin-primary-light)',
                  color: 'var(--skin-primary)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--skin-primary)' }}
                >
                  GitHub &rarr;
                </a>
              )}
              {project.docs_url && (
                <a
                  href={project.docs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--skin-primary)' }}
                >
                  Docs &rarr;
                </a>
              )}
              {project.blog_url && (
                <a
                  href={project.blog_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--skin-primary)' }}
                >
                  Blog &rarr;
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
