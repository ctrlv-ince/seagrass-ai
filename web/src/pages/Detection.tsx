import { useState, useRef } from "react";
import {
  UploadCloud,
  Sparkles,
  ShieldCheck,
  Activity,
  Layers,
  FileImage,
  RefreshCw,
  Eye,
  Info,
} from "lucide-react";
import { useAnalyzeImage, type DetectionResult } from "../api/detections";
import { useSurveys } from "../api/surveys";

// Demo sample generators for testing when user has not yet uploaded custom photos
const DEMO_SAMPLES = [
  {
    name: "Enhalus acoroides Quadrat",
    species: "Enhalus acoroides",
    color: "#166534",
    coverage: 68.5,
    bladeLength: 42,
    density: 280,
  },
  {
    name: "Thalassia hemprichii Quadrat",
    species: "Thalassia hemprichii",
    color: "#15803d",
    coverage: 54.2,
    bladeLength: 22,
    density: 390,
  },
  {
    name: "Halodule pinifolia Quadrat",
    species: "Halodule pinifolia",
    color: "#22c55e",
    coverage: 46.8,
    bladeLength: 12,
    density: 640,
  },
];

export function Detection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<DetectionResult | null>(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>("");
  const [showBoxes, setShowBoxes] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeMutation = useAnalyzeImage();
  const { data: surveysData } = useSurveys(1, 50);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setActiveAnalysis(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setActiveAnalysis(null);
    }
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;
    try {
      const res = await analyzeMutation.mutateAsync({
        file: selectedFile,
        surveyId: selectedSurveyId || undefined,
        waterDepthM: 1.5,
        waveHeightM: 0.8,
        wavePeriodS: 4.5,
        meadowWidthM: 50.0,
      });
      setActiveAnalysis(res);
    } catch (err) {
      console.error("Analysis failed", err);
    }
  };

  // Generate a test mock canvas file for instant preview
  const handleLoadDemoSample = (sample: typeof DEMO_SAMPLES[0]) => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Background sand / water tint
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(0, 0, 640, 480);
      // Draw seagrass vegetation patches
      ctx.fillStyle = sample.color;
      for (let i = 0; i < 40; i++) {
        const x = (i * 37) % 580 + 20;
        const y = (i * 47) % 400 + 30;
        const w = 15 + (i % 25);
        const h = 40 + (i % 80);
        ctx.beginPath();
        ctx.ellipse(x, y, w, h, (i * 0.1), 0, 2 * Math.PI);
        ctx.fill();
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${sample.species.toLowerCase().replace(" ", "_")}.jpg`, {
            type: "image/jpeg",
          });
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
          setActiveAnalysis(null);
        }
      }, "image/jpeg");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1">
            <Layers className="w-4 h-4" />
            <span>AI Quadrat Scanner</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Seagrass Analysis &amp; Wave Damping Extraction
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Extract species, coverage %, blade morphometrics, and coupled hydrodynamic wave attenuation.
          </p>
        </div>

        {selectedFile && (
          <button
            onClick={runAnalysis}
            disabled={analyzeMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${analyzeMutation.isPending ? "animate-spin" : ""}`} />
            {analyzeMutation.isPending ? "Scanning Quadrat..." : "Run AI Scan"}
          </button>
        )}
      </div>

      {/* Main Grid: Upload/Preview (Left) & Extracted Specs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Dropzone & Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-slate-900">Quadrat Image</span>
              {previewUrl && (
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setShowBoxes(!showBoxes)}
                    className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                      showBoxes
                        ? "bg-teal-50 border-teal-200 text-teal-700"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showBoxes ? "Boxes Visible" : "Boxes Hidden"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setActiveAnalysis(null);
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Dropzone */}
            {!previewUrl ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/20"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="font-medium text-slate-800 text-sm">
                  Click or drag a seagrass quadrat photo here
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Supports JPEG, PNG, WebP from field camera or smartphone
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              /* Image Preview with Bounding Box Overlay */
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-4/3 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Quadrat scan preview"
                  className="w-full h-full object-contain"
                />

                {/* Overlaid bounding boxes */}
                {showBoxes && activeAnalysis?.detections && (
                  <div className="absolute inset-0 pointer-events-none">
                    {activeAnalysis.detections.map((det) => {
                      const top = `${det.bbox.y_min * 100}%`;
                      const left = `${det.bbox.x_min * 100}%`;
                      const width = `${(det.bbox.x_max - det.bbox.x_min) * 100}%`;
                      const height = `${(det.bbox.y_max - det.bbox.y_min) * 100}%`;

                      return (
                        <div
                          key={det.id}
                          className="absolute border-2 border-teal-400 bg-teal-500/10 rounded-sm transition-all"
                          style={{ top, left, width, height }}
                        >
                          <div className="absolute -top-6 left-0 bg-teal-800 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                            {det.class_name} ({Math.round(det.confidence * 100)}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Quick Demo Sample Selector */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Or test with sample quadrat:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_SAMPLES.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => handleLoadDemoSample(s)}
                    className="p-2 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 text-xs transition-colors"
                  >
                    <div className="font-semibold text-slate-800 truncate">{s.name.split(" ")[0]}</div>
                    <div className="text-[10px] text-teal-700 italic truncate">{s.species}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Link to Survey Option */}
            {surveysData && surveysData.items.length > 0 && (
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <span className="text-xs text-slate-500 whitespace-nowrap">Attach to survey:</span>
                <select
                  value={selectedSurveyId}
                  onChange={(e) => setSelectedSurveyId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:outline-teal-500"
                >
                  <option value="">None (Quick standalone scan)</option>
                  {surveysData.items.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.location_name || "Unspecified location"})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Extraction Specs & Wave Impact (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {activeAnalysis ? (
            <>
              {/* Species & Morphometrics Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Extracted Seagrass Specifications</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      {activeAnalysis.specifications.primary_species}
                    </h2>
                    <div className="text-xs text-slate-500 italic">
                      {activeAnalysis.specifications.common_name}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold text-xs">
                    {Math.round(activeAnalysis.specifications.confidence * 100)}% Conf
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Meadow Coverage
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                      {activeAnalysis.specifications.coverage_percent}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Blade Length
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                      {activeAnalysis.specifications.blade_length_cm} cm
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Shoot Density
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                      {activeAnalysis.specifications.shoot_density_m2} /m²
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupled Wave Attenuation Impact Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Coupled Coastal Wave Impact</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Mendez &amp; Losada (2004)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/70">
                    <div className="flex items-center gap-1.5 text-xs text-teal-800 font-medium">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      <span>Energy Damping</span>
                    </div>
                    <div className="text-2xl font-bold text-teal-900 mt-1">
                      -{activeAnalysis.wave_attenuation.wave_energy_damping_pct.toFixed(1)}%
                    </div>
                    <div className="text-[11px] text-teal-700/80 mt-0.5">
                      Dissipated before shoreline
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-200/70">
                    <div className="flex items-center gap-1.5 text-xs text-cyan-800 font-medium">
                      <Activity className="w-4 h-4 text-cyan-600" />
                      <span>Height Reduction</span>
                    </div>
                    <div className="text-2xl font-bold text-cyan-900 mt-1">
                      -{activeAnalysis.wave_attenuation.wave_height_reduction_pct.toFixed(1)}%
                    </div>
                    <div className="text-[11px] text-cyan-700/80 mt-0.5">
                      From {activeAnalysis.wave_attenuation.incident_wave_height_m}m to{" "}
                      {activeAnalysis.wave_attenuation.transmitted_wave_height_m}m
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    Measured at 50m cross-shore meadow width in 1.5m shallow water column with 0.8m incident wave.
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FileImage className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base">No Quadrat Scanned Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Upload a field quadrat photo on the left or select a sample quadrat to extract seagrass specs and wave attenuation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
