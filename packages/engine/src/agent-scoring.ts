/**
 * Agent assessment scoring module
 *
 * Scores agent assessments across 3 domains: AI-Nativity, Alignment, Capabilities
 * Uses weighted median from the existing scoring engine
 */

// ==================== Types ====================

export interface AgentAnswer {
  question_id: string;
  domain: string;
  score: number; // 0-100
}

export interface DomainScore {
  domain: string;
  level: number; // 1-5
  score: number; // 0-100 (weighted median)
  question_count: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface AgentAssessmentResult {
  overall_level: number; // 1-5
  overall_score: number; // 0-100
  domains: DomainScore[];
  level_name: string;
  assessed_at: string;
}

// ==================== Constants ====================

const DOMAIN_WEIGHTS: Record<string, number> = {
  'ai-nativity': 0.5,
  alignment: 0.3,
  capabilities: 0.2,
};

const LEVEL_NAMES: Record<number, string> = {
  1: 'Scripted',
  2: 'Responsive',
  3: 'Collaborative',
  4: 'Adaptive',
  5: 'Synergistic',
};

// ==================== Scoring ====================

function scoreToLevel(score: number): number {
  if (score <= 20) return 1;
  if (score <= 40) return 2;
  if (score <= 60) return 3;
  if (score <= 80) return 4;
  return 5;
}

function getConfidence(questionCount: number): 'high' | 'medium' | 'low' {
  if (questionCount >= 8) return 'high';
  if (questionCount >= 4) return 'medium';
  return 'low';
}

/**
 * Compute domain score using weighted median
 */
function computeDomainScore(answers: AgentAnswer[], domain: string): DomainScore {
  const domainAnswers = answers.filter((a) => a.domain === domain);

  if (domainAnswers.length === 0) {
    return {
      domain,
      level: 1,
      score: 0,
      question_count: 0,
      confidence: 'low',
    };
  }

  // Use median level — all answers weighted equally for agent assessment
  const levels = domainAnswers.map((a) => scoreToLevel(a.score)).sort((a, b) => a - b);
  const medianLevel = levels[Math.floor(levels.length / 2)];

  // Average score for the domain
  const avgScore = domainAnswers.reduce((sum, a) => sum + a.score, 0) / domainAnswers.length;

  return {
    domain,
    level: medianLevel,
    score: Math.round(avgScore),
    question_count: domainAnswers.length,
    confidence: getConfidence(domainAnswers.length),
  };
}

/**
 * Compute full agent assessment result
 *
 * @param answers - All agent answers with scores
 * @returns Full assessment result with domain scores and overall level
 */
export function computeAgentResult(answers: AgentAnswer[]): AgentAssessmentResult {
  const domains = Object.keys(DOMAIN_WEIGHTS).map((domain) =>
    computeDomainScore(answers, domain)
  );

  // Overall score = weighted sum of domain scores
  const overallScore = Math.round(
    domains.reduce((sum, d) => sum + d.score * (DOMAIN_WEIGHTS[d.domain] || 0), 0)
  );

  const overallLevel = scoreToLevel(overallScore);

  return {
    overall_level: overallLevel,
    overall_score: overallScore,
    domains,
    level_name: LEVEL_NAMES[overallLevel] || 'Unknown',
    assessed_at: new Date().toISOString(),
  };
}
