import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/ui/Toast";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { Layout } from "./components/layout/Layout";
import { CommandPalette } from "./components/common/CommandPalette";

import { lazy, Suspense } from "react";
import { PageSkeleton } from "./components/common/Skeleton";

// Public Pages (Lazy)
const Landing = lazy(() => import("./pages/Landing").then((m) => ({ default: m.Landing })));
const Login = lazy(() => import("./pages/Login").then((m) => ({ default: m.Login })));
const Register = lazy(() => import("./pages/Register").then((m) => ({ default: m.Register })));

// Protected Platform Pages (Lazy)
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Surveys = lazy(() => import("./pages/Surveys").then((m) => ({ default: m.Surveys })));
const SurveyDetail = lazy(() => import("./pages/SurveyDetail").then((m) => ({ default: m.SurveyDetail })));
const Detection = lazy(() => import("./pages/Detection").then((m) => ({ default: m.Detection })));
const WaveModel = lazy(() => import("./pages/WaveModel").then((m) => ({ default: m.WaveModel })));
const MapView = lazy(() => import("./pages/MapView").then((m) => ({ default: m.MapView })));
const Species = lazy(() => import("./pages/Species").then((m) => ({ default: m.Species })));
const Settings = lazy(() => import("./pages/Settings").then((m) => ({ default: m.Settings })));

// Admin Portal Pages (Lazy)
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const UserManagement = lazy(() => import("./pages/admin/UserManagement").then((m) => ({ default: m.UserManagement })));
const SurveyAdmin = lazy(() => import("./pages/admin/SurveyAdmin").then((m) => ({ default: m.SurveyAdmin })));
const SpeciesAdmin = lazy(() => import("./pages/admin/SpeciesAdmin").then((m) => ({ default: m.SpeciesAdmin })));
const SystemSettings = lazy(() => import("./pages/admin/SystemSettings").then((m) => ({ default: m.SystemSettings })));
const AdminReports = lazy(() => import("./pages/admin/AdminReports").then((m) => ({ default: m.AdminReports })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
          <BrowserRouter>
            <CommandPalette />
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
              {/* Public Marketing & Auth Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Marine Telemetry Routes (With Sidebar Layout) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/surveys"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Surveys />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/surveys/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SurveyDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/detection"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Detection />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wave-model"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <WaveModel />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MapView />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/species"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Species />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Portal Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <Layout>
                      <UserManagement />
                    </Layout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/surveys"
                element={
                  <AdminRoute>
                    <Layout>
                      <SurveyAdmin />
                    </Layout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/species"
                element={
                  <AdminRoute>
                    <Layout>
                      <SpeciesAdmin />
                    </Layout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/system"
                element={
                  <AdminRoute>
                    <Layout>
                      <SystemSettings />
                    </Layout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminRoute>
                    <Layout>
                      <AdminReports />
                    </Layout>
                  </AdminRoute>
                }
              />

              {/* Catch-all redirect to landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
