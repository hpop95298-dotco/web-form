import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { cn } from '@/utils';
import type { Role } from '@/types';

// ── Nav Item Type ──────────────────────────────
interface NavItem {
  to: string;
  label: string;
  icon: string;
}

// ── Navigation config per role ─────────────────
const NAV_CONFIG: Record<Role, NavItem[]> = {
  super_admin: [
    { to: '/dashboard/super-admin',             label: 'نظرة عامة',    icon: '📊' },
    { to: '/dashboard/super-admin/users',       label: 'المستخدمون',   icon: '👥' },
    { to: '/dashboard/super-admin/roles',       label: 'الأدوار',      icon: '🔐' },
    { to: '/dashboard/super-admin/events',      label: 'الفعاليات',    icon: '📅' },
    { to: '/dashboard/super-admin/forms',       label: 'النماذج',      icon: '📋' },
    { to: '/dashboard/super-admin/certificates',label: 'الشهادات',     icon: '🏅' },
    { to: '/dashboard/super-admin/staff',       label: 'الكادر',       icon: '🏢' },
    { to: '/dashboard/super-admin/activity',    label: 'سجل النشاط',   icon: '📜' },
    { to: '/dashboard/super-admin/settings',    label: 'الإعدادات',    icon: '⚙️' },
  ],
  web_team: [
    { to: '/dashboard/super-admin',             label: 'نظرة عامة',    icon: '📊' },
    { to: '/dashboard/super-admin/users',       label: 'المستخدمون',   icon: '👥' },
    { to: '/dashboard/super-admin/roles',       label: 'الأدوار',      icon: '🔐' },
    { to: '/dashboard/super-admin/settings',    label: 'الإعدادات',    icon: '⚙️' },
  ],
  super_organizer: [
    { to: '/dashboard/super-organizer',                     label: 'نظرة عامة',  icon: '📊' },
    { to: '/dashboard/super-organizer/events',              label: 'الفعاليات',  icon: '📅' },
    { to: '/dashboard/super-organizer/attendance',          label: 'الحضور',     icon: '✅' },
    { to: '/dashboard/super-organizer/certificates',        label: 'الشهادات',   icon: '🏅' },
  ],
  org: [
    { to: '/dashboard/org',              label: 'نظرة عامة',  icon: '📊' },
    { to: '/dashboard/org/events',       label: 'الفعاليات',  icon: '📅' },
    { to: '/dashboard/org/attendance',   label: 'الحضور',     icon: '✅' },
    { to: '/dashboard/org/participants', label: 'المشاركون',  icon: '👥' },
    { to: '/dashboard/org/certificates', label: 'الشهادات',   icon: '🏅' },
  ],
  admin: [
    { to: '/dashboard/admin',              label: 'نظرة عامة',  icon: '📊' },
    { to: '/dashboard/admin/certificates', label: 'الشهادات',   icon: '🏅' },
    { to: '/dashboard/admin/attendance',   label: 'الحضور',     icon: '✅' },
  ],
  hr: [
    { to: '/dashboard/hr',              label: 'نظرة عامة',  icon: '📊' },
    { to: '/dashboard/hr/forms',        label: 'النماذج',    icon: '📋' },
    { to: '/dashboard/hr/applications', label: 'الطلبات',    icon: '📨' },
    { to: '/dashboard/hr/members',      label: 'الأعضاء',    icon: '👥' },
    { to: '/dashboard/hr/staff',        label: 'الكادر',     icon: '🏢' },
  ],
  pr: [
    { to: '/dashboard/pr',         label: 'نظرة عامة',  icon: '📊' },
    { to: '/dashboard/pr/content', label: 'المحتوى',    icon: '📝' },
    { to: '/dashboard/pr/events',  label: 'الفعاليات',  icon: '📅' },
  ],
  media: [
    { to: '/dashboard/media',         label: 'نظرة عامة',  icon: '📊' },
    { to: '/dashboard/media/gallery', label: 'المعرض',     icon: '🖼️' },
    { to: '/dashboard/media/events',  label: 'التغطيات',   icon: '🎥' },
  ],
  user: [
    { to: '/dashboard/user',              label: 'نظرة عامة',  icon: '📊' },
    { to: '/dashboard/user/events',       label: 'فعالياتي',   icon: '📅' },
    { to: '/dashboard/user/applications', label: 'طلباتي',     icon: '📨' },
    { to: '/dashboard/user/certificates', label: 'شهاداتي',    icon: '🏅' },
  ],
};

// ── Sidebar ───────────────────────────────────
export function DashboardSidebar() {
  const { user } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();

  if (!user) return null;
  const navItems = NAV_CONFIG[user.role] ?? [];

  return (
    <aside
      className={cn(
        'fixed right-0 top-0 bottom-0 z-20',
        'bg-[--color-ieee-navy] text-white',
        'flex flex-col transition-all duration-300 ease-in-out',
        'border-l border-white/10',
        sidebarCollapsed ? 'w-[68px]' : 'w-[260px]',
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-[--color-ieee-teal] flex items-center justify-center font-black text-xs flex-shrink-0 text-[--color-ieee-navy]">
          IEEE
        </div>
        {!sidebarCollapsed && (
          <div className="mr-3 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Student Branch</p>
            <p className="text-xs text-white/50 truncate">Management Platform</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 3}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-150',
                'text-sm font-semibold',
                isActive
                  ? 'bg-[--color-ieee-teal] text-[--color-ieee-navy] shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
                sidebarCollapsed && 'justify-center',
              )
            }
            title={sidebarCollapsed ? item.label : undefined}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5 p-2">
            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-white/20" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
