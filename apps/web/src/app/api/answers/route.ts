import { NextRequest, NextResponse } from 'next/server';
import { saveAnswer, getAnswers, getSession } from '@/lib/storage/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, answer, cardType = 'case', isFollowUp = false, responseTimeMs } = body;

    if (!sessionId || !answer?.item_id || !answer?.answer_id) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, answer.item_id, answer.answer_id' },
        { status: 400 }
      );
    }

    // Verify session exists and is not expired
    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 });
    }

    await saveAnswer({
      sessionId,
      answer,
      cardType,
      isFollowUp,
      responseTimeMs,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save answer error:', error);
    return NextResponse.json(
      { error: 'Failed to save answer' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  try {
    const answers = await getAnswers(sessionId);
    return NextResponse.json({ answers });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to get answers' }, { status: 500 });
  }
}
