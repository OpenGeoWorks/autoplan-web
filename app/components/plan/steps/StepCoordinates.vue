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
        These coordinates came from
        <strong>{{ uploadedFileName || "an uploaded file" }}</strong
        >. The survey holds
        <strong>{{ storedPointCount.toLocaleString() }}</strong> points and the
        table shows the first {{ local.coordinates.length }} — the full set is
        stored and used for the drawing. To change them, upload a replacement
        file.
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
            <th
              v-for="col in tableColumns"
              :key="col.key"
              draggable="true"
              :title="`Drag to move the ${col.label} column`"
              class="px-3 py-2 text-left cursor-grab active:cursor-grabbing select-none"
              :class="[
                dragKey === col.key ? 'opacity-40' : '',
                overKey === col.key ? 'bg-blue-100 dark:bg-blue-900/40' : '',
              ]"
              @dragstart="onHeaderDragStart(col.key)"
              @dragover.prevent="onHeaderDragOver(col.key)"
              @drop.prevent="onHeaderDrop(col.key)"
              @dragend="onHeaderDragEnd"
            >
              {{ col.label }}
            </th>
            <th class="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in local.coordinates"
            :key="row._key"
            class="border-t border-gray-200 dark:border-slate-700"
          >
            <td
              v-for="col in tableColumns"
              :key="col.key"
              class="px-3 py-1"
            >
              <input
                :value="(row as any)[col.key]"
                :type="col.type === 'text' ? 'text' : 'number'"
                :step="col.type === 'text' ? undefined : '0.01'"
                :class="[
                  col.type === 'text' ? 'w-16' : 'w-28',
                  'px-2 py-1 text-xs rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none',
                ]"
                :readonly="uploaded"
                :disabled="uploaded"
                @input="setCell(row, col, ($event.target as HTMLInputElement).value)"
              />
            </td>
            <td class="px-3 py-1 text-right">
              <button
                v-if="!uploaded"
                @click="removeRow(idx)"
                class="text-red-600 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </td>
          </tr>
          <tr v-if="!local.coordinates.length">
            <td
              :colspan="tableColumns.length + 1"
              class="px-3 py-4 text-center text-xs text-gray-500 dark:text-gray-400"
            >
              No coordinates added yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--
      Removing an uploaded survey is the only way back to a table the user can
      type in, since uploaded coordinates are not editable row by row. It is
      destructive and confirmed, because the points it discards are not in the
      browser to be undone.
    -->
    <div v-if="uploaded" class="flex gap-3">
      <button
        type="button"
        :disabled="removingUpload"
        @click="onRemoveUpload"
        class="px-3 py-1.5 text-xs rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
      >
        {{ removingUpload ? "Removing…" : "Remove uploaded coordinates" }}
      </button>
      <p class="self-center text-[11px] text-gray-500 dark:text-gray-400">
        Discards the survey and lets you enter coordinates by hand.
      </p>
    </div>

    <div class="flex gap-3">
      <button
        v-if="!uploaded"
        @click="addRow"
        type="button"
        class="px-3 py-1.5 text-xs rounded bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-700 dark:text-gray-200"
      >
        Add Row
      </button>
      <button
        v-if="!uploaded"
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

  <UploadProgressOverlay
    :show="uploadingFile"
    :label="uploadProgress"
    :percent="uploadPercent"
  />

  <!-- Column mapping modal (shown after a file upload) -->
  <CoordinateColumnMapper
    v-model="showMapper"
    :rows="rawRows"
    :fields="tableColumns"
    @confirm="onMappingConfirmed"
    @reorder="setOrder"
  />
</template>

<script setup lang="ts">
import { reactive, watch, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import { useCoordinateTransfer } from "~/composables/useCoordinateTransfer";
import CoordinateColumnMapper from "~/components/CoordinateColumnMapper.vue";
import UploadProgressOverlay from "~/components/UploadProgressOverlay.vue";
import {
  previewColumns,
  uploadCoordinateFile,
  clearUploadedCoordinates,
} from "~/composables/useCoordinateUpload";
import CadImportModal from "~/components/CadImportModal.vue";
import axios from "axios";
import {
  ID_FIELD,
  NORTHING_FIELD,
  EASTING_FIELD,
  type FieldDef,
  type MappedRow,
} from "~/utils/columnMapping";
import { useColumnOrder, applyStoredOrder } from "~/composables/useColumnOrder";
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
    /**
     * Set when the coordinates came from a file. The file is then the record
     * of the survey and this table is a preview of it, so the rows are not
     * editable -- changing them means uploading a different file.
     */
    pointSource?: { file_name?: string; uploaded_at?: string } | null;
  }>(),
  { loading: false, planType: "", pointCount: 0, pointSource: null }
);
const emit = defineEmits(["update:modelValue", "complete", "update:pointSource"]);

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

