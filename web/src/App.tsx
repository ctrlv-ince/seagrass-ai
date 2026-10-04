import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";

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
        <BrowserRouter>
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

            {/* Catch-all redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
