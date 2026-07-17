<template>
  <div class="space-y-6">
    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
      {{ heading }}
    </h2>

    <!-- Optional contextual notice (e.g. layout generate mode) -->
    <div
      v-if="props.notice"
      class="flex items-start gap-2 rounded-md border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-200"
    >
      <RiInformationLine class="w-4 h-4 mt-0.5 shrink-0" />
      <span>{{ props.notice }}</span>
    </div>

    <!-- Leaflet map with base-layer switch (auto: WebMercator tiles if geographic, else CRS.Simple) -->
    <div
      class="rounded-md overflow-hidden border border-gray-200 dark:border-slate-600"
    >
      <ClientOnly>
        <div
          :class="[
            isFullscreen
              ? 'fixed inset-0 z-[9999] bg-white dark:bg-slate-900'
              : 'relative w-full h-96',
            { 'simple-crs': crsMode === 'simple' },
          ]"
        >
          <div ref="mapEl" class="w-full h-full" />
          <!-- Map controls: base layer toggle + fullscreen -->
          <div class="absolute top-2 right-2 z-[1000] flex items-center gap-2">
            <div
              v-if="crsMode === 'geo' && latLngs.length"
              class="inline-flex rounded-md overflow-hidden shadow border border-gray-200 dark:border-slate-700 backdrop-blur bg-white/90 dark:bg-slate-800/90"
              role="group"
              aria-label="Base layer toggle"
            >
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-medium focus:outline-none transition-colors"
                :class="[
                  activeBaseKey === 'OpenStreetMap'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-slate-700/60',
                ]"
                @click="activeBaseKey = 'OpenStreetMap'"
                :aria-pressed="activeBaseKey === 'OpenStreetMap'"
              >
                Street
              </button>
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-medium focus:outline-none transition-colors border-l border-gray-200 dark:border-slate-700"
                :class="[
                  activeBaseKey === 'Satellite'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-slate-700/60',
                ]"
                @click="activeBaseKey = 'Satellite'"
                :aria-pressed="activeBaseKey === 'Satellite'"
              >
                Satellite
              </button>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-md shadow border border-gray-200 dark:border-slate-700 backdrop-blur bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-slate-700/60 focus:outline-none transition-colors"
              :title="isFullscreen ? 'Exit full screen (Esc)' : 'Full screen'"
              :aria-label="isFullscreen ? 'Exit full screen' : 'Full screen'"
              @click="toggleFullscreen"
            >
              <RiFullscreenExitLine v-if="isFullscreen" class="w-4 h-4" />
              <RiFullscreenLine v-else class="w-4 h-4" />
            </button>
          </div>
          <div
            v-if="!latLngs.length"
            class="absolute inset-0 grid place-items-center text-sm text-gray-400"
          >
            {{ emptyMessage }}
          </div>
        </div>
      </ClientOnly>
    </div>

    <div class="flex justify-end gap-3">
      <button
        @click="onComplete"
        class="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  shallowRef,
  nextTick,
} from "vue";
import {
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiInformationLine,
} from "@remixicon/vue";

type CoordInput = {
  point: string;
  northing: number | null;
  easting: number | null;
  elevation?: number | null;
};

type DimensionDatum = {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  distanceText: string;
  degreeText?: string;
  minuteText?: string;
  centroid?: [number, number] | null;
};

// Keep modelValue in props to avoid extraneous-attrs warnings from parent, but unused here.
const props = defineProps<{
  modelValue?: any;
  coordinates?: CoordInput[];
  parcelName?: string;
  parcels?: Array<{ name?: string; ids?: string[] }>;
  planType?: string; // Add plan type prop
  // Closed outline drawn behind everything else (topographic perimeter /
  // layout site boundary).
  boundary?: CoordInput[];
  // Layout road centerlines; ids reference the corner register passed via
  // `coordinates`.
  roads?: Array<{ name?: string; width?: number | null; ids?: string[] }>;
  // Visibility switches (topographic settings); undefined means visible.
  showBoundary?: boolean;
  showSpotHeights?: boolean;
  // Contextual banner shown above the map (e.g. layout generate-mode note).
  notice?: string;
  legs?: Array<{
    from: { id: string; northing: number; easting: number };
    to: { id: string; northing: number; easting: number };
    distance: number;
    bearing?: {
      decimal?: number;
      degrees?: number;
      minutes?: number;
      seconds?: number;
    };
  }>;
}>();
const emit = defineEmits(["complete"]);

