<template>
  <div class="space-y-6">
    <!-- Computation method chooser: shown before the table when there are no prefilled/transferred coordinates -->
    <div
      class="p-6 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
    >
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Choose computation method
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Select how you'd like to compute or supply coordinates.
      </p>
      <div class="flex items-center gap-3">
        <button
          @click="goToForwardComputation"
          class="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Forward Computation
        </button>
        <button
          @click="goToTraverseComputation"
          class="px-4 py-2 text-sm rounded bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          Traverse Computation
        </button>
        <!-- <button
          @click="handleBackChoice"
          class="px-4 py-2 text-sm rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
        >
          Enter coordinates manually (Back)
        </button> -->
      </div>
    </div>

    <div class="flex items-center justify-center my-4">
      <span
        class="flex-grow border-t border-gray-300 dark:border-slate-600"
      ></span>
      <span class="mx-3 text-black dark:text-white"
        >or enter coordinates manually</span
      >
      <span
        class="flex-grow border-t border-gray-300 dark:border-slate-600"
      ></span>
    </div>

    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Coordinate Table
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
            Import coordinates (CSV or TXT or XLS/XLSX)
          </div>
          <div class="text-[11px] text-gray-600 dark:text-gray-400">
            Columns: GCP_Name, Easting, Northing
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

    <div ref="tableRef" class="overflow-x-auto">
      <table
        class="min-w-full text-sm border border-gray-200 dark:border-slate-600 rounded-md overflow-hidden"
      >
        <thead
          class="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
        >
          <tr>
            <th class="px-3 py-2 text-left">GCP_Name</th>
            <th class="px-3 py-2 text-left">Easting(mE)</th>
            <th class="px-3 py-2 text-left">Northing(mN)</th>
            <th class="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in local.coordinates"
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
              colspan="6"
              class="px-3 py-4 text-center text-xs text-gray-500 dark:text-gray-400"
            >
              No coordinates added yet.
            </td>
          </tr>
        </tbody>
      </table>
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
      <button
        @click="onComplete"
        :disabled="
          (props.planType !== 'topographic' && !local.coordinates.length) ||
          loading
        "
        class="px-4 py-2 ml-auto rounded bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
      >
        Save & Continue
      </button>
    </div>
    <p
      v-if="props.planType !== 'topographic'"
      class="text-[11px] text-gray-500 dark:text-gray-400"
    >
      Add at least one coordinate to proceed.
    </p>
  </div>

  <!-- Confirm clear all coordinates modal -->
  <ConfirmModal
    v-model="showClearConfirm"
    title="Clear all coordinates?"
    message="This will remove all coordinate rows from the table. This action cannot be undone."
    @confirmed="confirmClear"
  />
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import { useCoordinateTransfer } from "~/composables/useCoordinateTransfer";

interface CoordRow {
  _key: string;
  point: string;
  northing: number | null;
  easting: number | null;
}

const props = withDefaults(
  defineProps<{
    modelValue: { coordinates: CoordRow[] };
    loading?: boolean;
    planType?: string;
  }>(),
  { loading: false, planType: "" }
);
const emit = defineEmits(["update:modelValue", "complete"]);

const local = reactive<{ coordinates: CoordRow[] }>({ coordinates: [] });
const fileInputRef = ref<HTMLInputElement | null>(null);
const showClearConfirm = ref(false);
const tableRef = ref<HTMLElement | null>(null);
const showChooser = ref(true);
const route = useRoute();
const toast = useToast();

const {
  getTransferredCoordinates,
  clearTransferredCoordinates,
  hasTransferredCoordinates,
} = useCoordinateTransfer();

// Check for transferred coordinates when component mounts
onMounted(() => {
  if (hasTransferredCoordinates.value) {
    const transferredCoords = getTransferredCoordinates();

    // Convert transferred coordinates to the format expected by this component
    const convertedCoords = transferredCoords.map((coord) => ({
      _key: crypto.randomUUID(),
      point: coord.point,
      northing: coord.northing,
      easting: coord.easting,
    }));

    // Populate the local coordinates
    local.coordinates = convertedCoords;

    // Clear the transferred coordinates since we've used them
    clearTransferredCoordinates();

    // Show success message
    toast.add({
      title: `Successfully loaded ${convertedCoords.length} coordinates from forward computation!`,
      color: "success",
    });
    showChooser.value = false;
  }
});

