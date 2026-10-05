import { useState } from 'react';
import { MOCK_FORMS } from '@/mock/data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/stores/ui.store';
import type { Form } from '@/types';
import { Link } from 'react-router-dom';

export default function FormsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenForm = (f: Form) => {
    setSelectedForm(f);
    // pre-fill user info if logged in
    if (user) {
      setFormData({
        'f-name': user.name,
        'f-email': user.email,
      });
    } else {
      setFormData({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning('تسجيل الدخول مطلوب', 'يجب تسجيل الدخول بحسابك أولاً لإتمام إرسال النموذج.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedForm(null);
      toast.success('تم إرسال طلبك بنجاح!', 'تم حفظ الطلب وإحالته للمراجعة من قبل لجنة الموارد البشرية.');
    }, 1000);
  };

  return (
    <div className="container-page py-12 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-[#002855]">النماذج واستمارات التقديم</h1>
        <p className="text-slate-500 text-sm mt-1">
          استعرض كافة الاستمارات المتاحة للتوظيف، الانضمام، واللجان المتخصصة في فرع IEEE.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_FORMS.map(f => (
          <Card key={f.id} hover className="p-6 flex flex-col justify-between space-y-6 border border-slate-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                  متاح للتقديم
                </span>
                <span className="text-xs text-slate-400">ينتهي في: {f.deadline}</span>
              </div>
              <h3 className="text-xl font-bold text-[#002855] leading-snug">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">📋 {f.fields.length} حقول مطلوبة</span>
              <Button onClick={() => handleOpenForm(f)}>
                فتح النموذج والتقديم
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Submission Modal with Auth Check */}
      {selectedForm && (
        <Modal
          open={!!selectedForm}
          onClose={() => setSelectedForm(null)}
          title={selectedForm.title}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {selectedForm.description}
            </p>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
              {selectedForm.fields.map(field => (
                <div key={field.id} className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <Select
                      required={field.required}
                      value={formData[field.id] || ''}
                      onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                      options={field.options?.map(opt => ({ value: opt, label: opt })) || []}
                      placeholder="اختر الإجابة المناسبة..."
                    />
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.id] || ''}
                      onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.id] || ''}
                      onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Auth Guard & Action */}
            <div className="pt-4 border-t border-slate-100">
              {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="text-xs text-amber-800 font-semibold">
                    🔒 يمكنك ملء النموذج، لكن <strong>يجب تسجيل الدخول</strong> لإرسال طلبك وحفظه باسمك.
                  </div>
                  <Link to="/auth/login" className="w-full sm:w-auto">
                    <Button size="sm" className="w-full">تسجيل الدخول</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => setSelectedForm(null)}>إلغاء</Button>
                  <Button type="submit" loading={isSubmitting} className="bg-[#002855] text-white">
                    إرسال الطلب رسمياً
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
