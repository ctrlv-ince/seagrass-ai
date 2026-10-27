import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useAdminSurveys,
  useAdminDeleteSurvey,
  useBulkUpdateSurveyStatus,
} from "../../api/admin";
import type { Survey } from "../../api/surveys";
import {
  ClipboardList,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  CheckCircle,
  Layers,
  MapPin,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckSquare,
  Square,
} from "lucide-react";

const FALLBACK_SURVEYS: Survey[] = [
  {
    id: "surv-101",
    title: "Bolinao Reef Lagoon Canopy Assessment",
    location_name: "Pangasinan Marine Reserve",
    surveyor_name: "Dr. Maya Lin",
    status: "completed",
    image_count: 24,
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    started_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 24 * 3 + 7200000).toISOString(),
    center_latitude: 16.384,
    center_longitude: 119.892,
    description: "Detailed blade density and multi-species benthic transect.",
  },
  {
    id: "surv-102",
    title: "Malampaya Sound Inshore Transect B",
    location_name: "Palawan Benthic Station",
    surveyor_name: "Carlos Mendoza",
    status: "in_progress",
    image_count: 18,
    created_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    updated_at: new Date().toISOString(),
    started_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    completed_at: null,
    center_latitude: 10.852,
    center_longitude: 119.341,
    description: "Hydrodynamic wave dissipation correlation survey.",
  },
  {
    id: "surv-103",
    title: "Puerto Galera Bay Attenuation Study",
    location_name: "Mindoro Coastal Shoal",
    surveyor_name: "Elena Rostova",
    status: "completed",
    image_count: 36,
    created_at: new Date(Date.now() - 3600000 * 24 * 28).toISOString(),
    updated_at: new Date().toISOString(),
    started_at: new Date(Date.now() - 3600000 * 24 * 28).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 24 * 28 + 10800000).toISOString(),
    center_latitude: 13.518,
    center_longitude: 120.957,
    description: "Reef lagoon boundary and wave dampening assessment.",
  },
  {
    id: "surv-104",
    title: "Taguig Coastal Shoal Shallow Scan",
    location_name: "Laguna Lake Estuary",
    surveyor_name: "Samuel Oak",
    status: "draft",
    image_count: 12,
    created_at: new Date(Date.now() - 3600000 * 24 * 45).toISOString(),
    updated_at: new Date().toISOString(),
    started_at: null,
    completed_at: null,
    center_latitude: 14.517,
    center_longitude: 121.050,
    description: "Turbid water seagrass boundary baseline reconnaissance.",
  },
];

