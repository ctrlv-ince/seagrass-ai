import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  MapPin,
  Compass,
  Info,
} from "lucide-react";
import apiClient from "../api/client";
import { Skeleton } from "../components/common/Skeleton";

// Custom Leaflet icon for coastal survey sites
const surveyIcon = L.divIcon({
  className: "custom-survey-marker",
  html: `
    <div style="
      background-color: #0d9488;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(13, 148, 136, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

interface GeoFeature {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: {
    id: string;
    title?: string;
    name?: string;
    location_name?: string;
    surveyor_name?: string;
    status?: string;
    created_at?: string;
  };
}

function MapRecenter({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 14, { duration: 1.5 });
  }, [coords, map]);
  return null;
}

export function MapView() {
  const [surveys, setSurveys] = useState<GeoFeature[]>([]);
  const [transects, setTransects] = useState<GeoFeature[]>([]);
  const [selectedSite, setSelectedSite] = useState<GeoFeature | null>(null);
  const [center, setCenter] = useState<[number, number]>([14.5995, 120.9842]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGeoData() {
      setIsLoading(true);
      try {
        const [surveysRes, transectsRes] = await Promise.all([
          apiClient.get("/maps/surveys/geojson"),
          apiClient.get("/maps/transects/geojson"),
        ]);
        const sFeatures = surveysRes.data.features || [];
        const tFeatures = transectsRes.data.features || [];

        // If no surveys in DB yet, provide realistic demonstration coastal stations
        if (sFeatures.length === 0) {
          const sampleStations: GeoFeature[] = [
            {
              type: "Feature",
              id: "demo-1",
              geometry: { type: "Point", coordinates: [119.8872, 16.3353] },
              properties: {
                id: "demo-1",
                title: "Bolinao Marine Station Meadow",
                location_name: "Bolinao Reef Flat, Pangasinan",
                surveyor_name: "Marine Coastal Team",
                status: "completed",
              },
            },
            {
              type: "Feature",
              id: "demo-2",
              geometry: { type: "Point", coordinates: [120.0125, 16.2941] },
              properties: {
                id: "demo-2",
                title: "Lucap Bay Enhalus Canopy",
                location_name: "Hundred Islands Inshore",
                surveyor_name: "Reef Survey Group",
                status: "in_progress",
              },
            },
            {
              type: "Feature",
              id: "demo-3",
              geometry: { type: "Point", coordinates: [119.9241, 16.3688] },
              properties: {
                id: "demo-3",
                title: "Santiago Island Wave Damping Bed",
                location_name: "Santiago Pass",
                surveyor_name: "Seagrass Assessment Unit",
                status: "completed",
              },
            },
          ];
          setSurveys(sampleStations);
          setCenter([16.3353, 119.8872]);
        } else {
          setSurveys(sFeatures);
          const firstPoint = sFeatures[0]?.geometry?.coordinates;
          if (firstPoint && firstPoint.length >= 2) {
            setCenter([firstPoint[1], firstPoint[0]]);
          }
        }
        setTransects(tFeatures);
      } catch (err) {
        console.error("Failed to load GeoJSON maps data", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadGeoData();
  }, []);

  const handleSelectSite = (site: GeoFeature) => {
    setSelectedSite(site);
    const coords = site.geometry.coordinates;
    if (coords && coords.length >= 2) {
      setCenter([coords[1], coords[0]]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1">
            <Compass className="w-4 h-4" />
            <span>GIS Geospatial Viewer</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Field Survey Sites &amp; Transects
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            PostGIS spatial map displaying surveyed meadows, quadrat coordinates, and sampling transects.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            {surveys.length} Field Sites Mapped
          </span>
        </div>
      </div>

      {/* Map + Sidebar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-230px)] min-h-[500px]">
        {/* Left: Sites List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="font-bold text-sm text-slate-900">Survey Sites</span>
            <span className="text-xs text-slate-400">Click to focus</span>
          </div>

          <div className="overflow-y-auto space-y-2 flex-1 pr-1">
            {isLoading ? (
              <div className="space-y-3 p-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-3.5 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-28" />
                  </div>
                ))}
              </div>
            ) : (
              surveys.map((site) => {
              const isSelected = selectedSite?.id === site.id;
              const coords = site.geometry.coordinates;

              return (
                <div
                  key={site.id}
                  onClick={() => handleSelectSite(site)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/50 shadow-xs"
                      : "border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-900 line-clamp-1">
                      {site.properties.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        site.properties.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {site.properties.status || "active"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{site.properties.location_name || "Coastline"}</span>
                  </div>

                  {coords && (
                    <div className="text-[11px] text-slate-400 mt-2 font-mono">
                      {coords[1]?.toFixed(4)}° N, {coords[0]?.toFixed(4)}° E
                    </div>
                  )}
                </div>
              );
            }))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Interactive Leaflet + PostGIS EPSG:4326</span>
          </div>
        </div>

        {/* Right: Map Container (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs relative bg-slate-100">
          <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
          >
            <MapRecenter coords={center} />
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* Survey Site Markers */}
            {surveys.map((site) => {
              const coords = site.geometry.coordinates;
              if (!coords || coords.length < 2) return null;
              const position: [number, number] = [coords[1], coords[0]];

              return (
                <Marker key={site.id} position={position} icon={surveyIcon}>
                  <Popup>
                    <div className="p-1 space-y-1">
                      <div className="font-bold text-sm text-slate-900">{site.properties.title}</div>
                      <div className="text-xs text-slate-500">{site.properties.location_name}</div>
                      <div className="text-[11px] text-teal-700 font-mono mt-1">
                        {position[0].toFixed(4)}° N, {position[1].toFixed(4)}° E
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Transect lines */}
            {transects.map((t) => {
              if (t.geometry.type === "LineString" && Array.isArray(t.geometry.coordinates)) {
                const latLngs: [number, number][] = t.geometry.coordinates.map((pt: any) => [pt[1], pt[0]]);
                return (
                  <Polyline
                    key={t.id}
                    positions={latLngs}
                    color="#0d9488"
                    weight={3}
                    dashArray="4, 6"
                  />
                );
              }
              return null;
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
