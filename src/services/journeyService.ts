import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  JourneyRegistrationFormData,
  JourneyApplication,
  ApplicationStatus,
  StatusHistoryEntry,
  AdminAuditLog,
} from '../types/journeyRegistration';

const LOCAL_STORAGE_KEY = 'ieee_journey_applications_v2';
const LOCAL_STORAGE_HISTORY_KEY = 'ieee_journey_status_history_v2';
const LOCAL_STORAGE_AUDIT_KEY = 'ieee_journey_audit_logs_v2';

// Clean production state without mock applications
const INITIAL_MOCK_APPLICATIONS: JourneyApplication[] = [];
const INITIAL_STATUS_HISTORY: StatusHistoryEntry[] = [];


function getStoredApplications(): JourneyApplication[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_APPLICATIONS));
      return INITIAL_MOCK_APPLICATIONS;
    }
    const apps: JourneyApplication[] = JSON.parse(raw);
    // Backfill any missing application_code
    let modified = false;
    apps.forEach((app, idx) => {
      if (!app.application_code) {
        app.application_code = `WDJ-2026-${String(idx + 1).padStart(4, '0')}`;
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apps));
    }
    return apps;
  } catch (err) {
    console.error('Error reading applications from localStorage:', err);
    return INITIAL_MOCK_APPLICATIONS;
  }
}

function saveStoredApplications(apps: JourneyApplication[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Error saving applications to localStorage:', err);
  }
}

function getStoredHistory(): StatusHistoryEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(INITIAL_STATUS_HISTORY));
      return INITIAL_STATUS_HISTORY;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_STATUS_HISTORY;
  }
}

function saveStoredHistory(history: StatusHistoryEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Error saving history to localStorage:', err);
  }
}

/**
 * Generate sequential reference code WDJ-2026-0001, etc.
 */
function generateSequentialCode(currentCount: number): string {
  const nextNum = currentCount + 1;
  return `WDJ-2026-${String(nextNum).padStart(4, '0')}`;
}

/**
 * Check if University ID or University Email already exists
 */
export async function checkDuplicate(
  universityId: string,
  universityEmail: string
): Promise<{ exists: boolean; field?: 'university_id' | 'university_email' }> {
  const cleanId = universityId.trim().toLowerCase();
  const cleanEmail = universityEmail.trim().toLowerCase();

  if (isSupabaseConfigured) {
    try {
      const { data: idCheck, error: idErr } = await supabase
        .from('applications')
        .select('id')
        .eq('university_id', cleanId)
        .maybeSingle();

      if (!idErr && idCheck) {
        return { exists: true, field: 'university_id' };
      }

      const { data: emailCheck, error: emailErr } = await supabase
        .from('applications')
        .select('id')
        .eq('university_email', cleanEmail)
        .maybeSingle();

      if (!emailErr && emailCheck) {
        return { exists: true, field: 'university_email' };
      }

      return { exists: false };
    } catch (err) {
      console.warn('Supabase duplicate check failed, using local storage fallback:', err);
    }
  }

  const apps = getStoredApplications();
  const found = apps.find(
    (app) =>
      app.university_id.trim().toLowerCase() === cleanId ||
      app.university_email.trim().toLowerCase() === cleanEmail
  );

  if (found) {
    if (found.university_id.trim().toLowerCase() === cleanId) {
      return { exists: true, field: 'university_id' };
    }
    return { exists: true, field: 'university_email' };
  }

  return { exists: false };
}

/**
 * Submit new Web Development Journey application
 */
