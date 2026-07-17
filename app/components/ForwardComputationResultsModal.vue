<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div
      class="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-[95vw] w-full max-h-[90vh] overflow-hidden"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600"
      >
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Forward Computation Results
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Coordinates computed from the observed bearings and distances
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-auto max-h-[calc(90vh-200px)]">
        <!-- Summary -->
        <div
          v-if="summary"
          class="mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">Total Distance</h4>
            <p class="font-mono text-gray-900 dark:text-gray-100">{{ summary.totalDistance }} m</p>
          </div>
          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">Number of Stations</h4>
            <p class="font-mono text-gray-900 dark:text-gray-100">{{ summary.stations }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">Misclosure</h4>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Northing:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">{{ summary.northingMisclosure }} m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Easting:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">{{ summary.eastingMisclosure }} m</span>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">Area</h4>
            <p class="font-mono text-gray-900 dark:text-gray-100">{{ summary.area }}</p>
          </div>
        </div>

        <!-- Results Table -->
        <div class="overflow-x-auto border border-gray-200 dark:border-slate-600 rounded-lg">
          <table class="w-full text-xs">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th class="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">From Stn</th>
                <th class="px-3 py-2 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Bearing</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Distance (m)</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">ΔN (m)</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">ΔE (m)</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Northing (mN)</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Easting (mE)</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">To Stn</th>
              </tr>
            </thead>
            <tbody>
              <!-- Start station -->
              <tr
                v-if="startInfo"
                class="border-b border-gray-100 dark:border-slate-600 bg-yellow-50 dark:bg-yellow-900/20"
              >
                <td class="px-3 py-2 border-r border-gray-200 dark:border-slate-600"></td>
                <td class="px-3 py-2 border-r border-gray-200 dark:border-slate-600"></td>
                <td class="px-3 py-2 border-r border-gray-200 dark:border-slate-600"></td>
                <td class="px-3 py-2 border-r border-gray-200 dark:border-slate-600"></td>
                <td class="px-3 py-2 border-r border-gray-200 dark:border-slate-600"></td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ startInfo.northing }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ startInfo.easting }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">{{ startInfo.id }}</td>
              </tr>

              <!-- Computed legs -->
              <tr
                v-for="(row, index) in rows"
                :key="index"
                class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ row.fromStation }}</td>
                <td class="px-3 py-2 text-center font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ row.bearing }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ row.distance }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ row.deltaN }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ row.deltaE }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ row.northing }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ row.easting }}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">{{ row.toStation }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-600"
      >
        <button
          @click="exportToCSV"
          class="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          Export CSV
        </button>
        <button
          v-if="canSaveCoordinates"
          @click="$emit('save-coordinates')"
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Save Coordinates
        </button>
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

interface Bearing {
  degrees: number;
  minutes: number;
  seconds: number;
}

interface Point {
  id: string;
  northing: number;
  easting: number;
}

interface ComputedLeg {
  from: Point;
  to: Point;
  distance: number;
  bearing: Bearing;
  delta_northing: number;
  delta_easting: number;
}

interface Results {
  start?: Point;
  computed_legs?: ComputedLeg[];
  traverse?: {
    total_distance: number;
    bounding_box?: Record<string, number>;
    area?: number;
  };
  northing_misclosure?: number;
  easting_misclosure?: number;
  // Populated by the backend; may arrive at the top level or nested under `traverse`.
  area?: number;
}

const props = defineProps<{
  show: boolean;
  results: Results | null;
  canSaveCoordinates?: boolean;
}>();

defineEmits<{ close: []; "save-coordinates": [] }>();

const fmt = (v: number | undefined | null, d = 3): string => {
  if (v === undefined || v === null || isNaN(v)) return "";
  return v.toFixed(d);
};

const formatBearing = (b: Bearing | undefined): string => {
  if (!b) return "-";
  return `${b.degrees ?? 0}° ${b.minutes ?? 0}' ${b.seconds ?? 0}"`;
};

// Format an area in square metres, adding a hectares equivalent for large areas.
// Returns an em dash while the value is unavailable (e.g. before the backend supplies it).
const formatArea = (area: number | undefined | null): string => {
  if (area === undefined || area === null || isNaN(area)) return "—";
  if (area >= 10000) {
    const hectares = area / 10000;
    return `${area.toFixed(3)} sqm (${hectares.toFixed(3)} hectares)`;
  }
  return `${area.toFixed(3)} sqm`;
};

const legs = computed(() => props.results?.computed_legs ?? []);

const startInfo = computed(() => {
  const s = props.results?.start;
  if (!s) return null;
  return { id: s.id, northing: fmt(s.northing), easting: fmt(s.easting) };
});

const rows = computed(() =>
  legs.value.map((leg) => ({
    fromStation: leg.from.id,
    bearing: formatBearing(leg.bearing),
    distance: fmt(leg.distance),
    deltaN: fmt(leg.delta_northing),
    deltaE: fmt(leg.delta_easting),
    northing: fmt(leg.to.northing),
    easting: fmt(leg.to.easting),
    toStation: leg.to.id,
  }))
);

const summary = computed(() => {
  if (!legs.value.length) return null;

  const totalDistance =
    props.results?.traverse?.total_distance ??
    legs.value.reduce((sum, l) => sum + (isNaN(l.distance) ? 0 : l.distance), 0);

  // Unique stations across the traverse
  const ids = new Set<string>();
  if (props.results?.start) ids.add(props.results.start.id);
  legs.value.forEach((l) => {
    ids.add(l.from.id);
    ids.add(l.to.id);
  });

  const nMis = props.results?.northing_misclosure ?? 0;
  const eMis = props.results?.easting_misclosure ?? 0;

  const rawArea = props.results?.area ?? props.results?.traverse?.area;

  return {
    totalDistance: fmt(totalDistance),
    stations: ids.size,
    northingMisclosure: fmt(nMis),
    eastingMisclosure: fmt(eMis),
    area: formatArea(rawArea),
  };
});

const exportToCSV = () => {
  if (!legs.value.length && !startInfo.value) return;

  const headers = [
    "From Station",
    "Bearing (D-M-S)",
    "Distance (m)",
    "Delta Northing (m)",
    "Delta Easting (m)",
    "Northing (mN)",
    "Easting (mE)",
    "To Station",
  ];

  const csvRows: string[] = [headers.join(",")];

  if (startInfo.value) {
    csvRows.push(
      ["", "", "", "", "", startInfo.value.northing, startInfo.value.easting, startInfo.value.id].join(",")
    );
  }

  legs.value.forEach((leg) => {
    csvRows.push(
      [
        leg.from.id,
        `${leg.bearing.degrees}-${leg.bearing.minutes}-${leg.bearing.seconds}`,
        fmt(leg.distance),
        fmt(leg.delta_northing),
        fmt(leg.delta_easting),
        fmt(leg.to.northing),
        fmt(leg.to.easting),
        leg.to.id,
      ].join(",")
    );
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `forward_computation_results_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>
