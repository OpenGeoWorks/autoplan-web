<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/50" @click="onCancel"></div>

    <div
      class="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-2xl w-full mx-4 z-10 p-6 max-h-[90vh] overflow-y-auto"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Map your columns
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
        Drag each column onto the field it belongs to — or tap a column, then
        tap a field. We've guessed from your file; adjust anything that's wrong.
        Your file is not changed.
      </p>

      <!-- Header row toggle -->
      <label
        class="flex items-center gap-2 mt-4 text-sm text-gray-700 dark:text-gray-200"
      >
        <input type="checkbox" v-model="hasHeader" class="h-4 w-4" />
        First row is a header (column names, not data)
      </label>

      <!-- Unassigned columns tray -->
      <div class="mt-4">
        <div class="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
          Columns from your file
          <span class="font-normal text-gray-400"
            >(drag onto a field, or tap to select)</span
          >
        </div>
        <div
          class="flex flex-wrap gap-2 min-h-[3rem] p-2 rounded border border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/40"
          @dragover.prevent
          @drop="onDropToTray"
        >
          <button
            v-for="col in unassignedColumns"
            :key="col"
            type="button"
            draggable="true"
            @dragstart="onDragStart(col)"
            @dragend="dragCol = null"
            @click="pick(col)"
            class="text-left px-3 py-1.5 rounded border cursor-grab active:cursor-grabbing text-xs"
            :class="
              pickedCol === col
                ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-blue-400'
            "
          >
            <span class="font-medium text-gray-800 dark:text-gray-100">{{
              headers[col]
            }}</span>
            <span class="block text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              e.g. {{ sampleFor(col) }}
            </span>
          </button>
          <span
            v-if="!unassignedColumns.length"
            class="text-xs text-gray-400 self-center px-1"
          >
            All columns assigned.
          </span>
        </div>
      </div>

      <!-- Field slots (drop targets) -->
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="field in fields"
          :key="field.key"
          @dragover.prevent
          @drop="onDropToField(field.key)"
          @click="onSlotClick(field.key)"
          class="rounded border p-2.5 transition-colors"
          :class="[
            missingRequired.includes(field.key)
              ? 'border-red-400 bg-red-50/50 dark:bg-red-900/10'
              : 'border-gray-300 dark:border-slate-600',
            pickedCol !== null ? 'cursor-pointer hover:border-blue-400' : '',
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </span>
            <button
              v-if="mapping[field.key] !== null"
              type="button"
              class="text-[11px] text-gray-400 hover:text-red-500"
              title="Unassign"
              @click.stop="unassign(field.key)"
            >
              ✕
            </button>
          </div>
          <div class="mt-1.5">
            <div
              v-if="mapping[field.key] !== null"
              draggable="true"
              @dragstart.stop="onDragStart(mapping[field.key] as number)"
              @dragend="dragCol = null"
              @click.stop="pick(mapping[field.key] as number)"
              class="px-2.5 py-1.5 rounded bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 cursor-grab active:cursor-grabbing"
            >
              <span class="text-xs font-medium text-gray-800 dark:text-gray-100">{{
                headers[mapping[field.key] as number]
              }}</span>
              <span class="block text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                e.g. {{ sampleFor(mapping[field.key] as number) }}
              </span>
            </div>
            <div
              v-else
              class="px-2.5 py-2 rounded border border-dashed border-gray-300 dark:border-slate-600 text-[11px] text-gray-400"
            >
              {{ pickedCol !== null ? "Tap to place here" : "Drop a column here" }}
            </div>
          </div>
        </div>
      </div>

      <p v-if="missingRequired.length" class="mt-2 text-xs text-red-600">
        Assign a column for:
        {{
          fields
            .filter((f) => missingRequired.includes(f.key))
            .map((f) => f.label)
            .join(", ")
        }}.
      </p>

      <!-- Live preview of the mapped result -->
      <div class="mt-5">
        <div class="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
          Preview ({{ previewTotal }} row{{ previewTotal === 1 ? "" : "s" }})
        </div>
        <div class="overflow-x-auto border border-gray-200 dark:border-slate-700 rounded">
          <table class="min-w-full text-xs">
            <thead class="bg-gray-50 dark:bg-slate-700/50">
              <tr class="text-left text-gray-600 dark:text-gray-300">
                <th v-for="field in fields" :key="field.key" class="px-3 py-2">
                  {{ field.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, r) in previewRows"
                :key="r"
                class="border-t border-gray-100 dark:border-slate-700/60"
              >
                <td
                  v-for="field in fields"
                  :key="field.key"
                  class="px-3 py-1.5 text-gray-800 dark:text-gray-100 font-mono"
                >
                  {{ previewCell(row, field.key) }}
                </td>
              </tr>
              <tr v-if="!previewRows.length">
                <td
                  :colspan="fields.length"
                  class="px-3 py-3 text-center text-gray-400"
                >
                  No data rows detected.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
          class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600"
          @click="onCancel"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="missingRequired.length > 0 || previewTotal === 0"
          @click="onConfirm"
        >
          Use these columns
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  detectColumns,
  autoDetectMapping,
  applyMapping,
  unmappedRequiredFields,
  emptyMapping,
  mappingSignature,
  loadSessionMapping,
  saveSessionMapping,
  type FieldDef,
  type ColumnMapping,
  type CoordinateField,
  type MappedCoordinate,
} from "~/utils/columnMapping";

