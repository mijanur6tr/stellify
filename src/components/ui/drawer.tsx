'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left' | 'bottom';
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  className,
}: DrawerProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const variants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
    },
  }[position];

  const posClasses = {
    right: 'inset-y-0 right-0 max-w-md w-full',
    left: 'inset-y-0 left-0 max-w-md w-full',
    bottom: 'inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-2xl',
  }[position];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#071326]/75 backdrop-blur-sm"
          />

          {/* Drawer Sheet */}
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={cn(
              'fixed bg-[#0B1C36] border-l border-[#C5A059]/20 shadow-2xl flex flex-col text-[#FAF7F2] z-50',
              posClasses,
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#162B4C]">
              {title && (
                <h3 className="font-serif text-2xl text-[#C5A059] font-normal tracking-wide">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-[#FAF7F2]/60 hover:text-[#C5A059] rounded-sm transition-colors ml-auto"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
export default Drawer;
