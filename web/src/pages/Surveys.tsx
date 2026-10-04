import { useState, memo } from "react";
import {
  Compass,
  Plus,
  MapPin,
  Calendar,
  User,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  X,
} from "lucide-react";
import {
  useSurveys,
  useCreateSurvey,
  useSurveyImages,
  useUploadSurveyImage,
  type Survey,
} from "../api/surveys";
import { Skeleton } from "../components/common/Skeleton";

interface SurveyRowProps {
  survey: Survey;
  onSelect: (survey: Survey) => void;
}

const SurveyRow = memo(function SurveyRow({ survey, onSelect }: SurveyRowProps) {
  return (
    <div
      onClick={() => onSelect(survey)}
      className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h3 className="font-semibold text-slate-900 text-base">{survey.title}</h3>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              survey.status === "completed"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : survey.status === "in_progress"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-slate-100 text-slate-600"
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
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
            {survey.image_count} photos
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-teal-700 hover:text-teal-800 text-sm font-semibold flex items-center gap-1">
          <span>Manage</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

export function Surveys() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);

  // New survey form state
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newSurveyor, setNewSurveyor] = useState("");
  const [newLat, setNewLat] = useState("14.5995");
  const [newLng, setNewLng] = useState("120.9842");
  const [newDesc, setNewDesc] = useState("");

  const { data: surveysData, isLoading } = useSurveys(page, 20);
  const createMutation = useCreateSurvey();

  // Active survey images & upload
  const { data: activeImages, isLoading: imagesLoading } = useSurveyImages(activeSurvey?.id || null);
  const uploadImageMutation = useUploadSurveyImage();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await createMutation.mutateAsync({
        title: newTitle.trim(),
        location_name: newLocation.trim() || undefined,
        surveyor_name: newSurveyor.trim() || undefined,
        center_latitude: newLat ? parseFloat(newLat) : undefined,
        center_longitude: newLng ? parseFloat(newLng) : undefined,
        description: newDesc.trim() || undefined,
      });
      setIsCreateOpen(false);
      setNewTitle("");
      setNewLocation("");
      setNewDesc("");
      setActiveSurvey(created);
    } catch (err) {
      console.error("Create survey failed", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeSurvey || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      await uploadImageMutation.mutateAsync({
        surveyId: activeSurvey.id,
        file,
        latitude: activeSurvey.center_latitude || undefined,
        longitude: activeSurvey.center_longitude || undefined,
      });
    } catch (err) {
      console.error("Upload image failed", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1">
            <Compass className="w-4 h-4" />
            <span>Field Management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Field Surveys &amp; Transects
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize quadrat photography, GPS transects, and meadow assessment sessions.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Survey Session</span>
        </button>
      </div>

      {/* Survey List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-slate-100 p-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        ) : surveysData && surveysData.items.length > 0 ? (
          <>
            <div className="divide-y divide-slate-100">
              {surveysData.items.map((survey) => (
                <SurveyRow key={survey.id} survey={survey} onSelect={setActiveSurvey} />
              ))}
            </div>

            {/* Pagination Controls */}
            {surveysData.total > pageSize && (
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div>
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {(page - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-900">
                    {Math.min(page * pageSize, surveysData.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">{surveysData.total}</span> surveys
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Previous
                  </button>
                  <span className="px-2 font-medium text-slate-700">
                    Page {page} of {Math.ceil(surveysData.total / pageSize)}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(Math.ceil(surveysData.total / pageSize), p + 1)
                      )
                    }
                    disabled={page >= Math.ceil(surveysData.total / pageSize)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 text-base">No Surveys Created Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Create your first survey session to start uploading quadrat imagery and logging meadow coordinates.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white font-medium text-xs hover:bg-teal-700"
            >
              Create First Survey
            </button>
          </div>
        )}
      </div>

      {/* Survey Detail / Manage Modal */}
      {activeSurvey && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                  Survey Details
                </span>
                <h2 className="text-xl font-bold text-slate-900">{activeSurvey.title}</h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  {activeSurvey.location_name || "Coastline"} • Status: {activeSurvey.status}
                </div>
              </div>
              <button
                onClick={() => setActiveSurvey(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Photo Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-800">
                    Quadrat Photos ({activeImages?.length || 0})
                  </span>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium text-xs transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Quadrat Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagesLoading ? (
                  <div className="text-xs text-slate-400 py-4 text-center">Loading images...</div>
                ) : activeImages && activeImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activeImages.map((img) => (
                      <div
                        key={img.id}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                      >
                        {img.url ? (
                          <img
                            src={img.url}
                            alt={img.filename}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-[10px] text-white truncate font-medium">
                            {img.filename}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
                    No quadrat photos uploaded for this survey yet. Click &ldquo;Upload Quadrat Photo&rdquo; to add field imagery.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setActiveSurvey(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Survey Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-lg text-slate-900">New Field Survey Session</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Survey Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bolinao Reef Flat Survey - Transect A"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bolinao, Pangasinan"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Surveyor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marine Field Team"
                  value={newSurveyor}
                  onChange={(e) => setNewSurveyor(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Field conditions, weather, tidal phase..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-50"
                >
                  {createMutation.isPending ? "Creating..." : "Save Survey"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
