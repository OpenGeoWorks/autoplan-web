<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Spot Height Table
      </h2>
    </div>
    <div
      class="flex items-center justify-between gap-3 p-3 rounded-md border border-blue-200 dark:border-slate-700 bg-blue-50/70 dark:bg-slate-800/50"
    >
      <div class="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5 text-blue-600 dark:text-blue-400"
        >
          <path
            d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4A1 1 0 0 1 8.707 10.293L11 12.586V4a1 1 0 0 1 1-1z"
          />
          <path
            d="M4 15a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H6v3h12v-3h-1a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z"
          />
        </svg>
        <div>
          <div class="text-xs font-medium text-gray-800 dark:text-gray-200">
            Import topo points (CSV or TXT or XLS/XLSX)
          </div>
          <div class="text-[11px] text-gray-600 dark:text-gray-400">
            Any column order — you'll map columns after upload
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <input
          ref="fileInputRef"
          type="file"
          accept=".csv,.txt,.xls,.xlsx"
          @change="onFile"
          class="hidden"
        />
        <button
          type="button"
          @click="triggerFile"
          class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Upload CSV/TXT
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs rounded border border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-700/60"
          @click="downloadTemplate"
        >
          Download Template
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <div v-if="loading" class="p-6 flex items-center justify-center">
        <svg
          class="animate-spin h-6 w-6 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-300"
          >Parsing file, showing first {{ MAX_DISPLAY }} rows...</span
        >
      </div>
      <table
        v-else
        class="min-w-full text-sm border border-gray-200 dark:border-slate-600 rounded-md overflow-hidden"
      >
        <thead
          class="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
        >
          <tr>
            <th class="px-3 py-2 text-left">Point Name</th>
            <th class="px-3 py-2 text-left">Easting (mE)</th>
            <th class="px-3 py-2 text-left">Northing (mN)</th>
            <th class="px-3 py-2 text-left">Elevation (m)</th>
            <th class="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in displayedCoordinates"
            :key="row._key"
            class="border-t border-gray-200 dark:border-slate-700"
          >
            <td class="px-3 py-1">
              <input
                v-model="row.point"
                type="text"
                class="w-16 px-2 py-1 text-xs rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none"
              />
            </td>
            <td class="px-3 py-1">
              <input
                v-model.number="row.easting"
                type="number"
                step="0.01"
                class="w-28 px-2 py-1 text-xs rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none"
              />
            </td>
            <td class="px-3 py-1">
              <input
                v-model.number="row.northing"
                type="number"
                step="0.01"
                class="w-28 px-2 py-1 text-xs rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none"
              />
            </td>
            <td class="px-3 py-1">
              <input
                v-model.number="row.elevation"
                type="number"
                step="0.01"
                class="w-20 px-2 py-1 text-xs rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none"
              />
            </td>
            <td class="px-3 py-1 text-right">
              <button
                @click="removeRow(idx)"
                class="text-red-600 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </td>
          </tr>
          <tr v-if="!local.coordinates.length">
            <td
              colspan="5"
              class="px-3 py-4 text-center text-xs text-gray-500 dark:text-gray-400"
            >
              No topo points added yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-2 text-[11px] text-gray-600 dark:text-gray-300">
      <template v-if="totalCount > displayCount">
        Showing first {{ displayCount }} of {{ totalCount }} rows
      </template>
      <template v-else> Showing {{ totalCount }} rows </template>
    </div>

    <div class="flex gap-3">
      <button
        @click="addRow"
        type="button"
        class="px-3 py-1.5 text-xs rounded bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-700 dark:text-gray-200"
      >
        Add Row
      </button>
      <button
        @click="clearAll"
        type="button"
        :disabled="!local.coordinates.length"
        class="px-3 py-1.5 text-xs rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
      >
        Clear All
      </button>
    </div>
    <p class="text-[11px] text-gray-500 dark:text-gray-400">
      Add at least one topo point to proceed.
    </p>
    <div class="mt-3">
      <button
        v-if="totalCount > displayCount"
        @click="loadMore"
        type="button"
        class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Load next {{ MAX_DISPLAY }}
      </button>
    </div>

    <!-- Column mapping modal (shown after a file upload) -->
    <CoordinateColumnMapper
      v-model="showMapper"
      :rows="rawRows"
      :fields="MAPPER_FIELDS"
      @confirm="onMappingConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, nextTick, computed } from "vue";
const props = defineProps<{ modelValue: { coordinates: any[] } }>();
const emit = defineEmits(["update:modelValue"]);
const local = reactive<{ coordinates: any[] }>({ coordinates: [] });
// Flag to avoid echoing updates back to parent when applying incoming prop changes
const syncing = ref(false);

const fileInputRef = ref<HTMLInputElement | null>(null);
const loading = ref(false);
const showMapper = ref(false);
const rawRows = ref<string[][]>([]);
const MAX_DISPLAY = 100;

