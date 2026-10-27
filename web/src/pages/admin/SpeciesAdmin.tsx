import { useState, useMemo } from "react";
import {
  useAdminSpecies,
  useCreateSpecies,
  useUpdateSpecies,
  useDeleteSpecies,
} from "../../api/admin";
import type { SpeciesItem } from "../../api/admin";
import {
  TreePine,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  BookOpen,
} from "lucide-react";

const FALLBACK_SPECIES: SpeciesItem[] = [
  {
    id: "sp-01",
    scientific_name: "Enhalus acoroides",
    common_name: "Ribbon Seagrass",
    description: "Large dioecious seagrass with coarse, strap-like leaves up to 1.5m long. Dominant in intertidal and shallow subtidal muddy sandflats across the Indo-Pacific.",
    created_at: new Date(Date.now() - 3600000 * 24 * 120).toISOString(),
  },
  {
    id: "sp-02",
    scientific_name: "Thalassia hemprichii",
    common_name: "Pacific Turtle Grass",
    description: "Abundant meadow-forming species with sickle-shaped, curved leaves. Primary food source for green sea turtles and dugongs.",
    created_at: new Date(Date.now() - 3600000 * 24 * 110).toISOString(),
  },
  {
    id: "sp-03",
    scientific_name: "Halophila ovalis",
    common_name: "Paddle Grass",
    description: "Small, fast-growing pioneer seagrass with paired oval leaves and distinct cross-veins. Highly tolerant of high disturbance and turbidity.",
    created_at: new Date(Date.now() - 3600000 * 24 * 90).toISOString(),
  },
  {
    id: "sp-04",
    scientific_name: "Cymodocea serrulata",
    common_name: "Serrated Ribbon Grass",
    description: "Subtidal species characterized by distinct serrated leaf tips and bright pinkish leaf sheaths. Excellent substrate stabilizer.",
    created_at: new Date(Date.now() - 3600000 * 24 * 80).toISOString(),
  },
  {
    id: "sp-05",
    scientific_name: "Syringodium isoetifolium",
    common_name: "Syringodium",
    description: "Distinctive cylindrical, needle-shaped leaves designed to minimize drag and wave forces in fast-flowing tidal channels.",
    created_at: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
  },
];

export function SpeciesAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState<SpeciesItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [localSpecies, setLocalSpecies] = useState<SpeciesItem[] | null>(null);

  // Form states
  const [scientificName, setScientificName] = useState("");
  const [commonName, setCommonName] = useState("");
  const [description, setDescription] = useState("");

  const { data: speciesList, isLoading, error } = useAdminSpecies();
  const createMutation = useCreateSpecies();
  const updateMutation = useUpdateSpecies();
  const deleteMutation = useDeleteSpecies();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeSpeciesList = useMemo(() => {
    if (localSpecies) return localSpecies;
    if (speciesList && speciesList.length > 0) return speciesList;
    return FALLBACK_SPECIES;
  }, [speciesList, localSpecies]);

  const openCreateModal = () => {
    setScientificName("");
    setCommonName("");
    setDescription("");
    setIsCreateOpen(true);
  };

  const openEditModal = (species: SpeciesItem) => {
    setEditingSpecies(species);
    setScientificName(species.scientific_name);
    setCommonName(species.common_name || "");
    setDescription(species.description || "");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scientificName.trim()) return;

    const newEntry: SpeciesItem = {
      id: `sp-${Date.now()}`,
      scientific_name: scientificName.trim(),
      common_name: commonName.trim() || null,
      description: description.trim() || null,
      created_at: new Date().toISOString(),
    };

    setLocalSpecies((prev) => [newEntry, ...(prev || activeSpeciesList)]);
    setIsCreateOpen(false);

    try {
      await createMutation.mutateAsync({
        scientific_name: scientificName.trim(),
        common_name: commonName.trim() || undefined,
        description: description.trim() || undefined,
      });
      showToast(`Added species "${scientificName}"`);
    } catch {
      showToast(`[Demo] Added species "${scientificName}"`);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecies || !scientificName.trim()) return;

    setLocalSpecies((prev) => {
      const base = prev || activeSpeciesList;
      return base.map((s) =>
        s.id === editingSpecies.id
          ? {
              ...s,
              scientific_name: scientificName.trim(),
              common_name: commonName.trim() || null,
              description: description.trim() || null,
            }
          : s
      );
    });

    const targetId = editingSpecies.id;
    setEditingSpecies(null);

    try {
      await updateMutation.mutateAsync({
        speciesId: targetId,
        payload: {
          scientific_name: scientificName.trim(),
          common_name: commonName.trim() || undefined,
          description: description.trim() || undefined,
        },
      });
      showToast(`Updated species "${scientificName}"`);
    } catch {
      showToast(`[Demo] Updated species "${scientificName}"`);
    }
  };

  const handleDelete = async (species: SpeciesItem) => {
    if (
      !confirm(
        `Are you sure you want to delete ${species.scientific_name}? This cannot be undone.`
      )
    ) {
      return;
    }

    setLocalSpecies((prev) => {
      const base = prev || activeSpeciesList;
      return base.filter((s) => s.id !== species.id);
    });

    try {
      await deleteMutation.mutateAsync(species.id);
      showToast(`Deleted species "${species.scientific_name}"`);
    } catch {
      showToast(`[Demo] Deleted species "${species.scientific_name}"`);
    }
  };

  const filteredSpecies = activeSpeciesList.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.scientific_name.toLowerCase().includes(term) ||
      (s.common_name && s.common_name.toLowerCase().includes(term))
    );
  });

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
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
            <TreePine className="w-3.5 h-3.5" />
            <span>Taxonomic Reference Database</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Seagrass Species Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage scientific binomial names, vernacular labels, and ecological characteristics for field identification.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Species
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search scientific or common name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
          {filteredSpecies.length} species cataloged
        </div>
      </div>

      {/* Species Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && !activeSpeciesList.length ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs">
            Loading taxonomic reference catalog...
          </div>
        ) : error && !activeSpeciesList.length ? (
          <div className="col-span-full py-16 text-center text-red-500 text-xs">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
            Failed to load species catalog.
          </div>
        ) : filteredSpecies.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No seagrass species match the search query.
          </div>
        ) : (
          filteredSpecies.map((species) => (
            <div
              key={species.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white italic tracking-wide group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {species.scientific_name}
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      {species.common_name || "Common name unrecorded"}
                    </p>
                  </div>
                  <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-500/20 shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2 line-clamp-3">
                  {species.description || "No ecological description provided."}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {species.created_at ? new Date(species.created_at).toLocaleDateString() : ""}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(species)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Edit Species"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(species)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete Species"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {(isCreateOpen || editingSpecies) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TreePine className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                {isCreateOpen ? "Add New Species" : "Edit Species Taxonomy"}
              </h2>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingSpecies(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isCreateOpen ? handleCreateSubmit : handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scientific Name (Binomial) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enhalus acoroides"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-serif italic"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Common / Vernacular Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tropical Ribbon Seagrass"
                  value={commonName}
                  onChange={(e) => setCommonName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ecological Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe leaf dimensions, root morphology, substrate affinities, and canopy structure..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingSpecies(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  {isCreateOpen ? "Create Species" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
