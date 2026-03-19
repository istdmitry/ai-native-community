import { NextRequest, NextResponse } from 'next/server';
import { getAnswers, getSession, saveResult } from '@/lib/storage/supabase';
import { computeCanonicalResult, type Answer } from '@community/engine';
import { loadContent } from '@community/content';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Verify session
    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 });
    }

    // Load answers
    const storedAnswers = await getAnswers(sessionId);
    const answers: Answer[] = storedAnswers.map((a) => ({
      item_id: a.item_id,
      answer_id: a.answer_id,
    }));

    // Load content
    const content = loadContent(session.locale || 'en');

    // Compute result
    // TODO: get starter6 case IDs from deck config
    const starter6CaseIds = content.cases.slice(0, 6).map((c: any) => c.id);
    const result = computeCanonicalResult(answers, content, starter6CaseIds);

    // Save result
    await saveResult({
      sessionId,
      snapshotType: 'canonical',
      result,
    });

    return NextResponse.json({
      sessionId,
      result: {
        overall_level: result.overall_level,
        public_pillars: result.public_pillars,
        gated_pillars: result.gated_pillars,
        high_baseline: result.high_baseline,
        horizon_yes: result.horizon_yes,
      },
    });
  } catch (error: any) {
    console.error('Scoring error:', error);
    return NextResponse.json(
      { error: 'Failed to compute results' },
      { status: 500 }
    );
  }
}
