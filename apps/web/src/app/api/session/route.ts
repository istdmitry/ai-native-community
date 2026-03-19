import { NextRequest, NextResponse } from 'next/server';
import { createSession, getSession } from '@/lib/storage/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentType = 'human', agentId, locale } = body;

    if (!['human', 'agent'].includes(assessmentType)) {
      return NextResponse.json(
        { error: 'Invalid assessment type' },
        { status: 400 }
      );
    }

    const session = await createSession({
      assessmentType,
      agentId: agentId || null,
      locale: locale || 'en',
    });

    return NextResponse.json({
      sessionId: session.id,
      assessmentType: session.assessmentType,
      expiresAt: session.expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('id');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
  }

  try {
    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 });
    }

    return NextResponse.json({
      id: session.id,
      assessmentType: session.assessmentType,
      currentQuestionIndex: session.currentQuestionIndex,
      email: session.email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }
}
