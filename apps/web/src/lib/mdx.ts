import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Loads MDX content from the content directory.
 * Returns raw MDX string for use with next-mdx-remote.
 */
export async function loadMDXContent(relativePath: string): Promise<string> {
  const contentDir = join(process.cwd(), '..', '..', 'content');
  const filePath = join(contentDir, relativePath);
  return readFile(filePath, 'utf-8');
}
