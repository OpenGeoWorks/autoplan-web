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
            <th
              v-for="col in tableColumns"
              :key="col.key"
              draggable="true"
              :title="`Drag to move the ${col.label} column`"
              @dragstart="onHeaderDragStart(col.key)"
              @dragover.prevent="onHeaderDragOver(col.key)"
              @drop.prevent="onHeaderDrop(col.key)"
              @dragend="onHeaderDragEnd"
              class="cursor-grab active:cursor-grabbing select-none px-3 py-2 text-left"
                            :class="[
              dragKey === col.key ? 'opacity-40' : '',
              overKey === col.key ? 'bg-blue-100 dark:bg-blue-900/40' : '',
              ]"
            >
              {{ col.label }}
            </th>
            <th class="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in displayedCoordinates"
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
              No topo points added yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-2 text-[11px] text-gray-600 dark:text-gray-300">
      <template v-if="uploaded">
        Showing the first
        <strong>{{ local.coordinates.length.toLocaleString() }}</strong> of
        <strong>{{ storedPointCount.toLocaleString() }}</strong> points from
        <strong>{{ uploadedFileName || "your file" }}</strong
        >. Upload another file to change them.
      </template>
      <template v-else-if="totalCount > displayCount">
        Showing first {{ displayCount }} of {{ totalCount }} rows
      </template>
      <template v-else> Showing {{ totalCount }} rows </template>
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

    <div v-if="!uploaded" class="flex gap-3">
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
    <p v-if="!uploaded" class="text-[11px] text-gray-500 dark:text-gray-400">
      Add at least one topo point to proceed.
    </p>
    <div class="mt-3">
      <button
        v-if="!uploaded && totalCount > displayCount"
        @click="loadMore"
        type="button"
        class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Load next {{ MAX_DISPLAY }}
      </button>
    </div>

    <!-- Column mapping modal (shown after a file upload) -->
    <UploadProgressOverlay
      :show="uploading"
      :label="uploadLabel"
      :percent="uploadPercent"
    />

    <CoordinateColumnMapper
      v-model="showMapper"
      :rows="rawRows"
      :fields="tableColumns"
      @confirm="onMappingConfirmed"
      @reorder="setOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, nextTick, computed } from "vue";
import { useRoute } from "vue-router";
const props = defineProps<{
  modelValue: { coordinates: any[] };
  /** Survey points held in the point store; the table shows a preview. */
  pointCount?: number;
  /**
   * Set when the coordinates came from a file. The file is then the record of
   * the survey and this table is a preview of it, so the rows are not
   * editable -- changing them means uploading a different file.
   */
  pointSource?: { file_name?: string; uploaded_at?: string } | null;
}>();
const emit = defineEmits(["update:modelValue", "update:pointSource"]);
const local = reactive<{ coordinates: any[] }>({ coordinates: [] });
// Flag to avoid echoing updates back to parent when applying incoming prop changes
const syncing = ref(false);

const fileInputRef = ref<HTMLInputElement | null>(null);
const loading = ref(false);
const route = useRoute();
const planId = computed(() => route.params.plan as string);
const toast = useToast();

// A large survey lives in the point store; the table holds a preview of it.
const storedPointCount = ref(props.pointCount ?? 0);
watch(
  () => props.pointCount,
  (value) => {
    if (!serverBacked.value) storedPointCount.value = value ?? 0;
  },
);
const uploading = ref(false);
const uploadPercent = ref(0);
const uploadLabel = ref("");
/** The file waiting on a column mapping; null when the rows are already here
 *  (an Excel sheet), set when only a preview of them is. */
const pendingFile = ref<File | null>(null);
/** True when the survey lives in the point store rather than in this table,
 *  which is what decides whether a column change is re-read on the server. */
const serverBacked = ref(false);

/**
 * Whether these coordinates came from a file.
 *
 * True either because one was just uploaded, or because the plan was loaded
 * and says so -- the table has to be read-only on a revisit too, not only in
 * the session that did the uploading.
 */
const uploaded = computed(
  () => serverBacked.value || Boolean(props.pointSource?.uploaded_at),
);
const uploadedFileName = computed(() => props.pointSource?.file_name ?? "");
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
import {
  previewColumns,
  uploadCoordinateFile,
  remapColumns,
  clearUploadedCoordinates,
} from "~/composables/useCoordinateUpload";
import CoordinateColumnMapper from "~/components/CoordinateColumnMapper.vue";
import UploadProgressOverlay from "~/components/UploadProgressOverlay.vue";
import {
  ID_FIELD,
  NORTHING_FIELD,
  EASTING_FIELD,
  ELEVATION_FIELD,
  asRequired,
  type FieldDef,
  type MappedRow,
} from "~/utils/columnMapping";
import { useColumnOrder, applyStoredOrder } from "~/composables/useColumnOrder";

// Fields the mapper lets the user assign for a topographic points upload.
// Elevation is required — spot heights are meaningless without it (and an
// unmapped elevation column is exactly how spot heights end up reading 0).
const MAPPER_FIELDS: FieldDef[] = [
  { ...ID_FIELD, key: "point", label: "Point Name" },
  { ...EASTING_FIELD, label: "Easting (mE)" },
  { ...NORTHING_FIELD, label: "Northing (mN)" },
  { ...asRequired(ELEVATION_FIELD), label: "Elevation (m)" },
];

