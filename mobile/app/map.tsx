import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  CheckCircle2,
  Clock,
} from "lucide-react-native";
import { BottomNavBar } from "@/components/BottomNavBar";
import { colors, spacing, fontSize, fontWeight, radius, shadow } from "@/theme";

// Conditionally load react-native-webview for native platforms
let NativeWebView: any = null;
if (Platform.OS !== "web") {
  try {
    NativeWebView = require("react-native-webview").WebView;
  } catch {
    // Falls back gracefully
  }
}

const CARTO_API_KEY = process.env.EXPO_PUBLIC_CARTO_API_KEY;

const SURVEY_STATIONS = [
  {
    id: "demo-1",
    title: "Bolinao Marine Station",
    location_name: "Bolinao Reef Flat, Pangasinan",
    status: "completed",
    species: "Enhalus acoroides",
    coverage: "78.4%",
    waveDampening: "-61.2%",
    lat: 16.3353,
    lng: 119.8872,
  },
  {
    id: "demo-2",
    title: "Lucap Bay Canopy",
    location_name: "Hundred Islands Inshore",
    status: "in_progress",
    species: "Thalassia hemprichii",
    coverage: "68.2%",
    waveDampening: "-52.8%",
    lat: 16.2941,
    lng: 120.0125,
  },
  {
    id: "demo-3",
    title: "Santiago Island Bed",
    location_name: "Santiago Pass",
    status: "completed",
    species: "Halodule pinifolia",
    coverage: "82.0%",
    waveDampening: "-64.5%",
    lat: 16.3688,
    lng: 119.9241,
  },
];

