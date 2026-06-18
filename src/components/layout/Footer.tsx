/** @module Footer - Global footer layout component with navigation sections and privacy disclaimer */

import Link from 'next/link';
import { Lock } from 'lucide-react';

const footerSections = [
  {
    title: 'About',
    links: [
      { label: 'Our Mission', href: '/about' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Methodology', href: '/methodology' },
      { label: 'Open Source', href: '/open-source' },
    ],
  },
  {
    title: 'Features',
    links: [
      { label: 'Carbon Calculator', href: '/calculator' },
      { label: 'Habit Tracker', href: '/habits' },
      { label: 'Insights', href: '/insights' },
      { label: 'Education', href: '/education' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Carbon 101', href: '/education' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
      { label: 'API', href: '/api-docs' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
] as const;

/**
 * Footer component displaying resource categories, navigation links, and a secure data disclaimer.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Privacy notice */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Lock className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
              <span>Your data stays on your device — we never sell your info.</span>
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">🌱</span>
              <span className="text-sm text-slate-500">
                &copy; {currentYear} CarbonWise. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
