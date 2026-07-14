<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Parcel Table
      </h2>
      <button
        @click="addAllPoints"
        :disabled="!props.coordinateIds.length"
        class="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add All Points
      </button>
    </div>
    <div class="overflow-x-auto">
      <table
        class="min-w-full text-sm border border-gray-200 dark:border-slate-600 rounded-md overflow-hidden"
      >
        <thead
          class="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
        >
          <tr>
            <th class="px-3 py-2 text-left">Name</th>
            <th
              v-for="n in maxColumns"
              :key="`col-${n}`"
              class="px-3 py-2 text-left"
            >
              {{ n }}
            </th>
            <th class="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(parcel, idx) in local.parcels"
            :key="parcel._key"
            class="border-t border-gray-200 dark:border-slate-700"
          >
            <td class="px-3 py-1">
              <input
                v-model="parcel.name"
                type="text"
                class="w-40 px-2 py-1 text-xs rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none"
              />
            </td>
            <td
              v-for="(id, cIdx) in parcel.ids"
              :key="`r-${idx}-c-${cIdx}`"
              class="px-3 py-1"
            >
              <div class="flex items-center gap-1">
                <select
                  v-model="parcel.ids[cIdx]"
                  class="w-28 px-2 py-1 text-xs rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none"
                >
                  <option :value="''">--</option>
                  <option
                    v-for="opt in optionsFor(idx, cIdx, parcel.ids[cIdx] || '')"
                    :key="opt"
                    :value="opt"
                  >
                    {{ opt }}
                  </option>
                </select>
                <button
                  v-if="parcel.ids.length > 1"
                  @click="removePoint(parcel, cIdx)"
                  class="text-red-500 hover:text-red-700 text-xs leading-none"
                  title="Remove this point"
                >
                  ✕
                </button>
              </div>
            </td>
            <td
              v-if="parcel.ids.length < maxColumns"
              :colspan="maxColumns - parcel.ids.length"
            ></td>
            <td class="px-3 py-1 text-right space-x-2 flex">
              <button
                @click="addIdSlot(parcel)"
                class="text-xs text-gray-700 dark:text-gray-200 hover:underline w-16"
              >
                + Add Point
              </button>
              <button
                @click="removeRow(idx)"
                class="text-red-600 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </td>
          </tr>
          <tr v-if="!local.parcels.length">
            <td
              :colspan="maxColumns + 2"
              class="px-3 py-4 text-center text-xs text-gray-500 dark:text-gray-400"
            >
              No parcels added yet.
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
        Add Parcel
      </button>
      <button
        @click="clearAll"
        type="button"
        :disabled="!local.parcels.length"
        class="px-3 py-1.5 text-xs rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
      >
        Clear All
      </button>
      <button
        @click="onComplete"
        :disabled="!canSave || loading"
        class="px-4 py-2 ml-auto rounded bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
      >
        Save & Continue
      </button>
    </div>
    <p class="text-[11px] text-gray-500 dark:text-gray-400">
      You can reuse the same coordinate across multiple parcels.
    </p>
  </div>

  <!-- Confirm clear all parcels modal -->
  <ConfirmModal
    v-model="showClearConfirm"
    title="Clear all parcels?"
    message="This will remove all parcel rows from the table. This action cannot be undone."
    @confirmed="confirmClear"
  />
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from "vue";

interface ParcelRow {
  _key: string;
  name: string;
  ids: string[];
}

const props = withDefaults(
  defineProps<{
    modelValue: { parcels: ParcelRow[] };
    coordinateIds: string[];
    loading?: boolean;
  }>(),
  { loading: false }
);
const emit = defineEmits(["update:modelValue", "complete"]);

const local = reactive<{ parcels: ParcelRow[] }>({ parcels: [] });
const showClearConfirm = ref(false);

watch(
  () => props.modelValue.parcels,
  (arr) => {
    if (Array.isArray(arr)) {
      local.parcels = arr.map((p) => ({
        _key: p._key || crypto.randomUUID(),
        name: p.name || "",
        ids: Array.isArray(p.ids) ? [...p.ids] : [],
      }));
    } else {
      local.parcels = [];
    }
  },
  { immediate: true }
);

const maxColumns = computed(() =>
  Math.max(1, ...local.parcels.map((p) => p.ids.length || 0))
);

function optionsFor(_rowIdx: number, _colIdx: number, _current: string) {
  return props.coordinateIds;
}

function addRow() {
  local.parcels.push({ _key: crypto.randomUUID(), name: "", ids: [""] });
}
function removeRow(idx: number) {
  local.parcels.splice(idx, 1);
}
function addIdSlot(parcel: ParcelRow) {
  parcel.ids.push("");
}
function removePoint(parcel: ParcelRow, idx: number) {
  if (parcel.ids.length > 1) parcel.ids.splice(idx, 1);
}

function addAllPoints() {
  if (!props.coordinateIds.length) return;

  const newParcel: ParcelRow = {
    _key: crypto.randomUUID(),
    name: `Parcel ${local.parcels.length + 1}`,
    ids: [],
  };

  const seen = new Set<string>();
  props.coordinateIds.forEach((id) => {
    if (!seen.has(id)) {
      newParcel.ids.push(id);
      seen.add(id);
    }
  });

  const firstId = newParcel.ids[0];
  if (firstId && newParcel.ids[newParcel.ids.length - 1] !== firstId) {
    newParcel.ids.push(firstId);
  }

  local.parcels.push(newParcel);
}

function clearAll() {
  if (!local.parcels.length) return;
  showClearConfirm.value = true;
}

function confirmClear() {
  local.parcels = [];
}

function dedupeAndEnsureClosure(ids: string[]) {
  const filtered = ids.filter((id) => !!id);
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const id of filtered) {
    if (!seen.has(id)) {
      unique.push(id);
      seen.add(id);
    }
  }

  if (unique.length > 0) {
    const first = unique[0] as string;
    if (unique[unique.length - 1] !== first) {
      unique.push(first);
    }
  }

  return unique;
}

const canSave = computed(() => {
  if (!local.parcels.length) return false;
  return local.parcels.every(
    (p) => p.name.trim().length > 0 && p.ids.some((id) => !!id)
  );
});

function onComplete() {
  if (!canSave.value) return;
  const cleaned = local.parcels.map((p) => ({
    _key: p._key,
    name: p.name.trim(),
    ids: dedupeAndEnsureClosure(p.ids),
  }));
  emit("update:modelValue", { parcels: cleaned });
  emit("complete");
}
</script>
