<template>
  <UserHeader />

  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back -->
      <div class="mb-4">
        <button
          @click="navigateTo(isComputationOnly ? `/project/${projectId}/plan/${planId}` : `/project/${projectId}/plan/${planId}/edit`)"
          class="inline-flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          <RiArrowLeftLine class="w-4 h-4" />
          {{ isComputationOnly ? 'Back to Details' : 'Back to Plan Edit' }}
        </button>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Forward Computation
      </h1>

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
              :disabled="isLoading"
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
          <!-- Loading Skeleton -->
          <div v-if="isLoading" class="space-y-4">
            <div class="animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-slate-600 rounded mb-2"></div>
              <div class="space-y-2">
                <div class="h-12 bg-gray-200 dark:bg-slate-600 rounded"></div>
                <div class="h-12 bg-gray-200 dark:bg-slate-600 rounded"></div>
                <div class="h-12 bg-gray-200 dark:bg-slate-600 rounded"></div>
              </div>
            </div>
          </div>

          <!-- Actual Table -->
          <table v-else class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-700">
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Distance(m)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Degrees
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Minutes
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Seconds
                </th>
                <!-- <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[150px]"
                >
                  Departure
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[150px]"
                >
                  Latitude
                </th> -->
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[180px]"
                >
                  Easting(mE)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[180px]"
                >
                  Northing(mN)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[150px]"
                >
                  Easting Misclosure
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[150px]"
                >
                  Northing Misclosure
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Point ID
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
                    v-model.number="row.distance"
                    type="number"
                    step="0.01"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.degrees"
                    type="number"
                    min="0"
                    max="359"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.minutes"
                    type="number"
                    min="0"
                    max="59"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.seconds"
                    type="number"
                    min="0"
                    max="59"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </td>
                <!-- <td class="py-3 px-4">
                  <input
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                    :value="
                      typeof row.departure === 'number'
                        ? row.departure.toFixed(3)
                        : row.departure
                    "
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                    :value="
                      typeof row.latitude === 'number'
                        ? row.latitude.toFixed(3)
                        : row.latitude
                    "
                  />
                </td> -->
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.easting"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="0.000"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.northing"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="0.000"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                    :value="
                      row.eastingMisclosure !== null &&
                      row.eastingMisclosure !== undefined
                        ? row.eastingMisclosure.toFixed(4)
                        : ''
                    "
                    placeholder="--"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                    :value="
                      row.northingMisclosure !== null &&
                      row.northingMisclosure !== undefined
                        ? row.northingMisclosure.toFixed(4)
                        : ''
                    "
                    placeholder="--"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model="row.pointId"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="A"
                  />
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="removeTableRow(index)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    :disabled="forwardRows.length <= 1"
                  >
                    <RiDeleteBinLine class="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="forwardRows.length === 0">
                <td
                  colspan="12"
                  class="py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No coordinates added yet. Upload a file or add data manually.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add Row Button -->
        <div class="mt-4 flex justify-center">
          <button
            @click="addTableRow"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Row
          </button>
        </div>
      </div>

      <!-- Options and Actions -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input
                v-model="misclosureCorrection"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-gray-700 dark:text-gray-300"
                >Apply Misclosure Correction</span
              >
            </label>
          </div>

          <div class="flex space-x-3">
            <button
              @click="performComputation"
              :disabled="!canCompute || isComputing"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isComputing" class="flex items-center space-x-2">
                <svg
                  class="animate-spin h-4 w-4"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Computing...</span>
              </span>
              <span v-else>Compute</span>
            </button>

            <!-- Save to Coordinates Button - shown after computation -->
            <button
              v-if="computationResults"
              @click="saveToCoordinates"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Coordinates
            </button>

            <!-- Download CSV Button - shown after computation -->
            <button
              v-if="computationResults"
              @click="downloadComputationCSV"
              class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Download CSV
            </button>
          </div>
        </div>

        <!-- Error Section -->
        <div
          v-if="computationError"
          class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <h3 class="font-semibold text-red-800 dark:text-red-300 mb-2">
            Error
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
            closed and all coordinates have been computed. You can now save
            these coordinates to use in your plan.
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

          <!-- Misclosure Status -->
          <div
            class="mt-3 p-2 rounded text-xs"
            :class="
              misclosureCorrection
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
            "
          >
            <div v-if="misclosureCorrection" class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                >Misclosure correction applied - traverse is perfectly
                closed</span
              >
            </div>
            <div v-else class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Raw computation - misclosure shows measurement errors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RiArrowLeftLine, RiDeleteBinLine } from "@remixicon/vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import { ref, computed, onMounted, watch } from "vue";
