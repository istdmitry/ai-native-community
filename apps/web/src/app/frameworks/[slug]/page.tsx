import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import yaml from 'js-yaml';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

interface FrameworkMeta {
  slug: string;
  title: string;
  description: string;
  content_file: string;
}

async function getFramework(slug: string): Promise<{ meta: FrameworkMeta; mdxContent: string } | null> {
  const dir = join(process.cwd(), '..', '..', 'content', 'frameworks');
  try {
    const yamlPath = join(dir, `${slug}.yaml`);
    const raw = await readFile(yamlPath, 'utf-8');
    const meta = yaml.load(raw) as FrameworkMeta;

    if (meta.content_file) {
      const mdxPath = join(dir, meta.content_file);
      const mdxContent = await readFile(mdxPath, 'utf-8');
      return { meta, mdxContent };
    }
    return { meta, mdxContent: `# ${meta.title}\n\n${meta.description}` };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const framework = await getFramework(params.slug);
  if (!framework) return { title: 'Not Found' };
  return {
    title: framework.meta.title,
    description: framework.meta.description,
  };
}

export async function generateStaticParams() {
  const dir = join(process.cwd(), '..', '..', 'content', 'frameworks');
  try {
    const files = await readdir(dir);
    return files
      .filter((f) => f.endsWith('.yaml'))
      .map((f) => ({ slug: f.replace('.yaml', '') }));
  } catch {
    return [];
  }
}

export default async function FrameworkPage({ params }: Props) {
  const framework = await getFramework(params.slug);
  if (!framework) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="prose prose-invert prose-lg max-w-none
        prose-headings:font-semibold
        prose-h1:text-4xl prose-h1:mb-8
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:leading-relaxed
        prose-a:no-underline hover:prose-a:underline
        prose-li:marker:text-[#8890A4]
      "
      style={{ color: 'var(--skin-text-secondary)' }}
      >
        <MDXRemote source={framework.mdxContent} />
      </div>
    </article>
  );
}
