import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@community/theme';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://community.ai-native.dev';

export const metadata: Metadata = {
  title: {
    default: 'AI-Native Community',
    template: '%s | AI-Native Community',
  },
  description: 'Independent, community-driven platform for AI-Native methodology. Assessments, frameworks, and tools for humans and AI agents.',
  keywords: ['AI-Native', 'AI-Nativity', 'assessment', 'community', 'frameworks', 'MCP'],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AI-Native Community',
    title: 'AI-Native Community',
    description: 'Independent, community-driven platform for AI-Native methodology.',
    url: BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Native Community',
    description: 'Independent, community-driven platform for AI-Native methodology.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased" style={{ backgroundColor: 'var(--skin-bg-main)', color: 'var(--skin-text-main)' }}>
        <ThemeProvider>
          <Header />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
