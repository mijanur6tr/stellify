import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans uppercase font-medium tracking-[0.18em] transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-[#C5A059] text-[#071326] hover:bg-[#E5C378] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] border border-[#C5A059]',
      outline:
        'bg-transparent text-[#C5A059] border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#C5A059]/10 hover:shadow-[0_0_15px_rgba(197,160,89,0.15)]',
      secondary:
        'bg-[#0B1C36] text-[#FAF7F2] border border-[#162B4C] hover:border-[#C5A059]/40 hover:bg-[#102447]',
      ghost:
        'bg-transparent text-[#FAF7F2]/80 hover:text-[#C5A059] hover:bg-[#C5A059]/5',
      danger:
        'bg-[#7A1C28] text-white hover:bg-[#922230] border border-[#7A1C28]',
    };

    const sizes = {
      sm: 'text-[11px] px-4 py-2 rounded-sm gap-1.5',
      md: 'text-xs px-6 py-3 rounded-sm gap-2',
      lg: 'text-sm px-8 py-4 rounded-sm gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
