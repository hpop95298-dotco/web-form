import { cn } from '@/utils';
import type { ButtonHTMLAttributes } from 'react';

// ── Types ──────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize    = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ── Variant Styles ─────────────────────────
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[--color-ieee-navy] text-white hover:bg-[--color-ieee-blue] active:scale-[0.98] shadow-sm hover:shadow-md',
  secondary:
    'bg-[--color-ieee-teal] text-white hover:bg-[--color-ieee-teal-dark] active:scale-[0.98] shadow-sm hover:shadow-md',
  outline:
    'border border-[--color-gray-300] bg-white text-[--color-gray-700] hover:bg-[--color-gray-50] hover:border-[--color-ieee-teal] hover:text-[--color-ieee-navy]',
  ghost:
    'text-[--color-gray-600] hover:bg-[--color-gray-100] hover:text-[--color-gray-900]',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-sm',
  success:
    'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-sm',
};

const SIZES: Record<ButtonSize, string> = {
  sm:   'h-8  px-3 text-xs  gap-1.5 rounded-md',
  md:   'h-10 px-4 text-sm  gap-2   rounded-lg',
  lg:   'h-12 px-6 text-base gap-2.5 rounded-lg',
  icon: 'h-10 w-10 rounded-lg justify-center',
};

// ── Component ──────────────────────────────
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center font-semibold transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
