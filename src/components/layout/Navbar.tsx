import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { RoleBadge } from '@/components/ui/Badge';
import { cn } from '@/utils';

// ── Public Navbar ─────────────────────────────
export function PublicNavbar() {
  const { isAuthenticated, user, getDashboardPath, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 inset-x-0 z-40 h-16 bg-white/95 backdrop-blur-sm border-b border-[--color-gray-200] shadow-sm">
      <div className="container-page h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-ieee-navy flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            IEEE
          </div>
          <span className="font-bold text-[--color-ieee-navy] hidden sm:block">Student Branch</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { to: '/', label: 'الرئيسية' },
            { to: '/about', label: 'من نحن' },
            { to: '/staff', label: 'الكادر' },
            { to: '/events', label: 'الفعاليات' },
            { to: '/forms', label: 'النماذج' },
            { to: '/join', label: 'انضم إلينا' },
            { to: '/contact', label: 'تواصل' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-semibold text-[--color-gray-600] hover:text-[--color-ieee-navy] hover:bg-[--color-gray-100] rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <RoleBadge role={user.role} size="sm" />
              <button
                onClick={() => navigate(getDashboardPath())}
                className="px-3 py-1.5 text-sm font-semibold text-white bg-[--color-ieee-navy] rounded-lg hover:bg-[--color-ieee-blue] transition-colors"
              >
                لوحة التحكم
              </button>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm font-semibold text-[--color-gray-600] hover:bg-[--color-gray-100] rounded-lg transition-colors"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="px-3 py-1.5 text-sm font-semibold text-[--color-gray-600] hover:bg-[--color-gray-100] rounded-lg transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/auth/signup"
                className="px-4 py-1.5 text-sm font-semibold text-white bg-[--color-ieee-navy] rounded-lg hover:bg-[--color-ieee-blue] transition-colors shadow-sm"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── Dashboard Topbar ──────────────────────────
interface TopbarProps {
  title?: string;
}

export function DashboardTopbar({ title }: TopbarProps) {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-30 h-16',
      'bg-white border-b border-[--color-gray-200] shadow-sm',
      'flex items-center px-5 gap-4',
    )}>
      {/* Hamburger */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-[--color-gray-100] text-[--color-gray-500] transition-colors"
      >
        <span className="block w-5 h-0.5 bg-current mb-1" />
        <span className="block w-5 h-0.5 bg-current mb-1" />
        <span className="block w-4 h-0.5 bg-current" />
      </button>

      {/* Page title */}
      {title && <h1 className="text-base font-bold text-[--color-gray-800] flex-1">{title}</h1>}

      <div className="flex items-center gap-3 mr-auto">
        {user && <RoleBadge role={user.role} size="sm" />}

        {/* User Avatar */}
        {user && (
          <div className="flex items-center gap-2.5">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-[--color-gray-200]"
            />
            <span className="text-sm font-semibold text-[--color-gray-700] hidden sm:block">{user.name}</span>
          </div>
        )}

        {/* Public Site Link */}
        <button
          onClick={() => navigate('/')}
          className="px-3 py-1.5 text-xs font-semibold text-[--color-gray-500] hover:bg-[--color-gray-100] rounded-lg transition-colors"
        >
          الموقع
        </button>

        <button
          onClick={logout}
          className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          خروج
        </button>
      </div>
    </header>
  );
}
