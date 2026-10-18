import type { ComponentType } from "react";
import { Map, Layers, Waves } from "lucide-react";

export type MapLayerType = "osm" | "satellite" | "ocean";

export interface LayerOption {
  id: MapLayerType;
  label: string;
  icon: ComponentType<{ className?: string }>;
  url: string;
  attribution: string;
  maxZoom?: number;
}

export const MAP_LAYERS: Record<MapLayerType, LayerOption> = {
  osm: {
    id: "osm",
    label: "Street",
    icon: Map,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    id: "satellite",
    label: "Satellite",
    icon: Layers,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    maxZoom: 18,
  },
  ocean: {
    id: "ocean",
    label: "Ocean / Bathymetry",
    icon: Waves,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",
    maxZoom: 13,
  },
};

interface LayerSwitcherProps {
  currentLayer: MapLayerType;
  onLayerChange: (layer: MapLayerType) => void;
}

export function LayerSwitcher({ currentLayer, onLayerChange }: LayerSwitcherProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-md flex items-center gap-1">
      {(Object.values(MAP_LAYERS) as LayerOption[]).map((layer) => {
        const Icon = layer.icon;
        const isActive = currentLayer === layer.id;
        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => onLayerChange(layer.id)}
            title={`Switch to ${layer.label} base layer`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
}