function generateLeafletHtml(
  stations: typeof SURVEY_STATIONS,
  selectedId: string,
  apiKey: string
) {
  const stationsJson = JSON.stringify(stations);
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; background: #e0f2fe; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .custom-survey-marker { background: none !important; border: none !important; }
    .marker-pin {
      background-color: #0d9488; width: 28px; height: 28px; border-radius: 50%;
      border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(13, 148, 136, 0.45);
      display: flex; align-items: center; justify-content: center; color: white;
      transition: all 0.25s ease; cursor: pointer;
    }
    .marker-pin.active {
      background-color: #0f766e; border-color: #ccfbf1; width: 34px; height: 34px;
      box-shadow: 0 6px 14px rgba(15, 118, 110, 0.6); transform: scale(1.15);
    }
    .leaflet-popup-content-wrapper { border-radius: 14px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15); padding: 2px; }
    .leaflet-popup-content { margin: 10px 12px; line-height: 1.4; }
    .popup-title { font-size: 13px; font-weight: 700; color: #0f172a; }
    .popup-loc { font-size: 11px; color: #64748b; margin-top: 2px; }
    .popup-metrics { display: flex; gap: 12px; margin-top: 6px; padding-top: 6px; border-top: 1px solid #f1f5f9; font-size: 11px; }
    .popup-val { font-weight: 700; color: #0d9488; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var stations = ${stationsJson};
    var initialSelected = "${selectedId}";
    var apiKey = "${apiKey}";
    var markersMap = {};

    var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([16.3353, 119.8872], 12);

    var cartoUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (apiKey) { cartoUrl += '?key=' + encodeURIComponent(apiKey); }

    L.tileLayer(cartoUrl, { subdomains: 'abcd', maxZoom: 19, minZoom: 3 }).addTo(map);

    var latlngs = stations.map(function(s) { return [s.lat, s.lng]; });
    L.polyline(latlngs, { color: '#0d9488', weight: 2, dashArray: '6, 8', opacity: 0.6 }).addTo(map);

    function createMarkerIcon(isActive) {
      return L.divIcon({
        className: 'custom-survey-marker',
        html: '<div class="marker-pin ' + (isActive ? 'active' : '') + '">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
          '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>' +
          '<circle cx="12" cy="10" r="3"/></svg></div>',
        iconSize: isActive ? [34, 34] : [28, 28],
        iconAnchor: isActive ? [17, 34] : [14, 28],
        popupAnchor: [0, -28]
      });
    }

    stations.forEach(function(s) {
      var isActive = s.id === initialSelected;
      var marker = L.marker([s.lat, s.lng], { icon: createMarkerIcon(isActive) }).addTo(map);

      var popupHtml = '<div class="popup-title">' + s.title + '</div>' +
        '<div class="popup-loc">' + s.location_name + '</div>' +
        '<div class="popup-metrics">' +
          '<span>Coverage: <strong class="popup-val">' + s.coverage + '</strong></span>' +
          '<span>Damping: <strong class="popup-val">' + s.waveDampening + '</strong></span>' +
        '</div>';

      marker.bindPopup(popupHtml);
      marker.on('click', function() { selectStation(s.id); });
      markersMap[s.id] = marker;
      if (isActive) { marker.openPopup(); }
    });

    function selectStation(id) {
      Object.keys(markersMap).forEach(function(mid) {
        markersMap[mid].setIcon(createMarkerIcon(mid === id));
      });
      if (markersMap[id]) { markersMap[id].openPopup(); }
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SELECT_STATION', id: id }));
      }
    }

    window.flyToStation = function(lat, lng, id) {
      map.flyTo([lat, lng], 14, { duration: 1.0 });
      selectStation(id);
    };
  </script>
</body>
</html>`;
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<any>(null);
  const [selected, setSelected] = useState(SURVEY_STATIONS[0]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const leafletHtml = useMemo(() => {
    return generateLeafletHtml(SURVEY_STATIONS, selected.id, CARTO_API_KEY);
  }, []);

  const handleSelectStation = (
    station: (typeof SURVEY_STATIONS)[0]
  ) => {
    setSelected(station);
    const js = `if (window.flyToStation) { window.flyToStation(${station.lat}, ${station.lng}, "${station.id}"); } true;`;
    if (webViewRef.current?.injectJavaScript) {
      webViewRef.current.injectJavaScript(js);
    }
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "SELECT_STATION") {
        const found = SURVEY_STATIONS.find((s) => s.id === data.id);
        if (found) setSelected(found);
      }
    } catch {
      // ignore
    }
  };

  const isCompleted = selected.status === "completed";

  return (
    <View style={styles.container}>
      {/* ── Edge-to-edge map ── */}
      <View style={[styles.mapContainer, { paddingTop: insets.top }]}>
        {NativeWebView && Platform.OS !== "web" ? (
          <NativeWebView
            ref={webViewRef}
            source={{ html: leafletHtml }}
            style={styles.mapWebView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            onLoadEnd={() => setMapLoaded(true)}
            onMessage={handleWebViewMessage}
            renderLoading={() => (
              <View style={styles.loadingMap}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading map…</Text>
              </View>
            )}
          />
        ) : (
          <iframe
            title="Map"
            srcDoc={leafletHtml}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        )}

        {/* Floating site chips */}
        <View style={[styles.chipBar, { top: insets.top + 12 }]}>
          {SURVEY_STATIONS.map((station) => {
            const isSel = selected.id === station.id;
            return (
              <Pressable
                key={station.id}
                style={[styles.chip, isSel && styles.chipActive]}
                onPress={() => handleSelectStation(station)}
              >
                <Text
                  style={[styles.chipText, isSel && styles.chipTextActive]}
                  numberOfLines={1}
                >
                  {station.title.split(" ")[0]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── Bottom sheet-style card ── */}
      <View style={styles.detailSheet}>
        <View style={styles.sheetHandle} />

        <View style={styles.sheetHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sheetTitle} numberOfLines={1}>
              {selected.title}
            </Text>
            <Text style={styles.sheetLocation} numberOfLines={1}>
              {selected.location_name}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isCompleted
                  ? colors.successLight
                  : colors.infoLight,
              },
            ]}
          >
            {isCompleted ? (
              <CheckCircle2 size={12} color={colors.success} />
            ) : (
              <Clock size={12} color={colors.info} />
            )}
            <Text
              style={[
                styles.statusText,
                { color: isCompleted ? colors.success : colors.info },
              ]}
            >
              {isCompleted ? "Done" : "Active"}
            </Text>
          </View>
        </View>

        <View style={styles.sheetMetrics}>
          <View style={styles.sheetMetricItem}>
            <Text style={styles.sheetMetricValue}>{selected.coverage}</Text>
            <Text style={styles.sheetMetricLabel}>Coverage</Text>
          </View>
          <View style={styles.sheetMetricDivider} />
          <View style={styles.sheetMetricItem}>
            <Text
              style={[styles.sheetMetricValue, { color: colors.primary }]}
            >
              {selected.waveDampening}
            </Text>
            <Text style={styles.sheetMetricLabel}>Wave damp</Text>
          </View>
          <View style={styles.sheetMetricDivider} />
          <View style={styles.sheetMetricItem}>
            <Text style={styles.sheetMetricValue}>{selected.species.split(" ")[0]}</Text>
            <Text style={styles.sheetMetricLabel}>Species</Text>
          </View>
        </View>

        <Pressable
          style={styles.scanLink}
          onPress={() => router.push("/capture")}
        >
          <Camera size={14} color={colors.primary} />
          <Text style={styles.scanLinkText}>Add quadrat scan →</Text>
        </Pressable>
      </View>

      <BottomNavBar activeTab="map" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#E0F2FE",
  },
  mapWebView: {
    flex: 1,
    backgroundColor: "#E0F2FE",
  },
  loadingMap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },

  /* Floating chips */
  chipBar: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
    zIndex: 5,
  },
  chip: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
    ...shadow.md,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textOnPrimary,
  },

  /* Bottom sheet */
  detailSheet: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -radius.xl,
    ...shadow.lg,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderLight,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  sheetLocation: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },

  /* Metrics */
  sheetMetrics: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  sheetMetricItem: {
    flex: 1,
    alignItems: "center",
  },
  sheetMetricValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  sheetMetricLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  sheetMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.borderLight,
  },

  /* Scan link */
  scanLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primarySubtle,
    borderRadius: radius.md,
  },
  scanLinkText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
});
