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

    <!-- An uploaded alignment is stored whole and previewed here. Editing a
         preview would discard every station it does not show, so the table
         says so and offers the file back instead. -->
    <div
      v-if="showingPreview"
      class="mb-4 rounded-md border border-blue-300 bg-blue-50 dark:border-blue-800/60 dark:bg-blue-900/20 px-3 py-2"
    >
      <p class="text-xs text-blue-900 dark:text-blue-200">
        These stations came from
        <strong>{{ uploadedFileName || "an uploaded file" }}</strong
        >. The alignment holds
        <strong>{{ storedStationCount.toLocaleString() }}</strong> station{{
          storedStationCount === 1 ? "" : "s"
        }}
        and the table shows the first {{ local.stations.length }} — the full
        set is stored and used for the drawing. To change them, upload a
        replacement file.
      </p>
      <button
        type="button"
        :disabled="removingUpload"
        @click="onRemoveUpload"
        class="mt-2 text-[11px] font-medium text-blue-700 hover:underline disabled:opacity-50 dark:text-blue-300"
      >
        {{ removingUpload ? "Removing…" : "Remove the uploaded file" }}
      </button>
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
              <th
                v-for="col in tableColumns"
                :key="col.key"
                class="px-3 py-2 text-left"
              >
                <span class="flex items-center gap-1">
                  {{ col.label }}
                  <InfoTip
                    v-if="col.key === 'point'"
                    text="Must match the point ids of your elevation data so each station gets both a position and a level."
                  />
                </span>
              </th>
              <th class="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in local.stations"
              :key="row._key"
              class="border-b border-gray-100 dark:border-slate-700/60"
            >
              <td
                v-for="col in tableColumns"
                :key="col.key"
                class="px-3 py-1.5"
              >
                <input
                  :value="(row as any)[col.key]"
                  :type="col.type === 'text' ? 'text' : 'number'"
                  :step="col.type === 'text' ? undefined : '0.001'"
                  :placeholder="col.placeholder"
                  :readonly="showingPreview"
                  :class="[
                    col.type === 'text' ? 'w-28' : 'w-40',
                    'text-sm rounded border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 px-2 py-1',
                    showingPreview
                      ? 'bg-gray-100 dark:bg-slate-800 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-700',
                  ]"
                  @input="setCell(row, col, ($event.target as HTMLInputElement).value)"
                />
              </td>
              <td class="px-3 py-1.5">
                <button
                  v-if="!showingPreview"
                  @click="local.stations.splice(idx, 1)"
                  class="text-red-500 hover:text-red-700 text-xs"
                >
                  ✕
                </button>
              </td>
            </tr>
            <tr v-if="!local.stations.length">
              <td
                :colspan="tableColumns.length + 1"
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

    <!-- Column mapping modal (shown after a file upload) -->
    <CoordinateColumnMapper
      v-model="showMapper"
      :rows="rawRows"
      :fields="tableColumns"
      @confirm="onMappingConfirmed"
    />

    <UploadProgressOverlay
      :show="uploadingFile"
      :label="uploadProgress"
      :percent="uploadPercent"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import InfoTip from "~/components/InfoTip.vue";
import { parseTable } from "~/composables/useSheetParser";
import UploadProgressOverlay from "~/components/UploadProgressOverlay.vue";
import {
  clearUploadedCoordinates,
  previewColumns,
  uploadCoordinateFile,
} from "~/composables/useCoordinateUpload";
import CoordinateColumnMapper from "~/components/CoordinateColumnMapper.vue";
import {
  ID_FIELD,
  NORTHING_FIELD,
  EASTING_FIELD,
  type FieldDef,
  type MappedRow,
} from "~/utils/columnMapping";

// Keyed by the property each value lands on in a station row.
const MAPPER_FIELDS: FieldDef[] = [
  { ...ID_FIELD, key: "point", label: "Station", placeholder: "CH0" },
  { ...NORTHING_FIELD, label: "Northing (m)" },
  { ...EASTING_FIELD, label: "Easting (m)" },
];

/** Columns of the table, in their declared order. */
const tableColumns: FieldDef[] = MAPPER_FIELDS;
const showMapper = ref(false);
const rawRows = ref<string[][]>([]);

function setCell(row: any, col: FieldDef, value: string) {
  // The table is a preview of an uploaded file, and the file is the record
  // of the alignment. Typing into it would change a row the drawing never
  // reads.
  if (showingPreview.value) return;
  row[col.key] =
    col.type === "text" ? value : value === "" ? null : Number(value);
}

/**
 * The user has said which column is which.
 *
 * For a delimited file the rows never came here: the dialog worked from the
 * sample the server returned, and what it produces is a set of column indices
 * the server applies to the whole file. Only an Excel sheet, which cannot be
 * streamed, still carries its rows to this point.
 */
async function onMappingConfirmed(
  mapped: MappedRow[],
  columns: { mapping: Record<string, number | null>; hasHeader: boolean },
) {
  const file = pendingFile.value;
  pendingFile.value = null;

  if (file) {
    await sendAlignmentFile(file, columns.mapping);
    return;
  }

  const parsed = mapped.map((m) => ({
    _key: crypto.randomUUID(),
    point: String(m.point ?? ""),
    northing: m.northing as number | null,
    easting: m.easting as number | null,
  }));
  if (parsed.length) {
    local.stations = parsed;
    toast.add({ title: `Imported ${parsed.length} stations`, color: "success" });
  } else {
    toast.add({ title: "No stations found in the file", color: "error" });
  }
}

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
  /** Stations held in the point store; the table below shows a preview. */
  pointCount?: number;
  /**
   * Set when the alignment came from a file. The file is then the record of
   * it and this table is a preview, so the rows are not edited here --
   * changing them means uploading a different file.
   */
  pointSource?: { file_name?: string; uploaded_at?: string } | null;
}>();

