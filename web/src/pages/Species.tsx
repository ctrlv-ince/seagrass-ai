import { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Waves,
  Info,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { downloadCSV, downloadPDF } from "../lib/export";
import { ExportDropdown } from "../components/common/ExportDropdown";

interface SpeciesData {
  scientificName: string;
  commonName: string;
  family: string;
  bladeLengthRange: string;
  bladeWidthRange: string;
  shootDensityRange: string;
  habitatDepth: string;
  dragCoefficient: number;
  waveDampingTier: "Very High" | "High" | "Moderate" | "Low-Moderate";
  keyFeatures: string[];
  identificationTips: string;
  description: string;
}

const SPECIES_CATALOG: SpeciesData[] = [
  {
    scientificName: "Enhalus acoroides",
    commonName: "Tropical Ribbon Grass / Spoon Grass",
    family: "Hydrocharitaceae",
    bladeLengthRange: "30 – 150 cm",
    bladeWidthRange: "1.2 – 2.0 cm",
    shootDensityRange: "100 – 350 /m²",
    habitatDepth: "0.5 – 3.0 m (Intertidal & shallow subtidal)",
    dragCoefficient: 0.85,
    waveDampingTier: "Very High",
    keyFeatures: [
      "Long ribbon-like strap blades with air lacunae",
      "Thick horizontal rhizome covered with persistent black bristles",
      "Large white female flowers pollinated on surface water meniscus",
    ],
    identificationTips: "The largest seagrass in Southeast Asia. Coarse, thick blades with distinct air chambers that remain buoyant.",
    description: "Forms dense, high-biomass meadows with maximum hydrodynamic flow resistance. Highly effective at coastal surge and swell dissipation.",
  },
  {
    scientificName: "Thalassia hemprichii",
    commonName: "Pacific Turtle Grass",
    family: "Hydrocharitaceae",
    bladeLengthRange: "10 – 35 cm",
    bladeWidthRange: "0.5 – 1.0 cm",
    shootDensityRange: "200 – 600 /m²",
    habitatDepth: "0.2 – 4.5 m (Reef flats & shallow lagoons)",
    dragCoefficient: 0.75,
    waveDampingTier: "High",
    keyFeatures: [
      "Slightly curved, sickle-shaped flat blades",
      "Black speckling / tannin cells visible along blade surface",
      "Pronounced vertical shoots arising from robust rooted rhizomes",
    ],
    identificationTips: "Distinguished by sickle-shaped leaves and distinctive red/black longitudinal flecks when held against light.",
    description: "The dominant reef-flat meadow builder in the Indo-Pacific. Forms expansive continuous turf beds that act as natural wave breakwaters.",
  },
  {
    scientificName: "Cymodocea rotundata",
    commonName: "Ribbon Seagrass",
    family: "Cymodoceaceae",
    bladeLengthRange: "8 – 25 cm",
    bladeWidthRange: "0.3 – 0.6 cm",
    shootDensityRange: "250 – 700 /m²",
    habitatDepth: "0.3 – 3.5 m (Muddy-sand flats & estuaries)",
    dragCoefficient: 0.70,
    waveDampingTier: "Moderate",
    keyFeatures: [
      "Smooth, rounded blunt leaf tip without serrations",
      "Closed leaf sheath leaving circular scars on vertical stems",
      "Narrow strap-like linear leaves with 9 to 15 parallel veins",
    ],
    identificationTips: "Rounded leaf tip and complete ring-shaped scars left on upright short shoots.",
    description: "Often co-occurs with Thalassia on intertidal reef flats. Provides significant friction damping along shallow flats.",
  },
  {
    scientificName: "Halodule pinifolia",
    commonName: "Fiber-strand Seagrass",
    family: "Cymodoceaceae",
    bladeLengthRange: "5 – 20 cm",
    bladeWidthRange: "0.1 – 0.3 cm",
    shootDensityRange: "400 – 1200 /m²",
    habitatDepth: "0.1 – 2.5 m (Pioneer intertidal sand bars)",
    dragCoefficient: 0.65,
    waveDampingTier: "Moderate",
    keyFeatures: [
      "Very narrow, needle-like green blades",
      "Leaf tip split into two lateral points with a central tooth",
      "High shoot packing density in fine sand and mud substrate",
    ],
    identificationTips: "Extremely fine strands resembling pine needles. Hand lens reveals rounded tip with minute central point.",
    description: "Rapidly colonizes disturbed sand flats. High shoot count per square meter creates a dense basal carpet that stabilizes sediment.",
  },
  {
    scientificName: "Halophila ovalis",
    commonName: "Paddle Grass / Spoon Grass",
    family: "Hydrocharitaceae",
    bladeLengthRange: "1.0 – 4.0 cm",
    bladeWidthRange: "0.5 – 1.2 cm",
    shootDensityRange: "500 – 1500 /m²",
    habitatDepth: "0.1 – 15.0 m (Shallow intertidal down to deep clear water)",
    dragCoefficient: 0.55,
    waveDampingTier: "Low-Moderate",
    keyFeatures: [
      "Distinct paired oval or spoon-shaped leaves on long petioles",
      "10 to 25 pairs of fine cross-veins connecting to intramarginal vein",
      "Creeping transparent delicate rhizome anchored by fine roots",
    ],
    identificationTips: "Unique paddle or clover-like paired leaves. Unlike other strap-like seagrasses.",
    description: "Adaptable pioneer species growing from intertidal pools to deep reef margins. Primary hydrodynamic role is bed stabilization.",
  },
];

export function Species() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 200);

  const filteredSpecies = useMemo(() => {
    const term = debouncedSearch.toLowerCase().trim();
    return SPECIES_CATALOG.filter((spec) => {
      const matchesSearch =
        !term ||
        spec.scientificName.toLowerCase().includes(term) ||
        spec.commonName.toLowerCase().includes(term) ||
        spec.description.toLowerCase().includes(term);
      const matchesTier = selectedTier === "all" || spec.waveDampingTier === selectedTier;
      return matchesSearch && matchesTier;
    });
  }, [debouncedSearch, selectedTier]);

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const rows = filteredSpecies.map((s) => ({
        "Scientific Name": s.scientificName,
        "Common Name": s.commonName,
        "Family": s.family,
        "Blade Length Range": s.bladeLengthRange,
        "Blade Width Range": s.bladeWidthRange,
        "Shoot Density Range": s.shootDensityRange,
        "Habitat Depth": s.habitatDepth,
        "Drag Coefficient (Cd)": s.dragCoefficient,
        "Wave Damping Tier": s.waveDampingTier,
        "Key Features": s.keyFeatures.join("; "),
        "Description": s.description,
      }));
      downloadCSV(rows, "seagrass-species-catalog.csv");
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const rows = filteredSpecies.map((s) => ({
        "Scientific Name": s.scientificName,
        "Common Name": s.commonName,
        "Family": s.family,
        "Blade Dimensions": `${s.bladeLengthRange} × ${s.bladeWidthRange}`,
        "Shoot Density": s.shootDensityRange,
        "Habitat Depth": s.habitatDepth,
        "Drag (Cd)": String(s.dragCoefficient),
        "Wave Damping": s.waveDampingTier,
      }));

      await downloadPDF({
        filename: "seagrass-species-catalog",
        title: "Seagrass Species Reference Guide",
        subtitle:
          "Field taxonomy, blade canopy morphology, and bulk hydrodynamic drag coefficients.",
        orientation: "landscape",
        meta: {
          "Damping Filter": selectedTier === "all" ? "All Tiers" : selectedTier,
          "Search Query": debouncedSearch || "None",
          "Taxa In Catalog": `${filteredSpecies.length} of ${SPECIES_CATALOG.length}`,
        },
        tables: [
          {
            title: "Southeast Asian Seagrass Botanical & Hydrodynamic Reference Matrix",
            rows,
          },
        ],
      });
    } catch (err) {
      console.error("Failed to generate species PDF:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-semibold text-sm mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Field Taxonomy &amp; Hydrodynamic Characteristics</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Seagrass Species Reference Guide
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Key botanical identifiers, blade canopy metrics, and bulk hydrodynamic drag coefficients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportDropdown
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            isExporting={isExporting}
            label="Export"
            size="md"
          />
          <Link
            to="/detection"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors shadow-xs"
          >
            <Waves className="w-4 h-4" />
            <span>Scan Quadrat</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            aria-label="Search species catalog by scientific name, family or features"
            placeholder="Search by scientific name, features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Wave Damping:</span>
          <select
            aria-label="Filter species by wave damping capacity"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-100 focus:outline-teal-500"
          >
            <option value="all">All Tiers</option>
            <option value="Very High">Very High (&gt;60%)</option>
            <option value="High">High (45-60%)</option>
            <option value="Moderate">Moderate (30-45%)</option>
            <option value="Low-Moderate">Low-Moderate (&lt;30%)</option>
          </select>
        </div>
      </div>

      {/* Species Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSpecies.map((spec) => (
          <div
            key={spec.scientificName}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between hover:border-teal-300 dark:hover:border-teal-700 transition-all space-y-5"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                    {spec.family}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 italic mt-0.5">
                    {spec.scientificName}
                  </h2>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {spec.commonName}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-[11px] px-2.5 py-1 rounded-full font-bold ${
                      spec.waveDampingTier === "Very High"
                        ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                        : spec.waveDampingTier === "High"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800"
                    }`}
                  >
                    {spec.waveDampingTier} Damping
                  </span>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">
                    C_D: {spec.dragCoefficient.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Physical Traits Matrix */}
              <div className="grid grid-cols-3 gap-2.5 my-4">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase">
                    Blade Length
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {spec.bladeLengthRange}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase">
                    Shoot Density
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {spec.shootDensityRange}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase">
                    Blade Width
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {spec.bladeWidthRange}
                  </span>
                </div>
              </div>

              {/* Identification Features */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Diagnostic Botanical Features:
                </span>
                <ul className="space-y-1.5">
                  {spec.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Field Identification Tip */}
              <div className="mt-4 p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Field ID Tip: </span>
                  {spec.identificationTips}
                </div>
              </div>
            </div>

            {/* Habitat and Wave Damping Role */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="truncate">Depth: {spec.habitatDepth.split("(")[0]}</span>
              <Link
                to="/wave-model"
                className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold flex items-center gap-1 shrink-0"
              >
                <span>Simulate Damping</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
