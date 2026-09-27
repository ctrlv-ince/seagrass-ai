import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Surveys } from "./pages/Surveys";
import { Detection } from "./pages/Detection";
import { WaveModel } from "./pages/WaveModel";
import { MapView } from "./pages/MapView";

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
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/detection" element={<Detection />} />
            <Route path="/wave-model" element={<WaveModel />} />
            <Route path="/map" element={<MapView />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
