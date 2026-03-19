-- AI-Native Community: Initial Schema
-- Single-tenant (no partner_id, no multi-tenant)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== Forked Tables ====================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  locale TEXT NOT NULL DEFAULT 'en',
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('human', 'agent')),
  agent_id UUID REFERENCES agents(agent_id) ON DELETE SET NULL,
  completed_decks TEXT[] NOT NULL DEFAULT '{}',
  current_question_index INTEGER NOT NULL DEFAULT 0,
  answered_questions JSONB,
  email TEXT,
  email_state TEXT NOT NULL DEFAULT 'none' CHECK (email_state IN ('none', 'requested', 'verified')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  answer_id TEXT NOT NULL,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE result_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  snapshot_type TEXT NOT NULL,
  result_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== New Tables ====================

CREATE TABLE frameworks (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  version TEXT NOT NULL DEFAULT '1.0',
  author_team TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  content_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assessment_types (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('individual', 'agent', 'team')),
  framework_ref TEXT REFERENCES frameworks(slug) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE agents (
  agent_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  host_info JSONB NOT NULL DEFAULT '{}',
  capabilities JSONB NOT NULL DEFAULT '{}',
  registration_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  latest_assessment_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  UNIQUE (name, (host_info->>'name'))
);

CREATE TABLE providers (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  services TEXT[] NOT NULL DEFAULT '{}',
  certification_level TEXT,
  website TEXT,
  contacts JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE articles (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('community', 'research')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  authors TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE open_source_projects (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  github_url TEXT NOT NULL,
  docs_url TEXT,
  blog_url TEXT,
  icon TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== Indexes ====================

CREATE INDEX idx_sessions_assessment_type ON sessions(assessment_type);
CREATE INDEX idx_sessions_agent_id ON sessions(agent_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_answers_session_id ON answers(session_id);
CREATE INDEX idx_result_snapshots_session_id ON result_snapshots(session_id);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_frameworks_status ON frameworks(status);

-- ==================== RLS Policies ====================

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_source_projects ENABLE ROW LEVEL SECURITY;

-- Public read access for content tables
CREATE POLICY "Public read frameworks" ON frameworks FOR SELECT USING (status = 'published');
CREATE POLICY "Public read assessment_types" ON assessment_types FOR SELECT USING (status = 'published');
CREATE POLICY "Public read providers" ON providers FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read open_source_projects" ON open_source_projects FOR SELECT USING (true);

-- Session access via service role (API routes handle auth)
CREATE POLICY "Service role sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Service role answers" ON answers FOR ALL USING (true);
CREATE POLICY "Service role result_snapshots" ON result_snapshots FOR ALL USING (true);
CREATE POLICY "Service role agents" ON agents FOR ALL USING (true);
