import { MDXRemote } from 'next-mdx-remote/rsc';
import { loadMDXContent } from '@/lib/mdx';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About the AI-Native Community — mission, founding provider, and how to contribute.',
};

export default async function AboutPage() {
  const source = await loadMDXContent('pages/about.mdx');

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
        <MDXRemote source={source} />
      </div>
    </article>
  );
}
