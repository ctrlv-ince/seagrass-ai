import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Image as ImageIcon,
  UploadCloud,
  Waves,
  ShieldCheck,
} from "lucide-react";
import {
  useSurvey,
  useSurveyImages,
  useSurveyTransects,
  useUploadSurveyImage,
} from "../api/surveys";
import { usePredictWaveAttenuation, useSurveyPredictions } from "../api/predictions";

export function SurveyDetail() {
  const { id } = useParams<{ id: string }>();
  const surveyId = id || null;

  const { data: survey, isLoading: surveyLoading } = useSurvey(surveyId);
  const { data: images, isLoading: imagesLoading } = useSurveyImages(surveyId);
  const { data: transects } = useSurveyTransects(surveyId);
  const { data: predictions, refetch: refetchPredictions } = useSurveyPredictions(surveyId);

  const uploadMutation = useUploadSurveyImage();
  const predictMutation = usePredictWaveAttenuation();

  const [activeSimulationOpen, setActiveSimulationOpen] = useState(false);
  const [simDensity, setSimDensity] = useState(340);
  const [simBladeLength, setSimBladeLength] = useState(25);
  const [simDepth, setSimDepth] = useState(1.5);
  const [simWaveHeight, setSimWaveHeight] = useState(0.8);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!surveyId || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      await uploadMutation.mutateAsync({
        surveyId,
        file,
        latitude: survey?.center_latitude || undefined,
        longitude: survey?.center_longitude || undefined,
      });
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyId) return;
    try {
      await predictMutation.mutateAsync({
        survey_id: surveyId,
        seagrass_density: simDensity,
        blade_length_cm: simBladeLength,
        water_depth_m: simDepth,
        wave_height_m: simWaveHeight,
        wave_period_s: 4.5,
        meadow_length_m: 50.0,
      });
      await refetchPredictions();
      setActiveSimulationOpen(false);
    } catch (err) {
      console.error("Simulation run failed", err);
    }
  };

  if (surveyLoading) {
    return <div className="p-8 text-center text-slate-400 text-sm">Loading survey session...</div>;
  }

  if (!survey) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Survey Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested survey session does not exist.</p>
        <Link to="/surveys" className="text-teal-700 font-semibold text-xs hover:underline">
          Return to Surveys
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <Link
          to="/surveys"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Surveys</span>
        </Link>

        <button
          onClick={() => setActiveSimulationOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Waves className="w-4 h-4" />
          <span>Simulate Wave Damping</span>
        </button>
      </div>

      {/* Survey Title & Status Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{survey.title}</h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                survey.status === "completed"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {survey.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            {survey.location_name && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                {survey.location_name}
              </span>
            )}
            {survey.surveyor_name && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {survey.surveyor_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(survey.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {survey.description && (
          <p className="text-xs text-slate-500 max-w-md bg-slate-50 p-3 rounded-2xl border border-slate-200/60 leading-relaxed">
            {survey.description}
          </p>
        )}
      </div>

      {/* Main Grid: Quadrat Photos Gallery & Wave Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Photos Section (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-sm text-slate-900">
                Quadrat Sampling Imagery ({images?.length || 0})
              </h2>
              <span className="text-[11px] text-slate-400">Stored in Supabase Object Storage</span>
            </div>

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs transition-colors border border-teal-200">
              <UploadCloud className="w-4 h-4" />
              <span>Add Quadrat Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {imagesLoading ? (
            <div className="text-xs text-slate-400 py-8 text-center">Loading images...</div>
          ) : images && images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"
                >
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={img.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                    <span className="text-[10px] text-white truncate font-medium">{img.filename}</span>
                    <span className="text-[9px] text-teal-200 font-mono">
                      {new Date(img.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-2xl p-10 text-center text-xs text-slate-400">
              No quadrat photos uploaded for this survey session yet.
            </div>
          )}
        </div>

        {/* Right: Wave Model Predictions History (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-sm text-slate-900">Wave Attenuation Logs</h2>
              <span className="text-[11px] text-slate-400">Simulations tied to this meadow</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>

          {predictions && predictions.length > 0 ? (
            <div className="space-y-3">
              {predictions.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-800">
                      -{p.attenuation_percent.toFixed(1)}% Energy Dissipation
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Density</span>
                      <span className="font-semibold">{p.seagrass_density} /m²</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Canopy</span>
                      <span className="font-semibold">{p.blade_length_cm} cm</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Depth</span>
                      <span className="font-semibold">{p.water_depth_m} m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              No wave simulations recorded yet. Click &ldquo;Simulate Wave Damping&rdquo; above.
            </div>
          )}

          {/* Transects Section */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="font-bold text-xs text-slate-800 block">
              Field Transects ({transects?.length || 0})
            </span>
            {transects && transects.length > 0 ? (
              <div className="space-y-1.5">
                {transects.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex justify-between">
                    <span className="font-medium text-slate-800">{t.name}</span>
                    <span className="text-slate-400">{t.quadrat_count} quadrats</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 block italic">No transects mapped for this site yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* Simulation Modal */}
      {activeSimulationOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-lg text-slate-900 mb-1">Simulate Wave Attenuation</h3>
            <p className="text-xs text-slate-500 mb-4">
              Run Mendez &amp; Losada (2004) hydrodynamic physics calculation for this survey site.
            </p>

            <form onSubmit={handleRunSimulation} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Seagrass Shoot Density: {simDensity} /m²
                </label>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="10"
                  value={simDensity}
                  onChange={(e) => setSimDensity(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Canopy Blade Length: {simBladeLength} cm
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={simBladeLength}
                  onChange={(e) => setSimBladeLength(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Water Depth (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={simDepth}
                    onChange={(e) => setSimDepth(Number(e.target.value))}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Wave Height H₀ (m)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={simWaveHeight}
                    onChange={(e) => setSimWaveHeight(Number(e.target.value))}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSimulationOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={predictMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  {predictMutation.isPending ? "Calculating..." : "Compute & Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
