'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  EDUCATION_ARTICLES,
  MYTHS_VS_FACTS,
  GLOSSARY,
  FAQ,
} from '@/constants/education-content';
import { ChevronDown, HelpCircle, BookOpen, Sparkles, Search } from 'lucide-react';

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [flippedMythIndex, setFlippedMythIndex] = useState<number | null>(null);

  // Filter FAQ based on search query
  const filteredFaq = FAQ.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter Glossary
  const filteredGlossary = GLOSSARY.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Learn & Understand
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Knowledge is the first step toward action. Explore our curated library of articles, debunk common myths, and understand the science of carbon footprints.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto pt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 mt-2">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search glossary, FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-500" />
          Essential Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EDUCATION_ARTICLES.map((article) => (
            <Card key={article.slug} variant="glass" padding="lg" hover className="h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  {article.category === 'general' ? 'General' : article.category}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{article.title}</h3>
                
                {/* Parse a small preview of the content, avoiding markdown headers */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4">
                  {article.content
                    .replace(/##.*/g, '')
                    .replace(/###.*/g, '')
                    .replace(/\*\*.*\*\*/g, '')
                    .replace(/\|/g, '')
                    .replace(/- /g, '')
                    .trim()}
                </p>
              </div>

              {/* Collapsible Article Drawer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <ArticleDrawer article={article} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Myths vs Facts Flip Cards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          Myths vs. Facts
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Click on any card to reveal the truth behind common environmental myths.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MYTHS_VS_FACTS.map((item, idx) => {
            const isFlipped = flippedMythIndex === idx;
            return (
              <div
                key={idx}
                className="h-[200px] cursor-pointer perspective-1000"
                onClick={() => setFlippedMythIndex(isFlipped ? null : idx)}
              >
                <div
                  className={`relative w-full h-full duration-500 transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front: Myth */}
                  <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-widest">
                        Myth
                      </span>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                        &ldquo;{item.myth}&rdquo;
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">
                      Click to reveal Fact →
                    </span>
                  </div>

                  {/* Back: Fact */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        Fact
                      </span>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                        {item.fact}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-right">
                      ← Click to flip back
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion & Glossary split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {filteredFaq.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">No matching FAQs found.</p>
            ) : (
              filteredFaq.map((item, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50"
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-4.5 text-left flex justify-between items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors focus:outline-none"
                    >
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden bg-slate-50 dark:bg-slate-800/10"
                        >
                          <p className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 font-medium">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Glossary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-500" />
            Glossary of Terms
          </h2>

          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {filteredGlossary.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">No glossary terms found.</p>
            ) : (
              filteredGlossary.map((entry) => (
                <div
                  key={entry.term}
                  className="p-5 border border-slate-100 dark:border-slate-800/60 rounded-2xl hover:border-slate-200 dark:hover:border-slate-700 transition-colors bg-white dark:bg-slate-900/30"
                >
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {entry.term}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">
                    {entry.definition}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────── Article Details Drawer ──────────────────── */

interface ArticleDrawerProps {
  article: typeof EDUCATION_ARTICLES[number];
}

function ArticleDrawer({ article }: ArticleDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="w-full justify-center">
        Read Article
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative bg-white dark:bg-slate-900 max-w-2xl w-full max-h-[80vh] rounded-3xl overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
            >
              {/* Content area */}
              <div className="space-y-6 flex-grow">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    {article.category === 'general' ? 'General' : article.category}
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                    aria-label="Close article"
                  >
                    ✕
                  </button>
                </div>

                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-4">
                  {/* Simplistic renderer for markdown bodies */}
                  {article.content.split('\n').map((line, idx) => {
                    if (line.startsWith('## ')) {
                      return (
                        <h3 key={idx} className="text-xl font-black text-slate-800 dark:text-white pt-4">
                          {line.replace('## ', '')}
                        </h3>
                      );
                    }
                    if (line.startsWith('### ')) {
                      return (
                        <h4 key={idx} className="text-base font-bold text-slate-700 dark:text-slate-200 pt-2">
                          {line.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (line.startsWith('|')) {
                      // Skip parsing tables in the preview/body for simplicity, or display them cleanly
                      if (line.includes('---')) return null;
                      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
                      return (
                        <div key={idx} className="grid grid-cols-2 gap-4 py-2 border-b border-slate-100 dark:border-slate-800/80 font-semibold text-xs tabular-nums text-slate-500 dark:text-slate-400">
                          <span>{cols[0]}</span>
                          <span className="text-right">{cols[1]}</span>
                        </div>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <li key={idx} className="list-disc list-inside pl-2">
                          {line.replace('- ', '')}
                        </li>
                      );
                    }
                    if (line.trim() === '') return null;
                    return <p key={idx}>{line}</p>;
                  })}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-850 text-right">
                <Button onClick={() => setIsOpen(false)}>Close Article</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