/** Column order of the table; follows the uploaded file once mapped. */
const tableColumns = ref<FieldDef[]>(
  applyStoredOrder("topo-points", MAPPER_FIELDS),
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
} = useColumnOrder("topo-points", tableColumns);

/** Write a cell back, parsing to a number unless the field is text. */
function setCell(row: any, col: FieldDef, value: string) {
  row[col.key] =
    col.type === "text" ? value : value === "" ? null : Number(value);
}

async function onFile(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  if (fileInputRef.value) fileInputRef.value.value = "";

  // Excel is a zip of XML and cannot be streamed, so it is still inflated
  // here — but those files are small by nature. A delimited survey is not:
  // reading a 58 MB CSV in the tab and turning it into a million row arrays
  // is what took the browser down, so it never happens now.
  if (ext === ".xls" || ext === ".xlsx") {
    loading.value = true;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const rows = (await parseTable(reader.result as ArrayBuffer)) as string[][];
        pendingFile.value = null;
        if (rows?.length) {
          rawRows.value = rows;
          showMapper.value = true;
        }
      } finally {
        loading.value = false;
      }
    };
    reader.readAsArrayBuffer(file);
    return;
  }

  uploading.value = true;
  uploadPercent.value = 0;
  uploadLabel.value = "Reading the first few rows…";
  try {
    // The head of the file goes up; a sample of rows comes back. Enough to
    // show which column is which, and nothing more.
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
    uploading.value = false;
    uploadLabel.value = "";
  }
}

/** Put a preview from the server into the table. */
function showPreview(outcome: {
  preview: any[];
  pointCount: number;
  skipped: number;
  pointSource?: any;
}) {
  serverBacked.value = true;
  storedPointCount.value = outcome.pointCount;
  // Tell the page straight away. It otherwise only learns this when the plan
  // is loaded, so a survey uploaded and saved in one sitting still looked
  // typed -- and Save & Continue posted the preview to the edit endpoint.
  emit("update:pointSource", outcome.pointSource ?? null);
  local.coordinates = outcome.preview.map((c: any) => ({
    _key: crypto.randomUUID(),
    point: String(c.id ?? ""),
    northing: c.northing ?? null,
    easting: c.easting ?? null,
    elevation: c.elevation ?? null,
  }));
  displayCount.value = Math.min(MAX_DISPLAY, local.coordinates.length);
  emit("update:modelValue", { coordinates: [...local.coordinates] });

  toast.add({
    title: `Imported ${outcome.pointCount.toLocaleString()} point${
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
}

// Called when the user confirms the column mapping.
//
// For a delimited file the rows never came here: the dialog worked from a
// sample, and what it produces is a set of column indices. Those go to the
// server, which re-reads the file it still has — so a survey of any size can
// be rearranged without a coordinate crossing the wire.
async function onMappingConfirmed(
  mapped: MappedRow[],
  columns: { mapping: Record<string, number | null>; hasHeader: boolean },
) {
  const file = pendingFile.value;
  pendingFile.value = null;

  if (file) {
    uploading.value = true;
    uploadPercent.value = 0;
    uploadLabel.value = "Uploading the file…";
    try {
      showPreview(
        await uploadCoordinateFile(planId.value, file, {
          mapping: columns.mapping,
          onProgress: (p) => {
            uploadPercent.value = p.phase === "sending" ? p.percent : 0;
            uploadLabel.value = p.label;
          },
        }),
      );
    } catch (err: any) {
      toast.add({
        title: "Could not import that file",
        description: err?.response?.data?.message || err?.message,
        color: "error",
      });
    } finally {
      uploading.value = false;
      uploadLabel.value = "";
      uploadPercent.value = 0;
    }
    return;
  }

  // Already uploaded, and the user has changed their mind about the columns:
  // the server re-reads its copy. Tested on where the data came from, not on
  // whether rows arrived -- the dialog always returns its sample rows mapped,
  // so counting them would send a 1.5-million-point survey back to 25.
  if (serverBacked.value) {
    uploading.value = true;
    uploadLabel.value = "Re-reading the survey with the new columns…";
    try {
      showPreview(await remapColumns(planId.value, columns.mapping));
    } finally {
      uploading.value = false;
      uploadLabel.value = "";
    }
    return;
  }

  // An Excel sheet: its rows really are here.
  const parsed = mapped.map((m) => ({
    _key: crypto.randomUUID(),
    point: String(m.point ?? ""),
    northing: m.northing as number | null,
    easting: m.easting as number | null,
    elevation: m.elevation as number | null,
  }));
  if (parsed.length) {
    serverBacked.value = false;
    local.coordinates = parsed;
    storedPointCount.value = parsed.length;
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
    serverBacked.value = false;
    // The page holds the plan's point_source and decides from it whether to
    // save this table. Left stale it would keep the table locked and keep
    // skipping the save.
    emit("update:pointSource", null);
    storedPointCount.value = 0;
    local.coordinates = [];
    displayCount.value = 0;
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
