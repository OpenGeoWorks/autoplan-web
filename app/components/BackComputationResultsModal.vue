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
            Back Computation Results
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Bearings and distances derived from the known coordinates
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
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">Area</h4>
            <p class="font-mono text-gray-900 dark:text-gray-100">{{ summary.area }}</p>
            <p
              v-if="!closeRing"
              class="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-sans"
            >
              An open traverse encloses no area.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">Bounding Box</h4>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Northing:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ summary.minNorthing }} – {{ summary.maxNorthing }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Easting:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">
                  {{ summary.minEasting }} – {{ summary.maxEasting }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Table -->
        <div class="overflow-x-auto border border-gray-200 dark:border-slate-600 rounded-lg">
          <table class="w-full text-xs">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr class="text-left text-gray-700 dark:text-gray-300">
                <th class="px-3 py-2 font-medium">Distance (m)</th>
                <th class="px-3 py-2 font-medium">Bearing</th>
                <th class="px-3 py-2 font-medium">Departure (&Delta;E)</th>
                <th class="px-3 py-2 font-medium">Latitude (&Delta;N)</th>
                <th class="px-3 py-2 font-medium">Easting (mE)</th>
                <th class="px-3 py-2 font-medium">Northing (mN)</th>
                <th class="px-3 py-2 font-medium">ID</th>
              </tr>
            </thead>
            <tbody>
              <!-- The opening station carries no leg of its own. -->
              <tr
                v-if="startInfo"
                class="border-t border-gray-100 dark:border-slate-700"
              >
                <td class="px-3 py-1.5"></td>
                <td class="px-3 py-1.5"></td>
                <td class="px-3 py-1.5"></td>
                <td class="px-3 py-1.5"></td>
                <td class="px-3 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                  {{ startInfo.easting }}
                </td>
                <td class="px-3 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                  {{ startInfo.northing }}
                </td>
                <td class="px-3 py-1.5 text-gray-900 dark:text-gray-100">
                  {{ startInfo.id }}
                </td>
              </tr>
              <tr
                v-for="(row, i) in rows"
                :key="i"
                class="border-t border-gray-100 dark:border-slate-700"
                :class="
                  row.isClosing
                    ? 'bg-amber-50/60 dark:bg-amber-900/10'
                    : ''
                "
              >
                <td class="px-3 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                  {{ row.distance }}
                </td>
                <td class="px-3 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                  {{ row.bearing }}
                </td>
                <td class="px-3 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                  {{ row.deltaE }}
                </td>
                <td class="px-3 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                  {{ row.deltaN }}
                </td>
                <td class="px-3 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                  {{ row.easting }}
                </td>
                <td class="px-3 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                  {{ row.northing }}
                </td>
                <td class="px-3 py-1.5 text-gray-900 dark:text-gray-100">
                  {{ row.toStation }}
                  <span
                    v-if="row.isClosing"
                    class="ml-1 text-[10px] text-amber-700 dark:text-amber-400"
                    >closing</span
                  >
                </td>
              </tr>
              <tr v-if="!rows.length">
                <td colspan="7" class="px-3 py-4 text-center text-gray-400">
                  No legs computed.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-600"
      >
        <button
          @click="exportToCSV"
          :disabled="!rows.length"
          class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
  decimal?: number;
}

interface Station {
  id: string;
  northing: number;
  easting: number;
  elevation?: number;
}

interface Leg {
  from: Station;
  to: Station;
  distance: number;
  bearing?: Bearing;
  delta_northing?: number;
  delta_easting?: number;
}

interface BackResults {
  traverse_legs: Leg[];
  traverse: {
    total_distance: number;
    area?: number;
    bounding_box: {
      min_northing: number;
      max_northing: number;
      min_easting: number;
      max_easting: number;
    };
  };
}

const props = defineProps<{
  show: boolean;
  results: BackResults | null;
  /**
   * Whether the ring was closed before computing. Drives the closing-leg
   * highlight and whether an area is meaningful — an open traverse encloses
   * none, and the endpoint reports 0 for it.
   */
  closeRing?: boolean;
}>();

defineEmits<{ close: [] }>();

const fmt = (v: number | undefined | null, d = 3): string => {
  if (v === undefined || v === null || isNaN(v)) return "";
  return v.toFixed(d);
};

const formatBearing = (b: Bearing | undefined): string => {
  if (!b) return "-";
  return `${b.degrees ?? 0}° ${b.minutes ?? 0}' ${fmt(b.seconds, 2)}"`;
};

// Square metres, with a hectares equivalent past a full hectare — the same
// threshold and precision the title block uses (feedback task 5).
const formatArea = (area: number | undefined | null): string => {
  if (area === undefined || area === null || isNaN(area) || area === 0) return "—";
  if (area >= 10000) {
    const hectares = area / 10000;
    return `${area.toFixed(3)} sqm (${hectares.toFixed(3)} hectares)`;
  }
  return `${area.toFixed(3)} sqm`;
};

const legs = computed(() => props.results?.traverse_legs ?? []);

const startInfo = computed(() => {
  const first = legs.value[0]?.from;
  if (!first) return null;
  return {
    id: first.id,
    northing: fmt(first.northing),
    easting: fmt(first.easting),
  };
});

const rows = computed(() =>
  legs.value.map((leg, i) => ({
    distance: fmt(leg.distance),
    bearing: formatBearing(leg.bearing),
    deltaE: fmt(leg.delta_easting),
    deltaN: fmt(leg.delta_northing),
    easting: fmt(leg.to.easting),
    northing: fmt(leg.to.northing),
    toStation: leg.to.id,
    // The ring is closed by repeating the first point, so the added leg is
    // always the last one.
    isClosing: Boolean(props.closeRing) && i === legs.value.length - 1,
  }))
);

const summary = computed(() => {
  if (!legs.value.length) return null;
  const t = props.results?.traverse;

  const ids = new Set<string>();
  legs.value.forEach((l) => {
    ids.add(l.from.id);
    ids.add(l.to.id);
  });

  return {
    totalDistance: fmt(t?.total_distance),
    stations: ids.size,
    area: formatArea(t?.area),
    minNorthing: fmt(t?.bounding_box?.min_northing),
    maxNorthing: fmt(t?.bounding_box?.max_northing),
    minEasting: fmt(t?.bounding_box?.min_easting),
    maxEasting: fmt(t?.bounding_box?.max_easting),
  };
});

const exportToCSV = () => {
  if (!legs.value.length) return;

  const headers = [
    "Distance (m)",
    "Bearing (D-M-S)",
    "Departure (m)",
    "Latitude (m)",
    "Easting (mE)",
    "Northing (mN)",
    "ID",
  ];

  const csvRows: string[] = [headers.join(",")];

  if (startInfo.value) {
    csvRows.push(
      ["", "", "", "", startInfo.value.easting, startInfo.value.northing, startInfo.value.id].join(",")
    );
  }

  legs.value.forEach((leg) => {
    csvRows.push(
      [
        fmt(leg.distance),
        `${leg.bearing?.degrees ?? 0}-${leg.bearing?.minutes ?? 0}-${fmt(leg.bearing?.seconds, 2)}`,
        fmt(leg.delta_easting),
        fmt(leg.delta_northing),
        fmt(leg.to.easting),
        fmt(leg.to.northing),
        leg.to.id,
      ].join(",")
    );
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `back_computation_results_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>
