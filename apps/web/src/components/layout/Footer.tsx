import Link from 'next/link';

const footerLinks = [
  {
    title: 'Explore',
    links: [
      { href: '/manifesto', label: 'Manifesto' },
      { href: '/frameworks', label: 'Frameworks' },
      { href: '/assessments', label: 'Assessments' },
      { href: '/research', label: 'Research' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: '/directory', label: 'Provider Directory' },
      { href: '/community', label: 'Articles & Events' },
      { href: '/open-source', label: 'Open Source' },
    ],
  },
  {
    title: 'About',
    links: [
      { href: '/about', label: 'About the Project' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'var(--skin-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-semibold" style={{ color: 'var(--skin-primary)' }}>
                AI-Native
              </span>
              <span className="text-lg font-light" style={{ color: 'var(--skin-text-secondary)' }}>
                Community
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--skin-text-muted)' }}>
              Independent. Open. Community-driven.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--skin-text-main)' }}>
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:underline"
                      style={{ color: 'var(--skin-text-muted)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--skin-border)' }}>
          <p className="text-xs" style={{ color: 'var(--skin-text-light)' }}>
            &copy; {new Date().getFullYear()} AI-Native Community. An independent project for the AI-Native methodology.
          </p>
        </div>
      </div>
    </footer>
  );
}