const props = defineProps<{
  modelValue: boolean;
  /** Raw parsed rows (from useSheetParser), header row possibly included. */
  rows: string[][];
  fields: FieldDef[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "confirm", rows: MappedCoordinate[]): void;
  (e: "cancel"): void;
}>();

const PREVIEW_LIMIT = 5;

const hasHeader = ref(false);
const mapping = ref<ColumnMapping>(emptyMapping());
const pickedCol = ref<number | null>(null); // tap-to-place selection
const dragCol = ref<number | null>(null); // drag source

// Re-detect and prefill whenever the modal opens with new rows.
watch(
  () => [props.modelValue, props.rows] as const,
  ([open]) => {
    if (!open) return;
    const d = detectColumns(props.rows);
    hasHeader.value = d.hasHeader;
    const remembered = loadSessionMapping(mappingSignature(d));
    mapping.value = remembered ? { ...remembered } : autoDetectMapping(d, props.fields);
    pickedCol.value = null;
  },
  { immediate: true },
);

// Recompute headers/data, honouring the user's explicit header toggle.
const detected = computed(() => {
  const base = detectColumns(props.rows);
  if (hasHeader.value === base.hasHeader) return base;
  const clean = (props.rows || []).filter(
    (r) => Array.isArray(r) && r.some((c) => String(c ?? "").trim() !== ""),
  );
  const columnCount = clean.reduce((m, r) => Math.max(m, r.length), 0);
  const headerRow = hasHeader.value ? clean[0] ?? [] : [];
  return {
    hasHeader: hasHeader.value,
    columnCount,
    headers: Array.from({ length: columnCount }, (_, i) => {
      const h = String(headerRow[i] ?? "").trim();
      return h || `Column ${i + 1}`;
    }),
    dataRows: hasHeader.value ? clean.slice(1) : clean,
  };
});

const headers = computed(() => detected.value.headers);

const assignedColumns = computed(
  () =>
    new Set(
      props.fields
        .map((f) => mapping.value[f.key])
        .filter((v): v is number => v !== null),
    ),
);

const unassignedColumns = computed(() =>
  Array.from({ length: detected.value.columnCount }, (_, i) => i).filter(
    (i) => !assignedColumns.value.has(i),
  ),
);

function sampleFor(col: number): string {
  for (const row of detected.value.dataRows) {
    const v = String(row[col] ?? "").trim();
    if (v !== "") return v;
  }
  return "—";
}

const mappedRows = computed(() =>
  applyMapping(detected.value.dataRows, mapping.value),
);
const previewTotal = computed(() => mappedRows.value.length);
const previewRows = computed(() => mappedRows.value.slice(0, PREVIEW_LIMIT));

const missingRequired = computed<CoordinateField[]>(() =>
  unmappedRequiredFields(mapping.value, props.fields).map((f) => f.key),
);

// --- Assignment (move semantics: a column lives in at most one field) ---
function assign(col: number, field: CoordinateField) {
  // If this column is already in another field, clear that field first.
  for (const f of props.fields) {
    if (f.key !== field && mapping.value[f.key] === col) {
      mapping.value[f.key] = null;
    }
  }
  mapping.value[field] = col;
  pickedCol.value = null;
}

function unassign(field: CoordinateField) {
  mapping.value[field] = null;
}

// Tap-to-place: tap a column to pick it up, tap a field slot to drop it.
function pick(col: number) {
  pickedCol.value = pickedCol.value === col ? null : col;
}
function onSlotClick(field: CoordinateField) {
  if (pickedCol.value !== null) assign(pickedCol.value, field);
}

// Native drag-and-drop.
function onDragStart(col: number) {
  dragCol.value = col;
  pickedCol.value = null;
}
function onDropToField(field: CoordinateField) {
  if (dragCol.value !== null) assign(dragCol.value, field);
  dragCol.value = null;
}
function onDropToTray() {
  // Dropping back into the tray unassigns wherever the column currently sits.
  if (dragCol.value === null) return;
  for (const f of props.fields) {
    if (mapping.value[f.key] === dragCol.value) mapping.value[f.key] = null;
  }
  dragCol.value = null;
}

function previewCell(row: MappedCoordinate, key: CoordinateField): string {
  const v =
    key === "id"
      ? row.point
      : key === "northing"
      ? row.northing
      : key === "easting"
      ? row.easting
      : row.elevation;
  return v === null || v === "" ? "—" : String(v);
}

function onConfirm() {
  if (missingRequired.value.length || previewTotal.value === 0) return;
  saveSessionMapping(mappingSignature(detected.value), mapping.value);
  emit("confirm", mappedRows.value);
  emit("update:modelValue", false);
}

function onCancel() {
  emit("cancel");
  emit("update:modelValue", false);
}
</script>

<style scoped></style>
