import { cn } from '@/utils';
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react';

// ── Base Styles ─────────────────────────────
const inputBase = [
  'w-full rounded-lg border border-[--color-gray-300] bg-white',
  'px-3 py-2.5 text-sm text-[--color-gray-800] placeholder:text-[--color-gray-400]',
  'transition-all duration-150',
  'focus:outline-none focus:border-[--color-ieee-teal] focus:ring-2 focus:ring-[--color-ieee-teal]/20',
  'disabled:bg-[--color-gray-100] disabled:cursor-not-allowed disabled:opacity-60',
].join(' ');

const errorStyle = 'border-red-400 focus:border-red-500 focus:ring-red-200';

// ── Label ────────────────────────────────────
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}
export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label className={cn('block text-sm font-semibold text-[--color-gray-700] mb-1.5', className)} {...props}>
      {children}
      {required && <span className="text-red-500 mr-0.5">*</span>}
    </label>
  );
}

// ── Helper / Error Text ──────────────────────
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">⚠ {message}</p>;
}

export function FieldHint({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-[--color-gray-500]">{message}</p>;
}

// ── Field Wrapper ────────────────────────────
interface FieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}
export function Field({ label, required, error, hint, htmlFor, children }: FieldProps) {
  return (
    <div className="mb-4">
      {label && <Label htmlFor={htmlFor} required={required}>{label}</Label>}
      {children}
      <FieldError message={error} />
      <FieldHint message={hint} />
    </div>
  );
}

// ── Input ────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, leftIcon, rightIcon, className, ...props }, ref
) {
  if (leftIcon || rightIcon) {
    return (
      <div className="relative">
        {leftIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-gray-400]">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(inputBase, error && errorStyle, leftIcon && 'pr-10', rightIcon && 'pl-10', className)}
          {...props}
        />
        {rightIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-gray-400]">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
  return (
    <input
      ref={ref}
      className={cn(inputBase, error && errorStyle, className)}
      {...props}
    />
  );
});

// ── Textarea ─────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className, ...props }, ref
) {
  return (
    <textarea
      ref={ref}
      rows={4}
      className={cn(inputBase, 'resize-y min-h-[96px]', error && errorStyle, className)}
      {...props}
    />
  );
});

// ── Select ───────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { error, options, placeholder, className, ...props }, ref
) {
  return (
    <select
      ref={ref}
      className={cn(inputBase, 'cursor-pointer', error && errorStyle, className)}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
});

// ── Checkbox ─────────────────────────────────
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        className={cn(
          'w-4 h-4 rounded border-[--color-gray-300] text-[--color-ieee-teal]',
          'accent-[--color-ieee-teal] cursor-pointer',
          className,
        )}
        {...props}
      />
      <span className="text-sm text-[--color-gray-700] select-none">{label}</span>
    </label>
  );
}
