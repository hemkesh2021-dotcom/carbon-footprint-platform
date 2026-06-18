import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CarbonWise — Understand & Reduce Your Carbon Footprint',
  description:
    'Track, understand, and reduce your carbon footprint with personalised insights, habit tracking, and science-backed education. Your data stays on your device.',
  keywords: [
    'carbon footprint',
    'sustainability',
    'climate action',
    'carbon calculator',
    'eco habits',
    'green living',
    'environmental awareness',
  ],
  openGraph: {
    title: 'CarbonWise — Understand & Reduce Your Carbon Footprint',
    description:
      'Track, understand, and reduce your carbon footprint with personalised insights.',
    siteName: 'CarbonWise',
    type: 'website',
    locale: 'en_US',
  },
  metadataBase: new URL('https://carbonwise.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased font-sans bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <ThemeProvider defaultTheme="system">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