export async function submitApplication(
  formData: JourneyRegistrationFormData
): Promise<{ success: boolean; id?: string; applicationCode?: string; error?: string; isDuplicate?: boolean }> {
  const dupCheck = await checkDuplicate(formData.universityId, formData.universityEmail);
  if (dupCheck.exists) {
    return {
      success: false,
      isDuplicate: true,
      error: 'You have already submitted an application for the Web Development Journey.',
    };
  }

  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    try {
      // Fetch current count to assign sequential reference code
      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      const appCode = generateSequentialCode(count || 0);

      const payload = {
        application_code: appCode,
        full_name: formData.fullName.trim(),
        university_id: formData.universityId.trim(),
        university_email: formData.universityEmail.trim().toLowerCase(),
        phone: formData.phone.trim(),
        faculty: formData.faculty,
        academic_year: formData.academicYear,
        programming_level: formData.programmingLevel,
        web_development_experience: formData.webDevExperience,
        technologies: formData.technologies,
        other_technologies: formData.otherTechnologies || '',
        has_web_project: formData.hasWebProject,
        project_description: formData.projectDescription || '',
        github_url: formData.githubUrl || '',
        interest_reason: formData.interestReason.trim(),
        interest_areas: formData.interestAreas,
        has_laptop: formData.hasLaptop,
        status: 'Submitted' as ApplicationStatus,
        submitted_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('applications')
        .insert([payload])
        .select('id, application_code')
        .single();

      if (error) {
        if (error.code === '23505') {
          return {
            success: false,
            isDuplicate: true,
            error: 'You have already submitted an application for the Web Development Journey.',
          };
        }
        throw error;
      }

      // Log initial status history entry
      await supabase.from('application_status_history').insert([
        {
          application_id: data.id,
          old_status: 'Initial Submission',
          new_status: 'Submitted',
          changed_by: 'System',
          changed_at: now,
        },
      ]);

      return { success: true, id: data.id, applicationCode: data.application_code || appCode };
    } catch (err) {
      console.warn('Falling back to local storage for submission:', err);
    }
  }

  const apps = getStoredApplications();
  const appCode = generateSequentialCode(apps.length);

  const newApp: JourneyApplication = {
    id: `app-${Date.now()}`,
    application_code: appCode,
    full_name: formData.fullName.trim(),
    university_id: formData.universityId.trim(),
    university_email: formData.universityEmail.trim().toLowerCase(),
    phone: formData.phone.trim(),
    faculty: formData.faculty as string,
    academic_year: formData.academicYear as string,
    programming_level: formData.programmingLevel as string,
    web_development_experience: formData.webDevExperience as string,
    technologies: formData.technologies,
    other_technologies: formData.otherTechnologies || '',
    has_web_project: formData.hasWebProject as string,
    project_description: formData.projectDescription || '',
    github_url: formData.githubUrl || '',
    interest_reason: formData.interestReason.trim(),
    interest_areas: formData.interestAreas,
    has_laptop: formData.hasLaptop as string,
    status: 'Submitted' as ApplicationStatus,
    submitted_at: now,
    updated_at: now,
  };

  apps.unshift(newApp);
  saveStoredApplications(apps);

  const history = getStoredHistory();
  history.unshift({
    id: `hist-${Date.now()}`,
    application_id: newApp.id,
    old_status: 'Initial Submission',
    new_status: 'Submitted',
    changed_by: 'System',
    changed_at: now,
  });
  saveStoredHistory(history);

  return { success: true, id: newApp.id, applicationCode: newApp.application_code };
}

/**
 * Fetch all applications for Admin Dashboard
 */
export async function getApplications(): Promise<JourneyApplication[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!error && data) {
        return data as JourneyApplication[];
      }
    } catch (err) {
      console.warn('Error fetching applications from Supabase, returning local storage:', err);
    }
  }

  return getStoredApplications();
}

/**
 * Update application status & record status history entry
 */
export async function updateApplicationStatus(
  id: string,
  newStatus: ApplicationStatus,
  adminEmail: string = 'admin@ieee-innovation.edu'
): Promise<boolean> {
  const now = new Date().toISOString();
  const apps = await getApplications();
  const currentApp = apps.find((a) => a.id === id);
  const oldStatus = currentApp ? currentApp.status : 'Submitted';

  if (oldStatus === newStatus) return true;

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: now })
        .eq('id', id);

      if (!error) {
        await supabase.from('application_status_history').insert([
          {
            application_id: id,
            old_status: oldStatus,
            new_status: newStatus,
            changed_by: adminEmail,
            changed_at: now,
          },
        ]);
        return true;
      }
    } catch (err) {
      console.warn('Failed to update status in Supabase:', err);
    }
  }

  const storedApps = getStoredApplications();
  const idx = storedApps.findIndex((a) => a.id === id);
  if (idx !== -1) {
    storedApps[idx].status = newStatus;
    storedApps[idx].updated_at = now;
    saveStoredApplications(storedApps);

    const history = getStoredHistory();
    history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      application_id: id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: adminEmail,
      changed_at: now,
    });
    saveStoredHistory(history);
    return true;
  }

  return false;
}

