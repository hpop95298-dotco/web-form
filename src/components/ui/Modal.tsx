import { useEffect, useRef } from 'react';
import { cn } from '@/utils';
import { Button } from './Button';

// ── Modal ─────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideClose?: boolean;
}

const SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({ open, onClose, title, children, size = 'md', hideClose }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Dialog */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-xl animate-slide-up',
          'max-h-[90vh] overflow-y-auto',
          SIZES[size],
        )}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-center justify-between p-5 border-b border-[--color-gray-100]">
            {title && <h2 className="text-lg font-bold text-[--color-gray-800]">{title}</h2>}
            {!hideClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[--color-gray-400] hover:bg-[--color-gray-100] hover:text-[--color-gray-600] transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: 'danger' | 'primary';
}

export function ConfirmModal({
  open, onClose, onConfirm,
  title = 'هل أنت متأكد؟',
  message = 'هذا الإجراء لا يمكن التراجع عنه.',
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  loading,
  variant = 'primary',
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm" hideClose>
      <div className="text-center">
        <div className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl',
          variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
        )}>
          {variant === 'danger' ? '⚠️' : '❓'}
        </div>
        <h3 className="text-base font-bold text-[--color-gray-800] mb-2">{title}</h3>
        <p className="text-sm text-[--color-gray-500] mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onClose} disabled={loading}>{cancelText}</Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