const heading = computed(() => {
  switch (props.planType) {
    case "route":
      return "Route Drawing";
    case "topographic":
      return "Topographic Drawing";
    case "layout":
      return "Layout Drawing";
    default:
      return "Drawing";
  }
});

const emptyMessage = computed(() => {
  switch (props.planType) {
    case "route":
      return "No stations to plot yet. Add station coordinates in the Route Alignment step.";
    case "topographic":
      if (props.showBoundary === false && props.showSpotHeights === false) {
        return "Boundary and spot heights are hidden by your Topo Settings.";
      }
      return "Nothing to plot yet. Add perimeter and spot-height points in the earlier steps.";
    case "layout":
      return "Nothing to plot yet. Add a site boundary and layout design in the earlier steps.";
    default:
      return "No coordinates to plot yet. Add coordinates in Step 1.";
  }
});

// Fullscreen preview (CSS-based; the map just fills the viewport)
const isFullscreen = ref(false);
async function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  await nextTick();
  mapRef.value?.invalidateSize();
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && isFullscreen.value) void toggleFullscreen();
}

const filledRows = (rows?: CoordInput[]) =>
  (Array.isArray(rows) ? rows : []).filter(
    (r) => r.point && r.northing != null && r.easting != null
  );

// Prepare parcel data for rendering all parcels together (for cadastral) or route data (for route surveys)
const allParcels = computed(() => {
  if (props.planType === "route") {
    // For route surveys, create a single "route" using all coordinates in sequence
    if (!Array.isArray(props.coordinates)) return [];

    const filtered = props.coordinates.filter(
      (r) => r.point && r.northing != null && r.easting != null
    );

    if (!filtered.length) return [];

    const points = filtered.map((r) => ({
      key: r.point || `${r.easting},${r.northing}`,
      label: r.point || "",
      x: Number(r.easting),
      y: Number(r.northing),
    }));

    return [{ name: props.parcelName || "Route", points, isRoute: true }];
  }

  // Existing cadastral survey logic
  if (!Array.isArray(props.parcels) || !Array.isArray(props.coordinates)) {
    return [];
  }

  // Look up coordinates by point id so each parcel can be walked in the
  // order the user arranged its points.
  const coordMap = new Map<string, any>();
  for (const r of props.coordinates) {
    if (r.point && r.northing != null && r.easting != null) {
      coordMap.set(r.point, r);
    }
  }

  return props.parcels
    .map((parcel) => {
      const parcelName = (parcel?.name || "").trim();
      const parcelIds = parcel?.ids?.filter(Boolean) || [];
      if (!parcelIds.length) return null;

      // The polygon must follow the parcel's traverse order, not the
      // coordinate-table order.
      const orderedIds = [...parcelIds];
      if (
        orderedIds.length > 1 &&
        orderedIds[0] === orderedIds[orderedIds.length - 1]
      ) {
        orderedIds.pop(); // polygon closes itself; drop the explicit closing id
      }

      const points = orderedIds
        .map((id, i) => {
          const r = coordMap.get(id);
          if (!r) return null;
          return {
            key: `${id}-${i}`,
            label: id,
            x: Number(r.easting),
            y: Number(r.northing),
          };
        })
        .filter((p): p is { key: string; label: string; x: number; y: number } => !!p);

      if (!points.length) return null;

      return { name: parcelName, points };
    })
    .filter(Boolean) as Array<{
    name: string;
    points: Array<{ key: string; label: string; x: number; y: number }>;
    isRoute?: boolean;
  }>;
});

// Boundary outline points (topographic perimeter / layout site boundary)
const boundaryPoints = computed(() => {
  if (props.showBoundary === false) return [];
  const rows = filledRows(props.boundary);
  const points = rows.map((r, i) => ({
    key: `boundary-${r.point}-${i}`,
    label: r.point || "",
    x: Number(r.easting),
    y: Number(r.northing),
  }));
  // polygon closes itself; drop an explicit closing point
  if (
    points.length > 1 &&
    points[0]!.label === points[points.length - 1]!.label
  ) {
    points.pop();
  }
  return points;
});

// Spot heights (topographic): the coordinates prop carries the topo points
const spotPoints = computed(() => {
  if (props.planType !== "topographic") return [];
  if (props.showSpotHeights === false) return [];
  return filledRows(props.coordinates).map((r, i) => ({
    key: `spot-${r.point}-${i}`,
    label: r.point || "",
    x: Number(r.easting),
    y: Number(r.northing),
    elevation:
      r.elevation != null && Number.isFinite(Number(r.elevation))
        ? Number(r.elevation)
        : null,
  }));
});

