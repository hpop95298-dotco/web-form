import { useState } from 'react';
import { MOCK_EVENTS } from '@/mock/data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EventStatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/stores/ui.store';
import { formatDate } from '@/utils';
import type { Event } from '@/types';
import { Link } from 'react-router-dom';

export default function EventsPage() {
  const { isAuthenticated } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const categories = ['all', 'Workshops & Conferences', 'Hands-on Bootcamp', 'General Event'];

  const filteredEvents = MOCK_EVENTS.filter(e => 
    selectedCategory === 'all' ? true : e.category === selectedCategory
  );

  const handleRegister = (evt: Event) => {
    if (!isAuthenticated) {
      toast.warning('تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول بحسابك أولاً لتتمكن من حجز مقعدك في الفعالية.');
      return;
    }
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      setSelectedEvent(null);
      toast.success('تم التسجيل بنجاح!', `تم حجز مقعدك في فعاليات ${evt.title}. ستجد تفاصيلها في لوحة تحكمك.`);
    }, 800);
  };

  return (
    <div className="container-page py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#002855]">فعاليات وأنشطة IEEE</h1>
          <p className="text-slate-500 text-sm mt-1">تصفح ورش العمل، المعسكرات التدريبية، والمؤتمرات التقنية وسجّل مباشرة.</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#002855] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'جميع الفعاليات' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(evt => (
          <Card key={evt.id} hover padding="none" className="overflow-hidden flex flex-col justify-between border border-slate-200">
            <div className="relative h-48 bg-slate-100">
              <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <EventStatusBadge status={evt.status} />
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-bold text-white">
                {evt.category}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#002855] leading-snug">{evt.title}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{evt.description}</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2"><span>📍 المكان:</span> <span className="font-semibold">{evt.location}</span></div>
                <div className="flex items-center gap-2"><span>🗓️ الموعد:</span> <span className="font-semibold">{formatDate(evt.startTime)}</span></div>
                <div className="flex items-center gap-2"><span>👥 السعة:</span> <span className="font-semibold">{evt.registrationsCount} / {evt.maxCapacity} مسجل</span></div>
              </div>

              <Button 
                onClick={() => setSelectedEvent(evt)}
                className="w-full justify-center mt-2"
                variant={evt.status === 'published' ? 'primary' : 'outline'}
                disabled={evt.status !== 'published'}
              >
                {evt.status === 'published' ? 'عرض التفاصيل والتسجيل' : 'الفعالية غير متاحة حالياً'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Event Details & Registration Modal */}
      {selectedEvent && (
        <Modal 
          open={!!selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          size="lg"
        >
          <div className="space-y-6">
            <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-56 object-cover rounded-xl" />
            
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-400 uppercase">عن الفعالية</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedEvent.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div><span className="text-slate-400 block">التاريخ</span><strong>{formatDate(selectedEvent.startTime)}</strong></div>
              <div><span className="text-slate-400 block">الموقع</span><strong>{selectedEvent.location}</strong></div>
              <div><span className="text-slate-400 block">المقاعد المتبقية</span><strong className="text-[#00B4D8]">{selectedEvent.maxCapacity - selectedEvent.registrationsCount} مقعد</strong></div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {!isAuthenticated ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-amber-600 font-bold">⚠️ يجب تسجيل الدخول للتسجيل</span>
                  <Link to="/auth/login">
                    <Button size="sm">تسجيل الدخول الآن</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-end gap-2 w-full">
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>إغلاق</Button>
                  <Button 
                    loading={isRegistering} 
                    onClick={() => handleRegister(selectedEvent)}
                    className="bg-[#00B4D8] text-[#002855] font-bold hover:bg-[#0096C7]"
                  >
                    تأكيد حجز المقعد
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
