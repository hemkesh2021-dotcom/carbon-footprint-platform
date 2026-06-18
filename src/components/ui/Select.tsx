'use client';

import { useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function Select({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
}: SelectProps) {
  const id = useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={[
            'w-full appearance-none rounded-xl border bg-white dark:bg-slate-800',
            'border-slate-300 dark:border-slate-600',
            'px-4 py-2.5 pr-10 text-sm',
            'text-slate-900 dark:text-slate-100',
            'transition-colors duration-150',
            'hover:border-emerald-400 dark:hover:border-emerald-500',
            'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
            'focus-visible:outline-none',
            'cursor-pointer',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            !value ? 'text-slate-400 dark:text-slate-500' : '',
          ].join(' ')}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export { Select };
export type { SelectProps, SelectOption };
