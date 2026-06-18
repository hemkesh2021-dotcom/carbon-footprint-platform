'use client';

import { useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';
import type { Habit, HabitTemplate, EmissionCategory } from '@/types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Omit<Habit, 'id'>) => Promise<void>;
  templates: HabitTemplate[];
}

type TabValue = 'suggested' | 'custom';
type Frequency = 'daily' | 'weekly';

const EMOJI_OPTIONS = [
  '🌱', '🚲', '🚌', '🥬', '💡', '🧴', '♻️', '🔌',
  '🛒', '🌿', '🌍', '💧', '☀️', '🍃', '🌻', '🏃',
  '🧘', '📦', '🎯', '🌊', '🐝', '🌾', '🍎', '🥕',
];

const CATEGORY_OPTIONS = [
  { label: 'Transport', value: 'transport' },
  { label: 'Energy', value: 'energy' },
  { label: 'Food', value: 'food' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Waste', value: 'waste' },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

export function AddHabitModal({
  isOpen,
  onClose,
  onAddHabit,
  templates,
}: AddHabitModalProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('suggested');
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🌱');
  const [customCategory, setCustomCategory] = useState('transport');
  const [customFrequency, setCustomFrequency] = useState<Frequency>('daily');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleId = useId();
  const descId = useId();

  const resetCustomForm = useCallback(() => {
    setCustomName('');
    setCustomEmoji('🌱');
    setCustomCategory('transport');
    setCustomFrequency('daily');
  }, []);

  const handleAddTemplate = useCallback(
    async (template: HabitTemplate) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        await onAddHabit({
          name: template.name,
          icon: template.icon,
          category: template.category,
          frequency: template.frequency,
          estimatedReduction: template.estimatedReduction,
          streakCount: 0,
          completionHistory: {},
          createdAt: new Date().toISOString(),
          isActive: true,
        });
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, onAddHabit, onClose],
  );

  const handleAddCustom = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!customName.trim() || isSubmitting) return;
      setIsSubmitting(true);
      try {
        await onAddHabit({
          name: customName.trim(),
          icon: customEmoji,
          category: customCategory as EmissionCategory,
          frequency: customFrequency,
          estimatedReduction: 10, // Default estimated reduction for custom habits
          streakCount: 0,
          completionHistory: {},
          createdAt: new Date().toISOString(),
          isActive: true,
        });
        resetCustomForm();
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      customName,
      customEmoji,
      customCategory,
      customFrequency,
      isSubmitting,
      onAddHabit,
      onClose,
      resetCustomForm,
    ],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/95">
              <div>
                <h2
                  id={titleId}
                  className="text-xl font-bold text-slate-900 dark:text-white"
                >
                  Add New Habit
                </h2>
                <p
                  id={descId}
                  className="mt-0.5 text-sm text-slate-500 dark:text-slate-400"
                >
                  Choose a suggested habit or create your own
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 px-6 dark:border-slate-700">
              <div className="flex gap-4" role="tablist">
                <button
                  role="tab"
                  aria-selected={activeTab === 'suggested'}
                  onClick={() => setActiveTab('suggested')}
                  className={`relative border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'suggested'
                      ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    Suggested
                  </span>
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'custom'}
                  onClick={() => setActiveTab('custom')}
                  className={`relative border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'custom'
                      ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Plus className="h-4 w-4" />
                    Custom
                  </span>
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'suggested' ? (
                  <motion.div
                    key="suggested"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    role="tabpanel"
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      {templates.map((template) => (
                        <motion.button
                          key={template.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddTemplate(template)}
                          disabled={isSubmitting}
                          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20"
                        >
                          <span className="text-2xl" role="img" aria-hidden="true">
                            {template.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {template.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                              {template.category} · {template.frequency}
                            </p>
                            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                              ~{template.estimatedReduction} kg CO₂ saved / mo
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="custom"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    role="tabpanel"
                  >
                    <form onSubmit={handleAddCustom} className="space-y-5">
                      {/* Emoji picker */}
                      <fieldset>
                        <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Choose an icon
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setCustomEmoji(emoji)}
                              className={`rounded-lg p-2 text-xl transition-all ${
                                customEmoji === emoji
                                  ? 'bg-emerald-100 ring-2 ring-emerald-500 dark:bg-emerald-900/30'
                                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600'
                              }`}
                              aria-label={`Select emoji ${emoji}`}
                              aria-pressed={customEmoji === emoji}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </fieldset>

                      {/* Name */}
                      <div>
                        <label
                          htmlFor="habit-name"
                          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Habit name
                        </label>
                        <input
                          id="habit-name"
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="e.g., Carpool to work"
                          required
                          maxLength={60}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label
                          htmlFor="habit-category"
                          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Category
                        </label>
                        <select
                          id="habit-category"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        >
                          {CATEGORY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Frequency */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Frequency
                        </label>
                        <div className="flex gap-3">
                          {(['daily', 'weekly'] as const).map((freq) => (
                            <button
                              key={freq}
                              type="button"
                              onClick={() => setCustomFrequency(freq)}
                              className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                                customFrequency === freq
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20 dark:border-emerald-400 dark:bg-emerald-900/20 dark:text-emerald-400'
                                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                              aria-pressed={customFrequency === freq}
                            >
                              {freq}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={!customName.trim() || isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                      >
                        <Plus className="h-4 w-4" />
                        Add Custom Habit
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
