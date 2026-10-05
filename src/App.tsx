import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Web Development Journey Pages
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const RegistrationPage = lazy(() => import('./pages/public/RegistrationPage'));
const SuccessPage = lazy(() => import('./pages/public/SuccessPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-700 flex items-center justify-center text-white font-black animate-pulse">
          IEEE
        </div>
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Loading Web Development Journey...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Landing & Registration */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
