import { useState } from 'react';
import { MOCK_USERS } from '@/mock/users';
import { MOCK_EVENTS, MOCK_FORMS, MOCK_CERTIFICATES } from '@/mock/data';
import { StatCard, Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RoleBadge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { toast } from '@/stores/ui.store';
import { formatDate } from '@/utils';

export default function SuperAdminDashboard() {
  const [usersList, setUsersList] = useState(MOCK_USERS);

  const handleToggleActive = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    toast.success('تم تحديث حالة المستخدم بنجاح');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-right">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              Super Admin & Web Team
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">لوحة الإدارة العليا والتحكم الشامل</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            تحكم كامل في المستخدمين، الأدوار والصلاحيات (RBAC)، النماذج، الفعاليات، والشهادات.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي المستخدمين" value={usersList.length} icon={<span className="text-xl">👥</span>} accent="border-purple-500" />
        <StatCard label="إجمالي الفعاليات" value={MOCK_EVENTS.length} icon={<span className="text-xl">📅</span>} accent="border-blue-500" />
        <StatCard label="النماذج المنشورة" value={MOCK_FORMS.length} icon={<span className="text-xl">📋</span>} accent="border-green-500" />
        <StatCard label="الشهادات الصادرة" value={MOCK_CERTIFICATES.length} icon={<span className="text-xl">🏅</span>} accent="border-amber-500" />
      </div>

      {/* Users Management Table */}
      <Card className="p-6 space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-800">إدارة المستخدمين والأدوار (Users & Roles)</h3>
            <p className="text-xs text-slate-500">استعراض وتعديل صلاحيات وحالة حسابات المنصة</p>
          </div>
          <Button size="sm" className="bg-purple-900 hover:bg-purple-800 text-white">
            + إضافة مستخدم جديد
          </Button>
        </div>

        <Table
          keyField="id"
          data={usersList}
          columns={[
            {
              key: 'name',
              header: 'المستخدم',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <img src={row.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-slate-200" />
                  <div>
                    <strong className="block text-slate-800">{row.name}</strong>
                    <span className="text-xs text-slate-400 font-mono">{row.email}</span>
                  </div>
                </div>
              ),
            },
            {
              key: 'role',
              header: 'الدور (Role)',
              render: (row) => <RoleBadge role={row.role} size="sm" />,
            },
            {
              key: 'isActive',
              header: 'الحالة',
              render: (row) => (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {row.isActive ? 'نشط' : 'معطل'}
                </span>
              ),
            },
            {
              key: 'actions',
              header: 'الإجراءات',
              render: (row) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleToggleActive(row.id)}>
                    {row.isActive ? 'تعطيل' : 'تفعيل'}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
