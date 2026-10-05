import { useState } from 'react';
import { MOCK_EVENTS } from '@/mock/data';
import { StatCard, Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EventStatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { toast } from '@/stores/ui.store';
import { formatDate } from '@/utils';
import type { Event } from '@/types';

export function OrgDashboard() {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Mock participants state for attendance
  const [participants, setParticipants] = useState([
    { id: 'p1', name: 'أحمد المستخدم', email: 'user@ieee.org', isPresent: true },
    { id: 'p2', name: 'سارة طارق', email: 'sara@example.com', isPresent: false },
    { id: 'p3', name: 'خالد إبراهيم', email: 'khaled@example.com', isPresent: true },
  ]);

  const handleToggleAttendance = (id: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, isPresent: !p.isPresent } : p));
    toast.success('تم تحديث حالة الحضور');
  };

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newEvt: Event = {
      id: `evt-${Date.now()}`,
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      location: fd.get('location') as string,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      category: 'Workshops & Conferences',
      organizerId: 'u-org',
      maxCapacity: Number(fd.get('capacity')),
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      registrationsCount: 0,
      attendanceCount: 0,
      certificatesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setEvents([newEvt, ...events]);
    setShowCreateModal(false);
    toast.success('تم إنشاء الفعالية ونشرها بنجاح! 🚀');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-right">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            لجنة التنظيم — Org Committee
          </span>
          <h2 className="text-2xl font-black text-white">إدارة الفعاليات ورصد الحضور والشهادات</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            أنشئ الفعاليات، تابع المسجلين لحظياً، رصد الحضور الميداني (Live Attendance)، وإصدار الشهادات للمؤهلين.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-[#00B4D8] text-[#002855] font-black hover:bg-[#0096C7]">
          + إنشاء فعالية جديدة
        </Button>
      </div>

      {/* Events Table */}
      <Card className="p-6 space-y-4 border border-slate-200">
        <h3 className="font-bold text-lg text-slate-800">قائمة فعاليات الفرع</h3>
        <Table
          keyField="id"
          data={events}
          columns={[
            {
              key: 'title',
              header: 'الفعالية',
              render: (row) => (
                <div>
                  <strong className="block text-slate-800">{row.title}</strong>
                  <span className="text-xs text-slate-400">📍 {row.location}</span>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'الحالة',
              render: (row) => <EventStatusBadge status={row.status} />,
            },
            {
              key: 'registrationsCount',
              header: 'المسجلين / السعة',
              render: (row) => (
                <span className="font-semibold text-slate-700">
                  {row.registrationsCount} / {row.maxCapacity}
                </span>
              ),
            },
            {
              key: 'actions',
              header: 'إدارة الحضور والشهادات',
              render: (row) => (
                <Button size="sm" onClick={() => setSelectedEvent(row)} className="bg-[#002855] text-white">
                  رصد الحضور (Attendance)
                </Button>
              ),
            },
          ]}
        />
      </Card>

      {/* Live Attendance Modal */}
      {selectedEvent && (
        <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={`رصد الحضور الميداني: ${selectedEvent.title}`} size="lg">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>المسجلين: <strong>{participants.length}</strong></div>
              <div>الحاضرين: <strong className="text-green-600">{participants.filter(p => p.isPresent).length}</strong></div>
              <div>الغياب: <strong className="text-red-500">{participants.filter(p => !p.isPresent).length}</strong></div>
            </div>

            <div className="space-y-2">
              {participants.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                  <div>
                    <strong className="block text-sm text-slate-800">{p.name}</strong>
                    <span className="text-xs text-slate-400">{p.email}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={p.isPresent ? 'success' : 'outline'}
                    onClick={() => handleToggleAttendance(p.id)}
                  >
                    {p.isPresent ? '✓ حاضر (Present)' : '✗ غائب (Absent)'}
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">سيتم إصدار الشهادات تلقائياً للحاضرين فقط.</span>
              <Button onClick={() => { setSelectedEvent(null); toast.success('تم إصدار وتحديث الشهادات بنجاح للمشاركين الحاضرين!'); }}>
                إصدار الشهادات للمؤهلين
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="إنشاء فعالية جديدة" size="md">
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الفعالية</label>
              <Input name="title" required placeholder="مثال: ورشة عمل الروبوتات والذكاء الاصطناعي" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الموقع / القاعة</label>
              <Input name="location" required placeholder="مثال: مدرج أ - كلية الهندسة" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">السعة الاستيعابية للمقاعد</label>
              <Input name="capacity" type="number" required defaultValue={100} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل الفعالية</label>
              <Textarea name="description" required placeholder="اكتب وصفاً شاملاً للورشة والمحاور..." />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>إلغاء</Button>
              <Button type="submit" className="bg-[#002855] text-white">نشر الفعالية فوراً</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default OrgDashboard;
