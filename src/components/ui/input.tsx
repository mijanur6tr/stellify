import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#D4C9BA]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'w-full bg-[#0B1C36]/70 border border-[#162B4C] rounded-sm px-4 py-3 text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 transition-all duration-300 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/40 focus:bg-[#0B1C36]',
              error && 'border-[#7A1C28] focus:border-[#7A1C28] focus:ring-[#7A1C28]/40',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-[#E08A93] font-sans">{error}</span>}
        {helperText && !error && (
          <span className="text-[11px] text-[#D4C9BA]/60 font-sans">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
