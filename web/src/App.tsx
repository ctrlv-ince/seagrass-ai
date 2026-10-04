import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";

// Public Pages
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

// Protected Platform Pages
import { Dashboard } from "./pages/Dashboard";
import { Surveys } from "./pages/Surveys";
import { SurveyDetail } from "./pages/SurveyDetail";
import { Detection } from "./pages/Detection";
import { WaveModel } from "./pages/WaveModel";
import { MapView } from "./pages/MapView";
import { Species } from "./pages/Species";
import { Settings } from "./pages/Settings";

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
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
