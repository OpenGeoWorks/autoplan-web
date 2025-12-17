<template>
  <UserHeader />

  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 pb-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
        Traverse Computation
      </h1>

      <!-- Known Coordinates Table -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Known Coordinates
          </h2>
          <button
            @click="addCoordinate"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add Point
          </button>
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
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Point ID
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Northing(mN)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Easting(mE)
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
                v-for="(coord, index) in coordinates"
                :key="index"
                class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td class="py-3 px-4">
                  <input
                    v-model="coord.id"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="KG|21"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="coord.northing"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="860071.644"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="coord.easting"
                    type="number"
                    step="0.001"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="599935.185"
                  />
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="removeCoordinate(index)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <RiDeleteBinLine class="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="coordinates.length === 0">
                <td
                  colspan="4"
                  class="py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No coordinates added yet. Click "Add Point" to start.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Observed Angle and Distance Table -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Observed Angle and Distance
          </h2>
          <div class="flex items-center space-x-3">
            <button
              @click="addLeg"
              :disabled="isLoading"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Add Leg
            </button>
          </div>
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
                Import observed angle & distance data (CSV or TXT or XLS/XLSX)
              </div>
              <div class="text-[11px] text-gray-600 dark:text-gray-400">
                Columns: From, To, Degrees, Minutes, Seconds, Distance(m)
              </div>
              <div class="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                Supports comma, tab, or space separated files with optional
                headers
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input
              ref="angleFileInputRef"
              type="file"
              accept=".csv,.txt,.xls,.xlsx"
              @change="onAngleFile"
              class="hidden"
            />
            <button
              type="button"
              @click="triggerAngleFile"
              :disabled="isLoading"
              class="px-3 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Upload File
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs rounded border border-green-300 text-green-700 hover:bg-green-50 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-700/60"
              @click="downloadAngleTemplate"
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
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  From
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Observed Angle(°)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Minutes(')
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Seconds(")
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  Distance(m)
                </th>
                <th
                  class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  To
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
                v-for="(leg, index) in legs"
                :key="index"
                class="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td class="py-3 px-4">
                  <input
                    v-model="leg.from.id"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="KG|22"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="leg.observed_angle.degrees"
                    type="number"
                    min="0"
                    max="359"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="232"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="leg.observed_angle.minutes"
                    type="number"
                    min="0"
                    max="59"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="41"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="leg.observed_angle.seconds"
                    type="number"
                    min="0"
                    max="59"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="7"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model.number="leg.distance"
                    type="number"
                    step="0.01"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="204.192"
                  />
                </td>
                <td class="py-3 px-4">
                  <input
                    v-model="leg.to.id"
                    type="text"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                    placeholder="PT1"
                  />
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="removeLeg(index)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <RiDeleteBinLine class="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="legs.length === 0">
                <td
                  colspan="7"
                  class="py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No legs added yet. Click "Add Leg" to start.
                </td>
              </tr>
            </tbody>
          </table>
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
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Computing...</span>
              </span>
              <span v-else>Compute</span>
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
      </div>
    </div>
  </div>

  <!-- Results Modal -->
  <TraverseComputationResultsModal
    :show="showResultsModal"
    :results="computationResults?.data || null"
    @close="closeModal"
    @save-coordinates="handleSaveCoordinates"
  />
</template>

<script lang="ts" setup>
import { RiArrowLeftLine, RiDeleteBinLine } from "@remixicon/vue";
import { useRoute } from "vue-router";
import { navigateTo } from "#imports";
import { ref, computed, onMounted } from "vue";
import TraverseComputationResultsModal from "~/components/TraverseComputationResultsModal.vue";
import { useCoordinateTransfer } from "~/composables/useCoordinateTransfer";
import { parseTable } from "~/composables/useSheetParser";

definePageMeta({ middleware: ["auth"] });

const toast = useToast();
const route = useRoute();
const projectId = route.params.id as string;
const planId = route.params.plan as string;
const isComputationOnly = ref(false);

// Reactive data
const coordinates = ref([
  {
    id: "",
    northing: 0,
    easting: 0,
  },
]);

const legs = ref([
  {
    from: { id: "" },
    to: { id: "" },
    observed_angle: {
      degrees: 0,
      minutes: 0,
      seconds: 0,
    },
    distance: 0,
  },
]);

const misclosureCorrection = ref(true);
const computationResults = ref<any>(null);
const computationError = ref("");
const showResultsModal = ref(false);
const isLoading = ref(true);
const isComputing = ref(false);
const angleFileInputRef = ref<HTMLInputElement | null>(null);

// Computed properties
const canCompute = computed(() => {
  const hasValidCoordinates =
    coordinates.value.length > 0 &&
    coordinates.value.some((coord) => coord.id && coord.id.trim() !== "");
  const hasValidLegs =
    legs.value.length > 0 &&
    legs.value.some((leg) => leg.from.id && leg.to.id && leg.distance > 0);

  return hasValidCoordinates && hasValidLegs;
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

    if (response.data?.data?.traverse_computation_data) {
      const traverseData = response.data.data.traverse_computation_data;

      // Populate coordinates
      if (traverseData.coordinates && traverseData.coordinates.length > 0) {
        coordinates.value = traverseData.coordinates.map((coord: any) => ({
          id: coord.id,
          northing: coord.northing,
          easting: coord.easting,
        }));
      }

      // Populate legs
      if (traverseData.legs && traverseData.legs.length > 0) {
        legs.value = traverseData.legs.map((leg: any) => ({
          from: { id: leg.from.id },
          to: { id: leg.to.id },
          observed_angle: {
            degrees: leg.observed_angle.degrees,
            minutes: leg.observed_angle.minutes,
            seconds: leg.observed_angle.seconds,
          },
          distance: leg.distance,
        }));
      }

      // Set misclosure correction
      if (typeof traverseData.misclosure_correction === "boolean") {
        misclosureCorrection.value = traverseData.misclosure_correction;
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
const addCoordinate = () => {
  coordinates.value.push({
    id: "",
    northing: 0,
    easting: 0,
  });
};

const removeCoordinate = (index: number) => {
  if (coordinates.value.length > 1) {
    coordinates.value.splice(index, 1);
  } else if (coordinates.value.length === 1) {
    // If only one coordinate left, clear it but keep the array with one empty item
    coordinates.value[0] = { id: "", northing: 0, easting: 0 };
  }
};

const addLeg = () => {
  const previousLeg = legs.value[legs.value.length - 1];
  const fromId = previousLeg && previousLeg.to.id ? previousLeg.to.id : "";

  legs.value.push({
    from: { id: fromId },
    to: { id: "" },
    observed_angle: {
      degrees: 0,
      minutes: 0,
      seconds: 0,
    },
    distance: 0,
  });
};

const removeLeg = (index: number) => {
  if (legs.value.length > 1) {
    legs.value.splice(index, 1);
  }
};

const closeModal = () => {
  showResultsModal.value = false;
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

    // Determine startId: prefer computation results, otherwise use first known coordinate
    let startId: string | null = null;
    if (computationResults.value?.data?.start?.id) {
      startId = computationResults.value.data.start.id;
    } else if (
      computationResults.value?.data?.traverse_legs &&
      computationResults.value.data.traverse_legs.length
    ) {
      startId = computationResults.value.data.traverse_legs[0].from?.id || null;
    } else if (coordinates && coordinates.length) {
      // Fallback to first coordinate in the provided list (param is an array)
      const first = coordinates[0];
      startId = first ? first.point || (first as any).id || null : null;
    } else if (
      Array.isArray((globalThis as any).coordinates) &&
      (globalThis as any).coordinates.length
    ) {
      // Last-resort: try to read the page-level `coordinates` ref (unlikely needed)
      // @ts-ignore
      startId = (globalThis as any).coordinates[0]?.id || null;
    }

    // Try to obtain the start coordinate's numeric values from computationResults (preferred)
    let startCoord: {
      point: string;
      easting: number;
      northing: number;
      elevation: null;
    } | null = null;
    if (computationResults.value?.data?.traverse_legs && startId) {
      const fromLeg = computationResults.value.data.traverse_legs.find(
        (leg: any) => leg.from?.id === startId
      );
      if (
        fromLeg &&
        fromLeg.from &&
        fromLeg.from.easting !== undefined &&
        fromLeg.from.northing !== undefined
      ) {
        startCoord = {
          point: fromLeg.from.id,
          easting: fromLeg.from.easting,
          northing: fromLeg.from.northing,
          elevation: null,
        };
      }
    }

    // If startCoord not found in results, try to find it from page-level coordinates
    if (!startCoord && startId) {
      // Try to find start in the page-level `coordinates` ref declared above
      const pageCoord = coordinatesListFind(startId);
      if (pageCoord) {
        startCoord = {
          point: pageCoord.id,
          easting: pageCoord.easting,
          northing: pageCoord.northing,
          elevation: null,
        };
      }
    }

    // helper to search the page-level coordinates ref
    function coordinatesListFind(pid: string) {
      try {
        // `coordinates` is the page-level ref declared at top of this file
        // @ts-ignore
        const list = Array.isArray((globalThis as any)._page_coordinates_cache)
          ? (globalThis as any)._page_coordinates_cache
          : null;
        // Fallback: directly use the local `coordinates` ref variable
        // @ts-ignore
        const localList =
          typeof coordinates !== "undefined" ? coordinates : null;
        const searchList =
          localList && Array.isArray(localList) ? localList : list || [];
        return (
          searchList.find((r: any) => r.id === pid || r.point === pid) || null
        );
      } catch (e) {
        return null;
      }
    }

    // Build combined list: start (if found) + provided coordinates (which are leg.to from modal)
    const combined: {
      point: string;
      easting: number;
      northing: number;
      elevation: number | null;
    }[] = [];
    if (startCoord) combined.push(startCoord);
    combined.push(
      ...coordinates.map((c) => ({
        point: c.point,
        easting: c.easting,
        northing: c.northing,
        elevation: c.elevation,
      }))
    );

    // Deduplicate but allow closing duplicate when first == last (preserve the closing duplicate)
    const ordered: {
      point: string;
      easting: number;
      northing: number;
      elevation: number | null;
    }[] = [];
    const seen = new Set<string>();
    const lastIndexOfStart = startId
      ? combined.reduce((acc, r, idx) => (r.point === startId ? idx : acc), -1)
      : -1;
    const firstIndexOfStart = startId
      ? combined.findIndex((r) => r.point === startId)
      : -1;

    combined.forEach((r, idx) => {
      const pid = r.point;
      if (!seen.has(pid)) {
        ordered.push(r);
        seen.add(pid);
      } else {
        if (
          startId &&
          pid === startId &&
          idx === lastIndexOfStart &&
          lastIndexOfStart !== firstIndexOfStart
        ) {
          ordered.push(r);
        }
      }
    });

    if (ordered.length === 0) {
      toast.add({
        title: "No computed coordinates found to save",
        color: "warning",
      });
      return;
    }

    // Store coordinates in the composable
    setTransferredCoordinates(
      ordered.map((r) => ({
        point: r.point,
        easting: r.easting,
        northing: r.northing,
        elevation: r.elevation,
      }))
    );

    // Redirect to the edit page with coordinates step
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

const performComputation = async () => {
  try {
    isComputing.value = true;
    computationError.value = "";
    computationResults.value = null;

    // Prepare the payload
    const payload = {
      coordinates: coordinates.value,
      legs: legs.value,
      misclosure_correction: misclosureCorrection.value,
    };

    // Make API call to traverse computation endpoint
    const { $axios } = useNuxtApp();
    const response = await $axios.post(
      "/traverse/traverse-computation",
      payload
    );

    computationResults.value = response.data;

    // Save the traverse computation data to the plan
    try {
      await $axios.put(`/plan/traverse-data/edit/${planId}`, payload);
    } catch (saveError: any) {
      console.error("Failed to save traverse computation data:", saveError);
      // Note: We don't show this error to the user as the computation was successful
      // The data is just not saved to the plan, but the results are still shown
    }

    showResultsModal.value = true; // Show the modal instead of just storing results
  } catch (error: any) {
    console.error("Traverse computation error:", error);
    computationError.value =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during computation";
  } finally {
    isComputing.value = false;
  }
};

// File upload methods for observed angle and distance data
const triggerAngleFile = () => {
  angleFileInputRef.value?.click();
};

const parseAngleCSV = async (input: string | ArrayBuffer | any) => {
  // Use shared parseTable to obtain rows (array of arrays)
  const rows = await parseTable(input);
  if (!rows || rows.length === 0) return [];

  const firstRow = Array.isArray(rows[0])
    ? rows[0].map((c: any) => String(c ?? "").toLowerCase()).join(" ")
    : String(rows[0] ?? "").toLowerCase();
  const hasHeader = /from|to|deg|min|sec|dist|angle|point/i.test(firstRow);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const parsedLegs: any[] = [];
  for (const row of dataRows) {
    const cols = (row || []).map((c: any) => String(c ?? "").trim());
    if (cols.length < 5) continue;

    const fromId = cols[0];
    const toId = cols[1];

    const degrees = parseInt(String(cols[2] ?? "0")) || 0;
    const validDegrees = Math.max(0, Math.min(359, degrees));

    const minutes = parseInt(String(cols[3] ?? "0")) || 0;
    const validMinutes = Math.max(0, Math.min(59, minutes));

    const seconds = parseFloat(String(cols[4] ?? "0")) || 0;
    const validSeconds = Math.max(0, Math.min(59.999999, seconds));

    const distance = cols[5] ? parseFloat(String(cols[5])) || 0 : 0;
    const validDistance = Math.max(0, distance);

    if (fromId && toId) {
      parsedLegs.push({
        from: { id: fromId },
        to: { id: toId },
        observed_angle: {
          degrees: validDegrees,
          minutes: validMinutes,
          seconds: validSeconds,
        },
        distance: validDistance,
      });
    }
  }

  return parsedLegs;
};

const onAngleFile = (ev: Event) => {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const allowedTypes = [".csv", ".txt", ".xls", ".xlsx"];
  const fileExtension = "." + (file.name.split(".").pop() || "").toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    toast.add({
      title: "Invalid file type. Please upload CSV, TXT or Excel.",
      color: "error",
    });
    if (angleFileInputRef.value) angleFileInputRef.value.value = "";
    return;
  }

  // Use FileReader then parse with shared parseAngleCSV (which uses parseTable)
  if (fileExtension === ".xls" || fileExtension === ".xlsx") {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const parsedLegs = await parseAngleCSV(arrayBuffer);
        if (parsedLegs.length) {
          legs.value = parsedLegs;
          toast.add({
            title: `Successfully imported ${parsedLegs.length} observed angle and distance entries from Excel`,
            color: "success",
          });
        } else {
          toast.add({
            title:
              "No valid data found in the Excel file. Please check the format and try again.",
            color: "warning",
          });
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        toast.add({
          title:
            "Error reading Excel file. Please check the file and try again.",
          color: "error",
        });
      } finally {
        if (angleFileInputRef.value) angleFileInputRef.value.value = "";
      }
    };
    reader.onerror = () => {
      toast.add({
        title: "Failed to read the file. Please try again.",
        color: "error",
      });
      if (angleFileInputRef.value) angleFileInputRef.value.value = "";
    };
    reader.readAsArrayBuffer(file);
  } else {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = String(reader.result || "");
        const parsedLegs = await parseAngleCSV(text);
        if (parsedLegs.length) {
          legs.value = parsedLegs;
          toast.add({
            title: `Successfully imported ${parsedLegs.length} observed angle and distance entries`,
            color: "success",
          });
        } else {
          toast.add({
            title:
              "No valid data found in the file. Please check the format and try again.",
            color: "warning",
          });
        }
      } catch (error) {
        console.error("Error reading file:", error);
        toast.add({
          title:
            "Error reading file. Please check the file format and try again.",
          color: "error",
        });
      } finally {
        if (angleFileInputRef.value) angleFileInputRef.value.value = "";
      }
    };
    reader.onerror = () => {
      toast.add({
        title: "Failed to read the file. Please try again.",
        color: "error",
      });
      if (angleFileInputRef.value) angleFileInputRef.value.value = "";
    };
    reader.readAsText(file);
  }
};

const downloadAngleTemplate = () => {
  const csv = [
    "From,To,Degrees,Minutes,Seconds,Distance",
    "KG|22,PT1,232,41,7,204.192",
    "PT1,PT2,165,20,43,119.950",
    "PT2,PT3,280,0,47,208.951",
    "PT3,PT4,281,30,31,249.537",
    "PT4,KG|21,188,43,49,173.164",
    "KG|21,KG|22,291,42,51,",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "observed_angle_distance_template.csv";
  a.click();
  URL.revokeObjectURL(url);
};
</script>
