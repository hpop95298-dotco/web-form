import { MOCK_TEAMS, MOCK_STAFF } from '@/mock/data';
import { MOCK_USERS } from '@/mock/users';
import { Card } from '@/components/ui/Card';

export function StaffPage() {
  return (
    <div className="container-page py-12 space-y-12">
      <div className="border-b border-slate-200 pb-6 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider">الهيكل التنظيمي</span>
        <h1 className="text-3xl font-black text-[#002855] mt-1">كادر وقيادة IEEE Student Branch</h1>
        <p className="text-slate-500 text-sm mt-2">تعرف على الهيئة الإدارية، رؤساء اللجان، وفرق العمل التقنية والتنظيمية.</p>
      </div>

      <div className="space-y-12">
        {MOCK_TEAMS.map(team => {
          const teamMembers = MOCK_STAFF.filter(s => s.teamId === team.id);
          return (
            <div key={team.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-[#00B4D8] rounded-full" />
                <div>
                  <h3 className="text-xl font-bold text-[#002855]">{team.name}</h3>
                  <p className="text-xs text-slate-500">{team.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {teamMembers.map(member => {
                  const user = MOCK_USERS.find(u => u.id === member.userId);
                  if (!user) return null;
                  return (
                    <Card key={member.id} className="p-6 text-center space-y-3 border border-slate-200 hover:border-[#00B4D8] transition-all">
                      <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full mx-auto border-2 border-slate-100 shadow-sm" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{user.name}</h4>
                        <p className="text-xs font-semibold text-[#00B4D8] mt-0.5">{member.position}</p>
                      </div>
                      <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {user.email}
                      </span>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="container-page py-12 space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider">من نحن</span>
        <h1 className="text-4xl font-black text-[#002855]">عن فرع IEEE الطلابي</h1>
        <p className="text-slate-600 text-base leading-relaxed">
          فرع طلابي رسمي تابع لمعهد مهندسي الكهرباء والإلكترونيات (IEEE) الدولي، نهدف إلى تمكين الطلاب تكنولوجياً وهندسياً.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3 border-r-4 border-[#00B4D8]">
          <h3 className="text-xl font-bold text-[#002855]">🎯 رسالتنا</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            توفير بيئة تعليمية وعملية تفاعلية تمكّن المهندسين والتقنيين المستقبليين من تطوير مهاراتهم النظرية والعملية وبناء شبكة علاقات قوية.
          </p>
        </Card>
        <Card className="p-6 space-y-3 border-r-4 border-[#002855]">
          <h3 className="text-xl font-bold text-[#002855]">🌟 رؤيتنا</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            أن نكون الفرع الطلابي الرائد والأكثر تأثيراً في تأهيل الكوادر الهندسية والتقنية وإطلاق المبادرات المبتكرة على مستوى المنطقة.
          </p>
        </Card>
      </div>
    </div>
  );
}

export function JoinPage() {
  return (
    <div className="container-page py-12 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[#002855]">انضم إلى IEEE</h1>
        <p className="text-slate-600 text-sm">كن جزءاً من أكبر مجتمع هندسي وتقني في العالم واكتشف مميزات العضوية الطلابية.</p>
      </div>
      <Card className="p-8 space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-50 text-[#00B4D8] flex items-center justify-center text-3xl mx-auto font-black">
          IEEE
        </div>
        <h3 className="text-xl font-bold text-slate-800">مزايا عضوية IEEE الدولية</h3>
        <ul className="text-sm text-slate-600 space-y-2 text-right max-w-md mx-auto list-disc list-inside">
          <li>الوصول إلى أكبر مكتبة رقمية هندسية IEEE Xplore.</li>
          <li>خصومات كبرى على حضور المؤتمرات وورش العمل الدولية.</li>
          <li>فرص التقديم على المنح والجوائز والمسابقات العالمية.</li>
          <li>عضوية لجان وجمعيات تخصصية (CS, PES, RAS, EMBS).</li>
        </ul>
      </Card>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="container-page py-12 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[#002855]">تواصل معنا</h1>
        <p className="text-slate-600 text-sm">لديك استفسار أو ترغب في التعاون أو الرعاية؟ يسعدنا التواصل معك دائماً.</p>
      </div>
      <Card className="p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-xs">البريد الرسمي</span>
            <strong className="text-slate-800">contact@ieee-branch.org</strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-xs">الموقع</span>
            <strong className="text-slate-800">كلية الهندسة — المبنى الرئيسي</strong>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StaffPage;
