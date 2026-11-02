import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'outline' | 'subtle' | 'burgundy' | 'cobalt' | 'emerald';
}

export function Badge({
  className,
  variant = 'gold',
  children,
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center text-[10px] uppercase tracking-[0.2em] font-medium px-2.5 py-1 rounded-sm select-none transition-colors';

  const variants = {
    gold: 'bg-[#C5A059]/15 text-[#E5C378] border border-[#C5A059]/30',
    outline: 'bg-transparent text-[#FAF7F2]/80 border border-[#FAF7F2]/20',
    subtle: 'bg-[#0B1C36] text-[#D4C9BA] border border-[#162B4C]',
    burgundy: 'bg-[#7A1C28]/25 text-[#E08A93] border border-[#7A1C28]/50',
    cobalt: 'bg-[#1B3B6F]/30 text-[#90B8F8] border border-[#1B3B6F]/50',
    emerald: 'bg-[#0D4E56]/30 text-[#72D6D9] border border-[#0D4E56]/50',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
export default Badge;
