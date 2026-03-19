'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/manifesto', label: 'Manifesto' },
  { href: '/frameworks', label: 'Frameworks' },
  { href: '/assessments', label: 'Assess' },
  { href: '/directory', label: 'Directory' },
  { href: '/community', label: 'Community' },
  { href: '/research', label: 'Research' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: 'rgba(15, 20, 25, 0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderColor: 'var(--skin-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-semibold" style={{ color: 'var(--skin-primary)' }}>
              AI-Native
            </span>
            <span className="text-lg font-light" style={{ color: 'var(--skin-text-secondary)' }}>
              Community
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm rounded-lg transition-colors"
                  style={{
                    color: active ? 'var(--skin-primary)' : 'var(--skin-text-secondary)',
                    backgroundColor: active ? 'var(--skin-primary-lighter)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ color: 'var(--skin-text-secondary)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t" style={{ borderColor: 'var(--skin-border)' }}>
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => {
                const active = pathname === link.href || pathname?.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm rounded-lg transition-colors"
                    style={{
                      color: active ? 'var(--skin-primary)' : 'var(--skin-text-secondary)',
                      backgroundColor: active ? 'var(--skin-primary-lighter)' : 'transparent',
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
