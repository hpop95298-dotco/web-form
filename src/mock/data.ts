import type { Event, Form, Application, Certificate, StaffMember, Team } from '@/types';

export const MOCK_TEAMS: Team[] = [
  { id: 'team-web', name: 'Web Development Team', description: 'مسؤول عن بناء وصيانة المنصة الرقمية والبنية التحتية' },
  { id: 'team-hr', name: 'Human Resources (HR)', description: 'مسؤول عن استقطاب وإدارة وتطوير أعضاء الفرع' },
  { id: 'team-org', name: 'Organization Committee (Org)', description: 'مسؤول عن التخطيط والتنفيذ الميداني للفعاليات' },
  { id: 'team-pr', name: 'Public Relations (PR)', description: 'مسؤول عن العلاقات العامة والشراكات والرعاة' },
  { id: 'team-media', name: 'Media & Design', description: 'مسؤول عن التغطيات والتصميم والهوية البصرية' },
];

export const MOCK_STAFF: StaffMember[] = [
  { id: 'st-1', userId: 'u-superadmin', teamId: 'team-web', position: 'Chair & Lead Developer', isActive: true, joinedAt: '2024-01-01' },
  { id: 'st-2', userId: 'u-webteam', teamId: 'team-web', position: 'Full-Stack Developer', isActive: true, joinedAt: '2024-01-10' },
  { id: 'st-3', userId: 'u-superorg', teamId: 'team-org', position: 'Head of Organizing Committee', isActive: true, joinedAt: '2024-02-01' },
  { id: 'st-4', userId: 'u-hr', teamId: 'team-hr', position: 'HR Manager', isActive: true, joinedAt: '2024-02-15' },
  { id: 'st-5', userId: 'u-pr', teamId: 'team-pr', position: 'PR Officer', isActive: true, joinedAt: '2024-03-01' },
  { id: 'st-6', userId: 'u-media', teamId: 'team-media', position: 'Creative Director', isActive: true, joinedAt: '2024-03-05' },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-1',
    title: 'IEEE Tech Spark 2026: الذكاء الاصطناعي ومستقبل الويب',
    description: 'مؤتمر تقني شامل يستعرض أحدث تقنيات الـ Full-Stack والذكاء الاصطناعي التوليدي مع ورش عمل تطبيقية ومسابقات برمجية.',
    location: 'قاعة المؤتمرات الكبرى — كلية الهندسة',
    startTime: '2026-09-15T10:00:00Z',
    endTime: '2026-09-15T16:00:00Z',
    category: 'Workshops & Conferences',
    organizerId: 'u-org',
    maxCapacity: 250,
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    registrationsCount: 184,
    attendanceCount: 142,
    certificatesCount: 140,
    createdAt: '2026-08-01',
  },
  {
    id: 'evt-2',
    title: 'Embedded Systems & IoT Bootcamp',
    description: 'معسكر تدريبي مكثف لمدة يومين لتعلم برمجة المتحكمات الدقيقة وتطبيقات إنترنت الأشياء العملية.',
    location: 'معمل الأجهزة والتحكم — مبنى B',
    startTime: '2026-09-22T09:00:00Z',
    endTime: '2026-09-23T15:00:00Z',
    category: 'Hands-on Bootcamp',
    organizerId: 'u-superorg',
    maxCapacity: 60,
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    registrationsCount: 60,
    attendanceCount: 0,
    certificatesCount: 0,
    createdAt: '2026-08-10',
  },
  {
    id: 'evt-3',
    title: 'IEEE Day & General Assembly 2026',
    description: 'اللقاء السنوي لفرع IEEE الطلابي للاحتفاء بالإنجازات وتكريم المتميزين واستعراض خطة الفصل الجديد.',
    location: 'المسرح الجامعي المركزي',
    startTime: '2026-10-05T11:00:00Z',
    endTime: '2026-10-05T14:00:00Z',
    category: 'General Event',
    organizerId: 'u-org',
    maxCapacity: 300,
    status: 'draft',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    registrationsCount: 0,
    attendanceCount: 0,
    certificatesCount: 0,
    createdAt: '2026-08-18',
  },
];

