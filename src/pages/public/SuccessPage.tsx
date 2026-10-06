import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { EVENT_CONFIG } from '../../config/eventConfig';
import { CheckCircle2, Mail, MessageSquare, ArrowRight, ExternalLink, ShieldCheck, Clock, FileText } from 'lucide-react';

export default function SuccessPage() {
  const location = useLocation();
  const state = location.state as {
    studentName?: string;
    universityEmail?: string;
    applicationCode?: string;
  } | null;

  const appCode = state?.applicationCode || 'WDJ-2026-00421';
  const submittedTime = new Date().toLocaleString('ar-EG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans text-slate-800 selection:bg-purple-100" dir="rtl">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-7">
        {/* Large Completion Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            حالة الطلب: تم الاستلام والتمسيع بنجاح
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            تم استلام طلبك بنجاح! 🎉
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            تم تسجيل طلب انضمامك في <strong className="text-purple-800">رحلة تطوير الويب</strong> بنجاح.
          </p>
        </div>

        {/* Application Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-right space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              ملخص بيانات الطلب
            </span>
            <span className="bg-purple-100 text-purple-800 font-mono text-xs font-bold px-2.5 py-0.5 rounded-md">
              {appCode}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">الكود المرجعي للطلب:</span>
              <div className="font-mono font-bold text-slate-900">{appCode}</div>
            </div>
            <div>
              <span className="text-slate-400">حالة التقديم:</span>
              <div className="font-bold text-emerald-700 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> تم الإرسال
              </div>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400">توقيت التقديم:</span>
              <div className="font-medium text-slate-800">{submittedTime}</div>
            </div>
          </div>
        </div>

        {/* What's Next Guide */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-right space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-600" />
            ما هي الخطوات القادمة المطلوبة؟
          </h3>

          <ol className="space-y-2 text-xs text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <span className="bg-purple-100 text-purple-800 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                1
              </span>
              <span>تم تسجيل وحفظ بيانات طلبك بنجاح في نظام الفعالية.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="bg-purple-100 text-purple-800 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                2
              </span>
              <span>
                تابع بريدك الإلكتروني الجامعي الرسمي{' '}
                {state?.universityEmail && (
                  <strong className="text-purple-950">({state.universityEmail})</strong>
                )}{' '}
                لتلقي رسالة التأكيد.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="bg-purple-100 text-purple-800 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                3
              </span>
              <span>انضم لجروب الواتساب الرسمي لمتابعة الإعلانات والمواعيد أولاً بأول.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="bg-purple-100 text-purple-800 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                4
              </span>
              <span>انتظر الإشعار القادم الخاص بتحديد المواعيد والجلسات من فرع IEEE.</span>
            </li>
          </ol>
        </div>

        {/* WhatsApp Group CTA */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
          <div className="space-y-0.5 text-right">
            <h3 className="text-sm font-bold text-emerald-950">انضم لجروب الواتساب الرسمي</h3>
            <p className="text-xs text-emerald-800">
              للحصول على التحديثات المباشرة وتفاصيل الورش والتواصل مع الموجهين.
            </p>
          </div>

          <a
            href={EVENT_CONFIG.whatsappGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            انضم لجروب الواتساب الرسمي الآن 💬
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Footer Brand */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-center gap-4">
            <img src={EVENT_CONFIG.logos.iuLogo} alt="IU" className="h-12 sm:h-14 w-auto object-contain" />
            <div className="h-8 w-px bg-slate-200" />
            <img src={EVENT_CONFIG.logos.ieeeLogo} alt="IEEE" className="h-12 sm:h-14 w-auto object-contain" />
          </div>
          <p className="text-xs font-bold text-slate-800">{EVENT_CONFIG.orgName}</p>

          <div className="pt-2">
            <Link
              to="/"
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" /> العودة للصفحة الرئيسية للفعالية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