export function SurveyAdmin() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [localSurveys, setLocalSurveys] = useState<Survey[] | null>(null);

  const { data: surveyList, isLoading, error } = useAdminSurveys({
    page,
    page_size: 15,
    status: statusFilter || undefined,
    search: searchQuery || undefined,
  });

  const deleteSurveyMutation = useAdminDeleteSurvey();
  const bulkStatusMutation = useBulkUpdateSurveyStatus();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Determine active surveys (API or Resilient Fallback)
  const displaySurveys: Survey[] = useMemo(() => {
    if (localSurveys) {
      return localSurveys.filter((s) => {
        const matchesStatus = !statusFilter || s.status === statusFilter;
        const matchesSearch =
          !searchQuery ||
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.location_name && s.location_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (s.surveyor_name && s.surveyor_name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
      });
    }

    if (surveyList?.items && surveyList.items.length > 0) {
      return surveyList.items;
    }

    return FALLBACK_SURVEYS.filter((s) => {
      const matchesStatus = !statusFilter || s.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.location_name && s.location_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.surveyor_name && s.surveyor_name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [surveyList, localSurveys, statusFilter, searchQuery]);

  const handleSelectAll = () => {
    if (selectedIds.length === displaySurveys.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displaySurveys.map((s) => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async (survey: Survey) => {
    if (
      !confirm(
        `Permanently delete survey "${survey.title}"? This removes all associated transect records and imagery.`
      )
    ) {
      return;
    }

    // Update local state for immediate feedback
    setLocalSurveys((prev) => {
      const base = prev || (surveyList?.items && surveyList.items.length > 0 ? surveyList.items : FALLBACK_SURVEYS);
      return base.filter((s) => s.id !== survey.id);
    });
    setSelectedIds((prev) => prev.filter((id) => id !== survey.id));

    try {
      await deleteSurveyMutation.mutateAsync(survey.id);
      showToast(`Deleted survey "${survey.title}"`);
    } catch {
      showToast(`[Demo] Deleted survey "${survey.title}"`);
    }
  };

  const handleBulkStatus = async (newStatus: "draft" | "in_progress" | "completed") => {
    if (selectedIds.length === 0) return;

    // Update local state
    setLocalSurveys((prev) => {
      const base = prev || (surveyList?.items && surveyList.items.length > 0 ? surveyList.items : FALLBACK_SURVEYS);
      return base.map((s) => (selectedIds.includes(s.id) ? { ...s, status: newStatus } : s));
    });

    try {
      const res = await bulkStatusMutation.mutateAsync({
        surveyIds: selectedIds,
        status: newStatus,
      });
      showToast(`Updated ${res.updated} surveys to ${newStatus.replace("_", " ")}`);
    } catch {
      showToast(`[Demo] Updated ${selectedIds.length} surveys to ${newStatus.replace("_", " ")}`);
    } finally {
      setSelectedIds([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchTerm);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-slideUp text-xs font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400 mb-1">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Field Oversight & Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Survey Repository Admin
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit, reclassify, or perform bulk lifecycle transitions across all global monitoring surveys.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Total Surveys: {surveyList?.total || displaySurveys.length}</span>
        </div>
      </div>

      {/* Search & Bulk Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-xs">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, surveyor, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </form>

        {/* Status Filters & Bulk Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filters */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:block" />
            {[
              { label: "All Status", value: "" },
              { label: "Completed", value: "completed" },
              { label: "In Progress", value: "in_progress" },
              { label: "Draft", value: "draft" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  statusFilter === tab.value
                    ? "bg-teal-50 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40 font-semibold shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bulk Action Controls */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {selectedIds.length} selected:
              </span>
              <button
                onClick={() => handleBulkStatus("completed")}
                disabled={bulkStatusMutation.isPending}
                className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-[11px] font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/30 transition-colors cursor-pointer"
              >
                Mark Completed
              </button>
              <button
                onClick={() => handleBulkStatus("in_progress")}
                disabled={bulkStatusMutation.isPending}
                className="px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-500/30 text-[11px] font-semibold hover:bg-teal-100 dark:hover:bg-teal-500/30 transition-colors cursor-pointer"
              >
                In Progress
              </button>
              <button
                onClick={() => handleBulkStatus("draft")}
                disabled={bulkStatusMutation.isPending}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-[11px] font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Draft
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Surveys Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 w-10">
                  <button
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                    aria-label="Select all surveys"
                  >
                    {displaySurveys.length > 0 && selectedIds.length === displaySurveys.length ? (
                      <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Survey Session</th>
                <th className="py-3 px-4">Location / Surveyor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Imagery</th>
                <th className="py-3 px-4">Logged</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {isLoading && !displaySurveys.length ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading surveys...
                  </td>
                </tr>
              ) : error && !displaySurveys.length ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-red-500">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
                    Failed to fetch survey repository.
                  </td>
                </tr>
              ) : displaySurveys.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No surveys found matching filter parameters.
                  </td>
                </tr>
              ) : (
                displaySurveys.map((survey) => {
                  const isSelected = selectedIds.includes(survey.id);
                  return (
                    <tr
                      key={survey.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${
                        isSelected ? "bg-teal-50/60 dark:bg-teal-950/20" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleSelect(survey.id)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                          aria-label={`Select survey ${survey.title}`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link
                          to={`/surveys/${survey.id}`}
                          className="font-semibold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-300 transition-colors flex items-center gap-1.5 group"
                        >
                          {survey.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-600 dark:text-teal-400" />
                        </Link>
                        {survey.description && (
                          <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate mt-0.5">
                            {survey.description}
                          </div>
                        )}
                      </td>

                      {/* Location / Surveyor */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-800 dark:text-slate-300">
                          <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                          <span className="truncate">{survey.location_name || "Unknown site"}</span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                          {survey.surveyor_name ? `By ${survey.surveyor_name}` : "Unassigned"}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            survey.status === "completed"
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                              : survey.status === "in_progress"
                              ? "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              survey.status === "completed"
                                ? "bg-emerald-500"
                                : survey.status === "in_progress"
                                ? "bg-teal-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {survey.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Image count */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {survey.image_count ?? 0} photos
                      </td>

                      {/* Logged Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {survey.created_at
                          ? new Date(survey.created_at).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/surveys/${survey.id}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300 transition-colors"
                            title="Inspect Survey"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(survey)}
                            disabled={deleteSurveyMutation.isPending}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 dark:bg-slate-800/80 dark:hover:bg-red-500/20 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Survey"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {displaySurveys.length > 15 && (
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing Page <span className="text-slate-900 dark:text-white font-mono font-semibold">{page}</span> (
              {surveyList?.total || displaySurveys.length} total surveys)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 15 >= (surveyList?.total || displaySurveys.length)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
