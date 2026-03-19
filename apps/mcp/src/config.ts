import { createClient } from '@supabase/supabase-js';

export const MCP_PORT = parseInt(process.env.MCP_PORT || '3002', 10);

export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-service-key'
  );
}

// Rate limiting state (in-memory for MVP)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxPerHour: number): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + 3600000 });
    return true;
  }

  if (entry.count >= maxPerHour) {
    return false;
  }

  entry.count++;
  return true;
}