import { useCoordinateTransfer } from "~/composables/useCoordinateTransfer";

interface ForwardRow {
  pointId: string;
  distance: number | null;
  degrees: number | null;
  minutes: number | null;
  seconds: number | null;
  departure: string | number | null;
  latitude: string | number | null;
  easting: number | null;
  northing: number | null;
  northingMisclosure: number | null;
  eastingMisclosure: number | null;
}

definePageMeta({ middleware: ["auth"] });

const toast = useToast();
const route = useRoute();
const projectId = route.params.id as string;
const planId = route.params.plan as string;
const isComputationOnly = ref(false);

// Reactive data for the unified table
const forwardRows = ref<ForwardRow[]>([
  {
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
  },
]);

const misclosureCorrection = ref(false);
const computationResults = ref<any>(null);
const computationError = ref("");
const isLoading = ref(true);
const isComputing = ref(false);
const forwardFileInputRef = ref<HTMLInputElement | null>(null);

// Computed properties
const canCompute = computed(() => {
  const hasValidRows =
    forwardRows.value.length > 0 &&
    forwardRows.value.some((row) => row.pointId && row.pointId.trim() !== "");

  // Find first row with valid easting and northing as start point
  const startPointRow = forwardRows.value.find(
    (row) =>
      row.easting !== null &&
      row.easting !== 0 &&
      !isNaN(row.easting) &&
      row.northing !== null &&
      row.northing !== 0 &&
      !isNaN(row.northing) &&
      row.pointId &&
      row.pointId.trim() !== ""
  );

  const hasStartPoint = !!startPointRow;

  const hasValidForwardData = forwardRows.value.some(
    (row) => row.pointId && row.distance !== null && row.distance > 0
  );

  return hasValidRows && hasStartPoint && hasValidForwardData;
});