// Road centerlines (layout): ids reference the corner register in coordinates
const roadLines = computed(() => {
  if (props.planType !== "layout" || !Array.isArray(props.roads)) return [];
  const coordMap = new Map<string, CoordInput>();
  for (const r of filledRows(props.coordinates)) coordMap.set(r.point, r);
  return props.roads
    .map((road, i) => {
      const points = (road.ids || [])
        .filter(Boolean)
        .map((id, j) => {
          const r = coordMap.get(id);
          if (!r) return null;
          return {
            key: `road-${i}-${j}`,
            label: id,
            x: Number(r.easting),
            y: Number(r.northing),
          };
        })
        .filter(
          (p): p is { key: string; label: string; x: number; y: number } => !!p
        );
      if (points.length < 2) return null;
      return { name: road.name || "", points };
    })
    .filter(Boolean) as Array<{
    name: string;
    points: Array<{ key: string; label: string; x: number; y: number }>;
  }>;
});

// Get all raw points to determine bounds and geographic orientation
const allRawPoints = computed(() => {
  const points: Array<{ key: string; label: string; x: number; y: number }> =
    [];
  allParcels.value.forEach((parcel) => {
    parcel.points.forEach((point) => points.push(point));
  });
  boundaryPoints.value.forEach((point) => points.push(point));
  spotPoints.value.forEach((point) => points.push(point));
  roadLines.value.forEach((road) => {
    road.points.forEach((point) => points.push(point));
  });
  return points;
});

// Leaflet map state (client-only)
const LRef = shallowRef<any>(null);
const mapEl = ref<HTMLElement | null>(null);
const mapRef = shallowRef<any>(null);
let polygonLayers: any[] = [];
let pointLayers: any[] = [];
let centroidMarkers: any[] = [];
let dimensionLayerGroup: any = null;
let dimensionData: DimensionDatum[] = [];
let dimensionEventsAttached = false;
const baseLayers = shallowRef<Record<string, any>>({});
const activeBaseKey = ref<string>("OpenStreetMap");
const crsMode = ref<"geo" | "simple" | null>(null);

// Determine geographic orientation (supports lon/lat or lat/lon). "none" means non-geographic.
const geoOrientation = computed<"lonlat" | "latlon" | "none">(() => {
  const pts = allRawPoints.value;
  if (!pts.length) return "lonlat"; // default to lon/lat when empty
  let lonlat = 0;
  let latlon = 0;
  for (const p of pts) {
    const x = p.x;
    const y = p.y;
    if (x >= -180 && x <= 180 && y >= -90 && y <= 90) lonlat++;
    if (x >= -90 && x <= 90 && y >= -180 && y <= 180) latlon++;
  }
  if (lonlat === 0 && latlon === 0) return "none";
  return lonlat >= latlon ? "lonlat" : "latlon";
});

// Generate arrays of [lat, lng] pairs for each parcel's polygon or route's polyline
const parcelLatLngs = computed<
  Array<{ name: string; points: [number, number][]; isRoute?: boolean }>
>(() => {
  const orient = geoOrientation.value;
  return allParcels.value.map((parcel) => {
    const points = parcel.points.map((p) => {
      if (orient === "latlon") return [p.x, p.y] as [number, number]; // x=lat, y=lng
      return [p.y, p.x] as [number, number]; // y=lat, x=lng (default)
    });
    return {
      name: parcel.name,
      points,
      isRoute: (parcel as any).isRoute,
    };
  });
});

// Single array of [lat, lng] pairs for backward compatibility
const latLngs = computed<[number, number][]>(() => {
  const orient = geoOrientation.value;
  if (allRawPoints.value.length === 0) return [];

  return allRawPoints.value.map((p) => {
    if (orient === "latlon") return [p.x, p.y] as [number, number]; // x=lat, y=lng
    return [p.y, p.x] as [number, number]; // y=lat, x=lng (default)
  });
});

// Points that receive the square beacon marker + permanent label. For layout
// plans the plot corners are too dense to label, so only boundary points get
// markers; topographic plans label the perimeter beacons (spot heights get
// their own smaller markers).
const markerSourcePoints = computed(() => {
  if (props.planType === "topographic" || props.planType === "layout") {
    return boundaryPoints.value;
  }
  const points: Array<{ key: string; label: string; x: number; y: number }> =
    [];
  allParcels.value.forEach((parcel) => {
    parcel.points.forEach((point) => points.push(point));
  });
  return points;
});