/**
 * Bulk status update for multiple applications
 */
export async function bulkUpdateStatus(
  ids: string[],
  newStatus: ApplicationStatus,
  adminEmail: string = 'admin@ieee-innovation.edu'
): Promise<{ success: boolean; count: number }> {
  let count = 0;
  for (const id of ids) {
    const ok = await updateApplicationStatus(id, newStatus, adminEmail);
    if (ok) count++;
  }
  return { success: count > 0, count };
}

/**
 * Fetch status history for a specific application
 */
export async function getStatusHistory(applicationId: string): Promise<StatusHistoryEntry[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('application_status_history')
        .select('*')
        .eq('application_id', applicationId)
        .order('changed_at', { ascending: false });

      if (!error && data) {
        return data as StatusHistoryEntry[];
      }
    } catch (err) {
      console.warn('Supabase status history fetch error:', err);
    }
  }

  const history = getStoredHistory();
  return history.filter((h) => h.application_id === applicationId);
}

/**
 * Log lightweight admin audit event
 */
export async function logAdminAudit(
  action: string,
  details: string,
  adminEmail: string = 'admin@ieee-innovation.edu'
): Promise<void> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured) {
    try {
      await supabase.from('admin_audit_logs').insert([
        {
          action,
          details,
          admin_email: adminEmail,
          created_at: now,
        },
      ]);
      return;
    } catch (err) {
      console.warn('Audit log insert error:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUDIT_KEY);
    const logs: AdminAuditLog[] = raw ? JSON.parse(raw) : [];
    logs.unshift({
      id: `audit-${Date.now()}`,
      action,
      details,
      admin_email: adminEmail,
      created_at: now,
    });
    localStorage.setItem(LOCAL_STORAGE_AUDIT_KEY, JSON.stringify(logs.slice(0, 100)));
  } catch (err) {
    // Ignore storage quota
  }
}

/**
 * Delete a single application by ID
 */
export async function deleteApplication(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (!error) {
        // Also remove from local storage if mirrored
        const storedApps = getStoredApplications();
        const filtered = storedApps.filter((a) => a.id !== id);
        saveStoredApplications(filtered);
        return true;
      } else {
        console.warn('Supabase delete error:', error);
      }
    } catch (err) {
      console.warn('Failed to delete application in Supabase:', err);
    }
  }

  // Fallback to local storage delete if Supabase delete is restricted by RLS
  const storedApps = getStoredApplications();
  const filtered = storedApps.filter((a) => a.id !== id);
  saveStoredApplications(filtered);
  return true;
}

/**
 * Bulk delete multiple applications by ID array
 */
export async function bulkDeleteApplications(ids: string[]): Promise<{ success: boolean; count: number }> {
  let count = 0;
  for (const id of ids) {
    const ok = await deleteApplication(id);
    if (ok) count++;
  }
  return { success: count > 0, count };
}

/**
 * Update full application details (Edit Mode)
 */
export async function updateApplicationDetails(
  id: string,
  updatedData: Partial<JourneyApplication>
): Promise<boolean> {
  const now = new Date().toISOString();
  const payload = { ...updatedData, updated_at: now };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('applications')
        .update(payload)
        .eq('id', id);

      if (!error) {
        await logAdminAudit('Application Edited', `Updated details for application ID ${id}`);
        return true;
      }
    } catch (err) {
      console.warn('Failed to update application details in Supabase:', err);
    }
  }

  const storedApps = getStoredApplications();
  const idx = storedApps.findIndex((a) => a.id === id);
  if (idx !== -1) {
    storedApps[idx] = { ...storedApps[idx], ...payload };
    saveStoredApplications(storedApps);
    await logAdminAudit('Application Edited', `Updated details for application ID ${id}`);
    return true;
  }

  return false;
}

