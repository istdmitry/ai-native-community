import { NextRequest, NextResponse } from 'next/server';
import { loadContent } from '@community/content';

export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const content = loadContent('en');
    const cardId = params.cardId;

    // Search cases
    const caseItem = content.cases.find((c: any) => c.id === cardId);
    if (caseItem) {
      return NextResponse.json({ type: 'case', ...caseItem });
    }

    // Search quick questions
    const qq = content.quick_questions.find((q: any) => q.id === cardId);
    if (qq) {
      return NextResponse.json({ type: 'quick_question', ...qq });
    }

    // Search micro scenarios
    const ms = content.micro_scenarios.find((m: any) => m.id === cardId);
    if (ms) {
      return NextResponse.json({ type: 'micro_scenario', ...ms });
    }

    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load card' }, { status: 500 });
  }
}
