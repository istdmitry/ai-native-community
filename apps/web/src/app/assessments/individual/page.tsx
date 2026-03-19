'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function IndividualAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function startAssessment() {
    setLoading(true);
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentType: 'human' }),
      });
      const { sessionId } = await res.json();
      router.push(`/assessments/individual/flow?session=${sessionId}`);
    } catch (err) {
      console.error('Failed to start assessment:', err);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--skin-text-main)' }}>
        Individual AI-Nativity Assessment
      </h1>
      <p className="text-lg mb-3" style={{ color: 'var(--skin-text-secondary)' }}>
        Discover your AI-Nativity level across five pillars of human-AI collaboration.
      </p>
      <p className="text-sm mb-10" style={{ color: 'var(--skin-text-muted)' }}>
        About 5 minutes. Anonymous. You can optionally save results with your email.
      </p>

      <button
        onClick={startAssessment}
        disabled={loading}
        className="btn-primary disabled:opacity-50"
      >
        {loading ? 'Starting...' : 'Begin Assessment'}
      </button>
    </div>
  );
}
