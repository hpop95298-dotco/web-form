import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { MOCK_EVENTS, MOCK_CERTIFICATES, MOCK_APPLICATIONS } from '@/mock/data';
import { StatCard, Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ApplicationStatusBadge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/utils';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  // User-specific mock stats
  const registeredEvents = MOCK_EVENTS.filter(e => e.id === 'evt-1');
  const userCertificates = MOCK_CERTIFICATES.filter(c => c.userId === 'u-user');
  const userApplications = MOCK_APPLICATIONS.filter(a => a.userId === 'u-user');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#002855] via-[#004B87] to-[#001733] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-right">
          <span className="px-2.5 py-0.5 rounded-full bg-[#00B4D8]/20 text-[#00B4D8] text-xs font-bold">
            لوحة العضو / المستخدم
          </span>
          <h2 className="text-2xl font-black text-white">مرحباً بك، {user?.name} 👋</h2>
          <p className="text-xs sm:text-sm text-slate-200">
            هنا يمكنك متابعة فعالياتك المسجلة، طلبات التقديم للجان، واستعراض شهادات الحضور المعتمدة.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <img src={user?.avatarUrl} alt="" className="w-16 h-16 rounded-full border-2 border-[#00B4D8] shadow-lg" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="الفعاليات المسجلة"
          value={registeredEvents.length}
          icon={<span className="text-xl">📅</span>}
          accent="border-blue-500"
        />
        <StatCard
          label="الشهادات المكتسبة"
          value={userCertificates.length}
          icon={<span className="text-xl">🏅</span>}
          accent="border-[#00B4D8]"
        />
        <StatCard
          label="طلبات التقديم"
          value={userApplications.length}
          icon={<span className="text-xl">📋</span>}
          accent="border-purple-500"
        />
      </div>

      {/* My Events Section */}
      <Card className="p-6 space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-lg text-[#002855]">فعالياتي المسجلة (My Registered Events)</h3>
          <span className="text-xs text-slate-400">{registeredEvents.length} فعاليات</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {registeredEvents.map(evt => (
            <div key={evt.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-4">
              <img src={evt.imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-sm text-slate-800">{evt.title}</h4>
                <p className="text-xs text-slate-500">📍 {evt.location}</p>
                <p className="text-xs text-slate-500">🗓️ {formatDate(evt.startTime)}</p>
                <div className="pt-1">
                  <Badge variant="success" size="sm">مسجل ومؤكد الحضور</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* My Certificates Section */}
      <Card className="p-6 space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-lg text-[#002855]">شهاداتي المعتمدة (My Certificates)</h3>
          <span className="text-xs text-slate-400">معتمدة مع كود تحقق و QR</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userCertificates.map(cert => (
            <div key={cert.id} className="p-5 rounded-xl border border-cyan-100 bg-cyan-50/50 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
                  {cert.certificateCode}
                </span>
                <h4 className="font-bold text-sm text-[#002855] mt-2">
                  شهادة إتمام حضور: IEEE Tech Spark 2026
                </h4>
                <p className="text-xs text-slate-500 mt-1">تاريخ الإصدار: {formatDate(cert.issuedAt)}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-cyan-100">
                <Button size="sm" onClick={() => setSelectedCert(cert)} className="bg-[#002855] text-white">
                  معاينة الشهادة والـ QR
                </Button>
                <Button size="sm" variant="outline">
                  تحميل PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* My Applications Section */}
      <Card className="p-6 space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-lg text-[#002855]">طلبات التقديم للجان (My Applications)</h3>
        </div>
        <div className="space-y-3">
          {userApplications.map(app => (
            <div key={app.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-800">طلب الانضمام: Web Team (تطوير المنصة)</h4>
                <p className="text-xs text-slate-500 mt-0.5">تاريخ التقديم: {formatDate(app.submittedAt)}</p>
                {app.reviewNote && (
                  <p className="text-xs text-blue-700 font-semibold mt-1">💬 ملاحظة HR: {app.reviewNote}</p>
                )}
              </div>
              <ApplicationStatusBadge status={app.status} />
            </div>
          ))}
        </div>
      </Card>

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <Modal open={!!selectedCert} onClose={() => setSelectedCert(null)} title="معاينة الشهادة الرسمية" size="md">
          <div className="space-y-6 text-center">
            <div className="p-8 border-4 border-double border-[#002855] rounded-2xl bg-gradient-to-b from-white to-slate-50 space-y-4 shadow-inner">
              <div className="text-xs font-bold text-[#00B4D8] uppercase tracking-widest">IEEE STUDENT BRANCH CERTIFICATE</div>
              <h3 className="text-xl font-black text-[#002855]">شهادة تقدير وإتمام</h3>
              <p className="text-xs text-slate-500">تشهد إدارة الفرع الطلابي بأن</p>
              <h4 className="text-lg font-black text-cyan-800 border-b border-slate-200 pb-2">{user?.name}</h4>
              <p className="text-xs text-slate-600">قد حضر وأتم بنجاح فعاليات مؤتمر IEEE Tech Spark 2026</p>
              
              <div className="flex items-center justify-center gap-4 pt-4">
                <img src={selectedCert.qrCodeUrl} alt="QR Code" className="w-24 h-24 p-1 bg-white border border-slate-200 rounded-lg shadow-sm" />
                <div className="text-right text-[10px] text-slate-400 space-y-1 font-mono">
                  <div>CODE: {selectedCert.certificateCode}</div>
                  <div>STATUS: VERIFIED & ACTIVE</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedCert(null)}>إغلاق</Button>
              <Button className="bg-[#002855] text-white">طباعة / حفظ PDF</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
