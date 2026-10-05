import { useState } from 'react';
import { MOCK_FORMS, MOCK_APPLICATIONS } from '@/mock/data';
import { StatCard, Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ApplicationStatusBadge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/stores/ui.store';
import { formatDate } from '@/utils';
import type { Application } from '@/types';

export function HrDashboard() {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleUpdateStatus = (appId: string, newStatus: any) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    setSelectedApp(null);
    toast.success('تم تحديث حالة طلب المتقدم وإرسال إشعار له بنجاح!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-green-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-right">
          <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-500/30">
            الموارد البشرية — HR Committee
          </span>
          <h2 className="text-2xl font-black text-white">إدارة طلبات التوظيف واللجان (Applications & Recruitment)</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            فرز طلبات المتقدمين، تحديد مواعيد المقابلات، والقبول والرفض وتوزيع الفرق.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="إجمالي الطلبات المستلمة" value={applications.length} icon={<span className="text-xl">📨</span>} accent="border-green-500" />
        <StatCard label="في انتظار المراجعة" value={applications.filter(a => a.status === 'pending').length} icon={<span className="text-xl">⏳</span>} accent="border-amber-500" />
        <StatCard label="تمت دعوتهم لمقابلة" value={applications.filter(a => a.status === 'interview').length} icon={<span className="text-xl">🤝</span>} accent="border-blue-500" />
      </div>

      {/* Applications Table */}
      <Card className="p-6 space-y-4 border border-slate-200">
        <h3 className="font-bold text-lg text-slate-800">طلبات التقديم المستلمة</h3>
        <Table
          keyField="id"
          data={applications}
          columns={[
            {
              key: 'applicant',
              header: 'المتقدم',
              render: (row) => (
                <div>
                  <strong className="block text-slate-800">{row.responses['f-name']}</strong>
                  <span className="text-xs text-slate-400">{row.responses['f-email']}</span>
                </div>
              ),
            },
            {
              key: 'team',
              header: 'اللجنة المرغوبة',
              render: (row) => <span className="font-semibold text-slate-700">{row.responses['f-team']}</span>,
            },
            {
              key: 'status',
              header: 'الحالة',
              render: (row) => <ApplicationStatusBadge status={row.status} />,
            },
            {
              key: 'actions',
              header: 'مراجعة وتحديد القرار',
              render: (row) => (
                <Button size="sm" onClick={() => setSelectedApp(row)} className="bg-[#002855] text-white">
                  عرض الطلب والتقييم
                </Button>
              ),
            },
          ]}
        />
      </Card>

      {/* Review Application Modal */}
      {selectedApp && (
        <Modal open={!!selectedApp} onClose={() => setSelectedApp(null)} title={`مراجعة طلب: ${selectedApp.responses['f-name']}`} size="lg">
          <div className="space-y-6">
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
              <div><span className="text-slate-400 block text-xs">الكلية والفرقة</span><strong>{selectedApp.responses['f-faculty']}</strong></div>
              <div><span className="text-slate-400 block text-xs">رقم الهاتف</span><strong>{selectedApp.responses['f-phone']}</strong></div>
              <div><span className="text-slate-400 block text-xs">الخبرات والمهارات</span><p className="text-slate-700 mt-1">{selectedApp.responses['f-experience']}</p></div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">اتخاذ إجراء وتحديث الحالة:</span>
              <div className="flex gap-2">
                <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}>
                  رفض الطلب
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleUpdateStatus(selectedApp.id, 'interview')}>
                  دعوة لمقابلة (Interview)
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus(selectedApp.id, 'accepted')}>
                  قبول رسمي في الفريق
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Card className="p-8 border-r-4 border-amber-500 space-y-3">
        <h2 className="text-2xl font-black text-slate-800">لوحة الإداري (Admin Operations)</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          إدارة الحالات الخاصة للشهادات والغياب والتدخلات الاستثنائية والتحقق الإداري المباشر.
        </p>
      </Card>
    </div>
  );
}

export function SuperOrgDashboard() {
  return (
    <div className="space-y-6">
      <Card className="p-8 border-r-4 border-blue-500 space-y-3">
        <h2 className="text-2xl font-black text-slate-800">لوحة المشرف العام على الفعاليات (Super Organizer)</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          الإشراف الشامل على تقارير الفعاليات، نسب الحضور الإجمالية، واعتماد شهادات الفرع.
        </p>
      </Card>
    </div>
  );
}

export function PrDashboard() {
  return (
    <div className="space-y-6">
      <Card className="p-8 border-r-4 border-pink-500 space-y-3">
        <h2 className="text-2xl font-black text-slate-800">لوحة العلاقات العامة (PR & Content)</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          إدارة المحتوى والشراكات والرعايات وفعاليات العلاقات العامة.
        </p>
      </Card>
    </div>
  );
}

export function MediaDashboard() {
  return (
    <div className="space-y-6">
      <Card className="p-8 border-r-4 border-yellow-500 space-y-3">
        <h2 className="text-2xl font-black text-slate-800">لوحة فريق الإعلام (Media & Gallery)</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          رفع وتنظيم التغطيات الإعلامية للفعاليات وإدارة معرض الصور والفيديوهات.
        </p>
      </Card>
    </div>
  );
}

export default HrDashboard;
