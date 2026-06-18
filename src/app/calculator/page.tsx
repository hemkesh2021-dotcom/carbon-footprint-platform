import { Calculator, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import CalculatorWizard from '@/components/calculator/CalculatorWizard';

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-3xl mx-auto px-4 pt-6 pb-2"
      >
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </li>
          <li>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </li>
          <li className="font-medium text-emerald-600 dark:text-emerald-400" aria-current="page">
            Calculator
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <header className="max-w-3xl mx-auto px-4 py-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 mb-4">
          <Calculator className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
          Carbon Footprint Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Answer a few questions about your lifestyle to calculate your personal carbon
          footprint. Get insights and recommendations to reduce your environmental impact.
        </p>
      </header>

      {/* Calculator Wizard */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <CalculatorWizard />
      </section>
    </div>
  );
}