export const MOCK_FORMS: Form[] = [
  {
    id: 'form-recruitment-2026',
    title: 'نموذج الانضمام للجان IEEE Student Branch (Recruitment 2026)',
    description: 'انضم إلى لجان الفرع الطلابي (Web, HR, Org, PR, Media, Technical) واكتسب خبرات قيادية وتقنية حقيقية.',
    targetRole: 'Applicant',
    createdBy: 'u-hr',
    isActive: true,
    deadline: '2026-09-30',
    applicationsCount: 78,
    createdAt: '2026-08-01',
    fields: [
      { id: 'f-name', label: 'الاسم الرباعي', type: 'text', required: true, placeholder: 'اكتب اسمك كاملاً' },
      { id: 'f-email', label: 'البريد الإلكتروني الجامعي أو الشخصي', type: 'email', required: true, placeholder: 'name@example.com' },
      { id: 'f-phone', label: 'رقم الهاتف / واتساب', type: 'phone', required: true, placeholder: '01xxxxxxxxx' },
      { id: 'f-faculty', label: 'الكلية والفرقة الدراسية', type: 'text', required: true, placeholder: 'مثال: هندسة حاسبات - الفرقة الثالثة' },
      { 
        id: 'f-team', 
        label: 'اللجنة الأولى المرغوبة', 
        type: 'select', 
        required: true,
        options: ['Web Team (تطوير المنصة)', 'HR Team (الموارد البشرية)', 'Org Team (التنظيم والفعاليات)', 'PR & Relations (العلاقات العامة)', 'Media & Design (الميديا والتصميم)']
      },
      { id: 'f-experience', label: 'نبذة عن مهاراتك وخبراتك السابقة', type: 'textarea', required: true, placeholder: 'تحدث عن مشاريعك أو الأنشطة السابقة' }
    ]
  },
  {
    id: 'form-membership-renewal',
    title: 'تجديد العضوية الدولية IEEE Membership Renewal',
    description: 'نموذج تسجيل بيانات تجديد العضوية السنوية والاستفادة من خصومات فعاليات الـ Section والمكتبة الرقمية.',
    targetRole: 'Member',
    createdBy: 'u-admin',
    isActive: true,
    deadline: '2026-10-15',
    applicationsCount: 35,
    createdAt: '2026-08-12',
    fields: [
      { id: 'f-ieee-num', label: 'رقم عضوية IEEE الدولي (Member ID)', type: 'text', required: true, placeholder: '8 Digits IEEE ID' },
      { id: 'f-receipt', label: 'رقم إيصال السداد أو المعاملة', type: 'text', required: true }
    ]
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    formId: 'form-recruitment-2026',
    userId: 'u-user',
    responses: {
      'f-name': 'أحمد المستخدم',
      'f-email': 'user@ieee.org',
      'f-phone': '01012345678',
      'f-faculty': 'هندسة حاسبات - الفرقة الثالثة',
      'f-team': 'Web Team (تطوير المنصة)',
      'f-experience': 'لدي خبرة سنة في React و TypeScript وتطوير تطبيقات الويب الحديثة.',
    },
    status: 'interview',
    reviewedBy: 'u-hr',
    reviewNote: 'مرشح قوي لمقابلة الـ Web Team التقنية.',
    submittedAt: '2026-08-15T14:20:00Z',
  },
  {
    id: 'app-2',
    formId: 'form-recruitment-2026',
    userId: 'u-superorg',
    responses: {
      'f-name': 'محمود سمير',
      'f-email': 'mahmoud@example.com',
      'f-phone': '01198765432',
      'f-faculty': 'هندسة قوى كهربائية - الفرقة الثانية',
      'f-team': 'Org Team (التنظيم والفعاليات)',
      'f-experience': 'شاركت في تنظيم يوم الهندسة ومعارض سابقة بالجامعة.',
    },
    status: 'pending',
    submittedAt: '2026-08-18T10:15:00Z',
  }
];

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-101',
    certificateCode: 'IEEE-2026-AI-88321',
    eventId: 'evt-1',
    userId: 'u-user',
    issuedAt: '2026-09-15T17:00:00Z',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ieee.org/verify/IEEE-2026-AI-88321',
    isRevoked: false,
  }
];
