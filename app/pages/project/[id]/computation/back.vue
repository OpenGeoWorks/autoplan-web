<template>
  <UserHeader />

  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back -->
      <div class="mb-4">
        <button
          @click="navigateTo(`/project/${projectId}`)"
          class="inline-flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          <RiArrowLeftLine class="w-4 h-4" />
          Back to Project
        </button>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Back Computation
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Derive the bearing and distance of every leg from known coordinates,
        without creating a plan
      </p>

      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
      >
        <!-- File Upload Section -->
        <div
          class="flex items-center justify-between gap-3 p-3 rounded-md border border-green-200 dark:border-slate-700 bg-green-50/70 dark:bg-slate-800/50 mb-4"
        >
          <div class="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5 text-green-600 dark:text-green-400"
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
                Columns: Point ID, Easting, Northing, Elevation (optional)
              </div>
              <div class="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                Supports comma, tab, or space separated files with optional
                headers
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input
              ref="backFileInputRef"
              type="file"
              accept=".csv,.txt,.xls,.xlsx"
              @change="onBackFile"
              class="hidden"
            />
            <button
              type="button"
              @click="triggerBackFile"
              class="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Upload File
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-700/60"
              @click="downloadBackTemplate"
            >
              Download Template
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-700">
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Point ID
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Easting(mE)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Northing(mN)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Elevation(m)
                </th>
                <th
                  class="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in backRows"
                :key="index"
                class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td class="py-3 px-4">
                  <input
                    v-model="row.pointId"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="A"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.easting"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="543210.000"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.northing"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="712345.000"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.elevation"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="optional"
                  />
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="deleteBackRow(index)"
                    class="p-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-colors"
                  >
                    <RiDeleteBinLine class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between mt-4">
          <button
            @click="addBackRow"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add Row
          </button>

          <div class="flex items-center gap-2">
            <label
              class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="checkbox"
                v-model="closeRing"
                class="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              Close the ring
            </label>
          </div>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
          {{
            closeRing
              ? "A closing leg back to the first point is added, and the enclosed area is reported — use this for a parcel boundary."
              : "The legs are computed as an open chain and no area is reported — use this for a route or open traverse."
          }}
        </p>

        <!-- Compute and Download Buttons -->
        <div class="flex items-center gap-4 mt-6">
          <button
            @click="computeBack"
            :disabled="!canCompute || isComputing"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span
              v-if="isComputing"
              class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            {{ isComputing ? "Computing..." : "Compute" }}
          </button>

          <button
            v-if="computationResults"
            @click="showResultsModal = true"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            View Results
          </button>

          <button
            v-if="computationResults"
            @click="showSaveModal = true"
            class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Save Computation
          </button>
        </div>

        <!-- Error Section -->
        <div
          v-if="computationError"
          class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <h3 class="font-semibold text-red-800 dark:text-red-300 mb-2">
            Computation Error
          </h3>
          <p class="text-sm text-red-700 dark:text-red-300">
            {{ computationError }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Results Modal -->
  <BackComputationResultsModal
    :show="showResultsModal"
    :results="computationResults?.data || null"
    :close-ring="closeRing"
    @close="showResultsModal = false"
  />

  <!-- Save Computation Modal -->
  <SaveComputationModal
    v-model="showSaveModal"
    ref="saveModalRef"
    @save="saveComputation"
  />
</template>

<script lang="ts" setup>
import { RiArrowLeftLine, RiDeleteBinLine } from "@remixicon/vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import { ref, computed } from "vue";
import { parseTable } from "~/composables/useSheetParser";
import BackComputationResultsModal from "~/components/BackComputationResultsModal.vue";

definePageMeta({ middleware: ["auth"] });

const toast = useToast();
const route = useRoute();
const projectId = route.params.id as string;

interface BackRow {
  pointId: string;
  easting: number | null;
  northing: number | null;
  elevation: number | null;
}

const emptyRow = (): BackRow => ({
  pointId: "",
  easting: null,
  northing: null,
  elevation: null,
});

const backRows = ref<BackRow[]>([emptyRow()]);

/**
 * Repeat the first point at the end so the closing leg is computed and the
 * area describes the same shape as the legs. A parcel boundary is a ring; a
 * route centreline is not. The plan flow makes this choice from the plan type
 * (StepComputation closes cadastral parcels but not routes) — a standalone
 * page has no plan to read it from, so the surveyor states it.
 */
const closeRing = ref(true);

const computationResults = ref<any>(null);
const computationError = ref("");
const isComputing = ref(false);
const backFileInputRef = ref<HTMLInputElement | null>(null);
const showSaveModal = ref(false);
const showResultsModal = ref(false);
const saveModalRef = ref<any>(null);

/** Rows that carry a usable station: an id and both coordinates. */
const validPoints = computed(() =>
  backRows.value
    .filter(
      (row) =>
        row.pointId &&
        row.pointId.trim() !== "" &&
        row.easting !== null &&
        row.northing !== null
    )
    .map((row) => ({
      id: row.pointId.trim(),
      northing: row.northing as number,
      easting: row.easting as number,
      ...(row.elevation !== null ? { elevation: row.elevation } : {}),
    }))
);

// Two points are enough — the join between them is a back computation.
const canCompute = computed(() => validPoints.value.length >= 2);

const addBackRow = () => {
  backRows.value.push(emptyRow());
};

const deleteBackRow = (index: number) => {
  if (backRows.value.length > 1) {
    backRows.value.splice(index, 1);
  }
};

/** The points as sent to the endpoint, with the ring closed when asked for. */
const buildPoints = () => {
  const points = validPoints.value.map((p) => ({ ...p }));
  if (
    closeRing.value &&
    points.length > 2 &&
    points[0]!.id !== points[points.length - 1]!.id
  ) {
    points.push({ ...points[0]! });
  }
  return points;
};

const computeBack = async () => {
  try {
    isComputing.value = true;
    computationError.value = "";
    computationResults.value = null;

    const points = buildPoints();
    if (points.length < 2) {
      throw new Error(
        "Provide at least two points with a Point ID, easting and northing"
      );
    }

    const { $axios } = useNuxtApp();
    const response = await $axios.post("/traverse/back-computation", { points });

    computationResults.value = response.data;
    showResultsModal.value = true;

    toast.add({
      title: "Back computation completed successfully",
      color: "success",
    });
  } catch (error: any) {
    console.error("Back computation error:", error);
    computationError.value =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during computation";
  } finally {
    isComputing.value = false;
  }
};

// File upload methods
const triggerBackFile = () => {
  backFileInputRef.value?.click();
};

const parseBackCSV = async (input: string | ArrayBuffer | any): Promise<BackRow[]> => {
  const rows = await parseTable(input);
  if (!rows || rows.length === 0) return [];

  const firstRow = Array.isArray(rows[0])
    ? rows[0].map((c: any) => String(c ?? "").toLowerCase()).join(" ")
    : String(rows[0] ?? "").toLowerCase();
  const hasHeader = /point|id|east|north|elev|height/i.test(firstRow);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const parsedRows: BackRow[] = [];
  for (const colsRaw of dataRows) {
    const cols = (colsRaw || []).map((c: any) => String(c ?? "").trim());
    if (cols.length < 3) continue;

    const pointId = String(cols[0] || "").trim();
    const easting = parseFloat(cols[1] || "");
    const northing = parseFloat(cols[2] || "");
    const elevationRaw = cols[3];
    const elevation =
      elevationRaw === undefined || elevationRaw === ""
        ? null
        : parseFloat(elevationRaw);

    if (!pointId || isNaN(easting) || isNaN(northing)) continue;

    parsedRows.push({
      pointId,
      easting,
      northing,
      elevation: elevation === null || isNaN(elevation) ? null : elevation,
    });
  }
  return parsedRows;
};

const onBackFile = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  const applyParsed = (parsed: BackRow[]) => {
    if (!parsed.length) {
      toast.add({
        title: "No coordinates found in that file",
        color: "error",
      });
      return;
    }
    backRows.value = parsed;
  };

  try {
    const reader = new FileReader();
    if (ext === ".xls" || ext === ".xlsx") {
      reader.onload = async (e) => {
        applyParsed(await parseBackCSV(e.target?.result as ArrayBuffer));
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = async (e) => {
        applyParsed(await parseBackCSV(e.target?.result as string));
      };
      reader.readAsText(file);
    }
  } catch (err) {
    console.error("Back file import error:", err);
    toast.add({
      title: "Failed to import file",
      color: "error",
    });
  }
};

const downloadBackTemplate = () => {
  const csv = [
    "Point ID,Easting,Northing,Elevation",
    "A,543210.000,712345.000,",
    "B,543310.000,712345.000,",
    "C,543310.000,712425.000,",
    "D,543210.000,712425.000,",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "back_computation_template.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const saveComputation = async (computationName: string) => {
  if (!saveModalRef.value) return;

  try {
    saveModalRef.value.setLoading(true);

    const { $axios } = useNuxtApp();
    const planResponse = await $axios.post("/plan/create", {
      name: computationName,
      project: projectId,
      computation_only: true,
    });

    const planId = planResponse.data?.data?.id;
    if (!planId) {
      throw new Error("Failed to create computation plan");
    }

    // Store the points as entered plus the intent, not the closed copy — the
    // closing point is derived, and keeping it would duplicate a station on
    // reopen.
    await $axios.put(`/plan/back-data/edit/${planId}`, {
      points: validPoints.value,
      close_ring: closeRing.value,
    });

    saveModalRef.value.close();
    toast.add({
      title: "Computation saved successfully",
      color: "success",
    });

    setTimeout(() => {
      navigateTo(`/project/${projectId}/plan/${planId}`);
    }, 500);
  } catch (error: any) {
    console.error("Save computation error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to save computation";
    saveModalRef.value.setError(errorMessage);
  } finally {
    saveModalRef.value.setLoading(false);
  }
};
</script>
