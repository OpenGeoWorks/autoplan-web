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
            Differential Leveling Results
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Reduced levels by the
            {{
              method === "rise-and-fall"
                ? "rise and fall"
                : "height of instrument"
            }}
            method
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
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">
              Totals
            </h4>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total BS (ΣBS):</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">{{ summary.totalBS.toFixed(3) }} m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total FS (ΣFS):</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">{{ summary.totalFS.toFixed(3) }} m</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">
              Arithmetic Check
            </h4>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">ΣBS − ΣFS:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">{{ summary.sightDiff.toFixed(3) }} m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Last RL − First RL:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">{{ summary.rlDiff.toFixed(3) }} m</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">
              Closure Check
            </h4>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Misclosure:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">{{ summary.misclosure.toFixed(3) }} m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Number of networks:</span>
                <span class="font-mono text-gray-900 dark:text-gray-100">{{ summary.setups }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border border-gray-200 dark:border-slate-600">
            <h4 class="font-medium text-gray-800 dark:text-gray-300 text-sm mb-2">
              Status
            </h4>
            <div class="text-xs">
              <span
                :class="summary.balanced ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                class="font-semibold"
              >
                {{ summary.balanced ? "✓ Arithmetic check passed" : "✗ Arithmetic check failed" }}
              </span>
              <p class="text-gray-500 dark:text-gray-400 mt-1">
                ΣBS − ΣFS should equal Last RL − First RL.
              </p>
            </div>
          </div>
        </div>

        <!-- Results Table -->
        <div class="overflow-x-auto border border-gray-200 dark:border-slate-600 rounded-lg">
          <table class="w-full text-xs">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th class="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Station</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Back Sight (m)</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Inter. Sight (m)</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Fore Sight (m)</th>
                <th v-if="method === 'height-of-instrument'" class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Height of Inst. (m)</th>
                <th v-else class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Rise (m)</th>
                <th v-if="method === 'rise-and-fall'" class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Fall (m)</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Correction (m)</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-600">Uncorrected RL (m)</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Reduced Level (m)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(s, index) in stations"
                :key="index"
                class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ s.stn }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ fmt(s.back_sight) }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ fmt(s.intermediate_sight) }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ fmt(s.fore_sight) }}</td>
                <td v-if="method === 'height-of-instrument'" class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ fmt(s.height_of_instrument) }}</td>
                <td v-else class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ fmt(s.rise) }}</td>
                <td v-if="method === 'rise-and-fall'" class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ fmt(s.fall) }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ fmt(s.correction) }}</td>
                <td class="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-600">{{ fmt(s.uncorrected_reduced_level) }}</td>
                <td class="px-3 py-2 text-right font-mono font-semibold text-red-600 dark:text-red-400">{{ fmt(s.reduced_level) }}</td>
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
          v-if="canSave"
          @click="$emit('save')"
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Save Leveling Data
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

interface Station {
  stn: string;
  back_sight?: number;
  intermediate_sight?: number;
  fore_sight?: number;
  height_of_instrument?: number;
  rise?: number;
  fall?: number;
  correction?: number;
  uncorrected_reduced_level?: number;
  reduced_level?: number;
}

interface Results {
  stations: Station[];
  misclosure?: number;
  number_of_networks?: number;
}

const props = defineProps<{
  show: boolean;
  results: Results | null;
  method: "height-of-instrument" | "rise-and-fall";
  canSave?: boolean;
}>();

defineEmits<{ close: []; save: [] }>();

const fmt = (v: number | undefined | null): string => {
  if (v === undefined || v === null || isNaN(v)) return "";
  return v.toFixed(3);
};

const stations = computed(() => props.results?.stations ?? []);

const summary = computed(() => {
  const list = stations.value;
  if (!list.length) return null;

  const round3 = (n: number) => Math.round(n * 1000) / 1000;
  const totalBS = list.reduce(
    (sum, s) => sum + (typeof s.back_sight === "number" ? s.back_sight : 0),
    0
  );
  const totalFS = list.reduce(
    (sum, s) => sum + (typeof s.fore_sight === "number" ? s.fore_sight : 0),
    0
  );
  // The arithmetic check (ΣBS − ΣFS = Last RL − First RL) holds for the raw
  // reduction, so it runs on the uncorrected levels — applying the misclosure
  // correction shifts the final RLs and would break the check.
  const rawRL = (s: Station | undefined) =>
    s?.uncorrected_reduced_level ?? s?.reduced_level ?? 0;
  const firstRL = rawRL(list[0]);
  const lastRL = rawRL(list[list.length - 1]);
  const sightDiff = round3(totalBS - totalFS);
  const rlDiff = round3(lastRL - firstRL);

  return {
    totalBS: round3(totalBS),
    totalFS: round3(totalFS),
    sightDiff,
    rlDiff,
    balanced: Math.abs(sightDiff - rlDiff) < 0.0005,
    misclosure: props.results?.misclosure ?? 0,
    setups: props.results?.number_of_networks ?? 0,
  };
});

const exportToCSV = () => {
  const list = stations.value;
  if (!list.length) return;

  const headers = ["Station", "Back Sight(m)", "Intermediate Sight(m)", "Fore Sight(m)"];
  if (props.method === "height-of-instrument") {
    headers.push("Height of Instrument(m)");
  } else {
    headers.push("Rise(m)", "Fall(m)");
  }
  headers.push("Correction(m)", "Uncorrected Reduced Level(m)", "Reduced Level(m)");

  const rows = list.map((s) => {
    const cols = [s.stn, fmt(s.back_sight), fmt(s.intermediate_sight), fmt(s.fore_sight)];
    if (props.method === "height-of-instrument") {
      cols.push(fmt(s.height_of_instrument));
    } else {
      cols.push(fmt(s.rise), fmt(s.fall));
    }
    cols.push(
      fmt(s.correction),
      fmt(s.uncorrected_reduced_level),
      fmt(s.reduced_level)
    );
    return cols.join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `differential_leveling_results_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>
