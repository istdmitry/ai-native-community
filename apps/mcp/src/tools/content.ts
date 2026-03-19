import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getSupabaseClient } from '../config.js';

/**
 * Content tools: get_framework, list_providers, get_articles, list_open_source
 */
export function registerContentTools(server: McpServer) {
  // Tool 4: get_framework
  server.registerTool('get_framework', {
    description: 'Get detailed information about a framework (e.g., "ai-nativity", "hala").',
    inputSchema: {
      slug: z.string().describe('Framework slug (e.g., "ai-nativity", "hala")'),
    },
  }, async ({ slug }) => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('frameworks')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ error: `Framework "${slug}" not found` }) }],
        isError: true,
      };
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          slug: data.slug,
          title: data.title,
          description: data.description,
          version: data.version,
          author_team: data.author_team,
          web_url: `https://ainative.community/frameworks/${data.slug}`,
        }),
      }],
    };
  });

  // Tool 5: list_providers
  server.registerTool('list_providers', {
    description: 'List service providers in the AI-Native Community directory.',
    inputSchema: {
      service_type: z.string().optional().describe('Filter by service type'),
      certification_level: z.string().optional().describe('Filter by certification level'),
    },
  }, async ({ service_type, certification_level }) => {
    const supabase = getSupabaseClient();

    let query = supabase.from('providers').select('*');

    if (certification_level) {
      query = query.eq('certification_level', certification_level);
    }

    const { data, error } = await query;

    if (error) {
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ error: 'Failed to fetch providers' }) }],
        isError: true,
      };
    }

    let providers = data || [];
    if (service_type) {
      providers = providers.filter((p: any) =>
        p.services?.includes(service_type)
      );
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          count: providers.length,
          providers: providers.map((p: any) => ({
            name: p.name,
            slug: p.slug,
            description: p.description,
            services: p.services,
            certification_level: p.certification_level,
            website: p.website,
            profile_url: `https://ainative.community/directory/${p.slug}`,
          })),
        }),
      }],
    };
  });

  // Tool 6: get_articles
  server.registerTool('get_articles', {
    description: 'Get recent community or research articles.',
    inputSchema: {
      category: z.enum(['community', 'research']).optional().describe('Article category'),
      limit: z.number().optional().describe('Max number of articles (default 10)'),
    },
  }, async ({ category, limit = 10 }) => {
    const supabase = getSupabaseClient();

    let query = supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ error: 'Failed to fetch articles' }) }],
        isError: true,
      };
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          count: (data || []).length,
          articles: (data || []).map((a: any) => ({
            title: a.title,
            slug: a.slug,
            category: a.category,
            tags: a.tags,
            authors: a.authors,
            published_at: a.published_at,
            summary: a.body?.substring(0, 200) + '...',
            web_url: a.category === 'research'
              ? `https://ainative.community/research/${a.slug}`
              : `https://ainative.community/community/${a.slug}`,
          })),
        }),
      }],
    };
  });

  // Tool 8: list_open_source
  server.registerTool('list_open_source', {
    description: 'List open-source projects in the AI-Native ecosystem.',
    inputSchema: {
      tags: z.array(z.string()).optional().describe('Filter by tags'),
    },
  }, async ({ tags }) => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('open_source_projects')
      .select('*');

    if (error) {
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ error: 'Failed to fetch projects' }) }],
        isError: true,
      };
    }

    let projects = data || [];
    if (tags && tags.length > 0) {
      projects = projects.filter((p: any) =>
        tags.some((tag: string) => p.tags?.includes(tag))
      );
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          count: projects.length,
          projects: projects.map((p: any) => ({
            name: p.name,
            slug: p.slug,
            description: p.description,
            github_url: p.github_url,
            docs_url: p.docs_url,
            blog_url: p.blog_url,
            tags: p.tags,
          })),
        }),
      }],
    };
  });
}
