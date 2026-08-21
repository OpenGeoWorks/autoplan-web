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
            Import coordinates (CSV, TXT, XLS/XLSX or a CAD drawing)
          </div>
          <div class="text-[11px] text-gray-600 dark:text-gray-400">
            Any column order — you'll map columns after upload. DWG/DXF
            drawings are read directly, so an old plan needs no spreadsheet.
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span
          v-if="uploadingFile"
          class="text-xs text-gray-600 dark:text-gray-400"
          >{{ uploadProgress }}</span
        >
        <input
          ref="fileInputRef"
          type="file"
          accept=".csv,.txt,.xls,.xlsx,.dwg,.dxf"
          @change="onFile"
          class="hidden"
        />
        <button
          type="button"
          @click="triggerFile"
          class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Upload file
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

    <!-- A large survey is stored whole and previewed here. Editing a preview
         would discard everything it does not show, so the table says so. -->
    <div
      v-if="showingPreview"
      class="rounded-md border border-blue-300 bg-blue-50 dark:border-blue-800/60 dark:bg-blue-900/20 px-3 py-2"
    >
      <p class="text-xs text-blue-900 dark:text-blue-200">
        This survey holds
        <strong>{{ storedPointCount.toLocaleString() }}</strong> points. The
        table shows the first {{ local.coordinates.length }} — the full set is
        stored and used for the drawing. To change the survey, upload a
        replacement file.
      </p>
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

  <!-- Legacy CAD import (shown after a DWG/DXF upload) -->
  <CadImportModal
    :open="showCadImport"
    :inspection="cadInspection"
    :busy="cadBusy"
    @close="closeCadImport"
    @reinspect="onCadReinspect"
    @confirm="onCadConfirmed"
  />

  <!-- Column mapping modal (shown after a file upload) -->
  <CoordinateColumnMapper
    v-model="showMapper"
    :rows="rawRows"
    :fields="MAPPER_FIELDS"
    @confirm="onMappingConfirmed"
  />
</template>

<script setup lang="ts">
import { reactive, watch, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import { useCoordinateTransfer } from "~/composables/useCoordinateTransfer";
import CoordinateColumnMapper from "~/components/CoordinateColumnMapper.vue";
import CadImportModal from "~/components/CadImportModal.vue";
import axios from "axios";
import type { FieldDef, MappedCoordinate } from "~/utils/columnMapping";
import type { CadInspection, CadStation } from "~/utils/cadImport";
import { isCadFile } from "~/utils/cadImport";

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
    /** Survey points held in the point store; the table shows a preview of them. */
    pointCount?: number;
  }>(),
  { loading: false, planType: "", pointCount: 0 }
);
const emit = defineEmits(["update:modelValue", "complete"]);

const local = reactive<{ coordinates: CoordRow[] }>({ coordinates: [] });
const fileInputRef = ref<HTMLInputElement | null>(null);
const showClearConfirm = ref(false);
const showMapper = ref(false);
const rawRows = ref<string[][]>([]);
const tableRef = ref<HTMLElement | null>(null);
const showChooser = ref(true);
const route = useRoute();
const toast = useToast();

const planId = computed(() => route.params.plan as string);

// A large survey lives in the point store; the table holds a preview of it.
const storedPointCount = ref(props.pointCount ?? 0);
watch(() => props.pointCount, (value) => { storedPointCount.value = value ?? 0; });
const showingPreview = computed(
  () => storedPointCount.value > local.coordinates.length,
);

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

// Fields the mapper lets the user assign for a cadastral/generic coordinate
// upload. Elevation is not part of the coordinate table here.
const MAPPER_FIELDS: FieldDef[] = [
  { key: "id", label: "Point ID", required: true },
  { key: "northing", label: "Northing", required: true },
  { key: "easting", label: "Easting", required: true },
];

// --- Legacy CAD import (Task 11) -------------------------------------------
// A DWG cannot be parsed in the browser, so it goes to the API, which forwards
// it to the drawing engine. What comes back is every closed shape the drawing
// holds, so the user picks their boundary instead of the app guessing.
const showCadImport = ref(false);
const cadBusy = ref(false);
const cadInspection = ref<CadInspection | null>(null);
const cadFile = ref<File | null>(null);

async function inspectCadFile(file: File, units?: number) {
  const form = new FormData();
  form.append("file", file);
  if (units !== undefined) form.append("units", String(units));

  const { data } = await axios.post("/plan/cad/inspect", form);
  return data?.data as CadInspection;
}

async function openCadImport(file: File) {
  cadFile.value = file;
  cadInspection.value = null;
  showCadImport.value = true;
  cadBusy.value = true;
  try {
    cadInspection.value = await inspectCadFile(file);
    if (!cadInspection.value?.rings?.length) {
      toast.add({
        title: "No closed boundary found in that drawing",
        description: "Check the layer the boundary is on, or that it is closed.",
        color: "warning",
      });
    }
  } catch (err: any) {
    showCadImport.value = false;
    toast.add({
      title: "Could not read that drawing",
      description: err?.response?.data?.message || err?.message,
      color: "error",
    });
  } finally {
    cadBusy.value = false;
  }
}

