import { useEffect } from 'react';
import { cn } from '@/utils';
import { useUIStore } from '@/stores/ui.store';
import type { Toast } from '@/stores/ui.store';

// ── Single Toast ──────────────────────────────
const TOAST_STYLES: Record<Toast['type'], string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50   border-red-200   text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info:    'bg-blue-50  border-blue-200  text-blue-800',
};

const TOAST_ICONS: Record<Toast['type'], string> = {
  success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️',
};

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useUIStore(s => s.removeToast);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full',
        'animate-slide-up pointer-events-auto',
        TOAST_STYLES[toast.type],
      )}
    >
      <span className="text-base flex-shrink-0 mt-0.5">{TOAST_ICONS[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-snug">{toast.title}</p>
        {toast.message && <p className="text-xs mt-0.5 opacity-80">{toast.message}</p>}
      </div>
      <button
        onClick={() => remove(toast.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity text-sm leading-none mt-0.5"
      >
        ✕
      </button>
    </div>
  );
}

// ── Toast Container ───────────────────────────
export function ToastContainer() {
  const toasts = useUIStore(s => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
