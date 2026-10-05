import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format date to Arabic-friendly string */
export function formatDate(date: string, locale = 'ar-EG') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(date));
}

/** Truncate text */
export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/** Generate avatar initials */
export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