// Re-reads the drawing when the user corrects its units; the file is still in
// memory so this costs one request, not a re-upload by the user.
async function onCadReinspect(units: number) {
  if (!cadFile.value) return;
  cadBusy.value = true;
  try {
    cadInspection.value = await inspectCadFile(cadFile.value, units);
  } catch (err: any) {
    toast.add({
      title: "Could not re-read that drawing",
      description: err?.response?.data?.message || err?.message,
      color: "error",
    });
  } finally {
    cadBusy.value = false;
  }
}

function closeCadImport() {
  showCadImport.value = false;
  cadInspection.value = null;
  cadFile.value = null;
}

function onCadConfirmed(stations: CadStation[]) {
  local.coordinates = stations.map((station) => ({
    _key: crypto.randomUUID(),
    point: station.id,
    northing: station.northing,
    easting: station.easting,
  }));
  closeCadImport();
  toast.add({
    title: `Imported ${stations.length} coordinate${stations.length === 1 ? "" : "s"} from the drawing`,
    color: "success",
  });
}

// --- Large survey uploads (Task 12) ----------------------------------------
// Anything past this many rows is sent to the server to be parsed and stored,
// rather than parsed in the tab. A browser cannot hold a million rows, and the
// plan document cannot hold them either — they live in the point store, and
// this table shows a preview of them.
const SERVER_PARSE_THRESHOLD = 2000;
const uploadingFile = ref(false);
const uploadProgress = ref("");

/** Rough row count without materialising the file. */
async function countRows(file: File): Promise<number> {
  const sample = await file.slice(0, 256 * 1024).text();
  const lines = sample.split(/\r?\n/).filter((line) => line.trim()).length;
  if (file.size <= 256 * 1024) return lines;
  return Math.round((lines / sample.length) * file.size);
}

async function uploadCoordinateFile(file: File, mapping?: unknown) {
  uploadingFile.value = true;
  uploadProgress.value = "Uploading and parsing…";
  try {
    const params = new URLSearchParams({ file_name: file.name });
    if (mapping) params.set("mapping", JSON.stringify(mapping));

    // The body is the file itself: the server streams it into its parser, so
    // nothing here ever builds an array of rows.
    const { data } = await axios.post(
      `/plan/coordinates/upload/${planId.value}?${params.toString()}`,
      file,
      { headers: { "Content-Type": "application/octet-stream" } },
    );

    const plan = data?.data;
    const stored = plan?.point_count ?? 0;
    storedPointCount.value = stored;
    local.coordinates = (plan?.coordinates ?? []).map((c: any) => ({
      _key: crypto.randomUUID(),
      point: c.id,
      northing: c.northing,
      easting: c.easting,
    }));

    const skipped = plan?.point_source?.skipped_rows ?? 0;
    toast.add({
      title: `Imported ${stored.toLocaleString()} coordinate${stored === 1 ? "" : "s"}`,
      description:
        (stored > local.coordinates.length
          ? `Showing the first ${local.coordinates.length} in the table. `
          : "") + (skipped ? `${skipped} row(s) could not be read and were skipped.` : ""),
      color: "success",
    });
  } catch (err: any) {
    toast.add({
      title: "Could not import that file",
      description: err?.response?.data?.message || err?.message,
      color: "error",
    });
  } finally {
    uploadingFile.value = false;
    uploadProgress.value = "";
  }
}

async function onFile(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();

  if (isCadFile(file.name)) {
    if (fileInputRef.value) fileInputRef.value.value = "";
    await openCadImport(file);
    return;
  }

  // Excel cannot be streamed — it is a zip of XML that must be inflated whole
  // — so it stays a client-side parse and keeps the mapping dialog. Delimited
  // text goes to the server once it is big enough to matter.
  const isDelimited = ext !== ".xls" && ext !== ".xlsx";
  if (isDelimited && (await countRows(file)) > SERVER_PARSE_THRESHOLD) {
    if (fileInputRef.value) fileInputRef.value.value = "";
    await uploadCoordinateFile(file);
    return;
  }

  const openMapper = (rows: string[][]) => {
    if (fileInputRef.value) fileInputRef.value.value = "";
    if (!rows || !rows.length) {
      toast.add({ title: "No rows found in file", color: "warning" });
      return;
    }
    rawRows.value = rows;
    showMapper.value = true;
  };

  try {
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
    toast.add({ title: "Could not read file", color: "error" });
  }
}

// Called when the user confirms the column mapping.
function onMappingConfirmed(mapped: MappedCoordinate[]) {
  const parsed = mapped.map((m) => ({
    _key: crypto.randomUUID(),
    point: m.point,
    northing: m.northing,
    easting: m.easting,
  }));
  if (parsed.length) {
    local.coordinates = parsed;
    toast.add({
      title: `Imported ${parsed.length} coordinate${parsed.length === 1 ? "" : "s"}`,
      color: "success",
    });
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