// If props already contains coordinates (editing existing plan), bypass the chooser
if (
  Array.isArray(props.modelValue?.coordinates) &&
  props.modelValue.coordinates.length
) {
  showChooser.value = false;
}

function goToForwardComputation() {
  const projectId = route.params.id as string;
  const planId = route.params.plan as string;
  navigateTo(`/project/${projectId}/plan/${planId}/forward-computation`);
}

function goToTraverseComputation() {
  const projectId = route.params.id as string;
  const planId = route.params.plan as string;
  navigateTo(`/project/${projectId}/plan/${planId}/traverse-computation`);
}

function onBackComputation() {
  // Back computation means manually enter northings/eastings in the table.
  // Scroll the table into view to focus the user on manual entry.
  if (tableRef.value) {
    tableRef.value.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  // Provide a small hint so users know they can manually enter values.
  toast.add({
    title: "Enter northings and eastings manually",
    description: "Use the table to input coordinates for back computation.",
    color: "info",
  });
}

function handleBackChoice() {
  // reveal the table and focus it
  showChooser.value = false;
  onBackComputation();
}

function triggerFile() {
  fileInputRef.value?.click();
}

watch(
  () => props.modelValue.coordinates,
  (arr) => {
    if (Array.isArray(arr)) {
      local.coordinates = arr.map((r) => ({ ...r }));
    } else {
      local.coordinates = [];
    }
  },
  { immediate: true }
);

function addRow() {
  local.coordinates.push({
    _key: crypto.randomUUID(),
    point: "",
    northing: null,
    easting: null,
  });
}
function removeRow(idx: number) {
  local.coordinates.splice(idx, 1);
}
function clearAll() {
  if (!local.coordinates.length) return;
  showClearConfirm.value = true;
}
function confirmClear() {
  local.coordinates = [];
}
function onComplete() {
  // Topographic plans may save the perimeter survey step without any coordinates.
  if (local.coordinates.length || props.planType === "topographic") {
    emit("update:modelValue", { coordinates: [...local.coordinates] });
    emit("complete");
    return;
  }

  // Other plan types require at least one coordinate (button stays disabled).
  return;
}

import { parseTable } from "~/composables/useSheetParser";

async function onFile(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();

  try {
    if (ext === ".xls" || ext === ".xlsx") {
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        let rows = await parseTable(arrayBuffer);

        // Remove header row if detected
        if (Array.isArray(rows[0])) {
          const joined = String(rows[0].join(" ")).toLowerCase();
          if (
            /gcp_name|gcp|gcp_name|point|name|east|north|easting|northing/.test(
              joined
            )
          ) {
            rows = rows.slice(1);
          }
        }

        const parsed = rows
          .map((cols) => ({
            _key: crypto.randomUUID(),
            point: String(cols[0] ?? "").trim(),
            easting: cols[1] ? Number(cols[1]) : null,
            northing: cols[2] ? Number(cols[2]) : null,
          }))
          .filter((r) => r.point);
        if (parsed.length) local.coordinates = parsed;
        if (fileInputRef.value) fileInputRef.value.value = "";
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = async () => {
        const text = String(reader.result || "");
        let rows = await parseTable(text);

        // Remove header row if detected
        if (Array.isArray(rows[0])) {
          const joined = String(rows[0].join(" ")).toLowerCase();
          if (
            /gcp_name|gcp|gcp_name|point|name|east|north|easting|northing/.test(
              joined
            )
          ) {
            rows = rows.slice(1);
          }
        }

        const parsed = rows
          .map((cols) => ({
            _key: crypto.randomUUID(),
            point: String(cols[0] ?? "").trim(),
            easting: cols[1] ? Number(cols[1]) : null,
            northing: cols[2] ? Number(cols[2]) : null,
          }))
          .filter((r) => r.point);
        if (parsed.length) local.coordinates = parsed;
        if (fileInputRef.value) fileInputRef.value.value = "";
      };
      reader.readAsText(file);
    }
  } catch (err) {
    console.error("File import error:", err);
    if (fileInputRef.value) fileInputRef.value.value = "";
  }
}

function downloadTemplate() {
  const csv = [
    "GCP_Name,Easting,Northing",
    "P1,603781.688,869484.989",
    "P2,603926.144,869448.531",
    "P3,603852.11,869547.157",
    "P4,603786.856,869608.297",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "coordinates_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}
</script>
