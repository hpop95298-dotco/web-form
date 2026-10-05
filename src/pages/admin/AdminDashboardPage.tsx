import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENT_CONFIG } from '../../config/eventConfig';
import {
  JourneyApplication,
  ApplicationStatus,
  StatusHistoryEntry,
  FACULTIES,
  ACADEMIC_YEARS,
  PROGRAMMING_LEVELS,
  WEB_EXPERIENCES,
  TECHNOLOGIES_LIST,
  INTEREST_AREAS_LIST,
} from '../../types/journeyRegistration';
import {
  getApplications,
  updateApplicationStatus,
  bulkUpdateStatus,
  getStatusHistory,
  logAdminAudit,
  deleteApplication,
  bulkDeleteApplications,
  updateApplicationDetails,
} from '../../services/journeyService';
import { exportApplicationsToExcel, exportApplicationsToCSV } from '../../utils/excelExport';
import {
  Search,
  Download,
  Eye,
  LogOut,
  X,
  RefreshCw,
  FileSpreadsheet,
  RotateCcw,
  CheckSquare,
  Square,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  History,
  Check,
  Clock,
  Layers,
  Sparkles,
  Trash2,
  Edit3,
  Save,
  Pencil,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Data & Global State
  const [applications, setApplications] = useState<JourneyApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Drawer / Modal & History & Edit State
  const [selectedApp, setSelectedApp] = useState<JourneyApplication | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Partial<JourneyApplication>>({});

  // Delete Confirm Modal State
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id?: string;
    isBulk?: boolean;
    appCode?: string;
    name?: string;
  }>({ open: false });

  // Bulk Actions State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkModal, setBulkModal] = useState<{
    open: boolean;
    targetStatus: ApplicationStatus | null;
  }>({ open: false, targetStatus: null });

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [facultyFilter, setFacultyFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [expFilter, setExpFilter] = useState<string>('');
  const [laptopFilter, setLaptopFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [techFilter, setTechFilter] = useState<string>('');
  const [interestFilter, setInterestFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Sorting State
  const [sortField, setSortField] = useState<
    'submitted_at' | 'full_name' | 'academic_year' | 'programming_level' | 'status'
  >('submitted_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Show auto-dismiss toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Auth Protection & Load Data
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (!isAuth) {
      navigate('/admin/login');
    } else {
      loadData();
    }
  }, [navigate]);

  const loadData = async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    const data = await getApplications();
    setApplications(data);
    setLastUpdated(new Date());
    setLoading(false);
    if (silent) {
      showToast(
        `Data refreshed successfully at ${new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}`
      );
    }
  };

  const handleLogout = async () => {
    await logAdminAudit('Logout', 'Admin logged out from dashboard session');
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_username');
    navigate('/admin/login');
  };

  // Load status history when selecting an app
  useEffect(() => {
    if (selectedApp) {
      setHistoryLoading(true);
      setIsEditing(false);
      setEditFormData(selectedApp);
      getStatusHistory(selectedApp.id).then((history) => {
        setStatusHistory(history);
        setHistoryLoading(false);
      });
    } else {
      setStatusHistory([]);
      setIsEditing(false);
      setEditFormData({});
    }
  }, [selectedApp]);

  // Reset pagination on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    facultyFilter,
    yearFilter,
    levelFilter,
    expFilter,
    laptopFilter,
    statusFilter,
    techFilter,
    interestFilter,
    dateFilter,
    customStartDate,
    customEndDate,
    pageSize,
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFacultyFilter('');
    setYearFilter('');
    setLevelFilter('');
    setExpFilter('');
    setLaptopFilter('');
    setStatusFilter('');
    setTechFilter('');
    setInterestFilter('');
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setCurrentPage(1);
    showToast('All filters and search criteria reset.');
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    const appToUpdate = applications.find((a) => a.id === id);
    if (!appToUpdate || appToUpdate.status === newStatus) return;

    const success = await updateApplicationStatus(id, newStatus);
    if (success) {
      const nowIso = new Date().toISOString();
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus, updated_at: nowIso } : app))
      );
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp((prev) => (prev ? { ...prev, status: newStatus, updated_at: nowIso } : null));
        const history = await getStatusHistory(id);
        setStatusHistory(history);
      }
      showToast(`Application status updated to "${newStatus}".`);
      await logAdminAudit(
        'Status Update',
        `Changed status for ${appToUpdate.application_code || id} (${appToUpdate.full_name}) from ${appToUpdate.status} to ${newStatus}`
      );
    } else {
      showToast('Failed to update application status. Please try again.');
    }
  };

  const handleBulkStatusApply = async () => {
    if (!bulkModal.targetStatus || selectedIds.length === 0) return;

    const targetStatus = bulkModal.targetStatus;
    const countToUpdate = selectedIds.length;
    setBulkModal({ open: false, targetStatus: null });

    setLoading(true);
    const res = await bulkUpdateStatus(selectedIds, targetStatus);
    if (res.success) {
      await loadData();
      showToast(`${res.count} of ${countToUpdate} applications updated to "${targetStatus}".`);
      setSelectedIds([]);
      await logAdminAudit(
        'Bulk Status Update',
        `Updated ${res.count} applications to status ${targetStatus}`
      );
    } else {
      showToast('Bulk status update failed.');
    }
    setLoading(false);
  };

  // Delete Action Handlers
  const confirmSingleDelete = (app: JourneyApplication) => {
    setDeleteModal({
      open: true,
      id: app.id,
      isBulk: false,
      appCode: app.application_code || app.id,
      name: app.full_name,
    });
  };

  const confirmBulkDelete = () => {
    setDeleteModal({
      open: true,
      isBulk: true,
    });
  };

  const executeDelete = async () => {
    if (deleteModal.isBulk) {
      const idsToDelete = [...selectedIds];
      setDeleteModal({ open: false });
      setLoading(true);
      const res = await bulkDeleteApplications(idsToDelete);
      if (res.success) {
        showToast(`${res.count} application(s) deleted successfully.`);
        setSelectedIds([]);
        if (selectedApp && idsToDelete.includes(selectedApp.id)) {
          setSelectedApp(null);
        }
        await loadData();
      } else {
        showToast('Failed to delete selected applications.');
      }
      setLoading(false);
    } else if (deleteModal.id) {
      const idToDelete = deleteModal.id;
      setDeleteModal({ open: false });
      setLoading(true);
      const ok = await deleteApplication(idToDelete);
      if (ok) {
        showToast('Application deleted successfully.');
        setSelectedIds((prev) => prev.filter((i) => i !== idToDelete));
        if (selectedApp && selectedApp.id === idToDelete) {
          setSelectedApp(null);
        }
        await loadData();
      } else {
        showToast('Failed to delete application.');
      }
      setLoading(false);
    }
  };

  // Save Edit Details Handler
  const handleSaveEdit = async () => {
    if (!selectedApp) return;

    setLoading(true);
    const ok = await updateApplicationDetails(selectedApp.id, editFormData);
    if (ok) {
      const updatedApp = { ...selectedApp, ...editFormData, updated_at: new Date().toISOString() };
      setApplications((prev) =>
        prev.map((app) => (app.id === selectedApp.id ? (updatedApp as JourneyApplication) : app))
      );
      setSelectedApp(updatedApp as JourneyApplication);
      setIsEditing(false);
      showToast('Candidate application details updated successfully.');
    } else {
      showToast('Failed to save changes. Please try again.');
    }
    setLoading(false);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = applications.length;
    const todayStr = new Date().toISOString().slice(0, 10);
    const today = applications.filter((a) => a.submitted_at?.startsWith(todayStr)).length;
    const submitted = applications.filter((a) => a.status === 'Submitted').length;
    const underReview = applications.filter((a) => a.status === 'Under Review').length;
    const accepted = applications.filter((a) => a.status === 'Accepted').length;
    const waitlisted = applications.filter((a) => a.status === 'Waitlisted').length;
    const rejected = applications.filter((a) => a.status === 'Rejected').length;

    return { total, today, submitted, underReview, accepted, waitlisted, rejected };
  }, [applications]);

  // Analytics breakdowns
  const facultyAnalytics = useMemo(() => {
    const counts: Record<string, number> = {};
    FACULTIES.forEach((f) => (counts[f] = 0));
    applications.forEach((a) => {
      if (a.faculty) {
        counts[a.faculty] = (counts[a.faculty] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([faculty, count]) => ({ faculty, count }))
      .sort((a, b) => b.count - a.count);
  }, [applications]);

  const levelAnalytics = useMemo(() => {
    const counts: Record<string, number> = {};
    PROGRAMMING_LEVELS.forEach((l) => (counts[l] = 0));
    applications.forEach((a) => {
      if (a.programming_level) {
        counts[a.programming_level] = (counts[a.programming_level] || 0) + 1;
      }
    });
    return PROGRAMMING_LEVELS.map((level) => ({
      level,
      count: counts[level] || 0,
    }));
  }, [applications]);

  // Filtered and Sorted dataset
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          const matchesCode = (app.application_code || '').toLowerCase().includes(q);
          const matchesName = app.full_name.toLowerCase().includes(q);
          const matchesId = app.university_id.toLowerCase().includes(q);
          const matchesEmail = app.university_email.toLowerCase().includes(q);
          const matchesPhone = app.phone.toLowerCase().includes(q);
          if (!matchesCode && !matchesName && !matchesId && !matchesEmail && !matchesPhone)
            return false;
        }

        if (facultyFilter && app.faculty !== facultyFilter) return false;
        if (yearFilter && app.academic_year !== yearFilter) return false;
        if (levelFilter && app.programming_level !== levelFilter) return false;
        if (expFilter && app.web_development_experience !== expFilter) return false;
        if (laptopFilter && app.has_laptop !== laptopFilter) return false;
        if (statusFilter && app.status !== statusFilter) return false;
        if (techFilter && (!Array.isArray(app.technologies) || !app.technologies.includes(techFilter)))
          return false;
        if (
          interestFilter &&
          (!Array.isArray(app.interest_areas) || !app.interest_areas.includes(interestFilter))
        )
          return false;

        // Date Filter logic
        if (dateFilter !== 'all') {
          const appDate = new Date(app.submitted_at);
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          if (dateFilter === 'today') {
            const appDay = new Date(app.submitted_at);
            appDay.setHours(0, 0, 0, 0);
            if (appDay.getTime() !== now.getTime()) return false;
          } else if (dateFilter === 'yesterday') {
            const yest = new Date(now);
            yest.setDate(yest.getDate() - 1);
            const appDay = new Date(app.submitted_at);
            appDay.setHours(0, 0, 0, 0);
            if (appDay.getTime() !== yest.getTime()) return false;
          } else if (dateFilter === '7days') {
            const cutoff = new Date(now);
            cutoff.setDate(cutoff.getDate() - 7);
            if (appDate < cutoff) return false;
          } else if (dateFilter === '30days') {
            const cutoff = new Date(now);
            cutoff.setDate(cutoff.getDate() - 30);
            if (appDate < cutoff) return false;
          } else if (dateFilter === 'custom') {
            if (customStartDate) {
              const start = new Date(customStartDate);
              start.setHours(0, 0, 0, 0);
              if (appDate < start) return false;
            }
            if (customEndDate) {
              const end = new Date(customEndDate);
              end.setHours(23, 59, 59, 999);
              if (appDate > end) return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'submitted_at') {
          valA = new Date(a.submitted_at).getTime();
          valB = new Date(b.submitted_at).getTime();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [
    applications,
    searchTerm,
    facultyFilter,
    yearFilter,
    levelFilter,
    expFilter,
    laptopFilter,
    statusFilter,
    techFilter,
    interestFilter,
    dateFilter,
    customStartDate,
    customEndDate,
    sortField,
    sortDirection,
  ]);

  // Paginated applications subset
  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredApplications.slice(startIndex, startIndex + pageSize);
  }, [filteredApplications, currentPage, pageSize]);

  // Selection handlers
  const isAllVisibleSelected =
    paginatedApplications.length > 0 &&
    paginatedApplications.every((app) => selectedIds.includes(app.id));

  const toggleSelectAllVisible = () => {
    if (isAllVisibleSelected) {
      const visibleIds = paginatedApplications.map((app) => app.id);
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      const visibleIds = paginatedApplications.map((app) => app.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-950/90 text-blue-300 border-blue-800';
      case 'Under Review':
        return 'bg-amber-950/90 text-amber-300 border-amber-800';
      case 'Accepted':
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-800';
      case 'Waitlisted':
        return 'bg-purple-950/90 text-purple-300 border-purple-800';
      case 'Rejected':
        return 'bg-rose-950/90 text-rose-300 border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Selected applications objects
  const selectedApplicationsList = useMemo(() => {
    return applications.filter((app) => selectedIds.includes(app.id));
  }, [applications, selectedIds]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (facultyFilter) count++;
    if (yearFilter) count++;
    if (levelFilter) count++;
    if (expFilter) count++;
    if (laptopFilter) count++;
    if (statusFilter) count++;
    if (techFilter) count++;
    if (interestFilter) count++;
    if (dateFilter !== 'all') count++;
    return count;
  }, [
    facultyFilter,
    yearFilter,
    levelFilter,
    expFilter,
    laptopFilter,
    statusFilter,
    techFilter,
    interestFilter,
    dateFilter,
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-purple-900/90 text-purple-100 border border-purple-500/80 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-purple-300 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="bg-slate-800/90 border-b border-slate-700/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-700 shadow-xs">
              <img
                src={EVENT_CONFIG.logos.iuLogo}
                alt="IU"
                className="h-9 sm:h-10 w-auto object-contain"
              />
              <div className="h-6 w-px bg-slate-200" />
              <img
                src={EVENT_CONFIG.logos.ieeeLogo}
                alt="IEEE"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-purple-400 bg-purple-950/80 border border-purple-800/80 px-2.5 py-0.5 rounded-md self-start">
                Admin Portal
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                IEEE Innovation University Student Branch
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>
                Last updated:{' '}
                {lastUpdated.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <button
              onClick={() => loadData(true)}
              title="Refresh applications list"
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 sm:px-3 sm:py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-600/80"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800/80 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Portal Page Title & Export Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h1 className="text-2xl font-extrabold text-white">
                Web Development Journey Registration Management
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Official Applicant Management & Status Portal • {EVENT_CONFIG.orgName}
            </p>
          </div>

          {/* Export Action Options */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={() =>
                  exportApplicationsToExcel(
                    selectedApplicationsList,
                    `WDJ-Selected-Applications-${selectedIds.length}`
                  )
                }
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors animate-pulse"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export Selected ({selectedIds.length})
              </button>
            )}

            <button
              onClick={() =>
                exportApplicationsToExcel(
                  filteredApplications,
                  `WDJ-Filtered-Applications-${filteredApplications.length}`
                )
              }
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Filtered ({filteredApplications.length})
            </button>

            <button
              onClick={() => exportApplicationsToExcel(applications, 'WDJ-Applications-All-2026')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-purple-400" /> Export All (.xlsx)
            </button>

            <button
              onClick={() => exportApplicationsToCSV(filteredApplications, 'WDJ-Applications-CSV')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors"
            >
              CSV
            </button>
          </div>
        </div>

        {/* Real-time Metrics Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total Apps
            </span>
            <div className="text-2xl font-extrabold text-white">{metrics.total}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">
              Today
            </span>
            <div className="text-2xl font-extrabold text-purple-300">{metrics.today}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
              Submitted
            </span>
            <div className="text-2xl font-extrabold text-blue-300">{metrics.submitted}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              Under Review
            </span>
            <div className="text-2xl font-extrabold text-amber-300">{metrics.underReview}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Accepted
            </span>
            <div className="text-2xl font-extrabold text-emerald-300">{metrics.accepted}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">
              Waitlisted
            </span>
            <div className="text-2xl font-extrabold text-purple-300">{metrics.waitlisted}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-1 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              Rejected
            </span>
            <div className="text-2xl font-extrabold text-rose-300">{metrics.rejected}</div>
          </div>
        </div>

        {/* Compact Visual Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faculty Distribution */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" /> Applications by Faculty
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {facultyAnalytics.reduce((acc, f) => acc + f.count, 0)} total
              </span>
            </div>
            <div className="space-y-2.5">
              {facultyAnalytics.map(({ faculty, count }) => {
                const percentage =
                  metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                return (
                  <div key={faculty} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="truncate pr-2 font-medium">{faculty}</span>
                      <span className="font-mono text-purple-300 shrink-0 font-semibold">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Programming Level Distribution */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" /> Programming Level Breakdown
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Real-time Data</span>
            </div>
            <div className="space-y-3">
              {levelAnalytics.map(({ level, count }) => {
                const percentage =
                  metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                return (
                  <div key={level} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-semibold">{level}</span>
                      <span className="font-mono text-purple-300 font-semibold">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-xs">
          {/* Main Search Input & Reset Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Ref (WDJ-2026-XXXX), Full Name, University ID, Email, or Phone..."
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm pl-11 pr-10 py-3 rounded-xl outline-none focus:border-purple-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="w-full sm:w-auto lg:hidden bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 border border-slate-600/80"
            >
              <Filter className="w-4 h-4 text-purple-400" /> Filters ({activeFiltersCount})
            </button>

            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-600/80 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>

          {/* Desktop Filter Dropdowns */}
          <div
            className={`${
              mobileFiltersOpen ? 'block' : 'hidden'
            } lg:grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-2.5 pt-2 lg:pt-0`}
          >
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-2.5 rounded-xl outline-none focus:border-purple-500"
            >
              <option value="">All Faculties</option>
              {FACULTIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-2.5 rounded-xl outline-none focus:border-purple-500"
            >
              <option value="">All Years</option>
              {ACADEMIC_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-2.5 rounded-xl outline-none focus:border-purple-500"
            >
              <option value="">All Levels</option>
              {PROGRAMMING_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-2.5 rounded-xl outline-none focus:border-purple-500"
            >
              <option value="">All Web Exp</option>
              {WEB_EXPERIENCES.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <select
              value={laptopFilter}
              onChange={(e) => setLaptopFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-2.5 rounded-xl outline-none focus:border-purple-500"
            >
              <option value="">Laptop: All</option>
              <option value="Yes">Laptop: Yes</option>
              <option value="No">Laptop: No</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-2.5 rounded-xl outline-none focus:border-purple-500"
            >
              <option value="">All Statuses</option>
              {['Submitted', 'Under Review', 'Accepted', 'Waitlisted', 'Rejected'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-2.5 rounded-xl outline-none focus:border-purple-500"
            >
              <option value="">All Technologies</option>
              {TECHNOLOGIES_LIST.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs py-2.5 px-2.5 rounded-xl outline-none focus:border-purple-500"
            >
              <option value="">All Interests</option>
              {INTEREST_AREAS_LIST.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>

            {/* Date Filter Dropdown */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-purple-300 font-semibold text-xs py-2.5 px-2.5 rounded-xl outline-none focus:border-purple-500"
            >
              <option value="all">Date: All Time</option>
              <option value="today">Date: Today</option>
              <option value="yesterday">Date: Yesterday</option>
              <option value="7days">Date: Last 7 Days</option>
              <option value="30days">Date: Last 30 Days</option>
              <option value="custom">Date: Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range Picker inputs if selected */}
          {dateFilter === 'custom' && (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-700/60 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> Custom Range:
              </span>
              <div className="flex items-center gap-2">
                <label className="text-slate-400">From:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-400">To:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bulk Action Bar (Visible when items are selected) */}
        {selectedIds.length > 0 && (
          <div className="bg-purple-950/80 border border-purple-800/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-bold text-white">
                {selectedIds.length} application(s) selected
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-purple-300 font-semibold">Bulk Actions:</span>
              <button
                onClick={() => setBulkModal({ open: true, targetStatus: 'Under Review' })}
                className="bg-amber-950 text-amber-300 border border-amber-800/80 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-amber-900 transition-colors"
              >
                Mark Under Review
              </button>
              <button
                onClick={() => setBulkModal({ open: true, targetStatus: 'Accepted' })}
                className="bg-emerald-950 text-emerald-300 border border-emerald-800/80 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-900 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => setBulkModal({ open: true, targetStatus: 'Waitlisted' })}
                className="bg-purple-900 text-purple-200 border border-purple-700 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-purple-800 transition-colors"
              >
                Waitlist
              </button>
              <button
                onClick={() => setBulkModal({ open: true, targetStatus: 'Rejected' })}
                className="bg-rose-950 text-rose-300 border border-rose-800/80 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-rose-900 transition-colors"
              >
                Reject
              </button>
              
              {/* Bulk Delete Button */}
              <button
                onClick={confirmBulkDelete}
                className="bg-red-700 hover:bg-red-600 text-white border border-red-500 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-400 hover:text-white underline ml-2"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* Applications Data Container */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Applications Record</span>
                <span className="bg-purple-950 text-purple-300 border border-purple-800 text-xs px-2.5 py-0.5 rounded-full font-mono">
                  {filteredApplications.length} records found
                </span>
              </h2>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Show per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 rounded-lg outline-none font-semibold"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Desktop Data Table Container (≥1024px) */}
          <div className="hidden lg:block w-full overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4 w-10 text-center">
                    <button
                      onClick={toggleSelectAllVisible}
                      title="Select all on this page"
                      className="text-slate-400 hover:text-white"
                    >
                      {isAllVisibleSelected ? (
                        <CheckSquare className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4 font-mono">Ref Code</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-white"
                    onClick={() => toggleSort('full_name')}
                  >
                    Full Name {sortField === 'full_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-3.5 px-4">University ID</th>
                  <th className="py-3.5 px-4">Email / Phone</th>
                  <th className="py-3.5 px-4">Faculty</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-white"
                    onClick={() => toggleSort('academic_year')}
                  >
                    Year {sortField === 'academic_year' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-white"
                    onClick={() => toggleSort('programming_level')}
                  >
                    Level {sortField === 'programming_level' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-3.5 px-4">Laptop</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-white"
                    onClick={() => toggleSort('status')}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-white"
                    onClick={() => toggleSort('submitted_at')}
                  >
                    Submitted At {sortField === 'submitted_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {loading ? (
                  // Skeleton loader rows
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td colSpan={12} className="py-4 px-4">
                        <div className="h-4 bg-slate-750 rounded-xs w-full" />
                      </td>
                    </tr>
                  ))
                ) : paginatedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-400">
                          <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-white">No Applications Found</h3>
                        <p className="text-xs text-slate-400">
                          No candidate applications match your active search or filter selection.
                        </p>
                        <button
                          onClick={handleResetFilters}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedApplications.map((app) => {
                    const isSelected = selectedIds.includes(app.id);
                    return (
                      <tr
                        key={app.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-purple-950/30' : 'hover:bg-slate-750/50'
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => toggleSelectOne(app.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-purple-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-purple-300 font-bold whitespace-nowrap">
                          {app.application_code || app.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white max-w-[200px] truncate" title={app.full_name}>
                          {app.full_name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{app.university_id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-200 max-w-[180px] truncate" title={app.university_email}>
                            {app.university_email}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{app.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-[160px] truncate" title={app.faculty}>
                          {app.faculty}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">{app.academic_year}</td>
                        <td className="py-3.5 px-4 font-semibold whitespace-nowrap">{app.programming_level}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              app.has_laptop === 'Yes'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {app.has_laptop}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(app.submitted_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="bg-slate-700 hover:bg-slate-600 text-purple-300 font-semibold px-2.5 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 border border-slate-600/60"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          
                          <button
                            onClick={() => confirmSingleDelete(app)}
                            title="Delete application"
                            className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 p-1.5 rounded-lg transition-colors inline-flex items-center border border-rose-800/80"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card Layout (<1024px) */}
          <div className="block lg:hidden divide-y divide-slate-700/60">
            {loading ? (
              <div className="p-8 text-center text-slate-400 animate-pulse">Loading candidate list...</div>
            ) : paginatedApplications.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <h3 className="text-base font-bold text-white">No Applications Found</h3>
                <p className="text-xs text-slate-400">
                  No candidate applications match your search or filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              paginatedApplications.map((app) => {
                const isSelected = selectedIds.includes(app.id);
                return (
                  <div
                    key={app.id}
                    className={`p-4 space-y-3 ${
                      isSelected ? 'bg-purple-950/30' : 'hover:bg-slate-750/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSelectOne(app.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <span className="font-mono text-xs font-bold text-purple-300">
                          {app.application_code || app.id}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{app.full_name}</h4>
                      <p className="text-xs text-slate-400">
                        {app.faculty} • {app.academic_year}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <div>
                        <span className="text-slate-400">ID:</span>{' '}
                        <span className="font-mono text-slate-200">{app.university_id}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Level:</span>{' '}
                        <span className="text-slate-200">{app.programming_level}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Phone:</span>{' '}
                        <span className="font-mono text-slate-200">{app.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Laptop:</span>{' '}
                        <span
                          className={app.has_laptop === 'Yes' ? 'text-emerald-400' : 'text-rose-400'}
                        >
                          {app.has_laptop}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">
                        {new Date(app.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => confirmSingleDelete(app)}
                          className="bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-rose-800/80"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="bg-slate-700 hover:bg-slate-600 text-purple-300 text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1 border border-slate-600/60"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Server-Friendly Pagination Footer */}
          <div className="px-6 py-4 bg-slate-900/80 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Showing{' '}
              <span className="font-bold text-slate-200 font-mono">
                {filteredApplications.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-slate-200 font-mono">
                {Math.min(currentPage * pageSize, filteredApplications.length)}
              </span>{' '}
              of <span className="font-bold text-slate-200 font-mono">{filteredApplications.length}</span>{' '}
              applications
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 border border-slate-700"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs font-mono font-bold text-purple-300 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 border border-slate-700"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal (Single or Bulk) */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">
                {deleteModal.isBulk ? 'Confirm Bulk Deletion' : 'Delete Application'}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {deleteModal.isBulk ? (
                <>
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-rose-400 font-mono">{selectedIds.length}</strong> selected
                  application(s)? This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete application{' '}
                  <strong className="text-purple-300 font-mono">{deleteModal.appCode}</strong> for candidate{' '}
                  <strong className="text-white">{deleteModal.name}</strong>?
                </>
              )}
            </p>

            <div className="bg-rose-950/80 border border-rose-800/80 p-3 rounded-xl text-[11px] text-rose-200">
              <strong>Warning:</strong> Deleting an application removes all associated student details and history logs permanently.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModal({ open: false })}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="bg-rose-600 hover:bg-rose-500 text-xs font-bold px-4 py-2 rounded-xl text-white shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Status Action Confirmation Modal */}
      {bulkModal.open && bulkModal.targetStatus && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">
                Confirm Bulk Status Change
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to change the status of{' '}
              <strong className="text-purple-300 font-mono">{selectedIds.length}</strong> selected
              application(s) to{' '}
              <strong className="text-white bg-purple-950 border border-purple-800 px-2 py-0.5 rounded-md">
                {bulkModal.targetStatus}
              </strong>
              ?
            </p>

            {bulkModal.targetStatus === 'Rejected' && (
              <div className="bg-rose-950/80 border border-rose-800/80 p-3 rounded-xl text-[11px] text-rose-200">
                <strong>Warning:</strong> You are setting these applications to Rejected. This status will be logged in audit history.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setBulkModal({ open: false, targetStatus: null })}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkStatusApply}
                className={`text-xs font-bold px-4 py-2 rounded-xl text-white shadow-md ${
                  bulkModal.targetStatus === 'Rejected'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-purple-600 hover:bg-purple-500'
                }`}
              >
                Confirm Update ({selectedIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Applicant Profile Modal & Edit Mode Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-700/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950 border border-purple-800 px-2.5 py-0.5 rounded-md">
                    Ref: {selectedApp.application_code || selectedApp.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                      selectedApp.status
                    )}`}
                  >
                    {selectedApp.status}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mt-1.5">{selectedApp.full_name}</h2>
                <p className="text-xs text-slate-400">
                  {selectedApp.faculty} • {selectedApp.academic_year}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                    isEditing
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-slate-700 hover:bg-slate-600 text-purple-300 border-slate-600'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" /> {isEditing ? 'Cancel Edit' : 'Edit Details'}
                </button>

                <button
                  onClick={() => confirmSingleDelete(selectedApp)}
                  className="bg-rose-950 hover:bg-rose-900 text-rose-300 p-1.5 rounded-xl border border-rose-800/80"
                  title="Delete this application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-900 border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Status Control Bar */}
            <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Manage Application Status:
              </span>
              <div className="flex flex-wrap gap-2">
                {(['Submitted', 'Under Review', 'Accepted', 'Waitlisted', 'Rejected'] as ApplicationStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedApp.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedApp.status === st
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-105'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* If in Edit Mode: Edit Form */}
            {isEditing ? (
              <div className="bg-slate-900/90 border border-amber-500/40 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4" /> Edit Candidate Record
                  </h3>
                  <span className="text-[11px] text-slate-400">Admin Editing Mode</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Full Name:</label>
                    <input
                      type="text"
                      value={editFormData.full_name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">University ID:</label>
                    <input
                      type="text"
                      value={editFormData.university_id || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, university_id: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">University Email:</label>
                    <input
                      type="email"
                      value={editFormData.university_email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, university_email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Phone / WhatsApp:</label>
                    <input
                      type="text"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Faculty:</label>
                    <select
                      value={editFormData.faculty || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, faculty: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500"
                    >
                      {FACULTIES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Academic Year:</label>
                    <select
                      value={editFormData.academic_year || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, academic_year: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500"
                    >
                      {ACADEMIC_YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Programming Level:</label>
                    <select
                      value={editFormData.programming_level || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, programming_level: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500"
                    >
                      {PROGRAMMING_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Mandatory Laptop:</label>
                    <select
                      value={editFormData.has_laptop || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, has_laptop: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">GitHub Profile URL:</label>
                    <input
                      type="url"
                      value={editFormData.github_url || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, github_url: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Project Description:</label>
                    <textarea
                      rows={2}
                      value={editFormData.project_description || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, project_description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Why Interested Statement:</label>
                    <textarea
                      rows={2}
                      value={editFormData.interest_reason || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, interest_reason: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    Cancel Edit
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Section 1: Student Information */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 border-b border-slate-700/60 pb-1.5 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-purple-400" /> Student Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50">
                      <span className="text-slate-400">University ID:</span>
                      <div className="font-semibold text-slate-100 font-mono mt-0.5">{selectedApp.university_id}</div>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50">
                      <span className="text-slate-400">University Email:</span>
                      <div className="font-semibold text-slate-100 mt-0.5">{selectedApp.university_email}</div>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50">
                      <span className="text-slate-400">Phone / WhatsApp:</span>
                      <div className="font-semibold text-slate-100 font-mono mt-0.5">{selectedApp.phone}</div>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50">
                      <span className="text-slate-400">Faculty:</span>
                      <div className="font-semibold text-slate-100 mt-0.5">{selectedApp.faculty}</div>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50">
                      <span className="text-slate-400">Academic Year:</span>
                      <div className="font-semibold text-slate-100 mt-0.5">{selectedApp.academic_year}</div>
                    </div>
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50">
                      <span className="text-slate-400">Mandatory Laptop Availability:</span>
                      <div
                        className={`font-bold mt-0.5 ${
                          selectedApp.has_laptop === 'Yes' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {selectedApp.has_laptop}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Technical Background */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 border-b border-slate-700/60 pb-1.5 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" /> Technical Background
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50">
                        <span className="text-slate-400">Programming Level:</span>
                        <div className="font-semibold text-slate-100 mt-0.5">{selectedApp.programming_level}</div>
                      </div>
                      <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50">
                        <span className="text-slate-400">Web Experience:</span>
                        <div className="font-semibold text-slate-100 mt-0.5">{selectedApp.web_development_experience}</div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 space-y-1">
                      <span className="text-slate-400">Technologies Used:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Array.isArray(selectedApp.technologies) &&
                          selectedApp.technologies.map((t) => (
                            <span key={t} className="bg-slate-700 text-purple-200 text-[11px] px-2.5 py-0.5 rounded-md font-medium">
                              {t}
                            </span>
                          ))}
                        {selectedApp.other_technologies && (
                          <span className="bg-slate-700 text-purple-200 text-[11px] px-2.5 py-0.5 rounded-md font-medium">
                            Other: {selectedApp.other_technologies}
                          </span>
                        )}
                      </div>
                    </div>

                    {selectedApp.project_description && (
                      <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 space-y-1">
                        <span className="text-slate-400">Project Description:</span>
                        <p className="text-slate-200 leading-relaxed mt-1">{selectedApp.project_description}</p>
                      </div>
                    )}

                    {selectedApp.github_url && (
                      <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-slate-400">GitHub Profile:</span>
                        <div className="mt-1">
                          <a
                            href={selectedApp.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-400 hover:underline font-mono"
                          >
                            {selectedApp.github_url}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Interests & Motivation */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 border-b border-slate-700/60 pb-1.5">
                    Interests & Motivation
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 space-y-1">
                      <span className="text-slate-400">Why Interested:</span>
                      <p className="text-slate-200 leading-relaxed mt-1">{selectedApp.interest_reason}</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 space-y-1">
                      <span className="text-slate-400">Selected Areas of Interest:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Array.isArray(selectedApp.interest_areas) &&
                          selectedApp.interest_areas.map((a) => (
                            <span
                              key={a}
                              className="bg-purple-950 text-purple-300 border border-purple-800 text-[11px] px-2.5 py-0.5 rounded-md"
                            >
                              {a}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Status History Timeline */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 border-b border-slate-700/60 pb-1.5 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-purple-400" /> Status Transition History
                  </h3>
                  {historyLoading ? (
                    <div className="text-xs text-slate-400 py-2">Loading audit history...</div>
                  ) : statusHistory.length === 0 ? (
                    <div className="text-xs text-slate-500 py-2">No previous status history logged.</div>
                  ) : (
                    <div className="space-y-2 font-xs">
                      {statusHistory.map((h) => (
                        <div
                          key={h.id}
                          className="bg-slate-900/80 border border-slate-700/60 p-3 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">{h.old_status}</span>
                            <span className="text-purple-400 font-bold">→</span>
                            <span className="font-bold text-white bg-purple-950 px-2 py-0.5 rounded-md border border-purple-800">
                              {h.new_status}
                            </span>
                          </div>
                          <div className="text-right text-[11px]">
                            <div className="text-slate-400">Changed by {h.changed_by}</div>
                            <div className="text-slate-500">
                              {new Date(h.changed_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-500">
              <span>Submitted: {new Date(selectedApp.submitted_at).toLocaleString()}</span>
              <button
                onClick={() => setSelectedApp(null)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
