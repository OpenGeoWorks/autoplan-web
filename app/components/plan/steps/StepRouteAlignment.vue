<template>
  <div>
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Route Alignment (Plan View)
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Enter the northing/easting of each chainage station to draw the route's
        plan view (horizontal alignment) above the longitudinal profile. You
        can skip this to produce a profile-only sheet.
      </p>
    </div>

    <!-- Plan view settings -->
    <div
      class="bg-gray-50 dark:bg-slate-900/40 rounded-md border border-gray-200 dark:border-slate-700 p-4 space-y-4 mb-6"
    >
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Plan View Settings
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label
            class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
          >
            Right of Way Width (m)
            <InfoTip
              text="Total width of the road corridor. Two edge lines are drawn at half this width on each side of the route centerline."
            />
          </label>
          <input
            v-model.number="local.params.right_of_way_width"
            type="number"
            step="1"
            min="0"
            class="w-full text-sm rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <label
          class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
        >
          <input
            type="checkbox"
            v-model="local.params.show_plan_view"
            class="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span class="flex items-center gap-1">
            Draw plan view
            <InfoTip
              text="Draws the horizontal alignment above the profile. Turn off for a profile-only sheet."
            />
          </span>
        </label>
        <label
          class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
        >
          <input
            type="checkbox"
            v-model="local.params.show_chainage_labels"
            class="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span class="flex items-center gap-1">
            Chainage labels
            <InfoTip
              text="Labels every station tick along the alignment with its chainage (e.g. 0+020)."
            />
          </span>
        </label>
      </div>
    </div>

    <!-- Stations Table -->
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Station Coordinates
      </h3>
      <div class="flex gap-2">
        <button
          v-if="missingStations.length && local.params.show_plan_view"
          @click="prefillFromElevations"
          class="px-3 py-1.5 text-xs border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          Prefill from elevation data
        </button>
        <button
          @click="downloadTemplate"
          class="px-3 py-1.5 text-xs border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          Download Template
        </button>
        <label class="cursor-pointer">
          <input
            ref="fileInputRef"
            type="file"
            accept=".csv,.txt,.xls,.xlsx"
            @change="onFile"
            class="hidden"
          />
          <span
            class="inline-block px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Import CSV/TXT
          </span>
        </label>
      </div>
    </div>

    <div
      class="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden mb-4"
    >
      <div class="overflow-x-auto max-h-96">
        <table class="w-full text-sm">
          <thead
            class="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700"
          >
            <tr>
              <th class="px-3 py-2 text-left">
                <span class="flex items-center gap-1">
                  Station
                  <InfoTip
                    text="Must match the point ids of your elevation data so each station gets both a position and a level."
                  />
                </span>
              </th>
              <th class="px-3 py-2 text-left">Northing (m)</th>
              <th class="px-3 py-2 text-left">Easting (m)</th>
              <th class="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in local.stations"
              :key="row._key"
              class="border-b border-gray-100 dark:border-slate-700/60"
            >
              <td class="px-3 py-1.5">
                <input
                  v-model="row.point"
                  type="text"
                  placeholder="CH0"
                  class="w-28 text-sm rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-2 py-1"
                />
              </td>
              <td class="px-3 py-1.5">
                <input
                  v-model.number="row.northing"
                  type="number"
                  step="0.001"
                  class="w-40 text-sm rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-2 py-1"
                />
              </td>
              <td class="px-3 py-1.5">
                <input
                  v-model.number="row.easting"
                  type="number"
                  step="0.001"
                  class="w-40 text-sm rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-2 py-1"
                />
              </td>
              <td class="px-3 py-1.5">
                <button
                  @click="local.stations.splice(idx, 1)"
                  class="text-red-500 hover:text-red-700 text-xs"
                >
                  ✕
                </button>
              </td>
            </tr>
            <tr v-if="!local.stations.length">
              <td
                colspan="4"
                class="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No stations yet — prefill from your elevation data or add rows.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <button
      @click="addRow"
      class="px-3 py-1.5 text-xs border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-slate-700"
    >
      + Add Station
    </button>

    <!-- Actions -->
    <div class="flex justify-between items-center gap-3 mt-8">
      <button
        @click="skip"
        :disabled="loading"
        class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
      >
        Skip (profile only)
      </button>
      <button
        @click="saveAndContinue"
        :disabled="loading || !isValid"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? "Saving..." : "Save & Continue" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import InfoTip from "~/components/InfoTip.vue";
import { parseTable } from "~/composables/useSheetParser";

interface StationRow {
  _key: string;
  point: string;
  northing: number | null;
  easting: number | null;
}

