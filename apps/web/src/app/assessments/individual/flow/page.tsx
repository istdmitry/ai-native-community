'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AssessmentFlow() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  if (!sessionId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p style={{ color: 'var(--skin-text-muted)' }}>
          No session found. Please start a new assessment.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--skin-text-main)' }}>
          Assessment in Progress
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--skin-text-muted)' }}>
          Session: {sessionId.slice(0, 8)}...
        </p>

        {/* SwipeCard component will be integrated here */}
        <div className="glass-card p-12 flex items-center justify-center min-h-[400px]">
          <p style={{ color: 'var(--skin-text-secondary)' }}>
            Card swiping interface will be rendered here.
            <br />
            <span className="text-sm" style={{ color: 'var(--skin-text-muted)' }}>
              (SwipeCard component integration pending)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FlowPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <p style={{ color: 'var(--skin-text-muted)' }}>Loading...</p>
      </div>
    }>
      <AssessmentFlow />
    </Suspense>
  );
}
