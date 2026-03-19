import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Individual Assessment',
  description: 'Discover your AI-Nativity level across five pillars of human-AI collaboration.',
};

export default function IndividualAssessmentPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--skin-text-main)' }}>
        Individual AI-Nativity Assessment
      </h1>
      <p className="text-lg mb-8" style={{ color: 'var(--skin-text-secondary)' }}>
        Discover your AI-Nativity level across five pillars of human-AI collaboration.
      </p>

      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--skin-text-main)' }}>
          What You&apos;ll Learn
        </h2>
        <p className="mb-4" style={{ color: 'var(--skin-text-secondary)' }}>
          The individual assessment evaluates your personal AI-Nativity across five pillars:
        </p>
        <ul className="space-y-3 mb-6" style={{ color: 'var(--skin-text-secondary)' }}>
          <li className="flex items-start gap-3">
            <span className="font-medium shrink-0" style={{ color: 'var(--skin-primary)' }}>1.</span>
            <div>
              <strong style={{ color: 'var(--skin-text-main)' }}>AI Fluency</strong> &mdash;
              How naturally you communicate with and direct AI systems
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-medium shrink-0" style={{ color: 'var(--skin-primary)' }}>2.</span>
            <div>
              <strong style={{ color: 'var(--skin-text-main)' }}>Workflow Integration</strong> &mdash;
              How deeply AI is embedded in your daily work processes
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-medium shrink-0" style={{ color: 'var(--skin-primary)' }}>3.</span>
            <div>
              <strong style={{ color: 'var(--skin-text-main)' }}>Critical Thinking</strong> &mdash;
              Your ability to evaluate, validate, and improve AI outputs
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-medium shrink-0" style={{ color: 'var(--skin-primary)' }}>4.</span>
            <div>
              <strong style={{ color: 'var(--skin-text-main)' }}>Collaboration Design</strong> &mdash;
              How you structure human-AI collaboration for optimal outcomes
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-medium shrink-0" style={{ color: 'var(--skin-primary)' }}>5.</span>
            <div>
              <strong style={{ color: 'var(--skin-text-main)' }}>Adaptive Learning</strong> &mdash;
              Your pace of adopting new AI capabilities and adjusting workflows
            </div>
          </li>
        </ul>
      </div>

      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--skin-text-main)' }}>
          Assessment Details
        </h2>
        <ul className="space-y-2 text-sm" style={{ color: 'var(--skin-text-secondary)' }}>
          <li>About 5 minutes to complete</li>
          <li>Anonymous &mdash; no sign-up required</li>
          <li>Optionally save results with your email</li>
          <li>Get your AI-Nativity level and personalized recommendations</li>
        </ul>
      </div>

      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--skin-text-main)' }}>
          Coming Soon
        </h2>
        <p style={{ color: 'var(--skin-text-secondary)' }}>
          The interactive assessment is currently being set up. Check back soon to take the assessment
          and discover your AI-Nativity level.
        </p>
      </div>
    </div>
  );
}
