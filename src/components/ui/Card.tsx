import { cn } from '@/utils';

// ── Card ─────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PADDING = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };

export function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[--color-gray-200] shadow-sm',
        'transition-shadow duration-200',
        hover && 'hover:shadow-md cursor-pointer',
        PADDING[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Card Header ───────────────────────────────
export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-4 pb-4 border-b border-[--color-gray-100]', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-base font-bold text-[--color-gray-800]', className)}>{children}</h3>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-[--color-gray-100] flex items-center justify-between', className)}>
      {children}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  accent?: string; // Tailwind border color class
}

export function StatCard({ label, value, icon, trend, accent = 'border-[--color-ieee-teal]' }: StatCardProps) {
  return (
    <Card className={cn('border-r-4', accent)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[--color-gray-500] uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-black text-[--color-gray-800]">{value}</p>
          {trend && (
            <p className={cn('text-xs font-semibold mt-1.5 flex items-center gap-1',
              trend.isPositive ? 'text-green-600' : 'text-red-500'
            )}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
              <span className="text-[--color-gray-400] font-normal">مقارنة بالشهر الماضي</span>
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-[--color-gray-50] text-[--color-ieee-navy]">
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ── Empty State ───────────────────────────────
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'لا توجد بيانات',
  description = 'لم يتم إضافة أي عناصر بعد.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[--color-gray-100] flex items-center justify-center mb-4 text-[--color-gray-400]">
        {icon ?? <span className="text-3xl">📭</span>}
      </div>
      <h3 className="text-base font-bold text-[--color-gray-700] mb-1">{title}</h3>
      <p className="text-sm text-[--color-gray-500] max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Loading Skeleton ──────────────────────────
export function SkeletonCard() {
  return (
    <Card>
      <div className="skeleton h-4 w-2/3 mb-3 rounded" />
      <div className="skeleton h-3 w-full mb-2 rounded" />
      <div className="skeleton h-3 w-4/5 mb-4 rounded" />
      <div className="skeleton h-8 w-24 rounded-lg" />
    </Card>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-[--color-gray-100]">
      <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="skeleton h-3 w-1/3 mb-1.5 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
  );
}

// ── Error State ───────────────────────────────
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'حدث خطأ',
  description = 'حدثت مشكلة أثناء تحميل البيانات. يرجى المحاولة مجدداً.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4 text-red-400">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-base font-bold text-[--color-gray-700] mb-1">{title}</h3>
      <p className="text-sm text-[--color-gray-500] max-w-xs mb-5">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-semibold bg-[--color-ieee-navy] text-white rounded-lg hover:bg-[--color-ieee-blue] transition-colors"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

// ── Permission Denied ─────────────────────────
export function PermissionDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 text-orange-400">
        <span className="text-4xl">🔒</span>
      </div>
      <h2 className="text-xl font-black text-[--color-gray-800] mb-2">غير مصرح لك بالدخول</h2>
      <p className="text-sm text-[--color-gray-500] max-w-sm">
        ليس لديك الصلاحيات الكافية لعرض هذه الصفحة. تواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.
      </p>
      <span className="mt-3 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
        403 — Permission Denied
      </span>
    </div>
  );
}
