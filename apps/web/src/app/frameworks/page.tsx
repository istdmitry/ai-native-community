import Link from 'next/link';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import yaml from 'js-yaml';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frameworks',
  description: 'Explore AI-Nativity frameworks — structured models for understanding and developing human-AI collaboration.',
};

interface FrameworkMeta {
  slug: string;
  title: string;
  description: string;
  version: string;
  author_team: string;
  status: string;
}

async function loadFrameworks(): Promise<FrameworkMeta[]> {
  const dir = join(process.cwd(), '..', '..', 'content', 'frameworks');
  try {
    const files = await readdir(dir);
    const yamlFiles = files.filter((f) => f.endsWith('.yaml'));

    const frameworks: FrameworkMeta[] = [];
    for (const file of yamlFiles) {
      const raw = await readFile(join(dir, file), 'utf-8');
      const data = yaml.load(raw) as FrameworkMeta;
      if (data.status === 'published') {
        frameworks.push(data);
      }
    }
    return frameworks;
  } catch {
    return [];
  }
}

export default async function FrameworksPage() {
  const frameworks = await loadFrameworks();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--skin-text-main)' }}>
        Frameworks
      </h1>
      <p className="text-lg mb-12" style={{ color: 'var(--skin-text-secondary)' }}>
        Structured models for understanding and developing AI-Native capabilities.
      </p>

      <div className="grid gap-6">
        {frameworks.map((fw) => (
          <Link key={fw.slug} href={`/frameworks/${fw.slug}`} className="glass-card p-8 block group transition-all hover:scale-[1.01]">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-semibold group-hover:underline" style={{ color: 'var(--skin-text-main)' }}>
                {fw.title}
              </h2>
              <span className="text-xs px-2 py-1 rounded-full shrink-0 ml-4" style={{
                backgroundColor: 'var(--skin-primary-light)',
                color: 'var(--skin-primary)',
              }}>
                v{fw.version}
              </span>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--skin-text-muted)' }}>
              {fw.description}
            </p>
            <p className="text-xs" style={{ color: 'var(--skin-text-light)' }}>
              By {fw.author_team}
            </p>
          </Link>
        ))}

        {frameworks.length === 0 && (
          <p style={{ color: 'var(--skin-text-muted)' }}>No frameworks published yet.</p>
        )}
      </div>
    </div>
  );
}
