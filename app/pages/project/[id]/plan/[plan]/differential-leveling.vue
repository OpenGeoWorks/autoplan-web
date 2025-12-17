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
        Level Reduction
      </h1>

      <!-- Differential Leveling Table -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
      >
        <!-- Method Selection -->
        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Leveling Method
          </label>
          <select
            v-model="levelingMethod"
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
          >
            <option value="height-of-instrument">Height of Instrument</option>
            <option value="rise-and-fall">Rise and Fall</option>
          </select>
        </div>

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
                Import leveling data (CSV or TXT or XLS/XLSX)
              </div>
              <div class="text-[11px] text-gray-600 dark:text-gray-400">
                Format: Station, BS, IS, FS, HI, Rise, Fall, RL
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input
              ref="levelingFileInputRef"
              type="file"
              accept=".csv,.txt,.xls,.xlsx"
              @change="onLevelingFile"
              class="hidden"
            />
            <button
              type="button"
              @click="triggerLevelingFile"
              :disabled="isLoading"
              class="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Upload File
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-700/60"
              @click="downloadLevelingTemplate"
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
                  Station
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Back Sight(m)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[150px]"
                >
                  Intermediate Sight(m)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Fore Sight(m)
                </th>
                <th
                  v-if="levelingMethod === 'height-of-instrument'"
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[150px]"
                >
                  Height of Instrument(m)
                </th>
                <th
                  v-if="levelingMethod === 'rise-and-fall'"
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Rise(m)
                </th>
                <th
                  v-if="levelingMethod === 'rise-and-fall'"
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Fall(m)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[150px]"
                >
                  Reduced Level(m)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]"
                >
                  Correction
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
                v-for="(row, index) in levelingRows"
                :key="index"
                class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td class="py-3 px-4">
                  <input
                    v-model="row.stn"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-green-500"
                    placeholder="BM"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.back_sight"
                    type="number"
                    step="0.001"
                    class="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-purple-500 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="0.000"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.intermediate_sight"
                    type="number"
                    step="0.001"
                    class="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-purple-500 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="0.000"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.fore_sight"
                    type="number"
                    step="0.001"
                    class="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-purple-500 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="0.000"
                  />
                </td>
                <td
                  v-if="levelingMethod === 'height-of-instrument'"
                  class="py-3 px-4"
                >
                  <input
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                    :value="
                      row.height_of_instrument !== null &&
                      row.height_of_instrument !== undefined
                        ? row.height_of_instrument.toFixed(3)
                        : ''
                    "
                    placeholder="--"
                  />
                </td>
                <td v-if="levelingMethod === 'rise-and-fall'" class="py-3 px-4">
                  <input
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                    :value="
                      row.rise !== null && row.rise !== undefined
                        ? row.rise.toFixed(3)
                        : ''
                    "
                    placeholder="--"
                  />
                </td>
                <td v-if="levelingMethod === 'rise-and-fall'" class="py-3 px-4">
                  <input
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                    :value="
                      row.fall !== null && row.fall !== undefined
                        ? row.fall.toFixed(3)
                        : ''
                    "
                    placeholder="--"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="row.reduced_level"
                    type="number"
                    step="0.001"
                    class="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-purple-500 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="0.000"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    type="text"
                    readonly
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                    :value="
                      row.correction !== null && row.correction !== undefined
                        ? row.correction.toFixed(4)
                        : ''
                    "
                    placeholder="--"
                  />
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="removeTableRow(index)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    :disabled="levelingRows.length <= 1"
                  >
                    <RiDeleteBinLine class="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="levelingRows.length === 0">
                <td
                  :colspan="levelingMethod === 'height-of-instrument' ? 9 : 10"
                  class="py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No leveling data added yet. Upload a file or add data
                  manually.
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
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
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

            <!-- Save to Elevation Data Button - shown after computation -->
            <button
              v-if="computationResults"
              @click="saveToElevationData"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Elevation Data
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
            Level reduction completed successfully using the
            <strong>{{
              levelingMethod === "height-of-instrument"
                ? "Height of Instrument"
                : "Rise and Fall"
            }}</strong>
            method. All reduced levels have been computed. You can now save
            these elevation data points to use in your plan.
          </p>

          <!-- Leveling Summary -->
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
                    >Misclosure:</span
                  >
                  <span class="font-mono text-gray-900 dark:text-gray-100">
                    {{
                      computationResults.data?.misclosure?.toFixed(4) ||
                      "0.0000"
                    }}
                    m
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Number of Networks:</span
                  >
                  <span class="font-mono text-gray-900 dark:text-gray-100">
                    {{ computationResults.data?.number_of_networks || "0" }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-slate-700 p-3 rounded border">
              <h4
                class="font-medium text-green-800 dark:text-green-300 text-sm mb-2"
              >
                Leveling Summary
              </h4>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Total Stations:</span
                  >
                  <span class="font-mono text-gray-900 dark:text-gray-100">
                    {{ levelingRows.length }}
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
                >Misclosure correction applied - levels are adjusted for
                closure</span
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
import { ref, computed, onMounted } from "vue";
import { useElevationTransfer } from "~/composables/useElevationTransfer";

interface LevelingRow {
  stn: string;
  back_sight: number | null;
  intermediate_sight: number | null;
  fore_sight: number | null;
  reduced_level: number | null;
  height_of_instrument: number | null;
  rise: number | null;
  fall: number | null;
  correction: number | null;
}

definePageMeta({ middleware: ["auth"] });

const toast = useToast();
const route = useRoute();
const projectId = route.params.id as string;
const planId = route.params.plan as string;
const isComputationOnly = ref(false);

// Reactive data
const levelingMethod = ref<"height-of-instrument" | "rise-and-fall">(
  "height-of-instrument"
);
const levelingRows = ref<LevelingRow[]>([
  {
    stn: "",
    back_sight: null,
    intermediate_sight: null,
    fore_sight: null,
    reduced_level: null,
    height_of_instrument: null,
    rise: null,
    fall: null,
    correction: null,
  },
]);

const misclosureCorrection = ref(true);
const computationResults = ref<any>(null);
const computationError = ref("");
const isLoading = ref(true);
const isComputing = ref(false);
const levelingFileInputRef = ref<HTMLInputElement | null>(null);

// Computed properties
const canCompute = computed(() => {
  const hasValidRows =
    levelingRows.value.length > 0 &&
    levelingRows.value.some((row) => row.stn && row.stn.trim() !== "");

  // Check for at least one station with a reduced level (benchmark)
  const hasBenchmark = levelingRows.value.some(
    (row) =>
      row.reduced_level !== null &&
      !isNaN(row.reduced_level) &&
      row.stn &&
      row.stn.trim() !== ""
  );

  // Check for at least one valid sight reading
  const hasSightReadings = levelingRows.value.some(
    (row) =>
      (row.back_sight !== null && !isNaN(row.back_sight)) ||
      (row.fore_sight !== null && !isNaN(row.fore_sight)) ||
      (row.intermediate_sight !== null && !isNaN(row.intermediate_sight))
  );

  return hasValidRows && hasBenchmark && hasSightReadings;
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

    if (response.data?.data?.differential_leveling_data) {
      const levelingData = response.data.data.differential_leveling_data;

      // Restore method
      if (levelingData.method) {
        levelingMethod.value = levelingData.method;
      }

      // Restore stations - only restore input fields, computed fields will be null
      if (levelingData.stations && levelingData.stations.length > 0) {
        levelingRows.value = levelingData.stations.map((station: any) => ({
          stn: station.stn || "",
          back_sight: station.back_sight ?? null,
          intermediate_sight: station.intermediate_sight ?? null,
          fore_sight: station.fore_sight ?? null,
          reduced_level: station.reduced_level ?? null,
          // Computed fields - initialize as null, will be filled after computation
          height_of_instrument: null,
          rise: null,
          fall: null,
          correction: null,
        }));
      }

      // Set misclosure correction
      if (typeof levelingData.misclosure_correction === "boolean") {
        misclosureCorrection.value = levelingData.misclosure_correction;
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
  levelingRows.value.push({
    stn: "",
    back_sight: null,
    intermediate_sight: null,
    fore_sight: null,
    reduced_level: null,
    height_of_instrument: null,
    rise: null,
    fall: null,
    correction: null,
  });
};

const removeTableRow = (index: number) => {
  if (levelingRows.value.length > 1) {
    levelingRows.value.splice(index, 1);
  } else if (levelingRows.value.length === 1) {
    // If only one row left, clear it but keep the array with one empty item
    levelingRows.value[0] = {
      stn: "",
      back_sight: null,
      intermediate_sight: null,
      fore_sight: null,
      reduced_level: null,
      height_of_instrument: null,
      rise: null,
      fall: null,
      correction: null,
    };
  }
};

const performComputation = async () => {
  try {
    isComputing.value = true;
    computationError.value = "";
    computationResults.value = null;

    // Prepare stations array for API
    const stations = levelingRows.value
      .filter((row) => row.stn && row.stn.trim() !== "")
      .map((row) => {
        const station: any = {
          stn: row.stn,
        };

        // Only include non-null values
        if (row.back_sight !== null && !isNaN(row.back_sight)) {
          station.back_sight = row.back_sight;
        }
        if (row.intermediate_sight !== null && !isNaN(row.intermediate_sight)) {
          station.intermediate_sight = row.intermediate_sight;
        }
        if (row.fore_sight !== null && !isNaN(row.fore_sight)) {
          station.fore_sight = row.fore_sight;
        }
        if (row.reduced_level !== null && !isNaN(row.reduced_level)) {
          station.reduced_level = row.reduced_level;
        }

        return station;
      });

    if (stations.length === 0) {
      throw new Error("No valid stations found. Please add station data.");
    }

    // Prepare the payload
    const payload = {
      method: levelingMethod.value,
      misclosure_correction: misclosureCorrection.value,
      stations: stations,
    };

    // Make API call to differential leveling endpoint
    const { $axios } = useNuxtApp();
    const response = await $axios.post("/leveling/differential", payload);

    computationResults.value = response.data;

    // Fill computed values back into the table
    if (response.data?.data?.stations) {
      response.data.data.stations.forEach(
        (computedStation: any, index: number) => {
          if (levelingRows.value[index]) {
            const row = levelingRows.value[index];

            // Update computed fields
            if (computedStation.reduced_level !== undefined) {
              row.reduced_level = computedStation.reduced_level;
            }

            if (levelingMethod.value === "height-of-instrument") {
              if (computedStation.height_of_instrument !== undefined) {
                row.height_of_instrument = computedStation.height_of_instrument;
              }
            } else if (levelingMethod.value === "rise-and-fall") {
              if (computedStation.rise !== undefined) {
                row.rise = computedStation.rise;
              }
              if (computedStation.fall !== undefined) {
                row.fall = computedStation.fall;
              }
            }

            if (computedStation.correction !== undefined) {
              row.correction = computedStation.correction;
            }
          }
        }
      );
    }

    // Save the table data to the plan
    try {
      const savePayload = {
        method: levelingMethod.value,
        misclosure_correction: misclosureCorrection.value,
        stations: levelingRows.value
          .filter((row) => row.stn && row.stn.trim() !== "")
          .map((row) => {
            const station: any = {
              stn: row.stn,
            };

            // Only include input fields, not computed fields
            if (row.back_sight !== null && !isNaN(row.back_sight)) {
              station.back_sight = row.back_sight;
            }
            if (
              row.intermediate_sight !== null &&
              !isNaN(row.intermediate_sight)
            ) {
              station.intermediate_sight = row.intermediate_sight;
            }
            if (row.fore_sight !== null && !isNaN(row.fore_sight)) {
              station.fore_sight = row.fore_sight;
            }
            if (row.reduced_level !== null && !isNaN(row.reduced_level)) {
              station.reduced_level = row.reduced_level;
            }

            // Don't include computed fields: height_of_instrument, rise, fall, correction

            return station;
          }),
      };

      await $axios.put(
        `/plan/differential-leveling-data/edit/${planId}`,
        savePayload
      );
    } catch (saveError: any) {
      console.error("Failed to save differential leveling data:", saveError);
    }

    toast.add({
      title: "Differential leveling computation completed successfully",
      color: "success",
    });
  } catch (error: any) {
    console.error("Differential leveling computation error:", error);
    computationError.value =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during computation";
  } finally {
    isComputing.value = false;
  }
};

// File upload methods
const triggerLevelingFile = () => {
  levelingFileInputRef.value?.click();
};

import { parseTable } from "~/composables/useSheetParser";

const parseLevelingCSV = async (input: string | ArrayBuffer | any) => {
  const rows = await parseTable(input);
  if (!rows || rows.length === 0) return [];

  // Detect header
  const firstRow = Array.isArray(rows[0])
    ? rows[0].map((c: any) => String(c ?? "").toLowerCase()).join(" ")
    : String(rows[0] ?? "").toLowerCase();
  const hasHeader =
    /station|stn|back|fore|intermediate|sight|reduced|level/i.test(firstRow);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const parsedRows: any[] = [];
  for (const colsRaw of dataRows) {
    const cols = (colsRaw || []).map((c: any) => String(c ?? "").trim());
    if (cols.length < 5) continue;

    const stn = String(cols[0] ?? "").trim();
    const back_sight = cols[1] ? parseFloat(cols[1]) : null;
    const intermediate_sight = cols[2] ? parseFloat(cols[2]) : null;
    const fore_sight = cols[3] ? parseFloat(cols[3]) : null;

    let reduced_level = null;
    if (cols.length === 5) {
      // Simple 5-column format: Station, BS, IS, FS, RL
      reduced_level = cols[4] ? parseFloat(cols[4]) : null;
    } else if (cols.length === 8) {
      // Standard 8-column format: Station, BS, IS, FS, HI, Rise, Fall, RL
      // RL is at index 7
      reduced_level = cols[7] ? parseFloat(cols[7]) : null;
    } else if (cols.length >= 7) {
      // Variable length format - search for RL from the end
      // Skip empty computed columns and find the last non-empty numeric value
      for (let i = cols.length - 1; i >= 4; i--) {
        const col = cols[i];
        if (col && col.trim() !== "") {
          const val = parseFloat(col);
          if (!isNaN(val)) {
            reduced_level = val;
            break;
          }
        }
      }

      // If not found in later columns, check column 4
      if (reduced_level === null && cols[4]) {
        const val = parseFloat(cols[4]);
        if (!isNaN(val)) {
          reduced_level = val;
        }
      }
    }

    if (stn) {
      parsedRows.push({
        stn,
        back_sight:
          back_sight !== null && !isNaN(back_sight) ? back_sight : null,
        intermediate_sight:
          intermediate_sight !== null && !isNaN(intermediate_sight)
            ? intermediate_sight
            : null,
        fore_sight:
          fore_sight !== null && !isNaN(fore_sight) ? fore_sight : null,
        reduced_level:
          reduced_level !== null && !isNaN(reduced_level)
            ? reduced_level
            : null,
        height_of_instrument: null,
        rise: null,
        fall: null,
        correction: null,
      });
    }
  }
  return parsedRows;
};

const onLevelingFile = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  try {
    if (ext === ".xls" || ext === ".xlsx") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const parsed = await parseLevelingCSV(arrayBuffer);
        if (parsed.length > 0) {
          levelingRows.value = parsed;
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const parsed = await parseLevelingCSV(text);
        if (parsed.length > 0) {
          levelingRows.value = parsed;
        }
      };
      reader.readAsText(file);
    }
  } catch (err) {
    console.error("Leveling file import error:", err);
  }
};

const downloadLevelingTemplate = () => {
  const csv = [
    "Station,Back Sight,Intermediate Sight,Fore Sight,HI,Rise,Fall,Reduced Level",
    "UNILAG 01,0.93,,,,,,1.429",
    "UNILAG 02,,1.78,,,,,",
    "PT 01,1.27,,0.892,,,,",
    "PT 02,1.64,,1.379,,,,",
    "PT 03,1.31,,1.86,,,,",
    "PT 04,3.33,,0.95,,,,",
    "PT 05,2.758,,0.169,,,,",
    "GME 06,0.616,,0.32,,,,",
    "PT 06,2.288,,0.5,,,,",
    "GME 05,,1.345,,,,,",
    "GME 04,0.95,,1.146,,,,",
    "GME 05,0.893,,1.155,,,,",
    "GME 06,,1.955,,,,,",
    "PT 07,0.246,,3.143,,,,",
    "PT 08,0.838,,3.871,,,,",
    "PT 09,1.831,,1.602,,,,",
    "PT 10,1.83,,2.015,,,,",
    "PT 11,1.069,,1.5,,,,",
    "UNILAG 02,,1.21,,,,,",
    "UNILAG 01,,,1.198,,,,1.429",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "differential_leveling_template.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const downloadComputationCSV = () => {
  if (!levelingRows.value || levelingRows.value.length === 0) {
    toast.add({
      title: "No computation data to download",
      color: "warning",
    });
    return;
  }

  // Create CSV header based on method
  let header = "Station,Back Sight(m),Intermediate Sight(m),Fore Sight(m),";
  if (levelingMethod.value === "height-of-instrument") {
    header += "Height of Instrument(m),";
  } else {
    header += "Rise(m),Fall(m),";
  }
  header += "Reduced Level(m),Correction";

  // Convert rows to CSV format
  const csvRows = levelingRows.value
    .filter((row) => row.stn && row.stn.trim() !== "")
    .map((row) => {
      const back_sight = row.back_sight !== null ? row.back_sight : "";
      const intermediate_sight =
        row.intermediate_sight !== null ? row.intermediate_sight : "";
      const fore_sight = row.fore_sight !== null ? row.fore_sight : "";
      const reduced_level =
        row.reduced_level !== null ? row.reduced_level.toFixed(3) : "";
      const correction =
        row.correction !== null ? row.correction.toFixed(4) : "";

      let methodSpecific = "";
      if (levelingMethod.value === "height-of-instrument") {
        const hoi =
          row.height_of_instrument !== null
            ? row.height_of_instrument.toFixed(3)
            : "";
        methodSpecific = hoi;
      } else {
        const rise = row.rise !== null ? row.rise.toFixed(3) : "";
        const fall = row.fall !== null ? row.fall.toFixed(3) : "";
        methodSpecific = `${rise},${fall}`;
      }

      return `${row.stn},${back_sight},${intermediate_sight},${fore_sight},${methodSpecific},${reduced_level},${correction}`;
    });

  // Combine header and data
  const csvContent = [header, ...csvRows].join("\n");

  // Create and download the file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `differential_leveling_${levelingMethod.value}_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  a.click();
  URL.revokeObjectURL(url);

  toast.add({
    title: "Computation data downloaded successfully",
    color: "success",
  });
};

const saveToElevationData = async () => {
  try {
    // Extract elevation data from computed results
    const elevations: {
      point: string;
      elevation: number;
    }[] = [];

    levelingRows.value.forEach((row) => {
      if (
        row.stn &&
        row.stn.trim() !== "" &&
        row.reduced_level !== null &&
        !isNaN(row.reduced_level)
      ) {
        elevations.push({
          point: row.stn,
          elevation: row.reduced_level,
        });
      }
    });

    if (elevations.length === 0) {
      toast.add({
        title: "No computed elevation data found to save",
        color: "warning",
      });
      return;
    }

    // Use the elevation transfer composable
    const { setTransferredElevations } = useElevationTransfer();
    setTransferredElevations(elevations);

    toast.add({
      title: `${elevations.length} elevation points computed successfully`,
      description: "Returning to plan edit page",
      color: "success",
    });

    await navigateTo(
      `/project/${projectId}/plan/${planId}/edit?step=elevation`
    );
  } catch (error: any) {
    console.error("Failed to save elevation data:", error);
    toast.add({
      title: "Failed to prepare elevation data. Please try again.",
      color: "error",
    });
  }
};
</script>