// Points mapped to lat/lng for markers with labels
const pointsLatLng = computed(() =>
  markerSourcePoints.value.map((p) => {
    const orient = geoOrientation.value;
    return orient === "latlon"
      ? { key: p.key, label: p.label, lat: p.x, lng: p.y }
      : { key: p.key, label: p.label, lat: p.y, lng: p.x };
  })
);

// Boundary outline as [lat, lng] pairs
const boundaryLatLngs = computed<[number, number][]>(() => {
  const orient = geoOrientation.value;
  return boundaryPoints.value.map((p) =>
    orient === "latlon"
      ? ([p.x, p.y] as [number, number])
      : ([p.y, p.x] as [number, number])
  );
});

// Spot heights mapped to lat/lng with elevation labels
const spotsLatLng = computed(() =>
  spotPoints.value.map((p) => {
    const orient = geoOrientation.value;
    return orient === "latlon"
      ? { ...p, lat: p.x, lng: p.y }
      : { ...p, lat: p.y, lng: p.x };
  })
);

// Road centerlines mapped to [lat, lng] pairs
const roadsLatLng = computed(() => {
  const orient = geoOrientation.value;
  return roadLines.value.map((road) => ({
    name: road.name,
    points: road.points.map((p) =>
      orient === "latlon"
        ? ([p.x, p.y] as [number, number])
        : ([p.y, p.x] as [number, number])
    ),
  }));
});

// Map bounds computed from all points with padding
const bounds = computed(() => {
  const allPoints = latLngs.value;
  if (!allPoints.length)
    return undefined as unknown as [[number, number], [number, number]];

  let minLat = Infinity,
    minLng = Infinity,
    maxLat = -Infinity,
    maxLng = -Infinity;

  for (const [lat, lng] of allPoints) {
    if (lat < minLat) minLat = lat;
    if (lng < minLng) minLng = lng;
    if (lat > maxLat) maxLat = lat;
    if (lng > maxLng) maxLng = lng;
  }

  const w = Math.max(1, maxLng - minLng);
  const h = Math.max(1, maxLat - minLat);
  const pad = 0.08 * Math.max(w, h);

  return [
    [minLat - pad, minLng - pad],
    [maxLat + pad, maxLng + pad],
  ] as [[number, number], [number, number]];
});

// Map bounds computed from all points with padding
const parcelCentroids = computed(() => {
  return parcelLatLngs.value.map((parcel) => {
    const pts = parcel.points;
    const n = pts.length;

    if (!n) return { name: parcel.name, position: [0, 0] as [number, number] };

    // For route surveys, use the midpoint of the route
    if (parcel.isRoute) {
      const midIndex = Math.floor(n / 2);
      return {
        name: parcel.name,
        position: pts[midIndex] as [number, number],
      };
    }

    // For cadastral surveys, use polygon centroid calculation
    if (n < 3) {
      const s = pts.reduce(
        (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng] as [number, number],
        [0, 0]
      );
      return {
        name: parcel.name,
        position: [s[0] / n, s[1] / n] as [number, number],
      };
    }

    let area2 = 0;
    let cx = 0;
    let cy = 0;

    for (let i = 0; i < n; i++) {
      const [x0, y0] = [pts[i]![1], pts[i]![0]]; // treat lng=x, lat=y for centroid calc
      const [x1, y1] = [pts[(i + 1) % n]![1], pts[(i + 1) % n]![0]];
      const f = x0 * y1 - x1 * y0;
      area2 += f;
      cx += (x0 + x1) * f;
      cy += (y0 + y1) * f;
    }

    if (area2 === 0) {
      const s = pts.reduce(
        (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng] as [number, number],
        [0, 0]
      );
      return {
        name: parcel.name,
        position: [s[0] / n, s[1] / n] as [number, number],
      };
    }

    return {
      name: parcel.name,
      position: [cy / (3 * area2), cx / (3 * area2)] as [number, number],
    };
  });
});

// Heuristic: detect if coords look geographic in either orientation
const isGeographic = computed<boolean>(() => geoOrientation.value !== "none");

function teardownBaseLayers() {
  const map = mapRef.value;
  if (!map) return;
  for (const key of Object.keys(baseLayers.value)) {
    const layer = baseLayers.value[key];
    if (map.hasLayer(layer)) map.removeLayer(layer);
  }
  baseLayers.value = {};
}

function setupBaseLayers() {
  const L = LRef.value;
  const map = mapRef.value;
  if (!L || !map) return;
  teardownBaseLayers();
  if (crsMode.value !== "geo") return; // no tile layers for Simple CRS

  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }
  );
  const esri = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution:
        "Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  );

  baseLayers.value = {
    OpenStreetMap: osm,
    Satellite: esri,
  };
  applyActiveBase();
}

