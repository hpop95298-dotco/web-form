import { cn } from '@/utils';
import type { Role } from '@/types';
import { ROLE_LABELS, ROLE_COLORS } from '@/types';

// ── Badge Types ──────────────────────────────
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default:  'bg-[--color-gray-100] text-[--color-gray-700] border-[--color-gray-200]',
  primary:  'bg-[--color-ieee-navy] text-white border-transparent',
  success:  'bg-[--color-success-light] text-[--color-success] border-green-200',
  warning:  'bg-[--color-warning-light] text-[--color-warning] border-yellow-200',
  error:    'bg-[--color-error-light] text-[--color-error] border-red-200',
  info:     'bg-[--color-info-light] text-[--color-info] border-blue-200',
  outline:  'bg-transparent text-[--color-gray-700] border-[--color-gray-300]',
};

// ── Generic Badge ─────────────────────────────
export function Badge({ children, variant = 'default', size = 'md', dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold border rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs',
        BADGE_VARIANTS[variant],
        className,
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', {
        'bg-[--color-gray-500]': variant === 'default',
        'bg-white':              variant === 'primary',
        'bg-[--color-success]':  variant === 'success',
        'bg-[--color-warning]':  variant === 'warning',
        'bg-[--color-error]':    variant === 'error',
        'bg-[--color-info]':     variant === 'info',
      })} />}
      {children}
    </span>
  );
}

// ── Role Badge ────────────────────────────────
export function RoleBadge({ role, size = 'md' }: { role: Role; size?: 'sm' | 'md' }) {
  const colors = ROLE_COLORS[role];
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold border rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs',
        colors.bg, colors.text, colors.border,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

// ── Event Status Badge ────────────────────────
type EventStatus = 'draft' | 'published' | 'completed' | 'cancelled';
const EVENT_STATUS: Record<EventStatus, { label: string; variant: BadgeVariant }> = {
  draft:     { label: 'مسودة',     variant: 'default' },
  published: { label: 'منشور',     variant: 'success' },
  completed: { label: 'مكتمل',     variant: 'info'    },
  cancelled: { label: 'ملغي',      variant: 'error'   },
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const s = EVENT_STATUS[status];
  return <Badge variant={s.variant} dot>{s.label}</Badge>;
}

// ── Application Status Badge ──────────────────
type AppStatus = 'pending' | 'accepted' | 'rejected' | 'interview';
const APP_STATUS: Record<AppStatus, { label: string; variant: BadgeVariant }> = {
  pending:   { label: 'قيد المراجعة', variant: 'warning' },
  accepted:  { label: 'مقبول',        variant: 'success' },
  rejected:  { label: 'مرفوض',        variant: 'error'   },
  interview: { label: 'مقابلة',       variant: 'info'    },
};

export function ApplicationStatusBadge({ status }: { status: AppStatus }) {
  const s = APP_STATUS[status];
  return <Badge variant={s.variant} dot>{s.label}</Badge>;
}