/**
 * Whether these coordinates came from a file.
 *
 * True either because one was just uploaded, or because the plan was loaded
 * and says so -- the table must be read-only on a revisit too, not only in
 * the session that did the uploading.
 */
const uploaded = computed(
  () => uploadedThisSession.value || Boolean(props.pointSource?.uploaded_at),
);
const uploadedFileName = computed(() => props.pointSource?.file_name ?? "");
const uploadedThisSession = ref(false);
watch(() => props.pointCount, (value) => { storedPointCount.value = value ?? 0; });
const showingPreview = computed(
  // Shown for any uploaded survey, not only one too large for the table: the
  // point is that the file is the record of it, which is true at 30 points as
  // much as at a million.
  () => uploaded.value || storedPointCount.value > local.coordinates.length,
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
// Keyed by the property each value lands on in a coordinate row, so a mapped
// row drops straight into the table without a translation step.
const MAPPER_FIELDS: FieldDef[] = [
  { ...ID_FIELD, key: "point", label: "GCP_Name" },
  { ...EASTING_FIELD, label: "Easting(mE)" },
  { ...NORTHING_FIELD, label: "Northing(mN)" },
];

/**
 * Column order of the table below. Starts at the declared order and follows
 * the uploaded file once a mapping is confirmed, so the table reads the way
 * the surveyor's own file does. The Remove button is not a field and stays
 * pinned at the end.
 */
const tableColumns = ref<FieldDef[]>(
  applyStoredOrder("coordinates", MAPPER_FIELDS),
);

// Dragging a heading moves the column and its data; it does not change which
// uploaded column feeds the field.
const {
  setOrder,
  dragKey,
  overKey,
  onHeaderDragStart,
  onHeaderDragOver,
  onHeaderDrop,
  onHeaderDragEnd,
} = useColumnOrder("coordinates", tableColumns);

/** Write a cell back, parsing to a number unless the field is text. */
function setCell(row: CoordRow, col: FieldDef, value: string) {
  (row as any)[col.key] =
    col.type === "text" ? value : value === "" ? null : Number(value);
}

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

// --- Survey uploads (Task 12) ----------------------------------------------
// Delimited files are parsed by the server, whatever their size: a browser
// cannot hold a million rows, and the plan document cannot hold them either.
// They live in the point store, and the table here shows a preview of them.
// Past a threshold the server queues the work rather than doing it in the
// request, and the overlay below follows that job.
const uploadingFile = ref(false);
const uploadProgress = ref("");
const uploadPercent = ref(0);
/** The file waiting on a column mapping; null when the rows are already here
 *  (an Excel sheet), set when only a preview of them is. */
const pendingFile = ref<File | null>(null);


async function sendCoordinateFile(file: File, mapping?: unknown) {
  uploadingFile.value = true;
  uploadPercent.value = 0;
  uploadProgress.value = "Uploading the file…";
  try {
    const outcome = await uploadCoordinateFile(planId.value, file, {
      mapping,
      onProgress: (p) => {
        // Sending is a real percentage; storing is not, so the bar goes
        // indeterminate rather than parking at 100 and looking stuck.
        uploadPercent.value = p.phase === "sending" ? p.percent : 0;
        uploadProgress.value = p.label;
      },
    });

    uploadedThisSession.value = true;
    storedPointCount.value = outcome.pointCount;
    // Tell the page straight away, or Save & Continue will post this preview
    // to the edit endpoint and be refused.
    emit("update:pointSource", outcome.pointSource ?? null);
    // Only the preview reaches the table. The survey itself stays in the
    // point store; the browser never holds it.
    local.coordinates = outcome.preview.map((c: any) => ({
      _key: crypto.randomUUID(),
      point: c.id,
      northing: c.northing,
      easting: c.easting,
    }));

    toast.add({
      title: `Imported ${outcome.pointCount.toLocaleString()} coordinate${
        outcome.pointCount === 1 ? "" : "s"
      }`,
      description:
        (outcome.pointCount > local.coordinates.length
          ? `Showing the first ${local.coordinates.length} in the table. `
          : "") +
        (outcome.skipped
          ? `${outcome.skipped} row(s) could not be read and were skipped.`
          : ""),
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
    uploadPercent.value = 0;
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

  // Excel cannot be streamed — it is a zip of XML that has to be inflated
  // whole — so it stays a client-side parse. Delimited text is read by the
  // server, whatever its size.
  if (ext === ".xls" || ext === ".xlsx") {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const rows = (await parseTable(reader.result as ArrayBuffer)) as string[][];
        if (fileInputRef.value) fileInputRef.value.value = "";
        if (!rows?.length) {
          toast.add({ title: "No rows found in file", color: "warning" });
          return;
        }
        pendingFile.value = null;
        rawRows.value = rows;
        showMapper.value = true;
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      if (fileInputRef.value) fileInputRef.value.value = "";
      toast.add({ title: "Could not read file", color: "error" });
    }
    return;
  }

  if (fileInputRef.value) fileInputRef.value.value = "";
  uploadingFile.value = true;
  uploadProgress.value = "Reading the first few rows…";
  try {
    // Only the head of the file goes up, and only a sample of rows comes
    // back. The mapping dialog needs enough to show which column is which,
    // and nothing more — a million rows would defeat the whole arrangement.
    const preview = await previewColumns(file);
    pendingFile.value = file;
    rawRows.value = preview.hasHeader
      ? [preview.headers, ...preview.sampleRows]
      : preview.sampleRows;
    showMapper.value = true;
  } catch (err: any) {
    toast.add({
      title: "Could not read that file",
      description: err?.response?.data?.message || err?.message,
      color: "error",
    });
  } finally {
    uploadingFile.value = false;
    uploadProgress.value = "";
  }
}

// Called when the user confirms the column mapping.
//
// For a delimited file the rows never came to the browser: the dialog worked
// from a sample, and what it produces is a set of column indices that the
// server applies to the whole file. Only an Excel sheet, which cannot be
// streamed, still carries its rows here.
async function onMappingConfirmed(
  mapped: MappedRow[],
  columns: { mapping: Record<string, number | null>; hasHeader: boolean },
) {
  const file = pendingFile.value;
  pendingFile.value = null;

  if (file) {
    // The rows above are only the sample the dialog was shown. The file
    // itself is still on disk here and is parsed on the server, using the
    // columns the user just picked.
    await sendCoordinateFile(file, columns.mapping);
    return;
  }

  // The table keeps whatever column order the user arranged — an upload
  // supplies values, not layout.
  const parsed = mapped.map((m) => ({
    _key: crypto.randomUUID(),
    point: String(m.point ?? ""),
    northing: m.northing as number | null,
    easting: m.easting as number | null,
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

const removingUpload = ref(false);

/**
 * Discard the uploaded survey and go back to an empty, typeable table.
 *
 * Confirmed first: the points are in the point store, not here, so there is
 * nothing to undo it with.
 */
async function onRemoveUpload() {
  const total = storedPointCount.value.toLocaleString();
  if (
    !window.confirm(
      `Remove the ${total} uploaded coordinates from this plan?\n\n` +
        "The survey will be discarded and you can enter coordinates by hand. " +
        "This cannot be undone.",
    )
  ) {
    return;
  }

  removingUpload.value = true;
  try {
    await clearUploadedCoordinates(planId.value);
    uploadedThisSession.value = false;
    // The page holds the plan's point_source and decides from it whether to
    // save this table. Left stale it would keep the table locked and keep
    // skipping the save, so the parent is told rather than left to find out.
    emit("update:pointSource", null);
    storedPointCount.value = 0;
    local.coordinates = [];
    emit("update:modelValue", { coordinates: [] });
    toast.add({ title: "Uploaded coordinates removed", color: "success" });
  } catch (err: any) {
    toast.add({
      title: "Could not remove the uploaded coordinates",
      description: err?.response?.data?.message || err?.message,
      color: "error",
    });
  } finally {
    removingUpload.value = false;
  }
}

</script>