interface RouteParams {
  right_of_way_width: number;
  show_plan_view: boolean;
  show_chainage_labels: boolean;
}

interface AlignmentData {
  stations: StationRow[];
  params: RouteParams;
}

const props = defineProps<{
  modelValue: AlignmentData;
  elevationIds: string[];
}>();

const emit = defineEmits<{
  "update:model-value": [value: AlignmentData];
  complete: [];
}>();

const route = useRoute();
const toast = useToast();
const loading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const local = reactive<AlignmentData>({
  stations: props.modelValue.stations.map((s) => ({ ...s })),
  params: { ...props.modelValue.params },
});

watch(
  () => local,
  () => {
    emit("update:model-value", {
      stations: local.stations.map((s) => ({ ...s })),
      params: { ...local.params },
    });
  },
  { deep: true }
);

const missingStations = computed(() =>
  props.elevationIds.filter(
    (id) => !local.stations.some((s) => s.point === id)
  )
);

function prefillFromElevations() {
  for (const id of missingStations.value) {
    local.stations.push({
      _key: crypto.randomUUID(),
      point: id,
      northing: null,
      easting: null,
    });
  }
}

function downloadTemplate() {
  const csv = [
    "GCP_Name,Easting,Northing",
    "CH0,543080.000,711950.000",
    "CH1,543094.863,711963.384",
    "CH2,543109.726,711976.768",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "route_stations_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function applyImportedRows(rows: any[][]) {
  if (Array.isArray(rows[0])) {
    const joined = String(rows[0].join(" ")).toLowerCase();
    if (/gcp_name|gcp|point|name|east|north|easting|northing|station/.test(joined)) {
      rows = rows.slice(1);
    }
  }
  const parsed = rows
    .map((cols) => ({
      _key: crypto.randomUUID(),
      point: String(cols[0] ?? "").trim(),
      easting: cols[1] !== undefined && cols[1] !== "" ? Number(cols[1]) : null,
      northing: cols[2] !== undefined && cols[2] !== "" ? Number(cols[2]) : null,
    }))
    .filter((r) => r.point && r.easting != null && r.northing != null);
  if (parsed.length) {
    local.stations = parsed;
    toast.add({ title: `Imported ${parsed.length} stations`, color: "success" });
  } else {
    toast.add({ title: "No stations found in the file", color: "error" });
  }
}

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const isExcel = /\.(xls|xlsx)$/i.test(file.name);
  const reader = new FileReader();
  reader.onload = async () => {
    const rows = await parseTable(
      isExcel ? (reader.result as ArrayBuffer) : String(reader.result || "")
    );
    applyImportedRows(rows as any[][]);
    if (fileInputRef.value) fileInputRef.value.value = "";
  };
  if (isExcel) reader.readAsArrayBuffer(file);
  else reader.readAsText(file);
}

function addRow() {
  local.stations.push({
    _key: crypto.randomUUID(),
    point: "",
    northing: null,
    easting: null,
  });
}

const filledStations = computed(() =>
  local.stations.filter(
    (s) => s.point && s.northing != null && s.easting != null
  )
);

const isValid = computed(() => {
  // Either the plan view is off / nothing entered (profile only), or at
  // least two complete stations are provided.
  if (!local.stations.length) return true;
  return filledStations.value.length >= 2;
});

async function saveParams() {
  const planId = route.params.plan as string;
  const { $axios } = useNuxtApp();
  await $axios.put(`/plan/route/params/edit/${planId}`, {
    right_of_way_width: Number(local.params.right_of_way_width ?? 30),
    show_plan_view: !!local.params.show_plan_view,
    show_chainage_labels: !!local.params.show_chainage_labels,
  });
}

async function skip() {
  if (loading.value) return;
  try {
    loading.value = true;
    local.params.show_plan_view = false;
    await saveParams();
    emit("complete");
  } catch (error: any) {
    toast.add({
      title: "Failed to save plan view settings",
      description: error.response?.data?.message || "Please try again",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

async function saveAndContinue() {
  if (!isValid.value || loading.value) return;
  try {
    loading.value = true;
    const planId = route.params.plan as string;
    const { $axios } = useNuxtApp();

    if (filledStations.value.length >= 2) {
      await $axios.put(`/plan/coordinates/edit/${planId}`, {
        coordinates: filledStations.value.map((s) => ({
          id: s.point,
          northing: Number(s.northing),
          easting: Number(s.easting),
          elevation: 0,
        })),
      });
    }

    await saveParams();

    toast.add({ title: "Route alignment saved", color: "success" });
    emit("complete");
  } catch (error: any) {
    toast.add({
      title: "Failed to save route alignment",
      description: error.response?.data?.message || "Please try again",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>
