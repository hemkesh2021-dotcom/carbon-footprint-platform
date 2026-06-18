'use client';

import {
  useState,
  useRef,
  useId,
  type ReactElement,
  cloneElement,
  isValidElement,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string;
  children: ReactElement<Record<string, unknown>>;
  position?: TooltipPosition;
  className?: string;
}

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowClasses: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-100',
  left: 'left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900 dark:border-l-slate-100',
  right:
    'right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-100',
};

const motionOrigin: Record<TooltipPosition, { initial: Record<string, number> }> = {
  top: { initial: { y: 4 } },
  bottom: { initial: { y: -4 } },
  left: { initial: { x: 4 } },
  right: { initial: { x: -4 } },
};

function Tooltip({
  content,
  children,
  position = 'top',
  className = '',
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();
  const triggerRef = useRef<HTMLElement>(null);

  if (!isValidElement(children)) {
    return children;
  }

  const trigger = cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
    onFocus: () => setVisible(true),
    onBlur: () => setVisible(false),
    'aria-describedby': visible ? tooltipId : undefined,
  } as Record<string, unknown>);

  return (
    <span className="relative inline-flex">
      {trigger}
      <AnimatePresence>
        {visible && (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, ...motionOrigin[position].initial }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...motionOrigin[position].initial }}
            transition={{ duration: 0.15 }}
            className={[
              'absolute z-50 px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap pointer-events-none',
              'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
              'shadow-lg',
              positionClasses[position],
              className,
            ].join(' ')}
          >
            {content}
            <span
              className={`absolute ${arrowClasses[position]}`}
              aria-hidden="true"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export { Tooltip };
export type { TooltipProps, TooltipPosition };
