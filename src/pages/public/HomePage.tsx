import { Link } from 'react-router-dom';
import { MOCK_EVENTS, MOCK_FORMS } from '@/mock/data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EventStatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/utils';

export default function HomePage() {
  const publishedEvents = MOCK_EVENTS.filter(e => e.status === 'published');

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#002855] via-[#004B87] to-[#001733] text-white py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#00B4D8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="container-page relative z-10 text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-[#00B4D8] animate-fade-in">
            <span>🚀 المنصة الرقمية الموحدة لـ IEEE Student Branch</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight text-white">
            نبني المستقبل الهندسي والتقني <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B4D8] via-[#90E0EF] to-white">
              برؤية طلابية رائدة
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            منصة متكاملة تدير كافة الأنشطة، الفعاليات الأكاديمية، النماذج، الحضور، وإصدار الشهادات المعتمدة بنظام رقمي متطور.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/events">
              <Button size="lg" className="bg-[#00B4D8] hover:bg-[#0096C7] text-[#002855] font-black shadow-lg hover:shadow-cyan-500/25">
                استكشف الفعاليات القادمة
              </Button>
            </Link>
            <Link to="/forms">
              <Button size="lg" variant="outline" className="text-white border-white/30 bg-white/5 hover:bg-white/15">
                التقديم والانضمام
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/10 text-center">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-black text-[#00B4D8]">500+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">عضو ومشارك نشط</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-black text-white">24+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">فعالية وورشة عمل</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-black text-[#00B4D8]">1,200+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">شهادة حضور معتمدة</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-black text-white">6</div>
              <div className="text-xs text-slate-300 font-medium mt-1">لجان تخصصية رائدة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container-page">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider">ورش العمل والمؤتمرات</span>
            <h2 className="text-3xl font-black text-[#002855] mt-1">أحدث الفعاليات المتاحة</h2>
          </div>
          <Link to="/events">
            <Button variant="outline" size="sm">عرض كافة الفعاليات ←</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedEvents.map(evt => (
            <Card key={evt.id} hover padding="none" className="overflow-hidden flex flex-col group border border-slate-200">
              <div className="h-52 w-full overflow-hidden relative bg-slate-100">
                <img 
                  src={evt.imageUrl} 
                  alt={evt.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <EventStatusBadge status={evt.status} />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white">
                  {evt.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#002855] group-hover:text-[#00B4D8] transition-colors line-clamp-1">
                    {evt.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>📍 {evt.location}</span>
                  <span>🗓️ {formatDate(evt.startTime)}</span>
                </div>

                <Link to="/events" className="w-full">
                  <Button className="w-full justify-center">تفاصيل والتسجيل الآن</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Forms & Recruitment Callout */}
      <section className="container-page">
        <div className="rounded-3xl bg-gradient-to-r from-[#002855] to-[#004B87] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-[#00B4D8]/20 text-[#00B4D8] text-xs font-bold border border-[#00B4D8]/30">
              انضم إلى لجان IEEE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              هل ترغب في صقل مهاراتك القيادية والتقنية؟
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              باب التقديم مفتوح حالياً للانضمام إلى لجان الفرع الطلابي المختلفة. استعرض النماذج المتاحة وقدّم طلبك بسهولة من خلال حسابك.
            </p>
            <div className="pt-2">
              <Link to="/forms">
                <Button size="lg" className="bg-[#00B4D8] hover:bg-[#0096C7] text-[#002855] font-black">
                  استعراض نماذج التقديم النشطة
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