const displayCount = ref(MAX_DISPLAY);
const displayedCoordinates = computed(() =>
  local.coordinates.slice(
    0,
    Math.min(displayCount.value, local.coordinates.length)
  )
);
const totalCount = computed(() => local.coordinates.length);

watch(
  () => props.modelValue.coordinates,
  (arr) => {
    syncing.value = true;
    if (Array.isArray(arr)) {
      // keep objects as shallow copies so we can edit displayed rows and update the full array
      local.coordinates = arr.map((r) => ({ ...r }));
    } else {
      local.coordinates = [];
    }
    // Wait until next tick to re-enable emits so the local watcher doesn't echo this change
    nextTick(() => {
      syncing.value = false;
    });
  },
  { immediate: true }
);

// Emit updates when local coordinates change (deep) so parent stays in sync
watch(
  () => local.coordinates,
  (arr) => {
    if (syncing.value) return; // skip emits when we're applying incoming prop changes
    emit("update:modelValue", { coordinates: [...arr] });
  },
  { deep: true }
);

function addRow() {
  local.coordinates.push({
    _key: crypto.randomUUID(),
    point: "",
    northing: null,
    easting: null,
    elevation: null,
  });
  emit("update:modelValue", { coordinates: [...local.coordinates] });
}
function removeRow(idx: number) {
  // idx may be index within displayed slice; find the real index by _key for safety
  const row = displayedCoordinates.value[idx];
  if (!row) return;
  const realIdx = local.coordinates.findIndex((r) => r._key === row._key);
  if (realIdx !== -1) local.coordinates.splice(realIdx, 1);
  emit("update:modelValue", { coordinates: [...local.coordinates] });
}
function clearAll() {
  local.coordinates = [];
  emit("update:modelValue", { coordinates: [] });
}

// Load next chunk of rows (next MAX_DISPLAY) until we reach the end
function loadMore() {
  displayCount.value = Math.min(
    displayCount.value + MAX_DISPLAY,
    local.coordinates.length
  );
}

// Keep displayCount in-range when the underlying data changes
watch(
  () => totalCount.value,
  (n) => {
    if (n === 0) {
      displayCount.value = MAX_DISPLAY;
    } else if (displayCount.value > n) {
      displayCount.value = n;
    }
  }
);

function triggerFile() {
  fileInputRef.value?.click();
}

// parseCSV removed in favor of centralized parseTable. Header detection now
// lives in the column mapper (utils/columnMapping.ts).

import { parseTable } from "~/composables/useSheetParser";
import CoordinateColumnMapper from "~/components/CoordinateColumnMapper.vue";
import type { FieldDef, MappedCoordinate } from "~/utils/columnMapping";

// Fields the mapper lets the user assign for a topographic points upload.
// Elevation is required — spot heights are meaningless without it (and an
// unmapped elevation column is exactly how spot heights end up reading 0).
const MAPPER_FIELDS: FieldDef[] = [
  { key: "id", label: "Point ID", required: true },
  { key: "northing", label: "Northing", required: true },
  { key: "easting", label: "Easting", required: true },
  { key: "elevation", label: "Elevation", required: true },
];

async function onFile(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();

  const openMapper = (rows: string[][]) => {
    if (fileInputRef.value) fileInputRef.value.value = "";
    loading.value = false;
    if (!rows || !rows.length) return;
    rawRows.value = rows;
    showMapper.value = true;
  };

  try {
    loading.value = true;
    const reader = new FileReader();
    reader.onload = async () => {
      const rows =
        ext === ".xls" || ext === ".xlsx"
          ? await parseTable(reader.result as ArrayBuffer)
          : await parseTable(String(reader.result || ""));
      openMapper(rows as string[][]);
    };
    if (ext === ".xls" || ext === ".xlsx") reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
  } catch (err) {
    console.error("File import error:", err);
    if (fileInputRef.value) fileInputRef.value.value = "";
    loading.value = false;
  }
}

// Called when the user confirms the column mapping.
function onMappingConfirmed(mapped: MappedCoordinate[]) {
  const parsed = mapped.map((m) => ({
    _key: crypto.randomUUID(),
    point: m.point,
    northing: m.northing,
    easting: m.easting,
    elevation: m.elevation,
  }));
  if (parsed.length) {
    local.coordinates = parsed;
    displayCount.value = Math.min(MAX_DISPLAY, parsed.length);
    emit("update:modelValue", { coordinates: [...local.coordinates] });
  }
}

function downloadTemplate() {
  const csv = [
    "Point,Easting,Northing,Elevation",
    "TP1,603781.688,869484.989,120.5",
    "TP2,603926.144,869448.531,121.2",
    "TP3,603852.11,869547.157,119.8",
    "TP4,603786.856,869608.297,120.0",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "topopoints_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}
</script>
