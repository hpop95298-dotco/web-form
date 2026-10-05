// ============================================
// IEEE PLATFORM — CORE TYPE DEFINITIONS
// ============================================

// ── Roles ──────────────────────────────────
export type Role =
  | 'super_admin'
  | 'web_team'
  | 'super_organizer'
  | 'org'
  | 'admin'
  | 'hr'
  | 'pr'
  | 'media'
  | 'user';

export const ROLE_LABELS: Record<Role, string> = {
  super_admin:     'Super Admin',
  web_team:        'Web Team',
  super_organizer: 'Super Organizer',
  org:             'Org Committee',
  admin:           'Admin',
  hr:              'HR',
  pr:              'PR',
  media:           'Media',
  user:            'User',
};

export const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  super_admin:     { bg: 'bg-purple-100',  text: 'text-purple-800',  border: 'border-purple-200' },
  web_team:        { bg: 'bg-indigo-100',  text: 'text-indigo-800',  border: 'border-indigo-200' },
  super_organizer: { bg: 'bg-blue-100',    text: 'text-blue-800',    border: 'border-blue-200'   },
  org:             { bg: 'bg-cyan-100',    text: 'text-cyan-800',    border: 'border-cyan-200'   },
  admin:           { bg: 'bg-orange-100',  text: 'text-orange-800',  border: 'border-orange-200' },
  hr:              { bg: 'bg-green-100',   text: 'text-green-800',   border: 'border-green-200'  },
  pr:              { bg: 'bg-pink-100',    text: 'text-pink-800',    border: 'border-pink-200'   },
  media:           { bg: 'bg-yellow-100',  text: 'text-yellow-800',  border: 'border-yellow-200' },
  user:            { bg: 'bg-gray-100',    text: 'text-gray-700',    border: 'border-gray-200'   },
};

// ── User ───────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  collegeId?: string;
  avatarUrl?: string;
  role: Role;
  teamId?: string;
  createdAt: string;
  isActive: boolean;
}

// ── Event Status ──────────────────────────
export type EventStatus = 'draft' | 'published' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  category: string;
  organizerId: string;
  maxCapacity: number;
  status: EventStatus;
  imageUrl?: string;
  registrationsCount: number;
  attendanceCount: number;
  certificatesCount: number;
  createdAt: string;
}

// ── Registration & Attendance ─────────────
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';
export type AttendanceStatus   = 'present' | 'absent' | 'not_recorded';

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  status: RegistrationStatus;
}

export interface Attendance {
  id: string;
  eventId: string;
  userId: string;
  checkedInBy?: string;
  isPresent: boolean;
  checkinTime?: string;
}

// ── Form & Applications ───────────────────
export type FormFieldType = 'text' | 'email' | 'phone' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'file' | 'date';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'interview';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  targetRole?: string;
  createdBy: string;
  isActive: boolean;
  deadline?: string;
  applicationsCount: number;
  createdAt: string;
}

export interface Application {
  id: string;
  formId: string;
  userId: string;
  responses: Record<string, string | string[]>;
  status: ApplicationStatus;
  reviewedBy?: string;
  reviewNote?: string;
  submittedAt: string;
}

// ── Certificate ───────────────────────────
export interface Certificate {
  id: string;
  certificateCode: string;
  eventId: string;
  userId: string;
  issuedAt: string;
  qrCodeUrl?: string;
  isRevoked: boolean;
}

// ── Staff & Team ──────────────────────────
export interface Team {
  id: string;
  name: string;
  description: string;
}

export interface StaffMember {
  id: string;
  userId: string;
  teamId: string;
  position: string;
  bio?: string;
  isActive: boolean;
  joinedAt: string;
}

// ── Notification ──────────────────────────
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// ── Permissions ───────────────────────────
export type Permission =
  | 'events.view' | 'events.create' | 'events.edit' | 'events.delete' | 'events.publish'
  | 'forms.view' | 'forms.create' | 'forms.edit' | 'forms.delete' | 'forms.manage'
  | 'attendance.view' | 'attendance.manage'
  | 'certificates.view' | 'certificates.issue' | 'certificates.manage' | 'certificates.revoke'
  | 'users.view' | 'users.manage'
  | 'staff.view' | 'staff.manage'
  | 'media.upload' | 'media.manage' | 'media.delete'
  | 'applications.view' | 'applications.manage'
  | 'roles.manage'
  | 'settings.manage'
  | 'analytics.view';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    'events.view','events.create','events.edit','events.delete','events.publish',
    'forms.view','forms.create','forms.edit','forms.delete','forms.manage',
    'attendance.view','attendance.manage',
    'certificates.view','certificates.issue','certificates.manage','certificates.revoke',
    'users.view','users.manage',
    'staff.view','staff.manage',
    'media.upload','media.manage','media.delete',
    'applications.view','applications.manage',
    'roles.manage','settings.manage','analytics.view',
  ],
  web_team: [
    'events.view','events.create','events.edit','events.delete','events.publish',
    'forms.view','forms.create','forms.edit','forms.delete','forms.manage',
    'attendance.view','attendance.manage',
    'certificates.view','certificates.issue','certificates.manage','certificates.revoke',
    'users.view','users.manage',
    'staff.view','staff.manage',
    'media.upload','media.manage','media.delete',
    'applications.view','applications.manage',
    'roles.manage','settings.manage','analytics.view',
  ],
  super_organizer: [
    'events.view','events.create','events.edit','events.publish',
    'attendance.view','attendance.manage',
    'certificates.view','certificates.issue','certificates.manage',
    'analytics.view',
  ],
  org: [
    'events.view','events.create','events.edit','events.publish',
    'attendance.view','attendance.manage',
    'certificates.view','certificates.issue',
  ],
  admin: [
    'events.view',
    'attendance.view','attendance.manage',
    'certificates.view','certificates.manage',
    'analytics.view',
  ],
  hr: [
    'forms.view','forms.create','forms.edit','forms.manage',
    'applications.view','applications.manage',
    'users.view','users.manage',
    'staff.view','staff.manage',
  ],
  pr: [
    'events.view',
    'media.upload','media.manage',
  ],
  media: [
    'events.view',
    'media.upload','media.manage',
  ],
  user: [
    'events.view',
    'forms.view',
    'certificates.view',
    'applications.view',
    'attendance.view',
  ],
};

// ── Dashboard Route ───────────────────────
export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  super_admin:     '/dashboard/super-admin',
  web_team:        '/dashboard/super-admin',
  super_organizer: '/dashboard/super-organizer',
  org:             '/dashboard/org',
  admin:           '/dashboard/admin',
  hr:              '/dashboard/hr',
  pr:              '/dashboard/pr',
  media:           '/dashboard/media',
  user:            '/dashboard/user',
};

// ── Stat Card ─────────────────────────────
export interface StatCard {
  label: string;
  value: number | string;
  icon: string;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}
