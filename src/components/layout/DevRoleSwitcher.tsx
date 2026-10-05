import { useAuthStore } from '@/stores/auth.store';
import { MOCK_USERS } from '@/mock/users';
import { ROLE_LABELS } from '@/types';
import type { Role } from '@/types';

export function DevRoleSwitcher() {
  const { user, switchRole } = useAuthStore();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '9999px',
        padding: '6px 14px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        flexWrap: 'wrap',
        maxWidth: '95vw',
        justifyContent: 'center',
      }}
    >
      <span style={{ color: '#00B4D8', fontSize: '10px', fontWeight: 800, letterSpacing: '1px', marginLeft: '6px' }}>
        ⚡ DEV ROLES:
      </span>

      {MOCK_USERS.map(mockUser => (
        <button
          key={mockUser.role}
          onClick={() => switchRole(mockUser.role as Role)}
          title={mockUser.email}
          style={{
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s',
            border: user?.role === mockUser.role
              ? '1px solid #00B4D8'
              : '1px solid rgba(255,255,255,0.12)',
            background: user?.role === mockUser.role
              ? '#00B4D8'
              : 'rgba(255,255,255,0.06)',
            color: user?.role === mockUser.role ? '#002855' : 'rgba(255,255,255,0.8)',
          }}
        >
          {ROLE_LABELS[mockUser.role as Role]}
        </button>
      ))}
    </div>
  );
}
