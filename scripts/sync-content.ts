/**
 * Content sync script
 *
 * Reads YAML+MDX from content/ directory and upserts to Supabase.
 * Run at build time or manually: npx tsx scripts/sync-content.ts
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';
import yaml from 'js-yaml';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const CONTENT_DIR = join(__dirname, '..', 'content');

interface FrameworkYaml {
  slug: string;
  title: string;
  description: string;
  version: string;
  author_team: string;
  status: string;
  content_file?: string;
}

interface AgentDomainYaml {
  domains: Array<{
    slug: string;
    title: string;
    description: string;
    weight: number;
    question_count: number;
  }>;
}

async function syncFrameworks() {
  const dir = join(CONTENT_DIR, 'frameworks');
  try {
    const files = await readdir(dir);
    const yamlFiles = files.filter((f) => f.endsWith('.yaml'));

    let synced = 0;
    for (const file of yamlFiles) {
      const raw = await readFile(join(dir, file), 'utf-8');
      const data = yaml.load(raw) as FrameworkYaml;

      const contentPath = data.content_file
        ? `frameworks/${data.content_file}`
        : null;

      const { error } = await supabase
        .from('frameworks')
        .upsert(
          {
            slug: data.slug,
            title: data.title,
            description: data.description,
            version: data.version,
            author_team: data.author_team,
            status: data.status,
            content_path: contentPath,
          },
          { onConflict: 'slug' }
        );

      if (error) {
        console.error(`  Failed to sync framework ${data.slug}:`, error.message);
      } else {
        synced++;
      }
    }
    console.log(`Frameworks: ${synced}/${yamlFiles.length} synced`);
  } catch (e) {
    console.error('Failed to sync frameworks:', e);
  }
}

async function syncAssessmentTypes() {
  // Sync from agent assessment domains
  const domainsPath = join(CONTENT_DIR, 'assessments', 'agent', 'domains.yaml');
  try {
    const raw = await readFile(domainsPath, 'utf-8');
    const data = yaml.load(raw) as AgentDomainYaml;

    // Upsert the agent assessment type
    const { error } = await supabase
      .from('assessment_types')
      .upsert(
        {
          slug: 'agent-ai-nativity',
          title: 'Agent AI-Nativity Assessment',
          type: 'agent',
          status: 'published',
        },
        { onConflict: 'slug' }
      );

    if (error) {
      console.error('Failed to sync agent assessment type:', error.message);
    } else {
      console.log(`Assessment types: 1 synced (${data.domains.length} domains)`);
    }
  } catch (e) {
    console.error('Failed to sync assessment types:', e);
  }
}

async function main() {
  console.log('Syncing content to Supabase...\n');

  await syncFrameworks();
  await syncAssessmentTypes();

  console.log('\nDone.');
}

main().catch(console.error);