function applyActiveBase() {
  const map = mapRef.value;
  if (!map || crsMode.value !== "geo") return;
  for (const [key, layer] of Object.entries(baseLayers.value)) {
    if (key === activeBaseKey.value) {
      if (!map.hasLayer(layer)) layer.addTo(map);
    } else if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  }
}

function renderLayers() {
  const L = LRef.value;
  const map = mapRef.value;
  if (!L || !map) return;

  // Clear existing layers
  for (const layer of polygonLayers) {
    map.removeLayer(layer);
  }
  polygonLayers = [];

  for (const layer of pointLayers) {
    map.removeLayer(layer);
  }
  pointLayers = [];

  for (const marker of centroidMarkers) {
    map.removeLayer(marker);
  }
  centroidMarkers = [];

  if (!latLngs.value.length) return;

  // Fit bounds
  const b = bounds.value as unknown as [[number, number], [number, number]];
  if (b) map.fitBounds(L.latLngBounds(b), { padding: [10, 10] });

  // Draw each parcel polygon or route line
  for (const parcel of parcelLatLngs.value) {
    if (parcel.points.length < 2) continue;

    let geometryLayer;
    if ((parcel as any).isRoute) {
      // For route surveys, draw a polyline with stylized appearance
      geometryLayer = L.polyline(parcel.points, {
        color: "#ff1f1f",
        weight: 2.5,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(map);
    } else {
      // For cadastral parcels / layout plots, draw a polygon (only if we have at least 3 points)
      if (parcel.points.length < 3) continue;
      geometryLayer = L.polygon(parcel.points, {
        color: "#ff1f1f",
        weight: props.planType === "layout" ? 1.5 : 2.5,
        fill: false,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(map);
    }

    polygonLayers.push(geometryLayer);
  }

  // Boundary outline (topographic perimeter / layout site boundary)
  if (boundaryLatLngs.value.length >= 2) {
    const style = {
      color: "#2563eb",
      weight: 2,
      opacity: 0.9,
      fill: false,
      dashArray: "6 4",
      lineCap: "round",
      lineJoin: "round",
      interactive: false,
    };
    const boundaryLayer =
      boundaryLatLngs.value.length >= 3
        ? L.polygon(boundaryLatLngs.value, style)
        : L.polyline(boundaryLatLngs.value, style);
    boundaryLayer.addTo(map);
    polygonLayers.push(boundaryLayer);
  }

  // Road centerlines (layout)
  for (const road of roadsLatLng.value) {
    const line = L.polyline(road.points, {
      color: "#6b7280",
      weight: 3,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
      interactive: false,
    }).addTo(map);
    polygonLayers.push(line);

    if (road.name) {
      const mid = road.points[Math.floor(road.points.length / 2)]!;
      const marker = L.marker(mid, {
        icon: L.divIcon({
          className: "empty-icon",
          html: "",
          iconSize: [0, 0],
        }),
        interactive: false,
      })
        .addTo(map)
        .bindTooltip(road.name, {
          permanent: true,
          direction: "center",
          className: "leaflet-tooltip road-label",
        });
      centroidMarkers.push(marker);
    }
  }

  // Spot heights (topographic): small dot labelled with id + elevation
  const spotIcon = L.divIcon({
    className: "spot-node-icon",
    html: '<div class="spot-node"></div>',
    iconSize: [8, 8],
    iconAnchor: [4, 4],
  });
  for (const p of spotsLatLng.value) {
    const label =
      p.elevation != null
        ? `${p.label}<div class="spot-elev">${p.elevation.toFixed(2)}</div>`
        : p.label;
    const marker = L.marker([p.lat, p.lng], {
      icon: spotIcon,
      interactive: false,
    })
      .addTo(map)
      .bindTooltip(label, {
        permanent: true,
        direction: "top",
        className: "leaflet-tooltip spot-label",
        offset: [0, -4],
      });
    pointLayers.push(marker);
  }

  // Points + labels (respect orientation)
  const pointIcon = L.divIcon({
    className: "point-node-icon",
    html: '<div class="point-node"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  for (const p of pointsLatLng.value) {
    const marker = L.marker([p.lat, p.lng], {
      icon: pointIcon,
      interactive: false,
    })
      .addTo(map)
      .bindTooltip(p.label, {
        permanent: true,
        direction: "top",
        className: "leaflet-tooltip point-label",
        offset: [0, -8],
      });
    pointLayers.push(marker);
  }

  // Add parcel labels at centroids
  for (const parcel of parcelCentroids.value) {
    if (!parcel.name) continue;

    const marker = L.marker(parcel.position, {
      icon: L.divIcon({ className: "empty-icon", html: "", iconSize: [0, 0] }),
    })
      .addTo(map)
      .bindTooltip(parcel.name, {
        permanent: true,
        direction: "center",
        className: "leaflet-tooltip parcel-label",
      });

    centroidMarkers.push(marker);
  }

  if (dimensionLayerGroup) dimensionLayerGroup.clearLayers();
  dimensionData = [];
  if (Array.isArray(props.legs) && props.legs.length) {
    const centroidPool = parcelCentroids.value
      .map((parcel) => parcel.position)
      .filter((pos): pos is [number, number] => Array.isArray(pos));

    for (const leg of props.legs) {
      const from = pointsLatLng.value.find(
        (pp) => pp.label === leg.from.id || pp.key === leg.from.id
      );
      const to = pointsLatLng.value.find(
        (pp) => pp.label === leg.to.id || pp.key === leg.to.id
      );
      if (!from || !to) continue;

      const distanceValue = Number(leg.distance);
      const distanceText = Number.isFinite(distanceValue)
        ? `${distanceValue.toFixed(2)}m`
        : "";
      const { degreeText, minuteText } = splitBearingLabels(leg.bearing);

      if (!distanceText && !degreeText && !minuteText) continue;

      const midLat = (from.lat + to.lat) / 2;
      const midLng = (from.lng + to.lng) / 2;
      let closestCentroid: [number, number] | null = null;
      let minDist = Infinity;
      for (const centroid of centroidPool) {
        const dist = Math.hypot(centroid[0] - midLat, centroid[1] - midLng);
        if (dist < minDist) {
          minDist = dist;
          closestCentroid = centroid;
        }
      }

      dimensionData.push({
        from: { lat: from.lat, lng: from.lng },
        to: { lat: to.lat, lng: to.lng },
        distanceText,
        degreeText,
        minuteText,
        centroid: closestCentroid,
      });
    }
  }

  drawDimensionLayers();
}

const updateDimensionPositions = () => drawDimensionLayers();

function drawDimensionLayers() {
  const L = LRef.value;
  const map = mapRef.value;
  if (!L || !map || !dimensionLayerGroup) return;

  dimensionLayerGroup.clearLayers();
  if (!dimensionData.length) return;

  for (const dim of dimensionData) {
    const fromLL = L.latLng(dim.from.lat, dim.from.lng);
    const toLL = L.latLng(dim.to.lat, dim.to.lng);
    const fromPt = map.latLngToLayerPoint(fromLL);
    const toPt = map.latLngToLayerPoint(toLL);

    const dx = toPt.x - fromPt.x;
    const dy = toPt.y - fromPt.y;
    const lengthPx = Math.sqrt(dx * dx + dy * dy);
    if (!lengthPx || !Number.isFinite(lengthPx)) continue;

    const midPt = L.point(fromPt.x + dx / 2, fromPt.y + dy / 2);
    const angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * 180) / Math.PI;
    if (!Number.isFinite(angleDeg)) angleDeg = 0;
    let uprightAngle = ((angleDeg % 360) + 360) % 360;
    if (uprightAngle > 90 && uprightAngle < 270) {
      uprightAngle = (uprightAngle + 180) % 360;
    }

    const perpX = -dy / lengthPx;
    const perpY = dx / lengthPx;

    let insideDir = 1;
    let outsideDir = -1;

    if (dim.centroid) {
      const centroidPt = map.latLngToLayerPoint(
        L.latLng(dim.centroid[0], dim.centroid[1])
      );
      const dot =
        (centroidPt.x - midPt.x) * perpX + (centroidPt.y - midPt.y) * perpY;
      if (dot < 0) {
        insideDir = -1;
        outsideDir = 1;
      }
    }

    const offsetBase = Math.min(Math.max(lengthPx * 0.05, 10), 24);

    if (dim.distanceText) {
      const labelPoint = L.point(
        midPt.x + perpX * offsetBase * insideDir,
        midPt.y + perpY * offsetBase * insideDir
      );
      const labelLatLng = map.layerPointToLatLng(labelPoint);
      const distanceIcon = L.divIcon({
        className: "dimension-label distance-label",
        html: `<div class="dim-box" style="transform: translate(-50%,-50%) rotate(${uprightAngle}deg);">${dim.distanceText}</div>`,
        iconAnchor: [0, 0],
      });
      const marker = L.marker(labelLatLng, {
        icon: distanceIcon,
        interactive: false,
      });

      dimensionLayerGroup.addLayer(marker);
    }

    const placeBearingLabel = (text: string, factor: number) => {
      const basePt = L.point(fromPt.x + dx * factor, fromPt.y + dy * factor);
      const labelPoint = L.point(
        basePt.x + perpX * offsetBase * outsideDir,
        basePt.y + perpY * offsetBase * outsideDir
      );
      const marker = L.marker(map.layerPointToLatLng(labelPoint), {
        icon: L.divIcon({
          className: "dimension-label bearing-label",
          html: `<div class="dim-box" style="transform: translate(-50%,-50%) rotate(${uprightAngle}deg);">${text}</div>`,
          iconAnchor: [0, 0],
        }),
        interactive: false,
      });

      dimensionLayerGroup.addLayer(marker);
    };

    if (dim.degreeText) placeBearingLabel(dim.degreeText, 0.2);
    if (dim.minuteText) placeBearingLabel(dim.minuteText, 0.8);
  }

  dimensionLayerGroup.bringToFront();
}

function splitBearingLabels(bearing?: {
  decimal?: number;
  degrees?: number;
  minutes?: number;
  seconds?: number;
}): { degreeText?: string; minuteText?: string } {
  if (!bearing) return {};

  let deg: number | undefined;
  let minutes: number | undefined;

  if (typeof bearing.decimal === "number" && Number.isFinite(bearing.decimal)) {
    const normalized = ((bearing.decimal % 360) + 360) % 360;
    deg = Math.trunc(normalized);
    minutes = Math.round(Math.abs(normalized - deg) * 60);
  } else if (
    typeof bearing.degrees === "number" &&
    Number.isFinite(bearing.degrees)
  ) {
    const normalized = ((bearing.degrees % 360) + 360) % 360;
    deg = Math.trunc(normalized);
    const baseMinutes =
      typeof bearing.minutes === "number" && Number.isFinite(bearing.minutes)
        ? Math.round(Math.abs(bearing.minutes))
        : 0;
    const secondsContribution =
      typeof bearing.seconds === "number" && Number.isFinite(bearing.seconds)
        ? Math.round(Math.abs(bearing.seconds) / 60)
        : 0;
    minutes = baseMinutes + secondsContribution;
  } else {
    return {};
  }

  if (typeof minutes === "number" && minutes >= 60) {
    const extraDegrees = Math.floor(minutes / 60);
    minutes -= extraDegrees * 60;
    deg = ((deg || 0) + extraDegrees) % 360;
  }

  const degreeValue = (((deg || 0) % 360) + 360) % 360;
  const degreeText = `${
    degreeValue < 10 ? `0${degreeValue}` : String(degreeValue)
  }°`;

  const minuteValue = Math.max(0, minutes ?? 0);
  const minuteText = `${String(Math.abs(minuteValue)).padStart(2, "0")}'`;

  return { degreeText, minuteText };
}

function attachDimensionEvents(map: any) {
  if (!map || dimensionEventsAttached) return;
  map.on("zoom", updateDimensionPositions);
  map.on("move", updateDimensionPositions);
  map.on("zoomend", updateDimensionPositions);
  map.on("resize", updateDimensionPositions);
  dimensionEventsAttached = true;
}

function detachDimensionEvents(map: any) {
  if (!map || !dimensionEventsAttached) return;
  map.off("zoom", updateDimensionPositions);
  map.off("move", updateDimensionPositions);
  map.off("zoomend", updateDimensionPositions);
  map.off("resize", updateDimensionPositions);
  dimensionEventsAttached = false;
}

onMounted(async () => {
  window.addEventListener("keydown", onKeydown);
  const L = await import("leaflet");
  LRef.value = L;
  if (!mapEl.value) return;
  // Decide CRS mode based on data
  crsMode.value = isGeographic.value ? "geo" : "simple";
  mapRef.value = L.map(mapEl.value, {
    crs: crsMode.value === "geo" ? L.CRS.EPSG3857 : L.CRS.Simple,
    attributionControl: true,
    zoomControl: true,
    minZoom: crsMode.value === "geo" ? 1 : -5,
    worldCopyJump: crsMode.value === "geo",
  });
  dimensionLayerGroup = L.featureGroup().addTo(mapRef.value);
  attachDimensionEvents(mapRef.value);
  await nextTick();
  mapRef.value.invalidateSize();
  setupBaseLayers();
  renderLayers();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  const map = mapRef.value;
  teardownBaseLayers();
  if (map) {
    detachDimensionEvents(map);
    if (dimensionLayerGroup) {
      map.removeLayer(dimensionLayerGroup);
    }
    map.remove();
  }
  mapRef.value = null;
  LRef.value = null;
  polygonLayers = [];
  pointLayers = [];
  centroidMarkers = [];
  dimensionLayerGroup = null;
  dimensionData = [];
});

watch(
  () => latLngs.value,
  () => {
    renderLayers();
  }
);

watch(
  () => props.legs,
  () => {
    renderLayers();
  },
  { deep: true }
);

// Switch base layer when toggled
watch(activeBaseKey, () => applyActiveBase());

// If CRS mode changes (e.g., user switches parcels with different coord systems), recreate the map
watch(isGeographic, async (geo) => {
  const L = LRef.value;
  const el = mapEl.value;
  if (!L || !el) return;
  const newMode: "geo" | "simple" = geo ? "geo" : "simple";
  if (newMode === crsMode.value && mapRef.value) return;
  // Teardown current
  if (mapRef.value) {
    teardownBaseLayers();
    detachDimensionEvents(mapRef.value);
    if (dimensionLayerGroup) {
      mapRef.value.removeLayer(dimensionLayerGroup);
      dimensionLayerGroup = null;
    }
    mapRef.value.remove();
  }
  // Recreate map
  crsMode.value = newMode;
  mapRef.value = L.map(el, {
    crs: crsMode.value === "geo" ? L.CRS.EPSG3857 : L.CRS.Simple,
    attributionControl: true,
    zoomControl: true,
    minZoom: crsMode.value === "geo" ? 1 : -5,
    worldCopyJump: crsMode.value === "geo",
  });
  dimensionLayerGroup = L.featureGroup().addTo(mapRef.value);
  attachDimensionEvents(mapRef.value);
  await nextTick();
  mapRef.value.invalidateSize();
  setupBaseLayers();
  renderLayers();
});

function onComplete() {
  emit("complete");
}
</script>

<style scoped>
:deep(.point-node-icon) {
  background: transparent;
  border: none;
}

:deep(.point-node) {
  width: 14px;
  height: 14px;
  border: 2px solid #000;
  background: #fff;
  border-radius: 2px;
  position: relative;
  box-sizing: border-box;
}

:deep(.point-node::after) {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: #000;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

:deep(.leaflet-tooltip.point-label) {
  background: transparent;
  border: none;
  box-shadow: none;
  color: #000;
  padding: 0;
  font-size: 13px;
  font-weight: 400;
}
:deep(.leaflet-tooltip.parcel-label) {
  background: transparent;
  border: none;
  box-shadow: none;
  color: #000;
  font-weight: 700;
  font-size: 14px;
  text-shadow: 1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white,
    -1px 1px 0 white;
}

:deep(.leaflet-tooltip.point-label.leaflet-tooltip-top:before) {
  display: none;
}

:deep(.spot-node-icon) {
  background: transparent;
  border: none;
}

:deep(.spot-node) {
  width: 7px;
  height: 7px;
  background: #000;
  border-radius: 50%;
  box-sizing: border-box;
}

:deep(.leaflet-tooltip.spot-label) {
  background: transparent;
  border: none;
  box-shadow: none;
  color: #000;
  padding: 0;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.15;
  text-align: center;
  text-shadow: 1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white,
    -1px 1px 0 white;
}

:deep(.leaflet-tooltip.spot-label .spot-elev) {
  font-size: 10px;
  color: #374151;
}

:deep(.leaflet-tooltip.spot-label.leaflet-tooltip-top:before) {
  display: none;
}

:deep(.leaflet-tooltip.road-label) {
  background: transparent;
  border: none;
  box-shadow: none;
  color: #374151;
  font-weight: 600;
  font-size: 12px;
  text-shadow: 1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white,
    -1px 1px 0 white;
}

:deep(.dimension-label) {
  margin: 0;
  padding: 0;
}

:deep(.dimension-label .dim-box) {
  background: transparent;
  padding: 0;
  font-size: 12px;
  font-weight: 500;
  color: #000;
  white-space: nowrap;
  display: inline-block;
  line-height: 1;
  text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff,
    -1px 1px 0 #fff;
}

:deep(.bearing-label .dim-box) {
  background: transparent;
  color: #000;
  padding: 0;
  font-size: 12px;
}

:deep(.distance-label .dim-box) {
  background: transparent;
  color: #000;
  padding: 0;
  font-size: 12px;
}
</style>
