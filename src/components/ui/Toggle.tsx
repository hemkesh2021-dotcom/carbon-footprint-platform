'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}: ToggleProps) {
  const id = useId();
  const descriptionId = useId();

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? descriptionId : undefined}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500',
          'cursor-pointer',
          checked
            ? 'bg-emerald-500 dark:bg-emerald-400'
            : 'bg-slate-300 dark:bg-slate-600',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
      >
        <motion.span
          className="block h-5 w-5 rounded-full bg-white shadow-md"
          style={{ marginTop: 2 }}
          animate={{
            x: checked ? 22 : 2,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          aria-hidden="true"
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={id}
              className={[
                'text-sm font-medium cursor-pointer',
                disabled
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-700 dark:text-slate-300',
              ].join(' ')}
            >
              {label}
            </label>
          )}
          {description && (
            <span
              id={descriptionId}
              className="text-xs text-slate-500 dark:text-slate-400 mt-0.5"
            >
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { Toggle };
export type { ToggleProps };
