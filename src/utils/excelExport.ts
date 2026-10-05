import * as XLSX from 'xlsx';
import { JourneyApplication } from '../types/journeyRegistration';

/**
 * Export applications array to clean Excel (.xlsx) file
 */
export function exportApplicationsToExcel(
  applications: JourneyApplication[],
  fileNamePrefix: string = 'IEEE_Web_Dev_Journey_Applications'
): void {
  const exportData = applications.map((app) => ({
    'Application Code': app.application_code || app.id,
    'Full Name': app.full_name,
    'University ID': app.university_id,
    'University Email': app.university_email,
    Phone: app.phone,
    Faculty: app.faculty,
    'Academic Year': app.academic_year,
    'Programming Level': app.programming_level,
    'Web Dev Experience': app.web_development_experience,
    Technologies: Array.isArray(app.technologies)
      ? app.technologies.join(', ') + (app.other_technologies ? ` (${app.other_technologies})` : '')
      : app.technologies,
    'Has Web Project': app.has_web_project,
    'Project Description': app.project_description || 'N/A',
    'GitHub Profile': app.github_url || 'N/A',
    'Why Interested': app.interest_reason,
    'Areas of Interest': Array.isArray(app.interest_areas)
      ? app.interest_areas.join(', ')
      : app.interest_areas,
    'Has Laptop': app.has_laptop,
    Status: app.status,
    'Submitted At': app.submitted_at ? new Date(app.submitted_at).toLocaleString() : 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths for clean readability
  const colWidths = [
    { wch: 18 }, // Application Code
    { wch: 25 }, // Full Name
    { wch: 15 }, // University ID
    { wch: 30 }, // University Email
    { wch: 15 }, // Phone
    { wch: 35 }, // Faculty
    { wch: 15 }, // Academic Year
    { wch: 18 }, // Programming Level
    { wch: 30 }, // Web Dev Experience
    { wch: 30 }, // Technologies
    { wch: 20 }, // Has Web Project
    { wch: 40 }, // Project Description
    { wch: 30 }, // GitHub Profile
    { wch: 40 }, // Why Interested
    { wch: 35 }, // Areas of Interest
    { wch: 12 }, // Has Laptop
    { wch: 15 }, // Status
    { wch: 22 }, // Submitted At
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `${fileNamePrefix}_${timestamp}.xlsx`);
}

/**
 * Export applications array to standard CSV file
 */
export function exportApplicationsToCSV(
  applications: JourneyApplication[],
  fileNamePrefix: string = 'IEEE_Web_Dev_Journey_Applications'
): void {
  const headers = [
    'Application Code',
    'Full Name',
    'University ID',
    'University Email',
    'Phone',
    'Faculty',
    'Academic Year',
    'Programming Level',
    'Web Dev Experience',
    'Technologies',
    'Has Web Project',
    'Project Description',
    'GitHub Profile',
    'Why Interested',
    'Areas of Interest',
    'Has Laptop',
    'Status',
    'Submitted At',
  ];

  const rows = applications.map((app) => [
    `"${app.application_code || app.id}"`,
    `"${app.full_name.replace(/"/g, '""')}"`,
    `"${app.university_id}"`,
    `"${app.university_email}"`,
    `"${app.phone}"`,
    `"${app.faculty.replace(/"/g, '""')}"`,
    `"${app.academic_year}"`,
    `"${app.programming_level}"`,
    `"${app.web_development_experience.replace(/"/g, '""')}"`,
    `"${(Array.isArray(app.technologies) ? app.technologies.join('; ') : app.technologies).replace(
      /"/g,
      '""'
    )}"`,
    `"${app.has_web_project}"`,
    `"${(app.project_description || '').replace(/"/g, '""')}"`,
    `"${(app.github_url || '').replace(/"/g, '""')}"`,
    `"${app.interest_reason.replace(/"/g, '""')}"`,
    `"${(Array.isArray(app.interest_areas)
      ? app.interest_areas.join('; ')
      : app.interest_areas
    ).replace(/"/g, '""')}"`,
    `"${app.has_laptop}"`,
    `"${app.status}"`,
    `"${app.submitted_at ? new Date(app.submitted_at).toLocaleString() : ''}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileNamePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
