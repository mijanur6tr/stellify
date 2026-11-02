'use client';

import * as React from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingChatLauncherProps {
  isOpen: boolean;
  onOpen: () => void;
}

export function FloatingChatLauncher({
  isOpen,
  onOpen,
}: FloatingChatLauncherProps) {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-3 sm:right-4 z-50 flex flex-col items-end pointer-events-auto">
      {/* Top Banner Tooltip - Snug bubble, tight tracking, strictly text only */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        type="button"
        onClick={onOpen}
        className="mb-2 relative group cursor-pointer focus:outline-none select-none"
        aria-label="Order Your Preference via Stellify Concierge Agent"
      >
        <div className="relative px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-gradient-to-r from-[#0B1C36] via-[#122646] to-[#0B1C36] border border-[#E5C378]/90 shadow-[0_6px_24px_rgba(0,0,0,0.65)] transition-all duration-300 group-hover:border-[#FAF7F2] group-hover:shadow-[0_8px_28px_rgba(229,195,120,0.25)] group-hover:scale-105">
          {/* Strictly pure text with tight tracking - No logos or icons included */}
          <span className="text-[11px] sm:text-xs font-sans font-medium text-[#FAF7F2] tracking-tight whitespace-nowrap block leading-tight">
            Order Your Preference
          </span>
        </div>

        {/* Downward Pointer Arrow aligned right above agent launcher */}
        <div className="absolute -bottom-1.5 right-6 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#E5C378]/90 group-hover:border-t-[#FAF7F2] transition-colors" />
        <div className="absolute -bottom-1 right-6 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#0B1C36]" />
      </motion.button>

      {/* High-Visibility Luminous Agent Launcher Button */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Rings */}
        <span className="absolute -inset-2 rounded-full bg-[#C5A059]/20 animate-ping opacity-40 pointer-events-none" />
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#C5A059]/40 to-[#E5C378]/40 blur-md pointer-events-none" />

        <button
          type="button"
          onClick={onOpen}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#162B4C] via-[#0B1C36] to-[#071326] border-2 border-[#E5C378] shadow-[0_0_30px_rgba(229,195,120,0.55)] flex items-center justify-center text-[#E5C378] hover:text-[#FAF7F2] transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none"
          aria-label="Open Stellify Concierge Agent"
        >
          {/* Inner Golden Gradient Rim */}
          <span className="absolute inset-1 rounded-full border border-[#C5A059]/40 pointer-events-none group-hover:border-[#E5C378] transition-colors" />

          {/* Dedicated Agent Emblem */}
          <div className="relative flex items-center justify-center">
            <Bot className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8] text-[#E5C378] group-hover:text-[#FAF7F2] transition-all duration-300 group-hover:rotate-6" />
          </div>

          {/* Active Live Status Dot */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-400 border-2 border-[#071326] shadow-md flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-90" />
          </span>
        </button>
      </div>
    </div>
  );
}

export default FloatingChatLauncher;