// Fetch plan data on component mount
const fetchPlanData = async () => {
  try {
    isLoading.value = true;
    const { $axios } = useNuxtApp();
    const response = await $axios.get(`/plan/fetch/${planId}`);

    // Check if computation only
    if (response.data?.data?.computation_only === true) {
      isComputationOnly.value = true;
    }

    if (response.data?.data?.forward_computation_data) {
      const forwardData = response.data.data.forward_computation_data;

      // Handle the proper API format: coordinates + legs structure
      if (forwardData.coordinates && forwardData.legs && forwardData.start) {
        const newRows: ForwardRow[] = [];

        // Add the start point first (with coordinates but no distance/bearing)
        const startPoint = forwardData.start;
        newRows.push({
          pointId: startPoint.id,
          distance: null,
          degrees: null,
          minutes: null,
          seconds: null,
          departure: "",
          latitude: "",
          easting: startPoint.easting,
          northing: startPoint.northing,
          northingMisclosure: null,
          eastingMisclosure: null,
        });

        // Add each leg as a row with the "to" point's data
        // Only include distance and bearing - coordinates will be calculated
        forwardData.legs.forEach((leg: any) => {
          newRows.push({
            pointId: leg.to.id,
            distance: leg.distance,
            degrees: leg.bearing.degrees,
            minutes: leg.bearing.minutes,
            seconds: leg.bearing.seconds,
            departure: "", // Will be filled after computation
            latitude: "", // Will be filled after computation
            easting: null, // Will be calculated during computation
            northing: null, // Will be calculated during computation
            northingMisclosure: null,
            eastingMisclosure: null,
          });
        });

        forwardRows.value = newRows;
      }
      // Fallback: Handle old data structure if it exists
      else if (
        forwardData.traverseRows &&
        forwardData.traverseRows.length > 0
      ) {
        forwardRows.value = forwardData.traverseRows.map((row: any) => ({
          pointId: row.pointId || "",
          distance: row.distance || 0,
          degrees: row.degrees || 0,
          minutes: row.minutes || 0,
          seconds: row.seconds || 0,
          departure: row.departure || "",
          latitude: row.latitude || "",
          easting: row.easting || 0,
          northing: row.northing || 0,
          northingMisclosure: null,
          eastingMisclosure: null,
        }));
      }

      // Set misclosure correction
      if (typeof forwardData.misclosure_correction === "boolean") {
        misclosureCorrection.value = forwardData.misclosure_correction;
      }
    }
  } catch (error) {
    console.error("Failed to fetch plan data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPlanData();
});

// Methods
const addTableRow = () => {
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

const removeTableRow = (index: number) => {
  if (forwardRows.value.length > 1) {
    forwardRows.value.splice(index, 1);
  } else if (forwardRows.value.length === 1) {
    // If only one row left, clear it but keep the array with one empty item
    forwardRows.value[0] = {
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
    };
  }
};

const performComputation = async () => {
  try {
    isComputing.value = true;
    computationError.value = "";
    computationResults.value = null;

    // Find first row with valid easting and northing as start point
    const startPointIndex = forwardRows.value.findIndex(
      (row) =>
        row.easting !== null &&
        row.easting !== 0 &&
        !isNaN(row.easting) &&
        row.northing !== null &&
        row.northing !== 0 &&
        !isNaN(row.northing) &&
        row.pointId &&
        row.pointId.trim() !== ""
    );

    if (startPointIndex === -1) {
      throw new Error(
        "No valid start point found. Please ensure at least one row has valid easting and northing coordinates."
      );
    }

    const startRow = forwardRows.value[startPointIndex];
    if (
      !startRow ||
      !startRow.pointId ||
      startRow.easting === 0 ||
      startRow.northing === 0
    ) {
      throw new Error("Start point must have valid coordinates");
    }

    // Convert table data to API format
    const coordinates = forwardRows.value
      .filter(
        (row) =>
          row.pointId.trim() !== "" &&
          row.northing !== null &&
          row.northing !== 0 &&
          !isNaN(row.northing) &&
          row.easting !== null &&
          row.easting !== 0 &&
          !isNaN(row.easting)
      )
      .map((row) => ({
        id: row.pointId,
        northing: row.northing,
        easting: row.easting,
      }));

    const legs = [];
    const processedRows = new Set<number>(); // Track which rows we've processed

    for (let i = 0; i < forwardRows.value.length; i++) {
      const row = forwardRows.value[i];
      if (
        row &&
        row.pointId &&
        row.distance !== null &&
        row.distance > 0 &&
        i !== startPointIndex && // Skip the start point row
        !processedRows.has(i) // Don't process the same row twice
      ) {
        // Find the "from" point
        let fromId = "";
        if (i === startPointIndex + 1 || (startPointIndex > 0 && i === 0)) {
          // First leg after start point starts from the start point
          fromId = startRow.pointId;
        } else {
          // Subsequent legs start from previous point
          const prevRow = forwardRows.value[i - 1];
          fromId = prevRow?.pointId || startRow.pointId;
        }

        legs.push({
          from: { id: fromId },
          to: { id: row.pointId },
          bearing: {
            degrees: row.degrees,
            minutes: row.minutes,
            seconds: row.seconds,
          },
          distance: row.distance,
        });

        processedRows.add(i);
      }
    }

    // Only add closing leg if it wasn't already processed in the main loop
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
        // Find the last non-start point before the closing row
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
            degrees: closingRow.degrees,
            minutes: closingRow.minutes,
            seconds: closingRow.seconds,
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

    // Make API call to forward computation endpoint
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
          // Only fill departure and latitude if this is not the first occurrence of the start point
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

          // Add misclosure values if available, but only for non-start points
          // The first row (start point) should only contain northing and easting
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

      // Handle closed traverse - find the closing leg and update the corresponding row
      if (startId) {
        // Find the closing leg that goes back to the start point
        const closingLeg = response.data.data.computed_legs.find(
          (leg: any) => leg.to.id === startId && leg.from.id !== startId
        );

        if (closingLeg) {
          // Find the closing row (the row that represents the closing leg back to start)
          const closingRowIndex = forwardRows.value.findIndex(
            (row, index) => row.pointId === startId && index > 0 // Not the first occurrence
          );

          if (closingRowIndex !== -1) {
            const closingRow = forwardRows.value[closingRowIndex];
            if (closingRow) {
              closingRow.departure = closingLeg.delta_easting.toFixed(3);
              closingRow.latitude = closingLeg.delta_northing.toFixed(3);
              closingRow.easting = closingLeg.to.easting;
              closingRow.northing = closingLeg.to.northing;

              // Add misclosure values for the closing leg
              if (closingLeg.northing_misclosure !== undefined) {
                closingRow.northingMisclosure = closingLeg.northing_misclosure;
              }
              if (closingLeg.easting_misclosure !== undefined) {
                closingRow.eastingMisclosure = closingLeg.easting_misclosure;
              }
            }
          }
        }

        // Ensure the first start point row has no departure/latitude values
        const firstStartPointIndex = forwardRows.value.findIndex(
          (row) => row.pointId === startId
        );
        if (firstStartPointIndex !== -1) {
          const firstStartPoint = forwardRows.value[firstStartPointIndex];
          if (firstStartPoint) {
            firstStartPoint.departure = "";
            firstStartPoint.latitude = "";
            // Keep the original or computed easting/northing
            if (response.data?.data?.start) {
              firstStartPoint.easting = response.data.data.start.easting;
              firstStartPoint.northing = response.data.data.start.northing;
            }
          }
        }
      }
    }

    // Save the table data to the plan
    try {
      // Convert table data back to API format for saving
      const savePayload = {
        coordinates: coordinates, // Use the same coordinates array from computation payload
        start: {
          id: startRow.pointId,
          northing: startRow.northing,
          easting: startRow.easting,
        },
        legs: legs, // Use the same legs array from computation payload
        misclosure_correction: misclosureCorrection.value,
      };

      await $axios.put(`/plan/forward-data/edit/${planId}`, savePayload);
    } catch (saveError: any) {
      console.error("Failed to save forward computation data:", saveError);
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

// File upload methods for traverse data
const triggerForwardFile = () => {
  forwardFileInputRef.value?.click();
};

import { parseTable } from "~/composables/useSheetParser";

const parseForwardCSV = async (input: string | ArrayBuffer | any) => {
  const rows = await parseTable(input);
  if (!rows || rows.length === 0) return [];

  // Detect header
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

    const c0 = cols[0] ?? "";
    const c1 = cols[1] ?? "";
    const c2 = cols[2] ?? "";
    const c3 = cols[3] ?? "";
    const c4 = cols[4] ?? "";
    const c5 = cols[5] ?? "";
    const c6 = cols[6] ?? "";

    const distance = parseFloat(c0) || 0;
    const degrees = Math.max(0, Math.min(359, parseInt(c1) || 0));
    const minutes = Math.max(0, Math.min(59, parseInt(c2) || 0));
    const seconds = Math.max(0, Math.min(59.999999, parseFloat(c3) || 0));
    const easting = parseFloat(c4) || 0;
    const northing = parseFloat(c5) || 0;
    const pointId = String(c6).trim();

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

  // Create CSV header (excluding misclosure columns)
  const header =
    "Point ID,Distance(m),Degrees,Minutes,Seconds,Departure,Latitude,Easting(mE),Northing(mN)";

  // Convert rows to CSV format (excluding misclosure columns)
  const csvRows = forwardRows.value
    .filter((row) => row.pointId && row.pointId.trim() !== "")
    .map((row) => {
      const distance = row.distance !== null ? row.distance : "";
      const degrees = row.degrees !== null ? row.degrees : "";
      const minutes = row.minutes !== null ? row.minutes : "";
      const seconds = row.seconds !== null ? row.seconds : "";
      const departure =
        typeof row.departure === "number"
          ? row.departure.toFixed(3)
          : row.departure || "";
      const latitude =
        typeof row.latitude === "number"
          ? row.latitude.toFixed(3)
          : row.latitude || "";
      const easting = row.easting !== null ? row.easting.toFixed(3) : "";
      const northing = row.northing !== null ? row.northing.toFixed(3) : "";

      return `${row.pointId},${distance},${degrees},${minutes},${seconds},${departure},${latitude},${easting},${northing}`;
    });

  // Combine header and data
  const csvContent = [header, ...csvRows].join("\n");

  // Create and download the file
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

const saveToCoordinates = async () => {
  try {
    const ordered: {
      point: string;
      easting: number;
      northing: number;
      elevation: null;
    }[] = [];
    const seen = new Set<string>();

    let startId: string | null = null;
    if (computationResults.value?.data?.start?.id) {
      startId = computationResults.value.data.start.id;
    } else {
      const firstStartRow = forwardRows.value.find(
        (r) =>
          r.easting !== null &&
          r.northing !== null &&
          r.pointId &&
          r.pointId.trim() !== ""
      );
      if (firstStartRow) startId = firstStartRow.pointId;
    }

    const lastIndexOfStart = startId
      ? forwardRows.value.reduce(
          (acc, r, idx) => (r.pointId === startId ? idx : acc),
          -1
        )
      : -1;

    const firstIndexOfStart = startId
      ? forwardRows.value.findIndex((r) => r.pointId === startId)
      : -1;

    forwardRows.value.forEach((row, idx) => {
      if (
        row.pointId &&
        row.pointId.trim() !== "" &&
        row.easting !== null &&
        row.northing !== null &&
        !isNaN(row.easting) &&
        !isNaN(row.northing)
      ) {
        const pid = row.pointId;

        if (!seen.has(pid)) {
          ordered.push({
            point: pid,
            easting: row.easting!,
            northing: row.northing!,
            elevation: null,
          });
          seen.add(pid);
        } else {
          if (
            startId &&
            pid === startId &&
            idx === lastIndexOfStart &&
            lastIndexOfStart !== firstIndexOfStart
          ) {
            ordered.push({
              point: pid,
              easting: row.easting!,
              northing: row.northing!,
              elevation: null,
            });
          }
        }
      }
    });

    const coordinates = ordered;

    if (startId) {
      const firstIdx = coordinates.findIndex((c) => c.point === startId);
      if (firstIdx > 0) {
        const spliced = coordinates.splice(firstIdx, 1);
        const item = spliced && spliced.length ? spliced[0] : undefined;
        if (item) coordinates.unshift(item);
      }
    }
    if (coordinates.length === 0) {
      toast.add({
        title: "No computed coordinates found to save",
        color: "warning",
      });
      return;
    }

    await handleSaveCoordinates(coordinates);
  } catch (error: any) {
    console.error("Failed to save coordinates:", error);
    toast.add({
      title: "Failed to save coordinates. Please try again.",
      color: "error",
    });
  }
};

const handleSaveCoordinates = async (
  coordinates: {
    point: string;
    easting: number;
    northing: number;
    elevation: number | null;
  }[]
) => {
  try {
    const { setTransferredCoordinates } = useCoordinateTransfer();
    setTransferredCoordinates(coordinates);
    await navigateTo(
      `/project/${projectId}/plan/${planId}/edit?step=coordinates`
    );
  } catch (error: any) {
    console.error("Failed to prepare coordinate transfer:", error);
    toast.add({
      title: "Failed to prepare coordinate transfer. Please try again.",
      color: "error",
    });
  }
};
</script>