const emit = defineEmits<{
  "update:model-value": [value: AlignmentData];
  "update:pointSource": [value: { file_name?: string; uploaded_at?: string } | null];
  complete: [];
}>();

const route = useRoute();
const toast = useToast();
const loading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const planId = computed(() => route.params.plan as string);

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

// --- Alignment uploads ------------------------------------------------------
// The same route every other coordinate file takes: the browser hands the
// file to the server and the server parses it. This step used to read the
// whole thing with a FileReader and parse it here, which is what made the
// coordinate step lock up the tab on a large survey -- a route alignment is
// usually short, but "usually" is not a reason to keep the one path that
// cannot cope when it is not.
const uploadingFile = ref(false);
const uploadProgress = ref("");
const uploadPercent = ref(0);
/** The file waiting on a column mapping; null when the rows are already here
 *  (an Excel sheet), set when only a preview of them is. */
const pendingFile = ref<File | null>(null);
const storedStationCount = ref(props.pointCount ?? 0);
const uploadedThisSession = ref(false);
const removingUpload = ref(false);

/**
 * Whether the alignment is a file rather than this table.
 *
 * True on a revisit as well as in the session that uploaded, because the
 * table is a preview either way -- editing it would throw away every station
 * it does not show.
 */
const uploaded = computed(
  () => uploadedThisSession.value || Boolean(props.pointSource?.uploaded_at),
);
const uploadedFileName = computed(() => props.pointSource?.file_name ?? "");
const showingPreview = computed(
  () => uploaded.value || storedStationCount.value > local.stations.length,
);

/** Discard an uploaded alignment and go back to typing stations by hand. */
async function onRemoveUpload() {
  const total = storedStationCount.value.toLocaleString();
  if (
    !window.confirm(
      `Remove the ${total} uploaded stations from this plan?\n\n` +
        "The alignment will be discarded and you can enter stations by hand. " +
        "This cannot be undone.",
    )
  ) {
    return;
  }

  removingUpload.value = true;
  try {
    await clearUploadedCoordinates(planId.value, "coordinates");
    uploadedThisSession.value = false;
    emit("update:pointSource", null);
    storedStationCount.value = 0;
    local.stations = [];
    toast.add({ title: "Uploaded stations removed", color: "success" });
  } catch (err: any) {
    toast.add({
      title: "Could not remove the uploaded stations",
      description: err?.response?.data?.message || err?.message,
      color: "error",
    });
  } finally {
    removingUpload.value = false;
  }
}

watch(
  () => props.pointCount,
  (count) => {
    if (typeof count === "number") storedStationCount.value = count;
  },
);

async function sendAlignmentFile(file: File, mapping?: unknown) {
  uploadingFile.value = true;
  uploadPercent.value = 0;
  uploadProgress.value = "Uploading the file…";
  try {
    const outcome = await uploadCoordinateFile(planId.value, file, {
      mapping,
      // A route's stations are the plan's coordinates, the same series a
      // cadastral survey uses -- so this needs no kind of its own.
      kind: "coordinates",
      // The dialog names its id field after the table column it fills.
      idKey: "point",
      onProgress: (p) => {
        // Sending is a real percentage; storing is not, so the bar goes
        // indeterminate rather than parking at 100 and looking stuck.
        uploadPercent.value = p.phase === "sending" ? p.percent : 0;
        uploadProgress.value = p.label;
      },
    });

    uploadedThisSession.value = true;
    storedStationCount.value = outcome.pointCount;
    // Tell the page straight away, or Save & Continue will post this preview
    // to the edit endpoint and be refused.
    emit("update:pointSource", outcome.pointSource ?? null);
    // Only the preview reaches the table; the stations themselves stay in
    // the point store.
    local.stations = outcome.preview.map((c: any) => ({
      _key: crypto.randomUUID(),
      point: c.id ?? "",
      northing: c.northing ?? null,
      easting: c.easting ?? null,
    }));

    toast.add({
      title: `Imported ${outcome.pointCount.toLocaleString()} station${
        outcome.pointCount === 1 ? "" : "s"
      }`,
      description:
        (outcome.pointCount > local.stations.length
          ? `Showing the first ${local.stations.length} in the table. `
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

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (fileInputRef.value) fileInputRef.value.value = "";

  // Excel cannot be streamed -- it is a zip of XML that has to be inflated
  // whole -- so it stays a client-side parse. Delimited text is read by the
  // server, whatever its size.
  if (/\.(xls|xlsx)$/i.test(file.name)) {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const rows = (await parseTable(reader.result as ArrayBuffer)) as string[][];
        if (!rows?.length) {
          toast.add({ title: "No rows found in file", color: "warning" });
          return;
        }
        pendingFile.value = null;
        rawRows.value = rows;
        showMapper.value = true;
      };
      reader.readAsArrayBuffer(file);
    } catch {
      toast.add({ title: "Could not read file", color: "error" });
    }
    return;
  }

  uploadingFile.value = true;
  uploadProgress.value = "Reading the first few rows…";
  try {
    // Only the head of the file goes up, and only a sample of rows comes
    // back -- enough for the dialog to show which column is which.
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

    // An uploaded alignment is already stored and this table holds only a
    // preview of it, so posting the table back would ask the server to
    // replace the alignment with its own first two hundred stations, which it
    // refuses. Only a typed table is saved from here -- the same rule the
    // coordinate step follows.
    if (!showingPreview.value && filledStations.value.length >= 2) {
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
