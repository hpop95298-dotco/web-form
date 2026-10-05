import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { toast } from '@/stores/ui.store';
import { MOCK_USERS } from '@/mock/users';

export function LoginPage() {
  const [email, setEmail] = useState('user@ieee.org');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login, getDashboardPath } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      toast.success('تم تسجيل الدخول بنجاح', `مرحباً بك! جاري توجيهك إلى لوحة التحكم.`);
      navigate(getDashboardPath());
    } else {
      toast.error('فشل تسجيل الدخول', 'البريد الإلكتروني غير مسجل في البيانات التجريبية.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002855] to-[#001733] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <div className="w-12 h-12 rounded-2xl bg-[#00B4D8] text-[#002855] font-black text-xl flex items-center justify-center mx-auto shadow-lg">
              IEEE
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">تسجيل الدخول إلى المنصة</h1>
          <p className="text-xs text-slate-300">منصة إدارة الفرع الطلابي الرقمية</p>
        </div>

        <Card className="p-8 space-y-6 border-slate-700 bg-white/95 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
              <Input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@ieee.org"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
              <Input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full justify-center bg-[#002855] text-white">
              دخول المنصة
            </Button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 mb-2">حسابات تجريبية سريعة (Demo):</p>
            <div className="flex flex-wrap gap-1.5">
              {MOCK_USERS.map(u => (
                <button
                  key={u.role}
                  type="button"
                  onClick={() => { setEmail(u.email); setPassword('password'); }}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  {u.role}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('تم إنشاء الحساب بنجاح!', 'يمكنك الآن تسجيل الدخول بحسابك الجديد.');
      navigate('/auth/login');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002855] to-[#001733] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <div className="w-12 h-12 rounded-2xl bg-[#00B4D8] text-[#002855] font-black text-xl flex items-center justify-center mx-auto shadow-lg">
              IEEE
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">إنشاء حساب جديد</h1>
          <p className="text-xs text-slate-300">سجل الآن لحضور الفعاليات وتلقي الشهادات والتقديم للجان</p>
        </div>

        <Card className="p-8 space-y-6 border-slate-700 bg-white/95 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل</label>
              <Input required value={name} onChange={e => setName(e.target.value)} placeholder="أحمد محمد" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
              <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="ahmed@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
              <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" loading={loading} className="w-full justify-center bg-[#002855] text-white">
              تأكيد التسجيل
            </Button>
          </form>
          <div className="text-center text-xs text-slate-500">
            لديك حساب بالفعل؟ <Link to="/auth/login" className="text-[#00B4D8] font-bold">سجل دخولك هنا</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
