// ============================================================================
// IEEE Innovation University Student Branch - Web Development Journey Types
// ============================================================================

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Accepted' | 'Waitlisted' | 'Rejected';

export type FacultyOption =
  | 'كلية الحاسبات وتكنولوجيا المعلومات'
  | 'كلية الهندسة'
  | 'كلية إدارة الأعمال'
  | 'كلية طب الأسنان'
  | 'كلية الصيدلة'
  | 'أخرى'
  | 'Faculty of Computers & Information Technology'
  | 'Faculty of Engineering'
  | 'Faculty of Business'
  | 'Faculty of Dentistry'
  | 'Faculty of Pharmacy'
  | 'Other';

export const FACULTIES: FacultyOption[] = [
  'كلية الحاسبات وتكنولوجيا المعلومات',
  'كلية الهندسة',
  'كلية إدارة الأعمال',
  'كلية طب الأسنان',
  'كلية الصيدلة',
  'أخرى',
];

export type AcademicYearOption = 'السنة الأولى (أولى)' | 'السنة الثانية (ثانية)' | 'السنة الثالثة (ثالثة)' | 'السنة الرابعة (رابعة)' | 'أخرى' | '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Other';

export const ACADEMIC_YEARS: AcademicYearOption[] = [
  'السنة الأولى (أولى)',
  'السنة الثانية (ثانية)',
  'السنة الثالثة (ثالثة)',
  'السنة الرابعة (رابعة)',
  'أخرى',
];

export type ProgrammingLevelOption = 'مبتدئ تماماً (بدون خبرة)' | 'أساسي (أعرف المفاهيم البسيطة)' | 'متوسط (كتبت كود سابقاً)' | 'متقدم (بنيت مشاريع برمجية)' | 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced';

export const PROGRAMMING_LEVELS: ProgrammingLevelOption[] = [
  'مبتدئ تماماً (بدون خبرة)',
  'أساسي (أعرف المفاهيم البسيطة)',
  'متوسط (كتبت كود سابقاً)',
  'متقدم (بنيت مشاريع برمجية)',
];

export type WebExperienceOption =
  | 'لا، هذه أول مرة بالنسبة لي'
  | 'نعم، مفاهيم أساسية فقط'
  | 'نعم، لدي بعض الخبرة العملية'
  | 'نعم، قمت ببناء مشاريع ويب سابقة'
  | 'No, this is my first time'
  | 'Yes, but only basic concepts'
  | 'Yes, I have some practical experience'
  | 'Yes, I have built Web Projects before';

export const WEB_EXPERIENCES: WebExperienceOption[] = [
  'لا، هذه أول مرة بالنسبة لي',
  'نعم، مفاهيم أساسية فقط',
  'نعم، لدي بعض الخبرة العملية',
  'نعم، قمت ببناء مشاريع ويب سابقة',
];

export type WebProjectOption = 'لا' | 'نعم، مشروع صغير' | 'نعم، عدة مشاريع' | 'No' | 'Yes, a small project' | 'Yes, multiple projects';

export const WEB_PROJECT_OPTIONS: WebProjectOption[] = [
  'لا',
  'نعم، مشروع صغير',
  'نعم، عدة مشاريع',
];

export const TECHNOLOGIES_LIST = [
  'HTML',
  'CSS',
  'JavaScript',
  'Python',
  'C++',
  'C#',
  'Java',
  'SQL',
  'Git / GitHub',
  'لا يوجد',
  'أخرى',
] as const;

export type TechnologyOption = typeof TECHNOLOGIES_LIST[number];

export const INTEREST_AREAS_LIST = [
  'تطوير الواجهات الأمامية (Front-End)',
  'تطوير الخلفيات والقواعد (Back-End)',
  'قواعد البيانات (Database & SQL)',
  'تطوير تطبيقات .NET',
  'تطوير الويب المتكامل (Full-Stack)',
  'العمل الحر (Freelancing)',
  'التطوير المهني والوظيفي',
  'بناء تطبيقات ويب حقيقية',
] as const;

export type InterestAreaOption = typeof INTEREST_AREAS_LIST[number];

export type DateFilterOption = 'all' | 'today' | 'yesterday' | 'last7' | 'last30' | 'custom';

export interface JourneyRegistrationFormData {
  // Step 1: Student Information
  fullName: string;
  universityId: string;
  universityEmail: string;
  phone: string;
  faculty: FacultyOption | '';
  academicYear: AcademicYearOption | '';

  // Step 2: Technical Background
  programmingLevel: ProgrammingLevelOption | '';
  webDevExperience: WebExperienceOption | '';
  technologies: string[];
  otherTechnologies?: string;
  hasWebProject: WebProjectOption | '';
  projectDescription?: string;
  githubUrl?: string;

  // Step 3: Your Interest
  interestReason: string;
  interestAreas: string[];

  // Step 4: Laptop Requirement
  hasLaptop: 'Yes' | 'No' | '';

  // Step 5: Review & Confirmation
  confirmedAccurate: boolean;
}

export interface JourneyApplication {
  id: string;
  application_code: string;
  full_name: string;
  university_id: string;
  university_email: string;
  phone: string;
  faculty: string;
  academic_year: string;
  programming_level: string;
  web_development_experience: string;
  technologies: string[];
  other_technologies?: string;
  has_web_project: string;
  project_description?: string;
  github_url?: string;
  interest_reason: string;
  interest_areas: string[];
  has_laptop: string;
  status: ApplicationStatus;
  submitted_at: string;
  updated_at: string;
}

export interface StatusHistoryEntry {
  id: string;
  application_id: string;
  old_status: ApplicationStatus | 'Initial Submission';
  new_status: ApplicationStatus;
  changed_by: string;
  changed_at: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  details: string;
  admin_email: string;
  created_at: string;
}
