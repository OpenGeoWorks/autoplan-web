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
        Forward Computation
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Calculate coordinates from bearings and distances without creating a plan
      </p>

      <!-- Forward Computation Table -->
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
                Import data (CSV or TXT or XLS/XLSX)
              </div>
              <div class="text-[11px] text-gray-600 dark:text-gray-400">
                Columns: Distance, Degrees, Minutes, Seconds, Easting, Northing,
                Point ID
              </div>
              <div class="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                Supports comma, tab, or space separated files with optional
                headers
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input
              ref="forwardFileInputRef"
              type="file"
              accept=".csv,.txt,.xls,.xlsx"
              @change="onForwardFile"
              class="hidden"
            />
            <button
              type="button"
              @click="triggerForwardFile"
              class="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Upload File
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-700/60"
              @click="downloadForwardTemplate"
            >
              Download Template
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <!-- Actual Table -->
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
                  Distance(m)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Degrees
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Minutes
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Seconds
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Departure
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Latitude
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
                  class="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in forwardRows"
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
                    v-model.number="row.distance"
                    type="number"
                    step="0.01"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="34.54"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.degrees"
                    type="number"
                    min="0"
                    max="359"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="261"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.minutes"
                    type="number"
                    min="0"
                    max="59"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="13"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.seconds"
                    type="number"
                    step="0.01"
                    min="0"
                    max="59.99"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    :value="row.departure"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    :value="row.latitude"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.easting"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="564836.710"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.northing"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="714206.422"
                  />
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="deleteForwardRow(index)"
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
            @click="addForwardRow"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add Row
          </button>

          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                v-model="misclosureCorrection"
                class="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              Apply Misclosure Correction
            </label>
          </div>
        </div>

        <!-- Compute and Download Buttons -->
        <div class="flex items-center gap-4 mt-6">
          <button
            @click="computeForward"
            :disabled="!canCompute || isComputing"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span v-if="isComputing" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isComputing ? "Computing..." : "Compute" }}
          </button>

          <button
            v-if="computationResults"
            @click="showSaveModal = true"
            class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Save Computation
          </button>

          <button
            v-if="computationResults"
            @click="downloadComputationCSV"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Download Results
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

        <!-- Success Section -->
        <div
          v-if="computationResults && !computationError"
          class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <h3 class="font-semibold text-green-800 dark:text-green-300 mb-2">
            Computation Completed
          </h3>
          <p class="text-sm text-green-700 dark:text-green-300 mb-4">
            Forward computation completed successfully. The traverse has been
            closed and all coordinates have been computed.
          </p>

          <!-- Misclosure Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-white dark:bg-slate-700 p-3 rounded border">
              <h4
                class="font-medium text-green-800 dark:text-green-300 text-sm mb-2"
              >
                Misclosure Analysis
              </h4>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Northing Misclosure:</span
                  >
                  <span class="font-mono text-gray-900 dark:text-gray-100">
                    {{
                      computationResults.data?.northing_misclosure?.toFixed(
                        3
                      ) || "0.000"
                    }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Easting Misclosure:</span
                  >
                  <span class="font-mono text-gray-900 dark:text-gray-100">
                    {{
                      computationResults.data?.easting_misclosure?.toFixed(3) ||
                      "0.000"
                    }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-slate-700 p-3 rounded border">
              <h4
                class="font-medium text-green-800 dark:text-green-300 text-sm mb-2"
              >
                Traverse Summary
              </h4>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Total Distance:</span
                  >
                  <span class="font-mono text-gray-900 dark:text-gray-100">
                    {{
                      computationResults.data?.traverse?.total_distance?.toFixed(
                        2
                      ) || "0.00"
                    }}
                    m
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Correction Applied:</span
                  >
                  <span class="font-mono text-gray-900 dark:text-gray-100">
                    {{ misclosureCorrection ? "Yes" : "No" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

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

definePageMeta({ middleware: ["auth"] });

const toast = useToast();
const route = useRoute();
const projectId = route.params.id as string;

// Reactive data
const forwardRows = ref([
  {
    pointId: "",
    distance: null as number | null,
    degrees: null as number | null,
    minutes: null as number | null,
    seconds: null as number | null,
    departure: "",
    latitude: "",
    easting: null as number | null,
    northing: null as number | null,
    northingMisclosure: null as number | null,
    eastingMisclosure: null as number | null,
  },
]);

const misclosureCorrection = ref(true);
const computationResults = ref<any>(null);
const computationError = ref("");
const isComputing = ref(false);
const forwardFileInputRef = ref<HTMLInputElement | null>(null);
const showSaveModal = ref(false);
const saveModalRef = ref<any>(null);

// Computed properties
const canCompute = computed(() => {
  return forwardRows.value.some(
    (row) =>
      row.pointId &&
      row.pointId.trim() !== "" &&
      row.distance !== null &&
      row.easting !== null &&
      row.northing !== null
  );
});

// Methods
const addForwardRow = () => {
  forwardRows.value.push({
    pointId: "",
    distance: null,
    degrees: null,
    minutes: null,
    seconds: null,
    departure: "",
    latitude: "",
    easting: null,
    northing: null,
    northingMisclosure: null,
    eastingMisclosure: null,
  });
};

const deleteForwardRow = (index: number) => {
  if (forwardRows.value.length > 1) {
    forwardRows.value.splice(index, 1);
  }
};

const computeForward = async () => {
  try {
    isComputing.value = true;
    computationError.value = "";
    computationResults.value = null;

    // Find the first row with known coordinates (start point)
    const startRow = forwardRows.value.find(
      (row) =>
        row.easting !== null &&
        row.northing !== null &&
        row.pointId &&
        row.pointId.trim() !== ""
    );

    if (!startRow) {
      throw new Error(
        "Please provide at least one point with known coordinates (easting and northing)"
      );
    }

    const startPointIndex = forwardRows.value.indexOf(startRow);

    // Build coordinates array
    const coordinates: { id: string; northing: number; easting: number }[] = [];
    forwardRows.value.forEach((row) => {
      if (
        row.pointId &&
        row.pointId.trim() !== "" &&
        row.easting !== null &&
        row.northing !== null
      ) {
        const existingCoord = coordinates.find((c) => c.id === row.pointId);
        if (!existingCoord) {
          coordinates.push({
            id: row.pointId,
            northing: row.northing,
            easting: row.easting,
          });
        }
      }
    });

    // Build legs array
    const legs: any[] = [];
    const processedRows = new Set<number>();

    for (let i = startPointIndex + 1; i < forwardRows.value.length; i++) {
      const row = forwardRows.value[i];
      if (
        !row ||
        !row.pointId ||
        row.pointId.trim() === "" ||
        row.distance === null ||
        row.distance <= 0
      )
        continue;

      if (processedRows.has(i)) continue;

      let fromId = startRow.pointId;
      for (let j = i - 1; j >= 0; j--) {
        const prevRow = forwardRows.value[j];
        if (prevRow && prevRow.pointId && prevRow.pointId.trim() !== "") {
          fromId = prevRow.pointId;
          break;
        }
      }

      if (fromId) {
        legs.push({
          from: { id: fromId },
          to: { id: row.pointId },
          bearing: {
            degrees: row.degrees ?? 0,
            minutes: row.minutes ?? 0,
            seconds: row.seconds ?? 0,
          },
          distance: row.distance,
        });

        processedRows.add(i);
      }
    }

    // Handle closing leg
    const closingRowIndex = forwardRows.value.findIndex(
      (row, index) =>
        row.pointId === startRow.pointId &&
        index !== startPointIndex &&
        row.distance !== null &&
        row.distance > 0
    );

    if (closingRowIndex !== -1 && !processedRows.has(closingRowIndex)) {
      const closingRow = forwardRows.value[closingRowIndex];
      if (closingRow) {
        let lastPointId = startRow.pointId;
        for (let i = closingRowIndex - 1; i >= 0; i--) {
          const row = forwardRows.value[i];
          if (row && row.pointId && row.pointId !== startRow.pointId) {
            lastPointId = row.pointId;
            break;
          }
        }

        legs.push({
          from: { id: lastPointId },
          to: { id: startRow.pointId },
          bearing: {
            degrees: closingRow.degrees ?? 0,
            minutes: closingRow.minutes ?? 0,
            seconds: closingRow.seconds ?? 0,
          },
          distance: closingRow.distance,
        });
      }
    }

    // Prepare the payload
    const payload = {
      coordinates,
      start: {
        id: startRow.pointId,
        northing: startRow.northing,
        easting: startRow.easting,
      },
      legs,
      misclosure_correction: misclosureCorrection.value,
    };

    // Make API call
    const { $axios } = useNuxtApp();
    const response = await $axios.post(
      "/traverse/forward-computation",
      payload
    );

    computationResults.value = response.data;

    // Fill computed values back into the table
    if (response.data?.data?.computed_legs) {
      const startId = response.data?.data?.start?.id;

      response.data.data.computed_legs.forEach((computedLeg: any) => {
        const targetRow = forwardRows.value.find(
          (row) => row.pointId === computedLeg.to.id
        );
        if (targetRow) {
          const isFirstStartPoint =
            targetRow.pointId === startId &&
            forwardRows.value.findIndex((r) => r.pointId === startId) ===
              forwardRows.value.indexOf(targetRow);

          if (!isFirstStartPoint) {
            targetRow.departure = computedLeg.delta_easting.toFixed(3);
            targetRow.latitude = computedLeg.delta_northing.toFixed(3);
          }

          targetRow.easting = computedLeg.to.easting;
          targetRow.northing = computedLeg.to.northing;

          if (!isFirstStartPoint) {
            if (computedLeg.northing_misclosure !== undefined) {
              targetRow.northingMisclosure = computedLeg.northing_misclosure;
            }
            if (computedLeg.easting_misclosure !== undefined) {
              targetRow.eastingMisclosure = computedLeg.easting_misclosure;
            }
          }
        }
      });

      // Handle closing leg
      if (startId) {
        const closingLeg = response.data.data.computed_legs.find(
          (leg: any) => leg.to.id === startId && leg.from.id !== startId
        );

        if (closingLeg) {
          const closingRowIndex = forwardRows.value.findIndex(
            (row, index) => row.pointId === startId && index > 0
          );

          if (closingRowIndex !== -1) {
            const closingRow = forwardRows.value[closingRowIndex];
            if (closingRow) {
              closingRow.departure = closingLeg.delta_easting.toFixed(3);
              closingRow.latitude = closingLeg.delta_northing.toFixed(3);
              closingRow.easting = closingLeg.to.easting;
              closingRow.northing = closingLeg.to.northing;

              if (closingLeg.northing_misclosure !== undefined) {
                closingRow.northingMisclosure = closingLeg.northing_misclosure;
              }
              if (closingLeg.easting_misclosure !== undefined) {
                closingRow.eastingMisclosure = closingLeg.easting_misclosure;
              }
            }
          }
        }

        const firstStartPointIndex = forwardRows.value.findIndex(
          (row) => row.pointId === startId
        );
        if (firstStartPointIndex !== -1) {
          const firstStartPoint = forwardRows.value[firstStartPointIndex];
          if (firstStartPoint) {
            firstStartPoint.departure = "";
            firstStartPoint.latitude = "";
            if (response.data?.data?.start) {
              firstStartPoint.easting = response.data.data.start.easting;
              firstStartPoint.northing = response.data.data.start.northing;
            }
          }
        }
      }
    }

    toast.add({
      title: "Forward computation completed successfully",
      color: "success",
    });
  } catch (error: any) {
    console.error("Forward computation error:", error);
    computationError.value =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during computation";
  } finally {
    isComputing.value = false;
  }
};

// File upload methods
const triggerForwardFile = () => {
  forwardFileInputRef.value?.click();
};

const parseForwardCSV = async (input: string | ArrayBuffer | any) => {
  const rows = await parseTable(input);
  if (!rows || rows.length === 0) return [];

  const firstRow = Array.isArray(rows[0])
    ? rows[0].map((c: any) => String(c ?? "").toLowerCase()).join(" ")
    : String(rows[0] ?? "").toLowerCase();
  const hasHeader =
    /point|id|dist|deg|min|sec|departure|latitude|east|north/i.test(firstRow);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const parsedRows: any[] = [];
  for (const colsRaw of dataRows) {
    const cols = (colsRaw || []).map((c: any) => String(c ?? "").trim());
    if (cols.length < 7) continue;

    const distance = parseFloat(cols[0] || "0") || 0;
    const degrees = Math.max(0, Math.min(359, parseInt(cols[1] || "0") || 0));
    const minutes = Math.max(0, Math.min(59, parseInt(cols[2] || "0") || 0));
    const seconds = Math.max(0, Math.min(59.999999, parseFloat(cols[3] || "0") || 0));
    const easting = parseFloat(cols[4] || "0") || 0;
    const northing = parseFloat(cols[5] || "0") || 0;
    const pointId = String(cols[6] || "").trim();

    if (pointId) {
      parsedRows.push({
        pointId,
        distance,
        degrees,
        minutes,
        seconds,
        departure: "",
        latitude: "",
        easting,
        northing,
        northingMisclosure: null,
        eastingMisclosure: null,
      });
    }
  }
  return parsedRows;
};

const onForwardFile = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  try {
    if (ext === ".xls" || ext === ".xlsx") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const parsed = await parseForwardCSV(arrayBuffer);
        forwardRows.value = parsed;
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const parsed = await parseForwardCSV(text);
        forwardRows.value = parsed;
      };
      reader.readAsText(file);
    }
  } catch (err) {
    console.error("Forward file import error:", err);
    toast.add({
      title: "Failed to import file",
      color: "error",
    });
  }
};

const downloadForwardTemplate = () => {
  const csv = [
    "Distance,Degrees,Minutes,Seconds,Easting,Northing,Point ID",
    ",,,,564836.710,714206.422,A",
    "34.54,261,13,0,,,B",
    "28.75,315,45,30,,,C",
    "42.18,87,22,15,,,D",
    "15.00,180,0,0,,,A",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "forward_template.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const downloadComputationCSV = () => {
  if (!forwardRows.value || forwardRows.value.length === 0) {
    toast.add({
      title: "No computation data to download",
      color: "warning",
    });
    return;
  }

  const header =
    "Point ID,Distance(m),Degrees,Minutes,Seconds,Departure,Latitude,Easting(mE),Northing(mN)";

  const csvRows = forwardRows.value
    .filter((row) => row.pointId && row.pointId.trim() !== "")
    .map((row) => {
      const distance = row.distance !== null ? row.distance : "";
      const degrees = row.degrees !== null ? row.degrees : "";
      const minutes = row.minutes !== null ? row.minutes : "";
      const seconds = row.seconds !== null ? row.seconds : "";
      const departure = row.departure && typeof row.departure === "string" && row.departure.trim() !== "" 
        ? parseFloat(row.departure).toFixed(3)
        : row.departure || "";
      const latitude = row.latitude && typeof row.latitude === "string" && row.latitude.trim() !== ""
        ? parseFloat(row.latitude).toFixed(3)
        : row.latitude || "";
      const easting = row.easting !== null ? row.easting.toFixed(3) : "";
      const northing = row.northing !== null ? row.northing.toFixed(3) : "";

      return `${row.pointId},${distance},${degrees},${minutes},${seconds},${departure},${latitude},${easting},${northing}`;
    });

  const csvContent = [header, ...csvRows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `forward_computation_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  a.click();
  URL.revokeObjectURL(url);

  toast.add({
    title: "Computation data downloaded successfully",
    color: "success",
  });
};

const saveComputation = async (computationName: string) => {
  if (!saveModalRef.value) return;

  try {
    saveModalRef.value.setLoading(true);

    // Step 1: Create the computation plan
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

    // Step 2: Save the forward computation data
    // Find the first row with known coordinates (start point)
    const startRow = forwardRows.value.find(
      (row) =>
        row.easting !== null &&
        row.northing !== null &&
        row.pointId &&
        row.pointId.trim() !== ""
    );

    if (!startRow) {
      throw new Error("No starting point with coordinates found");
    }

    const startPointIndex = forwardRows.value.indexOf(startRow);

    // Build coordinates array
    const coordinates: { id: string; northing: number; easting: number }[] = [];
    forwardRows.value.forEach((row) => {
      if (
        row.pointId &&
        row.pointId.trim() !== "" &&
        row.easting !== null &&
        row.northing !== null
      ) {
        const existingCoord = coordinates.find((c) => c.id === row.pointId);
        if (!existingCoord) {
          coordinates.push({
            id: row.pointId,
            northing: row.northing,
            easting: row.easting,
          });
        }
      }
    });

    // Build legs array
    const legs: any[] = [];
    const processedRows = new Set<number>();

    for (let i = startPointIndex + 1; i < forwardRows.value.length; i++) {
      const row = forwardRows.value[i];
      if (
        !row ||
        !row.pointId ||
        row.pointId.trim() === "" ||
        row.distance === null ||
        row.distance <= 0
      )
        continue;

      if (processedRows.has(i)) continue;

      let fromId = startRow.pointId;
      for (let j = i - 1; j >= 0; j--) {
        const prevRow = forwardRows.value[j];
        if (prevRow && prevRow.pointId && prevRow.pointId.trim() !== "") {
          fromId = prevRow.pointId;
          break;
        }
      }

      if (fromId) {
        legs.push({
          from: { id: fromId },
          to: { id: row.pointId },
          bearing: {
            degrees: row.degrees ?? 0,
            minutes: row.minutes ?? 0,
            seconds: row.seconds ?? 0,
          },
          distance: row.distance,
        });

        processedRows.add(i);
      }
    }

    // Handle closing leg
    const closingRowIndex = forwardRows.value.findIndex(
      (row, index) =>
        row.pointId === startRow.pointId &&
        index !== startPointIndex &&
        row.distance !== null &&
        row.distance > 0
    );

    if (closingRowIndex !== -1 && !processedRows.has(closingRowIndex)) {
      const closingRow = forwardRows.value[closingRowIndex];
      if (closingRow) {
        let lastPointId = startRow.pointId;
        for (let i = closingRowIndex - 1; i >= 0; i--) {
          const row = forwardRows.value[i];
          if (row && row.pointId && row.pointId !== startRow.pointId) {
            lastPointId = row.pointId;
            break;
          }
        }

        legs.push({
          from: { id: lastPointId },
          to: { id: startRow.pointId },
          bearing: {
            degrees: closingRow.degrees ?? 0,
            minutes: closingRow.minutes ?? 0,
            seconds: closingRow.seconds ?? 0,
          },
          distance: closingRow.distance,
        });
      }
    }

    const forwardData = {
      coordinates,
      start: {
        id: startRow.pointId,
        northing: startRow.northing,
        easting: startRow.easting,
      },
      legs,
      misclosure_correction: misclosureCorrection.value,
    };

    await $axios.put(`/plan/forward-data/edit/${planId}`, forwardData);

    saveModalRef.value.close();
    toast.add({
      title: "Computation saved successfully",
      color: "success",
    });

    // Navigate to the saved computation
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
